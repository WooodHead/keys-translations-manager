var router = require("express").Router();
var Translations = require('../models/TranslationModel');
var ConfigUtil = require('../../util/ConfigUtil');
var projectIdList = ConfigUtil.getProjectIdList();

router.route('/projects')
		.get(function(req, res) {
			Translations.aggregate([{
				"$match": {
					"project": {
						"$in": projectIdList
					}
				}
			}, {
				"$unwind": "$project"
			}, {
				"$group": {
					"_id": '$project',
					"count": {"$sum": 1}
				}
			}], function (err, result) {
				if (err) res.status(500).send(err);
				res.json(result);
			});
		});

module.exports = router;
