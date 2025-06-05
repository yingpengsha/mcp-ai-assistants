import { Controller, Get, Redirect } from '@nestjs/common'
import { AppService } from './app.service'
import { SkipStandardJSONResponseWrapper } from './interceptors/transform/transform.interceptor'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Redirect('/index.html')
  getRoot(): void {}

  // curl http://localhost:3000/liveness
  @Get('/liveness')
  @SkipStandardJSONResponseWrapper()
  liveness(): string {
    return this.appService.getOk()
  }
}
