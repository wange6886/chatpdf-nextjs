// 解决 pdfjs-dist 在 Node.js 环境中找不到浏览器原生 API (DOMMatrix) 的问题
if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {};
}
