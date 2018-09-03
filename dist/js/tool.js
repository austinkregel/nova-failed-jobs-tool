/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(8)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(21);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

window.RunPrism = function () {
    /* http://jasonrivers.github.io/prism/download.html?themes=prism&languages=clike+php+php-extras&plugins=line-highlight+line-numbers */
    self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {};var Prism = function () {
        var e = /\blang(?:uage)?-(?!\*)(\w+)\b/i,
            t = self.Prism = { util: { encode: function encode(e) {
                    return e instanceof n ? new n(e.type, t.util.encode(e.content)) : "Array" === t.util.type(e) ? e.map(t.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
                }, type: function type(e) {
                    return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1];
                }, clone: function clone(e) {
                    var n = t.util.type(e);switch (n) {case "Object":
                            var r = {};for (var a in e) {
                                e.hasOwnProperty(a) && (r[a] = t.util.clone(e[a]));
                            }return r;case "Array":
                            return e.slice();}return e;
                } }, languages: { extend: function extend(e, n) {
                    var r = t.util.clone(t.languages[e]);for (var a in n) {
                        r[a] = n[a];
                    }return r;
                }, insertBefore: function insertBefore(e, n, r, a) {
                    a = a || t.languages;var i = a[e],
                        o = {};for (var l in i) {
                        if (i.hasOwnProperty(l)) {
                            if (l == n) for (var s in r) {
                                r.hasOwnProperty(s) && (o[s] = r[s]);
                            }o[l] = i[l];
                        }
                    }return a[e] = o;
                }, DFS: function DFS(e, n) {
                    for (var r in e) {
                        n.call(e, r, e[r]), "Object" === t.util.type(e) && t.languages.DFS(e[r], n);
                    }
                } }, highlightAll: function highlightAll(e, n) {
                for (var r, a = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'), i = 0; r = a[i++];) {
                    t.highlightElement(r, e === !0, n);
                }
            }, highlightElement: function highlightElement(r, a, i) {
                for (var o, l, s = r; s && !e.test(s.className);) {
                    s = s.parentNode;
                }if (s && (o = (s.className.match(e) || [, ""])[1], l = t.languages[o]), l) {
                    r.className = r.className.replace(e, "").replace(/\s+/g, " ") + " language-" + o, s = r.parentNode, /pre/i.test(s.nodeName) && (s.className = s.className.replace(e, "").replace(/\s+/g, " ") + " language-" + o);var c = r.textContent;if (c) {
                        var g = { element: r, language: o, grammar: l, code: c };if (t.hooks.run("before-highlight", g), a && self.Worker) {
                            var u = new Worker(t.filename);u.onmessage = function (e) {
                                g.highlightedCode = n.stringify(JSON.parse(e.data), o), t.hooks.run("before-insert", g), g.element.innerHTML = g.highlightedCode, i && i.call(g.element), t.hooks.run("after-highlight", g);
                            }, u.postMessage(JSON.stringify({ language: g.language, code: g.code }));
                        } else g.highlightedCode = t.highlight(g.code, g.grammar, g.language), t.hooks.run("before-insert", g), g.element.innerHTML = g.highlightedCode, i && i.call(r), t.hooks.run("after-highlight", g);
                    }
                }
            }, highlight: function highlight(e, r, a) {
                var i = t.tokenize(e, r);return n.stringify(t.util.encode(i), a);
            }, tokenize: function tokenize(e, n) {
                var r = t.Token,
                    a = [e],
                    i = n.rest;if (i) {
                    for (var o in i) {
                        n[o] = i[o];
                    }delete n.rest;
                }e: for (var o in n) {
                    if (n.hasOwnProperty(o) && n[o]) {
                        var l = n[o],
                            s = l.inside,
                            c = !!l.lookbehind,
                            g = 0;l = l.pattern || l;for (var u = 0; u < a.length; u++) {
                            var f = a[u];if (a.length > e.length) break e;if (!(f instanceof r)) {
                                l.lastIndex = 0;var h = l.exec(f);if (h) {
                                    c && (g = h[1].length);var d = h.index - 1 + g,
                                        h = h[0].slice(g),
                                        p = h.length,
                                        m = d + p,
                                        v = f.slice(0, d + 1),
                                        y = f.slice(m + 1),
                                        k = [u, 1];v && k.push(v);var b = new r(o, s ? t.tokenize(h, s) : h);k.push(b), y && k.push(y), Array.prototype.splice.apply(a, k);
                                }
                            }
                        }
                    }
                }return a;
            }, hooks: { all: {}, add: function add(e, n) {
                    var r = t.hooks.all;r[e] = r[e] || [], r[e].push(n);
                }, run: function run(e, n) {
                    var r = t.hooks.all[e];if (r && r.length) for (var a, i = 0; a = r[i++];) {
                        a(n);
                    }
                } } },
            n = t.Token = function (e, t) {
            this.type = e, this.content = t;
        };if (n.stringify = function (e, r, a) {
            if ("string" == typeof e) return e;if ("[object Array]" == Object.prototype.toString.call(e)) return e.map(function (t) {
                return n.stringify(t, r, e);
            }).join("");var i = { type: e.type, content: n.stringify(e.content, r, a), tag: "span", classes: ["token", e.type], attributes: {}, language: r, parent: a };"comment" == i.type && (i.attributes.spellcheck = "true"), t.hooks.run("wrap", i);var o = "";for (var l in i.attributes) {
                o += l + '="' + (i.attributes[l] || "") + '"';
            }return "<" + i.tag + ' class="' + i.classes.join(" ") + '" ' + o + ">" + i.content + "</" + i.tag + ">";
        }, !self.document) return self.addEventListener ? (self.addEventListener("message", function (e) {
            var n = JSON.parse(e.data),
                r = n.language,
                a = n.code;self.postMessage(JSON.stringify(t.tokenize(a, t.languages[r]))), self.close();
        }, !1), self.Prism) : self.Prism;var r = document.getElementsByTagName("script");return r = r[r.length - 1], r && (t.filename = r.src, document.addEventListener && !r.hasAttribute("data-manual") && document.addEventListener("DOMContentLoaded", t.highlightAll)), self.Prism;
    }();"undefined" != typeof module && module.exports && (module.exports = Prism);;
    Prism.languages.clike = { comment: { pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g, lookbehind: !0 }, string: /("|')(\\?.)*?\1/g, "class-name": { pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/gi, lookbehind: !0, inside: { punctuation: /(\.|\\)/ } }, keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g, "boolean": /\b(true|false)\b/g, "function": { pattern: /[a-z0-9_]+\(/gi, inside: { punctuation: /\(/ } }, number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g, operator: /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|\~|\^|\%/g, ignore: /&(lt|gt|amp);/gi, punctuation: /[{}[\];(),.:]/g };;
    Prism.languages.php = Prism.languages.extend("clike", { keyword: /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/gi, constant: /\b[A-Z0-9_]{2,}\b/g, comment: { pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])(\/\/|#).*?(\r?\n|$))/g, lookbehind: !0 } }), Prism.languages.insertBefore("php", "keyword", { delimiter: /(\?>|<\?php|<\?)/gi, variable: /(\$\w+)\b/gi, "package": { pattern: /(\\|namespace\s+|use\s+)[\w\\]+/g, lookbehind: !0, inside: { punctuation: /\\/ } } }), Prism.languages.insertBefore("php", "operator", { property: { pattern: /(->)[\w]+/g, lookbehind: !0 } }), Prism.languages.markup && (Prism.hooks.add("before-highlight", function (e) {
        "php" === e.language && (e.tokenStack = [], e.code = e.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/gi, function (n) {
            return e.tokenStack.push(n), "{{{PHP" + e.tokenStack.length + "}}}";
        }));
    }), Prism.hooks.add("after-highlight", function (e) {
        if ("php" === e.language) {
            for (var n, a = 0; n = e.tokenStack[a]; a++) {
                e.highlightedCode = e.highlightedCode.replace("{{{PHP" + (a + 1) + "}}}", Prism.highlight(n, e.grammar, "php"));
            }e.element.innerHTML = e.highlightedCode;
        }
    }), Prism.hooks.add("wrap", function (e) {
        "php" === e.language && "markup" === e.type && (e.content = e.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, '<span class="token php">$1</span>'));
    }), Prism.languages.insertBefore("php", "comment", { markup: { pattern: /<[^?]\/?(.*?)>/g, inside: Prism.languages.markup }, php: /\{\{\{PHP[0-9]+\}\}\}/g }));;
    Prism.languages.insertBefore("php", "variable", { "this": /\$this/g, global: /\$_?(GLOBALS|SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/g, scope: { pattern: /\b[\w\\]+::/g, inside: { keyword: /(static|self|parent)/, punctuation: /(::|\\)/ } } });;
    !function () {
        function e(e, t) {
            return Array.prototype.slice.call((t || document).querySelectorAll(e));
        }function t(e, t) {
            return t = " " + t + " ", (" " + e.className + " ").replace(/[\n\t]/g, " ").indexOf(t) > -1;
        }function n(e, n, r) {
            for (var i, a = n.replace(/\s+/g, "").split(","), l = +e.getAttribute("data-line-offset") || 0, o = parseFloat(getComputedStyle(e).lineHeight), d = 0; i = a[d++];) {
                i = i.split("-");var c = +i[0],
                    h = +i[1] || c,
                    s = document.createElement("div");s.textContent = Array(h - c + 2).join(" \r\n"), s.className = (r || "") + " line-highlight", t(e, "line-numbers") || (s.setAttribute("data-start", c), h > c && s.setAttribute("data-end", h)), s.style.top = (c - l - 1) * o + "px", t(e, "line-numbers") ? e.appendChild(s) : (e.querySelector("code") || e).appendChild(s);
            }
        }function r() {
            var t = location.hash.slice(1);e(".temporary.line-highlight").forEach(function (e) {
                e.parentNode.removeChild(e);
            });var r = (t.match(/\.([\d,-]+)$/) || [, ""])[1];if (r && !document.getElementById(t)) {
                var i = t.slice(0, t.lastIndexOf(".")),
                    a = document.getElementById(i);a && (a.hasAttribute("data-line") || a.setAttribute("data-line", ""), n(a, r, "temporary "), document.querySelector(".temporary.line-highlight").scrollIntoView());
            }
        }if (window.Prism) {
            var i = (crlf = /\r?\n|\r/g, 0);Prism.hooks.add("after-highlight", function (t) {
                var a = t.element.parentNode,
                    l = a && a.getAttribute("data-line");a && l && /pre/i.test(a.nodeName) && (clearTimeout(i), e(".line-highlight", a).forEach(function (e) {
                    e.parentNode.removeChild(e);
                }), n(a, l), i = setTimeout(r, 1));
            }), addEventListener("hashchange", r);
        }
    }();;
    Prism.hooks.add("after-highlight", function (e) {
        var n = e.element.parentNode;if (n && /pre/i.test(n.nodeName) && -1 !== n.className.indexOf("line-numbers")) {
            var t,
                a = 1 + e.code.split("\n").length;lines = new Array(a), lines = lines.join("<span></span>"), t = document.createElement("span"), t.className = "line-numbers-rows", t.innerHTML = lines, n.hasAttribute("data-start") && (n.style.counterReset = "linenumber " + (parseInt(n.getAttribute("data-start"), 10) - 1)), e.element.appendChild(t);
        }
    });;
};

