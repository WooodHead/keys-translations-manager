import bodyParser from 'body-parser'
import express from 'express'
import favicon from 'serve-favicon'
import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import compression from 'compression'
import webpack from 'webpack'
import logUtil from 'keys-translations-manager-core/lib/logUtil'
import config from './ktm.config'
import { LANGUAGES } from './src/constants/Languages'
import TranslationController from './src/controllers/TranslationController'
import KeyController from './src/controllers/KeyController'
import CountController from './src/controllers/CountController'
import DownloadController from './src/controllers/DownloadController'
import ImportController from './src/controllers/ImportController'

const log = logUtil.log,
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server);
let webpackConfig,
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

server.listen(config.server.port, config.server.hostname, function(err) {
	if (err) {
		log('error', err);
		process.exit(1);
	}

	if (process.env.NODE_ENV === 'development') {
		log('info', 'Dev-server (at http://localhost:3000) is starting, please wait ...');
	} else {
		log('info', 'The server (at http://localhost:3000) has started.');
	}
});
if (config.enableNotifications) {
	io.on('connection', function (socket) {
		socket.on('ktm', function (data) {
			if (data && data.action === "datachanged") {
				// sending to all clients except sender
				socket.broadcast.emit('ktm', {action: "datachanged"});
			}
		});
	});
}

app.set('view engine', 'ejs');
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

if (process.env.NODE_ENV === 'development') {
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
		const markup = ['<div style="color:orange;text-align:center">',
							'<i class="fa fa-spinner fa-pulse fa-2x"></i>',
						'</div>'].join("")
		const css = ''
		const initialState = ''
		res.render('index', { initialState, markup, css })
	});
} else {
	app.use('/public', express.static(path.join(__dirname, 'public')));

	app.get('/', function(req, res) {
		const match = require('react-router').match
		const getRoutes = require('./src/routes').default
		const markup = require('./src/server/index').default
		const css = '<link rel="stylesheet" href="/public/css/app.css">'
		let lang = req.headers["accept-language"].split(",")[0]
		lang = (LANGUAGES.indexOf(lang) === -1) ? "en-US" : lang

		match({ routes: getRoutes(), location: req.url }, (error, redirectLocation, renderProps) => {
			if (error) {
				res.status(500).send(error.message)
			} else if (redirectLocation) {
				res.redirect(302, redirectLocation.pathname + redirectLocation.search)
			} else if (renderProps) {
				fs.readFile('./public/locale/' + lang + '/translation.json', {encoding: 'utf-8'}, function(err, data){
					if (err) {
						res.status(500).send(err);
					} else {
						const messages = JSON.parse(data)
						const preloadedState = {
							messages: { lang, messages }
						}
						let initialState = `
							<script>
								window.__INITIAL_STATE__ = ${JSON.stringify(preloadedState)}
							</script>
						`

						res.render('index', {
							initialState,
							markup: markup(preloadedState, renderProps),
							css: css
						})
					}
				});
			} else {
				res.status(404).send('Not found')
			}
		})
	});
}

app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'image', 'favicon.ico')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/translation", TranslationController);
app.use("/api/key", KeyController);
app.use("/api/count", CountController);
app.use("/api/download", DownloadController);
app.use("/api/import", ImportController);
