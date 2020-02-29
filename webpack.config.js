const path = require('path');

module.exports = {
    entry: {
        main: path.resolve(__dirname, 'src', 'index.ts'),
    },
    output: {
        library: 'differ',
        libraryTarget: 'umd',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: 'ts-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    }
}