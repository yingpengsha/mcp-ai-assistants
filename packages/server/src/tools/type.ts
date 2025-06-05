export const isStringArray = (value: unknown): value is string[] => {
  return (
    Array.isArray(value) && value.every(item => typeof item === 'string')
  )
}

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object'
}

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number'
}
export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}
export const isArray = (value: unknown): value is Array<unknown> => {
  return Array.isArray(value)
}
export const isStringOrNumber = (value: unknown): value is string | number => {
  return typeof value === 'string' || typeof value === 'number'
}
export const isNumberString = (value: unknown): boolean => {
  return typeof value === 'string' && !isNaN(+value)
}
