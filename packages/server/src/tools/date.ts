import dayjs, { ConfigTypeMap } from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(isoWeek)

export const now = (): number => +new Date()

export type DateParam = ConfigTypeMap['default']

export const getWeekRange = (time?: DateParam): {
  start: number
  startDisplay: string
  end: number
  endDisplay: string
} => {
  const date = dayjs(time)
  const start = date.isoWeekday(1).startOf('day')
  const startDisplay = date.isoWeekday(1).format('YYYY-MM-DD')
  const end = date.isoWeekday(7).endOf('day')
  const endDisplay = date.isoWeekday(7).format('YYYY-MM-DD')
  return {
    start: start.valueOf(),
    startDisplay,
    end: end.valueOf(),
    endDisplay,
  }
}

export const getLastWeekRange = (time?: DateParam): {
  start: number
  startDisplay: string
  end: number
  endDisplay: string
} => {
  const lastWeekTime = dayjs(time).subtract(1, 'week')
  return getWeekRange(lastWeekTime.valueOf())
}
