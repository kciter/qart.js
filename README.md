<h1 align="center">qart.js</h1>
<p align="center">
<a href="https://www.npmjs.com/package/qartjs"><img src="https://img.shields.io/npm/dt/qartjs.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/qartjs"><img src="https://img.shields.io/npm/v/qartjs.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/qartjs"><img src="https://img.shields.io/npm/l/qartjs.svg" alt="License"></a>
<br>
Merges Pictures and QR Codes for Artistic QR Codes.
<br>
<img src="intro.png" width="427">
</p>

## Glance At
https://kciter.github.io/qart.js/

## Installation
```
$ npm install qartjs
```
or clone this repository and copy `qart.min.js` to your project.

## Usage
### In the browser
```html
<script src="../dist/qart.min.js"></script>
<script>
	new QArt({
		value: value,
		imagePath: './example.png',
		filter: filter
	}).make(document.getElementById('qart'));
</script>
```

### With ES6
```js
import QArt from 'qartjs';
const qart = new QArt({
	value: value,
	imagePath: './example.png',
	filter: filter
});
qart.make(document.getElementById('qart'));
```

### With React
This is a simple implementation of QArt as React Component. [react-qart](https://github.com/BatuhanK/react-qart)

### With Angular.JS
There is a directive available for using qart.js in Angular.js: [angular-qart](https://github.com/isonet/angular-qart)

## Options
|Field|Type|Description|Default|
|-----|----|-----------|-------|
|value|String|The data of the QR code.|*Required*|
|imagePath|String|The path of the combined image.|*Required*|
|filter|String|Define an image filter. `threshold` or `color`|threshold|

## Dependency
* [qrcode](https://github.com/kazuhikoarase/qrcode-generator/tree/master/js)

## Inspire
* [CuteR](https://github.com/chinuno-usami/CuteR)

## TODO
* [ ] Resize feature.
* [ ] Server-Side Rendering.
* [ ] CLI Command.

## LICENSE
[GPLv3](LICENSE)
