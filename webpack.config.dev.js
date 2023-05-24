'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/images/[hash][ext][query]'
  },
  devtool: "inline-source-map",
  devServer:{
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      inject: true, 
      template: './src/public/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'assets/files'),
          to: "assets/files"
        },
        {
          from: path.resolve(__dirname, 'src', 'assets/images'),
          to: "assets/images"
        }
      ]
    }),
    new Dotenv(),
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@files': path.resolve(__dirname, 'src/assets/files/'),
      '@images': path.resolve(__dirname, 'src/assets/images/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@scss': path.resolve(__dirname, 'src/scss/'),
      '@js': path.resolve(__dirname, 'src/js/'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader'
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  autoprefixer
                ]
              }
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)/i,
        type: "asset/resource"
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: "application/font-woff",
            name: "[name].[contenthash].[ext]",
            outputPath: "./assets/fonts/",
            publicPath: "../assets/fonts/",
            esModule: false,
          }
        }
      },
      {
        test: /\.(pdf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: "application/pdf",
            name: "[name].[contenthash].[ext]",
            outputPath: "./assets/files/",
            publicPath: "../assets/files/",
            esModule: false,
          }
        },
        type: "asset/resource"
      },
    ]
  },
}