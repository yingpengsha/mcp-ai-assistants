import { isString } from './type'

/** 将Base64编码的字符串转换回普通字符串 */
export function decodeFromBase64(input: string): string | never
export function decodeFromBase64(
  input: Record<string, string>,
): Record<string, string> | never
export function decodeFromBase64(
  input: string | Record<string, string>,
): string | Record<string, string> | never {
  try {
    if (isString(input)) {
      // 如果输入是字符串，直接解码
      return Buffer.from(input, 'base64').toString('utf-8')
    }
    else {
      const result: Record<string, string> = {}
      Object.keys(input).forEach((key) => {
        result[key] = decodeFromBase64(input[key])
      })
      return result
    }
  }
  catch (error) {
    throw Error(`Error decoding from Base64 \n${error}`)
  }
}

/** 将普通字符串成转换Base64编码的字符串 */
export function encodeToBase64(input: string): string | never
export function encodeToBase64(
  input: Record<string, string>,
): Record<string, string> | never
export function encodeToBase64(
  input: string | Record<string, string>,
): string | Record<string, string> | never {
  try {
    if (isString(input)) {
      // 如果输入是字符串，直接解码
      return Buffer.from(input, 'utf-8').toString('base64')
    }
    else {
      const result: Record<string, string> = {}
      Object.keys(input).forEach((key) => {
        result[key] = encodeToBase64(input[key])
      })
      return result
    }
  }
  catch (error) {
    throw new Error(`Error decoding from Base64 \n${error}`)
  }
}
