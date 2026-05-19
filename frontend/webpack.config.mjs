import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/', 
    clean: true,
  },
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), 
    },
    historyApiFallback: true, 
    port: 3000,
    open: true,
    hot: true,
    devMiddleware: {
      publicPath: '/', 
    },
    
    // 🔥 Исправленный синтаксис proxy для Webpack Dev Server v5
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          'Connection': 'keep-alive',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      favicon: path.resolve(__dirname, 'public/favicon.ico') 
    }),
    
    new CopyPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, "public"), 
          to: path.resolve(__dirname, "dist"),
          globOptions: {
            ignore: ["**/favicon.ico"], 
          },
        },
      ],
    }),

    // 👈 2. ДОБАВЬ ЭТОТ ПЛАГИН:
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({}) // Создает пустой объект process.env в браузере, чтобы код не падал
    })
  ],
  
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ],
            plugins: ['@emotion']
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
    ],
  },
  
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};