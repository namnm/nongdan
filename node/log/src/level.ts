import { cyan, magenta, red, yellow } from 'colors/safe'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

const levelLabelMap = {
  debug: '[DEBUG]',
  info: ' [INFO]',
  warn: ' [WARN]',
  error: '[ERROR]',
  fatal: '[FATAL]',
}
export const getLabel = (lv: LogLevel) => levelLabelMap[lv]

const levelColorFnMap = {
  debug: (str: string) => str,
  info: cyan,
  warn: yellow,
  error: red,
  fatal: magenta,
}
export type ColorFn = typeof levelColorFnMap.debug
export const getColorFn = (lv: LogLevel) => levelColorFnMap[lv]

const levelPriorityMap = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
}
export const getPriority = (lv: LogLevel) => levelPriorityMap[lv]
