# Keys-Translations Manager
This project offers a web application which aims to facilitate locale management. With this application, you can manage keys and their related translations. Also, you can download final locale files (either *.json or *.properties) through this application.


## Prerequisites

* Download [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.org/), and then get them installed.
* Start [mongod](https://docs.mongodb.org/manual/tutorial/manage-mongodb-processes/) process and make sure it's running normally.


## Getting Started

Checkout this repo, install dependencies, then start the web server:
```
> git clone https://github.com/chejen/keys-translations-manager
> cd keys-translations-manager
> npm install
> npm run start
```
Now you can run the application at http://localhost:3000/


## Custom
There are some settings (at [src/config.js](src/config.js)) you can configure. The table below lists the available settings:
| **Setting** | **Web server's hostname and port** |**Default**|
|----------|-------|---|
|  server  |   test    | ```{
		hostname: 'localhost',
		port: 3000
	}```  |
|  database  |   MongoDB connection URI    | ```'mongodb://localhost:27017/translationdb'```  |
|  locales  |   The locales need to be managed    | ```['en-US', 'zh-TW']```  |
|  projects  |   The projects need to be managed    | ```[
		{id:'p1', name:'project A'},
		{id:'p2', name:'project B'}
	]```  |

* Rebuild the code (```npm run build```) if you change the settings of 'locales' or 'projects'.
* Restart the server (```npm run start```) if you change any of these configurations.


## CLI
to be continued


## Technologies
* Scaffolded with [MongoDb] [1], [Express] [2], [React] [3], and [Node.js] [4]
* Styled with [Bootstrap] [5] and [Less] [6]
* RWD support: [Bootstrap] [5] and [SB Admin 2] [7]
* (TODO) Internalization support: [React Intl] [8]
* Module Bundler: [webpack] [9]
* (TODO)Testing:
* Miscellaneous: [Babel] [10], [ESLint] [11]


## License
This source code is licensed under the [MIT License](http://www.opensource.org/licenses/MIT).

[1]: https://www.mongodb.org/
[2]: http://expressjs.com/
[3]: https://facebook.github.io/react/
[4]: https://nodejs.org/en/
[5]: http://getbootstrap.com/
[6]: http://lesscss.org/
[7]: http://startbootstrap.com/template-overviews/sb-admin-2/
[8]: http://formatjs.io/react/
[9]: https://webpack.github.io/
[10]: https://babeljs.io/
[11]: http://eslint.org/
