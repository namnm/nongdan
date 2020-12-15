require('@namnm/node-register')({
  ignore: [p => /node_modules/.test(p) && !/@namnm/.test(p)],
})
