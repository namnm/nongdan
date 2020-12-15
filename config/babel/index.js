module.exports = {
  plugins: [
    '@babel/plugin-syntax-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-transform-modules-commonjs', { loose: true }],
  ],
  presets: ['@babel/preset-typescript'],
  retainLines: true,
}
