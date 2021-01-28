const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')

module.exports = {
	mode: isDevelopment ? 'development' : 'production',
	resolve: {
		fallback: {
			path: 'path-browserify',
			buffer: 'buffer',
		},
	},
	module: {
		rules: [
			{
				test: /node_modules\/vfile\/core\.js/,
				use: [
					{
						loader: 'imports-loader',
						options: {
							type: 'commonjs',
							imports: ['single process/browser process'],
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.ya?ml$/,
				type: 'json', // Required by Webpack v4
				use: 'yaml-loader',
			},
			{
				test: /\.md$/i,
				use: 'raw-loader',
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: require.resolve('babel-loader'),
						options: {
							presets: [
								'@babel/preset-env',
								[
									'@babel/preset-react',
									{
										runtime: 'automatic',
									},
								],
							],
							plugins: [
								'babel-plugin-styled-components',
								isDevelopment && require.resolve('react-refresh/babel'),
							].filter(Boolean),
						},
					},
				],
			},
		],
	},

	entry: {
		javascript: './source/index.js',
	},

	output: {
		filename: 'index.js',
		path: __dirname + '/dist',
	},
	devServer: {
		historyApiFallback: true,
		contentBase: path.join(__dirname, 'dist'),
		hot: true,
	},

	plugins: [
		isDevelopment && new ReactRefreshWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Vélolibre',
			template: 'index.html',
		}),
	].filter(Boolean),
}
