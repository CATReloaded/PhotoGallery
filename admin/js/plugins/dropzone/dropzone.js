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
          _this.hiddenFileInput.style. (       ���u��H�A�Q%�:�@,���H`oc���o����Ɉ;
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
      resize: function(file)@���.7��G���n��M�����"3�4x��f��d\�.��yL�¼XG����C��d�H/<���-m��y�%bk��\�ED刉�����$�ͣ�b7Ȱ�ok�(�$�I�]�b}'��z랭3��8�fߚ%W'm��'���ꈷds��
�9�� ��ߣ��U#$��r{�w�_C�87$�����95�巠��@��+~����xTn�c�=n���S��U(:��Zz"�����C�|)�~������1������v�i������{%+8;����4�V��X�����y?��c23����;Eiǋ��'��o:j��B��~�n�C�w��U��<�2�~�����?1s�9!<�}��B"�}f�V�U_�]c< �¸�v��)�0	�3���H�R���9�_N_ީP���?1�yh:)k��Ճ#�����͝�"�4��y�f5��{O���8EJr��w����Q4u�#��z��.�'�rڟ�le��4��]m�D �%~شpZ��Ǟ�5)lxh��^��xE�o�Q�����ܙ�@ĜUS�s}e�0���CWq{��[2�/udt�!L��ѨL�������(g���~����X��C���t�m�a��\�w0��4�*\	��q[,ܽ�٩�T%|?�����{ꎟs@3lz5��t�G.o{G�i��s�B_d��9B}����e��6�>��n*0��x6T0X3tj��-ȼ��)�&�S	�cAC;�f-Y�k̚Ň	<S"�,R����V(E�[M�,�#��Ͽ(�W�x�I�Զg
|
Ca�ǯi�w��{r�a�Tǝ%�Y = (file.height - info.srcHeight) / 2;
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
        file.previewTemplate = file.previewElem 4       ����5�P�=o��g�t1[��nF&�v�Ѡ_C� 5�iB���pEventListeners = function() {
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
            _results1.pushc       ��%�H��n�~Q�֙ni�lv�"���;d�˩6>��C!���� �!�E�P�m`�#�}�j�.i��1]7���/g&�h�s!%8 b�� )�̓��P�NҚ"毿R�?U���ƏvM]úø���Vr��G�r�V����S|��U|7�5�U!�tIn�6�g�[�خ����ՎT��8K��'��"s�p�}n�S���Z�_6;�vظV�T(�w�������T���[ ���O�lHhS6Y|�D'�BB��0s
x�	����ߧ�PK����Lw3u8Y��׽""��]ێh��EY.��t�3��us�FL=���n3R��NWNL��}o���?q��qu���\���;G-ƅm�Dd�:�$�����ʝG�I^1=�ew5 ��q�P�Ӎn<O�d�x��Jԅae�lc�4Wh ����S��cwN�����\�%.�j���aag_�n�}��l+��>JN�3�~d�_��=���7i.{��C���7�}��d�W9�F)�o��{��C�۠��m3QPa�%azλ�@��JH�ᅫ��@P0g��0�r+%=�]�ᕆNZ'j����p5d%�$v-ɤȊ9���?=3��JF|���,�r��+n��Q�]�����'C�^U��#���qOf�*��e�+�1��d7͝Q�Y*�����1�����D�k�*����C�
r`g>Y���Q��b�m�O7	��.� ��;
��ĥh݀1��m@/^�>��h3F�q�{"�M=$}�.c?0�ߤ����T�O�B��ٛ�@ds#{L�A]���#�����q���ύ�8��x���KCoG���JkU;��<��!\�F;u��Hb}����a j���a���>B��E��4�26����#�b����3�|&yC��Qo�Z��K�!>�����1��)��E[Q�|�'�� N��XnEN��a��;�'H-
)S�
�p��}������������d��5*��c�j0�������vQ����z���C�����%�K�5�MN��&���3��w��<1t��z!&$}����s�M7h�i����:5��$�^��̯\8bZ
�L�7�@��&������ ��K6}�R&��S�x~�n��m4vV0;����MϠ���t�'e3�ԋ��g�5�$���umqpw��;�a�@&�~(j�^���(����'/���>뀝(r�*ȓi;�r � `���frWe*?&�mW<�
�j�巤b�Xe\\v�L<�[�	Q,�>Y�|
va$/���3��$�<
h�χ`����.��*�j ����jށr��KN�����.�        size = sge-preview");
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
.btn-social-icon.btn-c       	u�oZJxYj9���a8���#�S���"���ԗ��i���b�h�o���H$�tj�,FL�L�"!)}�=Gr��s�U}=*	����{�/D�	k�	D��]���M�#Rήp+'�I���B�v�����RD��ߦ!!��˺?�~��`�%�0����TPSeX��6�q.g��3�R��9"��o�Z@������q?���iO��j���/H��"\��o��L�ö�:�|�\�w���(�x���I�W�vZJ��'���r�ry�)Zl���E��Y$gR,�����h��]{��Hn�ψꁡ6(a���P1n���ո��#��J�5 ��=�'l����H�Ȃ�te^�Յ雅⩎�'�j^8�Q�f��v�bE�4��c� mH��4�s���]E�yTR���:@'��Y,�� *�%��1t�ٵ�\�\��-l�x���X�z�c4}*z��H2�>$�~�j��YN�[�ī�*�83�*=���c��X�g�[�p
!�IQZpj$�g�zʱ&��H��85gє��;��x¢8~=]N<��)��|�z̀�>CM�]�W���V1��M!ȋD~Ak3���^V ㊅�l�N�n4��m=�-��PgeTVQYg�,��q[�Z���Ckz��6��b �����{�h	�D`��b�������d Նg.�j�9�B�{k�����[qv�V��Z]Jf��w�،Q�8%�IR�l9��`Ԙ���e� ���*s�7O�C�:n��y��h�xQ-3��an	�>7c���"�z�5Ǔ�-U^��?(,�D�����bL��Τ-�_Tx�s��i7R0�K�1:��}��deGH�؉�Pf��d�1������1V8ŭ\���9o�6b.����|�z2�C	?��Ǟ�V��XN	*7���_tϦ�;[�W�#vO�j�ٔ��ޖ$6rj﹨Λ�x?+帧8'� <�~�o��B2�|�9U��OZ�yJ��`&��c����0���!�>��͹� 6�/�ߐޫZ��D�S��=�	8�ai��_�n�[��^��v�>��M�BNxU��T="
G7a��?�AE�ሹ�)A��J6v��L]�1�bRK�?���i6E����D�'c���Z���D�X�@� �����
j$��"��u���y�HR$+�뭰/	��$���[+����Ҩf\-ό���qD9����937��qb�A��c��
�����aH3p�:��k����cb˨�t��X&�	��2$7���q�uQ��R�b�6k�D�-�zl����$\n�9j[,�:^����L��3���M�u�_P[��DȀ���Ew��+�nces.push(this);P�  P�  P�0  �  �  �     *2$0H`ls = ts;
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
     T��F��'dragstart": function(e) {
              return _thisY       �������ߝ%�t(��]x� K
'�t��	l?��x���oKB����O
�\F���	��a1��g�2�r�DB�r�^hw�w �ڈ��1���,�dx?�eT��C��gO�Ӊ*m~�F����/]�M�"Ժ�<�9�ߣ���KG)�������{p��虬�`g˵X���-�Jql��bt��ރ3�.�]�<{��L�k��O�WmJ�Pt �� �B���r��PZ%[���ܜEj������b�²�R͖.�v��v9�]�S�J���3�<l�Y�Z�YW<�����o����$I7�W?�6j������V|�����)�ƺ�Move' === efct ? 'move' : 'copy';
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
       '       %��-�3k�t�OuX:�S{
�tF�Nue);
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
      if (this.options. $       &^[n�QU�q�SM�FR�ǦTj��/��eL"<p>" + this.opt/*
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
.btn-social-icon{position:relative;padding-left:44px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;height:34px;width:34px;padding-left:0;padding-right:0}.btn-social-icon :first-child{position:absolute;left:0;top:0;bottom:0;width:32px;line-height:34px;font-size:1.6em;text-align:center;b��zl.className)) {
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
      if ((this.options.maxFiles != null) && this.gP�  P�  P�0  �  �  �    *2$0H`l     if (this.getAcceptedFiles().length === this.options.maxFileHTTP/1.1 200 OK
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
          } else if (entry.isDirectorc       ��%�H��n�~Q�֙ni�lv�"���;d�˩6>��C!���� �!c       ���l,$�-��T9���j> ����UF�N�c;���^xOLj���_�'��mK�-��ۨ5bK�[y�B0Y���;.gF���OBMVy�-U^���g���<6_2�0���Dǳ>z��*1����q�Z]��G�.�{AAx	�����n���?5����?����U)R�B�Ԫ4��q©sޏ�T���_U.�0(�{YID�S�La��~�(�[��zB_��7<���椰z��볋�\�^U�1$l����W���ǡ��ͽ^�n�`J�T�D���Վv���J�H�۾ͺη����Gt�� s~mk�����4��~�җ�Z��]ݿ
�.�^8��oE�w}�V["P��.�X��T�ű�`󶩛e�@�~(�]��=�\�(��'��A�N��5�qh�[�>?� Ϯ���4(wn��)�JjQ>��ej*������O?��W��艔�(������S���/<$�+v⠸�1�J�|�>�j�<䨲#g�rO&{����߳#� ���W�Y�q��7��[?�v�ґ�f��ǰ�g%��o��Iw����"|���&��)� "�`a��̋�27�b��~S�����eM�Q��>�m��U\,�Eq;oP�FA�á�j#���-��j��V�F��gr�	�\6)R�Zٸ&\}=]_)���s��g��'�:��\��Avk��ûU�(#��<W���w������F��T�L�~�Ͷo�%���Q��i�H���o_*^��Bt!�T�F�Rf��Q&�[��lH�W�\��ocL�~��)�[B��_P fyKn���]
���@-'��cDN���=��@�]L�*�R��2Q��;$�pXC�L�*iӒ%�<��f�W�*t6��"��Il!q��[t�Q��|?�o�:ǹ �"�9���iMb�2-�b���!��%�_K]�$��4/TRME�6M,5��h^�:��N���Rk����е�5�"=Q�P8%p��p��v?�`���'g����m�m�����S��>��1s���~��}��m����0a5�	��wM<M�$N�OB���"+q�%V��=���5�^���S����N$��|˖*t�����3�e���?�u7tC�B#j���F���Fq��V���h'S-J9L����F41��TH���ȍahq��4�{��etд�l��w�M��9Z�
w��4����k����+T�\��l��p�̦��3����F�VEzU��w�9x z��$}b�� S"��k�]H]Y�\��� 8'*�� c�|�Zߠ=O���>�rU�o�L4�v����F�y����z�irror) {
         $       ���`.��mR9��'����_��} �M��u�rorProcessing([file], error);
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
              retu C       ��Q{������[yՐCn��|���a�=b-٣W$�e}&��R.LM��L%w�gectory) {
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
        img = document.createEleme�       �]v�u��=��[h�PE��I���%�0�%I�#�p�6s_�y�x   resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
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