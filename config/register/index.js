require('dotenv/config')
const babelRegister = require('@babel/register')

module.exports = opts =>
  babelRegister({
    extensions: ['.ts', '.tsx'],
    ...require('@namnm/babel-config'),
    ...opts,
  })
