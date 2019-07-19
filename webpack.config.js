const path = require('path');

module.exports = {
	entry: {
		main: './src/main.js',
		api: './src/api.js',
	},
	mode: 'production',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
};
