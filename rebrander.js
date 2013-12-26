var Rebrander,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

$.fn.rebrand = function(options) {
  if (SVG !== void 0 && SVG.supported) {
    return new Rebrander(this, options);
  }
};

Rebrander = (function() {
  Rebrander.prototype.defaults = {
    max: 200,
    min: 100,
    red: 156,
    green: 191,
    blue: 144,
    interval: 200,
    delta: 1,
    zindex: 10,
    type: 'linear'
  };

  Rebrander.prototype.colors = ['red', 'green', 'blue'];

  Rebrander.prototype.mapping = {
    red: ['green', 'blue'],
    blue: ['red', 'green'],
    green: ['red', 'blue']
  };

  function Rebrander(el, options) {
    var key, val, _ref,
      _this = this;
    this.el = el;
    if (options == null) {
      options = {};
    }
    this.colorize = __bind(this.colorize, this);
    this.id = this.el.attr('id');
    this.src = this.el.attr('src');
    this.el.hide();
    if (!(el.is('img') && this.id)) {
      return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log("Rebrander works with img tags with id") : void 0 : void 0;
    }
    this.options = {};
    _ref = this.defaults;
    for (key in _ref) {
      val = _ref[key];
      this.options[key] = typeof options[key] === typeof this.defaults[key] ? options[key] : this.defaults[key];
    }
    this.setup();
    this.img = new Image();
    this.img.onload = function() {
      return _this.render(_this.img);
    };
    this.img.src = this.src;
  }

  Rebrander.prototype.setup = function() {
    var col, _i, _len, _ref, _results;
    if ((this.options.delta % 2) > 0) {
      this.options.delta++;
    }
    _ref = this.colors;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      col = _ref[_i];
      if (this.options[col] < this.options.min) {
        this.options[col] = this.options.min;
      }
      if (this.options[col] > this.options.max) {
        _results.push(this.options[col] = this.options.max);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Rebrander.prototype.render = function(img) {
    this.width = this.el.width();
    if (!this.height) {
      this.scale = this.width / this.img.width;
      this.height = parseInt(this.img.height * this.scale);
    }
    this.replace();
    return this.start();
  };

  Rebrander.prototype.replace = function() {
    var _this = this;
    this.hid = this.id + '_rebrander';
    this.holder = $('<div>').attr({
      id: this.hid
    }).css({
      width: this.width,
      height: this.height,
      "z-index": this.options.zindex
    });
    this.el.replaceWith(this.holder);
    return this.holder.on('click', function() {
      return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(_this.options.red, _this.options.green, _this.options.blue) : void 0 : void 0;
    });
  };

  Rebrander.prototype.start = function() {
    this.draw = SVG(this.hid);
    this.rect = this.draw.rect().size(this.width, this.height).fill('none');
    this.mask = this.draw.image(this.src).size(this.width, this.height);
    this.colorize();
    return setInterval(this.colorize, this.options.interval);
  };

  Rebrander.prototype.color = function(val) {
    var color;
    color = this.colors[this.cur];
    if (!val) {
      return this.options[color];
    } else {
      return this.options[color] = val;
    }
  };

  Rebrander.prototype.colorize = function() {
    var col, gradient, _i, _len, _ref,
      _this = this;
    if (this.cur == null) {
      this.cur = 0;
    }
    if (this.color() >= this.options.max) {
      this.cur = this.cur === 2 ? 0 : this.cur + 1;
    } else {
      this.color(this.color() + this.options.delta);
      _ref = this.mapping[this.colors[this.cur]];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        if (this.options[col] > this.options.min) {
          this.options[col] = this.options[col] - (this.options.delta / 2);
        }
      }
    }
    gradient = this.draw.gradient(this.options.type, function(stop) {
      stop.at({
        offset: 0,
        color: {
          r: _this.options.red,
          g: _this.options.green,
          b: _this.options.blue
        }
      });
      return stop.at({
        offset: 1,
        color: {
          r: _this.options.blue,
          g: _this.options.red,
          b: _this.options.green
        }
      });
    });
    this.rect.fill({
      color: gradient
    });
    return this.rect.maskWith(this.mask);
  };

  Rebrander.prototype.shift = function(arr) {
    var l;
    l = arr.length;
    arr.unshift(arr[arr.length - 1]);
    arr.length = l;
    return arr;
  };

  return Rebrander;

})();
