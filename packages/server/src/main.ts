import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { WinstonModule } from 'nest-winston'
import * as compression from 'compression'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'

import { loggerInstance } from './tools/winston'

import { NormalErrorFilter } from './filters/normal-error/normal-error.filter'
import { AssertionErrorFilter } from './filters/assertion-error/assertion-error.filter'
import { HttpExceptionFilter } from './filters/http-exception/http-exception.filter'
import { BadRequestExceptionFilter } from './filters/bad-request-exception/bad-request-exception.filter'

import { AppModule } from './app.module'
import { StandardJSONResponseWrapperInterceptor } from './interceptors/transform/transform.interceptor'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: loggerInstance,
    }),
  })
  app.use(cookieParser())
  app.use(compression())
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  // ======================== pipe ========================
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  // ======================== filters ========================
  app.useGlobalFilters(
    new NormalErrorFilter(),
    new AssertionErrorFilter(),
    new HttpExceptionFilter(),
    new BadRequestExceptionFilter(),
  )

  // ======================== interceptors ========================
  app.useGlobalInterceptors(new StandardJSONResponseWrapperInterceptor())

  // ======================== cors ========================
  app.enableCors({
    origin: true,
    allowedHeaders:
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,DELETE,UPDATE,PATCH,OPTIONS',
    credentials: true,
  })

  // ======================== global prefix ========================
  app.setGlobalPrefix('api', {
    exclude: ['/liveness'],
  })

  // ======================== port ========================
  let port = 3000

  if (process.env.port_name && process.env[process.env.port_name]) {
    const portValue = process.env[process.env.port_name]
    if (portValue) {
      port = +portValue
    }
  }
  else if (process.env.AUTO_PORT0) {
    port = +process.env.AUTO_PORT0 + 1
  }

  let tik = 0
  while (tik < 10) {
    try {
      await app.listen(port)
      break
    }
    catch (error) {
      if (error.code === 'EADDRINUSE') {
        loggerInstance.warn(
          `Port ${port} is can not use. Trying the next port...`,
        )
      }
      else {
        loggerInstance.error(error)
        throw error
      }
      tik += 1
      port += 1
    }
  }
  if (tik >= 10) {
    throw new Error('Ten ports are already in use.')
  }

  loggerInstance.info(`Server is running on port ${port}`)
}

bootstrap().catch(async (error) => {
  console.error('Error during bootstrap:', error)
  process.exit(1)
})

process.on('SIGINT', async () => {
  process.exit(0)
})
process.on('SIGTERM', async () => {
  process.exit(0)
})