Nova.booting(function (Vue, router) {
    Vue.component('nova-stacktrace', __webpack_require__(5));
    Vue.component('nova-trace-card', __webpack_require__(11));
    router.addRoutes([{
        name: 'nova-failed-jobs',
        path: '/nova-failed-jobs',
        component: __webpack_require__(16)
    }]);
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(6)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(9)
/* template */
var __vue_template__ = __webpack_require__(10)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4b7dec30"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Stacktrace.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4b7dec30", Component.options)
  } else {
    hotAPI.reload("data-v-4b7dec30", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("70811265", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4b7dec30\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Stacktrace.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4b7dec30\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Stacktrace.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['code', 'first', 'showVendor'],
    data: function data() {
        return {
            display: false,
            loaded: false
        };
    },

    methods: {
        toggleDisplay: function toggleDisplay() {
            this.display = !this.display;
            if (!this.loaded) {
                this.loaded = true;
                this.showTrace();
            }
        },
        showTrace: function showTrace() {
            Prism.highlightAll();
            console.log(this.code);
        }
    },

    mounted: function mounted() {
        if (this.first) this.display = this.first;
    }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "border-t border-grey-light cursor-pointer" },
    [
      _c(
        "div",
        {
          staticClass: "bg-grey-darker text-sm w-full p-2 text-white block",
          on: { click: _vm.toggleDisplay }
        },
        [
          _c("span", { staticClass: "text-monospace" }, [
            _vm._v(
              _vm._s(_vm.code.file) + " — " + _vm._s(_vm.code.frame || "{main}")
            )
          ])
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "overflow-hidden" }, [
        _c(
          "pre",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.display,
                expression: "display"
              }
            ],
            staticClass:
              "language-php text-sm text-base line-numbers language-php",
            staticStyle: { margin: "-1.7em -1em" },
            attrs: {
              "data-line": 6,
              "data-start": _vm.code.line - 5,
              "data-end": _vm.code.line + 5
            }
          },
          [
            _vm._v("            "),
            _c("code", {
              staticClass: "w-full block",
              domProps: {
                textContent: _vm._s(Object.values(_vm.code.code).join(""))
              }
            }),
            _vm._v("\n            "),
            _c(
              "div",
              {
                staticClass: "mb-2 absolute text-sm",
                staticStyle: { bottom: "1.4rem", left: "1rem" }
              },
              [_vm._v(_vm._s(_vm.code.file))]
            ),
            _vm._v("\n        ")
          ]
        )
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4b7dec30", module.exports)
  }
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(12)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(14)
/* template */
var __vue_template__ = __webpack_require__(15)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-13a05d9a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/TraceCard.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-13a05d9a", Component.options)
  } else {
    hotAPI.reload("data-v-13a05d9a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("0c6ba9cf", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-13a05d9a\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TraceCard.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-13a05d9a\",\"scoped\":true,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TraceCard.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['job', 'showVendorTrace'],
    data: function data() {
        return {
            spin: false
        };
    },

    computed: {
        stack: function stack() {
            var _this = this;

            return this.job.codestack.filter(function (code) {
                if (_this.showVendorTrace) {
                    return true;
                }

                return !code.file.includes('/vendor/');
            });
        }
    },
    methods: {
        rerunTheJob: function rerunTheJob() {
            this.$toasted.show('Attempting to try the job again! Give it time to process!', { type: 'success' });
            this.spin = true;
            axios.post('/nova-vendor/kregel/nova-failed-jobs/rerun-job/' + this.job.id);
        }
    }
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "card",
    { staticClass: "bg-white text-white items-center my-3" },
    [
      _c("heading", { staticClass: "px-2 py-4" }, [
        _vm._v(_vm._s(_vm.job.message))
      ]),
      _vm._v(" "),
      _vm._l(_vm.stack, function(code, $i) {
        return _c("nova-stacktrace", {
          key: code.id,
          attrs: {
            code: code,
            first: $i === 0,
            "show-vendor": _vm.showVendorTrace
          }
        })
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass:
            "p-2 bg-grey-darker rounded-b border-t border-grey-light flex"
        },
        [
          _c(
            "span",
            {
              staticClass:
                "bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2"
            },
            [
              _vm._v(
                "\n            #connection-" +
                  _vm._s(_vm.job.connection) +
                  "\n        "
              )
            ]
          ),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass:
                "bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2"
            },
            [
              _vm._v(
                "\n            #queue-" + _vm._s(_vm.job.queue) + "\n        "
              )
            ]
          ),
          _vm._v(" "),
          _vm._l(_vm.job.args, function(arg, $i) {
            return arg && arg.length !== 0
              ? _c(
                  "span",
                  {
                    staticClass:
                      "bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2"
                  },
                  [
                    _vm._v(
                      "\n            #" +
                        _vm._s($i) +
                        "-" +
                        _vm._s(arg) +
                        "\n        "
                    )
                  ]
                )
              : _vm._e()
          }),
          _vm._v(" "),
          _c("span", { staticClass: "flex-grow" }, [_vm._v(" ")]),
          _vm._v(" "),
          _c(
            "svg",
            {
              staticClass:
                "bg-grey-lighter text-grey-darker fill-current rounded-full h-6 w-6",
              class: { "spin-the-thing": _vm.spin },
              attrs: {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 20 20"
              },
              on: { click: _vm.rerunTheJob }
            },
            [
              _c("path", {
                attrs: {
                  d:
                    "M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"
                }
              })
            ]
          )
        ],
        2
      )
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-13a05d9a", module.exports)
  }
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(19)
/* template */
var __vue_template__ = __webpack_require__(20)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/components/Tool.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-68ff5483", Component.options)
  } else {
    hotAPI.reload("data-v-68ff5483", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            failedJobs: [],
            showVendorTrace: false,
            loading: true
        };
    },

    methods: {
        getFailedJobs: function getFailedJobs() {
            var _this = this;

            this.loading = true;
            axios.get('/nova-vendor/kregel/nova-failed-jobs/failed-jobs').then(function (res) {
                _this.failedJobs = res.data;
                _this.highlight();
                _this.loading = false;
            });
        },
        refreshJobList: function refreshJobList() {
            this.getFailedJobs();
        },
        toggleVendorTrace: function toggleVendorTrace() {
            this.showVendorTrace = !this.showVendorTrace;
            this.highlight();
        },
        highlight: function highlight() {
            setTimeout(function () {
                return Prism.highlightAll();
            }, 10);
        }
    },
    mounted: function mounted() {
        this.getFailedJobs();
        RunPrism();
    }
});

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c(
      "div",
      { staticClass: "flex" },
      [
        _c("heading", { staticClass: "mb-6 flex-grow" }, [
          _vm._v("\n            Failed Job Manager\n        ")
        ]),
        _vm._v(" "),
        _c(
          "button",
          {
            staticClass: "h-8 bg-blue text-white px-2 rounded shadow ml-4",
            on: {
              click: function($event) {
                $event.preventDefault()
                return _vm.refreshJobList($event)
              }
            }
          },
          [_vm._v("\n            Refresh Job List\n        ")]
        ),
        _vm._v(" "),
        _c(
          "button",
          {
            staticClass: "h-8 bg-blue text-white px-2 rounded shadow ml-4",
            on: {
              click: function($event) {
                $event.preventDefault()
                return _vm.toggleVendorTrace($event)
              }
            }
          },
          [_vm._v("\n            Show Vendor Trace\n        ")]
        )
      ],
      1
    ),
    _vm._v(" "),
    !_vm.loading
      ? _c(
          "div",
          _vm._l(_vm.failedJobs.data, function(job) {
            return _c("nova-trace-card", {
              key: job.id,
              attrs: { job: job, "show-vendor-trace": _vm.showVendorTrace }
            })
          })
        )
      : _c("div", { staticClass: "text-center" }, [
          _c(
            "svg",
            {
              staticClass: "spin-the-thing h-16 w-16 text-grey-darkest",
              attrs: {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 20 20"
              }
            },
            [
              _c("path", {
                attrs: {
                  d:
                    "M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"
                }
              })
            ]
          )
        ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-68ff5483", module.exports)
  }
}

/***/ }),
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);