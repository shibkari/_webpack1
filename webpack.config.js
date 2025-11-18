const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin' )
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin' )
const TerserPlugin = require('terser-webpack-plugin' )
const EslintWebpackPlugin = require('eslint-webpack-plugin' )

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const optimization = () => ({
  splitChunks: {
    chunks: 'all'
  },
  minimizer: [
    new CssMinimizerWebpackPlugin (),
    new TerserPlugin ()
  ]
})

const filename = (ext) => 
  `assets/${ext}/[name]${isDev ? '' : '.[fullhash]'}.[ext]`

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: ''
      }
    },
    'css-loader'
  ]
  if (extra) {
    loaders.push(extra)
  }
  return loaders
}

const jsLoaders = (extra) => {
  const loaders = {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  }

  if (extra) loaders.options.presets.push(extra)

return loaders
}

const setPlugins = () => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new EslintWebpackPlugin ({
      extensions: ['js'],
      configType: 'eslintrc',
      fix: true
    }),
  ]
  if (isProd) {
    plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'favicon.png'),
            to: path.resolve(__dirname, 'dist'),
          }
        ]
      })
    )
  }
  return plugins
}

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: { main: './index.jsx',
    stat: './statistics.ts'
  },
  target: 'web',
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.png', '.jpg', '.gif', '.svg', '.xml', '.csv'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@model': path.resolve(__dirname, 'src/model'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  },

  optimization: optimization(),

  devtool: isDev ? 'eval-source-map' : false,

  devServer: {
    port: 4200,
    hot: true
  },

  plugins: setPlugins(),

  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpe?g|svg|gif|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-react')
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-typescript')
      }
    ]
  }
}