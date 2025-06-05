import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { LoggerOptions, transports } from 'winston'

import { IS_PROD } from '@/constants/envs'
import { PROJECT_ROOT } from '@/constants/path'

const BaseTransports: LoggerOptions['transports'] = [
  new transports.Console({
    level: 'silly',
  }),
]

// 确保日志目录存在
const ensureLogDirectory = (): boolean => {
  const logDir = join(PROJECT_ROOT, 'logs')
  if (!existsSync(logDir)) {
    try {
      mkdirSync(logDir, { recursive: true })
    }
    catch (error) {
      console.warn('Failed to create logs directory:', error)
      return false
    }
  }
  return true
}

const ProdTransports: LoggerOptions['transports'] = IS_PROD && ensureLogDirectory()
  ? [
    new transports.File({
      filename: join(PROJECT_ROOT, 'logs', 'error.log'),
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
    }),
    new transports.File({
      filename: join(PROJECT_ROOT, 'logs', 'combined.log'),
      level: 'info',
      handleExceptions: true,
      handleRejections: true,
    }),
  ]
  : []

export const combinedTransports: LoggerOptions['transports']
  = BaseTransports.concat(ProdTransports)
