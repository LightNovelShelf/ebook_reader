module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        include: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-proposal-nullish-coalescing-operator']
      }
    ]
  ]
}
