(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./src/App/Component.js":
/*!******************************!*\
  !*** ./src/App/Component.js ***!
  \******************************/
/*! exports provided: Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Component\", function() { return Component; });\nclass Component {\n    constructor(hostElementID, insertBefore = false) {\n        if (hostElementID) {\n            this.hostElement = document.getElementById(hostElementID);\n        } else {\n            this.hostElement = document.body;\n        }\n        this.insertBefore = insertBefore;\n    }\n\n    detach() {\n        if(this.element) {\n            this.element.remove();\n        }\n    }\n\n    attach() {\n        this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/App/Component.js?");

/***/ }),

/***/ "./src/App/Tooltip.js":
/*!****************************!*\
  !*** ./src/App/Tooltip.js ***!
  \****************************/
/*! exports provided: ToolTip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ToolTip\", function() { return ToolTip; });\n/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ \"./src/App/Component.js\");\n\n\nclass ToolTip extends _Component__WEBPACK_IMPORTED_MODULE_0__[\"Component\"] {\n    constructor(closeNotifierFn, text, hostElementID) {\n        super(hostElementID)\n        this.closeNotifier = closeNotifierFn;\n        this.text = text;\n        this.createTooltipElement();\n    }\n\n    closeTooltip() {\n        this.detach();\n        this.closeNotifier();\n    }\n\n    createTooltipElement() {\n        const tooltipelement = document.createElement('div');\n        tooltipelement.classList = 'card';\n        const tooltipTemplate = document.getElementById('tooltip');\n        const tooltipBody = document.importNode(tooltipTemplate.content, true);\n        tooltipBody.querySelector('p').textContent = `${this.text}`;\n        tooltipelement.appendChild(tooltipBody);\n\n        const hostPosLeft = this.hostElement.offsetLeft;\n        const hostPosTop = this.hostElement.offsetTop;\n        const hostHeight = this.hostElement.clientHeight;\n        const scrollingValue = this.hostElement.parentElement.scrollTop;\n\n        const x = hostPosLeft + 20;\n        const y = hostPosTop + hostHeight - 10 - scrollingValue;\n\n        tooltipelement.style.position = 'absolute';\n        tooltipelement.style.left = x + 'px';\n        tooltipelement.style.top = y + 'px';\n\n        this.element = tooltipelement;\n        tooltipelement.addEventListener('click', this.closeTooltip.bind(this));\n    }\n}\n\n//# sourceURL=webpack:///./src/App/Tooltip.js?");

/***/ })

}]);