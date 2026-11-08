// Karma + Jasmine + webpack.
//
//   npm test                    -> modo normal (queda observando cambios)
//   npm test -- --coverage      -> una sola corrida con reporte de cobertura en coverage/index.html
//   npm run test:coverage       -> igual que el anterior
//
// El flag --coverage se lee de process.argv porque karma entrega los argumentos de la línea
// de comandos recién después de ejecutar este archivo.

const conCobertura = process.argv.includes('--coverage');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    files: ['src/tests/**/*.spec.jsx', 'src/tests/**/*.spec.js'],
    preprocessors: {
      'src/tests/**/*.spec.jsx': ['webpack'],
      'src/tests/**/*.spec.js': ['webpack']
    },
    webpack: {
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
                // Con --coverage se instrumenta el código de src/ (las pruebas y node_modules no cuentan)
                plugins: conCobertura
                  ? [['istanbul', { exclude: ['src/tests/**', '**/node_modules/**'] }]]
                  : []
              }
            }
          },
          {
            test: /\.(css|scss)$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: { extensions: ['.js', '.jsx'] }
    },
    webpackMiddleware: { stats: 'errors-only' },
    reporters: conCobertura ? ['progress', 'coverage'] : ['progress'],
    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [
        { type: 'html' },          // coverage/index.html (el reporte que se muestra)
        { type: 'text-summary' },  // resumen en la terminal
        { type: 'lcovonly' }       // coverage/lcov.info (para otras herramientas)
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: !conCobertura,
    browsers: ['ChromeHeadless'],
    singleRun: conCobertura,
    concurrency: Infinity
  });
};
