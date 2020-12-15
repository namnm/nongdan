import log from '..'

process.on('uncaughtException', log.stack)
process.on('unhandledRejection', log.stack)
