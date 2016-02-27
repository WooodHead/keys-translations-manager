var router = require("express").Router();
var archiver = require('archiver');
var Translations = require('../models/TranslationModel');
var Properties2Json = require('../../util/Properties2Json');
var config = require('../../config');
var locales = config.locales;

router.route('/:outputType/:fileType/:project/:locale')
		.get(function(req, res) {
			var outputType = req.params.outputType, //f: format, n: none
				fileType = req.params.fileType, //json, properties
				locale = req.params.locale,
				criteria = {},
				select = {
					"_id": 0,
					"key": 1
				};

			criteria[locale] = {$exists: true};
			select[locale] = 1;
			var query = Translations.find(criteria).select(select);
			if (outputType === "f") query.sort({'key':-1});
			query.exec(function(err, translations) {
				var len,
					translation,
					rootObj = {};

				if (err) res.status(500).send(err);

				len = translations.length;
				if (fileType === "json") {
					res.set({
						"Content-Disposition": "attachment; filename=\"translation.json\"",
						"Content-Type": "application/json; charset=utf-8"
					});

					while(len--) {
						translation = translations[len];
						Properties2Json(rootObj, translation.key, translation[locale]);
					}

					if (outputType === "f") { //formatted
						res.send(JSON.stringify(rootObj, null, 2));
					} else { //minimized
						res.send(JSON.stringify(rootObj));
					}

				} else if (fileType === "properties") {
					res.set({
						"Content-Disposition": "attachment; filename=\"translation.properties\"",
						"Content-Type": "text/x-java-properties; charset=utf-8"
					});

					while(len--) {
						translation = translations[len];
						res.write(translation.key + "=" + translation[locale] + "\r\n");
					}
					res.end();
				}

			});
		});

router.route('/:outputType/:fileType/:project')
		.get(function(req, res) {
			var outputType = req.params.outputType, //f: format, n: none
				fileType = req.params.fileType, //json, properties
				project = req.params.project,
				criteria = {},
				select = {
					"_id": 0,
					"key": 1
				},
				lenLocales = locales.length,
				count = 0,
				locale,
				archive = archiver.create('zip', {}),
				zipHandler = function(stream, locale, fileExt) {
					archive.append(stream, { name: locale + '/translation.' + fileExt });
					if (++count === lenLocales) archive.finalize();
				};

			res.set({
				'Content-Type': 'application/zip',
				'Content-disposition': 'attachment; filename=translations.zip'
			});
			archive.pipe(res);

			for (var i=0; i<lenLocales; i++) {
				locale = locales[i];

				criteria["project"] = project;
				select[locale] = 1;
				var query = Translations.find(criteria).select(select);
				if (outputType === "f") query.sort({'key':-1});
				query.exec(function(err, translations) {
					var len,
						translation,
						rootObj = {},
						locale = this;

					if (err) res.status(500).send(err);

					len = translations.length;
					if (fileType === "json") {
						while(len--) {
							translation = translations[len];
							Properties2Json(rootObj, translation.key, translation[locale]);
						}

						if (outputType === "f") { //formatted
							zipHandler(JSON.stringify(rootObj, null, 2), locale, fileType);
						} else { //minimized
							zipHandler(JSON.stringify(rootObj), locale, fileType);
						}

					} else if (fileType === "properties") {
						var str = "";
						while(len--) {
							translation = translations[len];
							str += translation.key + "=" + translation[locale] + "\r\n";
						}
						zipHandler(str, locale, fileType);
					}
				}.bind(locale));
			}
		});

module.exports = router;
