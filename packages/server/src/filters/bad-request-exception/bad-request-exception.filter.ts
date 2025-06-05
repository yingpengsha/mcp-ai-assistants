import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { loggerInstance } from '@/tools/winston'

// 定义 class-validator 异常响应的类型
interface ValidationExceptionResponse {
  message?: string | string[]
  error?: string
  statusCode?: number
  [key: string]: unknown
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter
implements ExceptionFilter<BadRequestException> {
  private readonly logger = loggerInstance

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp()
    const response = ctx.getResponse()

    const detailedMessage = this.extractErrorMessage(exception)

    this.logger.error('[BadRequestException]', {
      message: detailedMessage,
      path: ctx.getRequest().url,
    })

    const errorResponse: Service.StandardJSONResponseWrapper = {
      data: {},
      message: detailedMessage,
      code: 0,
    }

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse)
  }

  /**
   * 从异常中提取详细的错误信息
   */
  private extractErrorMessage(exception: BadRequestException): string {
    const exceptionResponse = exception.getResponse()

    // 1. 处理对象类型的响应（class-validator 的标准格式）
    if (this.isValidationResponse(exceptionResponse)) {
      return this.handleValidationResponse(exceptionResponse)
    }

    // 2. 处理字符串类型的响应
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse
    }

    // 3. 回退到处理 exception.message
    return this.handleExceptionMessage(exception.message)
  }

  /**
   * 检查是否为验证响应对象
   */
  private isValidationResponse(response: unknown): response is ValidationExceptionResponse {
    return typeof response === 'object' && response !== null
  }

  /**
   * 处理验证响应对象
   */
  private handleValidationResponse(response: ValidationExceptionResponse): string {
    if (!response.message) {
      return JSON.stringify(response)
    }

    if (Array.isArray(response.message)) {
      // class-validator 返回的错误数组，用分号连接
      return response.message.join('; ')
    }

    if (typeof response.message === 'string') {
      return response.message
    }

    return 'Input validation failed or an otherwise malformed request was received.'
  }

  /**
   * 处理异常的 message 属性
   */
  private handleExceptionMessage(message: unknown): string {
    if (Array.isArray(message)) {
      return message.join('; ')
    }

    if (typeof message === 'string') {
      return message
    }

    return 'Input validation failed or an otherwise malformed request was received.'
  }
}
