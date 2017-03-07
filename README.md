<h1 align="center">qart.js</h1>
<p align="center">
<a href="https://cdnjs.com/libraries/qartjs"><img src="https://img.shields.io/cdnjs/v/qartjs.svg" alt="CDNJS"></a>
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
### NPM
```
$ npm install qartjs
```
or clone this repository and copy `qart.min.js` to your project.

### CDN
```html
<script src="//cdnjs.cloudflare.com/ajax/libs/qartjs/1.0.2/qart.min.js"></script>
```

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

### With Vue 2.x
There is a directive available for using qart.js in Vue.js 2.x : [vue-qart](https://github.com/superman66/vue-qart)

## Options
|Field|Type|Description|Default|
|-----|----|-----------|-------|
|value|String|The data of the QR code.|*Required*|
|imagePath|String|The path of the combined image.|*Required*|
|filter|String|Define an image filter. `threshold` or `color`|threshold|
|version|Integer|QRCode version (1 <= version <= 40)|10|

## Dependency
* [qrcode](https://github.com/kazuhikoarase/qrcode-generator/tree/master/js)

## Inspire
* [CuteR](https://github.com/chinuno-usami/CuteR)

## TODO
* [x] Resize feature.
* [ ] Server-Side Rendering.
* [ ] CLI Command.

## LICENSE
[GPLv3](LICENSE)
