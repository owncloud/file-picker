const { declare } = require('@babel/helper-plugin-utils')

module.exports = {
  env: {
    production: {
      presets: ['@ownclouders/babel-preset']
    },

    test: {
      presets: [
        (module.exports = declare((api, options) => {
          return {
            presets: [
              [
                require('@ownclouders/babel-preset'),
                {
                  modules: 'cjs'
                }
              ]
            ]
          }
        }))
      ],
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }
  }
}
