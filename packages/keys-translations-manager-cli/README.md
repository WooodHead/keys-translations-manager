[![NPM License][npm-license-image]][npm-license-url]
[![NPM Version][npm-version-image]][npm-version-url]

[npm-license-image]: https://img.shields.io/npm/l/keys-translations-manager-cli.svg
[npm-license-url]: https://www.npmjs.com/package/keys-translations-manager-cli
[npm-version-image]: https://img.shields.io/npm/v/keys-translations-manager-cli.svg
[npm-version-url]: https://www.npmjs.com/package/keys-translations-manager-cli

# keys-translations-manager-cli
> It's a cli tool that helps you download locales managed by [keys-translations-manager](https://github.com/chejen/keys-translations-manager).


## Installation
Global installation:
```sh
$ npm install -g keys-translations-manager-cli
```

Local installation:
```sh
$ npm install --save-dev keys-translations-manager-cli
```

## Configuration
Add `.ktmrc` to your home directory (or you can add `.ktmrc` into your project if you installed the cli tool locally.)

* Sample `.ktmrc`:
```json
{
  "database": "mongodb://localhost:27017/translationdb",
  "output": {
    "filename": "translation",
    "path": "/path/to/output/${locale}"
  }
}
```
* `${locale}` can be a placeholder for **filename** and/or **path**.


## Usage
ktm [locale1 (, locale2, ...)] -t [json | properties] -p [project ID]


## Options

| Option  | Shorthand  | Description | Required |
|:------------|:---------------:|:-----|:-----:|
| --type    | -t | Specify a file type. <br>(Please provide either `json` or `properties`) | Y |
| --project | -p | Specify a project to output locales. <br>(Please provide **a project ID**) | Y |
| --format  | -f | Sort keys alphabetically. |
| --help    | -h | Show help. |

* You have to map **project ID** to the setting in [ktm.config.js](../../ktm.config.js) (at [keys-translations-manager](https://github.com/chejen/keys-translations-manager)).


## Example
If you globally installed the cli tool, just execute the command like this:
```sh
$ ktm en-US zh-TW -p p1 -t json --format
```
Or, if you had it installed locally by your project, you can add `ktm` script to package.json's **scripts** property,
```js
"scripts": {
  "ktm": "ktm en-US zh-TW -p p1 -t json --format"
}
```
then execute:
```sh
$ npm run ktm
```

Finally, you will get your outputs like these:
* /path/to/output/en-US/translation.json
* /path/to/output/zh-TW/translation.json
