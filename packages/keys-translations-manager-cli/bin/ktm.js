#!/usr/bin/env node

var path = require('path'),
	fs = require('node-fs'),
	mongoose = require('mongoose'),
	properties2Json = require('keys-translations-manager-core/lib/transformationUtil').properties2Json,
	log = require('keys-translations-manager-core/lib/logUtil').log,
	yargs = require('yargs'),
	argv = yargs.argv,
	cwd = process.cwd(),
	parts = cwd.split(path.sep),
	runcom = ".ktmrc",
	loc, f, content, cfg;


yargs
	.usage('Usage: ktm [locale1 (, locale2, ...)] -t [json|properties] -p [project ID]')
	.example('ktm en-US zh-TW -t json -p p1 --format')
	.demand(['t', 'p'])
	.option('type', {
		alias: 't',
		describe: 'Provide a data type',
		choices: ['json', 'properties']
	})
	.option('project', {
		alias: 'p',
		describe: 'Provide a project ID'
	})
	.boolean('format')
	.alias('f', 'format')
	.help('help')
	.alias('h', 'help')
	.argv


while(parts.length) {
	loc = parts.join(path.sep);
	f = path.join(loc, runcom);
	if (fs.existsSync(f)) {
		log('info', `Found config at ${f}`);
		content = fs.readFileSync(f, "utf8");
		cfg = JSON.parse(content);
		break;
	}
	parts.pop();
};
if (!cfg) {
	log('error', `Found no ${runcom} config`);
	process.exit(1);
}

mongoose.connect(cfg.database, function(err) {
	if (err) {
		log('error', 'Failed to connect database !');
		log('error', err);
		process.exit(1);
	} else {
		var locales = argv._,
			lenLocales = locales.length,
			schema = {
				'key': String,
				'project': [String]
			},
			TranslationSchema,
			Translations,
			count = 0,
			afterWriteFile = function(file){
				log('info', 'Successfully output to ' + file);
				if (++count === locales.length) {
					log('info', 'Finished!');
					mongoose.connection.close();
					process.exit(0);
				}
			},
			afterFail = function(err){
				log('error', err);
				mongoose.connection.close();
				process.exit(1);
			};

		while(lenLocales--) schema[locales[lenLocales]] = String;
		TranslationSchema = new mongoose.Schema(schema);
		Translations = mongoose.model('Translation', TranslationSchema);


		locales.forEach(function(locale){
			var outputType = argv.format ? 'f' : '',
				fileType = argv.t || argv.type,
				project = argv.p || argv.project,
				filePath = path.join(loc, cfg.output.path.replace("${locale}", locale)),
				file = path.join(filePath, cfg.output.filename.replace("${locale}", locale) + `.${fileType}`),
				query,
				criteria = {
					"project": project
				},
				select = {
					"_id": 0,
					"key": 1
				};

			criteria[locale] = {$exists: true};
			select[locale] = 1;
			query = Translations.find(criteria).select(select);
			if (outputType === "f") query.sort({'key':-1});
			query.exec(function(err, translations) {
				var len,
					translation,
					rootObj = {},
					str = "";

				if (err) afterFail(err);

				len = translations.length;

				if (fileType === "json") {
					while(len--) {
						translation = translations[len];
						rootObj = properties2Json(rootObj, translation.key, translation[locale]);
					}

					if (outputType === "f") { //formatted
						str = JSON.stringify(rootObj, null, 2)
					} else { //minimized
						str = JSON.stringify(rootObj);
					}

				} else if (fileType === "properties") {
					while(len--) {
						translation = translations[len];
						str += translation.key + "=" + translation[locale] + "\r\n";
					}
				}

				fs.writeFile(file, str, function (err) {
					if (err) {
						if (err.code === 'ENOENT'){
							fs.mkdir(filePath, 0777, true, function (err) {
								if (err) {
									afterFail(err);
								} else {
									log('info', 'Created dir: ' + filePath);
									fs.writeFile(file, str, function (err) {
										if (err) {
											afterFail(err);
										} else {
											afterWriteFile(file);
										}
									});
								}
							});
						} else {
							afterFail(err);
						}
					} else {
						afterWriteFile(file);
					}
				}); //fs.writeFile
			}); //query.exec
		}); //locales.forEach
	}
}); //mongoose.connect
