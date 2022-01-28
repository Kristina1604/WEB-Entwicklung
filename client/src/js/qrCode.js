const {
  createElement, addElement
} = require('./domHelper.js');

function createQrDiv (dataObject) {
  const QRCode = require('qrcode');
  const canvas = createElement('canvas');
  const dataString = JSON.stringify(dataObject);
  QRCode.toCanvas(canvas, dataString, { width: 100 });
  const wrapper = createElement('div');
  addElement(wrapper, canvas);
  return wrapper;
}

module.exports = {
  createQrDiv: createQrDiv
};
