var webpack = require('webpack');
var srcDir = __dirname + '/src';
 
module.exports = {
    // devtool: 'inline-source-map',
    devtool: false,
    entry: {
        main : './src/main.js',
        vendor: ['react','react-dom'],
    },
    //入口文件输出配置
    output: {
        path: './public/react/libs',
        filename: '[name].js',
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.js$/, loader: 'babel-loader' },
            { test: /\.jsx$/, loader: 'babel-loader' },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    //其它解决方案配置
    resolve: {
        root: srcDir, //绝对路径
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            //AppStore : 'js/stores/AppStores.js',
            //ActionType : 'js/actions/ActionType.js',
            //AppAction : 'js/actions/AppAction.js'
            // core: srcDir + "/js/core",
            // ui: srcDir + "/js/ui"
        }
    },
    plugins: [
        // 第三方库
        new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js'),
        // 压缩
        // new webpack.optimize.UglifyJsPlugin({
        //     output: {
        //         comments: false,  // remove all comments
        //     },
        //     compress: {
        //         warnings: false
        //     }
        // }),
   ],
};