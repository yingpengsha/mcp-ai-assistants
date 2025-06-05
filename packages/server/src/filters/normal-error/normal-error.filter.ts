import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'

import { loggerInstance } from '@/tools/winston'
import { isString } from '@/tools/type'

@Catch(Error)
export class NormalErrorFilter implements ExceptionFilter {
  private readonly logger = loggerInstance
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp() // 获取请求上下文
    const response = ctx.getResponse() // 获取请求上下文中的 response对象

    // 设置错误信息
    this.logger.error('[Error]', exception)

    let message = 'Service Error'
    if (
      'message' in exception
      && isString(exception.message)
      && exception.message
    ) {
      message = exception.message
    }

    const errorResponse: Service.StandardJSONResponseWrapper = {
      data: {},
      message,
      code: 0,
    }

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(200)
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}
