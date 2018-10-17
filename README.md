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
  // directly appending canvas to the document
  new QArt({
    value: value,
    imagePath: './example.png',
    filter: filter,
    size: 195
	}).make(document.getElementById('qart'));

	// using callback
	new QArt({
      value: value,
      imagePath: './example.png',
      filter: filter,
      size: 195
  	}).make(function (canvas) {
  	  document.getElementById('qart').appendChild(canvas)
  	});
</script>
```

### With ES6
```js
import QArt from 'qartjs';
const qart = new QArt({
  value: value,
  imagePath: './example.png',
  filter: filter,
  size: 195
});

// directly appending canvas to the document
qart.make(document.getElementById('qart'))

// using callback
qart.make((canvas) => {
  document.getElementById('qart').appendChild(canvas);
});
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
|size|Integer|Define an image size in pixels.|195
|version|Integer|QRCode version (1 <= version <= 40)|10|
|background|CSSColor|Implement background if exist|undefinded
|fillType|scale_to_fit/fill| Place image type(fill or scale to fit)|scale_to_fit

## Dependency
* [qrcode](https://github.com/kazuhikoarase/qrcode-generator/tree/master/js)

## Inspire
* [CuteR](https://github.com/chinuno-usami/CuteR)

## TODO
* [ ] Server-Side Rendering.
* [ ] CLI Command.

## Donate
If you like this open source, you can sponsor it. :smile:

[Paypal me](https://www.paypal.me/kciter)

## LICENSE
[GPLv3](LICENSE)
