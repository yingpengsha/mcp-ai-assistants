import { createLogger, transports } from 'winston'
import { combineFormatters } from './formatters'
import { combinedTransports } from './transports'

let loggerInstance: ReturnType<typeof createLogger>

try {
  loggerInstance = createLogger({
    format: combineFormatters,
    transports: combinedTransports,
    exitOnError: false, // 防止因为日志错误导致进程退出
  })
}
catch (error) {
  console.error('Failed to initialize logger:', error)
  // 如果创建失败，使用基础的控制台日志
  loggerInstance = createLogger({
    format: combineFormatters,
    transports: [
      new transports.Console({
        level: 'silly',
      }),
    ],
    exitOnError: false,
  })
}

export { loggerInstance }
