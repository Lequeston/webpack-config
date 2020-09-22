//доп модули
const path = require('path');

//плагины
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

//оптимизация js и css
const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCSSExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    }, //в файл
    'css-loader', //import 
  ]; //справа налево
  if (extra) {
    loaders.push(extra);
  }
  return loaders;
}

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ], //сборка модулей
    plugins: ['@babel/plugin-proposal-class-properties']
  }

  if (preset) {
    opts.presets.push(preset);
  }
  return opts;
}

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions('@babel/preset-typescript')
  }]
  if (isDev) {
    loaders.push('eslint-loader');
  }
  return loaders;
}

const plugins = () => {
  const base = [ //плагины 
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd //оптимизирован ли
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new MiniCSSExtractPlugin({
      filename: filename('css')
    })
  ];

  if (isProd) {
    base.push(new BundleAnalyzerPlugin());
  }
  return base;
} 
module.exports = {
  context: path.resolve(__dirname, 'src'),

  mode: 'development', //режим

  entry: { //откуда стоит начать вебпаку
    main: ['@babel/polyfill', './index.jsx'], //чанк 1
    analytics: './analytics.ts' //чанк 2
  },

  output: { //куда и как собирается проект
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },

  resolve: { 
    extensions: [ //расширения которые можно не писать
      '.js', '.json'
    ],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src')
    }
  },

  optimization: optimization(),

  devServer: {
    port: 4200,
    hot: isDev
  },

  devtool: isDev ? 'source-map' : '',

  plugins: plugins(), 

  module: {
    rules: [ //лоадеры
      {
        test: /\.css$/, //какие файлы
        use: cssLoaders()
      },
      {
        test: /\.less$/, //какие файлы
        use: cssLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/, //какие файлы
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
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
        test: /\.m?js$/,
        exclude: /node_modules/, //убрать node_modules
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/, //убрать node_modules
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/, //убрать node_modules
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react')
        }
      }
    ]
  }
}