import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

import { loggerInstance } from '@/tools/winston'

@Catch(HttpException)
export class HttpExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter {
  private readonly logger = loggerInstance
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp() // 获取请求上下文
    const response = ctx.getResponse() // 获取请求上下文中的 response对象
    const status = exception.getStatus() // 获取异常状态码

    // 设置错误信息
    this.logger.error('[HttpException]', exception)
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`
    const errorResponse: Service.StandardJSONResponseWrapper = {
      data: {},
      message: message,
      code: 0,
    }

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status)
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}
