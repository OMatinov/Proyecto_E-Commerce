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
                presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]]
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
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity
  });
};