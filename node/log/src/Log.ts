import { bold, gray } from 'colors/safe'
import path from 'path'
import stacktrace, { StackFrame } from 'stack-trace'

import { ColorFn, getColorFn, getLabel, getPriority, LogLevel } from './level'

export class Log {
  level: LogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  private createLogFn = (lv: LogLevel) => (
    msg: string,
    flag: boolean | string = true,
  ) => {
    if (!flag || getPriority(lv) < getPriority(this.level)) {
      return
    }
    this.println(lv, msg, flag)
  }

  cacheSize = 15
  stdall: string[] = []
  stdout: string[] = []
  stderr: string[] = []
  private push = (k: 'stdall' | 'stdout' | 'stderr', msg: string) => {
    if (!this.cacheSize) {
      return
    }
    const arr = this[k]
    if (arr.length >= this.cacheSize) {
      arr.shift()
    }
    arr.push(msg)
  }

  debug = this.createLogFn('debug')
  info = this.createLogFn('info')
  warn = this.createLogFn('warn')
  error = this.createLogFn('error')
  fatal = this.createLogFn('fatal')
  stack = (err: Error, lv: LogLevel = 'error') =>
    err &&
    this.println(
      lv,
      err.message || '<UNKNOWN ERROR>',
      this.cleanupErrorStack(err),
    )

  private println = (lv: LogLevel, msg: string, flag?: unknown) => {
    const now = this.getTimeStamp()
    const label = getLabel(lv)
    const location = this.getLocation(stacktrace.get()[2])
    msg = this.colorize(msg, bold)
    msg = `${now} ${label} ${location}: ${msg}`
    msg = this.colorize(msg, getColorFn(lv))
    if (typeof flag === 'string') {
      flag = this.colorize(flag, gray)
      msg = msg + '\n' + flag
    }
    this.push('stdall', msg)
    if (lv === 'error' || lv === 'fatal') {
      this.push('stderr', msg)
      console.error(msg)
    } else {
      this.push('stdout', msg)
      console.log(msg)
    }
    if (lv === 'fatal') {
      process.exit(1)
    }
  }

  color = true
  private colorize = (msg: string, fn: ColorFn) => (this.color ? fn(msg) : msg)

  timezone = new Date().getTimezoneOffset() / -60
  private getTimeStamp = () => {
    let date = new Date()
    const d = this.timezone * -60 + date.getTimezoneOffset()
    date = new Date(date.getTime() + d * 60 * 1000)
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ]
      .map((n, i) => {
        let s = ''
        if (n < 10) {
          s += '0'
        }
        s += n
        if (i < 2) {
          s += '/'
        } else if (i === 2) {
          s += ' '
        } else if (i < 5) {
          s += ':'
        }
        return s
      })
      .join('')
  }

  root = process.cwd()
  displayNodeModulesPath = process.env.NODE_ENV === 'production'
  private getLocation = (frame: StackFrame) => {
    let fileName = frame?.getFileName()
    if (!fileName) {
      return ''
    }
    const tr = (dir: string) => fileName.replace(dir, '').replace(/^[\\/]*/, '')
    const src = path.join(this.root, 'src')
    if (fileName.startsWith(src)) {
      fileName = tr(src)
    } else if (fileName.indexOf('node_modules') >= 0) {
      if (!this.displayNodeModulesPath) {
        return ''
      }
      const nm = fileName.substring(
        0,
        fileName.lastIndexOf('node_modules') + 12,
      )
      fileName = '~' + tr(nm).replace(/([\\/]).+([\\/][^\\/]+[\\/])/, '$1...$2')
    } else if (fileName.startsWith(this.root)) {
      fileName = '^' + tr(this.root)
    } else {
      return ''
    }
    return `${fileName}:${frame.getLineNumber()}`
  }
  private cleanupErrorStack = (err: Error) => {
    let maxFuncLength = 0
    const stacks: { f: string; l: string }[] = []
    const frames = (err && stacktrace.parse(err)) || []
    frames.forEach(frame => {
      const l = this.getLocation(frame)
      if (!l) {
        return
      }
      let f = frame.getFunctionName() || frame.getMethodName()
      f = f ? f.replace(/\S+\./g, '') : '<anonnymous>'
      stacks.push({ f, l })
      if (f.length > maxFuncLength) {
        maxFuncLength = f.length
      }
    })
    return stacks
      .map(s => `    at ${s.f.padEnd(maxFuncLength, ' ')} ${s.l}`)
      .join('\n')
  }
}
