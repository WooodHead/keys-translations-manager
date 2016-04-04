//import index from './src/ui/index.server'
import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import webpack from 'webpack'
import logUtil from 'keys-translations-manager-core/lib/logUtil'
import config from './ktm.config'
import TranslationController from './src/api/controllers/TranslationController'
import CountController from './src/api/controllers/CountController'
import DownloadController from './src/api/controllers/DownloadController'
let log = logUtil.log,
	app = express(),
	webpackConfig,
	compiler;

mongoose.connect(config.database, function(err) {
	if (err) {
		log('error', 'Failed to connect database');
		log('error', err);
		process.exit(1);
	//} else {
	//	console.log('Connect to database successfully.');
	}
});

app.listen(config.server.port, config.server.hostname, function(err) {
	if (err) {
		log('error', err);
		process.exit(1);
	}

	if (process.env.NODE_ENV === 'production') {
		log('info', 'The server (at http://localhost:3000) has started.');
	} else {
		log('info', 'Dev-server (at http://localhost:3000) is starting, please wait ...');
	}
});

app.set('view engine', 'ejs');

if (process.env.NODE_ENV === 'production') {
	app.use('/public', express.static(path.join(__dirname, 'public')));

	app.get('/', function(req, res) {
		const markup = require('./src/ui/index.server').default
		const css = '<link rel="stylesheet" href="/public/css/app.css">'
		res.render('index', {
			markup: markup,
			css: css
		})
	});
} else {
	webpackConfig = require('./webpack.config.dev');
	compiler = webpack(webpackConfig);
	app.use(require('webpack-dev-middleware')(compiler, {
		/*stats: {
			colors: true
		},*/
		noInfo: true,
		publicPath: webpackConfig.output.publicPath
	})).use(require('webpack-hot-middleware')(compiler));
	app.use('/public/css', express.static(path.join(__dirname, 'public/css')));
	app.use('/public/image', express.static(path.join(__dirname, 'public/image')));
	app.use('/public/locale', express.static(path.join(__dirname, 'public/locale')));
	app.get('/', function(req, res) {
		const markup = ['<div class="app-default">',
							'<i class="fa fa-spinner fa-pulse fa-2x"></i>',
						'</div>'].join("")
		const css = ''
		res.render('index', {
			markup: markup,
			css: css
		})
	});
}
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/translation", TranslationController);
app.use("/api/count", CountController);
app.use("/api/download", DownloadController);
// app.get('/', function(req, res) {
// 	res.sendFile(path.join(__dirname, 'index.html'));
// });
