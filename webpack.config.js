var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs-extra'),
  env = require('./scripts/env'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin')
var { CleanWebpackPlugin } = require('clean-webpack-plugin')
var ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
var ReactRefreshTypeScript = require('react-refresh-typescript')
const merge = require('merge-json')
const fs = require('fs')

const ASSET_PATH = process.env.ASSET_PATH || '/'
// const BROWSER = process.env.BROWSER || 'chrome'

var alias = {}

// load the secrets
var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js')

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
]

// Add this function at the top of your webpack.config.js file
function combineManifests(commonConfigPath, browserSpecificConfigPath) {
  const commonConfig = JSON.parse(fs.readFileSync(commonConfigPath, 'utf8'))
  const browserSpecificConfig = JSON.parse(
    fs.readFileSync(browserSpecificConfigPath, 'utf8')
  )

  // const manifest = merge.merge(commonConfig, browserSpecificConfig)

  return JSON.stringify(merge.merge(commonConfig, browserSpecificConfig))
}

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath
}

const isDevelopment = process.env.NODE_ENV !== 'production'

var options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    options: path.join(__dirname, 'src', 'pages', 'Options', 'index.jsx'),
    popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.jsx'),
    background: path.join(__dirname, 'src', 'pages', 'Background', 'index.js'),
    contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.js'),
  },
  chromeExtensionBoilerplate: {
    // notHotReload: ['background', 'contentScript'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath: ASSET_PATH,
  },
  module: {
    rules: [
      {
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        // in the `src` directory
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        type: 'asset/resource',
        exclude: /node_modules/,
        // loader: 'file-loader',
        // options: {
        //   name: '[name].[ext]',
        // },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(
                  Boolean
                ),
              }),
              transpileOnly: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest/common.json', // This path is not used but necessary for the plugin to work
          to: path.join(__dirname, 'build/manifest.json'),
          force: true,
          transform: function (content, path) {
            // Replace with combined manifests for Firefox
            return Buffer.from(
              combineManifests(
                'src/manifest/common.json',
                `src/manifest/${
                  process.env.BROWSER === 'firefox' ? 'firefox' : 'chrome'
                }.json`
              )
            )
          },
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/icon128.png',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/icon48.png',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/iconGrey48.png',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/_locales',
          to: path.join(__dirname, 'build/_locales'),
          force: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Options', 'index.html'),
      filename: 'options.html',
      chunks: ['options'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      cache: false,
    }),
  ].filter(Boolean),
  infrastructureLogging: {
    level: 'info',
  },
}

if (env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-source-map'
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  }
}

module.exports = options
