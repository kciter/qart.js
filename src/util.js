class Util {
  static createCanvas(size, image) {
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.getContext('2d').drawImage(image, 0, 0, size, size);
    return canvas;
  }

  static threshold(r, g, b, value) {
    return (0.2126*r + 0.7152*g + 0.0722*b >= value) ? 255 : 0;
  }
}

export default Util;