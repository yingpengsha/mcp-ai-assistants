import {
  CallHandler,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { SetMetadata } from '@nestjs/common'

const SKIP_STANDARD_JSON_RESPONSE_WRAPPER_KEY
  = 'SKIP_STANDARD_JSON_RESPONSE_WRAPPER_KEY'
export const SkipStandardJSONResponseWrapper = (): CustomDecorator<string> =>
  SetMetadata(SKIP_STANDARD_JSON_RESPONSE_WRAPPER_KEY, true)

@Injectable()
export class StandardJSONResponseWrapperInterceptor implements NestInterceptor {
  private isSkipWrapper(context: ExecutionContext): boolean {
    const handler = context.getHandler()
    const skipWrapper = Reflect.getMetadata(
      SKIP_STANDARD_JSON_RESPONSE_WRAPPER_KEY,
      handler,
    ) // 获取路由上的装饰器元数据
    return skipWrapper === true
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Service.StandardJSONResponseWrapper> {
    const isSkip = this.isSkipWrapper(context)
    if (isSkip) return next.handle()
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 1,
          result: 1,
          message: '请求成功',
        }
      }),
    )
  }
}
