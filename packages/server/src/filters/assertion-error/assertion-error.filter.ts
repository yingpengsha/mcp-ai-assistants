import { loggerInstance } from '@/tools/winston'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { AssertionError } from 'assert'

@Catch(AssertionError)
export class AssertionErrorFilter
  extends BaseExceptionFilter
  implements ExceptionFilter {
  private readonly logger = loggerInstance

  catch(exception: AssertionError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    this.logger.error('[AssertionError]', exception)

    const errorResponse: Service.StandardJSONResponseWrapper = {
      code: 0,
      data: {},
      message: exception.message,
    }

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse)
  }
}
