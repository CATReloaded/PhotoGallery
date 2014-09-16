;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("dropzone/index.js", function(exports, require, module){


/**
 * Exposing dropzone
 */
module.exports = require("./lib/dropzone.js");

});
require.register("dropzone/lib/dropzone.js", function(exports, require, module){
/*
#
# More info at [www.dropzonejs.com](http://www.dropzonejs.com)
# 
# Copyright (c) 2012, Matias Meno  
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
*/


(function() {
  var Dropzone, Em, camelize, contentLoaded, noop, without,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Em = typeof Emitter !== "undefined" && Emitter !== null ? Emitter : require("emitter");

  noop = function() {};

  Dropzone = (function(_super) {
    var extend;

    __extends(Dropzone, _super);

    /*
    This is a list of all available events you can register on a dropzone object.
    
    You can register an event handler like this:
    
        dropzone.on("dragEnter", function() { });
    */


    Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "selectedfiles", "addedfile", "removedfile", "thumbnail", "error", "errormultiple", "processing", ;

    Dropzone.prototype.getQueuedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === Dropzone.QUEUED) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getUploadingFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === Dropzone.UPLOADING) {
            ignoreHiddenFiles: true,
 _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.init = function() {
      var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1,
        _this = this;
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }
      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }
      if (this.clickableElements.length) {
        setupHiddenFileInput = function() {
          if (_this.hiddenFileInput) {
            document.body.removeChild(_this.hiddenFileInput);
          }
          _this.hiddenFileInput = document.createElement("input");
          _this.hiddenFileInput.setAttribute("type", "file");
          if ((_this.options.maxFiles == null) || _this.options.maxFiles > 1) {
            _this.hiddenFileInput.setAttribute("multiple", "multiple");
          }
          if (_this.options.acceptedFiles != null) {
            _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
          }
          _this.hiddenFileInput.style.visibility = "hidden";
          _this.hiddenFileInput.style.position = "absolute";
          _this.hiddenFileInput.style.top = "0";
          _this.hiddenFileInput.style. (       ˜êu©±HÉAÁQ%‡:ñ@,º³õH`oc«şùo¶ˆçÓÉˆ;
            continue;
          }
        }
        if (!messageElement) {
          messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
          this.element.appendChild(messageElement);
        }
        span = messageElement.getElementsByTagName("span")[0];
        if (span) {
          span.textContent = this.options.dictFallbackMessage;
        }
        return this.element.appendChild(this.getFallbackForm());
      },
      resize: function(file)@ı°Ö.7ÔíG™úØnÙM¤³¶ßÉ"34xÎ”f«İd\Ô.ÇšyL–Â¼XGã‡Åü¼C³—dàH/<Ÿ¾‚-m„«yîŠ%bkóï\•EDåˆ‰Ğüµ˜È$¼Í£Éb7È°okî(Ø$½Iõ]ˆb}'²†zë­3õÖ8Úfßš%W'mŸò¯'Ğğ¸Úêˆ·dsÍÀ
9Š› ëß£¯£U#$ì‡ór{‚w‹_C³87$°ûÛáÉ95İå· ±–@–Ü+~“…‘á…xTnóc´=nÜâïS°ğU(:±òZz"¼ø‡¥ÀCû|)³~«³­ˆˆÍ1éß™±±Óv•iâõ·¼ä{%+8;úÛü4¶Vµ‚XŒÜã²åµy?Õä¼c23šÑıµ;EiÇ‹Âî'o:jéÚBù·~únïCœw·ãUº<·2‡~»Üÿ½ß?1s¹9!<}‡ĞB"Ş}fÖVŞU_»]c< …Â¸Ğv³—)ß0	í3‰ğH÷R¬¤µ9±_N_Ş©P¦…·?1Ëyh:)k†‡Õƒ#àïóŠ©šóÍû"®4õêy–f5°ı{OóÎí´8EJr°ëw–³ªõQ4u¾#œ¬zù©.§'rÚŸ«le¡Ü4ŸØ]m›D Ÿ%~Ø´pZ…óÇØ5)lxh“ø^ŠxEÓoœQ×ÖãŞ•Ü™û@ÄœUSÓs}eº0¢™ÖCWq{‰•[2¼/udt£!LôÓÑ¨Lµ­®€ßÖÃ(gÇÀŞ~á¨¸ÜXÀ’Cà†ït”m‘aÁú\‹w0Ìò4í£*\	¿ùq[,Ü½–Ù©ÏT%|? ¾Î·µ{êŸs@3lz5¿ôt©G.o{Gøiá•µs½B_dšØ9B}°ıóïeÒÇ6€>è§Ïn*0õôƒx6T0X3tjƒÙ-È¼Çó)ø&ªS	ËcAC;f-Y‡kÌšÅ‡	<S"¬,RÀ†ÕV(E´[MÉ,ëˆ#ÚïÏ¿(ÙW›xúIêÔ¶g
|
Ca Ç¯iôw½€{rªa¸TÇ%üY = (file.height - info.srcHeight) / 2;
        return info;
      },
      /*
      Those functions register themselves to the events on init and handle all
      the user interface specific stuff. Overwriting them won't break the upload
      but can break the way it's displayed.
      You can overwrite them if you don't like the default behavior. If you just
      want to add an additional event handler, register it on the dropzone object
      and don't overwrite those options.
      */

      drop: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragstart: noop,
      dragend: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragenter: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragover: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragleave: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      selectedfiles: function(files) {
        if (this.element === this.previewsContainer) {
          return this.element.classList.add("dz-started");
        }
      },
      reset: function() {
        return this.element.classList.remove("dz-started");
      },
      addedfile: function(file) {
        var node, _i, _j, _len, _len1, _ref, _ref1,
          _this = this;
        file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
        file.previewTemplate = file.previewElem 4       ¬Ñû°5P­=oœÔgşt1[ÔÔnF&évíÑ _CÛ 5î¡†ÃiBô—ˆpEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.pushc       í é%êH½ê‚nø~QåÖ™nilvë"¸„¸;déË©6>ÒàC!ƒ’—ò Ö!©E½P˜m`Ï#Ñ}á•jİ.iªï1]7±”ñ¿/g&ûh¥s!%8 b­ )êÌ“›éP»NÒš"æ¯¿Rá?U¢ÚæÆvM]ÃºÃ¸øÙâ‚Vr©­G–rÕV§¯£ôS|™ëU|7…5—U!ÔtIn«6Æg›[­Ø®ëÒËÕTû™8KŞÊ'ÑÆ"s‚p«}n²S¡ÅøZ¬_6;“vØ¸V‰T(„w•ü¨‰‡²ÆTîîÚ[ …îØOñlHhS6Y|ÁD'ÑBB·û0s
xã­	ƒ¨£Ìß§ËPK¡ôáËLw3u8Y“×½""äˆ]Ûh–äEY.ÌÑt¨3ÇÕusàFL=‹·çn3Rô…¾şNWNLŠ}oˆ´×?q¡óqu¼ú™\ÉÄÓ;G-Æ…mÅDdÂ:à$¶“ì­öëÊG¡I^1=·ew5 ™ëq€PíÓn<Od§xÊÆJÔ…aeÊlcÑ4Wh ÓëÜÊSÇécwN¿®ŸÒ\û%.«jƒ¿¬aag_Ânù}àúl+ŞÊ>JNá3É~dø_—š=¼ê¼¼7i.{»¬C‘¼Ú7í}‘­d…W9ãF)Œoíí{³‚Cä³Û Çæm3QPaä%azÎ»¹@®·JHÈá…«ˆ@P0gÁá0§r+%=Í]ƒá•†NZ'jıŸ°¥p5d%ï¢$v-É¤ÈŠ9¥ª?=3ÁâJF|àÑã,šróû+n•ÀQê‡]±¡ÁİØ'Cç^U Ò#õˆüqOf„*ëé…eñ¡¯+Ä1£™dÂ—7ÍQ»Y*´”ÿ™®1õ¬Œ–’DîkÙ*¢˜áğC¶
r`g>Yû¥ÜQü¯bñm—O7	ü•.¨ ò‡Ã;
©ÊÄ¥hİ€1Ÿªm@/^Ú>óÇh3F¤q“{"ÄM=$}³.c?0íß¤¡ê¨õ³TóOÜB¥ôÙ›•@ds#{L¥A]š¾û#€ˆÅ‰qùÖâÏè8•áx•íĞKCoGøúJkU;¿î<†œ!\ÃF;uíÙHb}•ğôa j¦Şóa§Ô¯>B¾ÇE»‰4Î26áô“Ÿ#Èb÷ä„î3Ì|&yC¢æ›QoZÓòKò!>¿²–®ä1ó£)áÁE[Q’|±'¥È N±àXnEN«í±aø¬;Ù'H-
)SÁ
ıpğÉ}šº¥ŞïØ´”–‰d®ã5*èš–cÂj0İØğ‚¾vQ¼ÖÔîz ÔöCŞÏæİÍ%î‘K…5¡MN®ó&¼ªü3Üwİğ¨<1t˜úz!&$}ÉÚè×sÍM7h”i°óüó:5ë²Û$´^çÌÌ¯\8bZ
L”7·@¤ù&ê™ÇáßØà ä÷K6}“R&×ûSÓx~¾nçûm4vV0;¥€¢íMÏ âîtÜ'e3äÔ‹´Ígƒ5¸$óšáumqpwÓü;ãaÆ@&ë~(j…^İ(€¼´'/ºÎ÷>ë€(rì†*È“i;Ãr à `¨¸±frWe*?&ÆmW<„
İjØå·¤bXe\\v—L<î[Ä	Q,÷>Y·|
va$/âõŞ3Ü $ú<
h¼Ï‡`¨­ ñ–.Ú×*ÿj ¶ÕÑjŞr²±KNÍò‰şÕ.ˆ        size = sge-preview");
        _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thumbnailElement = _ref[_i];
          thumbnailElement.alt = file.name;
          _results.push(thumbnailElement.src = dataUrl);
        }
        return _results;
      },
      error: function(file, message) {
        var node, _i, _len, _ref, _results;
        file.previewElement.classList.add("dz-error");
        if (typeof message !== "String" && message.error) {
          message = message.error;
        }
        _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          nod/*
 * Social Buttons for Bootstrap
 *
 * Copyright 2013 Panayiotis Lipiridis
 * Licensed under the MIT License
 *
 * https://github.com/lipis/bootstrap-social
 */

.btn-social{position:relative;padding-lefsList.add("dz-processing");
        if (file._removeLink) {
          return file._removeLink.textContent = this.options.dictCancelUpload;
        }
      },
      processingmultiple: noop,
      uploadprogress: function(file, progress, bytesSent) {
        var node, _i, _len, _ref, _results;
        _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          _results.push(node.style.width = "" + progress + "%");
        }
        return _results;
      },
      totaluploadprogress: noop,
      sending: noop,
      sendingmultiple: noop,
      success: function(file) {
        return file.previewElement.classList.add("dz-success");
      },
      successmultiple: noop,
      canceled: function(file) {
        return this.emit("error", file, "Upload canceled.");
      },
      canceledmultiple: noop,
      complete: function(file) {
        if (file._removeLink) {
          return file._removeLink.textContent = this.options.dictRemoveFile;
        }
      },
      completemultiple: noop,
      maxfilesexceeded: noop,
      maxfilesreached: noop,
      previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></dorder-right:1px solid rgba(0,0,0,0.2)}
.btn-social-icon.btn-c       	uèoZJxYj9ßÃa8Öı#¬S¿õŠ"¡³¨Ô—´ìi¶üîb³hÔo„óøH$Ìtjá,FL­Lñ"!)}‘=GrêısµU}=*	ÍÀèŞ{Í/D¤	k´	D³Ÿ]µÈñMş#RÎ®p+'âI£ãÂBğv¶ı’¡ÂRDéëß¦!!ŠÀËº?Ë~Èå`%Å0Ëß¢–TPSeX…€6Îq.gõ‡3çR³9"¾ë oŞZ@î¸¤¨†áq?ø‹ÙiO‘«jŒı¦/Hî»È"\ü¯oöî’L¯Ã¶:«|ó\¦w–‰Ó(øx“ìÁI“WƒvZJ¸ì·'€¶r©ryå)Zl½ººEÁ£Y$gR,ğ‡Øßíh õ]{HnµÏˆê¡6(a´ˆP1nî¾ÃÕ¸Á‚#îÄJ…5 ‚ÿ=Ç'lâ÷¾·H‹È‚¥te^•Õ…é›…â©Ê'Ûj^8ùQØf°Àv¾bE»4ëè‘cš mHøÊ4Òs„ëÓ]EyTRâòÉ:@'†ÃY,¤‚ *ó%ş‚1tÙµä\á\í-lÎx›ŒåXšz²c4}*zµH2ß>$ÿ~¬j«¸YNš[¶Ä«§*Ø83ì*=„æúc–€XÈgå[½p
!ÓIQZpj$™g÷zÊ±&öùH’ë85gÑ”Ñõ;«ŞxÂ¢8~=]N<„¦)ñä|ÒzÍ€Ê>CM²]ÏW¶¬‡V1«¡M!È‹D~Ak3öÓÉ^V ãŠ…»l…N¹n4Šám=â-€²PgeTVQYgİ,»q[™Zé´ÊäCkzÀÛ6£Öb êËª¿İ{Øh	ŒD`¹©bÛŸÎàœ´åd Õ†g.åj¯9™Bğ{k½òáÔÖ[qvá¦VÔÅZ]Jfª·wíØŒQÓ8%öIR¶l9ùØ`Ô˜µøöeÃ ÿ·Å*sñ7OòC»:n«‡yıšhèxQ-3¾an	û>7c½ š"çzê5Ç“Ê-U^û³?(,ôDåçÍàbLÎ¤-ä_TxÃs®ái7R0ğK1:²¤}ëådeGH§Ø‰ùPfãıd£1À”ø¢ˆ›1V8Å­\Ûÿò9oç“6b.ñÍû |¸z2ªC	?ÄäšÇàVˆÊXN	*7ÓÜ_tÏ¦Œ;[­W¥#vO¶jæÙ”›ÿŞ–$6rjï¹¨Î›å‰x?+å¸§8'‚ <¼~¦oöÇB2©|Ö9U¡¡OZyJˆâ`&¢¸cŠÃœş0÷ÆŞ!ì>•ŒÍ¹÷ 6Ê/ñßŞ«ZÖàD·SÔï=ó·	8€ai“Â_‹nß[‹ï^ù£vƒ>°ÕMüBNxUçT="
G7a€?î¾AE–áˆ¹Ë)Aá…æJ6vœŞL]Ê1ÛbRK…?øĞúi6Eş°êD•'c–˜Z–«àDßXÔ@° ìÊõ¦¹
j$ò«"§úu‹÷¬yìHR$+ë­°/	ªë«$šÔ¥[+¬¾­Ò¨f\-ÏŒ†ÍÈqD9«š”937ÚØqb—AÖÉcõ¥
ÆğøŸÿaH3p:çõk¶„”¹cbË¨²tŞäX&‡	ãñ—2$7Ü£îquQëäR§bá6k¾Dì-—zl—„¹Õ$\nß9j[,×:^¥ãåÒLƒº3 ü¹MÃuØ_P[ÊüDÈ€õçÒEwÁ+ãnces.push(this);Pò  Pò  Pò0  ¬  ¬  ¬     *2$0H`ls = ts;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item !== rejectedItem) {
        _results.push(item);
      }
    }
    return _results;
  };

  camelize = function(str) {
    return str.replace(/[\-_](\w)/g, function(match) {
      return match[1].toUpperCase();
    });
  };

  Dropzone.createElement = function(string) {
    var div;
    div = document.createElement("div");
    div.innerHTML = string;
    return div.childNodes[0];
  };

  Dropzone.elementInside = function(element, container) {
    if (element === container) {
      return true;
    }
    while (element = element.parentNode) {
      if (element === container) {
        return true;
      }
    }
    return false;
  };

  Dropzone.getElement = function(el, name) {
    var element;
    if (typeof el === "string") {
      element = document.querySelector(el);
    } else if (el.nodeType != null) {
      element = el;
    }
    if (element == null) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
    }
    return element;
  };

  Dropzone.getElements = function(els, name) {
    var e, el, elements, _i, _j, _len, _len1, _ref;
    if (els instanceof Array) {
      elements = [];
      try {
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          eElements = [this.element];
        } else {
          this.elements.push(this.getElement(el, name));
        }
      } ble, "clickable");
        }
      }
      this.init();
    }

    Dropzone.prototype.getAcceptedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getRejectedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (!file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getQueuedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === Dropzone.QUEUED) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getUploadingFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === catch (_error) {
        e = _erentObject && root.doScroll) {
        try {
          top = !win.frameElement;
        } catch (_error) {}
        if (top) {
          poll();
        }
      }
      doc[add](pre + "DOMContentLoaded", init, false);
      doc[add](pre + "readystatechange", init, false);
      return win[add](pre + "load", init, false);
    }
  };

  Dropzone._autoDiscoverFunction = function() {
    if (Dropzone.autoDiscover) {
      return Dropzone.discover();
    }
  };

  contentLoaded(window, Dropzone._autoDiscoverFunction);

}).call(this);

});
require.alias("component-emitter/index.js", "dropzone/deps/emitter/index.js");
require.alias("component-emitter/index.js", "emitter/index.js");
if (typeof exports == "object") {
  module.exports = require("dropzone");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("dropzone"); });
} else {
  this["Dropzone"] = require("dropzone");
}})();;, "file");
          if ((_this.options.maxFiles == null) || _this.options.maxFiles > 1) {
            _this.hiddenFileInput.setAttribute("multiple", "multiple");
          }
          if (_this.options.acceptedFiles != null) {
            _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
          }
          _this.hiddenFileInput.style.visibility = "hidden";
          _this.hiddenFileInput.style.position = "absolute";
          _this.hiddenFileIelements.push(this.getElement(el, name));
        }
      } left = "0";
          _this.pe.length) !== -1) {
          return true;
        }
      leInput.style.width = "0";
          document.body.appendChild(_this.hiddenFileInput);
          return _this.hiddenFileInput.addEventListener("change", function() {
            var files;
            files = _this.hiddenFileInput.files;
            if (files.length) {
              _this.emit("selectedfiles", files);
              _this.handleFiles(files);
            }
            return setupHiddenFileInput();
          });
        };
        setupHiddenFileInput();
      }
      this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventName = _ref1[_i];
        this.on(eventName, this.options[eventName]);
      }
      this.on("uploadprogress", function() {
        return _this.updateTotalUploadProgress();
      });
      this.on("removedfile", function() {
        return _this.updateTotalUploadProgress();
      });
      this.on("canceled", function(file) {
        return _this.emit("complete", file);
      });
      noPropagation = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };
      this.listeners = [
        {
          element: this.element,
          events: {
     T–F¬—'dragstart": function(e) {
              return _thisY       ¸éç°õ¼–èß%Ët(·À]x K
'àtÚÇ	l?ëöx³ÿöoKBù¨“ÌO
‹\F€°	±µa1Îúg›2‰r¶DBàr€^hwºw ÔÚˆ±½1¬ÿ×,·dx?eTš”C†gOšÓ‰*m~üFüÀâï/]ÏMë"ÔºŒ<9–ß£Óë„ÇKG)¡§şŸ¯Ä{p±Íè™¬Ó`gËµX¼¥‹-ŠJqláåbtŸâŞƒ3Ì.ÿ]Æ<{¢éœLîkæ¹ÑOÇWmJò¼Pt ¸› úB‚½¡ráçPZ%[ğ×ÌÜœEjºšËÄÇ¡bÓÂ²æRÍ–.vËÿv9ë‘]¬S¥Jª¸“3<lğYµZ™YW<Šı¨’øoè„¨é$I7ĞW?ü6j½”ìŞâŸV|¨×ñ‰ª)õÆºŞMove' === efct ? 'move' : 'copy';
              noPropagation(e);
              return _this.emit("dragover", e);
            },
            "dragleave": function(e) {
              return _this.emit("dragleave", e);
            },
            "drop": function(e) {
              noPropagation(e);
              return _this.drop(e);
            },
            "dragend": function(e) {
              return _this.emit("dragend", e);
            }
          }
        }
      ];
      this.clickableElements.forEach(function(clickableElement) {
        return _this.listeners.push({
          element: clickableElement,
          events: {
            "click": function(evt) {
              if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                return _this.hiddenFileInput.click();
              }
            }
          }
        });
      });
      this.enable();
      return this.options.init.call(this);
    };

    Dropzone.prototype.destroy = function() {
      var _ref;
       '       %•£-ç3kãt¨OuX:¿S{
€tFïNue);
      if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    };

    Dropzone.prototype.updateTotalUploadProgress = function() {
      var acceptedFiles, file, totalBytes, totalBytesSent, totalUploadProgress, _i, _len, _ref;
      totalBytesSent = 0;
      totalBytes = 0;
      acceptedFiles = this.getAcceptedFiles();
      if (acceptedFiles.length) {
        _ref = this.getAcceptedFiles();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }
      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    };

    Dropzone.prototype.getFallbackForm = function() {
      var existingFallback, fields, fieldsString, form;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }
      fieldsString = "<div class=\"dz-fallback\">";
      if (this.options. $       &^[n÷QU qSM“FRªÇ¦TjÆ—/®úeL"<p>" + this.opt/*
 * Social Buttons for Bootstrap
 *
 * Copyright 2013 Panayiotis Lipiridis
 * Licensed under the MIT License
 *
 * https://github.com/lipis/bootstrap-social
 */

.btn-social{position:relative;padding-left:44px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.btn-social :first-child{position:absolute;left:0;top:0;bottom:0;width:32px;line-height:34px;font-size:1.6em;text-align:center;border-right:1px solid rgba(0,0,0,0.2)}
.btn-social.btn-lg{padding-left:61px}.btn-social.btn-lg :first-child{line-height:45px;width:45px;font-size:1.8em}
.btn-social.btn-sm{padding-left:38px}.btn-social.btn-sm :first-child{line-height:28px;width:28px;font-size:1.4em}
.btn-social.btn-xs{padding-left:30px}.btn-social.btn-xs :first-child{line-height:20px;width:20px;font-size:1.2em}
.btn-social-icon{position:relative;padding-left:44px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;height:34px;width:34px;padding-left:0;padding-right:0}.btn-social-icon :first-child{position:absolute;left:0;top:0;bottom:0;width:32px;line-height:34px;font-size:1.6em;text-align:center;bÆŞzl.className)) {
            return el;
          }
        }
      };
      _ref = ["div", "form"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    };

    Dropzone.prototype.setupEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.removeEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.disable = function() {
      var file, _i, _len, _ref, _results;
      this.clickableElements.forEach(function(element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _results.push(this.cancelUpload(file));
      }
      return _results;
    };

    Dropzone.prototype.enable = function() {
      this.clickableElements.forEach(function(element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    };

    Dropzone.prototype.filesize = function(size) {
      var string;
      if (size >= 1024 * 1024 * 1024 * 1024 / 10) {
        size = size / (1024 * 1024 * 1024 * 1024 / 10);
        string = "TiB";
      } else if (size >= 1024 * 1024 * 1024 / 10) {
        size = sket.disabled:active,.btn-bitbucket[disabled]:active,fieldsetHTTP/1.1 200 OK
Date: Mon, 12 May 2014 08:15:53 GMT
Server: Apache
Last-Modified: Mon, 13 Jan 2014 03:50:18 GMT
ETag: "35380b5-3076-4efd1f9621280"
Accept-Ranges: bytes
Cache-Control: max-age=604800
Expires: Mon, 19 May 2014 08:15:53 GMT
Content-Type: text/css
Content-Length: 12406
Connection: Keep-Alive
Age: 0

hj"</strong> " + string;
    };

    Dropzone.prototype._updateMaxFilesReachedClass = function() {
      if ((this.options.maxFiles != null) && this.gPò  Pò  Pò0  ¬  ¬  ¬    *2$0H`l     if (this.getAcceptedFiles().length === this.options.maxFileHTTP/1.1 200 OK
Date: Mon, 12 May 2014 08:15:53 GMT
Server: Apache
Last-Modified: Mon, 13 Jan 2014 03:50:18 GMT
ETag: "35380b5-3076-4efd1f9621280"
Accept-Ranges: bytes
Cache-Control: max-age=604800
Expires: Mon, 19 May 2014 08:15:53 GMT
Content-Type: text/css
Content-Length: 12406
Connection: Keep-Alive
Age: 0

;I) {
        return;
      }
      this.emit("drop", e);
      files = e.dataTransfer.files;
      this.emit("selectedfiles", files);
      if (files.length) {
        items = e.dataTransfer.items;
        if (items && items.length && ((items[0].webkitGetAsEntry != null) || (items[0].getAsEntry != null))) {
          this.handleItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    };

    Dropzone.prototype.handleFiles = function(files) {
      var file, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(this.addFile(file));
      }
      return _results;
    };

    Dropzone.prototype.handleItems = function(items) {
      var entry, item, _i, _len;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (item.webkitGetAsEntry != null) {
          entry = item.webkitGetAsEntry();
          if (entry.isFile) {
            this.addFile(item.getAsFile());
          } else if (entry.isDirectorc       í é%êH½ê‚nø~QåÖ™nilvë"¸„¸;déË©6>ÒàC!ƒ’—ò Ö!c       »Á®l,$š-ÅT9ŸòÅj> –ƒ„ÎUF©Nğc;ÖÀ­^xOLj÷¬ğš_€'´ÆmKñ-§õÛ¨5bKè¿[yĞB0Y¹µ‰;.gF¦ôÔOBMVyØ-U^×êègğ…¢<6_2Ÿ0ÆøäŒDÇ³>z–§*1¥‰„Ãq‘Z]­†G».ä{AAx	…×š¾‡n©ƒë·?5õÜÚâ—?Œ÷€ÿU)R BÌÔª4‘øqÂ©sŞƒT¨›ş_U.çœ0(°{YID”S‘LaŠü~º(Á[ÃáˆzB_áß7<¥¤¯æ¤°z¨·ë³‹ï\„^U©1$l‚¾áõW×ø×Ç¡«ïÍ½^înÜ`JéTñD…ô‘Õvµ»½JøHÒÛ¾ÍºÎ·³·ĞØGt¼É s~mk‡œ›†ö4ƒ¥~ËÒ—ÊZ§]İ¿
.ç•^8ö–oE×w}ÄV["P³….ÁXï’ùT¹Å±£`ó¶©›eˆ@‘~(Ë]çí=ç\Ö(¸Ä'å…ò¢„A°NÃì5¾qhŒ[•>?ï Ï®•Ãô4(wnò) JjQ>¼ej*ˆç–òññO?°W÷áè‰”†(ñäüõ•©SÕØç/<$ü+vâ ¸â1„Jå|Ÿ> jø<ä¨²#gŒrO&{¢ú“ùß³#ß š¿õWÔYq£Ë7ÂÑ[?•v¯Ò‘ÙfÀãÇ°íg%İòoˆëIw‘àˆ§"|ıä‹ß&³î˜)òœ "İ`a£âÌ‹æ¼27Ğböï~S®ø¸îàeMØQ£é>®mº¼U\,Eq;oP‘FAÃ¡Æj#ş¬¢-Ïÿjıë·VôFøĞgr·	æ\6)RZÙ¸&\}=]_)®Œñsµ¯g£Â'®:Ò‡\ëÚAvk‚¯Ã»U²(#ªœ<WÏÎ×w—°Îä³”FÆĞTÁLö~¯Í¶oš%˜ö“QŞ¸ióH––šo_*^±‡Bt!¬T¼F˜RfÆÙQ&°[´«lH‹W­\ƒëocL“~õã)Œ[B²Û_P fyKnõ¿±]
»ùà²@-'±ôcDN¤èª=¹©@Î]LÑ*­R›2Q Ç;$èpXC‰Lô*iÓ’%ş<¥ÔfğWî*t6‰æ"ÇIl!q¶²[tQ¯Ò|?œoè€:nÌ€ "ô9õ† iMbÒ2-‹b©µ¿!¢¦%Á_K]Ë$ìø4/TRMEñ6M,5ëÑh^à:øèšNÀ¯úRkâäİ½Ğµé5ÿ"=QíP8%p®ÅpµÃv?©`ÊÑ»'g¦ù€¤m®m«ÎÄßàS«å–>Úä1s°µ·~ùç}¨–mµšÉş0a5ß	ÊÔwM<Mû$NâOB·­İ"+q¸%V§ö=¹úÜ5Ï^µ‚S¾¿N$‡×|Ë–*t¬Ûææ­3œe¡ŸÅ?œu7tCÕB#jåö¿FåñìFq·¸VÅ´Êh'S-J9LíÏåÉF41¤TH©–ŸÈahq½©4é{øÍetĞ´élˆœw•MØÒ9Zê
wÄñ4ƒÖÑûkŠÖË+TŞ\·ÏlŒé®p†Ì¦¶ª3ÒÂÓßFõVEzU†İwÖ9x zó…Û$}b€ƒ S"Ğæk¾]H]YÙ\ÍÙó 8'*°´ cİ|‘Zß =O™ı”>ºrU³oğL4øvÁÃÀÈFŒy¼ğÄÄz¢irror) {
         $       ¡ûè`.¾—mR9Çõ'™ô­è_€ß} ´MŸ˜u½rorProcessing([file], error);
        } else {
          _this.enqueueFile(file);
        }
        return _this._updateMaxFilesReachedClass();
      });
    };

    Dropzone.prototype.enqueueFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        this.enqueueFile(file);
      }
      return null;
    };

    Dropzone.prototype.enqueueFile = function(file) {
      var _this = this;
      file.accepted = true;
      if (file.status === Dropzone.ADDED) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout((function() {
            return _this.processQueue();
          }), 1);
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    };

    Dropzone.prototype.addDirectory = function(entry, path) {
      var dirReader, entriesReader,
        _this = this;
      dirReader = entry.createReader();
      entriesReader = function(entries) {
        var _i, _len;
        for (_i = 0, _len = entries.length; _i < _len; _i++) {
          entry = entries[_i];
          if (entry.isFile) {
            entry.file(function(file) {
              if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                return;
              }
              file.fullPath = "" + path + "/" + file.name;
              retu C       ›ÄQ{¬¬ˆßİÉ[yÕCn¢|éóÄa¢=b-Ù£W$µe}&ÑñŠR.LMîúL%wšgectory) {
            _this.addDirectory(entry, "" + path + "/" + entry.name);
          }
        }
      };
      return dirReader.readEntries(entriesReader, function(error) {
        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
      });
    };

    Dropzone.prototype.removeFile = function(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);
      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    };

    Dropzone.prototype.removeAllFiles = function(cancelIfNecessary) {
      var file, _i, _len, _ref;
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      _ref = this.files.slice();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    };

    Dropzone.prototype.createThumbnail = function(file) {
      var fileReader,
        _this = this;
      fileReader = new FileReader;
      fileReader.onload = function() {
        var img;
        img = document.createEleme³       î]vu˜™=¨ù[hßPE±üIÏà ú%«0”%I—#ê®pˆ6s_y˜x   resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
          file.width = img.width;
          file.height = img.height;
          resizeInfo = _this.options.resize.call(_this, file);
          if (resizeInfo.trgWidth == null) {
            resizeInfo.trgWidth = _this.options.thumbnailWidth;
          }
          if (resizeInfo.trgHeight == null) {
            resizeInfo.trgHeight = _this.options.thumbnailHeight;
          }
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;
          ctx.drawImage(img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
          thumbnail = canvas.toDataURL("image/png");
          return _this.emit("thumbnail", file, thumbnail);
        };
        return img.src = fileReader.result;
      };
      return fileReader.readAsDataURL(file);
    };

    Dropzone.prototype.processQueue = function() {
      var i, parallelUploads, processingLength, queuedFiles;
      parallelUploads = this.options.parallelUploads;
      processingLength = this.getUploadingFiles().length;
      i = processingLength;
      if (processingLength >= parallelUploads) {
        return;
      }
      queuedFiles = this.getQueuedFiles();
      if (!(queuedFiles.length > 0)) {
        return;
      }
      if (this.options.uploadMultiple) {
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          }
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    };

    Dropzone.prototype.processFile = function(file) {
      return this.processFiles([file]);
    };

    Dropzone.prototype.processFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.processing = true;
        file.status = Dropzone.UPLOADING;
        this.emit("processing", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }
      return this.uploadFiles(files);
    };

    Dropzone.prototype._getFilesWithXhr = function(xhr) {
      var file, files;
      return files = (function() {
        var _i, _len, _ref, _results;
        _ref = this.files;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (file.xhr === xhr) {
            _results.push(file);
          }
        }
        return _results;
      }).call(this);
    };

    Dropzone.prototype.cancelUpload = function(file) {
      var groupedFile, groupedFiles, _i, _j, _len, _len1, _ref;
      if (file.status === Dropzone.UPLOADING) {
        groupedFiles = this._getFilesWithXhr(file.xhr);
        for (_i = 0, _len = groupedFiles.length; _i < _len; _i++) {
          groupedFile = groupedFiles[_i];
          groupedFile.status = Dropzone.CANCELED;
        }
        file.xhr.abort();
        for (_j = 0, _len1 = groupedFiles.length; _j < _len1; _j++) {
          groupedFile = groupedFiles[_j];
          this.emit("canceled", groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if ((_ref = file.status) === Dropzone.ADDED || _ref === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    Dropzone.prototype.uploadFile = function(file) {
      return this.uploadFiles([file]);
    };

    Dropzone.prototype.uploadFiles = function(files) {
      var file, formData, handleError, headerName, headerValue, headers, input, inputName, inputType, key, option, progressObj, response, updateProgress, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4,
        _this = this;
      xhr = new XMLHttpRequest();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.xhr = xhr;
      }
      xhr.open(this.options.method, this.options.url, true);
      xhr.withCredentials = !!this.options.withCredentials;
      response = null;
      handleError = function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
          file = files[_j];
          _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
        }
        return _results;
      };
      updateProgress = function(e) {
        var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
        if (e != null) {
          progress = 100 * e.loaded / e.total;
          for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
            file = files[_j];
            file.upload = {
              progress: progress,
              total: e.total,
              bytesSent: e.loaded
            };
          }
        } else {
          allFilesFinished = true;
          progress = 100;
          for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
            file = files[_k];
            if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
              allFilesFinished = false;
            }
            file.upload.progress = progress;
            file.upload.bytesSent = file.upload.total;
          }
          if (allFilesFinished) {
            return;
          }
        }
        _results = [];
        for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
          file = files[_l];
          _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
        }
        return _results;
      };
      xhr.onload = function(e) {
        var _ref;
        if (files[0].status === Dropzone.CANCELED) {
          return;
        }
        if (xhr.readyState !== 4) {
          return;
        }
        response = xhr.responseText;
        if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
          try {
            response = JSON.parse(response);
          } catch (_error) {
            e = _error;
            response = "Invalid JSON response from server.";
          }
        }
        updateProgress();
        if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
          return handleError();
        } else {
          return _this._finished(files, response, e);
        }
      };
      xhr.onerror = function() {
        if (files[0].status === Dropzone.CANCELED) {
          return;
        }
        return handleError();
      };
      progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
      progressObj.onprogress = updateProgress;
      headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };
      if (this.options.headers) {
        extend(headers, this.options.headers);
      }
      for (headerName in headers) {
        headerValue = headers[headerName];
        xhr.setRequestHeader(headerName, headerValue);
      }
      formData = new FormData();
      if (this.options.params) {
        _ref1 = this.options.params;
        for (key in _ref1) {
          value = _ref1[key];
          formData.append(key, value);
        }
      }
      for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
        file = files[_j];
        this.emit("sending", file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }
      if (this.element.tagName === "FORM") {
        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          input = _ref2[_k];
          inputName = input.getAttribute("name");
          inputType = input.getAttribute("type");
          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            _ref3 = input.options;
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              option = _ref3[_l];
              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
      for (_m = 0, _len4 = files.length; _m < _len4; _m++) {
        file = files[_m];
        formData.append("" + this.options.paramName + (this.options.uploadMultiple ? "[]" : ""), file, file.name);
      }
      return xhr.send(formData);
    };

    Dropzone.prototype._finished = function(files, responseText, e) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    Dropzone.prototype._errorProcessing = function(files, message, xhr) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    return Dropzone;

  })(Em);

  Dropzone.version = "3.7.4";

  Dropzone.options = {};

  Dropzone.optionsForElement = function(element) {
    if (element.getAttribute("id")) {
      return Dropzone.options[camelize(element.getAttribute("id"))];
    } else {
      return void 0;
    }
  };

  Dropzone.instances = [];

  Dropzone.forElement = function(element) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    if ((element != null ? element.dropzone : void 0) == null) {
      throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
    }
    return element.dropzone;
  };

  Dropzone.autoDiscover = true;

  Dropzone.discover = function() {
    var checkElements, dropzone, dropzones, _i, _len, _results;
    if (document.querySelectorAll) {
      dropzones = document.querySelectorAll(".dropzone");
    } else {
      dropzones = [];
      checkElements = function(elements) {
        var el, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )dropzone($| )/.test(el.className)) {
            _results.push(dropzones.push(el));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      checkElements(document.getElementsByTagName("div"));
      checkElements(document.getElementsByTagName("form"));
    }
    _results = [];
    for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
      dropzone = dropzones[_i];
      if (Dropzone.optionsForElement(dropzone) !== false) {
        _results.push(new Dropzone(dropzone));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

  Dropzone.isBrowserSupported = function() {
    var capableBrowser, regex, _i, _len, _ref;
    capableBrowser = true;
    if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
      if (!("classList" in document.createElement("a"))) {
        capableBrowser = false;
      } else {
        _ref = Dropzone.blacklistedBrowsers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          regex = _ref[_i];
          if (regex.test(navigator.userAgent)) {
            capableBrowser = false;
            continue;
          }
        }
      }
    } else {
      capableBrowser = false;
    }
    return capableBrowser;
  };

  without = function(list, rejectedItem) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item !== rejectedItem) {
        _results.push(item);
      }
    }
    return _results;
  };

  camelize = function(str) {
    return str.replace(/[\-_](\w)/g, function(match) {
      return match[1].toUpperCase();
    });
  };

  Dropzone.createElement = function(string) {
    var div;
    div = document.createElement("div");
    div.innerHTML = string;
    return div.childNodes[0];
  };

  Dropzone.elementInside = function(element, container) {
    if (element === container) {
      return true;
    }
    while (element = element.parentNode) {
      if (element === container) {
        return true;
      }
    }
    return false;
  };

  Dropzone.getElement = function(el, name) {
    var element;
    if (typeof el === "string") {
      element = document.querySelector(el);
    } else if (el.nodeType != null) {
      element = el;
    }
    if (element == null) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
    }
    return element;
  };

  Dropzone.getElements = function(els, name) {
    var e, el, elements, _i, _j, _len, _len1, _ref;
    if (els instanceof Array) {
      elements = [];
      try {
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          elements.push(this.getElement(el, name));
        }
      } catch (_error) {
        e = _error;
        elements = null;
      }
    } else if (typeof els === "string") {
      elements = [];
      _ref = document.querySelectorAll(els);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        el = _ref[_j];
        elements.push(el);
      }
    } else if (els.nodeType != null) {
      elements = [els];
    }
    if (!((elements != null) && elements.length)) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
    }
    return elements;
  };

  Dropzone.confirm = function(question, accepted, rejected) {
    if (window.confirm(question)) {
      return accepted();
    } else if (rejected != null) {
      return rejected();
    }
  };

  Dropzone.isValidFile = function(file, acceptedFiles) {
    var baseMimeType, mimeType, validType, _i, _len;
    if (!acceptedFiles) {
      return true;
    }
    acceptedFiles = acceptedFiles.split(",");
    mimeType = file.type;
    baseMimeType = mimeType.replace(/\/.*$/, "");
    for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
      validType = acceptedFiles[_i];
      validType = validType.trim();
      if (validType.charAt(0) === ".") {
        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
          return true;
        }
      } else if (/\/\*$/.test(validType)) {
        if (baseMimeType === validType.replace(/\/.*$/, "")) {
          return true;
        }
      } else {
        if (mimeType === validType) {
          return true;
        }
      }
    }
    return false;
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.dropzone = function(options) {
      return this.each(function() {
        return new Dropzone(this, options);
      });
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Dropzone;
  } else {
    window.Dropzone = Dropzone;
  }

  Dropzone.ADDED = "added";

  Dropzone.QUEUED = "queued";

  Dropzone.ACCEPTED = Dropzone.QUEUED;

  Dropzone.UPLOADING = "uploading";

  Dropzone.PROCESSING = Dropzone.UPLOADING;

  Dropzone.CANCELED = "canceled";

  Dropzone.ERROR = "error";

  Dropzone.SUCCESS = "success";

  /*
  # contentloaded.js
  #
  # Author: Diego Perini (diego.perini at gmail.com)
  # Summary: cross-browser wrapper for DOMContentLoaded
  # Updated: 20101020
  # License: MIT
  # Version: 1.2
  #
  # URL:
  # http://javascript.nwbox.com/ContentLoaded/
  # http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
  */


  contentLoaded = function(win, fn) {
    var add, doc, done, init, poll, pre, rem, root, top;
    done = false;
    top = true;
    doc = win.document;
    root = doc.documentElement;
    add = (doc.addEventListener ? "addEventListener" : "attachEvent");
    rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
    pre = (doc.addEventListener ? "" : "on");
    init = function(e) {
      if (e.type === "readystatechange" && doc.readyState !== "complete") {
        return;
      }
      (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        return fn.call(win, e.type || e);
      }
    };
    poll = function() {
      var e;
      try {
        root.doScroll("left");
      } catch (_error) {
        e = _error;
        setTimeout(poll, 50);
        return;
      }
      return init("poll");
    };
    if (doc.readyState !== "complete") {
      if (doc.createEventObject && root.doScroll) {
        try {
          top = !win.frameElement;
        } catch (_error) {}
        if (top) {
          poll();
        }
      }
      doc[add](pre + "DOMContentLoaded", init, false);
      doc[add](pre + "readystatechange", init, false);
      return win[add](pre + "load", init, false);
    }
  };

  Dropzone._autoDiscoverFunction = function() {
    if (Dropzone.autoDiscover) {
      return Dropzone.discover();
    }
  };

  contentLoaded(window, Dropzone._autoDiscoverFunction);

}).call(this);

});
require.alias("component-emitter/index.js", "dropzone/deps/emitter/index.js");
require.alias("component-emitter/index.js", "emitter/index.js");
if (typeof exports == "object") {
  module.exports = require("dropzone");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("dropzone"); });
} else {
  this["Dropzone"] = require("dropzone");
}})();