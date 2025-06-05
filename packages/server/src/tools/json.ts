import { JsonValue } from 'type-fest'
import { loggerInstance } from './winston'

export const encodeStringify = (obj: JsonValue): string => {
  return encodeURIComponent(JSON.stringify(obj))
}

export const decodeParse = (str: string): JsonValue => {
  return JSON.parse(decodeURIComponent(str))
}

export const logStringify = (obj: JsonValue): string => {
  return JSON.stringify(obj, null, 2)
}

export const safeStringifyMaybeNull = (obj: JsonValue): string | null => {
  try {
    return obj ? JSON.stringify(obj) : null
  }
  catch (error) {
    loggerInstance.error(
      `Failed to stringify: ${logStringify({ obj, error: error.toString() })}`,
    )
    return null
  }
}

export const safeParseMaybeNull = (str: string): JsonValue => {
  try {
    return str ? JSON.parse(str) : null
  }
  catch (error) {
    loggerInstance.error(
      `Failed to parse: ${logStringify({ str, error: error.toString() })}`,
    )
    return null
  }
}
