import * as chalk from 'chalk'
import { format, LoggerOptions } from 'winston'
import { IS_PROD } from '@/constants/envs'

const levelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'info':
      return chalk.blue(level.toUpperCase().padEnd(7))
    case 'warn':
      return chalk.yellow(level.toUpperCase().padEnd(7))
    case 'error':
      return chalk.red(level.toUpperCase().padEnd(7))
    case 'debug':
      return chalk.green(level.toUpperCase().padEnd(7))
    case 'http':
      return chalk.cyan(level.toUpperCase().padEnd(7))
    case 'verbose':
      return chalk.magenta(level.toUpperCase().padEnd(7))
    case 'silly':
      return chalk.gray(level.toUpperCase().padEnd(7))
    default:
      return level.toUpperCase().padEnd(7)
  }
}

const logFormatter = format.printf(({ timestamp, level, stack, message }) => {
  return `${timestamp} - [${levelColor(level)}] - ${stack || message}`
})

const BaseFormatters = [
  format.timestamp(),
  format.errors({ stack: true }),
  logFormatter,
]

const ProdFormatters = IS_PROD ? [format.json()] : []

export const combineFormatters: LoggerOptions['format'] = format.combine(
  ...BaseFormatters.concat(ProdFormatters),
)
