/**
 * Created by yuberdysheva on 15/05/2017.
 */
const webpack = require('webpack')
const path = require('path')

const config = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        scripts: "./scripts.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'scripts-bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', { modules: false }]
                    ]
                }
            }]
        },
            {
                test: /\.sass$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {url: false}
                    },
                    { loader: 'sass-loader' }
                ]
            }]
    }
}

module.exports = config