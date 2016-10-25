var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
//Template的文件夹路径
var TEM_PATH = path.resolve(ROOT_PATH, 'templates');

module.exports = {
  //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
  entry: {
    app: path.resolve(APP_PATH, 'index.js'),
    mobile: path.resolve(APP_PATH, 'mobile.js'),
    //添加要打包在vendors里面的库
    vendors: ['jquery', 'moment']
  },
  //输出的文件名 合并以后的js会命名为bundle.js
  output: {
    path: BUILD_PATH,
    //注意 我们修改了bundle.js 用一个数组[name]来代替，他会根据entry的入口文件名称生成多个js文件，这里就是(app.js,mobile.js和vendors.js)
    filename: '[name].[hash].js'
  },
  //添加我们的插件 会自动生成一个html文件
  plugins: [
    //创建了两个HtmlWebpackPlugin的实例，生成两个页面
    new HtmlwebpackPlugin({
        title: 'Hello World app',
        template: path.resolve(TEM_PATH, 'index.html'),
        filename: 'index.html',
        //chunks这个参数告诉插件要引用entry里面的哪几个入口
        chunks: ['app', 'vendors'],
        //要把script插入到标签里
        inject: 'body'
    }),
    new HtmlwebpackPlugin({
        title: 'Hello Mobile app',
        template: path.resolve(TEM_PATH, 'mobile.html'),
        filename: 'mobile.html',
        chunks: ['mobile', 'vendors'],
        inject: 'body'
    })
    //这个使用uglifyJs压缩你的js代码
    // new webpack.optimize.UglifyJsPlugin({minimize: true}),
    //把入口文件里面的数组打包成verdors.js
    // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
  ],
  /*
  * 当代码更新的时候自动刷新浏览器
  * 然后再package.json里面配置一下运行的命令
  *
  "scripts": {
    "start": "webpack-dev-server --hot --inline"
  }
  运行npm start,访问：http://localhost:8080/就可以看到保存自动更新的内容了，不需要每次都重启服务
  */
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    //代理配置
    // proxy: {
    //   '/api/*': {
    //       target: 'http://localhost:5000',
    //       secure: false
    //   }
    // }
  },
  
  module: {
    perLoaders: [
        {
            test: /\.jsx?$/,
            include: APP_PATH,
            loader: 'jshint-loader'
        }
    ],
    loaders: [
      /*处理css
      * css-loader 和 style－loader，css-loader会遍历css文件，找到所有的url(...)并且处理。style-loader会把所有的样式插入到你页面的一个style tag中
      * 看loaders的书写方式，test里面包含一个正则，包含需要匹配的文件，loaders是一个数组，包含要处理这些程序的loaders，这里我们用了css和style，注意loaders的处理顺序是从右到左的，这里就是先运行css-loader然后是style-loader.
      */
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: APP_PATH
      },
      /*处理图片
      注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片。
      */
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=40000'
      },
      //添加ES6的支持
      {
        test: /\.jsx?$/,
        exclude:/node_modules/,
        loader:'babel',
        query:{
            presets:['es2015']
        }
      }
    ],
    jshint: {
      "esnext": true
    }
  },

};