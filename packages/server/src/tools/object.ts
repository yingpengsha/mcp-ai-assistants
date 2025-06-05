import type {
  SetNonNullable,
  JsonObject,
} from 'type-fest'

export const hasOwn = Object.prototype.hasOwnProperty

export function omitNullableValues<T extends JsonObject>(
  obj: T,
): SetNonNullable<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== null && value !== undefined,
    ),
  ) as SetNonNullable<T>
}

export function omit<T extends JsonObject, K extends keyof T>(
  obj: T,
  keys: ReadonlyArray<K>,
): Omit<T, K> {
  const shallowCopy = { ...obj }
  for (const key of keys) {
    delete shallowCopy[key]
  }
  return shallowCopy
}

type TransformBigIntToNumberResult<T extends JsonObject> = {
  [K in keyof T]: T[K] extends bigint
    ? number
    : T[K]
}

export function transformBigIntToNumber<T extends JsonObject>(
  obj: T,
): TransformBigIntToNumberResult<T> {
  const result = { ...obj }
  for (const key in result) {
    if (typeof result[key] === 'bigint') {
      result[key] = Number(result[key]) as unknown as T[Extract<
        keyof T,
        string
      >]
    }
  }
  return result as TransformBigIntToNumberResult<T>
}
