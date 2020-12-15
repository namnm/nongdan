import { Log } from './src/Log'

export { LogLevel } from './src/level'
export { Log } from './src/Log'
export default new Log()

// type-coverage:ignore-next-line
module.exports = module.exports.default // make it easier to use in root index.js
