
import {QRCode, QRUtil} from './qrcode'
import Util from './util'

class QArt {
  constructor (options) {
    if (typeof options === 'undefined') {
      throw new TypeError('QArt required `options`.')
    } else if (typeof options.value === 'undefined') {
      throw new TypeError('QArt required `value` option.')
    } else if (typeof options.imagePath === 'undefined') {
      throw new TypeError('QArt required `imagePath` option.')
    }

    this.size = (typeof options.size === 'undefined') ? QArt.DEFAULTS.size : options.size
    this.filter = (typeof options.filter === 'undefined') ? QArt.DEFAULTS.filter : options.filter
    this.value = options.value
    this.imagePath = options.imagePath
    this.version = (typeof options.version === 'undefined') ? QArt.DEFAULTS.version : options.version
    this.fillType = (typeof options.fillType === 'undefined') ? QArt.DEFAULTS.fillType : options.fillType
    this.background = options.background
  }

  static get DEFAULTS () {
    return {
      size: 195,
      value: '',
      filter: 'threshold',
      version: 10,
      fillType: 'scale_to_fit'
    }
  }

  findWorkingVersion (currentVersion) {
    var version = currentVersion
    QRCode.stringToBytes = QRCode.stringToBytesFuncs['UTF-8']
    var qr = QRCode(currentVersion, 'H')
    for (var i = currentVersion; i <= 40; i++) {
      try {
        qr = QRCode(version, 'H')
        qr.addData(this.value)
        qr.make()
      } catch (e) {
        console.log('Error: ', e)
        if (e.name === 'CodeLengthOverflow') {
          version += 1
          console.log('Can\'t create QRCode need up version, current version', version)
          continue
        } else { throw e }
      }
      return version
    }
  }

  make (callback) {
    var version = this.findWorkingVersion(this.version)

    var qr = QRCode(version, 'H')
    qr.addData(this.value)
    qr.make()
    QRCode.stringToBytes = QRCode.stringToBytesFuncs['UTF-8']
    var qrImage = qr.createImgObject(3)

    var imageSize = 75 + (version * 12)
    var padding = 12
    var scaledPadding = (padding * this.size) / imageSize

    var self = this
    qrImage.onload = function () {
      var coverImage = new Image()
      coverImage.src = self.imagePath

      // handle image by fillType
      var imageCanvas = Util.createCanvas(imageSize - padding * 2, coverImage, self.fillType)
      coverImage.src = imageCanvas.toDataURL()

      var resultCanvas = Util.createCanvas(imageSize, qrImage)
      var qrCanvas = Util.createCanvas(imageSize, qrImage)

      if (typeof self.background !== 'undefined') {
        var bgCanvas = Util.createCanvas(self.size, new Image())
        var bgCtx = bgCanvas.getContext('2d')
        bgCtx.fillStyle = self.background
        bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height)
      }

      coverImage.onload = function () {
        if (coverImage.width < coverImage.height) {
          coverImage.height = (imageSize - padding * 2) * (1.0 * coverImage.height / coverImage.width)
          coverImage.width = imageSize - padding * 2
        } else {
          coverImage.width = (imageSize - padding * 2) * (1.0 * coverImage.width / coverImage.height)
          coverImage.height = imageSize - padding * 2
        }

        var coverCanvas = Util.createCanvas(imageSize)
        coverCanvas.width = imageSize
        coverCanvas.height = imageSize

        coverCanvas.getContext('2d').drawImage(coverImage, padding, padding, imageSize - 2 * padding, imageSize - 2 * padding)
        var coverImageData = coverCanvas.getContext('2d').getImageData(0, 0, imageSize, imageSize)
        var coverImageBinary = coverImageData.data
        var resultImageData = resultCanvas.getContext('2d').getImageData(0, 0, imageSize, imageSize)
        var resultImageBinary = resultImageData.data

        for (var i = 0; i < coverImageBinary.length; i += 4) {
          var x = Math.floor(i / 4) % imageSize
          var y = Math.floor(Math.floor(i / 4) / imageSize)

          if (x < padding || y < padding || x >= imageSize - padding || y >= imageSize - padding) {
            resultImageBinary[i + 3] = 0
            continue
          }
          if (x % 3 === 1 && y % 3 === 1) {
            continue
          }
          if (x < 36 && (y < 36 || y >= imageSize - 36)) {
            continue
          }
          if (x >= imageSize - 36 && y < 36) {
            continue
          }

          if (self.filter === 'threshold') {
            var factor = Util.threshold(coverImageBinary[i], coverImageBinary[i + 1], coverImageBinary[i + 2], 127)
            resultImageBinary[i] = factor
            resultImageBinary[i + 1] = factor
            resultImageBinary[i + 2] = factor
          } else if (self.filter === 'color') {
            resultImageBinary[i] = coverImageBinary[i]
            resultImageBinary[i + 1] = coverImageBinary[i + 1]
            resultImageBinary[i + 2] = coverImageBinary[i + 2]
          }
          resultImageBinary[i + 3] = coverImageBinary[i + 3]
        }

        resultCanvas.getContext('2d').putImageData(resultImageData, 0, 0)

        var patternPostion = QRUtil.getPatternPosition(version)
        for (var i = 0; i < patternPostion.length; i += 1) {
          for (var j = 0; j < patternPostion.length; j += 1) {
            var x = patternPostion[i]
            var y = patternPostion[j]
            if (!((x === 6 && y === 50) || (y === 6 && x === 50) || (x === 6 && y === 6))) {
              var rectX = 3 * (x - 2) + 12
              var rectY = 3 * (y - 2) + 12
              var rectWidth = (3 * (x + 3) + 12) - rectX
              var rectHeight = (3 * (y + 3) + 12) - rectY

              var rectData = qrCanvas.getContext('2d').getImageData(rectX, rectY, rectWidth, rectHeight)
              resultCanvas.getContext('2d').putImageData(rectData, rectX, rectY)
            }
          }
        }

        var scaledCanvas = Util.createCanvas(self.size, new Image())
        if (typeof self.background !== 'undefined') {
          scaledCanvas.getContext('2d').drawImage(bgCanvas, scaledPadding, scaledPadding, self.size - scaledPadding * 2, self.size - scaledPadding * 2)
        }
        scaledCanvas.getContext('2d').drawImage(coverImage, scaledPadding, scaledPadding, self.size - scaledPadding * 2, self.size - scaledPadding * 2)
        scaledCanvas.getContext('2d').drawImage(resultCanvas, 0, 0, self.size, self.size)
        if (callback instanceof Function) {
          callback(scaledCanvas)
        } else if (callback instanceof Element) {
          callback.innerHTML = ''
          callback.appendChild(scaledCanvas)
        } else {
          throw new TypeError('Parameter type of `make()` must be Function or Element.')
        }
      }
    }
  }
}

if (window) {
  window.QArt = QArt
}
export default QArt
