import {QRCode, QRUtil} from './qrcode';
import Util from './util';

class QArt {
  constructor(options) {
    if (typeof options === 'undefined') {
        throw new TypeError('QArt required `options`.');
    } else if (typeof options.value === 'undefined') {
        throw new TypeError('QArt required `value` option.');
    } else if (typeof options.imagePath === 'undefined') {
        throw new TypeError('QArt required `imagePath` option.')
    }

    // this.size = (typeof options.size === 'undefined') ? QArt.DEFAULTS.size : options.size;
    this.filter = (typeof options.filter === 'undefined') ? QArt.DEFAULTS.filter : options.filter;
    this.value = options.value;
    this.imagePath = options.imagePath;
    this.version = (typeof options.version === 'undefined') ? QArt.DEFAULTS.version : options.version;
  }

  static get DEFAULTS() {
    return {
      // size: 195,
      value: '',
      filter: 'threshold',
      version: 10
    }
  }

  make(el) {
    var version = this.version;
    var imageSize = 75 + (version * 12);
    var padding = 12;

    var qr = QRCode(version, 'H');
    qr.addData(this.value);
    qr.make();
    var qrImage = qr.createImgObject(3);

    var self = this;
    qrImage.onload = function() {
        var coverImage = new Image();
        coverImage.src = self.imagePath;

        var resultCanvas = Util.createCanvas(imageSize, qrImage);
        var qrCanvas = Util.createCanvas(imageSize, qrImage);

        coverImage.onload = function() {
            if (coverImage.width < coverImage.height) {
                coverImage.height = (imageSize - padding * 2) * (1.0 * coverImage.height / coverImage.width);
                coverImage.width = imageSize - padding * 2;
            } else {
                coverImage.width = (imageSize - padding * 2) * (1.0 * coverImage.width / coverImage.height);
                coverImage.height = imageSize - padding * 2;
            }

            var coverCanvas = document.createElement('canvas');
            coverCanvas.width = imageSize;
            coverCanvas.height = imageSize;
            coverCanvas.getContext('2d').drawImage(coverImage, padding, padding, imageSize - padding * 2, imageSize - padding * 2)

            var coverImageData = coverCanvas.getContext('2d').getImageData(0, 0, imageSize, imageSize);
            var coverImageBinary = coverImageData.data;
            var resultImageData = resultCanvas.getContext('2d').getImageData(0, 0, imageSize, imageSize);
            var resultImageBinary = resultImageData.data;

            for (var i = 0; i < coverImageBinary.length; i += 4) {
                var x = Math.floor(i / 4) % imageSize;
                var y = Math.floor(Math.floor(i / 4) / imageSize);

                if (x < padding || y < padding || x >= imageSize-padding || y >= imageSize-padding) {
                    resultImageBinary[i+3] = 0;
                    continue;
                }
                if (x%3 == 1 && y%3 == 1) {
                    continue;
                }
                if (x < 36 && (y < 36 || y >= imageSize-36)) {
                    continue;
                }
                if (x >= imageSize-36 && y < 36) {
                    continue;
                }

                if (self.filter == 'threshold') {
                    var factor = Util.threshold(coverImageBinary[i], coverImageBinary[i+1], coverImageBinary[i+2], 127);
                    resultImageBinary[i] = factor;
                    resultImageBinary[i+1] = factor;
                    resultImageBinary[i+2] = factor;
                } else if (self.filter == 'color') {
                    resultImageBinary[i] = coverImageBinary[i];
                    resultImageBinary[i+1] = coverImageBinary[i+1];
                    resultImageBinary[i+2] = coverImageBinary[i+2];
                }
                resultImageBinary[i+3] = coverImageBinary[i+3];
            }

            resultCanvas.getContext('2d').putImageData(resultImageData, 0, 0);

            var patternPostion = QRUtil.getPatternPosition(version);
            for (var i = 0; i < patternPostion.length; i += 1) {
                for (var j = 0; j < patternPostion.length; j += 1) {
                    var x = patternPostion[i];
                    var y = patternPostion[j];
                    if (!((x == 6 && y == 50) || (y == 6 && x == 50) || (x == 6 && y == 6))) {
                        var rectX = 3 * (x-2) + 12;
                        var rectY = 3 * (y-2) + 12;
                        var rectWidth = (3 * (x+3) + 12) - rectX;
                        var rectHeight = (3 * (y+3) + 12) - rectY;

                        var rectData = qrCanvas.getContext('2d').getImageData(rectX, rectY, rectWidth, rectHeight);
                        resultCanvas.getContext('2d').putImageData(rectData, rectX, rectY);
                    }
                }
            }

            // resultCanvas.width = self.size;
            // resultCanvas.height = self.size;
            el.innerHTML = '';
            el.appendChild(resultCanvas);
        };
    }
  }
}

window.QArt = QArt;
export default window.QArt;
