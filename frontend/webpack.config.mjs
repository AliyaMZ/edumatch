import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";

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
      // ИЗМЕНЕНИЕ: указываем серверу смотреть и в dist, и в public
      directory: path.join(__dirname, 'public'), 
    },
    historyApiFallback: true, 
    port: 3000,
    open: true,
    hot: true,
    devMiddleware: {
      publicPath: '/', 
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      // Оставляем это для основной иконки
      favicon: path.resolve(__dirname, 'public/favicon.ico') 
    }),
    
    // ДОБАВЛЕНО: Копируем остальные иконки и манифест
    new CopyPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, "public"), 
          to: path.resolve(__dirname, "dist"),
          globOptions: {
            // Игнорируем favicon.ico, так как его уже обрабатывает HtmlWebpackPlugin
            ignore: ["**/favicon.ico"], 
          },
        },
      ],
    }),
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