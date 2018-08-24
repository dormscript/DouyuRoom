console.log("I'm form%c app-firstscreen-all.js","color:green");
var CryptoJS = CryptoJS ||
function(e, t) {
	var i = {},
		n = i.lib = {},
		o = function() {},
		a = n.Base = {
			extend: function(e) {
				o.prototype = this;
				var t = new o;
				return e && t.mixIn(e), t.hasOwnProperty("init") || (t.init = function() {
					t.$super.init.apply(this, arguments)
				}), t.init.prototype = t, t.$super = this, t
			},
			create: function() {
				var e = this.extend();
				return e.init.apply(e, arguments), e
			},
			init: function() {},
			mixIn: function(e) {
				for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
				e.hasOwnProperty("toString") && (this.toString = e.toString)
			},
			clone: function() {
				return this.init.prototype.extend(this)
			}
		},
		r = n.WordArray = a.extend({
			init: function(e, i) {
				e = this.words = e || [], this.sigBytes = i != t ? i : 4 * e.length
			},
			toString: function(e) {
				return (e || l).stringify(this)
			},
			concat: function(e) {
				var t = this.words,
					i = e.words,
					n = this.sigBytes;
				if (e = e.sigBytes, this.clamp(), n % 4) for (var o = 0; e > o; o++) t[n + o >>> 2] |= (i[o >>> 2] >>> 24 - 8 * (o % 4) & 255) << 24 - 8 * ((n + o) % 4);
				else if (65535 < i.length) for (o = 0; e > o; o += 4) t[n + o >>> 2] = i[o >>> 2];
				else t.push.apply(t, i);
				return this.sigBytes += e, this
			},
			clamp: function() {
				var t = this.words,
					i = this.sigBytes;
				t[i >>> 2] &= 4294967295 << 32 - 8 * (i % 4), t.length = e.ceil(i / 4)
			},
			clone: function() {
				var e = a.clone.call(this);
				return e.words = this.words.slice(0), e
			},
			random: function(t) {
				for (var i = [], n = 0; t > n; n += 4) i.push(4294967296 * e.random() | 0);
				return new r.init(i, t)
			}
		}),
		s = i.enc = {},
		l = s.Hex = {
			stringify: function(e) {
				var t = e.words;
				e = e.sigBytes;
				for (var i = [], n = 0; e > n; n++) {
					var o = t[n >>> 2] >>> 24 - 8 * (n % 4) & 255;
					i.push((o >>> 4).toString(16)), i.push((15 & o).toString(16))
				}
				return i.join("")
			},
			parse: function(e) {
				for (var t = e.length, i = [], n = 0; t > n; n += 2) i[n >>> 3] |= parseInt(e.substr(n, 2), 16) << 24 - 4 * (n % 8);
				return new r.init(i, t / 2)
			}
		},
		c = s.Latin1 = {
			stringify: function(e) {
				var t = e.words;
				e = e.sigBytes;
				for (var i = [], n = 0; e > n; n++) i.push(String.fromCharCode(t[n >>> 2] >>> 24 - 8 * (n % 4) & 255));
				return i.join("")
			},
			parse: function(e) {
				for (var t = e.length, i = [], n = 0; t > n; n++) i[n >>> 2] |= (255 & e.charCodeAt(n)) << 24 - 8 * (n % 4);
				return new r.init(i, t)
			}
		},
		d = s.Utf8 = {
			stringify: function(e) {
				try {
					return decodeURIComponent(escape(c.stringify(e)))
				} catch (t) {
					throw Error("Malformed UTF-8 data")
				}
			},
			parse: function(e) {
				return c.parse(unescape(encodeURIComponent(e)))
			}
		},
		u = n.BufferedBlockAlgorithm = a.extend({
			reset: function() {
				this._data = new r.init, this._nDataBytes = 0
			},
			_append: function(e) {
				"string" == typeof e && (e = d.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
			},
			_process: function(t) {
				var i = this._data,
					n = i.words,
					o = i.sigBytes,
					a = this.blockSize,
					s = o / (4 * a),
					s = t ? e.ceil(s) : e.max((0 | s) - this._minBufferSize, 0);
				if (t = s * a, o = e.min(4 * t, o), t) {
					for (var l = 0; t > l; l += a) this._doProcessBlock(n, l);
					l = n.splice(0, t), i.sigBytes -= o
				}
				return new r.init(l, o)
			},
			clone: function() {
				var e = a.clone.call(this);
				return e._data = this._data.clone(), e
			},
			_minBufferSize: 0
		});
	n.Hasher = u.extend({
		cfg: a.extend(),
		init: function(e) {
			this.cfg = this.cfg.extend(e), this.reset()
		},
		reset: function() {
			u.reset.call(this), this._doReset()
		},
		update: function(e) {
			return this._append(e), this._process(), this
		},
		finalize: function(e) {
			return e && this._append(e), this._doFinalize()
		},
		blockSize: 16,
		_createHelper: function(e) {
			return function(t, i) {
				return new e.init(i).finalize(t)
			}
		},
		_createHmacHelper: function(e) {
			return function(t, i) {
				return new f.HMAC.init(e, i).finalize(t)
			}
		}
	});
	var f = i.algo = {};
	return i
}(Math);
!
function(e) {
	function t(e, t, i, n, o, a, r) {
		return e = e + (t & i | ~t & n) + o + r, (e << a | e >>> 32 - a) + t
	}
	function i(e, t, i, n, o, a, r) {
		return e = e + (t & n | i & ~n) + o + r, (e << a | e >>> 32 - a) + t
	}
	function n(e, t, i, n, o, a, r) {
		return e = e + (t ^ i ^ n) + o + r, (e << a | e >>> 32 - a) + t
	}
	function o(e, t, i, n, o, a, r) {
		return e = e + (i ^ (t | ~n)) + o + r, (e << a | e >>> 32 - a) + t
	}
	for (var a = CryptoJS, r = a.lib, s = r.WordArray, l = r.Hasher, r = a.algo, c = [], d = 0; 64 > d; d++) c[d] = 4294967296 * e.abs(e.sin(d + 1)) | 0;
	r = r.MD5 = l.extend({
		_doReset: function() {
			this._hash = new s.init([1732584193, 4023233417, 2562383102, 271733878])
		},
		_doProcessBlock: function(e, a) {
			for (var r = 0; 16 > r; r++) {
				var s = a + r,
					l = e[s];
				e[s] = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8)
			}
			var r = this._hash.words,
				s = e[a + 0],
				l = e[a + 1],
				d = e[a + 2],
				u = e[a + 3],
				f = e[a + 4],
				h = e[a + 5],
				p = e[a + 6],
				g = e[a + 7],
				m = e[a + 8],
				v = e[a + 9],
				y = e[a + 10],
				_ = e[a + 11],
				b = e[a + 12],
				w = e[a + 13],
				k = e[a + 14],
				x = e[a + 15],
				C = r[0],
				S = r[1],
				j = r[2],
				T = r[3],
				C = t(C, S, j, T, s, 7, c[0]),
				T = t(T, C, S, j, l, 12, c[1]),
				j = t(j, T, C, S, d, 17, c[2]),
				S = t(S, j, T, C, u, 22, c[3]),
				C = t(C, S, j, T, f, 7, c[4]),
				T = t(T, C, S, j, h, 12, c[5]),
				j = t(j, T, C, S, p, 17, c[6]),
				S = t(S, j, T, C, g, 22, c[7]),
				C = t(C, S, j, T, m, 7, c[8]),
				T = t(T, C, S, j, v, 12, c[9]),
				j = t(j, T, C, S, y, 17, c[10]),
				S = t(S, j, T, C, _, 22, c[11]),
				C = t(C, S, j, T, b, 7, c[12]),
				T = t(T, C, S, j, w, 12, c[13]),
				j = t(j, T, C, S, k, 17, c[14]),
				S = t(S, j, T, C, x, 22, c[15]),
				C = i(C, S, j, T, l, 5, c[16]),
				T = i(T, C, S, j, p, 9, c[17]),
				j = i(j, T, C, S, _, 14, c[18]),
				S = i(S, j, T, C, s, 20, c[19]),
				C = i(C, S, j, T, h, 5, c[20]),
				T = i(T, C, S, j, y, 9, c[21]),
				j = i(j, T, C, S, x, 14, c[22]),
				S = i(S, j, T, C, f, 20, c[23]),
				C = i(C, S, j, T, v, 5, c[24]),
				T = i(T, C, S, j, k, 9, c[25]),
				j = i(j, T, C, S, u, 14, c[26]),
				S = i(S, j, T, C, m, 20, c[27]),
				C = i(C, S, j, T, w, 5, c[28]),
				T = i(T, C, S, j, d, 9, c[29]),
				j = i(j, T, C, S, g, 14, c[30]),
				S = i(S, j, T, C, b, 20, c[31]),
				C = n(C, S, j, T, h, 4, c[32]),
				T = n(T, C, S, j, m, 11, c[33]),
				j = n(j, T, C, S, _, 16, c[34]),
				S = n(S, j, T, C, k, 23, c[35]),
				C = n(C, S, j, T, l, 4, c[36]),
				T = n(T, C, S, j, f, 11, c[37]),
				j = n(j, T, C, S, g, 16, c[38]),
				S = n(S, j, T, C, y, 23, c[39]),
				C = n(C, S, j, T, w, 4, c[40]),
				T = n(T, C, S, j, s, 11, c[41]),
				j = n(j, T, C, S, u, 16, c[42]),
				S = n(S, j, T, C, p, 23, c[43]),
				C = n(C, S, j, T, v, 4, c[44]),
				T = n(T, C, S, j, b, 11, c[45]),
				j = n(j, T, C, S, x, 16, c[46]),
				S = n(S, j, T, C, d, 23, c[47]),
				C = o(C, S, j, T, s, 6, c[48]),
				T = o(T, C, S, j, g, 10, c[49]),
				j = o(j, T, C, S, k, 15, c[50]),
				S = o(S, j, T, C, h, 21, c[51]),
				C = o(C, S, j, T, b, 6, c[52]),
				T = o(T, C, S, j, u, 10, c[53]),
				j = o(j, T, C, S, y, 15, c[54]),
				S = o(S, j, T, C, l, 21, c[55]),
				C = o(C, S, j, T, m, 6, c[56]),
				T = o(T, C, S, j, x, 10, c[57]),
				j = o(j, T, C, S, p, 15, c[58]),
				S = o(S, j, T, C, w, 21, c[59]),
				C = o(C, S, j, T, f, 6, c[60]),
				T = o(T, C, S, j, _, 10, c[61]),
				j = o(j, T, C, S, d, 15, c[62]),
				S = o(S, j, T, C, v, 21, c[63]);
			r[0] = r[0] + C | 0, r[1] = r[1] + S | 0, r[2] = r[2] + j | 0, r[3] = r[3] + T | 0
		},
		_doFinalize: function() {
			var t = this._data,
				i = t.words,
				n = 8 * this._nDataBytes,
				o = 8 * t.sigBytes;
			i[o >>> 5] |= 128 << 24 - o % 32;
			var a = e.floor(n / 4294967296);
			for (i[(o + 64 >>> 9 << 4) + 15] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), i[(o + 64 >>> 9 << 4) + 14] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8), t.sigBytes = 4 * (i.length + 1), this._process(), t = this._hash, i = t.words, n = 0; 4 > n; n++) o = i[n], i[n] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8);
			return t
		},
		clone: function() {
			var e = l.clone.call(this);
			return e._hash = this._hash.clone(), e
		}
	}), a.MD5 = l._createHelper(r), a.HmacMD5 = l._createHmacHelper(r)
}(Math);
var CryptoJS = CryptoJS ||
function(e, t) {
	var i = {},
		n = i.lib = {},
		o = function() {},
		a = n.Base = {
			extend: function(e) {
				o.prototype = this;
				var t = new o;
				return e && t.mixIn(e), t.hasOwnProperty("init") || (t.init = function() {
					t.$super.init.apply(this, arguments)
				}), t.init.prototype = t, t.$super = this, t
			},
			create: function() {
				var e = this.extend();
				return e.init.apply(e, arguments), e
			},
			init: function() {},
			mixIn: function(e) {
				for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
				e.hasOwnProperty("toString") && (this.toString = e.toString)
			},
			clone: function() {
				return this.init.prototype.extend(this)
			}
		},
		r = n.WordArray = a.extend({
			init: function(e, i) {
				e = this.words = e || [], this.sigBytes = i != t ? i : 4 * e.length
			},
			toString: function(e) {
				return (e || l).stringify(this)
			},
			concat: function(e) {
				var t = this.words,
					i = e.words,
					n = this.sigBytes;
				if (e = e.sigBytes, this.clamp(), n % 4) for (var o = 0; e > o; o++) t[n + o >>> 2] |= (i[o >>> 2] >>> 24 - 8 * (o % 4) & 255) << 24 - 8 * ((n + o) % 4);
				else if (65535 < i.length) for (o = 0; e > o; o += 4) t[n + o >>> 2] = i[o >>> 2];
				else t.push.apply(t, i);
				return this.sigBytes += e, this
			},
			clamp: function() {
				var t = this.words,
					i = this.sigBytes;
				t[i >>> 2] &= 4294967295 << 32 - 8 * (i % 4), t.length = e.ceil(i / 4)
			},
			clone: function() {
				var e = a.clone.call(this);
				return e.words = this.words.slice(0), e
			},
			random: function(t) {
				for (var i = [], n = 0; t > n; n += 4) i.push(4294967296 * e.random() | 0);
				return new r.init(i, t)
			}
		}),
		s = i.enc = {},
		l = s.Hex = {
			stringify: function(e) {
				var t = e.words;
				e = e.sigBytes;
				for (var i = [], n = 0; e > n; n++) {
					var o = t[n >>> 2] >>> 24 - 8 * (n % 4) & 255;
					i.push((o >>> 4).toString(16)), i.push((15 & o).toString(16))
				}
				return i.join("")
			},
			parse: function(e) {
				for (var t = e.length, i = [], n = 0; t > n; n += 2) i[n >>> 3] |= parseInt(e.substr(n, 2), 16) << 24 - 4 * (n % 8);
				return new r.init(i, t / 2)
			}
		},
		c = s.Latin1 = {
			stringify: function(e) {
				var t = e.words;
				e = e.sigBytes;
				for (var i = [], n = 0; e > n; n++) i.push(String.fromCharCode(t[n >>> 2] >>> 24 - 8 * (n % 4) & 255));
				return i.join("")
			},
			parse: function(e) {
				for (var t = e.length, i = [], n = 0; t > n; n++) i[n >>> 2] |= (255 & e.charCodeAt(n)) << 24 - 8 * (n % 4);
				return new r.init(i, t)
			}
		},
		d = s.Utf8 = {
			stringify: function(e) {
				try {
					return decodeURIComponent(escape(c.stringify(e)))
				} catch (t) {
					throw Error("Malformed UTF-8 data")
				}
			},
			parse: function(e) {
				return c.parse(unescape(encodeURIComponent(e)))
			}
		},
		u = n.BufferedBlockAlgorithm = a.extend({
			reset: function() {
				this._data = new r.init, this._nDataBytes = 0
			},
			_append: function(e) {
				"string" == typeof e && (e = d.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
			},
			_process: function(t) {
				var i = this._data,
					n = i.words,
					o = i.sigBytes,
					a = this.blockSize,
					s = o / (4 * a),
					s = t ? e.ceil(s) : e.max((0 | s) - this._minBufferSize, 0);
				if (t = s * a, o = e.min(4 * t, o), t) {
					for (var l = 0; t > l; l += a) this._doProcessBlock(n, l);
					l = n.splice(0, t), i.sigBytes -= o
				}
				return new r.init(l, o)
			},
			clone: function() {
				var e = a.clone.call(this);
				return e._data = this._data.clone(), e
			},
			_minBufferSize: 0
		});
	n.Hasher = u.extend({
		cfg: a.extend(),
		init: function(e) {
			this.cfg = this.cfg.extend(e), this.reset()
		},
		reset: function() {
			u.reset.call(this), this._doReset()
		},
		update: function(e) {
			return this._append(e), this._process(), this
		},
		finalize: function(e) {
			return e && this._append(e), this._doFinalize()
		},
		blockSize: 16,
		_createHelper: function(e) {
			return function(t, i) {
				return new e.init(i).finalize(t)
			}
		},
		_createHmacHelper: function(e) {
			return function(t, i) {
				return new f.HMAC.init(e, i).finalize(t)
			}
		}
	});
	var f = i.algo = {};
	return i
}(Math);
!
function(e) {
	function t(e, t, i, n, o, a, r) {
		return e = e + (t & i | ~t & n) + o + r, (e << a | e >>> 32 - a) + t
	}
	function i(e, t, i, n, o, a, r) {
		return e = e + (t & n | i & ~n) + o + r, (e << a | e >>> 32 - a) + t
	}
	function n(e, t, i, n, o, a, r) {
		return e = e + (t ^ i ^ n) + o + r, (e << a | e >>> 32 - a) + t
	}
	function o(e, t, i, n, o, a, r) {
		return e = e + (i ^ (t | ~n)) + o + r, (e << a | e >>> 32 - a) + t
	}
	for (var a = CryptoJS, r = a.lib, s = r.WordArray, l = r.Hasher, r = a.algo, c = [], d = 0; 64 > d; d++) c[d] = 4294967296 * e.abs(e.sin(d + 1)) | 0;
	r = r.MD5 = l.extend({
		_doReset: function() {
			this._hash = new s.init([1732584193, 4023233417, 2562383102, 271733878])
		},
		_doProcessBlock: function(e, a) {
			for (var r = 0; 16 > r; r++) {
				var s = a + r,
					l = e[s];
				e[s] = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8)
			}
			var r = this._hash.words,
				s = e[a + 0],
				l = e[a + 1],
				d = e[a + 2],
				u = e[a + 3],
				f = e[a + 4],
				h = e[a + 5],
				p = e[a + 6],
				g = e[a + 7],
				m = e[a + 8],
				v = e[a + 9],
				y = e[a + 10],
				_ = e[a + 11],
				b = e[a + 12],
				w = e[a + 13],
				k = e[a + 14],
				x = e[a + 15],
				C = r[0],
				S = r[1],
				j = r[2],
				T = r[3],
				C = t(C, S, j, T, s, 7, c[0]),
				T = t(T, C, S, j, l, 12, c[1]),
				j = t(j, T, C, S, d, 17, c[2]),
				S = t(S, j, T, C, u, 22, c[3]),
				C = t(C, S, j, T, f, 7, c[4]),
				T = t(T, C, S, j, h, 12, c[5]),
				j = t(j, T, C, S, p, 17, c[6]),
				S = t(S, j, T, C, g, 22, c[7]),
				C = t(C, S, j, T, m, 7, c[8]),
				T = t(T, C, S, j, v, 12, c[9]),
				j = t(j, T, C, S, y, 17, c[10]),
				S = t(S, j, T, C, _, 22, c[11]),
				C = t(C, S, j, T, b, 7, c[12]),
				T = t(T, C, S, j, w, 12, c[13]),
				j = t(j, T, C, S, k, 17, c[14]),
				S = t(S, j, T, C, x, 22, c[15]),
				C = i(C, S, j, T, l, 5, c[16]),
				T = i(T, C, S, j, p, 9, c[17]),
				j = i(j, T, C, S, _, 14, c[18]),
				S = i(S, j, T, C, s, 20, c[19]),
				C = i(C, S, j, T, h, 5, c[20]),
				T = i(T, C, S, j, y, 9, c[21]),
				j = i(j, T, C, S, x, 14, c[22]),
				S = i(S, j, T, C, f, 20, c[23]),
				C = i(C, S, j, T, v, 5, c[24]),
				T = i(T, C, S, j, k, 9, c[25]),
				j = i(j, T, C, S, u, 14, c[26]),
				S = i(S, j, T, C, m, 20, c[27]),
				C = i(C, S, j, T, w, 5, c[28]),
				T = i(T, C, S, j, d, 9, c[29]),
				j = i(j, T, C, S, g, 14, c[30]),
				S = i(S, j, T, C, b, 20, c[31]),
				C = n(C, S, j, T, h, 4, c[32]),
				T = n(T, C, S, j, m, 11, c[33]),
				j = n(j, T, C, S, _, 16, c[34]),
				S = n(S, j, T, C, k, 23, c[35]),
				C = n(C, S, j, T, l, 4, c[36]),
				T = n(T, C, S, j, f, 11, c[37]),
				j = n(j, T, C, S, g, 16, c[38]),
				S = n(S, j, T, C, y, 23, c[39]),
				C = n(C, S, j, T, w, 4, c[40]),
				T = n(T, C, S, j, s, 11, c[41]),
				j = n(j, T, C, S, u, 16, c[42]),
				S = n(S, j, T, C, p, 23, c[43]),
				C = n(C, S, j, T, v, 4, c[44]),
				T = n(T, C, S, j, b, 11, c[45]),
				j = n(j, T, C, S, x, 16, c[46]),
				S = n(S, j, T, C, d, 23, c[47]),
				C = o(C, S, j, T, s, 6, c[48]),
				T = o(T, C, S, j, g, 10, c[49]),
				j = o(j, T, C, S, k, 15, c[50]),
				S = o(S, j, T, C, h, 21, c[51]),
				C = o(C, S, j, T, b, 6, c[52]),
				T = o(T, C, S, j, u, 10, c[53]),
				j = o(j, T, C, S, y, 15, c[54]),
				S = o(S, j, T, C, l, 21, c[55]),
				C = o(C, S, j, T, m, 6, c[56]),
				T = o(T, C, S, j, x, 10, c[57]),
				j = o(j, T, C, S, p, 15, c[58]),
				S = o(S, j, T, C, w, 21, c[59]),
				C = o(C, S, j, T, f, 6, c[60]),
				T = o(T, C, S, j, _, 10, c[61]),
				j = o(j, T, C, S, d, 15, c[62]),
				S = o(S, j, T, C, v, 21, c[63]);
			r[0] = r[0] + C | 0, r[1] = r[1] + S | 0, r[2] = r[2] + j | 0, r[3] = r[3] + T | 0
		},
		_doFinalize: function() {
			var t = this._data,
				i = t.words,
				n = 8 * this._nDataBytes,
				o = 8 * t.sigBytes;
			i[o >>> 5] |= 128 << 24 - o % 32;
			var a = e.floor(n / 4294967296);
			for (i[(o + 64 >>> 9 << 4) + 15] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), i[(o + 64 >>> 9 << 4) + 14] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8), t.sigBytes = 4 * (i.length + 1), this._process(), t = this._hash, i = t.words, n = 0; 4 > n; n++) o = i[n], i[n] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8);
			return t
		},
		clone: function() {
			var e = l.clone.call(this);
			return e._hash = this._hash.clone(), e
		}
	}), a.MD5 = l._createHelper(r), a.HmacMD5 = l._createHmacHelper(r)
}(Math), function() {
	var e = CryptoJS,
		t = e.enc.Utf8;
	e.algo.HMAC = e.lib.Base.extend({
		init: function(e, i) {
			e = this._hasher = new e.init, "string" == typeof i && (i = t.parse(i));
			var n = e.blockSize,
				o = 4 * n;
			i.sigBytes > o && (i = e.finalize(i)), i.clamp();
			for (var a = this._oKey = i.clone(), r = this._iKey = i.clone(), s = a.words, l = r.words, c = 0; n > c; c++) s[c] ^= 1549556828, l[c] ^= 909522486;
			a.sigBytes = r.sigBytes = o, this.reset()
		},
		reset: function() {
			var e = this._hasher;
			e.reset(), e.update(this._iKey)
		},
		update: function(e) {
			return this._hasher.update(e), this
		},
		finalize: function(e) {
			var t = this._hasher;
			return e = t.finalize(e), t.reset(), t.finalize(this._oKey.clone().concat(e))
		}
	})
}(), "object" != typeof JSON && (JSON = {}), function() {
	function f(e) {
		return 10 > e ? "0" + e : e
	}
	function quote(e) {
		return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
			var t = meta[e];
			return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
		}) + '"' : '"' + e + '"'
	}
	function str(e, t) {
		var i, n, o, a, r, s = gap,
			l = t[e];
		switch (l && "object" == typeof l && "function" == typeof l.toJSON && (l = l.toJSON(e)), "function" == typeof rep && (l = rep.call(t, e, l)), typeof l) {
		case "string":
			return quote(l);
		case "number":
			return isFinite(l) ? String(l) : "null";
		case "boolean":
		case "null":
			return String(l);
		case "object":
			if (!l) return "null";
			if (gap += indent, r = [], "[object Array]" === Object.prototype.toString.apply(l)) {
				for (a = l.length, i = 0; a > i; i += 1) r[i] = str(i, l) || "null";
				return o = 0 === r.length ? "[]" : gap ? "[\n" + gap + r.join(",\n" + gap) + "\n" + s + "]" : "[" + r.join(",") + "]", gap = s, o
			}
			if (rep && "object" == typeof rep) for (a = rep.length, i = 0; a > i; i += 1)"string" == typeof rep[i] && (n = rep[i], o = str(n, l), o && r.push(quote(n) + (gap ? ": " : ":") + o));
			else for (n in l) Object.prototype.hasOwnProperty.call(l, n) && (o = str(n, l), o && r.push(quote(n) + (gap ? ": " : ":") + o));
			return o = 0 === r.length ? "{}" : gap ? "{\n" + gap + r.join(",\n" + gap) + "\n" + s + "}" : "{" + r.join(",") + "}", gap = s, o
		}
	}
	"function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
		return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
	}, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
		return this.valueOf()
	});
	var cx, escapable, gap, indent, meta, rep;
	"function" != typeof JSON.stringify && (escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, meta = {
		"\b": "\\b",
		"	": "\\t",
		"\n": "\\n",
		"\f": "\\f",
		"\r": "\\r",
		'"': '\\"',
		"\\": "\\\\"
	}, JSON.stringify = function(e, t, i) {
		var n;
		if (gap = "", indent = "", "number" == typeof i) for (n = 0; i > n; n += 1) indent += " ";
		else "string" == typeof i && (indent = i);
		if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
		return str("", {
			"": e
		})
	}), "function" != typeof JSON.parse && (cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, JSON.parse = function(text, reviver) {
		function walk(e, t) {
			var i, n, o = e[t];
			if (o && "object" == typeof o) for (i in o) Object.prototype.hasOwnProperty.call(o, i) && (n = walk(o, i), void 0 !== n ? o[i] = n : delete o[i]);
			return reviver.call(e, t, o)
		}
		var j;
		if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
			return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
		})), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
			"": j
		}, "") : j;
		throw new SyntaxError("JSON.parse")
	})
}(), function(e) {
	e.easing.jswing = e.easing.swing, e.extend(e.easing, {
		def: "easeOutQuad",
		swing: function(t, i, n, o, a) {
			return e.easing[e.easing.def](t, i, n, o, a)
		},
		easeInQuad: function(e, t, i, n, o) {
			return n * (t /= o) * t + i
		},
		easeOutQuad: function(e, t, i, n, o) {
			return -n * (t /= o) * (t - 2) + i
		},
		easeInOutQuad: function(e, t, i, n, o) {
			return (t /= o / 2) < 1 ? n / 2 * t * t + i : -n / 2 * (--t * (t - 2) - 1) + i
		},
		easeInCubic: function(e, t, i, n, o) {
			return n * (t /= o) * t * t + i
		},
		easeOutCubic: function(e, t, i, n, o) {
			return n * ((t = t / o - 1) * t * t + 1) + i
		},
		easeInOutCubic: function(e, t, i, n, o) {
			return (t /= o / 2) < 1 ? n / 2 * t * t * t + i : n / 2 * ((t -= 2) * t * t + 2) + i
		},
		easeInQuart: function(e, t, i, n, o) {
			return n * (t /= o) * t * t * t + i
		},
		easeOutQuart: function(e, t, i, n, o) {
			return -n * ((t = t / o - 1) * t * t * t - 1) + i
		},
		easeInOutQuart: function(e, t, i, n, o) {
			return (t /= o / 2) < 1 ? n / 2 * t * t * t * t + i : -n / 2 * ((t -= 2) * t * t * t - 2) + i
		},
		easeInQuint: function(e, t, i, n, o) {
			return n * (t /= o) * t * t * t * t + i
		},
		easeOutQuint: function(e, t, i, n, o) {
			return n * ((t = t / o - 1) * t * t * t * t + 1) + i
		},
		easeInOutQuint: function(e, t, i, n, o) {
			return (t /= o / 2) < 1 ? n / 2 * t * t * t * t * t + i : n / 2 * ((t -= 2) * t * t * t * t + 2) + i
		},
		easeInSine: function(e, t, i, n, o) {
			return -n * Math.cos(t / o * (Math.PI / 2)) + n + i
		},
		easeOutSine: function(e, t, i, n, o) {
			return n * Math.sin(t / o * (Math.PI / 2)) + i
		},
		easeInOutSine: function(e, t, i, n, o) {
			return -n / 2 * (Math.cos(Math.PI * t / o) - 1) + i
		},
		easeInExpo: function(e, t, i, n, o) {
			return 0 == t ? i : n * Math.pow(2, 10 * (t / o - 1)) + i
		},
		easeOutExpo: function(e, t, i, n, o) {
			return t == o ? i + n : n * (-Math.pow(2, -10 * t / o) + 1) + i
		},
		easeInOutExpo: function(e, t, i, n, o) {
			return 0 == t ? i : t == o ? i + n : (t /= o / 2) < 1 ? n / 2 * Math.pow(2, 10 * (t - 1)) + i : n / 2 * (-Math.pow(2, -10 * --t) + 2) + i
		},
		easeInCirc: function(e, t, i, n, o) {
			return -n * (Math.sqrt(1 - (t /= o) * t) - 1) + i
		},
		easeOutCirc: function(e, t, i, n, o) {
			return n * Math.sqrt(1 - (t = t / o - 1) * t) + i
		},
		easeInOutCirc: function(e, t, i, n, o) {
			return (t /= o / 2) < 1 ? -n / 2 * (Math.sqrt(1 - t * t) - 1) + i : n / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + i
		},
		easeInElastic: function(e, t, i, n, o) {
			var a = 1.70158,
				r = 0,
				s = n;
			if (0 == t) return i;
			if (1 == (t /= o)) return i + n;
			if (r || (r = .3 * o), s < Math.abs(n)) {
				s = n;
				var a = r / 4
			} else var a = r / (2 * Math.PI) * Math.asin(n / s);
			return -(s * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * o - a) * (2 * Math.PI) / r)) + i
		},
		easeOutElastic: function(e, t, i, n, o) {
			var a = 1.70158,
				r = 0,
				s = n;
			if (0 == t) return i;
			if (1 == (t /= o)) return i + n;
			if (r || (r = .3 * o), s < Math.abs(n)) {
				s = n;
				var a = r / 4
			} else var a = r / (2 * Math.PI) * Math.asin(n / s);
			return s * Math.pow(2, -10 * t) * Math.sin((t * o - a) * (2 * Math.PI) / r) + n + i
		},
		easeInOutElastic: function(e, t, i, n, o) {
			var a = 1.70158,
				r = 0,
				s = n;
			if (0 == t) return i;
			if (2 == (t /= o / 2)) return i + n;
			if (r || (r = o * (.3 * 1.5)), s < Math.abs(n)) {
				s = n;
				var a = r / 4
			} else var a = r / (2 * Math.PI) * Math.asin(n / s);
			return 1 > t ? -.5 * (s * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * o - a) * (2 * Math.PI) / r)) + i : s * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * o - a) * (2 * Math.PI) / r) * .5 + n + i
		},
		easeInBack: function(e, t, i, n, o, a) {
			return void 0 == a && (a = 1.70158), n * (t /= o) * t * ((a + 1) * t - a) + i
		},
		easeOutBack: function(e, t, i, n, o, a) {
			return void 0 == a && (a = 1.70158), n * ((t = t / o - 1) * t * ((a + 1) * t + a) + 1) + i
		},
		easeInOutBack: function(e, t, i, n, o, a) {
			return void 0 == a && (a = 1.70158), (t /= o / 2) < 1 ? n / 2 * (t * t * (((a *= 1.525) + 1) * t - a)) + i : n / 2 * ((t -= 2) * t * (((a *= 1.525) + 1) * t + a) + 2) + i
		},
		easeInBounce: function(t, i, n, o, a) {
			return o - e.easing.easeOutBounce(t, a - i, 0, o, a) + n
		},
		easeOutBounce: function(e, t, i, n, o) {
			return (t /= o) < 1 / 2.75 ? n * (7.5625 * t * t) + i : 2 / 2.75 > t ? n * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + i : 2.5 / 2.75 > t ? n * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + i : n * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + i
		},
		easeInOutBounce: function(t, i, n, o, a) {
			return a / 2 > i ? .5 * e.easing.easeInBounce(t, 2 * i, 0, o, a) + n : .5 * e.easing.easeOutBounce(t, 2 * i - a, 0, o, a) + .5 * o + n
		}
	})
}(jQuery), function(e, t, i) {
	function n(e) {
		var t = {},
			n = /^jQuery\d+$/;
		return i.each(e.attributes, function(e, i) {
			i.specified && !n.test(i.name) && (t[i.name] = i.value)
		}), t
	}
	function o(e, t) {
		var n = this,
			o = i(n);
		if (n.value == o.attr("placeholder") && o.hasClass("placeholder")) if (o.data("placeholder-password")) {
			if (o = o.hide().next().show().attr("id", o.removeAttr("id").data("placeholder-id")), e === !0) return o[0].value = t;
			o.focus()
		} else n.value = "", o.removeClass("placeholder"), n == r() && n.select();
		else o.removeClass("placeholder")
	}
	function a() {
		var e, t = this,
			a = i(t),
			r = this.id;
		if ("" == t.value) {
			if ("password" == t.type) {
				if (!a.data("placeholder-textinput")) {
					try {
						e = a.clone().attr({
							type: "text"
						})
					} catch (s) {
						e = i("<input>").attr(i.extend(n(this), {
							type: "text"
						}))
					}
					e.removeAttr("name").data({
						"placeholder-password": a,
						"placeholder-id": r
					}).bind("focus.placeholder", o), a.data({
						"placeholder-textinput": e,
						"placeholder-id": r
					}).before(e)
				}
				a = a.removeAttr("id").hide().prev().attr("id", r).show()
			}
			a.addClass("placeholder"), a[0].value = a.attr("placeholder")
		} else a.removeClass("placeholder")
	}
	function r() {
		try {
			return t.activeElement
		} catch (e) {}
	}
	var s, l, c = "[object OperaMini]" == Object.prototype.toString.call(e.operamini),
		d = "placeholder" in t.createElement("input") && !c,
		u = "placeholder" in t.createElement("textarea") && !c,
		f = i.fn,
		h = i.valHooks,
		p = i.propHooks;
	d && u ? (l = f.placeholder = function() {
		return this
	}, l.input = l.textarea = !0) : (l = f.placeholder = function() {
		var e = this;
		return e.filter((d ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({
			"focus.placeholder": o,
			"blur.placeholder": a
		}).data("placeholder-enabled", !0).trigger("blur.placeholder"), e
	}, l.input = d, l.textarea = u, s = {
		get: function(e) {
			var t = i(e),
				n = t.data("placeholder-password");
			return n ? n[0].value : t.data("placeholder-enabled") && t.hasClass("placeholder") ? "" : e.value
		},
		set: function(e, t) {
			var n = i(e),
				s = n.data("placeholder-password");
			return s ? s[0].value = t : n.data("placeholder-enabled") ? ("" == t ? (e.value = t, e != r() && a.call(e)) : n.hasClass("placeholder") ? o.call(e, !0, t) || (e.value = t) : e.value = t, n) : e.value = t
		}
	}, d || (h.input = s, p.value = s), u || (h.textarea = s, p.value = s), i(function() {
		i(t).delegate("form", "submit.placeholder", function() {
			var e = i(".placeholder", this).each(o);
			setTimeout(function() {
				e.each(a)
			}, 10)
		})
	}), i(e).bind("beforeunload.placeholder", function() {
		i(".placeholder").each(function() {
			this.value = ""
		})
	}))
}(this, document, jQuery), function(e) {
	e.fn.qrcode = function(t) {
		function i(e) {
			this.mode = s, this.data = e
		}
		function n(e, t) {
			this.typeNumber = e, this.errorCorrectLevel = t, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = []
		}
		function o(e, t) {
			if (void 0 == e.length) throw Error(e.length + "/" + t);
			for (var i = 0; i < e.length && 0 == e[i];) i++;
			this.num = Array(e.length - i + t);
			for (var n = 0; n < e.length - i; n++) this.num[n] = e[n + i]
		}
		function a(e, t) {
			this.totalCount = e, this.dataCount = t
		}
		function r() {
			this.buffer = [], this.length = 0
		}
		var s;
		i.prototype = {
			getLength: function() {
				return this.data.length
			},
			write: function(e) {
				for (var t = 0; t < this.data.length; t++) e.put(this.data.charCodeAt(t), 8)
			}
		}, n.prototype = {
			addData: function(e) {
				this.dataList.push(new i(e)), this.dataCache = null
			},
			isDark: function(e, t) {
				if (0 > e || this.moduleCount <= e || 0 > t || this.moduleCount <= t) throw Error(e + "," + t);
				return this.modules[e][t]
			},
			getModuleCount: function() {
				return this.moduleCount
			},
			make: function() {
				if (1 > this.typeNumber) {
					for (var e = 1, e = 1; 40 > e; e++) {
						for (var t = a.getRSBlocks(e, this.errorCorrectLevel), i = new r, n = 0, o = 0; o < t.length; o++) n += t[o].dataCount;
						for (o = 0; o < this.dataList.length; o++) t = this.dataList[o], i.put(t.mode, 4), i.put(t.getLength(), l.getLengthInBits(t.mode, e)), t.write(i);
						if (i.getLengthInBits() <= 8 * n) break
					}
					this.typeNumber = e
				}
				this.makeImpl(!1, this.getBestMaskPattern())
			},
			makeImpl: function(e, t) {
				this.moduleCount = 4 * this.typeNumber + 17, this.modules = Array(this.moduleCount);
				for (var i = 0; i < this.moduleCount; i++) {
					this.modules[i] = Array(this.moduleCount);
					for (var o = 0; o < this.moduleCount; o++) this.modules[i][o] = null
				}
				this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), this.setupTimingPattern(), this.setupTypeInfo(e, t), 7 <= this.typeNumber && this.setupTypeNumber(e), null == this.dataCache && (this.dataCache = n.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, t)
			},
			setupPositionProbePattern: function(e, t) {
				for (var i = -1; 7 >= i; i++) if (!(-1 >= e + i || this.moduleCount <= e + i)) for (var n = -1; 7 >= n; n++) - 1 >= t + n || this.moduleCount <= t + n || (this.modules[e + i][t + n] = i >= 0 && 6 >= i && (0 == n || 6 == n) || n >= 0 && 6 >= n && (0 == i || 6 == i) || i >= 2 && 4 >= i && n >= 2 && 4 >= n)
			},
			getBestMaskPattern: function() {
				for (var e = 0, t = 0, i = 0; 8 > i; i++) {
					this.makeImpl(!0, i);
					var n = l.getLostPoint(this);
					(0 == i || e > n) && (e = n, t = i)
				}
				return t
			},
			createMovieClip: function(e, t, i) {
				for (e = e.createEmptyMovieClip(t, i), this.make(), t = 0; t < this.modules.length; t++) for (var i = 1 * t, n = 0; n < this.modules[t].length; n++) {
					var o = 1 * n;
					this.modules[t][n] && (e.beginFill(0, 100), e.moveTo(o, i), e.lineTo(o + 1, i), e.lineTo(o + 1, i + 1), e.lineTo(o, i + 1), e.endFill())
				}
				return e
			},
			setupTimingPattern: function() {
				for (var e = 8; e < this.moduleCount - 8; e++) null == this.modules[e][6] && (this.modules[e][6] = 0 == e % 2);
				for (e = 8; e < this.moduleCount - 8; e++) null == this.modules[6][e] && (this.modules[6][e] = 0 == e % 2)
			},
			setupPositionAdjustPattern: function() {
				for (var e = l.getPatternPosition(this.typeNumber), t = 0; t < e.length; t++) for (var i = 0; i < e.length; i++) {
					var n = e[t],
						o = e[i];
					if (null == this.modules[n][o]) for (var a = -2; 2 >= a; a++) for (var r = -2; 2 >= r; r++) this.modules[n + a][o + r] = -2 == a || 2 == a || -2 == r || 2 == r || 0 == a && 0 == r
				}
			},
			setupTypeNumber: function(e) {
				for (var t = l.getBCHTypeNumber(this.typeNumber), i = 0; 18 > i; i++) {
					var n = !e && 1 == (t >> i & 1);
					this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = n
				}
				for (i = 0; 18 > i; i++) n = !e && 1 == (t >> i & 1), this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = n
			},
			setupTypeInfo: function(e, t) {
				for (var i = l.getBCHTypeInfo(this.errorCorrectLevel << 3 | t), n = 0; 15 > n; n++) {
					var o = !e && 1 == (i >> n & 1);
					6 > n ? this.modules[n][8] = o : 8 > n ? this.modules[n + 1][8] = o : this.modules[this.moduleCount - 15 + n][8] = o
				}
				for (n = 0; 15 > n; n++) o = !e && 1 == (i >> n & 1), 8 > n ? this.modules[8][this.moduleCount - n - 1] = o : 9 > n ? this.modules[8][15 - n - 1 + 1] = o : this.modules[8][15 - n - 1] = o;
				this.modules[this.moduleCount - 8][8] = !e
			},
			mapData: function(e, t) {
				for (var i = -1, n = this.moduleCount - 1, o = 7, a = 0, r = this.moduleCount - 1; r > 0; r -= 2) for (6 == r && r--;;) {
					for (var s = 0; 2 > s; s++) if (null == this.modules[n][r - s]) {
						var c = !1;
						a < e.length && (c = 1 == (e[a] >>> o & 1)), l.getMask(t, n, r - s) && (c = !c), this.modules[n][r - s] = c, o--, -1 == o && (a++, o = 7)
					}
					if (n += i, 0 > n || this.moduleCount <= n) {
						n -= i, i = -i;
						break
					}
				}
			}
		}, n.PAD0 = 236, n.PAD1 = 17, n.createData = function(e, t, i) {
			for (var t = a.getRSBlocks(e, t), o = new r, s = 0; s < i.length; s++) {
				var c = i[s];
				o.put(c.mode, 4), o.put(c.getLength(), l.getLengthInBits(c.mode, e)), c.write(o)
			}
			for (s = e = 0; s < t.length; s++) e += t[s].dataCount;
			if (o.getLengthInBits() > 8 * e) throw Error("code length overflow. (" + o.getLengthInBits() + ">" + 8 * e + ")");
			for (o.getLengthInBits() + 4 <= 8 * e && o.put(0, 4); 0 != o.getLengthInBits() % 8;) o.putBit(!1);
			for (; !(o.getLengthInBits() >= 8 * e) && (o.put(n.PAD0, 8), !(o.getLengthInBits() >= 8 * e));) o.put(n.PAD1, 8);
			return n.createBytes(o, t)
		}, n.createBytes = function(e, t) {
			for (var i = 0, n = 0, a = 0, r = Array(t.length), s = Array(t.length), c = 0; c < t.length; c++) {
				var d = t[c].dataCount,
					u = t[c].totalCount - d,
					n = Math.max(n, d),
					a = Math.max(a, u);
				r[c] = Array(d);
				for (var f = 0; f < r[c].length; f++) r[c][f] = 255 & e.buffer[f + i];
				for (i += d, f = l.getErrorCorrectPolynomial(u), d = new o(r[c], f.getLength() - 1).mod(f), s[c] = Array(f.getLength() - 1), f = 0; f < s[c].length; f++) u = f + d.getLength() - s[c].length, s[c][f] = u >= 0 ? d.get(u) : 0
			}
			for (f = c = 0; f < t.length; f++) c += t[f].totalCount;
			for (i = Array(c), f = d = 0; n > f; f++) for (c = 0; c < t.length; c++) f < r[c].length && (i[d++] = r[c][f]);
			for (f = 0; a > f; f++) for (c = 0; c < t.length; c++) f < s[c].length && (i[d++] = s[c][f]);
			return i
		}, s = 4;
		for (var l = {
			PATTERN_POSITION_TABLE: [
				[],
				[6, 18],
				[6, 22],
				[6, 26],
				[6, 30],
				[6, 34],
				[6, 22, 38],
				[6, 24, 42],
				[6, 26, 46],
				[6, 28, 50],
				[6, 30, 54],
				[6, 32, 58],
				[6, 34, 62],
				[6, 26, 46, 66],
				[6, 26, 48, 70],
				[6, 26, 50, 74],
				[6, 30, 54, 78],
				[6, 30, 56, 82],
				[6, 30, 58, 86],
				[6, 34, 62, 90],
				[6, 28, 50, 72, 94],
				[6, 26, 50, 74, 98],
				[6, 30, 54, 78, 102],
				[6, 28, 54, 80, 106],
				[6, 32, 58, 84, 110],
				[6, 30, 58, 86, 114],
				[6, 34, 62, 90, 118],
				[6, 26, 50, 74, 98, 122],
				[6, 30, 54, 78, 102, 126],
				[6, 26, 52, 78, 104, 130],
				[6, 30, 56, 82, 108, 134],
				[6, 34, 60, 86, 112, 138],
				[6, 30, 58, 86, 114, 142],
				[6, 34, 62, 90, 118, 146],
				[6, 30, 54, 78, 102, 126, 150],
				[6, 24, 50, 76, 102, 128, 154],
				[6, 28, 54, 80, 106, 132, 158],
				[6, 32, 58, 84, 110, 136, 162],
				[6, 26, 54, 82, 110, 138, 166],
				[6, 30, 58, 86, 114, 142, 170]
			],
			G15: 1335,
			G18: 7973,
			G15_MASK: 21522,
			getBCHTypeInfo: function(e) {
				for (var t = e << 10; 0 <= l.getBCHDigit(t) - l.getBCHDigit(l.G15);) t ^= l.G15 << l.getBCHDigit(t) - l.getBCHDigit(l.G15);
				return (e << 10 | t) ^ l.G15_MASK
			},
			getBCHTypeNumber: function(e) {
				for (var t = e << 12; 0 <= l.getBCHDigit(t) - l.getBCHDigit(l.G18);) t ^= l.G18 << l.getBCHDigit(t) - l.getBCHDigit(l.G18);
				return e << 12 | t
			},
			getBCHDigit: function(e) {
				for (var t = 0; 0 != e;) t++, e >>>= 1;
				return t
			},
			getPatternPosition: function(e) {
				return l.PATTERN_POSITION_TABLE[e - 1]
			},
			getMask: function(e, t, i) {
				switch (e) {
				case 0:
					return 0 == (t + i) % 2;
				case 1:
					return 0 == t % 2;
				case 2:
					return 0 == i % 3;
				case 3:
					return 0 == (t + i) % 3;
				case 4:
					return 0 == (Math.floor(t / 2) + Math.floor(i / 3)) % 2;
				case 5:
					return 0 == t * i % 2 + t * i % 3;
				case 6:
					return 0 == (t * i % 2 + t * i % 3) % 2;
				case 7:
					return 0 == (t * i % 3 + (t + i) % 2) % 2;
				default:
					throw Error("bad maskPattern:" + e)
				}
			},
			getErrorCorrectPolynomial: function(e) {
				for (var t = new o([1], 0), i = 0; e > i; i++) t = t.multiply(new o([1, c.gexp(i)], 0));
				return t
			},
			getLengthInBits: function(e, t) {
				if (t >= 1 && 10 > t) switch (e) {
				case 1:
					return 10;
				case 2:
					return 9;
				case s:
					return 8;
				case 8:
					return 8;
				default:
					throw Error("mode:" + e)
				} else if (27 > t) switch (e) {
				case 1:
					return 12;
				case 2:
					return 11;
				case s:
					return 16;
				case 8:
					return 10;
				default:
					throw Error("mode:" + e)
				} else {
					if (!(41 > t)) throw Error("type:" + t);
					switch (e) {
					case 1:
						return 14;
					case 2:
						return 13;
					case s:
						return 16;
					case 8:
						return 12;
					default:
						throw Error("mode:" + e)
					}
				}
			},
			getLostPoint: function(e) {
				for (var t = e.getModuleCount(), i = 0, n = 0; t > n; n++) for (var o = 0; t > o; o++) {
					for (var a = 0, r = e.isDark(n, o), s = -1; 1 >= s; s++) if (!(0 > n + s || n + s >= t)) for (var l = -1; 1 >= l; l++) 0 > o + l || o + l >= t || 0 == s && 0 == l || r == e.isDark(n + s, o + l) && a++;
					a > 5 && (i += 3 + a - 5)
				}
				for (n = 0; t - 1 > n; n++) for (o = 0; t - 1 > o; o++) a = 0, e.isDark(n, o) && a++, e.isDark(n + 1, o) && a++, e.isDark(n, o + 1) && a++, e.isDark(n + 1, o + 1) && a++, (0 == a || 4 == a) && (i += 3);
				for (n = 0; t > n; n++) for (o = 0; t - 6 > o; o++) e.isDark(n, o) && !e.isDark(n, o + 1) && e.isDark(n, o + 2) && e.isDark(n, o + 3) && e.isDark(n, o + 4) && !e.isDark(n, o + 5) && e.isDark(n, o + 6) && (i += 40);
				for (o = 0; t > o; o++) for (n = 0; t - 6 > n; n++) e.isDark(n, o) && !e.isDark(n + 1, o) && e.isDark(n + 2, o) && e.isDark(n + 3, o) && e.isDark(n + 4, o) && !e.isDark(n + 5, o) && e.isDark(n + 6, o) && (i += 40);
				for (o = a = 0; t > o; o++) for (n = 0; t > n; n++) e.isDark(n, o) && a++;
				return e = Math.abs(100 * a / t / t - 50) / 5, i + 10 * e
			}
		}, c = {
			glog: function(e) {
				if (1 > e) throw Error("glog(" + e + ")");
				return c.LOG_TABLE[e]
			},
			gexp: function(e) {
				for (; 0 > e;) e += 255;
				for (; e >= 256;) e -= 255;
				return c.EXP_TABLE[e]
			},
			EXP_TABLE: Array(256),
			LOG_TABLE: Array(256)
		}, d = 0; 8 > d; d++) c.EXP_TABLE[d] = 1 << d;
		for (d = 8; 256 > d; d++) c.EXP_TABLE[d] = c.EXP_TABLE[d - 4] ^ c.EXP_TABLE[d - 5] ^ c.EXP_TABLE[d - 6] ^ c.EXP_TABLE[d - 8];
		for (d = 0; 255 > d; d++) c.LOG_TABLE[c.EXP_TABLE[d]] = d;
		return o.prototype = {
			get: function(e) {
				return this.num[e]
			},
			getLength: function() {
				return this.num.length
			},
			multiply: function(e) {
				for (var t = Array(this.getLength() + e.getLength() - 1), i = 0; i < this.getLength(); i++) for (var n = 0; n < e.getLength(); n++) t[i + n] ^= c.gexp(c.glog(this.get(i)) + c.glog(e.get(n)));
				return new o(t, 0)
			},
			mod: function(e) {
				if (0 > this.getLength() - e.getLength()) return this;
				for (var t = c.glog(this.get(0)) - c.glog(e.get(0)), i = Array(this.getLength()), n = 0; n < this.getLength(); n++) i[n] = this.get(n);
				for (n = 0; n < e.getLength(); n++) i[n] ^= c.gexp(c.glog(e.get(n)) + t);
				return new o(i, 0).mod(e)
			}
		}, a.RS_BLOCK_TABLE = [
			[1, 26, 19],
			[1, 26, 16],
			[1, 26, 13],
			[1, 26, 9],
			[1, 44, 34],
			[1, 44, 28],
			[1, 44, 22],
			[1, 44, 16],
			[1, 70, 55],
			[1, 70, 44],
			[2, 35, 17],
			[2, 35, 13],
			[1, 100, 80],
			[2, 50, 32],
			[2, 50, 24],
			[4, 25, 9],
			[1, 134, 108],
			[2, 67, 43],
			[2, 33, 15, 2, 34, 16],
			[2, 33, 11, 2, 34, 12],
			[2, 86, 68],
			[4, 43, 27],
			[4, 43, 19],
			[4, 43, 15],
			[2, 98, 78],
			[4, 49, 31],
			[2, 32, 14, 4, 33, 15],
			[4, 39, 13, 1, 40, 14],
			[2, 121, 97],
			[2, 60, 38, 2, 61, 39],
			[4, 40, 18, 2, 41, 19],
			[4, 40, 14, 2, 41, 15],
			[2, 146, 116],
			[3, 58, 36, 2, 59, 37],
			[4, 36, 16, 4, 37, 17],
			[4, 36, 12, 4, 37, 13],
			[2, 86, 68, 2, 87, 69],
			[4, 69, 43, 1, 70, 44],
			[6, 43, 19, 2, 44, 20],
			[6, 43, 15, 2, 44, 16],
			[4, 101, 81],
			[1, 80, 50, 4, 81, 51],
			[4, 50, 22, 4, 51, 23],
			[3, 36, 12, 8, 37, 13],
			[2, 116, 92, 2, 117, 93],
			[6, 58, 36, 2, 59, 37],
			[4, 46, 20, 6, 47, 21],
			[7, 42, 14, 4, 43, 15],
			[4, 133, 107],
			[8, 59, 37, 1, 60, 38],
			[8, 44, 20, 4, 45, 21],
			[12, 33, 11, 4, 34, 12],
			[3, 145, 115, 1, 146, 116],
			[4, 64, 40, 5, 65, 41],
			[11, 36, 16, 5, 37, 17],
			[11, 36, 12, 5, 37, 13],
			[5, 109, 87, 1, 110, 88],
			[5, 65, 41, 5, 66, 42],
			[5, 54, 24, 7, 55, 25],
			[11, 36, 12],
			[5, 122, 98, 1, 123, 99],
			[7, 73, 45, 3, 74, 46],
			[15, 43, 19, 2, 44, 20],
			[3, 45, 15, 13, 46, 16],
			[1, 135, 107, 5, 136, 108],
			[10, 74, 46, 1, 75, 47],
			[1, 50, 22, 15, 51, 23],
			[2, 42, 14, 17, 43, 15],
			[5, 150, 120, 1, 151, 121],
			[9, 69, 43, 4, 70, 44],
			[17, 50, 22, 1, 51, 23],
			[2, 42, 14, 19, 43, 15],
			[3, 141, 113, 4, 142, 114],
			[3, 70, 44, 11, 71, 45],
			[17, 47, 21, 4, 48, 22],
			[9, 39, 13, 16, 40, 14],
			[3, 135, 107, 5, 136, 108],
			[3, 67, 41, 13, 68, 42],
			[15, 54, 24, 5, 55, 25],
			[15, 43, 15, 10, 44, 16],
			[4, 144, 116, 4, 145, 117],
			[17, 68, 42],
			[17, 50, 22, 6, 51, 23],
			[19, 46, 16, 6, 47, 17],
			[2, 139, 111, 7, 140, 112],
			[17, 74, 46],
			[7, 54, 24, 16, 55, 25],
			[34, 37, 13],
			[4, 151, 121, 5, 152, 122],
			[4, 75, 47, 14, 76, 48],
			[11, 54, 24, 14, 55, 25],
			[16, 45, 15, 14, 46, 16],
			[6, 147, 117, 4, 148, 118],
			[6, 73, 45, 14, 74, 46],
			[11, 54, 24, 16, 55, 25],
			[30, 46, 16, 2, 47, 17],
			[8, 132, 106, 4, 133, 107],
			[8, 75, 47, 13, 76, 48],
			[7, 54, 24, 22, 55, 25],
			[22, 45, 15, 13, 46, 16],
			[10, 142, 114, 2, 143, 115],
			[19, 74, 46, 4, 75, 47],
			[28, 50, 22, 6, 51, 23],
			[33, 46, 16, 4, 47, 17],
			[8, 152, 122, 4, 153, 123],
			[22, 73, 45, 3, 74, 46],
			[8, 53, 23, 26, 54, 24],
			[12, 45, 15, 28, 46, 16],
			[3, 147, 117, 10, 148, 118],
			[3, 73, 45, 23, 74, 46],
			[4, 54, 24, 31, 55, 25],
			[11, 45, 15, 31, 46, 16],
			[7, 146, 116, 7, 147, 117],
			[21, 73, 45, 7, 74, 46],
			[1, 53, 23, 37, 54, 24],
			[19, 45, 15, 26, 46, 16],
			[5, 145, 115, 10, 146, 116],
			[19, 75, 47, 10, 76, 48],
			[15, 54, 24, 25, 55, 25],
			[23, 45, 15, 25, 46, 16],
			[13, 145, 115, 3, 146, 116],
			[2, 74, 46, 29, 75, 47],
			[42, 54, 24, 1, 55, 25],
			[23, 45, 15, 28, 46, 16],
			[17, 145, 115],
			[10, 74, 46, 23, 75, 47],
			[10, 54, 24, 35, 55, 25],
			[19, 45, 15, 35, 46, 16],
			[17, 145, 115, 1, 146, 116],
			[14, 74, 46, 21, 75, 47],
			[29, 54, 24, 19, 55, 25],
			[11, 45, 15, 46, 46, 16],
			[13, 145, 115, 6, 146, 116],
			[14, 74, 46, 23, 75, 47],
			[44, 54, 24, 7, 55, 25],
			[59, 46, 16, 1, 47, 17],
			[12, 151, 121, 7, 152, 122],
			[12, 75, 47, 26, 76, 48],
			[39, 54, 24, 14, 55, 25],
			[22, 45, 15, 41, 46, 16],
			[6, 151, 121, 14, 152, 122],
			[6, 75, 47, 34, 76, 48],
			[46, 54, 24, 10, 55, 25],
			[2, 45, 15, 64, 46, 16],
			[17, 152, 122, 4, 153, 123],
			[29, 74, 46, 14, 75, 47],
			[49, 54, 24, 10, 55, 25],
			[24, 45, 15, 46, 46, 16],
			[4, 152, 122, 18, 153, 123],
			[13, 74, 46, 32, 75, 47],
			[48, 54, 24, 14, 55, 25],
			[42, 45, 15, 32, 46, 16],
			[20, 147, 117, 4, 148, 118],
			[40, 75, 47, 7, 76, 48],
			[43, 54, 24, 22, 55, 25],
			[10, 45, 15, 67, 46, 16],
			[19, 148, 118, 6, 149, 119],
			[18, 75, 47, 31, 76, 48],
			[34, 54, 24, 34, 55, 25],
			[20, 45, 15, 61, 46, 16]
		], a.getRSBlocks = function(e, t) {
			var i = a.getRsBlockTable(e, t);
			if (void 0 == i) throw Error("bad rs block @ typeNumber:" + e + "/errorCorrectLevel:" + t);
			for (var n = i.length / 3, o = [], r = 0; n > r; r++) for (var s = i[3 * r + 0], l = i[3 * r + 1], c = i[3 * r + 2], d = 0; s > d; d++) o.push(new a(l, c));
			return o
		}, a.getRsBlockTable = function(e, t) {
			switch (t) {
			case 1:
				return a.RS_BLOCK_TABLE[4 * (e - 1) + 0];
			case 0:
				return a.RS_BLOCK_TABLE[4 * (e - 1) + 1];
			case 3:
				return a.RS_BLOCK_TABLE[4 * (e - 1) + 2];
			case 2:
				return a.RS_BLOCK_TABLE[4 * (e - 1) + 3]
			}
		}, r.prototype = {
			get: function(e) {
				return 1 == (this.buffer[Math.floor(e / 8)] >>> 7 - e % 8 & 1)
			},
			put: function(e, t) {
				for (var i = 0; t > i; i++) this.putBit(1 == (e >>> t - i - 1 & 1))
			},
			getLengthInBits: function() {
				return this.length
			},
			putBit: function(e) {
				var t = Math.floor(this.length / 8);
				this.buffer.length <= t && this.buffer.push(0), e && (this.buffer[t] |= 128 >>> this.length % 8), this.length++
			}
		}, "string" == typeof t && (t = {
			text: t
		}), t = e.extend({}, {
			render: "canvas",
			width: 256,
			height: 256,
			typeNumber: -1,
			correctLevel: 2,
			background: "#ffffff",
			foreground: "#000000"
		}, t), this.each(function() {
			var i;
			if ("canvas" == t.render) {
				i = new n(t.typeNumber, t.correctLevel), i.addData(t.text), i.make();
				var o = document.createElement("canvas");
				o.width = t.width, o.height = t.height;
				for (var a = o.getContext("2d"), r = t.width / i.getModuleCount(), s = t.height / i.getModuleCount(), l = 0; l < i.getModuleCount(); l++) for (var c = 0; c < i.getModuleCount(); c++) {
					a.fillStyle = i.isDark(l, c) ? t.foreground : t.background;
					var d = Math.ceil((c + 1) * r) - Math.floor(c * r),
						u = Math.ceil((l + 1) * r) - Math.floor(l * r);
					a.fillRect(Math.round(c * r), Math.round(l * s), d, u)
				}
			} else for (i = new n(t.typeNumber, t.correctLevel), i.addData(t.text), i.make(), o = e("<table></table>").css("width", t.width + "px").css("height", t.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", t.background), a = t.width / i.getModuleCount(), r = t.height / i.getModuleCount(), s = 0; s < i.getModuleCount(); s++) for (l = e("<tr></tr>").css("height", r + "px").appendTo(o), c = 0; c < i.getModuleCount(); c++) e("<td></td>").css("width", a + "px").css("background-color", i.isDark(s, c) ? t.foreground : t.background).appendTo(l);
			i = o, jQuery(i).appendTo(this)
		})
	}
}(jQuery), function(e, t) {
	var i, n = e,
		o = n.document,
		a = n.navigator,
		r = n.setTimeout,
		s = n.Number.parseInt || n.parseInt,
		l = n.Number.parseFloat || n.parseFloat,
		c = n.Number.isNaN || n.isNaN,
		d = n.encodeURIComponent,
		u = n.Math,
		f = n.Date,
		h = n.ActiveXObject,
		p = n.Array.prototype.slice,
		g = n.Object.keys,
		m = n.Object.prototype.hasOwnProperty,
		v = function() {
			return "function" == typeof n.Object.defineProperty &&
			function() {
				try {
					var e = {};
					return n.Object.defineProperty(e, "y", {
						value: "z"
					}), "z" === e.y
				} catch (t) {
					return !1
				}
			}() ? n.Object.defineProperty : void 0
		}(),
		y = function(e) {
			return p.call(e, 0)
		},
		_ = function(e, t, i) {
			if ("function" == typeof t.indexOf) return t.indexOf(e, i);
			var n, o = t.length;
			for ("undefined" == typeof i ? i = 0 : 0 > i && (i = o + i), n = i; o > n; n++) if (m.call(t, n) && t[n] === e) return n;
			return -1
		},
		b = function() {
			var e, i, n, o, a, r, s = y(arguments),
				l = s[0] || {};
			for (e = 1, i = s.length; i > e; e++) if (null != (n = s[e])) for (o in n) if (m.call(n, o)) {
				if (a = l[o], r = n[o], l === r) continue;
				r !== t && (l[o] = r)
			}
			return l
		},
		w = function(e) {
			var t, i, n, o;
			if ("object" != typeof e || null == e) t = e;
			else if ("number" == typeof e.length) for (t = [], i = 0, n = e.length; n > i; i++) m.call(e, i) && (t[i] = w(e[i]));
			else {
				t = {};
				for (o in e) m.call(e, o) && (t[o] = w(e[o]))
			}
			return t
		},
		k = function(e, t) {
			for (var i = {}, n = 0, o = t.length; o > n; n++) t[n] in e && (i[t[n]] = e[t[n]]);
			return i
		},
		x = function(e, t) {
			var i = {};
			for (var n in e) - 1 === _(n, t) && (i[n] = e[n]);
			return i
		},
		C = function(e) {
			if (null == e) return [];
			if (g) return g(e);
			var t = [];
			for (var i in e) m.call(e, i) && t.push(i);
			return t
		},
		S = function(e) {
			if (e) for (var t in e) m.call(e, t) && delete e[t];
			return e
		},
		j = function(e, t) {
			t in e && "function" == typeof v && v(e, t, {
				value: e[t],
				writable: !1,
				configurable: !0,
				enumerable: !0
			})
		},
		T = function(e) {
			return function() {
				var t;
				return t = e.now ? e.now() : (new e).getTime()
			}
		}(f),
		I = function(e, t) {
			if (e && 1 === e.nodeType && t && (1 === t.nodeType || 9 === t.nodeType)) do {
				if (e === t) return !0;
				e = e.parentNode
			} while (e);
			return !1
		},
		D = {
			bridge: null,
			version: "0.0.0",
			pluginType: "unknown",
			disabled: null,
			outdated: null,
			unavailable: null,
			deactivated: null,
			overdue: null,
			ready: null
		},
		A = "11.0.0",
		L = {},
		N = {},
		O = null,
		E = {
			ready: "Flash communication is established",
			error: {
				"flash-disabled": "Flash is disabled or not installed",
				"flash-outdated": "Flash is too outdated to support ZeroClipboard",
				"flash-unavailable": "Flash is unable to communicate bidirectionally with JavaScript",
				"flash-deactivated": "Flash is too outdated for your browser and/or is configured as click-to-activate",
				"flash-overdue": "Flash communication was established but NOT within the acceptable time limit"
			}
		},
		M = function() {
			var e, t, i, n, a = "ZeroClipboard.swf";
			if (!o.currentScript || !(n = o.currentScript.src)) {
				var r = o.getElementsByTagName("script");
				if ("readyState" in r[0]) for (e = r.length; e-- && ("interactive" !== r[e].readyState || !(n = r[e].src)););
				else if ("loading" === o.readyState) n = r[r.length - 1].src;
				else {
					for (e = r.length; e--;) {
						if (i = r[e].src, !i) {
							t = null;
							break
						}
						if (i = i.split("#")[0].split("?")[0], i = i.slice(0, i.lastIndexOf("/") + 1), null == t) t = i;
						else if (t !== i) {
							t = null;
							break
						}
					}
					null !== t && (n = t)
				}
			}
			return n && (n = n.split("#")[0].split("?")[0], a = n.slice(0, n.lastIndexOf("/") + 1) + a), a
		}(),
		P = {
			swfPath: M,
			trustedDomains: e.location.host ? [e.location.host] : [],
			cacheBust: !0,
			forceEnhancedClipboard: !1,
			flashLoadTimeout: 3e4,
			autoActivate: !0,
			bubbleEvents: !0,
			containerId: "global-zeroclipboard-html-bridge",
			containerClass: "global-zeroclipboard-container",
			swfObjectId: "global-zeroclipboard-flash-bridge",
			hoverClass: "zeroclipboard-is-hover",
			activeClass: "zeroclipboard-is-active",
			forceHandCursor: !1,
			title: null,
			zIndex: 999999999
		},
		B = function(e) {
			if ("object" == typeof e && null !== e) for (var t in e) if (m.call(e, t)) if (/^(?:forceHandCursor|title|zIndex|bubbleEvents)$/.test(t)) P[t] = e[t];
			else if (null == D.bridge) if ("containerId" === t || "swfObjectId" === t) {
				if (!V(e[t])) throw new Error("The specified `" + t + "` value is not valid as an HTML4 Element ID");
				P[t] = e[t]
			} else P[t] = e[t]; {
				if ("string" != typeof e || !e) return w(P);
				if (m.call(P, e)) return P[e]
			}
		},
		R = function() {
			return {
				browser: k(a, ["userAgent", "platform", "appName"]),
				flash: x(D, ["bridge"]),
				zeroclipboard: {
					version: je.version,
					config: je.config()
				}
			}
		},
		$ = function() {
			return !!(D.disabled || D.outdated || D.unavailable || D.deactivated)
		},
		F = function(e, t) {
			var i, n, o, a = {};
			if ("string" == typeof e && e) o = e.toLowerCase().split(/\s+/);
			else if ("object" == typeof e && e && "undefined" == typeof t) for (i in e) m.call(e, i) && "string" == typeof i && i && "function" == typeof e[i] && je.on(i, e[i]);
			if (o && o.length) {
				for (i = 0, n = o.length; n > i; i++) e = o[i].replace(/^on/, ""), a[e] = !0, L[e] || (L[e] = []), L[e].push(t);
				if (a.ready && D.ready && je.emit({
					type: "ready"
				}), a.error) {
					var r = ["disabled", "outdated", "unavailable", "deactivated", "overdue"];
					for (i = 0, n = r.length; n > i; i++) if (D[r[i]] === !0) {
						je.emit({
							type: "error",
							name: "flash-" + r[i]
						});
						break
					}
				}
			}
			return je
		},
		q = function(e, t) {
			var i, n, o, a, r;
			if (0 === arguments.length) a = C(L);
			else if ("string" == typeof e && e) a = e.split(/\s+/);
			else if ("object" == typeof e && e && "undefined" == typeof t) for (i in e) m.call(e, i) && "string" == typeof i && i && "function" == typeof e[i] && je.off(i, e[i]);
			if (a && a.length) for (i = 0, n = a.length; n > i; i++) if (e = a[i].toLowerCase().replace(/^on/, ""), r = L[e], r && r.length) if (t) for (o = _(t, r); - 1 !== o;) r.splice(o, 1), o = _(t, r, o);
			else r.length = 0;
			return je
		},
		z = function(e) {
			var t;
			return t = "string" == typeof e && e ? w(L[e]) || null : w(L)
		},
		H = function(e) {
			var t, i, n;
			return e = K(e), e && !ne(e) ? "ready" === e.type && D.overdue === !0 ? je.emit({
				type: "error",
				name: "flash-overdue"
			}) : (t = b({}, e), ie.call(this, t), "copy" === e.type && (n = ce(N), i = n.data, O = n.formatMap), i) : void 0
		},
		Y = function() {
			if ("boolean" != typeof D.ready && (D.ready = !1), !je.isFlashUnusable() && null === D.bridge) {
				var e = P.flashLoadTimeout;
				"number" == typeof e && e >= 0 && r(function() {
					"boolean" != typeof D.deactivated && (D.deactivated = !0), D.deactivated === !0 && je.emit({
						type: "error",
						name: "flash-deactivated"
					})
				}, e), D.overdue = !1, se()
			}
		},
		U = function() {
			je.clearData(), je.deactivate(), je.emit("destroy"), le(), je.off()
		},
		W = function(e, t) {
			var i;
			if ("object" == typeof e && e && "undefined" == typeof t) i = e, je.clearData();
			else {
				if ("string" != typeof e || !e) return;
				i = {}, i[e] = t
			}
			for (var n in i)"string" == typeof n && n && m.call(i, n) && "string" == typeof i[n] && i[n] && (N[n] = i[n])
		},
		G = function(e) {
			"undefined" == typeof e ? (S(N), O = null) : "string" == typeof e && m.call(N, e) && delete N[e]
		},
		J = function(e) {
			if (e && 1 === e.nodeType) {
				i && (ve(i, P.activeClass), i !== e && ve(i, P.hoverClass)), i = e, me(e, P.hoverClass);
				var t = e.getAttribute("title") || P.title;
				if ("string" == typeof t && t) {
					var n = re(D.bridge);
					n && n.setAttribute("title", t)
				}
				var o = P.forceHandCursor === !0 || "pointer" === _e(e, "cursor");
				xe(o), ke()
			}
		},
		X = function() {
			var e = re(D.bridge);
			e && (e.removeAttribute("title"), e.style.left = "0px", e.style.top = "-9999px", e.style.width = "1px", e.style.top = "1px"), i && (ve(i, P.hoverClass), ve(i, P.activeClass), i = null)
		},
		V = function(e) {
			return "string" == typeof e && e && /^[A-Za-z][A-Za-z0-9_:\-\.]*$/.test(e)
		},
		K = function(e) {
			var t;
			if ("string" == typeof e && e ? (t = e, e = {}) : "object" == typeof e && e && "string" == typeof e.type && e.type && (t = e.type), t) {
				b(e, {
					type: t.toLowerCase(),
					target: e.target || i || null,
					relatedTarget: e.relatedTarget || null,
					currentTarget: D && D.bridge || null,
					timeStamp: e.timeStamp || T() || null
				});
				var n = E[e.type];
				return "error" === e.type && e.name && n && (n = n[e.name]), n && (e.message = n), "ready" === e.type && b(e, {
					target: null,
					version: D.version
				}), "error" === e.type && (/^flash-(disabled|outdated|unavailable|deactivated|overdue)$/.test(e.name) && b(e, {
					target: null,
					minimumVersion: A
				}), /^flash-(outdated|unavailable|deactivated|overdue)$/.test(e.name) && b(e, {
					version: D.version
				})), "copy" === e.type && (e.clipboardData = {
					setData: je.setData,
					clearData: je.clearData
				}), "aftercopy" === e.type && (e = de(e, O)), e.target && !e.relatedTarget && (e.relatedTarget = Q(e.target)), e = Z(e)
			}
		},
		Q = function(e) {
			var t = e && e.getAttribute && e.getAttribute("data-clipboard-target");
			return t ? o.getElementById(t) : null
		},
		Z = function(e) {
			if (e && /^_(?:click|mouse(?:over|out|down|up|move))$/.test(e.type)) {
				var i = e.target,
					a = "_mouseover" === e.type && e.relatedTarget ? e.relatedTarget : t,
					r = "_mouseout" === e.type && e.relatedTarget ? e.relatedTarget : t,
					s = we(i),
					l = n.screenLeft || n.screenX || 0,
					c = n.screenTop || n.screenY || 0,
					d = o.body.scrollLeft + o.documentElement.scrollLeft,
					u = o.body.scrollTop + o.documentElement.scrollTop,
					f = s.left + ("number" == typeof e._stageX ? e._stageX : 0),
					h = s.top + ("number" == typeof e._stageY ? e._stageY : 0),
					p = f - d,
					g = h - u,
					m = l + p,
					v = c + g,
					y = "number" == typeof e.movementX ? e.movementX : 0,
					_ = "number" == typeof e.movementY ? e.movementY : 0;
				delete e._stageX, delete e._stageY, b(e, {
					srcElement: i,
					fromElement: a,
					toElement: r,
					screenX: m,
					screenY: v,
					pageX: f,
					pageY: h,
					clientX: p,
					clientY: g,
					x: p,
					y: g,
					movementX: y,
					movementY: _,
					offsetX: 0,
					offsetY: 0,
					layerX: 0,
					layerY: 0
				})
			}
			return e
		},
		ee = function(e) {
			var t = e && "string" == typeof e.type && e.type || "";
			return !/^(?:(?:before)?copy|destroy)$/.test(t)
		},
		te = function(e, t, i, n) {
			n ? r(function() {
				e.apply(t, i)
			}, 0) : e.apply(t, i)
		},
		ie = function(e) {
			if ("object" == typeof e && e && e.type) {
				var t = ee(e),
					i = L["*"] || [],
					o = L[e.type] || [],
					a = i.concat(o);
				if (a && a.length) {
					var r, s, l, c, d, u = this;
					for (r = 0, s = a.length; s > r; r++) l = a[r], c = u, "string" == typeof l && "function" == typeof n[l] && (l = n[l]), "object" == typeof l && l && "function" == typeof l.handleEvent && (c = l, l = l.handleEvent), "function" == typeof l && (d = b({}, e), te(l, c, [d], t))
				}
				return this
			}
		},
		ne = function(e) {
			var t = e.target || i || null,
				n = "swf" === e._source;
			switch (delete e._source, e.type) {
			case "error":
				_(e.name, ["flash-disabled", "flash-outdated", "flash-deactivated", "flash-overdue"]) && b(D, {
					disabled: "flash-disabled" === e.name,
					outdated: "flash-outdated" === e.name,
					unavailable: "flash-unavailable" === e.name,
					deactivated: "flash-deactivated" === e.name,
					overdue: "flash-overdue" === e.name,
					ready: !1
				});
				break;
			case "ready":
				var o = D.deactivated === !0;
				b(D, {
					disabled: !1,
					outdated: !1,
					unavailable: !1,
					deactivated: !1,
					overdue: o,
					ready: !o
				});
				break;
			case "copy":
				var a, r, s = e.relatedTarget;
				!N["text/html"] && !N["text/plain"] && s && (r = s.value || s.outerHTML || s.innerHTML) && (a = s.value || s.textContent || s.innerText) ? (e.clipboardData.clearData(), e.clipboardData.setData("text/plain", a), r !== a && e.clipboardData.setData("text/html", r)) : !N["text/plain"] && e.target && (a = e.target.getAttribute("data-clipboard-text")) && (e.clipboardData.clearData(), e.clipboardData.setData("text/plain", a));
				break;
			case "aftercopy":
				je.clearData(), t && t !== ge() && t.focus && t.focus();
				break;
			case "_mouseover":
				je.activate(t), P.bubbleEvents === !0 && n && (t && t !== e.relatedTarget && !I(e.relatedTarget, t) && oe(b({}, e, {
					type: "mouseenter",
					bubbles: !1,
					cancelable: !1
				})), oe(b({}, e, {
					type: "mouseover"
				})));
				break;
			case "_mouseout":
				je.deactivate(), P.bubbleEvents === !0 && n && (t && t !== e.relatedTarget && !I(e.relatedTarget, t) && oe(b({}, e, {
					type: "mouseleave",
					bubbles: !1,
					cancelable: !1
				})), oe(b({}, e, {
					type: "mouseout"
				})));
				break;
			case "_mousedown":
				me(t, P.activeClass), P.bubbleEvents === !0 && n && oe(b({}, e, {
					type: e.type.slice(1)
				}));
				break;
			case "_mouseup":
				ve(t, P.activeClass), P.bubbleEvents === !0 && n && oe(b({}, e, {
					type: e.type.slice(1)
				}));
				break;
			case "_click":
			case "_mousemove":
				P.bubbleEvents === !0 && n && oe(b({}, e, {
					type: e.type.slice(1)
				}))
			}
			return /^_(?:click|mouse(?:over|out|down|up|move))$/.test(e.type) ? !0 : void 0
		},
		oe = function(e) {
			if (e && "string" == typeof e.type && e) {
				var t, i = e.target || e.srcElement || null,
					a = i && i.ownerDocument || o,
					r = {
						view: a.defaultView || n,
						canBubble: !0,
						cancelable: !0,
						detail: "click" === e.type ? 1 : 0,
						button: "number" == typeof e.which ? e.which - 1 : "number" == typeof e.button ? e.button : a.createEvent ? 0 : 1
					},
					s = b(r, e);
				i && (a.createEvent && i.dispatchEvent ? (s = [s.type, s.canBubble, s.cancelable, s.view, s.detail, s.screenX, s.screenY, s.clientX, s.clientY, s.ctrlKey, s.altKey, s.shiftKey, s.metaKey, s.button, s.relatedTarget], t = a.createEvent("MouseEvents"), t.initMouseEvent && (t.initMouseEvent.apply(t, s), i.dispatchEvent(t))) : a.createEventObject && i.fireEvent && (t = a.createEventObject(s), i.fireEvent("on" + s.type, t)))
			}
		},
		ae = function() {
			var e = o.createElement("div");
			return e.id = P.containerId, e.className = P.containerClass, e.style.position = "absolute", e.style.left = "0px", e.style.top = "-9999px", e.style.width = "1px", e.style.height = "1px", e.style.zIndex = "" + Ce(P.zIndex), e
		},
		re = function(e) {
			for (var t = e && e.parentNode; t && "OBJECT" === t.nodeName && t.parentNode;) t = t.parentNode;
			return t || null
		},
		se = function() {
			var e, t = D.bridge,
				i = re(t);
			if (!t) {
				var a = pe(n.location.host, P),
					r = "never" === a ? "none" : "all",
					s = fe(P),
					l = P.swfPath + ue(P.swfPath, P);
				i = ae();
				var c = o.createElement("div");
				i.appendChild(c), o.body.appendChild(i);
				var d = o.createElement("div"),
					u = "activex" === D.pluginType;
				d.innerHTML = '<object id="' + P.swfObjectId + '" name="' + P.swfObjectId + '" width="100%" height="100%" ' + (u ? 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' : 'type="application/x-shockwave-flash" data="' + l + '"') + ">" + (u ? '<param name="movie" value="' + l + '"/>' : "") + '<param name="allowScriptAccess" value="' + a + '"/><param name="allowNetworking" value="' + r + '"/><param name="menu" value="false"/><param name="wmode" value="transparent"/><param name="flashvars" value="' + s + '"/></object>', t = d.firstChild, d = null, t.ZeroClipboard = je, i.replaceChild(t, c)
			}
			return t || (t = o[P.swfObjectId], t && (e = t.length) && (t = t[e - 1]), !t && i && (t = i.firstChild)), D.bridge = t || null, t
		},
		le = function() {
			var e = D.bridge;
			if (e) {
				var t = re(e);
				t && ("activex" === D.pluginType && "readyState" in e ? (e.style.display = "none", function i() {
					if (4 === e.readyState) {
						for (var n in e)"function" == typeof e[n] && (e[n] = null);
						e.parentNode && e.parentNode.removeChild(e), t.parentNode && t.parentNode.removeChild(t)
					} else r(i, 10)
				}()) : (e.parentNode && e.parentNode.removeChild(e), t.parentNode && t.parentNode.removeChild(t))), D.ready = null, D.bridge = null, D.deactivated = null
			}
		},
		ce = function(e) {
			var t = {},
				i = {};
			if ("object" == typeof e && e) {
				for (var n in e) if (n && m.call(e, n) && "string" == typeof e[n] && e[n]) switch (n.toLowerCase()) {
				case "text/plain":
				case "text":
				case "air:text":
				case "flash:text":
					t.text = e[n], i.text = n;
					break;
				case "text/html":
				case "html":
				case "air:html":
				case "flash:html":
					t.html = e[n], i.html = n;
					break;
				case "application/rtf":
				case "text/rtf":
				case "rtf":
				case "richtext":
				case "air:rtf":
				case "flash:rtf":
					t.rtf = e[n], i.rtf = n
				}
				return {
					data: t,
					formatMap: i
				}
			}
		},
		de = function(e, t) {
			if ("object" != typeof e || !e || "object" != typeof t || !t) return e;
			var i = {};
			for (var n in e) if (m.call(e, n)) {
				if ("success" !== n && "data" !== n) {
					i[n] = e[n];
					continue
				}
				i[n] = {};
				var o = e[n];
				for (var a in o) a && m.call(o, a) && m.call(t, a) && (i[n][t[a]] = o[a])
			}
			return i
		},
		ue = function(e, t) {
			var i = null == t || t && t.cacheBust === !0;
			return i ? (-1 === e.indexOf("?") ? "?" : "&") + "noCache=" + T() : ""
		},
		fe = function(e) {
			var t, i, o, a, r = "",
				s = [];
			if (e.trustedDomains && ("string" == typeof e.trustedDomains ? a = [e.trustedDomains] : "object" == typeof e.trustedDomains && "length" in e.trustedDomains && (a = e.trustedDomains)), a && a.length) for (t = 0, i = a.length; i > t; t++) if (m.call(a, t) && a[t] && "string" == typeof a[t]) {
				if (o = he(a[t]), !o) continue;
				if ("*" === o) {
					s = [o];
					break
				}
				s.push.apply(s, [o, "//" + o, n.location.protocol + "//" + o])
			}
			return s.length && (r += "trustedOrigins=" + d(s.join(","))), e.forceEnhancedClipboard === !0 && (r += (r ? "&" : "") + "forceEnhancedClipboard=true"), "string" == typeof e.swfObjectId && e.swfObjectId && (r += (r ? "&" : "") + "swfObjectId=" + d(e.swfObjectId)), r
		},
		he = function(e) {
			if (null == e || "" === e) return null;
			if (e = e.replace(/^\s+|\s+$/g, ""), "" === e) return null;
			var t = e.indexOf("//");
			e = -1 === t ? e : e.slice(t + 2);
			var i = e.indexOf("/");
			return e = -1 === i ? e : -1 === t || 0 === i ? null : e.slice(0, i), e && ".swf" === e.slice(-4).toLowerCase() ? null : e || null
		},
		pe = function() {
			var e = function(e, t) {
					var i, n, o;
					if (null != e && "*" !== t[0] && ("string" == typeof e && (e = [e]), "object" == typeof e && "number" == typeof e.length)) for (i = 0, n = e.length; n > i; i++) if (m.call(e, i) && (o = he(e[i]))) {
						if ("*" === o) {
							t.length = 0, t.push("*");
							break
						} - 1 === _(o, t) && t.push(o)
					}
				};
			return function(t, i) {
				var n = he(i.swfPath);
				null === n && (n = t);
				var o = [];
				e(i.trustedOrigins, o), e(i.trustedDomains, o);
				var a = o.length;
				if (a > 0) {
					if (1 === a && "*" === o[0]) return "always";
					if (-1 !== _(t, o)) return 1 === a && t === n ? "sameDomain" : "always"
				}
				return "never"
			}
		}(),
		ge = function() {
			try {
				return o.activeElement
			} catch (e) {
				return null
			}
		},
		me = function(e, t) {
			if (!e || 1 !== e.nodeType) return e;
			if (e.classList) return e.classList.contains(t) || e.classList.add(t), e;
			if (t && "string" == typeof t) {
				var i = (t || "").split(/\s+/);
				if (1 === e.nodeType) if (e.className) {
					for (var n = " " + e.className + " ", o = e.className, a = 0, r = i.length; r > a; a++) n.indexOf(" " + i[a] + " ") < 0 && (o += " " + i[a]);
					e.className = o.replace(/^\s+|\s+$/g, "")
				} else e.className = t
			}
			return e
		},
		ve = function(e, t) {
			if (!e || 1 !== e.nodeType) return e;
			if (e.classList) return e.classList.contains(t) && e.classList.remove(t), e;
			if ("string" == typeof t && t) {
				var i = t.split(/\s+/);
				if (1 === e.nodeType && e.className) {
					for (var n = (" " + e.className + " ").replace(/[\n\t]/g, " "), o = 0, a = i.length; a > o; o++) n = n.replace(" " + i[o] + " ", " ");
					e.className = n.replace(/^\s+|\s+$/g, "")
				}
			}
			return e
		},
		ye = function() {
			var e = /\-([a-z])/g,
				t = function(e, t) {
					return t.toUpperCase()
				};
			return function(i) {
				return i.replace(e, t)
			}
		}(),
		_e = function(e, t) {
			var i, o, a;
			return n.getComputedStyle ? i = n.getComputedStyle(e, null).getPropertyValue(t) : (o = ye(t), i = e.currentStyle ? e.currentStyle[o] : e.style[o]), "cursor" !== t || i && "auto" !== i || (a = e.tagName.toLowerCase(), "a" !== a) ? i : "pointer"
		},
		be = function() {
			var e, t, i, n = 1;
			return "function" == typeof o.body.getBoundingClientRect && (e = o.body.getBoundingClientRect(), t = e.right - e.left, i = o.body.offsetWidth, n = u.round(t / i * 100) / 100), n
		},
		we = function(e) {
			var t = {
				left: 0,
				top: 0,
				width: 0,
				height: 0
			};
			if (e.getBoundingClientRect) {
				var i, a, r, s = e.getBoundingClientRect();
				"pageXOffset" in n && "pageYOffset" in n ? (i = n.pageXOffset, a = n.pageYOffset) : (r = be(), i = u.round(o.documentElement.scrollLeft / r), a = u.round(o.documentElement.scrollTop / r));
				var l = o.documentElement.clientLeft || 0,
					c = o.documentElement.clientTop || 0;
				t.left = s.left + i - l, t.top = s.top + a - c, t.width = "width" in s ? s.width : s.right - s.left, t.height = "height" in s ? s.height : s.bottom - s.top
			}
			return t
		},
		ke = function() {
			var e;
			if (i && (e = re(D.bridge))) {
				var t = we(i);
				b(e.style, {
					width: t.width + "px",
					height: t.height + "px",
					top: t.top + "px",
					left: t.left + "px",
					zIndex: "" + Ce(P.zIndex)
				})
			}
		},
		xe = function(e) {
			D.ready === !0 && (D.bridge && "function" == typeof D.bridge.setHandCursor ? D.bridge.setHandCursor(e) : D.ready = !1)
		},
		Ce = function(e) {
			if (/^(?:auto|inherit)$/.test(e)) return e;
			var t;
			return "number" != typeof e || c(e) ? "string" == typeof e && (t = Ce(s(e, 10))) : t = e, "number" == typeof t ? t : "auto"
		},
		Se = function(e) {
			function t(e) {
				var t = e.match(/[\d]+/g);
				return t.length = 3, t.join(".")
			}
			function i(e) {
				return !!e && (e = e.toLowerCase()) && (/^(pepflashplayer\.dll|libpepflashplayer\.so|pepperflashplayer\.plugin)$/.test(e) || "chrome.plugin" === e.slice(-13))
			}
			function n(e) {
				e && (c = !0, e.version && (f = t(e.version)), !f && e.description && (f = t(e.description)), e.filename && (u = i(e.filename)))
			}
			var o, r, s, c = !1,
				d = !1,
				u = !1,
				f = "";
			if (a.plugins && a.plugins.length) o = a.plugins["Shockwave Flash"], n(o), a.plugins["Shockwave Flash 2.0"] && (c = !0, f = "2.0.0.11");
			else if (a.mimeTypes && a.mimeTypes.length) s = a.mimeTypes["application/x-shockwave-flash"], o = s && s.enabledPlugin, n(o);
			else if ("undefined" != typeof e) {
				d = !0;
				try {
					r = new e("ShockwaveFlash.ShockwaveFlash.7"), c = !0, f = t(r.GetVariable("$version"))
				} catch (h) {
					try {
						r = new e("ShockwaveFlash.ShockwaveFlash.6"), c = !0, f = "6.0.21"
					} catch (p) {
						try {
							r = new e("ShockwaveFlash.ShockwaveFlash"), c = !0, f = t(r.GetVariable("$version"))
						} catch (g) {
							d = !1
						}
					}
				}
			}
			D.disabled = c !== !0, D.outdated = f && l(f) < l(A), D.version = f || "0.0.0", D.pluginType = u ? "pepper" : d ? "activex" : c ? "netscape" : "unknown"
		};
	Se(h);
	var je = function() {
			return this instanceof je ? void("function" == typeof je._createClient && je._createClient.apply(this, y(arguments))) : new je
		};
	je.version = "2.0.2", j(je, "version"), je.config = function() {
		return B.apply(this, y(arguments))
	}, je.state = function() {
		return R.apply(this, y(arguments))
	}, je.isFlashUnusable = function() {
		return $.apply(this, y(arguments))
	}, je.on = function() {
		return F.apply(this, y(arguments))
	}, je.off = function() {
		return q.apply(this, y(arguments))
	}, je.handlers = function() {
		return z.apply(this, y(arguments))
	}, je.emit = function() {
		return H.apply(this, y(arguments))
	}, je.create = function() {
		return Y.apply(this, y(arguments))
	}, je.destroy = function() {
		return U.apply(this, y(arguments))
	}, je.setData = function() {
		return W.apply(this, y(arguments))
	}, je.clearData = function() {
		return G.apply(this, y(arguments))
	}, je.activate = function() {
		return J.apply(this, y(arguments))
	}, je.deactivate = function() {
		return X.apply(this, y(arguments))
	};
	var Te = 0,
		Ie = {},
		De = 0,
		Ae = {},
		Le = {};
	b(P, {
		autoActivate: !0
	});
	var Ne = function(e) {
			var t = this;
			t.id = "" + Te++, Ie[t.id] = {
				instance: t,
				elements: [],
				handlers: {}
			}, e && t.clip(e), je.on("*", function(e) {
				return t.emit(e)
			}), je.on("destroy", function() {
				t.destroy()
			}), je.create()
		},
		Oe = function(e, t) {
			var i, n, o, a = {},
				r = Ie[this.id] && Ie[this.id].handlers;
			if ("string" == typeof e && e) o = e.toLowerCase().split(/\s+/);
			else if ("object" == typeof e && e && "undefined" == typeof t) for (i in e) m.call(e, i) && "string" == typeof i && i && "function" == typeof e[i] && this.on(i, e[i]);
			if (o && o.length) {
				for (i = 0, n = o.length; n > i; i++) e = o[i].replace(/^on/, ""), a[e] = !0, r[e] || (r[e] = []), r[e].push(t);
				if (a.ready && D.ready && this.emit({
					type: "ready",
					client: this
				}), a.error) {
					var s = ["disabled", "outdated", "unavailable", "deactivated", "overdue"];
					for (i = 0, n = s.length; n > i; i++) if (D[s[i]]) {
						this.emit({
							type: "error",
							name: "flash-" + s[i],
							client: this
						});
						break
					}
				}
			}
			return this
		},
		Ee = function(e, t) {
			var i, n, o, a, r, s = Ie[this.id] && Ie[this.id].handlers;
			if (0 === arguments.length) a = C(s);
			else if ("string" == typeof e && e) a = e.split(/\s+/);
			else if ("object" == typeof e && e && "undefined" == typeof t) for (i in e) m.call(e, i) && "string" == typeof i && i && "function" == typeof e[i] && this.off(i, e[i]);
			if (a && a.length) for (i = 0, n = a.length; n > i; i++) if (e = a[i].toLowerCase().replace(/^on/, ""), r = s[e], r && r.length) if (t) for (o = _(t, r); - 1 !== o;) r.splice(o, 1), o = _(t, r, o);
			else r.length = 0;
			return this
		},
		Me = function(e) {
			var t = null,
				i = Ie[this.id] && Ie[this.id].handlers;
			return i && (t = "string" == typeof e && e ? i[e] ? i[e].slice(0) : [] : w(i)), t
		},
		Pe = function(e) {
			if (qe.call(this, e)) {
				"object" == typeof e && e && "string" == typeof e.type && e.type && (e = b({}, e));
				var t = b({}, K(e), {
					client: this
				});
				ze.call(this, t)
			}
			return this
		},
		Be = function(e) {
			e = He(e);
			for (var t = 0; t < e.length; t++) if (m.call(e, t) && e[t] && 1 === e[t].nodeType) {
				e[t].zcClippingId ? -1 === _(this.id, Ae[e[t].zcClippingId]) && Ae[e[t].zcClippingId].push(this.id) : (e[t].zcClippingId = "zcClippingId_" + De++, Ae[e[t].zcClippingId] = [this.id], P.autoActivate === !0 && We(e[t]));
				var i = Ie[this.id] && Ie[this.id].elements; - 1 === _(e[t], i) && i.push(e[t])
			}
			return this
		},
		Re = function(e) {
			var t = Ie[this.id];
			if (!t) return this;
			var i, n = t.elements;
			e = "undefined" == typeof e ? n.slice(0) : He(e);
			for (var o = e.length; o--;) if (m.call(e, o) && e[o] && 1 === e[o].nodeType) {
				for (i = 0; - 1 !== (i = _(e[o], n, i));) n.splice(i, 1);
				var a = Ae[e[o].zcClippingId];
				if (a) {
					for (i = 0; - 1 !== (i = _(this.id, a, i));) a.splice(i, 1);
					0 === a.length && (P.autoActivate === !0 && Ge(e[o]), delete e[o].zcClippingId)
				}
			}
			return this
		},
		$e = function() {
			var e = Ie[this.id];
			return e && e.elements ? e.elements.slice(0) : []
		},
		Fe = function() {
			this.unclip(), this.off(), delete Ie[this.id]
		},
		qe = function(e) {
			if (!e || !e.type) return !1;
			if (e.client && e.client !== this) return !1;
			var t = Ie[this.id] && Ie[this.id].elements,
				i = !! t && t.length > 0,
				n = !e.target || i && -1 !== _(e.target, t),
				o = e.relatedTarget && i && -1 !== _(e.relatedTarget, t),
				a = e.client && e.client === this;
			return !!(n || o || a)
		},
		ze = function(e) {
			if ("object" == typeof e && e && e.type) {
				var t = ee(e),
					i = Ie[this.id] && Ie[this.id].handlers["*"] || [],
					o = Ie[this.id] && Ie[this.id].handlers[e.type] || [],
					a = i.concat(o);
				if (a && a.length) {
					var r, s, l, c, d, u = this;
					for (r = 0, s = a.length; s > r; r++) l = a[r], c = u, "string" == typeof l && "function" == typeof n[l] && (l = n[l]), "object" == typeof l && l && "function" == typeof l.handleEvent && (c = l, l = l.handleEvent), "function" == typeof l && (d = b({}, e), te(l, c, [d], t))
				}
				return this
			}
		},
		He = function(e) {
			return "string" == typeof e && (e = []), "number" != typeof e.length ? [e] : e
		},
		Ye = function(e, t, i) {
			return e && 1 === e.nodeType ? (e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent && e.attachEvent("on" + t, i), e) : e
		},
		Ue = function(e, t, i) {
			return e && 1 === e.nodeType ? (e.removeEventListener ? e.removeEventListener(t, i, !1) : e.detachEvent && e.detachEvent("on" + t, i), e) : e
		},
		We = function(e) {
			if (e && 1 === e.nodeType) {
				var t = function(t) {
						(t || n.event) && je.activate(e)
					};
				Ye(e, "mouseover", t), Le[e.zcClippingId] = {
					mouseover: t
				}
			}
		},
		Ge = function(e) {
			if (e && 1 === e.nodeType) {
				var t = Le[e.zcClippingId];
				"object" == typeof t && t && ("function" == typeof t.mouseover && Ue(e, "mouseover", t.mouseover), delete Le[e.zcClippingId])
			}
		};
	je._createClient = function() {
		Ne.apply(this, y(arguments))
	}, je.prototype.on = function() {
		return Oe.apply(this, y(arguments))
	}, je.prototype.off = function() {
		return Ee.apply(this, y(arguments))
	}, je.prototype.handlers = function() {
		return Me.apply(this, y(arguments))
	}, je.prototype.emit = function() {
		return Pe.apply(this, y(arguments))
	}, je.prototype.clip = function() {
		return Be.apply(this, y(arguments))
	}, je.prototype.unclip = function() {
		return Re.apply(this, y(arguments))
	}, je.prototype.elements = function() {
		return $e.apply(this, y(arguments))
	}, je.prototype.destroy = function() {
		return Fe.apply(this, y(arguments))
	}, je.prototype.setText = function(e) {
		return je.setData("text/plain", e), this
	}, je.prototype.setHtml = function(e) {
		return je.setData("text/html", e), this
	}, je.prototype.setRichText = function(e) {
		return je.setData("application/rtf", e), this
	}, je.prototype.setData = function() {
		return je.setData.apply(this, y(arguments)), this
	}, je.prototype.clearData = function() {
		return je.clearData.apply(this, y(arguments)), this
	}, "function" == typeof define && define.amd ? define(function() {
		return je
	}) : "object" == typeof module && module && "object" == typeof module.exports && module.exports ? module.exports = je : e.ZeroClipboard = je
}(function() {
	return this
}()), function(e) {
	"function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e : e(jQuery)
}(function(e) {
	function t(t) {
		var r = t || window.event,
			s = l.call(arguments, 1),
			c = 0,
			u = 0,
			f = 0,
			h = 0,
			p = 0,
			g = 0;
		if (t = e.event.fix(r), t.type = "mousewheel", "detail" in r && (f = -1 * r.detail), "wheelDelta" in r && (f = r.wheelDelta), "wheelDeltaY" in r && (f = r.wheelDeltaY), "wheelDeltaX" in r && (u = -1 * r.wheelDeltaX), "axis" in r && r.axis === r.HORIZONTAL_AXIS && (u = -1 * f, f = 0), c = 0 === f ? u : f, "deltaY" in r && (f = -1 * r.deltaY, c = f), "deltaX" in r && (u = r.deltaX, 0 === f && (c = -1 * u)), 0 !== f || 0 !== u) {
			if (1 === r.deltaMode) {
				var m = e.data(this, "mousewheel-line-height");
				c *= m, f *= m, u *= m
			} else if (2 === r.deltaMode) {
				var v = e.data(this, "mousewheel-page-height");
				c *= v, f *= v, u *= v
			}
			if (h = Math.max(Math.abs(f), Math.abs(u)), (!a || a > h) && (a = h, n(r, h) && (a /= 40)), n(r, h) && (c /= 40, u /= 40, f /= 40), c = Math[c >= 1 ? "floor" : "ceil"](c / a), u = Math[u >= 1 ? "floor" : "ceil"](u / a), f = Math[f >= 1 ? "floor" : "ceil"](f / a), d.settings.normalizeOffset && this.getBoundingClientRect) {
				var y = this.getBoundingClientRect();
				p = t.clientX - y.left, g = t.clientY - y.top
			}
			return t.deltaX = u, t.deltaY = f, t.deltaFactor = a, t.offsetX = p, t.offsetY = g, t.deltaMode = 0, s.unshift(t, c, u, f), o && clearTimeout(o), o = setTimeout(i, 200), (e.event.dispatch || e.event.handle).apply(this, s)
		}
	}
	function i() {
		a = null
	}
	function n(e, t) {
		return d.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 === 0
	}
	var o, a, r = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
		s = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
		l = Array.prototype.slice;
	if (e.event.fixHooks) for (var c = r.length; c;) e.event.fixHooks[r[--c]] = e.event.mouseHooks;
	var d = e.event.special.mousewheel = {
		version: "3.1.12",
		setup: function() {
			if (this.addEventListener) for (var i = s.length; i;) this.addEventListener(s[--i], t, !1);
			else this.onmousewheel = t;
			e.data(this, "mousewheel-line-height", d.getLineHeight(this)), e.data(this, "mousewheel-page-height", d.getPageHeight(this))
		},
		teardown: function() {
			if (this.removeEventListener) for (var i = s.length; i;) this.removeEventListener(s[--i], t, !1);
			else this.onmousewheel = null;
			e.removeData(this, "mousewheel-line-height"), e.removeData(this, "mousewheel-page-height")
		},
		getLineHeight: function(t) {
			var i = e(t),
				n = i["offsetParent" in e.fn ? "offsetParent" : "parent"]();
			return n.length || (n = e("body")), parseInt(n.css("fontSize"), 10) || parseInt(i.css("fontSize"), 10) || 16
		},
		getPageHeight: function(t) {
			return e(t).height()
		},
		settings: {
			adjustOldDeltas: !0,
			normalizeOffset: !0
		}
	};
	e.fn.extend({
		mousewheel: function(e) {
			return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
		},
		unmousewheel: function(e) {
			return this.unbind("mousewheel", e)
		}
	})
}), !
function(e) {
	"function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports ? require("jquery") : jQuery)
}(function(e) {
	function t(t, i) {
		function n() {
			return d.update(), a(), d
		}
		function o() {
			g.css(I, y / w), f.css(I, -y), C = g.offset()[I], h.css(T, b), p.css(T, b), g.css(T, k)
		}
		function a() {
			j ? u[0].ontouchstart = function(e) {
				1 === e.touches.length && (r(e.touches[0]), e.stopPropagation())
			} : (g.bind("mousedown", r), p.bind("mouseup", l)), i.wheel && window.addEventListener ? (t[0].addEventListener("DOMMouseScroll", s, !1), t[0].addEventListener("mousewheel", s, !1)) : i.wheel && (t[0].onmousewheel = s)
		}
		function r(t) {
			e("body").addClass("noSelect"), C = S ? t.pageX : t.pageY, x = parseInt(g.css(I), 10) || 0, j ? (document.ontouchmove = function(e) {
				e.preventDefault(), l(e.touches[0])
			}, document.ontouchend = c) : (e(document).bind("mousemove", l), e(document).bind("mouseup", c), g.bind("mouseup", c))
		}
		function s(t) {
			if (1 > _) {
				var n = t || window.event,
					o = n.wheelDelta ? n.wheelDelta / 120 : -n.detail / 3;
				y -= o * i.wheelSpeed, y = Math.min(v - m, Math.max(0, y)), g.css(I, y / w), f.css(I, -y), (i.wheelLock || y !== v - m && 0 !== y) && (n = e.event.fix(n), n.preventDefault())
			}
		}
		function l(e) {
			1 > _ && (mousePositionNew = S ? e.pageX : e.pageY, thumbPositionDelta = mousePositionNew - C, i.scrollInvert && (thumbPositionDelta = C - mousePositionNew), thumbPositionNew = Math.min(b - k, Math.max(0, x + thumbPositionDelta)), y = thumbPositionNew * w, g.css(I, thumbPositionNew), f.css(I, -y))
		}
		function c() {
			e("body").removeClass("noSelect"), e(document).unbind("mousemove", l), e(document).unbind("mouseup", c), g.unbind("mouseup", c), document.ontouchmove = document.ontouchend = null
		}
		var d = this,
			u = t.find(".viewport"),
			f = t.find(".overview"),
			h = t.find(".scrollbar"),
			p = h.find(".track"),
			g = h.find(".thumb"),
			m = 0,
			v = 0,
			y = 0,
			_ = 0,
			b = 0,
			w = 0,
			k = 0,
			x = 0,
			C = 0,
			S = "x" === i.axis,
			j = "ontouchstart" in document.documentElement,
			T = S ? "width" : "height",
			I = S ? "left" : "top";
		return this.update = function(e) {
			switch (sizeLabelCap = T.charAt(0).toUpperCase() + T.slice(1).toLowerCase(), m = u[0]["offset" + sizeLabelCap], v = f[0]["scroll" + sizeLabelCap], _ = m / v, b = i.trackSize || m, k = Math.min(b, Math.max(0, i.thumbSize || b * _)), w = i.thumbSize ? (v - m) / (b - k) : v / b, h.toggleClass("disable", _ >= 1), e) {
			case "bottom":
				y = v - m;
				break;
			case "relative":
				y = Math.min(v - m, Math.max(0, y));
				break;
			default:
				y = parseInt(e, 10) || 0
			}
			o()
		}, n()
	}
	e.tiny = e.tiny || {}, e.tiny.scrollbar = {
		options: {
			axis: "y",
			wheel: !0,
			wheelSpeed: 40,
			wheelLock: !0,
			scrollInvert: !1,
			trackSize: !1,
			thumbSize: !1
		}
	}, e.fn.tinyscrollbar = function(i) {
		var n = e.extend({}, e.tiny.scrollbar.options, i);
		return this.each(function() {
			e(this).data("tsb", new t(e(this), n))
		}), this
	}, e.fn.tinyscrollbar_update = function(t) {
		return e(this).data("tsb").update(t)
	}
}), function(e) {
	"function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
	e.fn.jScrollPane = function(t) {
		function i(t, i) {
			function n(i) {
				var a, s, c, d, u, p, g = !1,
					m = !1;
				if ($ = i, void 0 === F) u = t.scrollTop(), p = t.scrollLeft(), t.css({
					overflow: "hidden",
					padding: 0
				}), q = t.innerWidth() + ve, z = t.innerHeight(), t.width(q), F = e('<div class="jspPane" />').css("padding", me).append(t.children()), H = e('<div class="jspContainer" />').css({
					width: q + "px",
					height: z + "px"
				}).append(F).appendTo(t);
				else {
					if (t.css("width", ""), g = $.stickToBottom && j(), m = $.stickToRight && T(), d = t.innerWidth() + ve != q || t.outerHeight() != z, d && (q = t.innerWidth() + ve, z = t.innerHeight(), H.css({
						width: q + "px",
						height: z + "px"
					})), !d && ye == Y && F.outerHeight() == U) return void t.width(q);
					ye = Y, F.css("width", ""), t.width(q), H.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()
				}
				F.css("overflow", "auto"), Y = i.contentWidth ? i.contentWidth : F[0].scrollWidth, U = F[0].scrollHeight, F.css("overflow", ""), W = Y / q, G = U / z, J = G > 1, X = W > 1, X || J ? (t.addClass("jspScrollable"), a = $.maintainPosition && (Q || te), a && (s = C(), c = S()), o(), r(), l(), a && (k(m ? Y - q : s, !1), w(g ? U - z : c, !1)), L(), I(), B(), $.enableKeyboardNavigation && O(), $.clickOnTrack && f(), M(), $.hijackInternalLinks && P()) : (t.removeClass("jspScrollable"), F.css({
					top: 0,
					left: 0,
					width: H.width() - ve
				}), D(), N(), E(), h()), $.autoReinitialise && !ge ? ge = setInterval(function() {
					n($)
				}, $.autoReinitialiseDelay) : !$.autoReinitialise && ge && clearInterval(ge), u && t.scrollTop(0) && w(u, !1), p && t.scrollLeft(0) && k(p, !1), t.trigger("jsp-initialised", [X || J])
			}
			function o() {
				J && (H.append(e('<div class="jspVerticalBar" />').append(e('<div class="jspCap jspCapTop" />'), e('<div class="jspTrack" />').append(e('<div class="jspDrag" />').append(e('<div class="jspDragTop" />'), e('<div class="jspDragBottom" />'))), e('<div class="jspCap jspCapBottom" />'))), ie = H.find(">.jspVerticalBar"), ne = ie.find(">.jspTrack"), V = ne.find(">.jspDrag"), $.showArrows && (se = e('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp", d(0, -1)).bind("click.jsp", A), le = e('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp", d(0, 1)).bind("click.jsp", A), $.arrowScrollOnHover && (se.bind("mouseover.jsp", d(0, -1, se)), le.bind("mouseover.jsp", d(0, 1, le))), c(ne, $.verticalArrowPositions, se, le)), ae = z, H.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function() {
					ae -= e(this).outerHeight()
				}), V.hover(function() {
					V.addClass("jspHover")
				}, function() {
					V.removeClass("jspHover")
				}).bind("mousedown.jsp", function(t) {
					e("html").bind("dragstart.jsp selectstart.jsp", A), V.addClass("jspActive");
					var i = t.pageY - V.position().top;
					return e("html").bind("mousemove.jsp", function(e) {
						g(e.pageY - i, !1)
					}).bind("mouseup.jsp mouseleave.jsp", p), !1
				}), a())
			}
			function a() {
				ne.height(ae + "px"), Q = 0, oe = $.verticalGutter + ne.outerWidth(), F.width(q - oe - ve);
				try {
					0 === ie.position().left && F.css("margin-left", oe + "px")
				} catch (e) {}
			}
			function r() {
				X && (H.append(e('<div class="jspHorizontalBar" />').append(e('<div class="jspCap jspCapLeft" />'), e('<div class="jspTrack" />').append(e('<div class="jspDrag" />').append(e('<div class="jspDragLeft" />'), e('<div class="jspDragRight" />'))), e('<div class="jspCap jspCapRight" />'))), ce = H.find(">.jspHorizontalBar"), de = ce.find(">.jspTrack"), Z = de.find(">.jspDrag"), $.showArrows && (he = e('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp", d(-1, 0)).bind("click.jsp", A), pe = e('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp", d(1, 0)).bind("click.jsp", A), $.arrowScrollOnHover && (he.bind("mouseover.jsp", d(-1, 0, he)), pe.bind("mouseover.jsp", d(1, 0, pe))), c(de, $.horizontalArrowPositions, he, pe)), Z.hover(function() {
					Z.addClass("jspHover")
				}, function() {
					Z.removeClass("jspHover")
				}).bind("mousedown.jsp", function(t) {
					e("html").bind("dragstart.jsp selectstart.jsp", A), Z.addClass("jspActive");
					var i = t.pageX - Z.position().left;
					return e("html").bind("mousemove.jsp", function(e) {
						v(e.pageX - i, !1)
					}).bind("mouseup.jsp mouseleave.jsp", p), !1
				}), ue = H.innerWidth(), s())
			}
			function s() {
				H.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function() {
					ue -= e(this).outerWidth()
				}), de.width(ue + "px"), te = 0
			}
			function l() {
				if (X && J) {
					var t = de.outerHeight(),
						i = ne.outerWidth();
					ae -= t, e(ce).find(">.jspCap:visible,>.jspArrow").each(function() {
						ue += e(this).outerWidth()
					}), ue -= i, z -= i, q -= t, de.parent().append(e('<div class="jspCorner" />').css("width", t + "px")), a(), s()
				}
				X && F.width(H.outerWidth() - ve + "px"), U = F.outerHeight(), G = U / z, X && (fe = Math.ceil(1 / W * ue), fe > $.horizontalDragMaxWidth ? fe = $.horizontalDragMaxWidth : fe < $.horizontalDragMinWidth && (fe = $.horizontalDragMinWidth), Z.width(fe + "px"), ee = ue - fe, y(te)), J && (re = Math.ceil(1 / G * ae), re > $.verticalDragMaxHeight ? re = $.verticalDragMaxHeight : re < $.verticalDragMinHeight && (re = $.verticalDragMinHeight), V.height(re + "px"), K = ae - re, m(Q))
			}
			function c(e, t, i, n) {
				var o, a = "before",
					r = "after";
				"os" == t && (t = /Mac/.test(navigator.platform) ? "after" : "split"), t == a ? r = t : t == r && (a = t, o = i, i = n, n = o), e[a](i)[r](n)
			}
			function d(e, t, i) {
				return function() {
					return u(e, t, this, i), this.blur(), !1
				}
			}
			function u(t, i, n, o) {
				n = e(n).addClass("jspActive");
				var a, r, s = !0,
					l = function() {
						0 !== t && _e.scrollByX(t * $.arrowButtonSpeed), 0 !== i && _e.scrollByY(i * $.arrowButtonSpeed), r = setTimeout(l, s ? $.initialDelay : $.arrowRepeatFreq), s = !1
					};
				l(), a = o ? "mouseout.jsp" : "mouseup.jsp", o = o || e("html"), o.bind(a, function() {
					n.removeClass("jspActive"), r && clearTimeout(r), r = null, o.unbind(a)
				})
			}
			function f() {
				h(), J && ne.bind("mousedown.jsp", function(t) {
					if (void 0 === t.originalTarget || t.originalTarget == t.currentTarget) {
						var i, n = e(this),
							o = n.offset(),
							a = t.pageY - o.top - Q,
							r = !0,
							s = function() {
								var e = n.offset(),
									o = t.pageY - e.top - re / 2,
									c = z * $.scrollPagePercent,
									d = K * c / (U - z);
								if (0 > a) Q - d > o ? _e.scrollByY(-c) : g(o);
								else {
									if (!(a > 0)) return void l();
									o > Q + d ? _e.scrollByY(c) : g(o)
								}
								i = setTimeout(s, r ? $.initialDelay : $.trackClickRepeatFreq), r = !1
							},
							l = function() {
								i && clearTimeout(i), i = null, e(document).unbind("mouseup.jsp", l)
							};
						return s(), e(document).bind("mouseup.jsp", l), !1
					}
				}), X && de.bind("mousedown.jsp", function(t) {
					if (void 0 === t.originalTarget || t.originalTarget == t.currentTarget) {
						var i, n = e(this),
							o = n.offset(),
							a = t.pageX - o.left - te,
							r = !0,
							s = function() {
								var e = n.offset(),
									o = t.pageX - e.left - fe / 2,
									c = q * $.scrollPagePercent,
									d = ee * c / (Y - q);
								if (0 > a) te - d > o ? _e.scrollByX(-c) : v(o);
								else {
									if (!(a > 0)) return void l();
									o > te + d ? _e.scrollByX(c) : v(o)
								}
								i = setTimeout(s, r ? $.initialDelay : $.trackClickRepeatFreq), r = !1
							},
							l = function() {
								i && clearTimeout(i), i = null, e(document).unbind("mouseup.jsp", l)
							};
						return s(), e(document).bind("mouseup.jsp", l), !1
					}
				})
			}
			function h() {
				de && de.unbind("mousedown.jsp"), ne && ne.unbind("mousedown.jsp")
			}
			function p() {
				e("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"), V && V.removeClass("jspActive"), Z && Z.removeClass("jspActive")
			}
			function g(i, n) {
				if (J) {
					0 > i ? i = 0 : i > K && (i = K);
					var o = new e.Event("jsp-will-scroll-y");
					if (t.trigger(o, [i]), !o.isDefaultPrevented()) {
						var a = i || 0,
							r = 0 === a,
							s = a == K,
							l = i / K,
							c = -l * (U - z);
						void 0 === n && (n = $.animateScroll), n ? _e.animate(V, "top", i, m, function() {
							t.trigger("jsp-user-scroll-y", [-c, r, s])
						}) : (V.css("top", i), m(i), t.trigger("jsp-user-scroll-y", [-c, r, s]))
					}
				}
			}
			function m(e) {
				void 0 === e && (e = V.position().top), H.scrollTop(0), Q = e || 0;
				var i = 0 === Q,
					n = Q == K,
					o = e / K,
					a = -o * (U - z);
				be == i && ke == n || (be = i, ke = n, t.trigger("jsp-arrow-change", [be, ke, we, xe])), _(i, n), F.css("top", a), t.trigger("jsp-scroll-y", [-a, i, n]).trigger("scroll")
			}
			function v(i, n) {
				if (X) {
					0 > i ? i = 0 : i > ee && (i = ee);
					var o = new e.Event("jsp-will-scroll-x");
					if (t.trigger(o, [i]), !o.isDefaultPrevented()) {
						var a = i || 0,
							r = 0 === a,
							s = a == ee,
							l = i / ee,
							c = -l * (Y - q);
						void 0 === n && (n = $.animateScroll), n ? _e.animate(Z, "left", i, y, function() {
							t.trigger("jsp-user-scroll-x", [-c, r, s])
						}) : (Z.css("left", i), y(i), t.trigger("jsp-user-scroll-x", [-c, r, s]))
					}
				}
			}
			function y(e) {
				void 0 === e && (e = Z.position().left), H.scrollTop(0), te = e || 0;
				var i = 0 === te,
					n = te == ee,
					o = e / ee,
					a = -o * (Y - q);
				we == i && xe == n || (we = i, xe = n, t.trigger("jsp-arrow-change", [be, ke, we, xe])), b(i, n), F.css("left", a), t.trigger("jsp-scroll-x", [-a, i, n]).trigger("scroll")
			}
			function _(e, t) {
				$.showArrows && (se[e ? "addClass" : "removeClass"]("jspDisabled"), le[t ? "addClass" : "removeClass"]("jspDisabled"))
			}
			function b(e, t) {
				$.showArrows && (he[e ? "addClass" : "removeClass"]("jspDisabled"), pe[t ? "addClass" : "removeClass"]("jspDisabled"))
			}
			function w(e, t) {
				var i = e / (U - z);
				g(i * K, t)
			}
			function k(e, t) {
				var i = e / (Y - q);
				v(i * ee, t)
			}
			function x(t, i, n) {
				var o, a, r, s, l, c, d, u, f, h = 0,
					p = 0;
				try {
					o = e(t)
				} catch (g) {
					return
				}
				for (a = o.outerHeight(), r = o.outerWidth(), H.scrollTop(0), H.scrollLeft(0); !o.is(".jspPane");) if (h += o.position().top, p += o.position().left, o = o.offsetParent(), /^body|html$/i.test(o[0].nodeName)) return;
				s = S(), c = s + z, s > h || i ? u = h - $.horizontalGutter : h + a > c && (u = h - z + a + $.horizontalGutter), isNaN(u) || w(u, n), l = C(), d = l + q, l > p || i ? f = p - $.horizontalGutter : p + r > d && (f = p - q + r + $.horizontalGutter), isNaN(f) || k(f, n)
			}
			function C() {
				return -F.position().left
			}
			function S() {
				return -F.position().top
			}
			function j() {
				var e = U - z;
				return e > 20 && e - S() < 10
			}
			function T() {
				var e = Y - q;
				return e > 20 && e - C() < 10
			}
			function I() {
				H.unbind(Se).bind(Se, function(e, t, i, n) {
					te || (te = 0), Q || (Q = 0);
					var o = te,
						a = Q,
						r = e.deltaFactor || $.mouseWheelSpeed;
					return _e.scrollBy(i * r, -n * r, !1), o == te && a == Q
				})
			}
			function D() {
				H.unbind(Se)
			}
			function A() {
				return !1
			}
			function L() {
				F.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function(e) {
					x(e.target, !1)
				})
			}
			function N() {
				F.find(":input,a").unbind("focus.jsp")
			}
			function O() {
				function i() {
					var e = te,
						t = Q;
					switch (n) {
					case 40:
						_e.scrollByY($.keyboardSpeed, !1);
						break;
					case 38:
						_e.scrollByY(-$.keyboardSpeed, !1);
						break;
					case 34:
					case 32:
						_e.scrollByY(z * $.scrollPagePercent, !1);
						break;
					case 33:
						_e.scrollByY(-z * $.scrollPagePercent, !1);
						break;
					case 39:
						_e.scrollByX($.keyboardSpeed, !1);
						break;
					case 37:
						_e.scrollByX(-$.keyboardSpeed, !1)
					}
					return o = e != te || t != Q
				}
				var n, o, a = [];
				X && a.push(ce[0]), J && a.push(ie[0]), F.bind("focus.jsp", function() {
					t.focus()
				}), t.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function(t) {
					if (t.target === this || a.length && e(t.target).closest(a).length) {
						var r = te,
							s = Q;
						switch (t.keyCode) {
						case 40:
						case 38:
						case 34:
						case 32:
						case 33:
						case 39:
						case 37:
							n = t.keyCode, i();
							break;
						case 35:
							w(U - z), n = null;
							break;
						case 36:
							w(0), n = null
						}
						return o = t.keyCode == n && r != te || s != Q, !o
					}
				}).bind("keypress.jsp", function(t) {
					return t.keyCode == n && i(), t.target === this || a.length && e(t.target).closest(a).length ? !o : void 0
				}), $.hideFocus ? (t.css("outline", "none"), "hideFocus" in H[0] && t.attr("hideFocus", !0)) : (t.css("outline", ""), "hideFocus" in H[0] && t.attr("hideFocus", !1))
			}
			function E() {
				t.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp"), F.unbind(".jsp")
			}
			function M() {
				if (location.hash && location.hash.length > 1) {
					var t, i, n = escape(location.hash.substr(1));
					try {
						t = e("#" + n + ', a[name="' + n + '"]')
					} catch (o) {
						return
					}
					t.length && F.find(n) && (0 === H.scrollTop() ? i = setInterval(function() {
						H.scrollTop() > 0 && (x(t, !0), e(document).scrollTop(H.position().top), clearInterval(i))
					}, 50) : (x(t, !0), e(document).scrollTop(H.position().top)))
				}
			}
			function P() {
				e(document.body).data("jspHijack") || (e(document.body).data("jspHijack", !0), e(document.body).delegate('a[href*="#"]', "click", function(t) {
					var i, n, o, a, r, s, l = this.href.substr(0, this.href.indexOf("#")),
						c = location.href;
					if (-1 !== location.href.indexOf("#") && (c = location.href.substr(0, location.href.indexOf("#"))), l === c) {
						i = escape(this.href.substr(this.href.indexOf("#") + 1));
						try {
							n = e("#" + i + ', a[name="' + i + '"]')
						} catch (d) {
							return
						}
						n.length && (o = n.closest(".jspScrollable"), a = o.data("jsp"), a.scrollToElement(n, !0), o[0].scrollIntoView && (r = e(window).scrollTop(), s = n.offset().top, (r > s || s > r + e(window).height()) && o[0].scrollIntoView()), t.preventDefault())
					}
				}))
			}
			function B() {
				var e, t, i, n, o, a = !1;
				H.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function(r) {
					var s = r.originalEvent.touches[0];
					e = C(), t = S(), i = s.pageX, n = s.pageY, o = !1, a = !0
				}).bind("touchmove.jsp", function(r) {
					if (a) {
						var s = r.originalEvent.touches[0],
							l = te,
							c = Q;
						return _e.scrollTo(e + i - s.pageX, t + n - s.pageY), o = o || Math.abs(i - s.pageX) > 5 || Math.abs(n - s.pageY) > 5, l == te && c == Q
					}
				}).bind("touchend.jsp", function(e) {
					a = !1
				}).bind("click.jsp-touchclick", function(e) {
					return o ? (o = !1, !1) : void 0
				})
			}
			function R() {
				var e = S(),
					i = C();
				t.removeClass("jspScrollable").unbind(".jsp"), F.unbind(".jsp"), t.replaceWith(Ce.append(F.children())), Ce.scrollTop(e), Ce.scrollLeft(i), ge && clearInterval(ge)
			}
			var $, F, q, z, H, Y, U, W, G, J, X, V, K, Q, Z, ee, te, ie, ne, oe, ae, re, se, le, ce, de, ue, fe, he, pe, ge, me, ve, ye, _e = this,
				be = !0,
				we = !0,
				ke = !1,
				xe = !1,
				Ce = t.clone(!1, !1).empty(),
				Se = e.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp";
			"border-box" === t.css("box-sizing") ? (me = 0, ve = 0) : (me = t.css("paddingTop") + " " + t.css("paddingRight") + " " + t.css("paddingBottom") + " " + t.css("paddingLeft"), ve = (parseInt(t.css("paddingLeft"), 10) || 0) + (parseInt(t.css("paddingRight"), 10) || 0)), e.extend(_e, {
				reinitialise: function(t) {
					t = e.extend({}, $, t), n(t)
				},
				scrollToElement: function(e, t, i) {
					x(e, t, i)
				},
				scrollTo: function(e, t, i) {
					k(e, i), w(t, i)
				},
				scrollToX: function(e, t) {
					k(e, t)
				},
				scrollToY: function(e, t) {
					w(e, t)
				},
				scrollToPercentX: function(e, t) {
					k(e * (Y - q), t)
				},
				scrollToPercentY: function(e, t) {
					w(e * (U - z), t)
				},
				scrollBy: function(e, t, i) {
					_e.scrollByX(e, i), _e.scrollByY(t, i)
				},
				scrollByX: function(e, t) {
					var i = C() + Math[0 > e ? "floor" : "ceil"](e),
						n = i / (Y - q);
					v(n * ee, t)
				},
				scrollByY: function(e, t) {
					var i = S() + Math[0 > e ? "floor" : "ceil"](e),
						n = i / (U - z);
					g(n * K, t)
				},
				positionDragX: function(e, t) {
					v(e, t)
				},
				positionDragY: function(e, t) {
					g(e, t)
				},
				animate: function(e, t, i, n, o) {
					var a = {};
					a[t] = i, e.animate(a, {
						duration: $.animateDuration,
						easing: $.animateEase,
						queue: !1,
						step: n,
						complete: o
					})
				},
				getContentPositionX: function() {
					return C()
				},
				getContentPositionY: function() {
					return S()
				},
				getContentWidth: function() {
					return Y
				},
				getContentHeight: function() {
					return U
				},
				getPercentScrolledX: function() {
					return C() / (Y - q)
				},
				getPercentScrolledY: function() {
					return S() / (U - z)
				},
				getIsScrollableH: function() {
					return X
				},
				getIsScrollableV: function() {
					return J
				},
				getContentPane: function() {
					return F
				},
				scrollToBottom: function(e) {
					g(K, e)
				},
				hijackInternalLinks: e.noop,
				destroy: function() {
					R()
				}
			}), n(i)
		}
		return t = e.extend({}, e.fn.jScrollPane.defaults, t), e.each(["arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function() {
			t[this] = t[this] || t.speed
		}), this.each(function() {
			var n = e(this),
				o = n.data("jsp");
			o ? o.reinitialise(t) : (e("script", n).filter('[type="text/javascript"],:not([type])').remove(), o = new i(n, t), n.data("jsp", o))
		})
	}, e.fn.jScrollPane.defaults = {
		showArrows: !1,
		maintainPosition: !0,
		stickToBottom: !1,
		stickToRight: !1,
		clickOnTrack: !0,
		autoReinitialise: !1,
		autoReinitialiseDelay: 500,
		verticalDragMinHeight: 0,
		verticalDragMaxHeight: 99999,
		horizontalDragMinWidth: 0,
		horizontalDragMaxWidth: 99999,
		contentWidth: void 0,
		animateScroll: !1,
		animateDuration: 300,
		animateEase: "linear",
		hijackInternalLinks: !1,
		verticalGutter: 4,
		horizontalGutter: 4,
		mouseWheelSpeed: 3,
		arrowButtonSpeed: 0,
		arrowRepeatFreq: 50,
		arrowScrollOnHover: !1,
		trackClickSpeed: 0,
		trackClickRepeatFreq: 70,
		verticalArrowPositions: "split",
		horizontalArrowPositions: "split",
		enableKeyboardNavigation: !0,
		hideFocus: !1,
		keyboardSpeed: 0,
		initialDelay: 300,
		speed: 30,
		scrollPagePercent: .8
	}
}), !
function(e) {
	var t = !0;
	e.flexslider = function(i, n) {
		var o = e(i);
		o.vars = e.extend({}, e.flexslider.defaults, n);
		var a, r = o.vars.namespace,
			s = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
			l = ("ontouchstart" in window || s || window.DocumentTouch && document instanceof DocumentTouch) && o.vars.touch,
			c = "click touchend MSPointerUp keyup",
			d = "",
			u = "vertical" === o.vars.direction,
			f = o.vars.reverse,
			h = o.vars.itemWidth > 0,
			p = "fade" === o.vars.animation,
			g = "" !== o.vars.asNavFor,
			m = {};
		e.data(i, "flexslider", o), m = {
			init: function() {
				o.animating = !1, o.currentSlide = parseInt(o.vars.startAt ? o.vars.startAt : 0, 10), isNaN(o.currentSlide) && (o.currentSlide = 0), o.animatingTo = o.currentSlide, o.atEnd = 0 === o.currentSlide || o.currentSlide === o.last, o.containerSelector = o.vars.selector.substr(0, o.vars.selector.search(" ")), o.slides = e(o.vars.selector, o), o.container = e(o.containerSelector, o), o.count = o.slides.length, o.syncExists = e(o.vars.sync).length > 0, "slide" === o.vars.animation && (o.vars.animation = "swing"), o.prop = u ? "top" : "marginLeft", o.args = {}, o.manualPause = !1, o.stopped = !1, o.started = !1, o.startTimeout = null, o.transitions = !o.vars.video && !p && o.vars.useCSS &&
				function() {
					var e = document.createElement("div"),
						t = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
					for (var i in t) if (void 0 !== e.style[t[i]]) return o.pfx = t[i].replace("Perspective", "").toLowerCase(), o.prop = "-" + o.pfx + "-transform", !0;
					return !1
				}(), o.ensureAnimationEnd = "", "" !== o.vars.controlsContainer && (o.controlsContainer = e(o.vars.controlsContainer).length > 0 && e(o.vars.controlsContainer)), "" !== o.vars.manualControls && (o.manualControls = e(o.vars.manualControls).length > 0 && e(o.vars.manualControls)), "" !== o.vars.customDirectionNav && (o.customDirectionNav = 2 === e(o.vars.customDirectionNav).length && e(o.vars.customDirectionNav)), o.vars.randomize && (o.slides.sort(function() {
					return Math.round(Math.random()) - .5
				}), o.container.empty().append(o.slides)), o.doMath(), o.setup("init"), o.vars.controlNav && m.controlNav.setup(), o.vars.directionNav && m.directionNav.setup(), o.vars.keyboard && (1 === e(o.containerSelector).length || o.vars.multipleKeyboard) && e(document).bind("keyup", function(e) {
					var t = e.keyCode;
					if (!o.animating && (39 === t || 37 === t)) {
						var i = 39 === t ? o.getTarget("next") : 37 === t && o.getTarget("prev");
						o.flexAnimate(i, o.vars.pauseOnAction)
					}
				}), o.vars.mousewheel && o.bind("mousewheel", function(e, t, i, n) {
					e.preventDefault();
					var a = 0 > t ? o.getTarget("next") : o.getTarget("prev");
					o.flexAnimate(a, o.vars.pauseOnAction)
				}), o.vars.pausePlay && m.pausePlay.setup(), o.vars.slideshow && o.vars.pauseInvisible && m.pauseInvisible.init(), o.vars.slideshow && (o.vars.pauseOnHover && o.hover(function() {
					o.manualPlay || o.manualPause || o.pause()
				}, function() {
					o.manualPause || o.manualPlay || o.stopped || o.play()
				}), o.vars.pauseInvisible && m.pauseInvisible.isHidden() || (o.vars.initDelay > 0 ? o.startTimeout = setTimeout(o.play, o.vars.initDelay) : o.play())), g && m.asNav.setup(), l && o.vars.touch && m.touch(), (!p || p && o.vars.smoothHeight) && e(window).bind("resize orientationchange focus", m.resize()), o.find("img").attr("draggable", "false"), setTimeout(function() {
					o.vars.start(o)
				}, 200)
			},
			asNav: {
				setup: function() {
					o.asNav = !0, o.animatingTo = Math.floor(o.currentSlide / o.move), o.currentItem = o.currentSlide, o.slides.removeClass(r + "active-slide").eq(o.currentItem).addClass(r + "active-slide"), s ? (i._slider = o, o.slides.each(function() {
						var t = this;
						t._gesture = new MSGesture, t._gesture.target = t, t.addEventListener("MSPointerDown", function(e) {
							e.preventDefault(), e.currentTarget._gesture && e.currentTarget._gesture.addPointer(e.pointerId)
						}, !1), t.addEventListener("MSGestureTap", function(t) {
							t.preventDefault();
							var i = e(this),
								n = i.index();
							e(o.vars.asNavFor).data("flexslider").animating || i.hasClass("active") || (o.direction = o.currentItem < n ? "next" : "prev", o.flexAnimate(n, o.vars.pauseOnAction, !1, !0, !0))
						})
					})) : o.slides.on(c, function(t) {
						t.preventDefault();
						var i = e(this),
							n = i.index();
						i.offset().left - e(o).scrollLeft() <= 0 && i.hasClass(r + "active-slide") ? o.flexAnimate(o.getTarget("prev"), !0) : e(o.vars.asNavFor).data("flexslider").animating || i.hasClass(r + "active-slide") || (o.direction = o.currentItem < n ? "next" : "prev", o.flexAnimate(n, o.vars.pauseOnAction, !1, !0, !0))
					})
				}
			},
			controlNav: {
				setup: function() {
					o.manualControls ? m.controlNav.setupManual() : m.controlNav.setupPaging()
				},
				setupPaging: function() {
					var t, i, n = "thumbnails" === o.vars.controlNav ? "control-thumbs" : "control-paging",
						a = 1;
					if (o.controlNavScaffold = e('<ol class="' + r + "control-nav " + r + n + '"></ol>'), o.pagingCount > 1) for (var s = 0; s < o.pagingCount; s++) {
						i = o.slides.eq(s), void 0 === i.attr("data-thumb-alt") && i.attr("data-thumb-alt", "");
						var l = "" !== i.attr("data-thumb-alt") ? l = ' alt="' + i.attr("data-thumb-alt") + '"' : "";
						if (t = "thumbnails" === o.vars.controlNav ? '<img src="' + i.attr("data-thumb") + '"' + l + "/>" : '<a href="#">' + a + "</a>", "thumbnails" === o.vars.controlNav && !0 === o.vars.thumbCaptions) {
							var u = i.attr("data-thumbcaption");
							"" !== u && void 0 !== u && (t += '<span class="' + r + 'caption">' + u + "</span>")
						}
						o.controlNavScaffold.append("<li>" + t + "</li>"), a++
					}
					o.controlsContainer ? e(o.controlsContainer).append(o.controlNavScaffold) : o.append(o.controlNavScaffold), m.controlNav.set(), m.controlNav.active(), o.controlNavScaffold.delegate("a, img", c, function(t) {
						if (t.preventDefault(), "" === d || d === t.type) {
							var i = e(this),
								n = o.controlNav.index(i);
							i.hasClass(r + "active") || (o.direction = n > o.currentSlide ? "next" : "prev", o.flexAnimate(n, o.vars.pauseOnAction))
						}
						"" === d && (d = t.type), m.setToClearWatchedEvent()
					})
				},
				setupManual: function() {
					o.controlNav = o.manualControls, m.controlNav.active(), o.controlNav.bind(c, function(t) {
						if (t.preventDefault(), "" === d || d === t.type) {
							var i = e(this),
								n = o.controlNav.index(i);
							i.hasClass(r + "active") || (n > o.currentSlide ? o.direction = "next" : o.direction = "prev", o.flexAnimate(n, o.vars.pauseOnAction))
						}
						"" === d && (d = t.type), m.setToClearWatchedEvent()
					})
				},
				set: function() {
					var t = "thumbnails" === o.vars.controlNav ? "img" : "a";
					o.controlNav = e("." + r + "control-nav li " + t, o.controlsContainer ? o.controlsContainer : o)
				},
				active: function() {
					o.controlNav.removeClass(r + "active").eq(o.animatingTo).addClass(r + "active")
				},
				update: function(t, i) {
					o.pagingCount > 1 && "add" === t ? o.controlNavScaffold.append(e('<li><a href="#">' + o.count + "</a></li>")) : 1 === o.pagingCount ? o.controlNavScaffold.find("li").remove() : o.controlNav.eq(i).closest("li").remove(), m.controlNav.set(), o.pagingCount > 1 && o.pagingCount !== o.controlNav.length ? o.update(i, t) : m.controlNav.active()
				}
			},
			directionNav: {
				setup: function() {
					var t = e('<ul class="' + r + 'direction-nav"><li class="' + r + 'nav-prev"><a class="' + r + 'prev" href="#">' + o.vars.prevText + '</a></li><li class="' + r + 'nav-next"><a class="' + r + 'next" href="#">' + o.vars.nextText + "</a></li></ul>");
					o.customDirectionNav ? o.directionNav = o.customDirectionNav : o.controlsContainer ? (e(o.controlsContainer).append(t), o.directionNav = e("." + r + "direction-nav li a", o.controlsContainer)) : (o.append(t), o.directionNav = e("." + r + "direction-nav li a", o)), m.directionNav.update(), o.directionNav.bind(c, function(t) {
						t.preventDefault();
						var i;
						"" !== d && d !== t.type || (i = e(this).hasClass(r + "next") ? o.getTarget("next") : o.getTarget("prev"), o.flexAnimate(i, o.vars.pauseOnAction)), "" === d && (d = t.type), m.setToClearWatchedEvent()
					})
				},
				update: function() {
					var e = r + "disabled";
					1 === o.pagingCount ? o.directionNav.addClass(e).attr("tabindex", "-1") : o.vars.animationLoop ? o.directionNav.removeClass(e).removeAttr("tabindex") : 0 === o.animatingTo ? o.directionNav.removeClass(e).filter("." + r + "prev").addClass(e).attr("tabindex", "-1") : o.animatingTo === o.last ? o.directionNav.removeClass(e).filter("." + r + "next").addClass(e).attr("tabindex", "-1") : o.directionNav.removeClass(e).removeAttr("tabindex")
				}
			},
			pausePlay: {
				setup: function() {
					var t = e('<div class="' + r + 'pauseplay"><a href="#"></a></div>');
					o.controlsContainer ? (o.controlsContainer.append(t), o.pausePlay = e("." + r + "pauseplay a", o.controlsContainer)) : (o.append(t), o.pausePlay = e("." + r + "pauseplay a", o)), m.pausePlay.update(o.vars.slideshow ? r + "pause" : r + "play"), o.pausePlay.bind(c, function(t) {
						t.preventDefault(), "" !== d && d !== t.type || (e(this).hasClass(r + "pause") ? (o.manualPause = !0, o.manualPlay = !1, o.pause()) : (o.manualPause = !1, o.manualPlay = !0, o.play())), "" === d && (d = t.type), m.setToClearWatchedEvent()
					})
				},
				update: function(e) {
					"play" === e ? o.pausePlay.removeClass(r + "pause").addClass(r + "play").html(o.vars.playText) : o.pausePlay.removeClass(r + "play").addClass(r + "pause").html(o.vars.pauseText)
				}
			},
			touch: function() {
				function e(e) {
					e.stopPropagation(), o.animating ? e.preventDefault() : (o.pause(), i._gesture.addPointer(e.pointerId), k = 0, c = u ? o.h : o.w, g = Number(new Date), l = h && f && o.animatingTo === o.last ? 0 : h && f ? o.limit - (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo : h && o.currentSlide === o.last ? o.limit : h ? (o.itemW + o.vars.itemMargin) * o.move * o.currentSlide : f ? (o.last - o.currentSlide + o.cloneOffset) * c : (o.currentSlide + o.cloneOffset) * c)
				}
				function t(e) {
					e.stopPropagation();
					var t = e.target._slider;
					if (t) {
						var n = -e.translationX,
							o = -e.translationY;
						if (k += u ? o : n, d = k, _ = u ? Math.abs(k) < Math.abs(-n) : Math.abs(k) < Math.abs(-o), e.detail === e.MSGESTURE_FLAG_INERTIA) return void setImmediate(function() {
							i._gesture.stop()
						});
						(!_ || Number(new Date) - g > 500) && (e.preventDefault(), !p && t.transitions && (t.vars.animationLoop || (d = k / (0 === t.currentSlide && 0 > k || t.currentSlide === t.last && k > 0 ? Math.abs(k) / c + 2 : 1)), t.setProps(l + d, "setTouch")))
					}
				}
				function n(e) {
					e.stopPropagation();
					var t = e.target._slider;
					if (t) {
						if (t.animatingTo === t.currentSlide && !_ && null !== d) {
							var i = f ? -d : d,
								n = i > 0 ? t.getTarget("next") : t.getTarget("prev");
							t.canAdvance(n) && (Number(new Date) - g < 550 && Math.abs(i) > 50 || Math.abs(i) > c / 2) ? t.flexAnimate(n, t.vars.pauseOnAction) : p || t.flexAnimate(t.currentSlide, t.vars.pauseOnAction, !0)
						}
						a = null, r = null, d = null, l = null, k = 0
					}
				}
				var a, r, l, c, d, g, m, v, y, _ = !1,
					b = 0,
					w = 0,
					k = 0;
				s ? (i.style.msTouchAction = "none", i._gesture = new MSGesture, i._gesture.target = i, i.addEventListener("MSPointerDown", e, !1), i._slider = o, i.addEventListener("MSGestureChange", t, !1), i.addEventListener("MSGestureEnd", n, !1)) : (m = function(e) {
					o.animating ? e.preventDefault() : (window.navigator.msPointerEnabled || 1 === e.touches.length) && (o.pause(), c = u ? o.h : o.w, g = Number(new Date), b = e.touches[0].pageX, w = e.touches[0].pageY, l = h && f && o.animatingTo === o.last ? 0 : h && f ? o.limit - (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo : h && o.currentSlide === o.last ? o.limit : h ? (o.itemW + o.vars.itemMargin) * o.move * o.currentSlide : f ? (o.last - o.currentSlide + o.cloneOffset) * c : (o.currentSlide + o.cloneOffset) * c, a = u ? w : b, r = u ? b : w, i.addEventListener("touchmove", v, !1), i.addEventListener("touchend", y, !1))
				}, v = function(e) {
					b = e.touches[0].pageX, w = e.touches[0].pageY, d = u ? a - w : a - b, _ = u ? Math.abs(d) < Math.abs(b - r) : Math.abs(d) < Math.abs(w - r);
					(!_ || Number(new Date) - g > 500) && (e.preventDefault(), !p && o.transitions && (o.vars.animationLoop || (d /= 0 === o.currentSlide && 0 > d || o.currentSlide === o.last && d > 0 ? Math.abs(d) / c + 2 : 1), o.setProps(l + d, "setTouch")))
				}, y = function(e) {
					if (i.removeEventListener("touchmove", v, !1), o.animatingTo === o.currentSlide && !_ && null !== d) {
						var t = f ? -d : d,
							n = t > 0 ? o.getTarget("next") : o.getTarget("prev");
						o.canAdvance(n) && (Number(new Date) - g < 550 && Math.abs(t) > 50 || Math.abs(t) > c / 2) ? o.flexAnimate(n, o.vars.pauseOnAction) : p || o.flexAnimate(o.currentSlide, o.vars.pauseOnAction, !0)
					}
					i.removeEventListener("touchend", y, !1), a = null, r = null, d = null, l = null
				}, i.addEventListener("touchstart", m, !1))
			},
			resize: function() {
				!o.animating && o.is(":visible") && (h || o.doMath(), p ? m.smoothHeight() : h ? (o.slides.width(o.computedW), o.update(o.pagingCount), o.setProps()) : u ? (o.viewport.height(o.h), o.setProps(o.h, "setTotal")) : (o.vars.smoothHeight && m.smoothHeight(), o.newSlides.width(o.computedW), o.setProps(o.computedW, "setTotal")))
			},
			smoothHeight: function(e) {
				if (!u || p) {
					var t = p ? o : o.viewport;
					e ? t.animate({
						height: o.slides.eq(o.animatingTo).innerHeight()
					}, e) : t.innerHeight(o.slides.eq(o.animatingTo).innerHeight())
				}
			},
			sync: function(t) {
				var i = e(o.vars.sync).data("flexslider"),
					n = o.animatingTo;
				switch (t) {
				case "animate":
					i.flexAnimate(n, o.vars.pauseOnAction, !1, !0);
					break;
				case "play":
					i.playing || i.asNav || i.play();
					break;
				case "pause":
					i.pause()
				}
			},
			uniqueID: function(t) {
				return t.filter("[id]").add(t.find("[id]")).each(function() {
					var t = e(this);
					t.attr("id", t.attr("id") + "_clone")
				}), t
			},
			pauseInvisible: {
				visProp: null,
				init: function() {
					var e = m.pauseInvisible.getHiddenProp();
					if (e) {
						var t = e.replace(/[H|h]idden/, "") + "visibilitychange";
						document.addEventListener(t, function() {
							m.pauseInvisible.isHidden() ? o.startTimeout ? clearTimeout(o.startTimeout) : o.pause() : o.started ? o.play() : o.vars.initDelay > 0 ? setTimeout(o.play, o.vars.initDelay) : o.play()
						})
					}
				},
				isHidden: function() {
					var e = m.pauseInvisible.getHiddenProp();
					return !!e && document[e]
				},
				getHiddenProp: function() {
					var e = ["webkit", "moz", "ms", "o"];
					if ("hidden" in document) return "hidden";
					for (var t = 0; t < e.length; t++) if (e[t] + "Hidden" in document) return e[t] + "Hidden";
					return null
				}
			},
			setToClearWatchedEvent: function() {
				clearTimeout(a), a = setTimeout(function() {
					d = ""
				}, 3e3)
			}
		}, o.flexAnimate = function(t, i, n, a, s) {
			if (o.vars.animationLoop || t === o.currentSlide || (o.direction = t > o.currentSlide ? "next" : "prev"), g && 1 === o.pagingCount && (o.direction = o.currentItem < t ? "next" : "prev"), !o.animating && (o.canAdvance(t, s) || n) && o.is(":visible")) {
				if (g && a) {
					var c = e(o.vars.asNavFor).data("flexslider");
					if (o.atEnd = 0 === t || t === o.count - 1, c.flexAnimate(t, !0, !1, !0, s), o.direction = o.currentItem < t ? "next" : "prev", c.direction = o.direction, Math.ceil((t + 1) / o.visible) - 1 === o.currentSlide || 0 === t) return o.currentItem = t, o.slides.removeClass(r + "active-slide").eq(t).addClass(r + "active-slide"), !1;
					o.currentItem = t, o.slides.removeClass(r + "active-slide").eq(t).addClass(r + "active-slide"), t = Math.floor(t / o.visible)
				}
				if (o.animating = !0, o.animatingTo = t, i && o.pause(), o.vars.before(o), o.syncExists && !s && m.sync("animate"), o.vars.controlNav && m.controlNav.active(), h || o.slides.removeClass(r + "active-slide").eq(t).addClass(r + "active-slide"), o.atEnd = 0 === t || t === o.last, o.vars.directionNav && m.directionNav.update(), t === o.last && (o.vars.end(o), o.vars.animationLoop || o.pause()), p) l ? (o.slides.eq(o.currentSlide).css({
					opacity: 0,
					zIndex: 1
				}), o.slides.eq(t).css({
					opacity: 1,
					zIndex: 2
				}), o.wrapup(_)) : (o.slides.eq(o.currentSlide).css({
					zIndex: 1
				}).animate({
					opacity: 0
				}, o.vars.animationSpeed, o.vars.easing), o.slides.eq(t).css({
					zIndex: 2
				}).animate({
					opacity: 1
				}, o.vars.animationSpeed, o.vars.easing, o.wrapup));
				else {
					var d, v, y, _ = u ? o.slides.filter(":first").height() : o.computedW;
					h ? (d = o.vars.itemMargin, y = (o.itemW + d) * o.move * o.animatingTo, v = y > o.limit && 1 !== o.visible ? o.limit : y) : v = 0 === o.currentSlide && t === o.count - 1 && o.vars.animationLoop && "next" !== o.direction ? f ? (o.count + o.cloneOffset) * _ : 0 : o.currentSlide === o.last && 0 === t && o.vars.animationLoop && "prev" !== o.direction ? f ? 0 : (o.count + 1) * _ : f ? (o.count - 1 - t + o.cloneOffset) * _ : (t + o.cloneOffset) * _, o.setProps(v, "", o.vars.animationSpeed), o.transitions ? (o.vars.animationLoop && o.atEnd || (o.animating = !1, o.currentSlide = o.animatingTo), o.container.unbind("webkitTransitionEnd transitionend"), o.container.bind("webkitTransitionEnd transitionend", function() {
						clearTimeout(o.ensureAnimationEnd), o.wrapup(_)
					}), clearTimeout(o.ensureAnimationEnd), o.ensureAnimationEnd = setTimeout(function() {
						o.wrapup(_)
					}, o.vars.animationSpeed + 100)) : o.container.animate(o.args, o.vars.animationSpeed, o.vars.easing, function() {
						o.wrapup(_)
					})
				}
				o.vars.smoothHeight && m.smoothHeight(o.vars.animationSpeed)
			}
		}, o.wrapup = function(e) {
			p || h || (0 === o.currentSlide && o.animatingTo === o.last && o.vars.animationLoop ? o.setProps(e, "jumpEnd") : o.currentSlide === o.last && 0 === o.animatingTo && o.vars.animationLoop && o.setProps(e, "jumpStart")), o.animating = !1, o.currentSlide = o.animatingTo, o.vars.after(o)
		}, o.animateSlides = function() {
			!o.animating && t && o.flexAnimate(o.getTarget("next"))
		}, o.pause = function() {
			clearInterval(o.animatedSlides), o.animatedSlides = null, o.playing = !1, o.vars.pausePlay && m.pausePlay.update("play"), o.syncExists && m.sync("pause")
		}, o.play = function() {
			o.playing && clearInterval(o.animatedSlides), o.animatedSlides = o.animatedSlides || setInterval(o.animateSlides, o.vars.slideshowSpeed), o.started = o.playing = !0, o.vars.pausePlay && m.pausePlay.update("pause"), o.syncExists && m.sync("play")
		}, o.stop = function() {
			o.pause(), o.stopped = !0
		}, o.canAdvance = function(e, t) {
			var i = g ? o.pagingCount - 1 : o.last;
			return !(!t && (!g || o.currentItem !== o.count - 1 || 0 !== e || "prev" !== o.direction) && (g && 0 === o.currentItem && e === o.pagingCount - 1 && "next" !== o.direction || e === o.currentSlide && !g || !o.vars.animationLoop && (o.atEnd && 0 === o.currentSlide && e === i && "next" !== o.direction || o.atEnd && o.currentSlide === i && 0 === e && "next" === o.direction)))
		}, o.getTarget = function(e) {
			return o.direction = e, "next" === e ? o.currentSlide === o.last ? 0 : o.currentSlide + 1 : 0 === o.currentSlide ? o.last : o.currentSlide - 1
		}, o.setProps = function(e, t, i) {
			var n = function() {
					var i = e || (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo;
					return -1 *
					function() {
						if (h) return "setTouch" === t ? e : f && o.animatingTo === o.last ? 0 : f ? o.limit - (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo : o.animatingTo === o.last ? o.limit : i;
						switch (t) {
						case "setTotal":
							return f ? (o.count - 1 - o.currentSlide + o.cloneOffset) * e : (o.currentSlide + o.cloneOffset) * e;
						case "setTouch":
							return e;
						case "jumpEnd":
							return f ? e : o.count * e;
						case "jumpStart":
							return f ? o.count * e : e;
						default:
							return e
						}
					}() + "px"
				}();
			o.transitions && (n = u ? "translate3d(0," + n + ",0)" : "translate3d(" + n + ",0,0)", i = void 0 !== i ? i / 1e3 + "s" : "0s", o.container.css("-" + o.pfx + "-transition-duration", i), o.container.css("transition-duration", i)), o.args[o.prop] = n, (o.transitions || void 0 === i) && o.container.css(o.args), o.container.css("transform", n)
		}, o.setup = function(t) {
			if (p) o.slides.css({
				width: "100%",
				"float": "left",
				marginRight: "-100%",
				position: "relative"
			}), "init" === t && (l ? o.slides.css({
				opacity: 0,
				display: "block",
				webkitTransition: "opacity " + o.vars.animationSpeed / 1e3 + "s ease",
				zIndex: 1
			}).eq(o.currentSlide).css({
				opacity: 1,
				zIndex: 2
			}) : 0 == o.vars.fadeFirstSlide ? o.slides.css({
				opacity: 0,
				display: "block",
				zIndex: 1
			}).eq(o.currentSlide).css({
				zIndex: 2
			}).css({
				opacity: 1
			}) : o.slides.css({
				opacity: 0,
				display: "block",
				zIndex: 1
			}).eq(o.currentSlide).css({
				zIndex: 2
			}).animate({
				opacity: 1
			}, o.vars.animationSpeed, o.vars.easing)), o.vars.smoothHeight && m.smoothHeight();
			else {
				var i, n;
				"init" === t && (o.viewport = e('<div class="' + r + 'viewport"></div>').css({
					overflow: "hidden",
					position: "relative"
				}).appendTo(o).append(o.container), o.cloneCount = 0, o.cloneOffset = 0, f && (n = e.makeArray(o.slides).reverse(), o.slides = e(n), o.container.empty().append(o.slides))), o.vars.animationLoop && !h && (o.cloneCount = 2, o.cloneOffset = 1, "init" !== t && o.container.find(".clone").remove(), o.container.append(m.uniqueID(o.slides.first().clone().addClass("clone")).attr("aria-hidden", "true")).prepend(m.uniqueID(o.slides.last().clone().addClass("clone")).attr("aria-hidden", "true"))), o.newSlides = e(o.vars.selector, o), i = f ? o.count - 1 - o.currentSlide + o.cloneOffset : o.currentSlide + o.cloneOffset, u && !h ? (o.container.height(200 * (o.count + o.cloneCount) + "%").css("position", "absolute").width("100%"), setTimeout(function() {
					o.newSlides.css({
						display: "block"
					}), o.doMath(), o.viewport.height(o.h), o.setProps(i * o.h, "init")
				}, "init" === t ? 100 : 0)) : (o.container.width(200 * (o.count + o.cloneCount) + "%"), o.setProps(i * o.computedW, "init"), setTimeout(function() {
					o.doMath(), o.newSlides.css({
						width: o.computedW,
						marginRight: o.computedM,
						"float": "left",
						display: "block"
					}), o.vars.smoothHeight && m.smoothHeight()
				}, "init" === t ? 100 : 0))
			}
			h || o.slides.removeClass(r + "active-slide").eq(o.currentSlide).addClass(r + "active-slide"), o.vars.init(o)
		}, o.doMath = function() {
			var e = o.slides.first(),
				t = o.vars.itemMargin,
				i = o.vars.minItems,
				n = o.vars.maxItems;
			o.w = void 0 === o.viewport ? o.width() : o.viewport.width(), o.h = e.height(), o.boxPadding = e.outerWidth() - e.width(), h ? (o.itemT = o.vars.itemWidth + t, o.itemM = t, o.minW = i ? i * o.itemT : o.w, o.maxW = n ? n * o.itemT - t : o.w, o.itemW = o.minW > o.w ? (o.w - t * (i - 1)) / i : o.maxW < o.w ? (o.w - t * (n - 1)) / n : o.vars.itemWidth > o.w ? o.w : o.vars.itemWidth, o.visible = Math.floor(o.w / o.itemW), o.move = o.vars.move > 0 && o.vars.move < o.visible ? o.vars.move : o.visible, o.pagingCount = Math.ceil((o.count - o.visible) / o.move + 1), o.last = o.pagingCount - 1, o.limit = 1 === o.pagingCount ? 0 : o.vars.itemWidth > o.w ? o.itemW * (o.count - 1) + t * (o.count - 1) : (o.itemW + t) * o.count - o.w - t) : (o.itemW = o.w, o.itemM = t, o.pagingCount = o.count, o.last = o.count - 1), o.computedW = o.itemW - o.boxPadding, o.computedM = o.itemM
		}, o.update = function(e, t) {
			o.doMath(), h || (e < o.currentSlide ? o.currentSlide += 1 : e <= o.currentSlide && 0 !== e && (o.currentSlide -= 1), o.animatingTo = o.currentSlide), o.vars.controlNav && !o.manualControls && ("add" === t && !h || o.pagingCount > o.controlNav.length ? m.controlNav.update("add") : ("remove" === t && !h || o.pagingCount < o.controlNav.length) && (h && o.currentSlide > o.last && (o.currentSlide -= 1, o.animatingTo -= 1), m.controlNav.update("remove", o.last))), o.vars.directionNav && m.directionNav.update()
		}, o.addSlide = function(t, i) {
			var n = e(t);
			o.count += 1, o.last = o.count - 1, u && f ? void 0 !== i ? o.slides.eq(o.count - i).after(n) : o.container.prepend(n) : void 0 !== i ? o.slides.eq(i).before(n) : o.container.append(n), o.update(i, "add"), o.slides = e(o.vars.selector + ":not(.clone)", o), o.setup(), o.vars.added(o)
		}, o.removeSlide = function(t) {
			var i = isNaN(t) ? o.slides.index(e(t)) : t;
			o.count -= 1, o.last = o.count - 1, isNaN(t) ? e(t, o.slides).remove() : u && f ? o.slides.eq(o.last).remove() : o.slides.eq(t).remove(), o.doMath(), o.update(i, "remove"), o.slides = e(o.vars.selector + ":not(.clone)", o), o.setup(), o.vars.removed(o)
		}, m.init()
	}, e(window).blur(function(e) {
		t = !1
	}).focus(function(e) {
		t = !0
	}), e.flexslider.defaults = {
		namespace: "flex-",
		selector: ".slides > li",
		animation: "fade",
		easing: "swing",
		direction: "horizontal",
		reverse: !1,
		animationLoop: !0,
		smoothHeight: !1,
		startAt: 0,
		slideshow: !0,
		slideshowSpeed: 7e3,
		animationSpeed: 600,
		initDelay: 0,
		randomize: !1,
		fadeFirstSlide: !0,
		thumbCaptions: !1,
		pauseOnAction: !0,
		pauseOnHover: !1,
		pauseInvisible: !0,
		useCSS: !0,
		touch: !0,
		video: !1,
		controlNav: !0,
		directionNav: !0,
		prevText: "Previous",
		nextText: "Next",
		keyboard: !0,
		multipleKeyboard: !1,
		mousewheel: !1,
		pausePlay: !1,
		pauseText: "Pause",
		playText: "Play",
		controlsContainer: "",
		manualControls: "",
		customDirectionNav: "",
		sync: "",
		asNavFor: "",
		itemWidth: 0,
		itemMargin: 0,
		minItems: 1,
		maxItems: 0,
		move: 0,
		allowOneSlide: !0,
		start: function() {},
		before: function() {},
		after: function() {},
		end: function() {},
		added: function() {},
		removed: function() {},
		init: function() {}
	}, e.fn.flexslider = function(t) {
		if (void 0 === t && (t = {}), "object" == typeof t) return this.each(function() {
			var i = e(this),
				n = t.selector ? t.selector : ".slides > li",
				o = i.find(n);
			1 === o.length && !1 === t.allowOneSlide || 0 === o.length ? (o.fadeIn(400), t.start && t.start(i)) : void 0 === i.data("flexslider") && new e.flexslider(this, t)
		});
		var i = e(this).data("flexslider");
		switch (t) {
		case "play":
			i.play();
			break;
		case "pause":
			i.pause();
			break;
		case "stop":
			i.stop();
			break;
		case "next":
			i.flexAnimate(i.getTarget("next"), !0);
			break;
		case "prev":
		case "previous":
			i.flexAnimate(i.getTarget("prev"), !0);
			break;
		default:
			"number" == typeof t && i.flexAnimate(t, !0)
		}
	}
}(jQuery), function() {
	function set(str, value) {
		for (var p, cur = VARS.source, ps = str.split("."), ks = [], fns = "", i = 0, len = ps.length; len > i; i++) p = ps[i], cur = cur[p], ks.push('["' + ps[i] + '"]');
		fns = "VARS.source" + ks.join("") + '="' + value + '"', eval("(" + fns + ")")
	}
	function get(e) {
		for (var t = VARS.source, i = e.split("."), n = 0, o = i.length; o > n; n++) if (t = t[i[n]], void 0 === t) return;
		return t
	}
	for (var VARS = {
		prefix: "$",
		keys: ["SYS", "ROOM", "PAGE", "COLLIGATE"],
		source: {},
		scope: window
	}, i = 0; i < VARS.keys.length; i++) {
		var key = VARS.keys[i],
			fkey = VARS.prefix + key,
			obj = VARS.scope[fkey];
		obj && (VARS.source[key.toLowerCase()] = obj)
	}
	define("douyu/context", ["shark/util/cookie/1.0"], function(e) {
		location.host;
		e.config("keypre", get("sys.cookie_pre") || "");
		var t = {
			set: set,
			get: get
		};
		return t
	})
}(), shark.config({
	resolve: function(e) {
		if (shark.helper.file.isAbsolute(e)) return !1;
		var t = e.split("/"),
			i = t[0],
			n = shark.helper.file.isCss(e) ? "css/" : "js/";
		switch (i) {
		case "douyu":
			e = "app/douyu/" + n + t.slice(1).join("/");
			break;
		case "douyu-activity":
			e = "app/douyu/activity/" + n + t.slice(1).join("/");
			break;
		case "douyu-liveH5":
			e = "app/douyu-liveH5/" + t.slice(1).join("/")
		}
		return e
	},
	baseUrl: $SYS.web_url ? $SYS.web_url : ""
}), shark.on("createNode", function(e, t) {
	var i, n = shark.helper.file,
		o = new Date,
		a = $SYS && $SYS.res_ver || "" + o.getUTCFullYear() + "-" + (o.getUTCMonth() + 1) + "-" + o.getUTCDate(),
		r = $SYS && $SYS.swf_ver || "" + o.getUTCFullYear() + "-" + (o.getUTCMonth() + 1) + "-" + o.getUTCDate();
	i = t.url, n.isCss(i) ? i.indexOf("?") > 0 ? e.href = i + "&" + a : e.href = i + "?" + a : i.indexOf("?") > 0 ? i.indexOf("douyu-liveH5") > 0 ? e.src = i + "&" + r : e.src = i + "&" + a : i.indexOf("douyu-liveH5") > 0 ? e.src = i + "?" + r : e.src = i + "?" + a
}), shark.on("saved", function(e) {
	var t = new RegExp("^douyu//*");
	t.test(e.id) && shark.helper.domReady(function() {
		define([e.id], function(e) {
			e && "function" == typeof e.application && e.application.call(e)
		})
	})
}), function() {
	for (var e = 0, t = ["ms", "moz", "webkit", "o"], i = t.length, n = 0; i > n; ++n) window.requestAnimationFrame = window.requestAnimationFrame ? window.requestAnimationFrame : window[t[n] + "RequestAnimationFrame"], window.cancelAnimationFrame = window.cancelAnimationFrame ? window.cancelAnimationFrame : window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"];
	window.requestAnimationFrame || (window.requestAnimationFrame = function(t, i) {
		var n = (new Date).getTime(),
			o = Math.max(0, 16 - (n - e)),
			a = window.setTimeout(function() {
				t(n + o)
			}, o);
		return e = n + o, a
	}), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
		window.clearTimeout(e)
	})
}(), function() {
	function e() {
		var e;
		do e = Math.floor(1e9 * Math.random());
		while (e in t);
		return e
	}
	var t = {};
	window.requestNextAnimationFrame || (window.requestNextAnimationFrame = function(i, n) {
		var o = e();
		return t[o] = window.requestAnimationFrame(function() {
			t[o] = window.requestAnimationFrame(function(e) {
				delete t[o], i(e)
			}, n)
		}), o
	}), window.cancelNextAnimationFrame || (window.cancelNextAnimationFrame = function(e) {
		t[e] && (window.cancelAnimationFrame(t[e]), delete t[e])
	})
}(), function(e, t, i) {
	"function" == typeof define && define.fmd ? define("douyu/com/lazyLoad", ["jquery"], i) : e.SharkLazyLoad || (e.SharkLazyLoad = i(t))
}(window, window.jQuery, function(e) {
	var t, i = window.shark && window.shark.config("debug") || !1,
		n = function() {
			this.init()
		};
	n.prototype = {
		constructor: this,
		init: function() {
			this.queue = [], this.cache = {}, this.timeout = 5e3, this.timer = null, this.isBindEvents = !1, this.events = ["mousemove", "scroll", "mousedown", "touchstart", "touchmove", "keydown", "resize", "load"].join(" "), this.isDebug = i
		},
		makeArray: function(t) {
			var i = [];
			return e.each(t, function(e, t) {
				i.push({
					file: [e],
					callback: t
				})
			}), i
		},
		entry: function(t, i, n, o) {
			for (var a = e.isArray(t) ? t : [t], r = a.length, s = a.join(","); r--;) if ("string" != typeof a[r]) throw new Error("[lazyload]: The file name is not a string!!!");
			if (!e.isFunction(i) && (!e.isPlainObject(i) || e.isEmptyObject(i))) throw new Error("[lazyload]: The configuration item is not a callback function or is not an object!!!");
			return this.cache[s] = this.cache[s] || [], e.isFunction(i) && (this.cache[s] = this.cache[s].concat([{
				file: a,
				callback: i
			}])), e.isPlainObject(i) && (this.cache[s] = this.cache[s].concat(this.makeArray(i))), this[n ? "load" : "push"](s, o), this
		},
		push: function(t, i) {
			var n = this.cache[t];
			this.isDebug ? this.queue = this.queue.concat(n) : this.queue.push({
				file: t,
				callback: i ? e.proxy(i, this, e.proxy(this.loadModule, this, n)) : e.proxy(this.loadModule, this, n)
			}), this.isBindEvents || (this.isBindEvents = !0, this.timer = window.requestNextAnimationFrame(e.proxy(this.release, this), this.timeout), e(window).on(this.events, e.proxy(this.release, this)))
		},
		load: function(t) {
			var i = this.cache[t];
			this.isDebug ? this.loadModule(i) : this.loadModule([{
				file: t,
				callback: e.proxy(this.loadModule, this, i)
			}])
		},
		release: function() {
			this.queue.length && this.loadModule(this.queue), this.isBindEvents && (this.isBindEvents = !1, e(window).detach(this.events, this.release)), this.timer && window.cancelNextAnimationFrame(this.timer)
		},
		loadModule: function(t) {
			for (var i, n = t && e.isArray(t) ? t : [], o = function(t) {
					window.requestNextAnimationFrame(function() {
						var i = e.isArray(t.file) ? t.file : [t.file];
						require.use(i, function() {
							e.isFunction(t.callback) && t.callback.apply(this, arguments)
						})
					})
				}; i = n.shift();)!
			function(e) {
				o(e)
			}(i)
		}
	}, t || (t = new n), t.isDebug && (window.Lazyload = t);
	var o = function(e, t) {
			this.next = null, this.config = t, this.id = e
		};
	return o.prototype = {
		run: function() {
			var i = this;
			return t.entry.apply(t, i.config.concat([null, function(t) {
				e.isFunction(t) && t.apply(arguments), i.goNext()
			}]))
		},
		setNext: function(e) {
			this.next = e
		},
		goNext: function() {
			this.next && this.next.run()
		}
	}, o.makeInstance = function(e) {
		var t, i, n = [];
		for (t = 0; t < e.length; t++) i = e[t] || [], o.check(i), n.push(new o(i[0], i));
		return n
	}, o.check = function(t) {
		if (!e.isArray(t)) throw new Error("[lazyload]: The echelon object must be the number of groups!!!");
		if ("string" != typeof t[0] || !e.isPlainObject(t[1]) || e.isEmptyObject(t[1])) throw new Error("[lazyload]: The first element of the array must be a string and the second element must be an object!!!")
	}, o.takeModuleOff = function(t) {
		var i, n, a = {};
		for (i = 0; i < t.length; i++) n = t[i], o.check(n), a = e.extend({}, a, n[1]);
		return a
	}, {
		push: function() {
			return t.entry.apply(t, arguments)
		},
		echelon: function(e) {
			var n, a, r = [];
			if (i) return t.entry.apply(t, [""].concat([o.takeModuleOff(e)]));
			for (r = o.makeInstance(e), n = 1; n < r.length; n++) r[n - 1].setNext(r[n]);
			a = r[0] || [], a.run()
		},
		load: function() {
			var e = [].slice.call(arguments);
			return 1 === e.length && (e = e.concat([function() {}, !0])), 2 === e.length && (e = e.concat([!0])), t.entry.apply(t, e)
		}
	}
}), define("douyu/page/room/base/api", ["jquery", "shark/util/flash/data/1.0", "shark/util/flash/bridge/1.0"], function(e, t, i, n) {
	var o = {
		flash: {
			id: "room_flash_proxy"
		}
	},
		a = ["room_csrf_get", "room_dycookie_set", "room_dycookie_get", "room_login_show", "room_reg_show", "room_bus_login", "room_bus_login2", "room_bus_shild", "room_bus_phock", "room_bus_pagescr", "room_bus_showwatchtip", "room_bus_showwatchtipdown", "room_bus_checksevertime", "room_data_sererr", "room_data_flaerr", "room_data_chat", "room_data_chat2", "room_data_schat", "room_data_athena_supermsg", "room_data_sys", "room_data_brocast", "room_data_cqrank", "room_data_cqrankupdate", "room_data_olyw", "room_data_info", "room_data_login", "room_data_userc", "room_data_setadm", "room_data_gift", "room_data_buycq", "room_data_tasklis", "room_data_taskcou", "room_data_taskrec", "room_data_chest", "room_data_onekeyacc", "room_data_chatinit", "room_data_chatrep", "room_data_ycchange", "room_data_state", "room_data_nstip", "room_data_nstip2", "room_data_illchange", "room_data_giftbat1", "room_data_ancpoints", "room_data_reg", "room_data_idle", "room_data_idle_dp", "room_screenChange", "room_data_handler", "room_data_fansRank", "room_data_ulgrow", "room_data_rankgap", "room_data_expchange", "room_data_beastrec", "room_data_beastrep", "room_data_petrec", "room_data_buytickets", "room_data_chargelive", "room_data_endchargelive", "room_data_endtrysee", "room_data_cden", "room_data_sabonus", "room_data_sabonusget", "room_bus_comcall", "room_data_admfail", "room_data_chatpri", "room_data_per", "room_data_giftbat2", "room_data_balance", "room_data_tasksign", "room_data_chestquery", "room_data_chatcd", "room_data_luckdrawcd", "room_data_wbsharesuc", "data_rank_num", "data_rank_score", "room_data_tbredpacket", "room_advert_playover", "room_vipsit_list", "room_data_hideshopbtn", "room_baping_notify", "room_jielong_progress", "room_data_commandresult", "room_data_pageinfo", "room_data_burst", "room_data_shield_effects", "room_data_get_shield_status", "room_data_validate_peck", "room_data_openNoble", "room_show_yz_rank", "room_video_ready", "room_data_ShieldDan", "room_draw_copy_command", "room_draw_send_gift", "room_draw_end", "room_data_FPS", "room_energy_task_anchor_pop", "room_frbInfo", "room_yz_data", "room_yz_backtime", "room_capture_won_moment", "room_follow", "flash_ready", "flash_draw", "flash_over", "room_cps_SendExtensionNum", "room_cps_SendExtensionBack", "room_login_queue", "room_chongnengv3", "room_video_catchtime", "room_12moth_yule_data", "room_data_req_gift_config", "room_show_love_headline", "room_data_love_headline", "room_window_reload", "room_GCBroadCast_data", "room_show_valentine2018", "room_spring_data", "room_spring_gift", "room_draw_join", "room_draw_status", "room_common_dialog", "room_shopBroadCast_click", "room_show_starmagic", "room_activity_handle", "room_show_foolday2018", "room_show_hit2018", "room_show_yzgift_rank", "room_rebate_status", "room_rebate_end", "room_user_ban", "room_data_connect", "room_voicePKRank_show", "room_video_replay", "room_activity_init_handle", "room_data_giftaghl", "room_guess_handler", "room_zhuanpan", "room_pk_treasure"],
		r = ["js_setActivityConf", "js_setConf", "js_setCsrf", "js_newuser_client", "js_userlogin", "js_verReque", "js_anotherlogin", "js_sendmsg", "js_blackuser", "js_userlogout", "js_setadmin", "js_sendsize", "js_barrage", "js_myblacklist", "adverment", "js_givePresent", "js_giveGift", "js_queryTask", "js_newQueryTask", "js_obtainTask", "js_roomSignUp", "js_keyTitles", "js_reportBarrage", "js_exitFullScreen", "js_rewardList", "js_pmFeedback", "js_query_giftPkg", "js_switchStream", "js_superDanmuClick", "js_GetHongbao", "js_effectVisible", "js_shieGiftEffect", "js_shieldEffects", "js_breakRuleTip", "js_timeLoginTip", "js_sendhandler", "js_shareSuccess", "js_effect_config", "js_turn_on_activity", "js_UserNoHandle", "js_UserNoFlowHandle", "js_UserHaveHandle", "js_buytickets_success", "js_getRankScore", "js_page_fullscreen_state", "js_vipsit_query", "js_barrage_command", "js_page_type", "js_send_cate_msg", "js_barrage_command_showresult", "js_getnoble", "js_check_product", "js_send_super_danmu", "js_gmrdy", "js_gmst", "js_turntable", "js_medal_opera", "js_data_isAction", "js_data_FPSBack", "js_luckdraw_end_fail", "js_call_effect", "js_set_capture_shotcutkey", "js_room_spread", "js_spread_search", "js_chongneng_host_close", "js_follow_change", "js_fans_change", "js_config", "js_result", "js_reset", "js_data_server_shield", "js_game_recommend", "js_invite_PK", "js_gift_config", "js_yluser_list12", "js_gift_love_headline", "js_filterKeywords", "js_open_play_type", "js_spray_interact", "js_gift_valentine2018", "js_get_relive_card", "js_draw_join", "js_send_spring_gift", "js_gift_starmagic", "js_fans_config", "js_gift_foolday2018", "js_gift_hit2018", "js_rebate_send_back", "js_sendLoveMsg", "js_setReConnectDanmu", "js_voicePKRank_init", "js_setBarrageColor", "js_tencentcloundAd", "js_palytencentAd", "js_zhuanpan", "js_subscribe_protocol", "js_pk_treasure_result"],
		s = {
			fnIn: function(e, t) {
				for (var i = 0, n = e.length; n > i; i++) if (t === e[i]) return t;
				return !1
			},
			fnInACJ: function(e) {
				return s.fnIn(a, e)
			},
			fnInJCA: function(e) {
				return s.fnIn(r, e)
			}
		},
		l = {},
		c = {},
		d = function(t, i) {
			if (t = s.fnInACJ(t), !t) return !1;
			var n, o, a;
			return e.isFunction(i) ? (n = i, o = window) : (n = i.fn ||
			function() {}, a = i.data, o = i.scope || window), e.isArray(c[t]) || (c[t] = []), c[t].push({
				fn: n,
				data: a,
				scope: o
			}), u(t), !0
		},
		u = function(e) {
			var t = l[e];
			if (t) for (var i in t) h.apply(window, [e].concat(t[i]))
		},
		f = function(e, i) {
			var n = t.decode(i).too().type || "noType";
			l[e] || (l[e] = {}), l[e][n] = i
		},
		h = function(e) {
			var t, i = [],
				n = Array.prototype.slice.call(arguments, 1);
			if (e = s.fnInACJ(e), !e) return !1;
			for (var o, a = c[e] || [], r = 0, l = a.length; l > r; r++) o = a[r], o.data && (i.push(o.data), t = i.concat(n)), t = i.concat(n), o.fn.apply(o.scope, t);
			return !0
		},
		p = function(e) {
			var t, i = arguments[1],
				n = [].slice.call(arguments, 2),
				o = navigator.appName.indexOf("Microsoft") >= 0,
				a = o ? window[e] : document[e];
			a && (t = a[i]) && t.apply(a, n)
		},
		g = function(e) {
			if (e = s.fnInJCA(e)) {
				var t = [o.flash.id, e],
					i = [].slice.call(arguments, 1),
					n = t.concat(i);
				p.apply(window, n)
			}
		},
		m = function(e, t) {
			"flash.id" === e && (o.flash.id = t)
		},
		v = function() {
			for (var e, t, n = 0, o = a.length; o > n; n++) e = a[n], t = {
				fn: function(e) {
					var t = [e.name],
						i = Array.prototype.slice.call(arguments, 1),
						n = t.concat(i);
					h.apply(window, n), f.apply(window, n)
				},
				data: {
					name: e
				}
			}, i.add(e, t)
		},
		y = {
			application: v,
			set: m,
			reg: d,
			exe: g
		};
	return shark.config("debug") && (window.ACJ_C = c), shark.config("dydg") && (window.ACJ_CACHE = l), y
}), define("douyu/com/user-control", ["jquery", "shark/util/lang/1.0", "shark/util/cookie/1.0", "shark/util/flash/bridge/1.0", "douyu/context"], function(e, t, i, n, o) {
	var a = {
		client_id: window.client_id || 1,
		hmac_flash_ready: !1,
		salt: null
	},
		r = {};
	return r.control = {
		_on_auto_login: function() {},
		init: function() {
			r.control.auto()
		},
		check: function(t) {
			var n = !! i.get("nickname");
			if (t === !0 && !n) {
				var a = [],
					r = [];
				a = a.concat(["auth", "auth_wl", "uid", "nickname", "username", "own_room", "groupid", "notification", "phonestatus", "adplaytime"]);
				try {
					r = document.cookie.match(new RegExp("(^| )" + $SYS.cookie_pre + "userletnum(\\d)+", "g"))
				} catch (s) {
					r = []
				}
				a = a.concat(r);
				try {
					r = document.cookie.match(new RegExp("(^| )" + $SYS.cookie_pre + "usermsgnum(\\d)+", "g"))
				} catch (s) {
					r = []
				}
				a = a.concat(r);
				for (var l = 0, c = a.length; c > l; l++) a[l] = "" + a[l], a[l] = e.trim(a[l].replace($SYS.cookie_pre, ""));
				i.remove(a)
			}
			return !(i.get("uid") && o.get("sys.uid") || i.get("nickname") && o.get("sys.nickname")) || i.get("uid") === o.get("sys.uid") && i.get("nickname") === o.get("sys.nickname") ? !! i.get("uid") : (e.dialog.tips_black("当前登录信息有误,请刷新页面!"), !1)
		},
		exit: function(t) {
			if (i.get("stk")) {
				var n = navigator.userAgent; - 1 != n.indexOf("MSIE") || -1 != n.indexOf("rv:11") ? e.post("/member/logout/ajax", function() {
					location.href = passport_host + "sso/logout?client_id=" + a.client_id
				}, "json") : location.href = passport_host + "sso/logout?client_id=" + a.client_id
			} else if (i.get("nickname")) {
				var n = navigator.userAgent; - 1 != n.indexOf("MSIE") || -1 != n.indexOf("rv:11") ? e.post("/member/logout/ajax", function() {
					location.href = passport_host + "sso/logout?client_id=" + a.client_id
				}, "json") : location.href = passport_host + "sso/logout?client_id=" + a.client_id
			} else location.reload()
		},
		auto: function() {
			var e = r.control.check(!0);
			e && (o.set("sys.uid", i.get("uid")), o.set("sys.username", i.get("username")), o.set("sys.nickname", i.get("nickname")), o.set("sys.password", i.get("auth_wl")), o.set("sys.own_room", i.get("own_room")), o.set("sys.groupid", i.get("groupid")), o.set("sys.notification", i.get("notification")), o.set("sys.phonestatus", i.get("phonestatus")), o.set("sys.stk", i.get("stk")), o.set("sys.biz", i.get("biz")), o.set("sys.ltkid", i.get("ltkid")), o.set("sys.ct", i.get("ct"))), r.control._on_auto_login(e)
		},
		logsalt: function(t, i, n) {
			e.post("/member/login/checkUsername", {
				username: t
			}, function(t) {
				t.c >= 0 && (a.salt = {
					text: t.r
				}, e.isFunction(i) && i.apply(window, n))
			}, "json")
		}
	}, r.control.API = {
		lauth: function(t, i, n) {
			i = i || e.noop, n = n || e.noop, e.ajax({
				url: passport_host + "lapi/passport/iframe/safeAuth",
				type: "GET",
				data: t,
				dataType: "jsonp",
				jsonp: "callback",
				callback: "json_callback",
				success: i,
				error: n
			})
		},
		login: function(t, i, n, o) {
			t = t || "/api/passport/login", n = n || e.noop, o = o || e.noop, e.ajax({
				url: t,
				type: "GET",
				data: i,
				dataType: "json",
				success: n,
				error: o
			})
		}
	}, r.control
}), define("douyu/com/user-view", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/cookie/1.0", "shark/util/flash/bridge/1.0", "douyu/context", "douyu/com/user-control"], function(e, t, i, n, o, a, r) {
	window.user_dialog && (e = window.$ || e);
	var s = window.UserJsSDK,
		l = {
			view: {
				el: {
					pop: "pop",
					shadow: "shadow",
					logform: "logform",
					regform: "regform",
					phoneform: "phoneform"
				},
				type: {
					login: "login",
					reg: "reg",
					phone: "phone",
					member: "member"
				},
				callback: {
					reg: "reg",
					login: "login",
					close: "close",
					dp: "dp"
				},
				currentView: null
			},
			client_id: window.client_id || 1,
			hmac_flash_ready: !1,
			salt: null
		},
		c = 1,
		d = {};
	d.control = r, d.init = function() {
		s.init(), d.view.init(), d.control.init(), d.IFRAME.init()
	}, d.view = {
		init: function() {
			d.view.checkStkToLogin()
		},
		checkStkToLogin: function() {
			n.get("ltkid") && n.get("biz") && "" !== n.get("ct") && null !== n.get("ct") && n.get("uid") && n.get("stk") || d.view.lauth()
		},
		lauth: function(t) {
			var i = {
				client_id: l.client_id,
				did: n.get("did") || "",
				t: (new Date).getTime()
			},
				o = function(i) {
					0 === i.error ? setTimeout(function() {
						e.dialog.tips_black("登录成功！", 1.5), location.reload()
					}, 500) : t && e.isFunction(t) && t()
				};
			d.control.API.lauth(i, o)
		},
		show: function(t, i, o) {
			var a = function() {
					var a = {
						client_id: window.client_id || 1,
						type: t,
						state: encodeURIComponent(window.location.href)
					};
					t = t || "login", i = e.isPlainObject(i) ? i : {}, i = e.extend(!0, a, i), s.POSSPORT.set("param", i, "show"), s.POSSPORT.set("cpsDirthName", u.val(), "cps"), l.callback || (l.callback = i.callback);
					try {
						e("#header .o-unlogin").removeClass("hide"), e('#header .o-login[data-login-content="yes"]').addClass("hide"), e("#header .js_login_no").css("display", "block"), e('#header .js_login_yes[data-login-content="yes"]').css("display", "none"), n.remove(["nickname"])
					} catch (r) {}
					return s.show(t, i, o)
				};
			d.view.lauth(a)
		},
		hide: function(e) {
			s.hide(), e && 1 === e && d.view.lauth(), e && -1 != e.indexOf("com") && window.location.replace(e)
		},
		toggle: function() {
			d.view._is_show ? d.view.hide() : d.view.show()
		},
		redirect: function(e) {
			var t = d.view._redirect;
			return t ? (d.view._redirect = void 0, setTimeout(function() {
				location.href = t
			}, e || 50), !0) : !1
		},
		callback: function(t) {
			if (e.isFunction(l.callback)) try {
				l.callback(t)
			} catch (i) {}
		},
		enter: function(e, t) {},
		apiLogin: function(i) {
			0 === i.error && (window.UserJsSDK.hide(), e.dialog.tips_black("登录成功！", 2), setTimeout(function() {
				location.reload()
			}, 500), t.trigger("mod.com.user.login.success", {
				step: c++
			}))
		}
	}, d.IFRAME = {
		init: function() {
			s.register(l.view.callback.reg, function(e) {
				d.view.apiLogin(e), t.trigger("mod.com.user.register.success", {
					step: c++
				})
			}), s.register(l.view.callback.login, function(e) {
				d.view.apiLogin(e)
			}), s.register(l.view.callback.close, function(e) {
				d.view.hide(e)
			}), s.register(l.view.callback.dp, function(e) {})
		}
	};
	var u = {
		check: function() {
			n.get("ditchName");
			if (location.search) for (var e, t, i = location.search.replace("?", "").split("&"), o = 0, a = i.length; a > o; o++) if (e = i[o], t = e.split("="), "ditchName" === t[0]) {
				n.set("ditchName", t[1], 31104e3);
				break
			}
		},
		val: function() {
			return n.get("ditchName")
		}
	},
		f = {
			init: function(t) {
				t = t || {}, e.isFunction(t.onAuto) && (d.control._on_auto_login = t.onAuto), d.init()
			},
			show: d.view.show,
			hide: d.view.hide,
			toggle: d.view.toggle,
			exitif: d.view.exitif,
			check: d.control.check,
			enter: d.view.enter,
			exit: d.control.exit
		};
	u.check();
	var h = u.val();
	return h && DYS.sub({
		action_code: "show_ad_cps_source",
		ext: {
			chan_code: h,
			ref_url: document.referrer
		}
	}), f
}), define("douyu/com/user", ["jquery", "douyu/com/user-view"], function(e, t) {
	try {
		window.user_dialog && window.user_dialog.open_login && (window.user_dialog._open_login = window.user_dialog.open_login, window.user_dialog.open_login = function() {
			e(".loginbox-shadow").size() < 1 && e(".loginbox").size() < 1 ? (t.init(), t.show("login")) : t.show("login")
		}), window.user_dialog && window.user_dialog.open_reg && (window.user_dialog._open_reg = window.user_dialog.open_reg, window.user_dialog.open_reg = function() {
			e(".loginbox-shadow").size() < 1 && e(".loginbox").size() < 1 ? (t.init(), t.show("reg")) : t.show("reg")
		})
	} catch (i) {
		window.user_dialog && window.user_dialog._open_login && (window.user_dialog.open_login = window.user_dialog._open_login), window.user_dialog && window.user_dialog._open_reg && (window.user_dialog.open_reg = window.user_dialog._open_reg)
	}
	return t
}), define("douyu/page/room/normal/mod/room-login-queue", ["jquery", "shark/observer", "shark/util/cookie/1.0", "shark/util/flash/data/1.0", "douyu/context", "douyu/page/room/base/api"], function(e, t, i, n, o, a) {
	var r = {
		tplTextArr: [{
			content: "弹幕服务器拥挤..."
		}, {
			content: "预计排队时间",
			queueTime: 1
		}, {
			content: "请耐心等待，排队结束会重新载入弹幕",
			color: "#f70"
		}],
		isFirst: !0,
		time: 5,
		index: 0,
		endTime: null,
		timer: null
	},
		s = e("#js-chat-cont"),
		l = {
			init: function(e) {
				this.queueInitRender()
			},
			tpl: function(e) {
				var t = e.queueTime ? '&nbsp;<i class="room-queue-time" style="color: #f70;">' + r.time + "</i>&nbsp;秒" : "",
					i = e.color || "#333",
					n = 'style="color: ' + i + '; font-size: 14px;"';
				return ['<li class="jschartli" data-type="login-queue" ' + n + ">", '<p class="text-cont">' + e.content + t + "</p>", "</li>"].join("")
			},
			queueInitRender: function() {
				var e = this;
				r.timer = setInterval(function() {
					(new Date).getTime() > r.endTime && e.reLogin(), r.index < r.tplTextArr.length ? e.render(r.index) : (r.time--, s.find(".room-queue-time").text(r.time)), r.index++
				}, 1e3)
			},
			render: function(e) {
				var i = this.tpl(r.tplTextArr[e]);
				t.trigger("mod.chat.msg.msg", i)
			},
			emptyRender: function() {
				s.find('[data-type="login-queue"]').remove()
			},
			reLogin: function() {
				a.exe("js_newuser_client"), this.emptyRender()
			}
		};
	return {
		init: function(e) {
			a.reg("room_login_queue", function(e) {
				var t = n.decode(e).too();
				if (t && t.qt > 0) {
					var i = Number(t.qt) || 5;
					r.isFirst && (l.init(i), r.isFirst = !1), r.index = 0, r.time = i, r.endTime = (new Date).getTime() + 1e3 * (i + r.tplTextArr.length)
				}
			}), t.on("mod.room.loginQueue.clearInterval", function(e) {
				e && clearInterval(r.timer)
			})
		}
	}
}), define("douyu/com/exjsonp", function() {
	var e = function(t) {
			var i, n, o = [];
			if (t && t.callback) {
				if (i = e[t.callback], !i) throw new Error("callback not exists! please check the data of callback and registered name are the same!");
				for (o = i.callbacks, i.originalData = t, i.cache = t.data, i.src && (e[i.src] = i); n = o.splice(0, 1)[0];) n(t.data)
			}
		},
		t = function(t, i, n) {
			e[t] || (e[t] = {
				callbacks: []
			}), e[t].callbacks.push(i), n && (e[t].src = n)
		},
		i = function(e, t) {
			setTimeout(function() {
				try {
					t.clearAttributes ? t.clearAttributes() : (t.onerror = null, t.onload = null, t.onreadystatechange = null), e.removeChild(t), t = null
				} catch (i) {}
			})
		},
		n = function(n, o, a, r, s, l) {
			var c, d = document.createElement("script"),
				u = document.getElementsByTagName("head")[0] || document.body,
				f = 1 === arguments.length && arguments[0],
				h = f.src || n,
				p = f.callback || o,
				g = f.success || a,
				m = f.failure || r,
				v = f.beforeLoad || s;
			return t(p, g, h), c = e[o], c && "cache" in c && !l ? (e(c.originalData), void(d = null)) : (v && v(d), d.async = "async", d.src = h, d.onerror = function() {
				m && m(h, p), i(u, d)
			}, d.onload = function() {
				var t = e[o];
				t && "cache" in t ? i(u, d) : (m && m(h, p), i(u, d))
			}, d.onreadystatechange = function() {
				var t;
				/loaded|complete/i.test(d.readyState) && (t = e[o], t && "cache" in t ? i(u, d) : (m && m(h, p), i(u, d)))
			}, void u.appendChild(d))
		},
		o = function(t) {
			var i = e[t];
			return i && "cache" in i ? i.cache : void 0
		};
	return window.DYConfigCallback || (window.DYConfigCallback = e), {
		reg: t,
		load: n,
		getData: o
	}
}), define("douyu/com/left-dp", ["jquery"], function(e) {
	var t = [{
		target: ".small .left-btn",
		description: "点击_左侧导航_展开",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_open"
		},
		version: "2.0"
	}, {
		target: ".left-menu:not(.small) .left-btn",
		description: "点击_左侧导航_收起",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_close"
		},
		version: "2.0"
	}, {
		target: "#left .channel-cate li:eq(0)",
		description: "点击_左侧导航_全部直播",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_live"
		},
		version: "2.0"
	}, {
		target: "#left .channel-cate li:eq(1)",
		description: "点击_左侧导航_全部分类",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_class"
		},
		version: "2.0"
	}, {
		target: "#left .channel-cate li:eq(2)",
		description: "点击_左侧导航_排行榜",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_rank"
		},
		version: "2.0"
	}, {
		target: ".channel-cate li:eq(3)",
		description: "点击_左侧导航_我的关注",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_follow"
		},
		version: "2.0"
	}, {
		target: ".channel-cate li:eq(4)",
		description: "点击_左侧导航_页游",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_game"
		},
		version: "2.0"
	}, {
		target: "#left .r-tit li:eq(0)",
		description: "点击_左侧导航_栏目",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_column"
		},
		version: "2.0"
	}, {
		target: "#left .column-cont dt",
		description: "点击_左侧导航_栏目名称",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_cate",
			ext: {
				handle: function(e) {
					this.cid = e.find("a").attr("data-cid")
				}
			}
		},
		version: "2.0"
	}, {
		target: '#left .column-cont dd a[class!="more"]',
		description: "点击_左侧导航_分区",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_tag",
			ext: {
				handle: function(e) {
					this.pos = e.parent().index() + 1, this.tid = e.attr("data-tid")
				}
			}
		},
		version: "2.0"
	}, {
		target: "#left .btn-wrap .btn-live",
		description: "点击_左侧导航_申请_直播",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_apply_live"
		},
		version: "2.0"
	}, {
		target: "#left .f-other li:eq(0)",
		description: "点击_左侧导航_直播_指导",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_live_instr"
		},
		version: "2.0"
	}, {
		target: "#left .f-other li:eq(1)",
		description: "点击_左侧导航_客服_支持",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_cust_sp"
		},
		version: "2.0"
	}, {
		target: "#left .f-other li:eq(2)",
		description: "点击_左侧导航_房间_举报",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_room_report"
		},
		version: "2.0"
	}, {
		target: "#left .column-cont dd .more",
		description: "点击_左侧导航_分区_全部",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_tag_all",
			ext: {
				handle: function(e) {
					this.cid = e.closest("[data-left-item]").prev().find("a").attr("data-cid")
				}
			}
		},
		version: "2.0"
	}, {
		target: "#left .btn-wrap .btn-app",
		description: "点击_左侧导航_下载_APP下载",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_download_app"
		},
		version: "2.0"
	}, {
		target: "#left .r-tit li:eq(1)",
		description: "点击_左侧导航_发现",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_find"
		},
		version: "2.0"
	}, {
		target: "#left .recom-cont ul li",
		description: "点击_左侧导航_我最喜欢_分区",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_like_tag",
			ext: {
				handle: function(e) {
					this.pos = e.index() + 1, this.tid = e.find("a").attr("data-tag_id")
				}
			}
		},
		version: "2.0"
	}, {
		target: "#left .recom-cont .yb-list-24 li",
		description: "点击_左侧导航_24H热帖",
		events: "mousedown",
		config: {
			action_code: "click_leftnavi_hotpost",
			ext: {
				handle: function(e) {
					this.pos = e.index() + 1, this.jurl = e.find("a").attr("href")
				}
			}
		},
		version: "2.0"
	}];
	return e.each(t, function(t, i) {
		e("#container").on(i.events, i.target, function(t) {
			var n = e.extend(!0, {}, i),
				o = n.config ? n.config.ext : null,
				a = e(this);
			o && o.handle && (o.handle(a, t), delete o.handle), n.kernelFlag === !0 ? DYS.sub({
				kernelFlag: !0
			}, n.config) : DYS.sub(n.config)
		})
	}), {
		init: function(e) {
			DYS.sub.setPageCode(e)
		}
	}
}), define("douyu/com/left", ["jquery", "shark/class", "shark/observer", "shark/util/storage/1.0", "douyu/context", "douyu/com/user", "douyu/com/left-dp"], function(e, t, i, n, o, a, r) {
	var s, l, c = {
		left: {
			storageName: "leftstate",
			positionStorageName: "leftposition",
			state: {
				open: "open",
				close: "close"
			},
			isLoadFavorite: 0
		}
	},
		d = {
			get: function(e) {
				var t = "";
				try {
					t = window.sessionStorage[e]
				} catch (i) {}
				return t
			},
			set: function(e, t) {
				try {
					window.sessionStorage[e] = t
				} catch (i) {}
			}
		};
	l = t({
		init: function() {
			this.config = {
				el: "#left",
				sll: "#left-big-scroll",
				state: c.left.state.open,
				root: document.documentElement || document.body
			}, this.render(), this.bindEvt()
		},
		render: function() {
			this.config.$el = e(this.config.el), this.config.$sll = e(this.config.sll), this.config.$root = e(this.config.root), this.config.$cols = this.config.$el.find(".leftnav-cate .column-cont"), this.config.$recs = this.config.$el.find(".leftnav-cate .recom-cont"), this.observer = i.create(this), this.renderMyFavoriteCateList(), this.renderSll(), this.screenMedia(), this.renderApplyDelay(), this.checkDelay(), this.reScrollThumbPosition()
		},
		openLists: function() {
			var e = this.config.$cols.find("dd");
			e.removeClass("hide")
		},
		renderCalc: function() {
			this.config.$cols.find("dt").each(function(t) {
				e(this).attr("data-index", t)
			}), this.config.$cols.find("dd").each(function(t) {
				var i = e(this),
					n = i.height();
				i.removeClass("hide").attr({
					"data-index": t,
					"data-height": n
				}), 0 !== t && i.hide()
			})
		},
		renderSll: function() {
			this.config.$sll.tinyscrollbar({
				axis: "y"
			}), this.resetSllDelay()
		},
		resetSll: function() {
			var e = this.config.$el,
				t = this.config.$sll,
				i = e.find(".left-big .b-content"),
				n = e.find(".left-footer"),
				o = n.find(".btn-live"),
				a = e.height() - n.outerHeight(!0);
			o.is(":hidden") || (a -= 10), i.height(a), t.tinyscrollbar_update()
		},
		resetSllDelay: function(t) {
			var i = this;
			i.resetSll(), e.isFunction(t) && t()
		},
		resetSllBot: function() {
			var t = parseInt(e("#left").css("top")) || 0,
				i = e(window).height() - t,
				n = this.config.$el,
				o = this.config.$sll,
				a = n.find(".left-big .b-content"),
				r = n.find(".left-footer"),
				s = r.find(".btn-live"),
				l = i - r.outerHeight(!0);
			s.is(":hidden") || (l -= 10), a.height(l), o.tinyscrollbar_update(0)
		},
		resetSllBotDelay: function() {
			this.config.isOpenCalced = !0, setTimeout(e.proxy(this.resetSllBot, this), 500)
		},
		renderApply: function() {
			var e = a.check(),
				t = o.get("sys.own_room"),
				i = this.config.$el.find(".left-big .btn-live a");
			e && "1" === t ? (i.attr({
				href: "/room/my",
				title: "直播设置"
			}), i.find("span").text("直播设置")) : (i.attr({
				href: "/special/guide/anchor",
				title: "我要直播",
				target: "_blank"
			}), i.find("span").text("我要直播"))
		},
		renderApplyDelay: function() {
			setTimeout(e.proxy(this.renderApply, this), 500)
		},
		open: function() {
			var t = e(window),
				i = t.height(),
				n = this;
			this.config.state = c.left.state.open, this.save(), this.config.$root.removeClass("left-menu-small"), !this.config.isOpenCalced && 768 > i ? (this.resetSllDelay(function() {
				n.resetSllBotDelay()
			}), this.config.isOpenCalced = !0) : this.resetSllBotDelay(), this.observer.trigger("toggle", this.config.state)
		},
		check: function() {
			var e = n.get(c.left.storageName);
			null !== e && (e = parseInt(e, 10), 0 === e && this.close())
		},
		checkDelay: function() {
			setTimeout(e.proxy(this.check, this), 500)
		},
		close: function() {
			this.config.state = c.left.state.close, this.save(), this.config.$root.addClass("left-menu-small"), this.observer.trigger("toggle", this.config.state)
		},
		closeDelay: function() {
			setTimeout(e.proxy(this.close, this), 300)
		},
		toggle: function() {
			this.config.state === c.left.state.open ? this.close() : this.open(), d.set(c.left.positionStorageName, 0)
		},
		save: function() {
			var e = this.config.state === c.left.state.open ? 1 : 0;
			n.set(c.left.storageName, e)
		},
		openColMenu: function(e) {
			var t = this.config.$cols,
				i = t.find("dt"),
				n = t.find("dd"),
				o = i.eq(e),
				a = n.eq(e);
			if (i.removeClass("cur"), o.addClass("cur"), 0 === e) {
				var r = a.data("height");
				r ? a.height(r).show() : (a.show(), a.data("height", a.height()))
			} else {
				var s = n.eq(0),
					l = s.data("height");
				n.each(function(e) {
					return 0 === e ? !0 : void n.eq(e).hide()
				}), s.height(l - a.height() / 2), a.show()
			}
			0 !== e && this.resetSllBot()
		},
		openCurColMenu: function() {
			var e = this.config.$cols.find("dd li a.current");
			if (!e.length) return void this.openColMenu(0);
			var t = e.closest("dd");
			index = t.data("index"), index && this.openColMenu(index)
		},
		screenMedia: function(t) {
			var i = e(window),
				o = e("#header"),
				a = this.config.$el,
				r = a.find(".left-footer .btn-live"),
				s = (a.height(), i.width()),
				l = i.height(),
				d = o.outerHeight(!0),
				u = this;
			if (768 > l ? (this.resetSllDelay(function() {
				u.resetSllBotDelay()
			}), this.adjustScreen("small")) : (r.show(), this.adjustScreen("big"), this.resetSllDelay(function() {
				u.resetSllBotDelay()
			})), a.css("height", l - d), !t && 1340 > s) {
				var f = n.get(c.left.storageName);
				if (1 === f) return;
				this.closeDelay()
			}
		},
		adjustScreen: function(e) {
			var t = this.config.$el.find(".channel-cate li, .channel-cate li a"),
				i = (t.height(), this.config.$el.find(".left-footer")),
				n = i.find(".btn-wrap");
			try {
				"small" === e && (t.addClass("channel-catelist-resize"), i.find(".f-other li").addClass("footer-otherlist-resize"), n.hide()), "big" === e && (t.removeClass("channel-catelist-resize"), i.find(".f-other li").removeClass("footer-otherlist-resize"), n.show())
			} catch (o) {}
		},
		calculateThumbPosition: function(e) {
			var t = 0;
			try {
				var i = parseInt(e.find(".thumb").css("top"), 10);
				if (0 === i) return i;
				var n = e.find(".viewport").prop("offsetHeight"),
					o = e.find(".overview").prop("scrollHeight"),
					a = n,
					r = Math.min(a, a * (n / o)),
					s = (o - n) / (a - r);
				t = i * s, isFinite(t) || (t = 0), t = Math.ceil(t)
			} catch (l) {}
			return t
		},
		handleThumbPosition: function(e) {
			var t = this;
			if (e) try {
				setTimeout(function() {
					t.config.$sll.tinyscrollbar_update(e)
				}, 500)
			} catch (i) {} else {
				var n = this.calculateThumbPosition(this.config.$el.find("#left-big-scroll"));
				d.set(c.left.positionStorageName, n)
			}
		},
		reScrollThumbPosition: function() {
			var e = d.get(c.left.positionStorageName);
			e = parseInt(e, 10), !isNaN(e) && e > 0 && this.handleThumbPosition(e)
		},
		renderMyFavoriteCateList: function() {
			var e = this.config.$el.find('.leftnav-cate .r-tit ul li[data-item="发现"]');
			e.hasClass("cur") && this.loadMyFavoriteCateList()
		},
		setMyFavoriteCateList: function() {
			var e = this.config.$recs.find("dd.js-myfavorite-con"),
				t = e.data("tag_id");
			"0" !== t && (e.find("ul li a").removeClass("current"), e.find("ul li a[data-tag_id=" + t + "]").addClass("current"))
		},
		getDateWithNoSeconds: function() {
			var e = new Date;
			return e.getFullYear() + "" + (e.getMonth() + 1) + e.getDate() + e.getHours() + e.getMinutes()
		},
		loadMyFavoriteCateList: function() {
			var t = this,
				i = "";
			e.ajax({
				url: "/member/myfavorite/getCateList",
				type: "GET",
				cache: !0,
				data: {
					v: t.getDateWithNoSeconds()
				},
				dataType: "json",
				success: function(n) {
					n.length > 0 && (e.each(n, function(e, t) {
						var n = ['<li><a title="', t.tag_name, '" href="', t.url + "?is_hot=1", '" data-tag_id="', t.tag_id, '">', t.tag_name, "</a></li>"].join("");
						i += n
					}), t.config.$recs.find("dd.js-myfavorite-con ul").empty().append(i), t.setMyFavoriteCateList(), c.left.isLoadFavorite = 1)
				}
			})
		},
		bindEvt: function() {
			function t(e) {
				e.stopPropagation(), e.preventDefault()
			}
			function i() {
				n.config.state = c.left.state.open, n.save()
			}
			var n = this,
				o = this.config.$el;
			o.on("click", ".left-big .follow", function(e) {
				t(e);
				var n = a.check(),
					o = "/directory/myFollow";
				n ? (i(), location.href = o) : a.show("login", {
					redirect: o,
					source: "click_leftnavi_follow"
				})
			}), o.on("click", ".left-small .follow", function(e) {
				t(e);
				var i = a.check(),
					n = "/directory/myFollow";
				i ? location.href = n : a.show("login", {
					redirect: n
				})
			}), o.on("click", ".left-btn", function() {
				n.toggle()
			}), o.on("click", ".leftnav-cate .r-tit ul li", function() {
				var t = e(this),
					i = t.index();
				t.siblings("li").removeClass("cur"), t.addClass("cur"), 0 === i ? (n.config.$cols.removeClass("hide"), n.config.$recs.addClass("hide"), n.openCurColMenu()) : (n.config.$cols.addClass("hide"), n.config.$recs.removeClass("hide")), n.config.$sll.tinyscrollbar_update()
			}), o.on("click", '.leftnav-cate .r-tit ul li[data-item="发现"]', function() {
				c.left.isLoadFavorite < 1 && n.loadMyFavoriteCateList()
			}), o.on("click", ".left-small .small-nav ul li", function(t) {
				"游戏" !== e.trim(e(this).text()) && !e(this).hasClass("follow")
			}), o.on("mousedown", ".leftnav-cate .column-cont dt, .leftnav-cate .column-cont dd li, .channel-cate li, .leftnav-cate .r-tit ul li, .recommendHos ul li, .leftnav-cate .recom-cont ul li", function(e) {
				n.handleThumbPosition()
			});
			var r = e(".leftnav-cate .column-cont [data-left-item]");
			r.on("mouseenter", function() {
				var t = e(this);
				if (!t.hasClass("cur")) {
					var i = t.attr("data-left-item"),
						n = e("[data-left-item=" + i + "]");
					n.css({
						background: "#272727"
					}), n.eq(0).find("span").css({
						color: "#f60"
					})
				}
			}), r.on("mouseleave", function() {
				var t = e(this);
				if (!t.hasClass("cur")) {
					var i = t.attr("data-left-item"),
						n = e("[data-left-item=" + i + "]");
					n.eq(0).find("span").css({
						color: "#c6c6c6"
					}), n.css({
						background: "#2c2c2c"
					})
				}
			});
			var s = 0;
			e(window).resize(function() {
				clearTimeout(s), s = setTimeout(function() {
					n.config.isOpenCalced = !1, n.screenMedia()
				}, 60)
			})
		}
	});
	var u = function() {
			s = new l
		};
	return e(u), {
		onToggle: function(e) {
			s && s.observer.on("toggle", e)
		}
	}
}), define("douyu/com/flash-check", ["jquery", "shark/ext/swfobject"], function(e, t) {
	var i = {
		flashEnable: !1,
		check: function(e) {
			i.checkFlashInstall(e);
			var t = Math.floor(3 * Math.random()) + 10;
			setTimeout(function() {
				i.showFlashEnableTips(e)
			}, 1e3 * t)
		},
		checkFlashInstall: function(n) {
			var o = e(n).find(".flash-version-tips");
			if (!(i.flashEnable === !0 || o.length > 0)) {
				var a = /chrome/i.test(navigator.userAgent);
				if (!a) {
					var r = t.getFlashPlayerVersion(),
						s = "";
					r && 0 !== r.major ? r && r.major < 15 && (s = "您的flash版本过低，") : s = "您尚未安装flash，", "" !== s && (o = ['<div class="flash-version-tips">', '<div class="flash-tips-cover"></div>', '<div class="flash-tips-close">&times</div>', '<p class="flash-tips-text">', "您尚未安装 / 启用flash，无法正常播放，请查看", '<a href="http://www.adobe.com/go/getflashplayer" target="_blank" class="flash-get-link">安装教程</a>', '/<a href="https://www.douyu.com/cms/gong/201712/19/6921.shtml" target="_blank" class="flash-get-link">启用教程</a>', "</p>", '<p class="flash-tips-text">（安装 / 设置完成后，请重启浏览器）</p></div>', "</div>"].join(""), e(n).append(o))
				}
			}
		},
		showFlashEnableTips: function(t) {
			var n = e(t).find(".flash-version-tips");
			i.flashEnable === !0 || n.length > 0 || (n = ['<div class="flash-version-tips">', '<div class="flash-tips-cover"></div>', '<div class="flash-tips-close">&times</div>', '<p class="flash-tips-text">', "您尚未启用flash，无法正常播放，请点击", '<a href="https://www.douyu.com/cms/gong/201712/19/6921.shtml" target="_blank" class="flash-get-link">flash启用教程</a>', "</p>", '<p class="flash-tips-text">（设置完成后，请重启浏览器）</p></div>', "</div>"].join(""), e(t).append(n))
		},
		clearFlashTips: function() {
			e(".flash-version-tips").remove()
		},
		bindEvent: function() {
			e("#container").on("click", ".flash-tips-close", function() {
				e(this).closest(".flash-version-tips").remove()
			})
		},
		init: function() {
			window.flash_load_success = function(e) {
				i.flashEnable = !0, i.clearFlashTips()
			}, i.bindEvent()
		}
	};
	return i.init(), i
}), define("douyu/com/insight", ["jquery"], function(e) {
	return function(e, t, i, n) {
		var o, a = e(t),
			r = 0,
			s = 0,
			l = 0,
			c = 0,
			d = null;
		e.fn.insight = function(g) {
			function m() {
				var i = 0;
				o = e(y.container), y.container === n || y.container === t ? (o = e(t), r = 0, s = 0) : (r = o.offset().top, s = o.offset().left), l = o.width(), c = o.height(), v.each(function() {
					var t = e(this);
					if ((!y.skip_invisible || t.is(":visible")) && !this.loaded) if (h(this, y) || p(this, y));
					else if (u(this, y) || f(this, y)) {
						if (++i > y.failure_limit) return !1
					} else this.loaded || (t.trigger("insight"), i = 0, this.loaded = !0)
				})
			}
			var v = this,
				y = {
					threshold: 0,
					event: "scroll",
					container: t,
					data_attribute: "original",
					skip_invisible: !0,
					appear: null,
					load: null
				};
			return g && (n !== g.failurelimit && (g.failure_limit = g.failurelimit, delete g.failurelimit), n !== g.effectspeed && (g.effect_speed = g.effectspeed, delete g.effectspeed), e.extend(y, g)), o = y.container === n || y.container === t ? a : e(y.container), 0 === y.event.indexOf("scroll") && o.bind(y.event, function() {
				"lazy" === y.mode ? (d && clearTimeout(d), d = setTimeout(function() {
					m(), d = null
				}, 0)) : m()
			}), this.one("insight", function() {
				if (!this.loaded) {
					if (y.appear) {
						var t = v.length;
						y.appear.call(this, t, y), e(this).trigger("insighted")
					}
					this.loaded = !0
				}
			}), a.unbind("resize.insight").bind("resize.insight", function() {
				d && clearTimeout(d), d = setTimeout(function() {
					m(), d = null
				}, 200)
			}), e(i).off("scroll.insight").on("scroll.insight", function() {
				d && clearTimeout(d), d = setTimeout(function() {
					m(), d = null
				}, 200)
			}), /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) && a.bind("pageshow", function(t) {
				t.originalEvent && t.originalEvent.persisted && v.each(function() {
					e(this).trigger("insight")
				})
			}), e(i).ready(function() {
				m()
			}), this
		};
		var u = function(i, o) {
				var s, l = e(i);
				return s = o.container === n || o.container === t ? (t.innerHeight ? t.innerHeight : a.height()) + a.scrollTop() : r + c, s <= l.offset().top - o.threshold
			},
			f = function(i, o) {
				var r, c = e(i);
				return r = o.container === n || o.container === t ? a.width() + a.scrollLeft() : s + l, r <= c.offset().left - o.threshold
			},
			h = function(i, o) {
				var s, l = e(i);
				return s = o.container === n || o.container === t ? a.scrollTop() : r, s >= l.offset().top + o.threshold + l.height()
			},
			p = function(i, o) {
				var r, l = e(i);
				return r = o.container === n || o.container === t ? a.scrollLeft() : s, r >= l.offset().left + o.threshold + l.width()
			},
			g = function(e, t) {
				return !(f(e, t) || p(e, t) || u(e, t) || h(e, t))
			};
		e.extend(e.expr[":"], {
			"below-the-fold": function(e) {
				return u(e, {
					threshold: 0
				})
			},
			"above-the-top": function(e) {
				return !u(e, {
					threshold: 0
				})
			},
			"right-of-screen": function(e) {
				return f(e, {
					threshold: 0
				})
			},
			"left-of-screen": function(e) {
				return !f(e, {
					threshold: 0
				})
			},
			"in-viewport": function(e) {
				return g(e, {
					threshold: 0
				})
			},
			"above-the-fold": function(e) {
				return !u(e, {
					threshold: 0
				})
			},
			"right-of-fold": function(e) {
				return f(e, {
					threshold: 0
				})
			},
			"left-of-fold": function(e) {
				return !f(e, {
					threshold: 0
				})
			}
		})
	}(e, window, document), {
		build: function(e) {
			e = $.extend({
				selectors: "[data-dysign]"
			}, e), $(e.selectors).insight(e)
		}
	}
}), define("douyu/com/imgp", ["jquery", "douyu/com/insight"], function(e, t) {
	return {
		build: function(e) {
			var i = $.extend({
				mode: "lazy",
				selectors: "img[data-original]",
				appear: function(e, t) {
					var i = this,
						n = $(this),
						o = new Image,
						a = $.trim(n.attr("src"));
					o.onload = function() {
						var e = n.attr("data-" + t.data_attribute);
						n.hide(), n.is("img") ? n.attr("src", e) : n.css("background-image", 'url("' + e + '")'), n.show()
					}, o.onerror = function() {
						return "" === a && (a = $SYS.web_url + "app/douyu/res/page/list-item-def-thumb.gif"), i.src = a, this.onerror = null, !0
					}, o.src = n.attr("data-" + t.data_attribute)
				}
			}, e);
			t.build(i)
		}
	}
}), define("douyu/com/sign", ["jquery", "shark/class", "shark/observer", "shark/util/lang/1.0", "shark/util/ready/1.0", "shark/util/flash/bridge/1.0", "shark/util/flash/data/1.0", "shark/ext/swfobject", "douyu/context", "douyu/com/insight", "douyu/com/imgp"], function(e, t, i, n, o, a, r, s, l, c, d) {
	function u() {
		try {
			T.clean()
		} catch (e) {
			window.console && console.error(e)
		}
		0 === f.sign.render_count ? (f.sign.render_count = 0, T.completeCallback()) : f.sign.render_count++, _.length || (f.sign.render_count = 0, T.completeCallback()), d.build()
	}
	var f = {
		adVersion: "1103",
		sign: {
			id_pre: "dysign-",
			dom_prop: "data-dysign",
			render_count: 0
		},
		aop: {
			optype: {
				remove: "remove"
			},
			view: "view",
			clean: "clean",
			complete: "complete"
		},
		showAdPos: []
	},
		h = {},
		p = $SYS.sign_newver ? $SYS.sign_newver : !1,
		g = 0,
		m = 0,
		v = 0;
	try {
		window.$ROOM ? (g = $ROOM.room_id, m = $ROOM.category_id, v = $ROOM.cate_id) : window.$PAGE && (g = 0, m = $PAGE.cate1_id, v = $PAGE.cate2_id)
	} catch (y) {
		window.console && console.log(y)
	}
	var _ = window._pageadvar || [];
	window._pageadvar = _;
	var b = [30012, 30014],
		w = [30009, 10020, 10010, 10014],
		k = [],
		x = function() {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(e) {
				window.setTimeout(e, 1e3 / 60)
			}
		}(),
		C = {
			elementSign: function(t) {
				return e(t).attr(f.sign.dom_prop)
			},
			pageSigns: function() {
				var t, i = [];
				return e("[" + f.sign.dom_prop + "]").each(function() {
					t = C.elementSign(this), i.push(t)
				}), i
			},
			innerPath: function(e) {
				return 0 === e.indexOf("http://") || 0 === e.indexOf("https://") ? e = e.replace(/https?:/, "") : 0 === e.indexOf("webpic_resources/") || 0 === e.indexOf("/webpic_resources/") ? l.get("sys.sign_url") + e : l.get("sys.upload_url") + e
			},
			innerLink: function(e) {
				return e && e.link ? p || e.isthird && 0 != e.isthird ? e.link : n.string.format("/lapi/sign/signapi/click?roomid={0}&aid={1}&posid={2}&projid={3}", l.get("room.room_id") || 0, e.adid || 0, e.posid || 0, e.proid || 0) : "/"
			},
			buildSignClickData: function(e) {
				var t = {
					ver: f.adVersion || 0,
					mid: e.mid,
					gid: e.gid,
					posid: e.posid,
					rid: g || 0,
					cid: e.cid,
					proid: e.proid,
					oaid: e.oaid
				};
				return e.isthird && (t.isthird = e.isthird, t.taid = e.taid, t.tpid = e.tpid, t.tmid = e.tmid, t.ext = JSON.stringify(e.ext)), t
			},
			buildSignApi: function(e) {
				var t = {
					ver: f.adVersion || 0,
					roomid: g,
					cate1: m,
					cate2: v,
					posid: e,
					uid: $SYS.uid
				};
				return t
			},
			pushPageAdvar: function(e) {
				if (e && 0 !== e.length) if ("[object Array]" === Object.prototype.toString.apply(e) && e.length > 0) for (var t = 0; t < e.length; t++) C.pushDataInPage(e[t]);
				else C.pushDataInPage(e)
			},
			pushDataInPage: function(e) {
				if (e) {
					for (var t = e.posid, i = !0, n = 0; n < _.length; n++) if (_[n] && t == _[n].posid) {
						if (_[n].isthird) _.splice(n, 1);
						else {
							i = !1;
							for (var o = 0; o < b.length; o++) if (b[o] == t) {
								i = !0;
								break
							}
						}
						break
					}
					i && _.push(e)
				}
			},
			getTextAdInfo: function(e, t, i) {
				var n = {};
				if (_) for (var o = 0; o < _.length; o++) _[o].posid == e && _[o].gid == t && _[o].mid == i && (n = _[o]);
				return n
			},
			getAdInfoInData: function(e) {
				var t;
				if (e) return t = j.cache[e], t || (t = C.getDataInPageAdvar(e) || {}), t
			},
			getDataInPageAdvar: function(e) {
				var t = {};
				if (_) for (var i = 0; i < _.length; i++) _[i].posid == e && (t = _[i]);
				return t
			},
			buildTextRptvData: function(e, t) {
				var i = [];
				if (t.find(".room-dysign").length > 0) for (var n = 0; n < _.length; n++) if (_[n].posid == e) {
					var o = {};
					p ? (o = {
						mid: _[n].mid,
						posid: _[n].posid,
						gid: _[n].gid,
						rid: g,
						cid: _[n].cid,
						proid: _[n].proid,
						oaid: _[n].oaid,
						i_track_url: _[n].i_track_url
					}, _[n].isthird && (o.isthird = _[n].isthird, o.taid = _[n].taid, o.tpid = _[n].tpid, o.tmid = _[n].tmid, o.ext = JSON.stringify(_[n].ext))) : "" !== _[n].adid && "" !== _[n].proid && (o = {
						adid: _[n].adid,
						posid: _[n].posid,
						proid: _[n].proid,
						roomid: g,
						ext: JSON.stringify(_[n].ext)
					}), i.push(o)
				}
				return i
			},
			setSignNormalImg: function(t, i, n) {
				for (var o = parseInt(t.id, 10), a = !1, r = 0; r < i.length; r++) i[r] == o && (a = !0);
				if (o && a) {
					var s = e(t.el ? t.el : '[data-dysign="' + o + '"]'),
						l = C.getAdInfoInData(o),
						c = "";
					if ((e.isEmptyObject(l) || l.isthird) && 0 === s.find(".dysign-normal-img").length && !l.srcid) {
						switch (n) {
						case "index-news":
							21 != o && 22 != o || (o = 21), c = e('<img class="dysign-normal-img" data-original="' + $SYS.web_url + "app/douyu/res/sign/index_news_" + o + '.jpg" style="display:inline-block;width:100%;height:100%"/>');
							break;
						case "index-row3":
							c = e('<img class="dysign-normal-img" data-original="' + $SYS.web_url + 'app/douyu/res/sign/index_row3.jpg" style="display:inline-block;width:100%;height:100%"/>');
							break;
						case "index-hotrec":
							c = e('<img class="dysign-normal-img" data-original="' + $SYS.web_url + 'app/douyu/res/sign/index_hotrec.jpg" style="display:inline-block;width:100%;height:100%"/>');
							break;
						case "index-theatre":
							c = e('<p><span class="theatre-left"><img class="dysign-normal-img" data-original="' + $SYS.web_url + 'app/douyu/res/sign/index_theatre.jpg" style="display:inline-block;width:100%;height:100%"/><a class="ish"></a></span></p>');
							break;
						case "index-dysign":
							c = e('<img class="dysign-normal-img" data-original="' + $SYS.web_url + 'app/douyu/res/sign/index_dysign.jpg" style="display:inline-block;width:100%;height:100%"/>');
							break;
						case "room-dysign":
							c = e('<img data-adid="' + o + '" class="dysign-normal-img" data-original="' + $SYS.web_url + 'app/douyu/res/sign/room_dysign.jpg" style="display:inline-block;width:100%;height:100%"/>')
						}
						s.html(c), d.build()
					}
				}
			}
		},
		S = {
			build: function() {
				var t = e("[data-dysign]"),
					i = "",
					n = "";
				_.length ? j.response(_) : (i = this.getAjaxPosList(t, _).join(","), i && j.getAjaxPosListData(i)), n = this.getAjaxPosList(t, _, !0).join(","), n && j.getAjaxPosListData(n), "" == n && "" == i && (f.sign.render_count = 0, T.completeCallback()), j.exposureAdNew()
			},
			getAjaxPosList: function(t, i, n) {
				for (var o = [], a = 0, r = t.length; r > a; a++) {
					var s = e(t[a]),
						l = s.attr("data-dysign") - 0;
					if (s.attr("data-dysign-show")) f.showAdPos.push(l);
					else {
						for (var c = !1, d = {}, u = 0, h = i.length; h > u; u++) l === i[u].posid - 0 && (c = !0, d = i[u], d.isthird > 0 && (c = !1));
						c || (d.isthird > 0 ? n && o.push(l) : n || o.push(l))
					}
				}
				return o
			}
		},
		j = {
			cache: {},
			request: function(e, t) {
				this.getAjaxPosListData(e)
			},
			response: function(e) {
				e && T.render(e)
			},
			getAjaxPosListData: function(t, i) {
				var n = this;
				getUrl = "/japi/sign/web/getinfo";
				var o = C.buildSignApi(t);
				e.ajax({
					url: getUrl,
					type: "POST",
					data: o,
					dataType: "json",
					success: function(t) {
						0 === t.error ? (C.pushPageAdvar(t.data), e.isFunction(i) ? i(t.data) : n.response(t.data)) : (f.sign.render_count = 0, T.completeCallback())
					},
					error: function() {
						f.sign.render_count = 0, T.completeCallback(), d.build()
					}
				})
			},
			exposureAdNew: function() {
				var t = [],
					i = [],
					n = null,
					o = 500,
					a = 0,
					r = 0,
					s = null;
				c.build({
					appear: function() {
						t.push(e(this)), n && clearTimeout(n), n = setTimeout(function() {
							for (a = 0, r = t.length; r > a; a++) {
								s = t[a];
								var n = s.attr("data-dysign") || "",
									o = {},
									l = [],
									c = C.getAdInfoInData(n),
									d = c.mid,
									u = c.gid,
									m = c.adid || "",
									v = c.proid || "";
								if (-1 !== e.inArray(parseInt(n, 10), b) ? l = C.buildTextRptvData(n, s) : "" != n && c.posid && (p ? (o = {
									mid: d,
									posid: n,
									gid: u,
									rid: g,
									cid: c.cid,
									proid: c.proid,
									oaid: c.oaid
								}, c.isthird && (o.isthird = c.isthird, o.taid = c.taid, o.tpid = c.tpid, o.tmid = c.tmid, o.ext = JSON.stringify(c.ext))) : "" != m && "" != v && (o = {
									adid: m,
									posid: n,
									proid: v,
									roomid: g,
									ext: JSON.stringify(c.ext)
								}), c.i_track_url && c.i_track_url.length > 0 && h.exposureAd(c)), e.isEmptyObject(o) || i.push(o), l.length > 0) {
									for (var y = 0; y < l.length; y++) {
										var _ = l[y];
										_.i_track_url && _.i_track_url.length > 0 && h.exposureAd(_), delete l[y].i_track_url
									}
									i = i.concat(l)
								}
							}
							if (i.length) {
								var w = "/lapi/sign/signapi/rtpv",
									k = {
										data: JSON.stringify(i)
									};
								p && (w = "/lapi/sign/web/rtpv", k.ver = f.adVersion), e.ajax({
									url: w,
									type: "POST",
									dataType: "json",
									data: k,
									success: function() {}
								}), t = [], i = []
							}
						}, o)
					}
				})
			}
		};
	h = {
		exposureAd: function(t) {
			var i = t.i_track_url;
			i && i.length > 0 && e.each(t.i_track_url, function(e, t) {
				h.insight(t)
			})
		},
		init: function() {
			e("#container").on("click", "[data-dysign] img", function() {
				var t = e(this).closest("[data-dysign]").data("dysign");
				i.trigger("mod.sign.dot", t)
			}), window.monitorSignImage = {}
		},
		insight: function(e) {
			var t = "t_" + (new Date).getTime() + 1e5 * Math.random();
			t = t.slice(0, 20);
			var i = this.transformUrl(e, t),
				n = window.monitorSignImage[t] = new Image;
			n.onload = n.onerror = function() {
				delete window.monitorSignImage[t], n = null
			}, n.src = i
		},
		transformUrl: function(e, t) {
			var i = e,
				n = "iehash=",
				o = e.indexOf("?") > 0 ? "&" : "?",
				a = navigator.userAgent.toLowerCase();
			return (a.indexOf("trident") > 0 || a.indexOf("msie") > 0 || a.indexOf("edge") > 0) && (i = e + o + n + t), i
		}
	};
	var T = {
		render: function(t) {
			var i, n, o, a = T.render.ways,
				r = a["default"];
			try {
				for (var s = 0, l = t.length; l > s; s++) {
					i = t[s], o = !1;
					for (var c in a) if (n = a[c], "default" !== c && n(i) === !0) {
						o = !0;
						break
					}
					j.cache[i.posid] = i, -1 === e.inArray(parseInt(i.posid, 10), w) && o !== !0 && k.push(i)
				}
			} catch (d) {
				window.console && console.error(d)
			}
			if (k.length > 0) for (var s = 0, l = k.length; l > s; s++)!
			function(e) {
				x(function() {
					r(k[e]), l - e === 1 && u()
				})
			}(s);
			else u()
		},
		clean: function() {
			var t, i, n, o, a, r = T.clean.ways,
				s = r["default"],
				l = e("[" + f.sign.dom_prop + "]");
			l.each(function(e) {
				t = l.eq(e), i = t.attr(f.sign.dom_prop), a = !1;
				for (var c in r) if (n = r[c], o = {
					id: i,
					el: t.get(0)
				}, "default" !== c && n(o) === !0) {
					a = !0;
					break
				}
				a !== !0 && s(o)
			})
		}
	};
	T.render.reg = function(e, t) {
		"default" !== e && (T.render.ways[e] = t)
	}, T.render.remove = function(e) {
		if ("default" !== e) {
			var t = {},
				i = T.render.ways;
			for (var n in i) e !== n && (t[n] = i[n]);
			T.render.ways = t
		}
	}, T.clean.reg = function(e, t) {
		"default" !== e && (T.clean.ways[e] = function(e) {
			x(function() {
				t(e)
			})
		})
	}, T.clean.remove = function(e) {
		if ("default" !== e) {
			var t = {},
				i = T.clean.ways;
			for (var n in i) e !== n && (t[n] = i[n]);
			T.clean.ways = t
		}
	}, T.render.ways = {
		"default": function(t) {
			var i, o, a, r, c, d = n.string.format;
			if (t.srcid && (j.cache[t.posid] = t, i = '[data-dysign="' + t.posid + '"]', c = e(i), c.length)) {
				c.empty(), 1 == t.priority && ("static" == c.css("position") && c.css("position", "relative"), c.append('<i class="sign-spec"></i>')), c.attr({
					"data-dysign-mid": t.mid,
					"data-dysign-gid": t.gid
				}), a = C.innerLink(t), t.srcid.indexOf(".swf") > 0 ? (r = {
					id: f.sign.id_pre + t.posid,
					cover: l.get("sys.web_url") + "app/douyu/res/flash/swfcover.gif?v=180115",
					path: C.innerPath(t.srcid),
					params: {
						wmode: "opaque",
						menu: "false",
						allowFullScreen: "false",
						AllowScriptAccess: "never"
					}
				}, o = d('<div id="{0}"></div>', r.id)) : o = d('<img data-original="{0}" style="display: inline-block; width:100%; height:100%">', C.innerPath(t.srcid));
				var u = 0;
				if (t.ec) {
					if ("object" != typeof t.ec) try {
						t.ec = JSON.parse(t.ec)
					} catch (h) {
						t.ec = {}
					}
				} else t.ec = {};
				if (t.showtime = parseInt(t.ec.showtime, 10) || 0, t.showtime && setTimeout(function() {
					c.remove()
				}, 1e3 * t.showtime), u = t.ec.innerlink || 0, r && u - 0 == 1) {
					o = d('<div id="{0}"></div>', r.id), c.append(o);
					var m = t.srcid;
					return p || (m = "/lapi/sign/signapi/click?roomid=" + g + "&aid=" + t.adid + "&posid=" + t.posid + "&projid=" + t.proid + "&callback=1"), m = escape(m), void s.embedSWF(r.path, r.id, "100%", "100%", "9.0.0", null, {
						adcl: m
					}, r.params)
				}
				var v = l.get("sys.web_url") + "app/douyu/res/flash/swfcover.gif?v=180115";
				c.is("a") ? c.prop("href", a).prop("href", "_blank") : o = r ? d('<a href="{0}" target="_blank" style="position: relative; display: block;width: 100%;height: 100%;">{1}<img data-original="' + v + '" width="100%" height="100%" style="position: absolute;top: 0;left: 0;z-index: 10;" onclick="this.parentNode.click(); return false;" /></a>', a, o) : d('<a href="{0}" target="_blank">{1}</a>', a, o), c.append(o), r && s.embedSWF(r.path, r.id, "100%", "100%", "9.0.0", null, null, r.params)
			}
		}
	}, T.clean.ways = {
		"default": function(e) {}
	}, T.completeCallback = function() {};
	var I = function(t) {
			var i = [].slice.call(arguments, 1);
			t === f.aop.view && (i[0] === f.aop.optype.remove ? T.render.remove(i[1]) : T.render.reg(i[0], i[1])), t === f.aop.clean && (i[0] === f.aop.optype.remove ? T.clean.remove(i[1]) : T.clean.reg(i[0], i[1])), t === f.aop.complete && (T.completeCallback = e.isFunction(i[0]) ? i[0] : T.completeCallback)
		};
	return e(function() {
		h.init()
	}), i.on("mod.sign.dot", function(t, i) {
		var n = i || C.getAdInfoInData(t),
			o = C.buildSignClickData(n);
		n && n.c_track_url && n.c_track_url.length > 0 && e.each(n.c_track_url, function(e, t) {
			h.insight(t)
		}), p && o.posid && e.ajax({
			url: "/lapi/sign/web/click",
			type: "post",
			data: o
		})
	}), {
		request: function(e) {
			j.request(e)
		},
		requestPage: function() {
			S.build()
		},
		exposure: function() {
			j.exposureAdNew()
		},
		response: j.response,
		getAdInfo: j.getAjaxPosListData,
		helper: {
			exposure: h.exposureAd,
			innerPath: C.innerPath,
			innerLink: C.innerLink,
			getTextAdInfo: C.getTextAdInfo,
			pushPageAdvar: C.pushPageAdvar,
			buildSignClickData: C.buildSignClickData,
			buildSignApi: C.buildSignApi,
			setSignNormalImg: C.setSignNormalImg,
			getAdInfoInData: C.getAdInfoInData,
			defview: T.render.ways["default"]
		},
		aop: I
	}
}), define("douyu/com/search-suggest", ["jquery", "douyu/com/imgp", "shark/observer", "douyu/com/sign", "shark/util/template/1.0", "shark/util/cookie/1.0", "shark/util/storage/1.0"], function(e, t, i, n, o, a, r) {
	var s, l = "search-source-own",
		c = "search-source-hotest",
		d = {
			own: [],
			hot: [],
			hotSource: []
		},
		u = {
			getSearchCache: function(e) {
				var t = r.get("searchPageCacheKey");
				if (e || !t) {
					var i = (+new Date + "").slice(-8),
						n = $SYS.uid || u.getRandomWords(8),
						o = u.getRandomWords(6);
					sid = [n, i, o].join("-"), t = {
						sid: sid,
						colligate: 0,
						live: 0,
						anchor: 0,
						video: 0
					}, r.set("searchPageCacheKey", t)
				}
				return t
			},
			getRandomWords: function(e) {
				for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i = []; i.length < e;) {
					var n = Math.floor(62 * Math.random());
					i.push(t[n])
				}
				return i.join("")
			},
			init: function() {
				var t = this;
				t.getDoms(), t.bindEvent(), t.fetch();
				var i = [];
				i = r.get(l), i && (d.own = i);
				var n = t.doms.hook.find("input"),
					o = n.attr("placeholder");
				n.removeAttr("placeholder").attr({
					autocomplete: "off",
					id: "suggest-search"
				}), t.doms.hook.append('<label class="search-placeholder" for="suggest-search">' + o + "</label>"), t.doms.hook.before('<div class="search-suggest-box hide"></div>'), t.doms.box = e(".search-suggest-box"), t.doms.adCont = e(".search-sign-cont")
			},
			fetch: function() {
				var e = this,
					t = [];
				t = e.getLocalInfo(), t && t.length ? t instanceof Array && (d.hotSource = t, e.addHotKey()) : e.getServerInfo().then(function(t) {
					t instanceof Array && (d.hotSource = t, r.set(c, t, e.getLastTime())), e.addHotKey()
				})
			},
			addHotKey: function() {
				var t = this,
					i = t.getLocalInfo(),
					n = t.doms.hook,
					o = n.find("input"),
					a = i[0];
				n.find(".search-hot-key").remove(), a ? (n.append('<label for="suggest-search" class="search-hot-key">' + a + "</label>"), o.data("search", a)) : n.addClass("status-empty"), "" !== e.trim(o.val()) && n.addClass("status-has-word")
			},
			preRender: function() {
				var e = this,
					t = [];
				t = e.getLocalInfo(), t && t.length ? t instanceof Array && (d.hotSource = t, e.update()) : e.getServerInfo().then(function(t) {
					t instanceof Array && (d.hotSource = t, r.set(c, t, e.getLastTime())), e.update()
				})
			},
			getUrlSearchWord: function() {
				var e = location.href,
					t = e.split("?"),
					i = 0;
				return e = t[0] || "", t = e.split("#"), e = t[0] || "", i = e.lastIndexOf("/"), e.substring(i + 1)
			},
			getDoms: function() {
				this.doms = {
					hook: e("#header .o-search")
				}
			},
			render: function() {
				var t = this,
					i = t.getSuggestTmpl(),
					a = d,
					r = o.compile(i),
					l = r(a);
				t.doms.box.html(l), t.doms.adContainer = e(".search-suggest-ad");
				var c = t.doms.adCont.html();
				c && t.doms.adContainer.html(c).removeClass("hide"), s || (n.exposure(), t.doms.adContainer.trigger("scroll"), s = !0)
			},
			destroy: function() {
				var e = this;
				e.doms.box.addClass("hide")
			},
			dysSearch: function(t, i, n) {
				var o;
				5 === t && (o = e.trim(e("#suggest-search").val()) || "");
				var a = this;
				DYS.sub({
					action_code: "click_topnavi_search",
					ext: {
						sid: a.getSearchCache(!0).sid,
						s_type: t,
						iw: o,
						kv: i,
						pos: n || 0
					}
				})
			},
			bindEvent: function() {
				function t() {
					var t = e(".o-search input"),
						i = 1,
						o = t.val();
					o || (o = t.data("search"), i = 2), o = e.trim(o), "" !== o && n.dysSearch(i, o)
				}
				var n = this,
					a = null;
				i.on("mod.search.cache.get", function(e) {
					return n.getSearchCache(e)
				}), e(document.body).on("click", function() {
					n.destroy()
				}), e(".head").on("click", ".search-suggest-box", function(e) {
					e.stopPropagation()
				}).on("click", ".search-suggest-box-my .search-title .search-clear", function(e) {
					e.stopPropagation(), n.clearMySource(), n.preRender()
				}).on("click", ".search-suggest-box-my .suggest-list .search-clear", function(t) {
					t.stopPropagation();
					var i = e(this),
						o = i.closest("li"),
						a = o.index();
					n.removeSource("own", a), n.preRender()
				}).on("click", ".o-search input", function(e) {
					e.stopPropagation()
				}).on("focus", ".o-search input", function() {
					"" === e.trim(e(this).val()) ? (n.doms.hook.removeClass("status-has-word"), n.preRender()) : (n.doms.hook.addClass("status-has-word"), e(this).trigger("keyup")), n.doms.hook.addClass("status-focus")
				}).on("blur", ".o-search input", function() {
					n.doms.hook.removeClass("status-focus")
				}).on("keydown", ".o-search input", function(i) {
					var o = e(this),
						r = o.val(),
						s = i.which;
					clearTimeout(a), 13 === s && (t(), n.addMySource(r), n.destroy())
				}).on("keyup", ".o-search input", function(t) {
					var i = e(this),
						r = i.val(),
						s = t.which,
						l = s >= 37 && 40 >= s || 91 === s || 123 >= s && s >= 112;
					return "" === e.trim(e(this).val()) ? n.doms.hook.removeClass("status-has-word") : n.doms.hook.addClass("status-has-word"), clearTimeout(a), n.setSearchType(1), "" === e.trim(r) ? (n.preRender(), n.doms.hook.addClass("status-has-holder"), void n.setSearchType(2)) : (l || n.doms.hook.removeClass("status-has-holder"), void(a = setTimeout(function() {
						l || n.autoSearch(r).then(function(e) {
							var t = [];
							if (e && e.autoCom && (t = e.autoCom), t = t.splice(0, 10), t.length) {
								for (var i = [], a = 0; a < t.length; a++) {
									var s = t[a].indexOf(r);
									if (s > -1) {
										var l = t[a].slice(0, s),
											c = t[a].slice(s + r.length),
											d = r;
										i[a] = {
											prefix: l,
											keyWord: d,
											suffix: c
										}
									} else i[a] = {
										prefix: t[a],
										keyWord: "",
										suffix: ""
									}
								}
								var u = n.getSearchSuggestTmpl(),
									f = o.compile(u),
									h = f({
										results: i
									});
								n.doms.box.removeClass("hide"), n.doms.box.html(h)
							} else n.destroy()
						})
					}, 300)))
				}).on("click", ".o-search .s-ico", function() {
					var t = e(".o-search input"),
						i = 1,
						o = t.val();
					o || (o = t.data("search"), i = 2), n.addMySource(o), n.destroy()
				}).on("click", ".suggest-list li .search-field", function() {
					var t = e(this),
						i = t.text(),
						o = t.closest("li"),
						a = o.index() + 1,
						r = o.hasClass("hotest-item") ? 3 : o.closest(".search-suggest-box-my").length > 0 ? 4 : 5,
						s = o.closest(".search-suggest-box-my").length > 0 ? 4 : o.closest(".search-suggest-box-hot").length > 0 ? 3 : 5;
					n.setSearchType(s), n.dysSearch(r, i, a), n.addMySource(i), n.doms.hook.find("input").val(i), n.doms.hook.addClass("status-has-word"), n.doms.hook.find(".s-ico").trigger("click")
				}).on("click", '[data-dysign="62"] img', function() {
					var t = e(this).closest("[data-dysign]").data("dysign");
					i.trigger("mod.sign.dot", t)
				}), n.doms.hook.find(".s-ico").on("mousedown", t)
			},
			autoSearch: function(t) {
				return e.ajax({
					url: "/search_info/getRecommend",
					dataType: "json",
					data: {
						kw: t
					}
				})
			},
			getSearchSuggestTmpl: function() {
				var e = ['<i class="search-tran"></i><i class="search-tran-holder"></i>', '<div class="search-suggest-box-main">', '<div class="search-suggest-box-auto">', '<div class="search-suggest-title">', '<div class="search-title">', "<span>你是不是要找</span>", "</div>", '<ul class="suggest-list">', "<%for(var i=0;i<results.length;i++){ var item = results[i];%>", "<li>", '<span class="search-field">', "<%=item.prefix%>", '<span class="key-word"><%=item.keyWord%></span>', "<%=item.suffix%>", "</span>", "</li>", "<%}%>", "</ul>", "</div>", "</div>", "</div>"];
				return e.join("")
			},
			setSearchType: function(e) {
				sessionStorage.setItem("s_type", e)
			},
			addMySource: function(t) {
				var i = this,
					n = d.own,
					o = e.trim(t);
				if ("" === o) return !1;
				for (var a = 0, s = n.length; s > a; a++) if (o === n[a]) {
					n.splice(a, 1);
					break
				}
				n.unshift(o), d.own = n, r.set(l, n), i.preRender()
			},
			clearMySource: function() {
				var e = this,
					t = [];
				d.own = t, r.set(l, t), e.preRender()
			},
			removeSource: function(e, t) {
				var i = this,
					n = d.own;
				n.splice(t, 1), d.own = n, r.set(l, n), i.preRender()
			},
			update: function() {
				var e = this;
				e.sortSource(), e.render(), d.own.length || d.hot.length ? e.doms.box.removeClass("hide") : e.doms.box.addClass("hide"), t.build()
			},
			getLastTime: function() {
				var e = new Date,
					t = new Date;
				return t.setDate(e.getDate() + 1), t.setHours(4), t.setMinutes(0), t.setSeconds(0), 600
			},
			sortSource: function() {
				var e = d.own,
					t = d.hotSource,
					i = e.length,
					n = t.length,
					o = 0;
				10 - i >= n ? o = n : (o = 10 - i, 0 >= o && (o = 0)), e = e.slice(0, 5), t = t.slice(0, 10), d.own = e, d.hot = t
			},
			getSuggestTmpl: function() {
				var e = ["<%var ownlength=own.length, hotlength=hot.length;%>", "<%if(ownlength || hotlength){%>", '<i class="search-tran"></i><i class="search-tran-holder"></i>', '<div class="search-suggest-box-main">', "<%if(ownlength){%>", '<div class="search-suggest-box-my">', '<div class="search-suggest-title">', '<div class="search-title">', '<a class="search-clear" href="javascript:;">清空</a>', "<i></i><span>最近搜索</span>", "</div>", '<ul class="suggest-list">', "<%for(var i=0;i<ownlength;i++){ var item = own[i];%>", "<li>", '<a class="search-clear" href="javascript:;">×</a>', '<span class="search-field"><%=item%></span>', "</li>", "<%}%>", "</ul>", "</div>", "</div>", "<%}%>", '<div class="search-suggest-ad hide" data-dysign="62" ></div>', "<%if(hotlength){%>", '<div class="search-suggest-box-hot">', '<div class="search-suggest-title">', '<div class="search-title">', "<i></i><span>今日热搜</span>", "</div>", '<ul class="suggest-list">', "<%for(var i=0;i<hotlength;i++){ var item = hot[i];%>", "<li ", "<%if(i<3){%>", 'class="hotest-item"', "<%}%>", ">", "<i><%=(i+1)%></i>", '<span class="search-field"><%=item%></span>', "</li>", "<%}%>", "</ul>", "</div>", "</div>", "<%}%>", "</div>", "<%}%>"];
				return e.join("")
			},
			getLocalInfo: function() {
				return r.get(c)
			},
			getServerInfo: function() {
				var t = e.ajax({
					url: "/search_info/getTop",
					dataType: "json"
				});
				return t
			}
		};
	return {
		init: function() {
			u.init()
		}
	}
}), define("douyu/com/header-dp", ["jquery", "shark/observer"], function(e, t) {
	var i = [{
		target: ".head-logo",
		description: "点击_顶部导航_logo",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_logo"
		},
		version: "2.0"
	}, {
		target: ".head-nav .index",
		description: "点击_顶部导航_首页",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_home"
		},
		version: "2.0"
	}, {
		target: ".head-nav .live",
		description: "点击_顶部导航_直播",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_live"
		},
		version: "2.0"
	}, {
		target: ".head-nav .assort .btns a",
		description: "点击_顶部导航_分类",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_class"
		},
		version: "2.0"
	}, {
		target: ".head-nav .assort .btn-all a",
		description: "点击_顶部导航_分类_更多",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_class_all"
		},
		version: "2.0"
	}, {
		target: ".head-nav .funny",
		description: "点击_顶部导航_游戏",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_game"
		},
		version: "2.0"
	}, {
		target: ".head-nav .yugou-mall",
		description: "点击_顶部导航_商城",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_yugou"
		},
		version: "2.0"
	}, {
		target: ".head-nav .yuba",
		description: "点击_顶部导航_鱼吧",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_yuba"
		},
		version: "2.0"
	}, {
		target: ".head-oth .search-title .search-clear",
		description: "点击_顶部导航_搜索_清空",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_search_clear"
		},
		version: "2.0"
	}, {
		target: ".head-oth .suggest-list .search-clear",
		description: "点击_顶部导航_搜索_删除",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_search_del",
			ext: {
				handle: function(e) {
					this.kv = e.text(), this.pos = e.closest("li").index() + 1
				}
			}
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-history .h-list li",
		description: "点击_顶部导航_历史",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_history",
			ext: {
				handle: function(e) {
					var t = e.find("a");
					this.pos = e.index() + 1, this.rid = t.data("rid")
				}
			}
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-follow .f-list li",
		description: "点击_顶部导航_关注",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_follow",
			ext: {
				handle: function(e) {
					var t = e.find("a");
					this.pos = e.index() + 1, this.rid = t.data("rid")
				}
			}
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-follow .f-all a",
		description: "点击_顶部导航_关注_全部",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_follow_all"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-broadcast",
		description: "点击_开播",
		events: "mousedown",
		config: {
			action_code: "click_openlive"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-download > a",
		description: "点击_顶部导航_下载",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_download"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-download .d-list ul li:nth-child(1) a",
		description: "点击_顶部导航_下载_app下载",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_download_app"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-download .d-list ul li:nth-child(2) a",
		description: "点击_顶部导航_下载_主播工具下载",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_download_tool"
		},
		version: "2.0"
	}, {
		target: ".head-oth .header-video-area > a",
		description: "点击_顶部导航_视频",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_video"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-unlogin .u-login",
		description: "点击_顶部导航_登录",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_login"
		},
		kernelFlag: !0,
		version: "2.0"
	}, {
		target: ".head-oth .o-unlogin .u-reg",
		description: "点击_顶部导航_注册",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_sign"
		},
		kernelFlag: !0,
		version: "2.0"
	}, {
		target: '.head-oth [data-login-user="img-href"]',
		description: "点击_顶部导航_用户图像",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_image"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .l-menu .logout",
		description: "点击_顶部导航_用户菜单_登出",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_quit"
		},
		kernelFlag: !0,
		version: "2.0"
	}, {
		target: ".head-oth .o-login .l-menu .uname-aut",
		description: "点击_顶部导航_用户菜单_实名认证",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_realverify"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .l-menu .mobile-aut",
		description: "点击_顶部导航_用户菜单_绑定手机",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_phone"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .l-menu .email-aut",
		description: "点击_顶部导航_用户菜单_绑定邮箱",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_mail"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .l-menu .r-com-btn",
		description: "点击_顶部导航_用户菜单_充值",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_pay"
		},
		kernelFlag: !0,
		version: "2.0"
	}, {
		target: ".head-oth .o-login .uim-foot .personal-center a",
		description: "点击_顶部导航_用户菜单_个人中心",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_mem"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .uim-foot .focus a",
		description: "点击_顶部导航_用户菜单_我的关注",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_follow"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .uim-foot .message a",
		description: "点击_顶部导航_用户菜单_我的消息",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_msg"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .uim-foot .live-set a",
		description: "点击_顶部导航_用户菜单_我要直播",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_live"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .task-con .task-a",
		description: "点击_顶部导航_用户菜单_充值_任务",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_pay_task"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .skill-level .promote",
		description: "点击_顶部导航_用户菜单_提升_等级",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_add_level"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .m-rank .level-con a",
		description: "点击_顶部导航_用户菜单_展示_等级",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_show_level"
		},
		version: "2.0"
	}, {
		target: ".funny .a-pop ul.btns li",
		description: "点击_顶部导航_游戏_分区",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_game_tag",
			ext: {
				handle: function(e) {
					var t = e.find("a"),
						i = e.parent().attr("data-type");
					"webgame" === i ? this.type = 1 : "mobilegame" === i && (this.type = 2), this.g_id = t.attr("data-id"), this.g_name = t.attr("data-name")
				}
			}
		},
		version: "2.0"
	}, {
		target: ".funny .a-pop .a-list .btn-all",
		description: "点击_顶部导航_游戏_更多",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_game_all",
			ext: {
				handle: function(e) {
					var t = e.attr("data-type");
					"webgame" === t ? this.type = 1 : "mobilegame" === t && (this.type = 2)
				}
			}
		},
		version: "2.0"
	}, {
		target: ".nobility-privilege .privilege-promote",
		description: "  点击_顶部导航_用户菜单_vip宣传图",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_noblepic"
		},
		version: "2.0"
	}, {
		target: ".nobility-privilege .privilege-title-buy",
		description: "点击_个人中心弹窗_续费贵族",
		events: "mousedown",
		config: {
			action_code: "click_float_renewal"
		},
		version: "2.0"
	}, {
		target: ".nobility-privilege .privilege-title-buy",
		description: "点击_顶部导航_用户菜单_续费",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_renewal"
		},
		version: "2.0"
	}, {
		target: ".nobility-privilege .privilege-more-lk",
		description: "点击_顶部导航_用户菜单_更多特权",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_morepri"
		},
		version: "2.0"
	}, {
		target: ".js_login_yes .m-wealth .y3",
		description: "点击_顶部导航_用户菜单_贵族鱼翅",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_nobleyuchi"
		},
		version: "2.0"
	}, {
		target: ".head-oth .o-login .client-sign",
		description: "点击_顶部导航_用户菜单_签到",
		events: "mousedown",
		config: {
			action_code: "click_topnavi_tab_register"
		},
		version: "2.0"
	}],
		n = {};
	e.each(i, function(t, i) {
		e(".head").on(i.events, i.target, function(t) {
			var n, o = e.extend(!0, {}, i),
				a = o.config ? o.config.ext : null,
				r = e(this);
			a && a.handle && (n = a.handle(r, t), delete a.handle), n !== !1 && (o.kernelFlag === !0 ? DYS.sub({
				kernelFlag: !0
			}, o.config) : DYS.sub(o.config))
		})
	});
	for (var o in n)!
	function(e) {
		var i = n[e];
		t.on(e, function(e) {
			i.call(this, e)
		})
	}(o);
	return {
		init: function(e) {
			DYS.sub.setPageCode(e)
		}
	}
}), define("douyu/com/verifyPhone", ["jquery", "shark/util/cookie/1.0", "shark/class"], function(e, t, i) {
	var n = i({
		init: function() {
			this.$el = '<div class="solephnoemum" > <div class="solephnoemum-cont"><p class="solephnoemum-title">温馨提示</p> <p class="solephnoemum-body">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;近期，因系统升级和改造，需要再次确认您的手机号码，手机号码是您唯一性的身份标识，为确保您可以正常享受斗鱼直播的乐趣，请及时前往个人中心进行验证。</p></div><div class="aui_buttons"><button  data-type="skip">立即验证</button>&nbsp;&nbsp;&nbsp;&nbsp;<button  data-type="close">稍后确认</button></div></div>'
		},
		check: function() {
			t.get("nickname") && !t.get("verifyPhoneNum") && t.get("phone_need_confirm") && (this.render(), this.bindEvent())
		},
		render: function() {
			e.dialog({
				content: this.$el,
				lock: !0,
				id: "checkNum",
				close: function() {
					t.set("verifyPhoneNum", "false", 86400)
				}
			})
		},
		bindEvent: function() {
			e(".aui_buttons>button[data-type='close']").on("click", function() {
				e.dialog.list.checkNum.close()
			}), e(".aui_buttons>button[data-type='skip']").on("click", function() {
				t.set("verifyPhoneNum", "false", 86400), window.location.href = "/member/cp/confirmPhone"
			})
		}
	}),
		o = new n;
	return o
}), define("douyu/com/noble-buy", ["jquery", "shark/class", "shark/observer", "shark/util/template/2.0", "shark/util/lang/1.0", "shark/util/flash/data/1.0", "shark/util/cookie/1.0", "shark/util/storage/1.0", "douyu/context", "douyu/com/user", "douyu/com/exjsonp", "douyu/page/room/base/api"], function(e, t, i, n, o, a, r, s, l, c, d, u) {
	var f = {},
		h = {
			trsKeyArr: {
				"开通通知": {
					key: "open_nofity",
					unit: ""
				},
				"开通特效": {
					key: "op_effect",
					unit: ""
				},
				"进场欢迎": {
					key: "wlcm",
					unit: ""
				},
				"贵族勋章": {
					key: "js_noble_badge",
					isYESorNO: 1,
					unit: ""
				},
				"贵族礼物": {
					key: "noble_gift",
					isYESorNO: 1,
					unit: ""
				},
				"连麦": {
					key: "link_mike",
					isYESorNO: 1,
					unit: ""
				},
				"贵族用户名片": {
					key: "js_noble_card",
					isYESorNO: 1,
					unit: ""
				},
				"升级加速": {
					key: "exp_addition",
					unit: "%"
				},
				"分区喇叭": {
					key: "speaker_number",
					isNoNmixin: 1,
					unit: ""
				},
				"贵族弹幕": {
					key: "noble_barrage",
					isYESorNO: 1,
					unit: ""
				},
				"进房间隐身": {
					key: "into_room_hide",
					isYESorNO: 1,
					unit: ""
				},
				"专属超管助手": {
					key: "super_admin_helper",
					isYESorNO: 1,
					unit: ""
				},
				"贡献榜隐身": {
					key: "top_list_hide",
					isYESorNO: 1,
					unit: ""
				},
				"防禁言": {
					key: "avoid_ban_speaking",
					isYESorNO: 1,
					unit: ""
				},
				"定制火箭": {
					key: "customize_gift",
					isYESorNO: 1,
					unit: ""
				},
				"推荐主播上热门": {
					key: "recommend_anchor",
					isYESorNO: 1,
					unit: ""
				},
				"开通价格": {
					key: "first_open_price",
					devide100: 1,
					unit: "鱼翅"
				},
				"开通即赠": {
					key: "first_remand_gold",
					devide100: 1,
					unit: "贵族鱼翅"
				},
				"续费价格": {
					key: "renew_price",
					devide100: 1,
					unit: "鱼翅"
				},
				"续费即赠": {
					key: "renew_remand_gold",
					devide100: 1,
					unit: "贵族鱼翅"
				}
			},
			totalRightsCount: 16,
			descriptions: {}
		},
		p = {
			7: {
				yw: 1500,
				exp: 50
			},
			1: {
				yw: "1万",
				exp: 500
			},
			2: {
				yw: "3万",
				exp: 1e3
			},
			3: {
				yw: "10万",
				exp: 3e3
			},
			4: {
				yw: "30万",
				exp: "1万"
			},
			5: {
				yw: "120万",
				exp: "5万"
			},
			6: {
				yw: "240万",
				exp: "10万"
			}
		},
		g = {
			status: {
				isShow: 0,
				isLoading: 0,
				isCompareRendered: 0,
				isActivityOn: 0,
				isActivityLoaded: 0,
				isActivityLoading: 0,
				currSelectedLevel: 0
			},
			htmls: {},
			init: function() {
				var t = this,
					n = l.get("room.vipId") || "";
				f = {
					webconfUrl: l.get("sys.webconfUrl"),
					resUrl: l.get("sys.resource_url"),
					getNobleInfo: "/lapi/member/api/getInfo",
					buyNobleUrl: l.get("sys.pay_site_host") + "/noble?vipId=" + n + "&",
					getNobleConf: "/noble/confignw",
					getActivityUrl: "/noble/activity",
					storeName: "is-noble-buy-activity11-show"
				}, f.descsUrl = f.webconfUrl + "resource/noble/copywriting/web", t.doms = {}, t.datas = {
					roomId: l.get("room.room_id"),
					anchorAvatar: l.get("room.avatar.big"),
					anchorName: l.get("room.owner_name") || l.get("room.owner_uid"),
					userName: r.get("nickname") || "",
					descriptions: {},
					activityData: null
				}, t.datas.linkAnchorName = encodeURIComponent(this.datas.anchorName), t.renders = {
					buyRender: this.buyRenderFn(),
					compareRender: this.compareRenderFn(),
					tabitemRender: this.tabitemRenderFn(),
					tabitemFootRender: this.tabitemFootRenderFn()
				}, i.on("mod.normal.noble.buy", function(e) {
					t.status.isShow || t.show(e && e.level)
				}), e(document).on("click", ".privilege-title-buy, .myvip--seatbanner a, .person--info .myvipbtn, .myvip--notvip .myvipbtn, .privilege-head-btn, .privilege-promote", function(e) {
					e.preventDefault(), t.show()
				})
			},
			renderDialog: function() {
				var t = ['<div class="dialog-buyNobility dialog-nobility-center">', '<div class="dia-buy">', '<div class="dia-con-wp">', '<div data-niubuycontent="buy" class="dia-openMain">', '<div class="dia-openMain-loading"></div>', "</div>", "</div>", "</div>", '<a data-btn="closeniubuy" class="dia-cls" href="javascript:;" title="关闭"></a>', "</div>"].join("");
				this.doms.dialog = e(t), e(document.body).append(this.doms.dialog), this.bindEvents()
			},
			buyRenderFn: function() {
				var e = ['<h3 class="dia-openHead clearfix">', "{{ if anchorAvatar && anchorName }}", '<div class="dia-openHead-pic">', '<img src="{{ anchorAvatar }}" width="100%" height="100%">', "</div>", '<p class="dia-openHead-p"><strong class="nkname">{{ anchorName }}：</strong>', "<br>支持我，成为全平台贵族！</p>", "{{ /if }}", '<a class="dia-compare-btn2" target="_blank" href="/cms/gong/201701/16/4753.shtml" title="查看特权对比">贵族FAQ</a>', '<a data-btn="give-friend-noble" target="_blank" class="dia-presented-btn" href="' + f.buyNobleUrl + 'rid={{ roomId }}&anchorname={{ linkAnchorName }}&send=1" title="赠送好友贵族">赠送好友贵族</a>', "</h3>", '<table class="dia-nobility-tab"><tr>', '<th data-btn="viewcompare"><a class="dia-tab-btn" href="javascript:;">特权对比</a></th>', "{{ each iconNlNames as item index }}", '<td data-tabtrigger="noblelvl" data-noblelevel="{{ item.level }}" title="{{ item.noble_name }}" >', '<a class="dia-tab-btn" href="javascript:;">', '<img class="dia-nobility-icon" src="' + f.resUrl + '{{ item.symbol.web_symbol_pic5 }}" alt="{{ item.noble_name }}" /> ', "{{ item.noble_name }}", "{{ if (inProtected && protectedLvl && protectedLvl == item.level && trial != 1) || (level && level == item.level && trial != 1) }}", '<span class="noble-renew"></span>', "{{ /if }}", "</a></td>", "{{ /each }}", "</tr></table>", '<div data-niubuycontent="tabitemwrap">', '<div class="nobility-buy-td"><div data-niubuycontent="tabitem"></div></div>', '<div data-niubuycontent="tabitemfoot" class="dia-openFoot clearfix"></div>', "</div>", '<div data-niubuycontent="compare" class="hide"><div data-selector="compare-trs-list" class="nobility-compare-td"></div></div>'].join(""),
					t = n.compile(e);
				return t
			},
			buyRender: function() {
				var e = this.datas,
					t = e.level,
					i = e.inProtected,
					n = e.protectedLvl,
					o = e.trial,
					a = this.renders.buyRender({
						roomId: e.roomId,
						level: t,
						inProtected: i,
						protectedLvl: n,
						anchorAvatar: e.anchorAvatar,
						anchorName: e.anchorName,
						linkAnchorName: e.linkAnchorName,
						iconNlNames: e.compareData.iconNlNames,
						trial: o
					});
				this.doms.dialog.find('[data-niubuycontent="buy"]').html(a)
			},
			tabitemRenderFn: function() {
				var e = (this.datas, ['<div class="dia-openCon clearfix">', '<div class="dia-openCon-pic">', '<img class="dia-openCon-pic-mask" src="' + f.resUrl + '{{ data.symbol.web_symbol_pic6 }}">', "</div>", '<div class="dia-openCon-pic-wp">', '<span class="dia-openCon-nk" title="{{ data.noble_name }}">{{ data.noble_name }}</span>', "</div>", '<div class="dia-openCon-main-wp fr">', '<div data-selector="personal-rights" class="dia-openCon-main clearfix">', '<h4 class="dia-openCon-tt">专属特权：{{ descsLen }}/{{ totalRightsCount }}</h4>', "{{ each descs as item i }}", "{{ if item.usable }}", '<div class="dia-openCon-item fl">', '<div class="dia-openCon-item-pic">', '<img src="{{ descPicUrlPre + item.icon6 }}">', "</div>", '<p class="dia-openCon-item-tt" title="{{ item.long_name }}">{{ item.long_name }}</p>', '<span class="dia-openCon-item-txt" title="{{ item.intro || item.description }}">{{ item.intro || item.description }}</span>', "</div>", "{{ /if }}", "{{ /each }}", "</div>", "</div>", "</div>"].join("")),
					t = n.compile(e);
				return t
			},
			getInsertedData: function(t) {
				var i = this.datas,
					n = i.level,
					o = i.inProtected,
					a = i.protectedLvl,
					r = i.noblesConfigObj,
					s = i.trial,
					l = r[n],
					c = this.status.currSelectedLevel,
					d = {
						userNobleIndex: l && l.index || 0,
						selectedLevel: c,
						level: n,
						inProtected: o,
						protectedLvl: a,
						exampleData: r[4],
						data: r[c],
						descs: h.descriptions[c],
						roomId: i.roomId,
						descPicUrlPre: f.resUrl,
						descsLen: 0,
						totalRightsCount: h.totalRightsCount,
						activityData: i.activityData,
						trial: s,
						nobleOneYear: p
					};
				return t || e.each(d.descs, function(e, t) {
					t.usable && d.descsLen++
				}), d
			},
			renderTabitem: function(e) {
				var t = this.datas,
					i = this.status.currSelectedLevel,
					n = this.getInsertedData(e),
					o = this.htmls["nobleLvl" + i],
					a = "开通斗鱼贵族",
					r = f.buyNobleUrl,
					s = this.doms.dialog,
					l = t.inProtected,
					c = t.protectedLvl,
					d = t.level;
				e ? o = '<div class="dia-openCon clearfix"></div>' : n.descs && (o = this.renders.tabitemRender(n)), r += "rid=" + (t.roomId || ""), r += "&anchorname=" + (t.anchorName || "") + "&send=1", (l && c && c == i || d && d == i) && (a = "续费斗鱼贵族"), s.find('[data-niubuycontent="tabitem"]').html(o), s.find('[data-selector="buy-noble-title"]').text(a), this.renderFooter(n), this.loadActivity(n), s.find('[data-btn="give-friend-noble"]').attr("href", r), s.find('[data-selector="personal-rights"]').mCustomScrollbar("destroy").mCustomScrollbar(), this.showDesc(), this.hideCompare()
			},
			renderFooter: function(e) {
				var t = this.renders.tabitemFootRender(e);
				this.doms.dialog.find('[data-niubuycontent="tabitemfoot"]').html(t)
			},
			loadActivity: function(t) {
				var i = this,
					n = i.status;
				if (!n.isActivityLoaded) {
					if (n.isActivityLoading) return;
					n.isActivityLoading = 1, e.ajax({
						url: f.getActivityUrl,
						dataType: "json"
					}).done(function(e) {
						e && "undefined" != typeof e.ison && (n.isActivityLoaded = 1, 1 === e.ison && e.time && (i.datas.activityData = {
							time: e.time
						}, t.activityData = i.datas.activityData, i.renderFooter(t)))
					}).then(function() {
						n.isActivityLoading = 0
					})
				}
			},
			tabitemFootRenderFn: function() {
				var e = ['<div class="dia-nobility-float">', "<h4>贵族鱼翅使用说明：</h4>", "<ul>", '<li>1. 贵族鱼翅与普通鱼翅等值，可以用来送礼物，主播收到后获得<strong class="clr-d5a03a">同等收益</strong>；使用鱼翅时会优先消耗贵族鱼翅。</li>', '<li>2. 贵族鱼翅在贵族生效时一直有效，在贵族过期后会被冻结，冻结期间开通或续费<strong class="clr-d5a03a">任意等级</strong>的贵族即可重新解冻。</li>', "<li>3. 贵族鱼翅被冻结超过2个月后会消失。</li>", "<li>4. 贵族鱼翅不能用于购买贵族或门票等功能。</li>", "<li>5. 续费贵族后，立即返还所得的贵族鱼翅。</li>", "</ul>", '<i class="icon-arrow"></i><i class="icon-arrow2"></i>', "</div>"].join(""),
					t = ['<div class="dia-nobility-float">', "<h4>续费保护期说明：</h4>", "<ul>", "<li>贵族特权失效后会有15天的续费保护期，在此期间购买贵族仍可享受续费价格</li>", "</ul>", '<i class="icon-arrow"></i><i class="icon-arrow2"></i>', "</div>"].join(""),
					i = ['<span class="dia-openFoot-dia dia-openFoot-anniversary">', '游侠特惠<div class="dia-paladin-tips">', "</div>", "</span>"].join(""),
					o = ['<span class="dia-openFoot-dia dia-openFoot-anniversary">', '游侠特惠<div class="dia-paladin-tips">', "</div>", "</span>", '<span class="dia-openFoot-dia">返还<span class="clr-e1c39c">', "{{ data.renew_price * 110 / 100 / 100 }}", "</span>贵族鱼翅" + e + "</span>"].join(""),
					a = ["{{ if trial == 1 }}", '<div class="dia-openFoot-p">', "开通{{ data.noble_name }}（首月）：", '<strong class="clr-e1c39c">{{ data.first_open_price/100 }}</strong> 鱼翅，', '<span class="dia-openFoot-dia">返还', '<span class="clr-e1c39c">{{ data.first_remand_gold/100 }}</span>', "贵族鱼翅" + e + "</span> ", '<span>相当于开通仅需<strong class="clr-e1c39c">{{ (data.first_open_price - data.first_remand_gold)/100 }}</strong>鱼翅。</span><br>', "{{ if activityData }}" + i + "{{ /if }}", "<span>往后续费只需", '<span class="clr-e1c39c">{{ data.renew_price/100 }}</span>鱼翅/月，返还', '<em class="clr-e1c39c">{{ data.renew_remand_gold/100 }}</em>贵族鱼翅', "{{ if data.renew_price == data.renew_remand_gold }}", ' 。相当于续费<strong class="clr-e1c39c">免费</strong>。', "{{ /if }}", "</span>", "</div>", "{{ else }}", "{{ if inProtected && protectedLvl && protectedLvl == selectedLevel }}", '<div class="dia-openFoot-p">', "续费{{ data.noble_name }}（月）：", '<strong class="clr-e1c39c">{{ data.renew_price/100 }}</strong> 鱼翅<br>', "{{ if activityData && selectedLevel == 7 }}" + o + '返利高达<span class="clr-e1c39c">110%</span>。{{ else }}', "<span>", '<span class="dia-openFoot-dia">', '返还<em class="clr-e1c39c">{{ data.renew_remand_gold/100 }}</em>', "贵族鱼翅" + e + "</span>", "{{ if data.renew_price == data.renew_remand_gold }}", " 相当于续费免费。", "{{ /if }}", '<span class="dia-openFoot-dia dia-renew">您当前在续费保护期内' + t + "</span>", "</span>", "{{ /if }}", "</div>", "{{ else if level && level == selectedLevel }}", '<div class="dia-openFoot-p">', "续费{{ data.noble_name }}（月）：", '<strong class="clr-e1c39c">{{ data.renew_price/100 }}</strong> 鱼翅<br>', "{{ if activityData && selectedLevel == 7 }}" + o + '返利高达<span class="clr-e1c39c">110%</span>。{{ else }}', "<span>", '<span class="dia-openFoot-dia">', '返还<em class="clr-e1c39c">{{ data.renew_remand_gold/100 }}</em>', "贵族鱼翅" + e + "</span>", "{{ if data.renew_price == data.renew_remand_gold }}", " 相当于续费免费。", "{{ /if }}", "</span>", "{{ /if }}", "</div>", "{{ else }}", '<div class="dia-openFoot-p">', "开通{{ data.noble_name }}（首月）：", '<strong class="clr-e1c39c">{{ data.first_open_price/100 }}</strong> 鱼翅，', '<span class="dia-openFoot-dia">返还', '<span class="clr-e1c39c">{{ data.first_remand_gold/100 }}</span>', "贵族鱼翅" + e + "</span> ", "{{ if activityData && selectedLevel == 7 }}", '<span>相当于<strong class="clr-e1c39c">免费开通</strong></span><br>' + i + "<span>往后续费只需", '<span class="clr-e1c39c">{{ data.renew_price/100 }}</span>鱼翅/月，返还', '<em class="clr-e1c39c">{{ data.renew_remand_gold / 100 }}</em>贵族鱼翅', '，返利高达<span class="clr-e1c39c">110%</span>。', "</span>", "{{ else }}", '<span>相当于开通仅需<strong class="clr-e1c39c">{{ (data.first_open_price - data.first_remand_gold)/100 }}</strong>鱼翅。</span><br>', "<span>往后续费只需", '<span class="clr-e1c39c">{{ data.renew_price/100 }}</span>鱼翅/月，返还', '<em class="clr-e1c39c">{{ data.renew_remand_gold/100 }}</em>贵族鱼翅', "{{ if data.renew_price == data.renew_remand_gold }}", ' 。相当于续费<strong class="clr-e1c39c">免费</strong>。', "{{ /if }}", "</span>", "{{ /if }}", "</div>", "{{ /if }}", "{{ /if }}", "{{ if trial == 1 }}", '<a data-open-noble="1" target="_blank" class="dia-open-btn', '" href="' + f.buyNobleUrl + 'level={{ selectedLevel }}&rid={{ roomId }}" title="立即开通">立即开通</a>', "{{ else }}", "{{ if (inProtected && protectedLvl && protectedLvl == selectedLevel) || (level && level == selectedLevel) }}", '<a data-open-noble="1" target="_blank" class="dia-open-btn', '" href="' + f.buyNobleUrl + 'level={{ selectedLevel }}&rid={{ roomId }}" title="立即续费">立即续费</a>', "{{ else }}", '<a data-open-noble="1" target="_blank" class="dia-open-btn', "{{ if userNobleIndex > data.index }} dia-open-btn-disabled{{ /if }}", '" href="' + f.buyNobleUrl + 'level={{ selectedLevel }}&rid={{ roomId }}" title="立即开通">立即开通</a>', "{{ /if }}", "{{ /if }}", "</div>"].join(""),
					r = n.compile(a);
				return r
			},
			compareRenderFn: function() {
				var e = this.getTrsRenderTpl(),
					t = n.compile(e);
				return t
			},
			compareRender: function() {
				var e = "",
					t = this.datas.compareData;
				e = this.renders.compareRender(t), this.doms.dialog.find('[data-selector="compare-trs-list"]').html(e).mCustomScrollbar(), this.status.isCompareRendered = 1, this.hideDesc(), this.showCompare()
			},
			getTrsRenderTpl: function() {
				var e, t, i = h.trsKeyArr,
					n = "<table>";
				for (e in i) t = i[e], n += "<tr><th><strong>" + e + "</strong></th>", n += "{{ each " + t.key + " as ritem rindex }}<td><span>", n += t.isRight ? '<i class="icon-state icon-state-yes"></i>' : t.isNoNmixin ? '{{ if ritem > 0 }}{{ ritem }}个/月{{ else }}<i class="icon-state icon-state-no"></i>{{ /if }}' : t.isYESorNO ? '<i class="icon-state icon-state-{{ ritem == 0 ? "no" : "yes" }}"></i>' : t.devide100 ? "{{ ritem/100 }}" + t.unit : "" !== t.unit ? "{{ ritem }}" + (t.unit || "") : '{{ ritem==="" ? "无" : ritem }}', n += "</span></td>{{ /each }}</tr>";
				return n += "</table>"
			},
			changeTab: function(t, i) {
				var n = this,
					o = f.descsUrl + i + ".json",
					a = h.descriptions[i];
				t.addClass("cur").siblings().removeClass("cur"), n.status.currSelectedLevel = i, a ? this.renderTabitem() : d.load(o, "nobleCopywriting" + i, function(e) {
					h.descriptions[i] = e, n.renderTabitem()
				}, function() {
					n.renderTabitem(1), e.dialog.tips_black("获取" + t.text() + "描述信息失败，请稍候重试！", 2)
				})
			},
			bindEvents: function() {
				var t = this,
					i = t.doms.dialog;
				i.on("click", '[data-tabtrigger="noblelvl"]', function() {
					var i = e(this),
						n = i.data("noblelevel");
					t.changeTab(i, n), DYS.sub({
						action_code: "click_noblebuy_noblelabel",
						ext: {
							level: n
						}
					})
				}), i.on("click", '[data-btn="viewcompare"]', function() {
					e(this).addClass("cur").siblings().removeClass("cur"), i.find('[data-niubuycontent="tabitemwrap"]').addClass("hide"), t.status.isCompareRendered ? t.showCompare() : t.compareRender(), DYS.sub({
						action_code: "click_noblebuy_viewpri"
					})
				}), i.on("click", '[data-btn="closeniubuy"]', function() {
					i.addClass("hide"), t.status.isShow = 0
				}), i.on("click", '[data-open-noble="1"]', function() {
					var t = i.find('[data-selector="buy-noble-title"]').text(),
						n = i.find('[data-tabtrigger="noblelvl"].cur').data("noblelevel");
					return t.indexOf("续费") > -1 ? DYS.sub({
						action_code: "click_noblebuy_renewal",
						ext: {
							level: n
						}
					}) : DYS.sub({
						action_code: "click_noblebuy_open",
						ext: {
							level: n
						}
					}), e(this).hasClass("dia-open-btn-disabled") ? !1 : void 0
				}), i.on("click", ".js-noblebuy-activity-close-btn", function() {
					i.find(".js-noblebuy-activity-tip").removeClass("first-in-show")
				}), i.on("mouseenter", ".js-noblebuy-activity-btn", function() {
					i.find(".js-noblebuy-activity-tip").addClass("first-in-show")
				}).on("mouseleave", ".js-noblebuy-activity-btn", function() {
					i.find(".js-noblebuy-activity-tip").removeClass("first-in-show")
				})
			},
			showDesc: function() {
				this.doms.dialog.find('[data-niubuycontent="tabitemwrap"]').removeClass("hide")
			},
			hideDesc: function() {
				this.doms.dialog.find('[data-niubuycontent="tabitemwrap"]').addClass("hide")
			},
			showCompare: function() {
				this.doms.dialog.find('[data-niubuycontent="compare"]').removeClass("hide")
			},
			hideCompare: function() {
				this.doms.dialog.find('[data-niubuycontent="compare"]').addClass("hide")
			},
			show: function(e) {
				var t = this,
					i = t.doms.dialog,
					n = t.datas;
				c.check() ? (i || (t.renderDialog(), i = t.doms.dialog), n.compareData || t.ajax(function(e, i) {
					t.update(e, i)
				}), i.removeClass("hide"), t.status.isShow = 1) : c.show("login")
			},
			convertData: function() {
				for (var e, t, i = this.datas, n = i.originalData, o = 0, a = n.length, r = 0, s = {
					iconNlNames: [],
					js_noble_card: [],
					js_noble_badge: []
				}, l = {}; a > o; o++) if (e = n[o], e.index = a - o - 1, e.is_on_sell) {
					l[e.level] = e;
					for (t in e) switch (t) {
					case "web_icon":
					case "noble_name":
					case "symbol":
					case "level":
						"undefined" == typeof s.iconNlNames[r] && (s.iconNlNames[r] = {}), s.iconNlNames[r][t] = e[t];
						break;
					default:
						"undefined" == typeof s[t] && (s[t] = []), "wlcm" === t || "op_effect" === t ? s[t].push(e[t].name) : s[t].push(e[t])
					}
					r++, s.js_noble_card.push(1), s.js_noble_badge.push(1)
				}
				i.noblesConfigObj = l, i.compareData = s
			},
			update: function(t, i) {
				var n = this,
					o = n.datas,
					a = 0,
					r = {},
					s = null;
				t && (r = e.extend({
					lv: 0
				}, t), o.level = parseInt(r.lv, 10) || 0, o.trial = r.trial || 0, r.pn ? (o.inProtected = !o.level && parseInt(r.pn.ep, 10), o.protectedLvl = !o.level && parseInt(r.pn.pl, 10)) : (o.inProtected = 0, o.protectedLvl = 0)), i && (o.originalData = i.reverse(), n.convertData()), o.protectedLvl && (a = o.protectedLvl), o.level && (a = o.level), n.buyRender(), o.noblesConfigObj && o.noblesConfigObj[a] ? n.doms.dialog.find('[data-noblelevel="' + a + '"]').trigger("click") : (s = n.doms.dialog.find('[data-tabtrigger="noblelvl"]'), s.eq(s.length - 1).trigger("click"))
			},
			ajax: function(t) {
				var i = this;
				i.status.isLoading || (i.status.isLoading = !0, e.when(e.ajax(f.getNobleInfo, {
					dataType: "json",
					data: "client_type=0"
				}), e.ajax(f.getNobleConf, {
					dataType: "json"
				})).done(function(i, n) {
					var o = "success" === i[1] && i[0],
						a = "success" === n[1] && n[0];
					0 == o.error && o.msg && 0 == a.error && a.data ? t(o.msg.nbl_spl || {
						et: 0,
						lv: 0
					}, a.data) : e.dialog.tips_black("获取信息失败，请稍候重试！")
				}).fail(function() {
					e.dialog.tips_black("获取信息失败，请稍候重试！")
				}).then(function() {
					i.status.isLoading = !1
				}))
			}
		};
	return {
		init: function() {
			g.init()
		}
	}
}), define("douyu/com/grayscale", function() {
	var e = !(!window.navigator.msPointerEnabled && !window.navigator.pointerEnabled),
		t = navigator.userAgent.indexOf("MSIE") > -1,
		i = "grayscale" + (Math.random() + "").slice(2, 8),
		n = ['<svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:-1000px;top:-1000px;">', '<filter id="' + i + '">', '<feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"/>', "</filter>", "</svg>"].join("");
	return $("body").append(n), function(n) {
		if (e) {
			var o = $(n);
			o.length > 0 && "img" !== o[0].nodeName.toLowerCase() && (o = $(n).find("img")), $(o).each(function(e, t) {
				var n = t.width || 0,
					o = t.height || 0,
					a = '<svg width="' + n + '" height="' + o + '"><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + t.src + '" x="0" y="0" width="' + n + '" height="' + o + '" filter="url(#' + i + ')"></image></svg>';
				$(t).replaceWith(a)
			})
		} else $(n).css({
			"-webkit-filter": "grayscale(100%)",
			"-moz-filter": "grayscale(100%)",
			"-ms-filter": "grayscale(100%)",
			"-o-filter": "grayscale(100%)",
			filter: "grayscale(100%)"
		}), t && $(n).css({
			filter: "gray"
		})
	}
}), define("douyu/com/config-user-info", [], function() {
	var e = {
		levelExp: {
			exp_level: {
				0: {
					lv: 1
				},
				10: {
					lv: 2
				},
				40: {
					lv: 3
				},
				106: {
					lv: 4
				},
				216: {
					lv: 5
				},
				378: {
					lv: 6
				},
				600: {
					lv: 7
				},
				890: {
					lv: 8
				},
				1256: {
					lv: 9
				},
				1672: {
					lv: 10
				},
				2162: {
					lv: 11
				},
				2750: {
					lv: 12
				},
				3460: {
					lv: 13
				},
				4316: {
					lv: 14
				},
				5342: {
					lv: 15
				},
				6562: {
					lv: 16
				},
				8000: {
					lv: 17
				},
				9680: {
					lv: 18
				},
				11626: {
					lv: 19
				},
				13862: {
					lv: 20
				},
				16412: {
					lv: 21
				},
				19300: {
					lv: 22
				},
				22550: {
					lv: 23
				},
				26186: {
					lv: 24
				},
				30232: {
					lv: 25
				},
				34712: {
					lv: 26
				},
				39650: {
					lv: 27
				},
				45070: {
					lv: 28
				},
				50996: {
					lv: 29
				},
				58572: {
					lv: 30
				},
				67798: {
					lv: 31
				},
				78674: {
					lv: 32
				},
				91200: {
					lv: 33
				},
				105376: {
					lv: 34
				},
				121202: {
					lv: 35
				},
				138678: {
					lv: 36
				},
				157804: {
					lv: 37
				},
				178580: {
					lv: 38
				},
				201006: {
					lv: 39
				},
				231006: {
					lv: 40
				},
				265006: {
					lv: 41
				},
				304006: {
					lv: 42
				},
				349006: {
					lv: 43
				},
				401006: {
					lv: 44
				},
				461006: {
					lv: 45
				},
				530006: {
					lv: 46
				},
				609006: {
					lv: 47
				},
				699006: {
					lv: 48
				},
				801006: {
					lv: 49
				},
				951006: {
					lv: 50
				},
				1101006: {
					lv: 51
				},
				1251006: {
					lv: 52
				},
				1401006: {
					lv: 53
				},
				1551006: {
					lv: 54
				},
				1701006: {
					lv: 55
				},
				1851006: {
					lv: 56
				},
				2001006: {
					lv: 57
				},
				2151006: {
					lv: 58
				},
				2301006: {
					lv: 59
				},
				2601006: {
					lv: 60
				},
				2901006: {
					lv: 61
				},
				3201006: {
					lv: 62
				},
				3501006: {
					lv: 63
				},
				3801006: {
					lv: 64
				},
				4101006: {
					lv: 65
				},
				4401006: {
					lv: 66
				},
				4701006: {
					lv: 67
				},
				5001006: {
					lv: 68
				},
				5301006: {
					lv: 69
				},
				5801006: {
					lv: 70
				},
				6301006: {
					lv: 71
				},
				6801006: {
					lv: 72
				},
				7301006: {
					lv: 73
				},
				7801006: {
					lv: 74
				},
				8301006: {
					lv: 75
				},
				8801006: {
					lv: 76
				},
				9301006: {
					lv: 77
				},
				9801006: {
					lv: 78
				},
				10301006: {
					lv: 79
				},
				11001006: {
					lv: 80
				},
				11701006: {
					lv: 81
				},
				12401006: {
					lv: 82
				},
				13101006: {
					lv: 83
				},
				13801006: {
					lv: 84
				},
				14501006: {
					lv: 85
				},
				15201006: {
					lv: 86
				},
				15901006: {
					lv: 87
				},
				16601006: {
					lv: 88
				},
				17301006: {
					lv: 89
				},
				18201006: {
					lv: 90
				},
				19101006: {
					lv: 91
				},
				20001006: {
					lv: 92
				},
				20901006: {
					lv: 93
				},
				21801006: {
					lv: 94
				},
				22701006: {
					lv: 95
				},
				23601006: {
					lv: 96
				},
				24501006: {
					lv: 97
				},
				25401006: {
					lv: 98
				},
				26301006: {
					lv: 99
				},
				27501006: {
					lv: 100
				},
				28701006: {
					lv: 101
				},
				29901006: {
					lv: 102
				},
				31101006: {
					lv: 103
				},
				32301006: {
					lv: 104
				},
				33501006: {
					lv: 105
				},
				34701006: {
					lv: 106
				},
				35901006: {
					lv: 107
				},
				37101006: {
					lv: 108
				},
				38301006: {
					lv: 109
				},
				39801006: {
					lv: 110
				},
				41301006: {
					lv: 111
				},
				42801006: {
					lv: 112
				},
				44301006: {
					lv: 113
				},
				45801006: {
					lv: 114
				},
				47301006: {
					lv: 115
				},
				48801006: {
					lv: 116
				},
				50301006: {
					lv: 117
				},
				51801006: {
					lv: 118
				},
				53301006: {
					lv: 119
				},
				54801006: {
					lv: 120
				},
				56601006: {
					lv: 121
				}
			},
			old_exp_level: {
				0: {
					lv: 1
				},
				10: {
					lv: 2
				},
				55: {
					lv: 3
				},
				145: {
					lv: 4
				},
				290: {
					lv: 5
				},
				500: {
					lv: 6
				},
				785: {
					lv: 7
				},
				1155: {
					lv: 8
				},
				1620: {
					lv: 9
				},
				2285: {
					lv: 10
				},
				3248: {
					lv: 11
				},
				4607: {
					lv: 12
				},
				6460: {
					lv: 13
				},
				8905: {
					lv: 14
				},
				12040: {
					lv: 15
				},
				15963: {
					lv: 16
				},
				20772: {
					lv: 17
				},
				26565: {
					lv: 18
				},
				33440: {
					lv: 19
				},
				42315: {
					lv: 20
				},
				53689: {
					lv: 21
				},
				68061: {
					lv: 22
				},
				85930: {
					lv: 23
				},
				107795: {
					lv: 24
				},
				134155: {
					lv: 25
				},
				165509: {
					lv: 26
				},
				202356: {
					lv: 27
				},
				245195: {
					lv: 28
				},
				294525: {
					lv: 29
				},
				353855: {
					lv: 30
				},
				425182: {
					lv: 31
				},
				510503: {
					lv: 32
				},
				611815: {
					lv: 33
				},
				731115: {
					lv: 34
				},
				870400: {
					lv: 35
				},
				1031667: {
					lv: 36
				},
				1216913: {
					lv: 37
				},
				1428135: {
					lv: 38
				},
				1667330: {
					lv: 39
				},
				1936525: {
					lv: 40
				},
				2245716: {
					lv: 41
				},
				2604899: {
					lv: 42
				},
				3024070: {
					lv: 43
				},
				3513225: {
					lv: 44
				},
				4082360: {
					lv: 45
				},
				4741471: {
					lv: 46
				},
				5500554: {
					lv: 47
				},
				6369605: {
					lv: 48
				},
				7358620: {
					lv: 49
				},
				8477635: {
					lv: 50
				},
				9743316: {
					lv: 51
				},
				11172329: {
					lv: 52
				},
				12781340: {
					lv: 53
				},
				14587015: {
					lv: 54
				},
				16606020: {
					lv: 55
				},
				18855021: {
					lv: 56
				},
				21350684: {
					lv: 57
				},
				24109675: {
					lv: 58
				},
				27148660: {
					lv: 59
				},
				30477645: {
					lv: 60
				},
				34116628: {
					lv: 61
				}
			}
		}
	};
	return e
}), define("douyu/com/header-nums", ["jquery", "shark/observer", "shark/util/cookie/1.0", "douyu/context", "douyu/com/exjsonp", "shark/util/storage/1.0"], function(e, t, i, n, o, a) {
	var r, s, l, c, d;
	return r = e("#header").find(".o-login"), s = {
		render: function() {
			var e = r.find(".umes-icon"),
				t = c.getPrivateMsg() + l.getRecruiteMsg(!0),
				i = "";
			t > 0 ? (i = t > 99 ? "99+" : t, e.html(i).removeClass("hide")) : e.html("").addClass("hide")
		}
	}, l = {
		name: "AnchorRecruit",
		init: function() {
			var e = this,
				t = n.get("sys.webconfUrl").replace(/^http(s?):/, "").replace(/\/$/g, "") + "/resource/common/anchor_recruit_new.json";
			if (e.getRecruiteMsgStatus()) {
				if ("http:" === window.location.protocol) return void e.renderRecruiteMsg();
				try {
					o.load(t, "anchorRecruitNew", function(e) {
						l.updateLocalStorage(e.newRecruit)
					})
				} catch (i) {
					window.location.href.indexOf("BH_DEBUG=true") > 0 && console.log(i)
				}
			}
		},
		getRecruiteMsgStatus: function() {
			return parseInt(i.get("recruiteMsg" + n.get("sys.uid")) || 0, 10)
		},
		updateLocalStorage: function(t) {
			var i, n = this.getRecruiteMsg();
			if (this.getRecruiteMsgStatus()) {
				if (e.isEmptyObject(n) && e.isPlainObject(t)) n = function(e) {
					var t = {};
					for (var i in e) if (Object.prototype.hasOwnProperty.call(e, i)) {
						t[i] = {};
						for (var n = e[i].length, o = 0; n > o;) t[i][e[i][o]] = 0, o += 1
					}
					return t
				}(t);
				else if (e.isPlainObject(t)) {
					e.isEmptyObject(t) && (n = {});
					for (var o in t) if (n[o]) {
						for (i in n[o]) Object.prototype.hasOwnProperty.call(n[o], i) && -1 === e.inArray(Number(i), t[o]) && delete n[o][i];
						for (var a = 0, r = t[o].length; r > a; a += 1) void 0 === n[o][t[o][a]] && (n[o][t[o][a]] = 0)
					} else {
						n[o] = {};
						for (var s = 0, l = t[o].length; l > s; s += 1) n[o][t[o][s]] = 0
					}
				} else {
					if ("string" != typeof t) return;
					if (!n[t]) return;
					for (i in n[t]) Object.prototype.hasOwnProperty.call(n[t], i) && (n[t][i] = 1)
				}
				this.setRecruiteMsg(n), this.renderRecruiteMsg()
			}
		},
		getNum: function(t) {
			var i, n, o = 0;
			if (!e.isPlainObject(t)) return o;
			for (i in t) if (Object.prototype.hasOwnProperty.call(t, i)) for (n in t[i]) Object.prototype.hasOwnProperty.call(t[i], n) && 0 === t[i][n] && (o += 1);
			return o
		},
		setRecruiteMsg: function(e) {
			a.set("recruiteNew" + n.get("sys.uid"), e, 86400), i.set("recruitMsgNum" + n.get("sys.uid"), this.getNum(e), 31536e5)
		},
		getRecruiteMsg: function(e) {
			var t = a.get("recruiteNew" + n.get("sys.uid"));
			return e ? this.getRecruiteMsgStatus() ? parseInt(i.get("recruitMsgNum" + n.get("sys.uid")) || 0, 10) : 0 : t
		},
		renderRecruiteMsg: function() {
			var e = r.find(".person-icon"),
				t = this.getRecruiteMsg(!0),
				i = "";
			t > 0 ? (i = t > 99 ? "99+" : t, e.html(i).removeClass("hide")) : e.html("").addClass("hide"), s.render()
		}
	}, c = {
		name: "Letter",
		init: function() {
			var i = this,
				n = ['<div class="web-message-wrapper">', '<div class="message-frame-wrapper hide" >', '<i class="loading-msg"></i>', "</div>", '<div class="web-message-close" >', "<i></i>", "</div>", "</div>"].join(""),
				o = e(n);
			e("#container").append(o), t.trigger("com.private.letter.create"), window.$ROOM && window.$ROOM.room_id || setTimeout(function() {
				window.embedMsg.init({
					target: o.find(".message-frame-wrapper")[0],
					onMessage: function(e) {
						var i = parseInt(e, 10) || 0;
						t.trigger("com.private.letter.msg", i)
					},
					onLoad: function() {
						t.trigger("com.private.letter.loaded")
					},
					initShowState: !1
				})
			}, 500), i.renderLetterMsg(i.getPrivateMsg()), t.on("com.private.letter.msg", function(e) {
				c.setPrivateMsg(e), c.renderLetterMsg(e)
			})
		},
		getPrivateMsg: function() {
			return a.get("userletnum" + n.get("sys.uid")) || 0
		},
		setPrivateMsg: function(e) {
			a.set("userletnum" + n.get("sys.uid"), e)
		},
		renderLetterMsg: function(t) {
			var i = "",
				n = e("#js-msg-barrage").find(".m-left-num"),
				o = r.find(".mes-icon");
			t > 0 ? (i = t > 99 ? "99+" : t, o.html(i).removeClass("hide"), n.length && n.html(i).removeClass("hide")) : (o.html("").addClass("hide"), n.length && n.html("").addClass("hide")), s.render()
		}
	}, d = {
		init: function() {
			var i = window.location.protocol,
				n = i + $SYS.pmChatPopwindUrl.replace(/^http(s?):/, "");
			e.getScript(n + "/embed/embed.min.js", function() {
				c.init(), t.trigger("mod.chat.success", "embed")
			}), l.init()
		}
	}
}), define("douyu/com/header", ["jquery", "shark/class", "shark/observer", "shark/util/lang/1.0", "shark/util/template/2.0", "shark/util/cookie/1.0", "douyu/context", "douyu/com/imgp", "douyu/com/sign", "douyu/com/exjsonp", "douyu/com/search-suggest", "douyu/com/header-dp", "douyu/com/verifyPhone", "douyu/com/user", "douyu/com/noble-buy", "douyu/com/grayscale", "douyu/com/config-user-info", "shark/util/flash/data/1.0", "shark/util/storage/1.0", "douyu/page/room/base/api", "douyu/com/header-nums", "douyu-activity/crazyFansDays201704/crazyFansDays"], function(e, t, i, n, o, a, r, s, l, c, d, u, f, h, p, g, m, v, y, _, b, w) {
	var k, x, C, S, j, T, I, D, A, L, N, O, E, M, P, B = 20;
	S = {
		interval: function(e, t, i) {
			setTimeout(function() {
				e() !== !1 && S.interval(e, t)
			}, t), i === !0 && e()
		},
		console: function(e) {
			window.location.href.indexOf("WD_DEBUG=true") > 0 && (window.console ? console[e.type ? e.type : "log"](e.info) : window.alert(e.info))
		},
		_evt_menu_toggle: function() {
			for (var t, i = [].slice.call(arguments, 0), n = 0, o = i.length; o > n; n++) t = i[n], e(t).on("mouseenter", function() {
				var t = e(this),
					i = t.data("timer");
				i && clearTimeout(i), i = setTimeout(function() {
					t.addClass("open")
				}, 100), t.data("timer", i)
			}).on("mouseleave", function() {
				var t = e(this),
					i = t.data("timer");
				i && clearTimeout(i), i = setTimeout(function() {
					t.removeClass("open")
				}, 100), t.data("timer", i)
			})
		},
		_checkMousePointIsInArea: function() {
			var t = [].slice.call(arguments, 0),
				i = t[0],
				n = t.slice(1),
				o = !0;
			return e.each(n, function(e, t) {
				var n = t.offset(),
					a = {
						w: t.width(),
						h: t.height()
					},
					r = {
						s: n.left,
						e: n.left + a.w
					},
					s = {
						s: n.top,
						e: n.top + a.h
					},
					l = i.x >= r.s && i.x <= r.e && i.y >= s.s && i.y <= s.e;
				return l ? void 0 : (o = !1, !1)
			}), o
		},
		_format_his_time: function(e, t) {
			var i = e - t;
			return i >= 604800 ? "很久以前" : i >= 86400 ? Math.floor(i / 86400) + "天前" : i >= 3600 ? Math.floor(i / 3600) + "小时前" : i >= 1200 ? 15 * Math.floor(Math.floor(i / 60) / 15) + "分钟前" : i >= 900 ? "15分钟前" : i >= 60 ? Math.floor(i / 60) + "分钟前" : "刚刚"
		},
		_format_online: function(e) {
			return e = parseInt(e), 1 > e ? 0 : e >= 1e4 ? (e / 1e4).toFixed(1) + "万" : e
		},
		convertTime: function(e) {
			var t, i, n, e;
			return e ? (e = new Date(1e3 * e), t = e.getFullYear(), i = e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1, n = e.getDate() + " ", t + "-" + i + "-" + n) : 0
		}
	}, k = {
		init: function() {
			this.confPath = $SYS.webconfUrl + "resource/common/logo/setLogo.json", this.logoSrc = "//shark.douyucdn.cn/app/douyu/res/com/logo.png?ver=20161019", this.logowrap = e("#header").find(".head-logo"), this.getLogo()
		},
		getLogo: function() {
			var e = this;
			this.confPath = this.confPath.replace(/^http(s?):?/gi, ""), c.load(e.confPath, "setLogo", function(t) {
				e.logoSrc = t.logo || e.logoSrc, e.setLogo()
			}, function(t) {
				e.setLogo()
			})
		},
		setLogo: function() {
			this.logowrap.css("background", "url(" + this.logoSrc + ") left center no-repeat")
		}
	}, N = function(e, t) {
		var i = r.get("sys.web_url");
		t.empty().append('<div class="' + e.slice(0, 1) + '-load"><img src="' + i + 'app/douyu/res/com/loading.gif"><span>数据加载中...</span></div>')
	}, O = function(e, t) {
		var i = r.get("sys.web_url"),
			n = {
				f: "关注",
				h: "历史"
			};
		t.empty().append('<div class="' + e + '-none"><p class="n-tt">信息动态</p><p class="n-cn"><img src="' + i + 'app/douyu/res/com/sg-cry.png?v=20161204" alt=""><span>你的' + n[e] + "列表空空如也~</span></p></div>")
	}, E = function(e, t, i) {
		var n = C,
			o = n.doms[e],
			a = o.find(".list-wrap");
		o.addClass("open"), s.build(), i || (N(e, a), t())
	}, M = function(e) {
		var t = C.doms[e];
		t.removeClass("open")
	}, P = function(t, i, n, o) {
		var a = C.doms;
		a[t].on("mouseenter", function(t) {
			var i = e(this),
				o = i.data("stop"),
				a = i.data("timer");
			a && clearTimeout(a), a = setTimeout(function() {
				return o ? i.data("stop", !1) : void n()
			}, 100), i.data("timer", a)
		}).on("mouseleave", function(n) {
			var r = e(this),
				s = {
					x: n.screenX,
					y: n.screenY
				},
				l = r.data("stop"),
				c = r.data("timer");
			c && clearTimeout(c), c = setTimeout(function() {
				if (l) {
					var e = S._checkMousePointIsInArea(s, a[t], a[t].find(i));
					return e || o(t), r.data("stop", !1)
				}
				o(t)
			}, 100), r.data("timer", c)
		}), a[t].on("mouseenter", i, function() {
			a[t].data("stop", !0), setTimeout(function() {
				a[t].data("stop", !1)
			}, 100)
		}).on("mouseleave", i, function() {
			o(t)
		})
	}, j = {
		preLoadAssort: function() {
			E("assort", j.reqDataHandle, j.loaded)
		},
		reqDataHandle: function() {
			var t = function(e) {
					j.loaded = !0, j.renderView(e)
				};
			e.ajax("/ajax_api_cache/header/cate", {
				type: "get",
				dataType: "json",
				success: e.proxy(t, this)
			})
		},
		renderView: function(e) {
			var t = C,
				i = t.doms.assort,
				a = i.find(".a-pop");
			if (e && e.length) {
				var r, s = e[0] ? e[0].name : "",
					l = e[0] ? e[0].list : [],
					c = e[1] ? e[1].name : "",
					d = e[1] ? e[1].list : [],
					u = n.string.join("<h3>{{hot}}</h3>", '<ul class="btns">', "{{each hotList}}", "<li>", '<a target="_blank" class="btn" href="{{$value.url}}">{{$value.name}}</a>', "</li>", "{{/each}}", "</ul>", "<h3>{{recommend}}</h3>", '<ul class="btns">', "{{each recommendList}}", "<li>", '<a target="_blank" class="btn" href="{{$value.url}}">{{$value.name}}</a>', "</li>", "{{/each}}", "</ul>", '<div class="btn-all"><a target="_blank" href="/directory">全部 &gt;&gt;</a></div>'),
					f = o.compile(u);
				r = f({
					hot: s,
					hotList: l,
					recommend: c,
					recommendList: d
				}), a.find(".list-wrap").html(r)
			}
		}
	}, videoEntry = {
		init: function() {
			this.addEntry(), y.set("header_video_entry_count", "showone")
		},
		addEntry: function() {
			this.bindEvent()
		},
		bindEvent: function() {
			var t = e("#header").find(".video-entry");
			t.off().on("click", ">a", function() {
				DYS.sub({
					action_code: "click_topnavi_video"
				})
			}).on("click", ".close-btn", function() {
				t.find(".video-entry-guide").remove()
			})
		}
	}, T = {
		preLoadFunny: function() {
			E("funny", T.reqDataHandle, T.loaded)
		},
		reqDataHandle: function() {
			var t = function(e) {
					T.loaded = !0, T.renderView(e)
				};
			e.ajax("/ajax_api_cache/header/game", {
				type: "get",
				dataType: "json",
				success: e.proxy(t, this)
			})
		},
		renderView: function(e) {
			var t = C,
				i = t.doms.funny,
				a = i.find(".a-pop");
			if (e) {
				var r, s = e.web,
					l = e.mobile,
					c = s.length ? n.string.join("<h3>网游推荐</h3>", '<ul class="btns">', "{{each webgameList}}", "<li>", '<a target="_blank" class="btn" href="{{$value.url}}" data-id="{{$value.id}}" data-name="{{$value.name}}">{{$value.name}}</a>', "</li>", "{{/each}}", "</ul>", '<div class="btn-all" data-type="webgame"><a target="_blank" href="http://wan.douyu.com/">全部 &gt;&gt;</a></div>') : "",
					d = l.length ? n.string.join("<h3>手游推荐</h3>", '<ul class="btns">', "{{each mobilegameList}}", "<li>", '<a target="_blank" class="btn" href="{{$value.url}}" data-id="{{$value.id}}" data-name="{{$value.name}}">{{$value.name}}</a>', "</li>", "{{/each}}", "</ul>", '<div class="btn-all" data-type="mobilegame"><a target="_blank" href="/mobileGame/home">全部 &gt;&gt;</a></div>') : "",
					u = o.compile(c + d);
				r = u({
					webgameList: s,
					mobilegameList: l
				}), a.find(".list-wrap").html(r)
			}
		}
	}, I = {
		flanch: function() {
			var e = C,
				t = e.doms.search,
				i = t.find(".ipt"),
				n = t.find("i");
			e.config.search || (e.config.search = {
				boxw: t.width(),
				iptw: i.width(),
				icow: n.width()
			});
			var o = e.config.search,
				a = o.boxw - o.iptw,
				r = 20,
				s = o.boxw + r,
				l = s - a;
			t.animate({
				width: s
			}), i.animate({
				width: l
			})
		},
		narrowing: function() {
			var e = C;
			if (e.config.search) {
				var t = e.doms.search,
					i = t.find(".ipt"),
					n = e.config.search;
				t.animate({
					width: n.boxw
				}), i.animate({
					width: n.iptw
				})
			}
		},
		search: function(t, i) {
			var n = "",
				o = sessionStorage.getItem("s_type") || 1;
			if ("2" === o && "" != e.trim(e("#suggest-search").val()) && (o = 1), sessionStorage.setItem("current_s_type", o), t = e.trim(t), i = e.isFunction(i) ? i : function() {}, !t) return e.dialog({
				lock: !0,
				content: "搜索关键词还没有填写",
				icon: "warning",
				ok: i,
				close: i
			}), !1;
			t = encodeURIComponent(t).replace(new RegExp("'", "g"), "");
			var a = document.createElement("a");
			a.target = "_blank", a.href = "/search/?kw=" + t + n, e("body").append(e(a)), a.click(), e(a).remove()
		}
	}, D = {
		preLoadHistory: function() {
			E("historyEle", D.reqHistoryData, D.loaded)
		},
		reqHistoryData: function() {
			var t = function(e) {
					D.loaded = !0, D.timer && clearTimeout(D.timer), D.timer = setTimeout(function() {
						D.loaded = !1
					}, 1e3 * B), D.resHistoryView(e)
				};
			e.ajax("/member/cp/get_user_history", {
				type: "get",
				dataType: "json",
				success: e.proxy(t, this)
			})
		},
		resHistoryView: function(e) {
			var t = C,
				a = t.doms.historyEle,
				r = a.find(".h-pop"),
				s = r.find(".list-wrap");
			if (!(e && e.nowtime && e.history_list && e.history_list.length)) return void O("h", s);
			for (var l, c, d = e.history_list, u = e.nowtime, f = n.string.join('<ul class="h-list">', "{{each list as item}}", "<li>", "<p>", "{{ if (item.vipId && item.vipId > 0) }}", '<a href="/{{item.vipId}}" data-rid="{{item.rid}}" target="_blank">{{item.n}}</a>', "{{ else }}", '<a href="/{{item.rid}}" data-rid="{{item.rid}}" target="_blank">{{item.n}}</a>', "{{ /if }}", "</p>", "<span>", '<a href="#" class="{{item.headCls}}">{{item.timegap}}</a>', '<a href="#" class="head-ico2">{{item.on}}</a>', '<a href="#" class="head-ico3">{{item.uc}}</a>', "</span>", "</li>", "{{/each}}", "</ul>"), h = o.compile(f), p = 0, g = d.length; g > p; p++) c = d[p], c.headCls = 0 === parseInt(c.ls, 10) ? "head-ico4" : "head-ico1", c.timegap = S._format_his_time(u, c.lt);
			l = h({
				list: d
			}), s.html(l), i.trigger("dys.header.history.show", d)
		}
	}, A = {
		preLoadFollow: function() {
			E("follow", A.reqFollowData, A.loaded)
		},
		reqFollowData: function() {
			var t = function(e) {
					A.loaded = !0, A.timer && clearTimeout(A.timer), A.timer = setTimeout(function() {
						A.loaded = !1
					}, 1e3 * B), A.resFollowView(e)
				};
			e.ajax("/member/cp/get_follow_list", {
				type: "get",
				dataType: "json",
				success: e.proxy(t, this)
			})
		},
		resFollowView: function(e) {
			var t = C,
				a = t.doms.follow,
				r = a.find(".f-pop"),
				s = r.find(".list-wrap");
			if (!(e && e.nowtime && e.room_list && e.room_list.length)) return void O("f", s);
			for (var l, c, d = e.room_list, u = e.nowtime, f = n.string.join('<ul class="f-list">', "{{each list as item}}", "<li>", "<p>", '<a href="/{{+item.vipId ? item.vipId : item.room_id}}" data-rid="{{item.room_id}}" target="_blank">{{item.room_name}}</a>', "</p>", "<span>", '<a href="/{{+item.vipId ? item.vipId : item.room_id}}" data-rid="{{item.room_id}}" class="head-ico1">已播{{item.minnum}}分钟</a>', '<a href="/{{+item.vipId ? item.vipId : item.room_id}}" data-rid="{{item.room_id}}" class="head-ico2">{{item.nickname}}</a>', '<a href="/{{+item.vipId ? item.vipId : item.room_id}}" data-rid="{{item.room_id}}" class="head-ico3">{{item.onlineStr}}</a>', "</span>", "</li>", "{{/each}}", "</ul>", '<p class="f-all"><a href="/directory/myFollow">查看全部</a></p>'), h = o.compile(f), p = 0, g = d.length; g > p; p++) c = d[p], c.minnum = parseInt((u - c.show_time) / 60), c.onlineStr = S._format_online(c.online);
			l = h({
				list: d
			}), s.html(l), i.trigger("dys.header.follow.show", d)
		}
	}, L = {
		urls: {
			otherIcons: r.get("sys.webconfUrl") + "resource/noble/global/web.json",
			descsUrl: r.get("sys.webconfUrl") + "resource/noble/copywriting/web"
		},
		levelExp: m.levelExp,
		show: function() {
			var e = C,
				t = e.doms.loginEle,
				i = t.find(".l-menu"),
				n = e.doms.loginBox.find(".l-txt"),
				o = 0;
			i.stop(!0, !0).animate({}, 50, function() {
				i.show().removeClass("out"), t.addClass("open"), DYS.sub({
					action_code: "show_mem_float"
				})
			}), o = 15 + n.outerWidth() + 6, e.doms.lmsjtop.css({
				right: o
			})
		},
		hide: function() {
			var e = C.doms.loginEle,
				t = e.find(".l-menu");
			t.stop(!0, !0).fadeOut(), t.addClass("out"), e.removeClass("open")
		},
		handleNoblePrivilege: function(e, t, i) {
			var n = e.nl,
				a = e.ndate || "",
				s = e.nobleName,
				l = e.ingf,
				c = e.nobleConfig || {},
				d = e.trial,
				u = ['<div class="privilege-title clearfix">', "{{ if !ingf }}", '<h3 class="privilege-title-h3">', '{{ nobleName ? nobleName : (nobleConfig[nl] ? nobleConfig[nl].noble_name : "") }}享有以下特权', "</h3>", "{{ if trial == 1 }}", '<a class="privilege-title-buy" data-noble-open="1" href="javascript:;" title="开通">开通</a>', '<a href="/cms/gong/201701/16/4753.shtml" target="_blank" class="privilege-title-faq">贵族FAQ</a>', '<span class="privilege-title-times"><em>体验卡有效期至：</em><em>{{ ndate }}</em>', "</span>", "{{ else }}", '<a class="privilege-title-buy" data-noble-open="1" href="javascript:;" title="续费">续费</a>', '<a href="/cms/gong/201701/16/4753.shtml" target="_blank" class="privilege-title-faq">贵族FAQ</a>', '<span class="privilege-title-times"><em>有效期至：</em><em>{{ ndate }}</em>', "{{ if nobleConfig.endTime}}", '<em class="privilege-title-countdown">贵族还剩{{ nobleConfig.endTime }}天到期</em>', "{{ /if }}", "</span>", "{{/if}}", "{{ else }}", '<h3 class="privilege-title-h3">', '{{ nobleName ? nobleName : (nobleConfig[nl] ? nobleConfig[nl].noble_name : "") }}特权已过期', "</h3>", '<a class="privilege-title-buy" data-noble-open="1" href="javascript:;" title="续费">续费</a>', '<a href="/cms/gong/201701/16/4753.shtml" target="_blank" class="privilege-title-faq">贵族FAQ</a>', '<span class="privilege-title-times">当前在续费保护期，请及时续费</span>', "{{/if}}", "</div>", '<ul class="privilege-ls clearfix">', "{{ each list as item index }}", '<li class="privilege-items privilege-items{{ index + 1 }}">', '<a class="privilege-desc-lk" href="javascript:;">', '<img src="{{ resUrl }}{{ item.icon1 }}" width="50" height="50" alt="特权">', "</a>", '<div class="privilege-items-desc clearfix">', '<i class="lmsj-top"></i>', '<i class="lmsj-inner"></i>', '<img class="privilege-items-pic" src="{{ resUrl }}{{ item.icon4 }}" width="90" height="90">', '<div class="privilege-items-txt-wp">', '<h4 class="privilege-items-title" title="{{ item.long_name }}">{{ item.long_name }}</h4>', '<p class="privilege-items-txt" title="{{ item.description }}">{{ item.description }}</p>', "</div>", "</div>", "</li>", "{{/each}}", "{{ if icon }}", '<li class="privilege-items privilege-items6">', '<a class="privilege-desc-lk privilege-more-lk" target="_blank" href="/member/noble/privilege" title="更多特权">', '<img src="{{ resUrl }}{{ icon }}" width="50" height="50" alt="更多特权">', '<span class="privilege-items-mask"></span>', "</a>", "</li>", "{{ /if }}", "</ul>"].join(""),
				f = o.compile(u),
				h = f({
					nl: n,
					ndate: a,
					nobleName: s,
					ingf: l,
					nobleConfig: c,
					list: i,
					icon: t,
					resUrl: r.get("sys.resource_url"),
					trial: d
				});
			C.doms.nPrivilegeBox.empty().append(h)
		},
		processRoom: function() {
			var t = C.doms,
				i = h.check(),
				n = t.body.data("diy"),
				o = 0;
			"number" == typeof n ? o = n : "string" == typeof n ? o = parseInt(n, 10) : "undefined" == typeof n && (o = 0), i ? this.roomHeaderRender() : (1 === o ? t.chatTopAd.css({
				top: "0px"
			}) : t.chatTopAd.css({
				top: "105px"
			}), e('[data-login-content="no"]').removeClass("hide"))
		},
		resTaskInfoView: function(e) {
			var t = C.doms,
				i = t.loginBox.find(".l-menu .task"),
				n = t.loginBox.find(".game-info"),
				o = t.loginBox.find(".game-img"),
				a = n.find(".name"),
				r = n.find(".reward-list"),
				s = n.find(".go-task");
			o.attr("src", e.gIcon), a.text(e.gName), s.attr("href", e.gLink);
			for (var l = "", c = 0; c < e.reward.props.length && 3 > c; c++) {
				var d = e.reward.props[c];
				l += d.num > 1 ? '<div class="reward gift" data-pid="' + d.id + '"><i></i>' + d.num + "个<span>" + d.name + "</span></div>" : '<div class="reward gift" data-pid="' + d.id + '"><i></i><span><span>' + d.name + "</span></span></div>"
			}
			e.reward.props.length < 3 && e.reward.silver && (l += '<div class="reward silver"><i></i><span>' + e.reward.silver + "鱼丸</span></div>"), r.html(l), i.show()
		},
		getPropInfo: function(t) {
			var i = C.doms.loginBox.find('.reward.gift[data-pid="' + t + '"]');
			e.ajax({
				url: "/ztCache/mobilegame/getPropPacks",
				data: {
					propid: t
				},
				type: "get",
				dataType: "json",
				success: function(e) {
					if (0 === e.error) {
						if (i.find(".prop-info").length) return;
						var t = e.data.gift_data,
							n = '<div class="prop-info"><div class="arrow"></div>';
						for (var o in t) n += '<div class="prop">', n += '<img src="' + t[o].icon + '"/>', n += '<div class="name">' + t[o].prop_name + "×" + t[o].prop_cnt + "</div>", n += "</div>";
						n += "</div>", i.append(n)
					}
				}
			})
		},
		processNoRoom: function() {
			var t = this,
				i = "/lapi/member/api/getInfo?client_type=0&" + (new Date).getTime(),
				n = function(e) {
					0 === parseInt(e.error, 10) && e.msg && t.noRoomHeaderRender(e.msg)
				};
			e.ajax(i, {
				type: "get",
				dataType: "json",
				success: e.proxy(n, t)
			})
		},
		noRoomHeaderRender: function(t) {
			var n = this,
				o = C.doms,
				a = $SYS.nickname ? $SYS.nickname : "",
				s = t.info ? t.info : {},
				l = 0,
				d = t.nbl_spl || {},
				u = t.gold || {},
				f = "",
				h = "",
				p = 0,
				m = 1,
				v = $SYS.resource_url,
				y = d.trial || 0;
			gold = (u.gold || 0) / 100 + "", ngold = (u.ngb || 0) / 100 + "", ndate = parseInt(d.et, 10) ? S.convertTime(d.et) : 0, nl = d.lv || 0, m = ndate ? 0 : 1, conf = m ? t.nbl_spl && t.nbl_spl.pn && t.nbl_spl.pn.conf_pn : t.nbl_spl && t.nbl_spl.conf, f = conf && conf.nbn, h = conf && v + conf.symbol.web_pic2, p = t.nbl_spl && t.nbl_spl.pn && t.nbl_spl.pn.pl, i.trigger("douyu.avatar.url", s.icon, "middle", n.renderAvatar), n.renderNickName(a), n.renderSilver(t.silver), n.renderGold(gold), i.trigger("mod.userinfo.updateSilverGold", {
				silver: t.silver,
				gold: gold,
				ngold: ngold
			}), n.identify(t), n.updateUserInfo(t), s && s.orm && n.renderLiveSet(s.orm), nl && d.nr && 1 == d.nr.rmh && R.init(t.hs), (nl || p) && (l = nl ? nl : p, c.load(n.urls.descsUrl + l + ".json", "nobleCopywriting" + l, function(t) {
				var i = e.map(t || [], function(e, t) {
					return e.usable ? e : void 0
				}).slice(0, 5);
				c.load(n.urls.otherIcons, "nobleGlobalConfig", function(e) {
					n.handleNoblePrivilege({
						nl: nl ? nl : p,
						ndate: ndate,
						nobleName: f,
						ingf: m,
						trial: y
					}, e.more_privilege_icon, i), m ? g(".nobility-privilege .privilege-items") : (o.ngBox.show().html(ngold), parseFloat(ngold) || o.loginEle.find(".y3-mask").hide(), 1 != y && o.nGoldBox.show(), o.nicon.html('<img class="nobility-icon" src="' + h + '" alt="贵族">'))
				})
			})), s && 1 === parseInt(s.orm, 10) ? C.doms.nPrivilegeBox.empty().html('<a class="head-guild-entry" href="//mp.douyu.com/club/home" target="_blank" title="直播有组织，更上一层楼" ><img src="' + r.get("sys.web_url") + 'app/douyu/res/com/guild-entry-banner.jpg?20180307" width="350" height="98"></a>') : nl || p || c.load(n.urls.otherIcons, "nobleGlobalConfig", function(e) {
				C.doms.nPrivilegeBox.empty().html('<a class="privilege-promote" data-noble-open="1" href="javascript:;" target="_blank" title="查看贵族特权" ><img src="' + r.get("sys.resource_url") + e.home_drop_pub_img + '" width="350" height="98"></a>')
			}), this.bindEvt()
		},
		renderLiveSet: function(e) {
			var t = C,
				i = r.get("sys.own_room"),
				n = t.doms.loginBox.find(".live-set").find("p"),
				o = t.doms.loginBox.find(".live-set-a"),
				a = t.doms.loginBox.find(".live-hot");
			"undefined" != typeof e ? 1 === parseInt(e, 10) ? (n.html("直播设置"), a.addClass("hide")) : (n.html("我要直播"), o.attr({
				href: "/special/guide/anchor"
			}), a.removeClass("hide")) : 0 === parseInt(i, 10) ? (n.html("我要直播"), o.attr({
				href: "/special/guide/anchor"
			}), a.removeClass("hide")) : (n.html("直播设置"), a.addClass("hide"))
		},
		getExpInfo: function(t) {
			var i = {},
				n = this.levelExp.exp_level;
			return e.each(n, function(e, n) {
				return n.score = parseInt(e, 10), i.next = n, t < parseInt(e, 10) ? !1 : void(i.current = n)
			}), i
		},
		processIdenifyData: function(e) {
			var t = this,
				i = {};
			t.umidfy = e.its ? e.its : t.umidfy, t.emidfy = e.es ? e.es : t.emidfy, t.mbidfy = e.ps ? e.ps : t.mbidfy, i.info = {
				its: t.umidfy,
				ems: t.emidfy,
				pos: t.mbidfy
			}, t.identify(i)
		},
		identify: function(e) {
			var t, i = C,
				n = this,
				o = i.doms,
				a = e.info ? e.info : {},
				r = "no",
				s = o.loginEle.find(".uname-aut"),
				l = o.loginEle.find(".mobile-aut"),
				c = o.loginEle.find(".email-aut"),
				d = {
					its: {
						ele: s,
						no: "实名认证",
						href: "/member/cp/changeIdent",
						yes: "已认证"
					},
					pos: {
						ele: l,
						no: "绑定手机",
						href: "/member/cp/cpBindPhone",
						yes: "已绑定手机"
					},
					ems: {
						ele: c,
						no: "绑定邮箱",
						href: "/member/cp/changeEmail",
						yes: "已绑定邮箱"
					}
				};
			for (var u in a)"ems" === u && (r = "1" === a[u] ? "yes" : "no", t = d[u], n.identifySingle(t.ele, r, t[r], t.href)), "its" === u && (r = "2" === a[u] ? "yes" : "no", t = d[u], n.identifySingle(t.ele, r, t[r], t.href)), "pos" === u && (r = "1" === a[u] ? "yes" : "no", t = d[u], n.identifySingle(t.ele, r, t[r], t.href))
		},
		identifySingle: function(e, t, i, n) {
			"yes" === t ? e.find("i").addClass("high") : (e.find("i").removeClass("high"), e.attr({
				href: n,
				target: "_blank"
			})), e.attr("title", i)
		},
		updateUserInfo: function(e) {
			var t, n = C,
				o = this,
				a = n.doms;
			o.userExp = e.exp, o.userTotleExp = parseFloat(e.exp) / 100, o.exp_json = o.getExpInfo(parseInt(o.userTotleExp, 10)), o.currentLevel = o.exp_json.current.lv, t = o.currentLevel + 1, o.nextUpExp = o.exp_json.next.score, o.updateProgress(), i.trigger("douyu.avatar.url", e.info.icon, "middle", o.renderAvatar), o.renderLevel(a.leaveImg, o.currentLevel, !1), t > n.config.highLevel ? a.leaveNextImg.hide() : o.renderLevel(a.leaveNextImg, t, !0)
		},
		returnUlevelClass: function(e, t) {
			var i = C,
				o = "";
			return o = e ? n.string.format("{0}{1}", t ? "level-next-" : "level-", e < i.config.highLevel + 1 ? e : i.config.highLevel) : "level-next-1"
		},
		imgType: function(e, t) {
			var i = "";
			return i = e >= 70 ? "" : "level-bgpng", t && (i = "level-bgpng"), i
		},
		imgSize: function(e) {
			var t = "";
			return t = e >= 100 ? "level-size2" : " level-size1"
		},
		updateProgress: function() {
			var e = this,
				t = C.doms,
				i = e.multiplication(e.exp_json.current.score),
				n = e.multiplication(e.userTotleExp),
				o = e.multiplication(e.nextUpExp),
				a = e.multiplication(n - i) / (o - i),
				r = (o - n) / 100;
			return a = e.formatDecimals(a, 1), e.userTotleExp < e.nextUpExp ? (e.renderExpProgress(a), r = e.formatDecimals(r, 2), t.curExpBoxNum.html(r)) : e.renderExpProgress(100), e.userTotleExp >= C.config.highLevelExp ? void t.curExpBoxNum.parent().html("您已经达到最高等级") : void 0
		},
		roomHeaderRender: function() {
			var t = this,
				n = C.doms;
			t.getFlashData(), i.trigger("mod.room.diy.layout"), n.chatTopAd.css({
				top: 0
			}), e('[data-login-content="no"]').addClass("hide")
		},
		getFlashData: function() {
			var e = this;
			C.doms;
			i.on("mod.login.userinfo", function(t) {
				e.renderUserInfo(t), e.renderLiveSet()
			}), i.on("mod.header.identify", function(t) {
				e.processIdenifyData(t)
			})
		},
		renderUserInfo: function(t) {
			var n = C,
				o = this,
				a = n.doms,
				s = r.get("sys.resource_url"),
				l = v.decode(t),
				d = parseInt(v.get(l, "nl")) || 0,
				u = v.get(l, "silver"),
				f = v.get(l, "gold") / 100 + "",
				h = (v.get(l, "ngb") || 0) / 100 + "",
				p = (parseInt(v.get(l, "ngets")), parseInt(v.get(l, "nets"))),
				m = p ? S.convertTime(p) : 0,
				y = p ? 0 : 1,
				_ = parseInt(v.get(l, "npl")) || 0,
				b = $SYS.nickname ? $SYS.nickname : "",
				w = parseInt(v.get(l, "try")) || 0,
				k = 0,
				x = r.get("room.nobleConfig") || {},
				j = x[d] ? s + x[d].symbol.web_symbol_pic2 : "",
				T = 0;
			p > 0 && (T = Math.ceil((p - (new Date).getTime() / 1e3) / 3600 / 24)), x.endTime = T, i.trigger("douyu.avatar.url", v.get(l, "ic"), "middle", o.renderAvatar), f = o.formatDecimals(f, 2), h = o.formatDecimals(h, 2), o.renderNickName(b), (d || _) && (k = d ? d : _, c.load(o.urls.descsUrl + k + ".json", "nobleCopywriting" + k, function(t) {
				var i = e.map(t || [], function(e, t) {
					return e.usable ? e : void 0
				}).slice(0, 5);
				c.load(o.urls.otherIcons, "nobleGlobalConfig", function(e) {
					o.handleNoblePrivilege({
						nl: d ? d : _,
						ndate: m,
						nobleConfig: x,
						ingf: y,
						trial: w
					}, e.more_privilege_icon, i), y ? g(".nobility-privilege .privilege-items") : (a.ngBox.show().html(h), parseFloat(h) || a.loginEle.find(".y3-mask").hide(), 1 != w && a.nGoldBox.show(), a.nicon.html('<img class="nobility-icon" src="' + j + '" alt="贵族">'))
				})
			}), o.handleNoblePrivilege({
				nl: d ? d : _,
				ndate: m,
				nobleConfig: x,
				ingf: y,
				trial: w
			}));
			var I = r.get("sys.own_room");
			1 === parseInt(I, 10) ? C.doms.nPrivilegeBox.empty().html('<a class="head-guild-entry" href="//mp.douyu.com/club/home" target="_blank" title="直播有组织，更上一层楼" ><img src="' + r.get("sys.web_url") + 'app/douyu/res/com/guild-entry-banner.jpg?20180307" width="350" height="98"></a>') : d || _ || c.load(o.urls.otherIcons, "nobleGlobalConfig", function(e) {
				C.doms.nPrivilegeBox.empty().html('<a class="privilege-promote" data-noble-open="1" href="javascript:;" target="_blank" title="查看贵族特权" ><img src="' + r.get("sys.resource_url") + e.home_drop_pub_img + '" width="350" height="98"></a>')
			}), o.silver = parseFloat(u), o.gold = parseFloat(f), o.ngold = parseFloat(h), o.renderSilver(o.silver), o.renderGold(o.gold), i.trigger("mod.userinfo.updateSilverGold", {
				silver: o.silver,
				gold: o.gold,
				ngold: o.ngold
			}), o.exprienceUpdate(t), i.trigger("mod.userinfo.userinfoready", {
				msg: "用户信息初始化完成",
				silver: o.silver,
				gold: o.gold,
				ngold: o.ngold
			}), this.bindEvt()
		},
		exprienceUpdate: function(e) {
			var t, n = C,
				o = this,
				a = n.doms,
				r = v.decode(e);
			o.userId = v.get(r, "uid"), o.diffExp = parseFloat(v.get(r, "diff")) / 100, o.userTotleExp = parseFloat(v.get(r, "exp")) / 100, o.exp_json = o.getExpInfo(parseInt(o.userTotleExp, 10)), o.currentLevel = parseInt(v.get(r, "level"), 10), t = o.currentLevel + 1, i.trigger("mod.userinfo.currentLevel", o.currentLevel), o.nextUpExp = o.exp_json.next.score, o.updateProgress(), o.renderLevel(a.leaveImg, o.currentLevel, !1), t > n.config.highLevel ? a.leaveNextImg.hide() : o.renderLevel(a.leaveNextImg, t, !0), o.userId && $SYS.uid == o.userId && i.trigger("mod.chatrank.cqrankupdate", o.currentLevel)
		},
		curStrByLen: function(e, t) {
			var i, n = 0,
				o = e.length,
				a = "",
				r = 0;
			for (r = 0; o > r; r++) if (i = e.charAt(r), n++, escape(i).length > 4 && n++, a = a.concat(i), n >= t) return a = a.concat("...");
			return t > n ? e : void 0
		},
		formatDecimals: function(e, t) {
			var i = new RegExp("(\\.\\d{" + t + "})\\d*$"),
				n = e + "",
				o = n.replace(i, "$1");
			return o = this.formatDotZero(o)
		},
		formatDotZero: function(e) {
			var t = /(\.\d+)0+$/;
			return e = e.replace(t, "$1"), parseInt(e, 10) == e && (e = parseInt(e, 10)), e
		},
		multiplication: function(e) {
			var t = String(e),
				i = t.length,
				n = t.indexOf("."),
				o = t;
			if (-1 === n && e >= 1) o = 100 * t + "";
			else {
				switch (i - n - 1) {
				case 1:
					o = t + "0";
					break;
				case 2:
					o = t;
					break;
				default:
					o = t.substring(0, n + 3)
				}
				o = Number(o.replace(".", ""))
			}
			return o
		},
		renderSilver: function(e) {
			C.doms.silverBox.html(e)
		},
		renderGold: function(e) {
			C.doms.goldBox.html(e)
		},
		renderNickName: function(e) {
			C.doms.userName.html(e).attr("title", e)
		},
		renderAvatar: function(e) {
			var t = C.doms;
			t.headerImg.attr("src", e), t.loginEle.find(".l-pic img").attr("src", e)
		},
		renderExpProgress: function(e) {
			var t = C.doms,
				i = e + "%";
			t.curExpBox.width(i), t.curExpText.text(i)
		},
		renderLevel: function(e, t, i) {
			var n = C.config.highLevel,
				o = this.returnUlevelClass(t, i),
				a = this.imgType(t, i),
				r = this.imgSize(t),
				s = n + 1 > t ? t : n;
			e.removeClass().addClass("user-level " + o + " " + r + " " + a), e.attr("title", "用户等级：" + s)
		},
		reqTaskData: function() {
			var e = this,
				t = $SYS.webconfUrl + "/resource/mgame/task/nav_popup_task.json";
			c.load(t, "navPopupPromoteTask", function(t) {
				t && e.resTaskInfoView(t)
			})
		},
		bindEvt: function() {
			var e = C.doms;
			e.loginEle.on("click", ".privilege-title-buy", function() {
				return i.trigger("mod.normal.noble.buy"), !1
			}), e.loginEle.on("click", ".go-task", function() {
				DYS.sub({
					action_code: "click_topnavi_tab_dotask"
				})
			}), e.nPrivilegeBox.on("click", ".head-guild-entry", function() {
				DYS.sub({
					action_code: "click_topnavi_tab_guildbanner"
				})
			})
		},
		renderAll: function() {
			var t = ['<i class="lmsj-top"></i>', '<div class="uinfo-dropmenu">', '<div class="box1 chat-member" >', '<div class="chat-mem-con clearfix">', '<div class="mem-pic">', '<a href="/member/cp" target="_blank" data-login-user="img-href">', '<img src="{{defAvatar}}" data-login-user="header-img">', "</a>", '<span class="JS_userinfonobleicon">', "</span>", "</div>", '<div class="logname">', '<a class="name" data-login-user="user-name" href="/member/cp" target="_blank"></a>', "</div>", '<div class="authenticate">', '<a class="uname-aut"><i class="high"></i></a>', '<a class="mobile-aut"><i class="high"></i></a>', '<a class="email-aut"><i class="high"></i></a>', '<a class="client-sign" href="/client/pcclientsign" target="_blank"></a>', "</div>", '<div class="level-con clearfix">', '<a class="user-level user-level-loading"  data-login-user="level-img" href="/member/mylevel" target="_blank"></a>', '<a class="bar fl" href="/member/mylevel" target="_blank" data-exp-bar="btn">', '<div class="bar-per-wp">', '<span class="bar-per" data-login-user="exp" style=""></span>', "</div>", '<span class="bar-num" data-login-user="exp-txt"></span>', '<div class="level-tip hide" data-exp-bar="box">', '<p>还需 <em data-login-user="up-exp-num"></em> 经验值到达下一级</p>', "<i></i>", "</div>", "</a>", '<a class="user-level-next user-level-loading"  data-login-user="level-next-img"  href="/member/mylevel" target="_blank"></a>', "</div>", '<a class="invisible is-invisible">进房间隐身', '<span class="invisible-sp">', '<i class="icon-invisible"></i>', "关闭进房间隐身", "</span>", '<span class="is-invisible-sp">', '<i class="icon-invisible"></i>', "开启隐身，隐藏进场信息", "</span>", "</a>", '<a class="logout" href="javascript:;" >登出</a>', "</div>", "</div>", '<div class="nobility-privilege"></div>', '<div class="box4 wallet">', '<div class="wallet-con clearfix">', '<div class="fl">', '<h2 class="title">我的钱包</h2>', '<div class="m-wealth">', '<span class="y1" title="做任务可获得鱼丸">鱼丸 <em data-login-user="silver"><img src="{{staticUrl}}/app/douyu/res/page/room-normal/loading.gif"></em></span>', '<span class="y2">鱼翅 <em data-login-user="gold"><img src="{{staticUrl}}/app/douyu/res/page/room-normal/loading.gif"></em></span>', '<a class="y3" href="/member/noble/record" target="_blank">', '(贵族鱼翅<em data-login-user="nobleGold"></em>)', '<span class="y3-mask">', '<i class="y3-mask-arrow"></i>', "在贵族生效期间一直有效", "</span>", "</a>", "</div>", "</div>", '<a class="r-com-btn getYc fr" href="javascript:;" data-pay="hIframe">充值</a>', "</div>", "</div>", '<div class="box5 task clearfix">', '<h2 class="task-title">我的任务</h2>', '<div class="task-con">', '<img class="fl game-img"/>', '<div class="fl game-info">', '<div class="game-title"><span class="name"></span><span class="reward-text">可获得</span></div>', '<div class="reward-list"></div>', '<a class="go-task" href="" target="_blank">做任务</a>', "</div>", "</div>", "</div>", '<div class="box6 uim-foot">', '<ul class="clearfix">', '<li class="personal-center">', '<a href="/member" class="pc-a " target="_blank">', "<i></i>", "<p>个人中心</p>", '<b class="person-icon hide"></b>', "</a>", "</li>", '<li class="focus">', '<a href="/directory/myFollow" class="focus-a " target="_blank">', "<i></i>", "<p>我的关注</p>", "</a>", "</li>", '<li class="message">', '<a href="/member/pm" class="message-a " target="_blank">', "<i></i>", "<p>站内信</p>", '<b class="mes-icon hide"></b>', "</a>", "</li>", '<li class="live-set">', '<a href="/room/my" class="live-set-a " target="_blank">', "<i></i>", '<em class="live-hot hide"></em>', "<p>直播设置</p>", "</a>", "</li>", "</ul>", "</div>", "</div>"],
				i = o.compile(t.join("")),
				n = i({
					staticUrl: r.get("sys.web_url"),
					defAvatar: r.get("sys.res_url") + "douyu/images/defaultAvatar.png?20180208"
				});
			e(".o-login .l-menu").html(n)
		}
	}, L.renderAll(), x = t({
		init: function(t) {
			this.config = e.extend(!0, {}, {
				target: "#header",
				onLogin: function() {},
				onReg: function() {},
				onExit: function() {},
				highLevel: 120,
				highLevelExp: 54801006,
				isHasGetHttpData: !1
			}, t), f.check(), this.getDoms(), this.render(), this.bindEvt(), this.resetSearchType(), k.init(), p.init(), i.trigger("mod.header.userinforended"), e("#header .head-nav").append("<li class='fl summer_acitivity'><a href='/actives/summer' target='_blank'></a></li>")
		},
		resetSearchType: function() {
			sessionStorage.setItem("s_type", 2)
		},
		getDoms: function() {
			var t = e('[data-login-content="yes"]');
			this.config.$el = e(this.config.target), this.doms = {
				loginBox: t,
				silverBox: t.find('[data-login-user="silver"]'),
				goldBox: t.find('[data-login-user="gold"]'),
				ngBox: t.find('[data-login-user="nobleGold"]'),
				nicon: t.find(".JS_userinfonobleicon"),
				nGoldBox: t.find(".y3"),
				curExpBox: t.find('[data-login-user="exp"]'),
				curExpBoxNum: t.find('[data-login-user="up-exp-num"]'),
				curExpText: t.find('[data-login-user="exp-txt"]'),
				expBarBtn: t.find('[data-exp-bar="btn"]'),
				expBarTip: t.find('[data-exp-bar="box"]'),
				headerHref: t.find("[data-login-user]"),
				headerImg: t.find('[data-login-user="header-img"]'),
				userName: t.find('[data-login-user="user-name"]'),
				leaveImg: t.find('[data-login-user="level-img"]'),
				leaveNextImg: t.find('[data-login-user="level-next-img"]'),
				skillIcon: t.find("[data-skill-icon]"),
				chargeBtn: t.find(".getYc"),
				chatTopAd: e(".chat-top-ad"),
				historyEle: this.config.$el.find(".head-oth .o-history"),
				follow: this.config.$el.find(".head-oth .o-follow"),
				unlogin: this.config.$el.find(".head-oth .o-unlogin"),
				loginEle: this.config.$el.find(".head-oth .o-login"),
				assort: this.config.$el.find(".head-nav .assort"),
				search: this.config.$el.find(".head-oth .o-search"),
				download: this.config.$el.find(".head-oth .o-download"),
				body: e("body"),
				lmsjtop: t.find(".lmsj-top"),
				funny: this.config.$el.find(".head-nav .funny"),
				nPrivilegeBox: t.find(".nobility-privilege")
			}
		},
		render: function() {
			this.doms;
			C = this, "undefined" != typeof $ROOM && L.processRoom()
		},
		login: function() {
			var t = this.doms,
				n = r.get("sys.uid"),
				o = r.get("sys.nickname"),
				a = (r.get("sys.password"), r.get("sys.own_room")),
				s = r.get("sys.res_url") + "douyu/images/defaultAvatar.png?20160822";
			o && n && (t.loginEle.find(".l-pic").html('<img src="' + s + '"/>'), "undefined" == typeof $ROOM && t.loginEle.find(".l-pic img").length && i.trigger("douyu.avatar.get", n, "middle", function(e) {
				t.loginEle.find(".l-pic img").attr("src", e)
			}), t.loginEle.find(".l-txt").text(o), t.loginEle.find('[data-login-user="user-name"]').text(o), t.historyEle.removeClass("hide"), t.follow.removeClass("hide"), t.unlogin.addClass("hide"), t.loginEle.removeClass("hide"), e(window).width() <= 1440 && e("#header .head-nav .summer_acitivity").remove(), 0 === parseInt(a, 10) && t.loginEle.find(".l-menu ul li").eq(4).remove(), b.init(), i.trigger("mod.header.userinforended"))
		},
		exit: function() {
			e.dialog.confirm("确认退出吗？", this.config.onExit)
		},
		initHead: function(e) {
			var t = document.documentElement.clientWidth || document.body.clientWidth;
			1520 >= t && t > 1376 ? (e.addClass("w1520head"), e.removeClass("w11366head")) : 1376 >= t ? (e.addClass("w1366head"), e.removeClass("w1520head")) : (e.removeClass("w1366head"), e.removeClass("w1520head"))
		},
		bindEvt: function() {
			var t = this,
				n = this.doms,
				o = t.config.$el.find(".head");
			this.initHead(o), e(window).resize(function() {
				t.initHead(o)
			}), S._evt_menu_toggle(n.download), n.search.find("input").on("focus", function() {
				I.flanch()
			}).on("blur", function() {
				I.narrowing()
			}).on("keydown", function(t) {
				if (13 === t.keyCode) {
					var i = e(this),
						n = i.val() || i.data("search");
					I.search(n, function() {
						i.focus()
					})
				}
			}), n.search.on("click", ".s-ico", function() {
				var e = n.search.find("input"),
					t = e.val() || e.data("search");
				return I.search(t, function() {
					e.focus()
				}), !1
			}), P("assort", ".a-pop", j.preLoadAssort, M), P("funny", ".a-pop", T.preLoadFunny, M), P("historyEle", ".h-pop", D.preLoadHistory, M), P("follow", ".f-pop", A.preLoadFollow, M), n.loginEle.on("mouseenter", function(i) {
				var n = e(this),
					o = n.data("stop"),
					a = n.data("timer");
				(new Date).getTime();
				a && clearTimeout(a), a = setTimeout(function() {
					return o ? n.data("stop", !1) : (t.config.isHasGetHttpData === !1 && (("undefined" == typeof window.$ROOM || e.isEmptyObject(window.$ROOM) || window.$ROOM && "undefined" == typeof window.$ROOM.room_id) && L.processNoRoom(), L.reqTaskData(), t.config.isHasGetHttpData = !0), void L.show())
				}, 100), n.data("timer", a)
			}).on("mouseleave", function(t) {
				var i = e(this),
					o = {
						x: t.screenX,
						y: t.screenY
					},
					a = i.data("stop"),
					r = i.data("timer");
				r && clearTimeout(r), r = setTimeout(function() {
					if (a) {
						var e = S._checkMousePointIsInArea(o, n.loginEle, n.loginEle.find(".l-menu"));
						return e || L.hide(), i.data("stop", !1)
					}
					L.hide()
				}, 100), i.data("timer", r)
			}), n.loginEle.on("mouseenter", ".l-menu", function() {
				n.loginEle.data("stop", !0), setTimeout(function() {
					n.loginEle.data("stop", !1)
				}, 100)
			}).on("mouseleave", ".l-menu", function() {
				L.hide()
			}), n.skillIcon.on("mouseenter", function() {
				var t = e(this).find(".sl-item-hover");
				t.removeClass("hide")
			}), n.skillIcon.on("mouseleave", function() {
				var t = e(this).find(".sl-item-hover");
				t.addClass("hide")
			}), n.expBarBtn.on("mouseenter", function() {
				n.expBarTip.removeClass("hide")
			}), n.expBarBtn.on("mouseleave", function() {
				n.expBarTip.addClass("hide")
			}), n.chargeBtn.on("mousedown", function() {
				try {
					DYS.storage.save("_dypay_fp", 1)
				} catch (e) {}
			}), i.on("mod.userinfo.change", function(e) {
				var t, o, a;
				e.current && (t = e.current, void 0 !== t.silver && (o = parseInt(t.silver), L.silver = o, n.silverBox.html(o), i.trigger("mod.userinfo.updateSilverGold", {
					silver: o
				})), void 0 !== t.gold && (a = t.gold, L.gold = a, n.goldBox.html(a), i.trigger("mod.userinfo.updateSilverGold", {
					gold: a
				})), void 0 !== t.ngold && (ngold = t.ngold, L.ngold = ngold, n.ngBox.html(ngold), 0 === parseFloat(t.ngold) && n.loginEle.find(".y3-mask").hide()))
			}), _.reg("room_data_ycchange", function(e) {
				var t = v.decode(e),
					o = v.get(t, "b") / 100 + "",
					a = (v.get(t, "ngb") || 0) / 100 + "";
				o.indexOf(".") > -1 && (o = o.substring(0, o.indexOf(".") + 3)), a.indexOf(".") > -1 && (a = a.substring(0, a.indexOf(".") + 3)), L.gold = parseFloat(o), L.ngold = parseFloat(a), n.goldBox.html(L.gold), n.ngBox.html(L.ngold), L.ngold || n.loginEle.find(".y3-mask").hide(), i.trigger("mod.userinfo.updateSilverGold", {
					gold: L.gold,
					ngold: L.ngold
				})
			}), _.reg("room_data_expchange", function(e) {
				v.decode(e).too();
				L.exprienceUpdate(e)
			}), n.loginEle.find(".logout").last().click(function() {
				return t.exit(), !1
			}), n.unlogin.on("click", ".u-login", function() {
				return e.isFunction(t.config.onLogin) ? (t.config.onLogin("click_topnavi_login"), !1) : void 0
			}).on("click", ".u-reg", function() {
				return e.isFunction(t.config.onReg) ? (t.config.onReg("click_topnavi_sign"), !1) : void 0
			})
		}
	});
	var R = {
		statusClass: "is-invisible",
		storagekey: "noble-header-guide",
		loaded: !1,
		init: function(e) {
			R.getDoms(), R.toggle(parseInt(e, 10)), R.bindEvent(), R.loaded = !0, R.showInvisGuide()
		},
		getDoms: function() {
			R.invis = e(".uinfo-dropmenu .invisible"), R.invis.show()
		},
		bindEvent: function() {
			R.invis.off("click").on("click", R.setInvisStatus), R.invis.on("mouseenter", function() {
				R.hideInvisGudie()
			})
		},
		show: function() {
			R.invis.show()
		},
		hide: function() {
			R.invis.hide()
		},
		toggle: function(e) {
			1 === e ? R.invis.addClass(R.statusClass) : R.invis.removeClass(R.statusClass)
		},
		setInvisStatus: function() {
			y.set(R.storagekey, 1), DYS.sub({
				action_code: "click_topnavi_stealth"
			});
			var t = R.invis.hasClass(R.statusClass) ? 0 : 1;
			e.ajax({
				url: "/member/noble/setHideStatus",
				data: {
					type: 1,
					rid: 0,
					status: t
				},
				type: "post",
				dataType: "json",
				success: function(i) {
					0 === i.code ? R.toggle(t) : e.dialog.tips_black(i.msg || "设置全站隐身失败", 1.5)
				},
				error: function() {
					e.dialog.tips_black("网络错误！", 1.5)
				}
			})
		},
		showNobleOvertimeTips: function(t) {
			var i = new Date,
				n = i.getMonth() + 1 + "-" + i.getDate(),
				o = null,
				a = ['<div class="noble-countdown-tips">', '<span class="noble-countdown-tips-arrow out">', '<span class="noble-countdown-tips-arrow inner"></span>', "</span>", '<div class="noble-countdown-tips-content">', "<span>贵族还剩" + t + "天到期</span>", "</div>", "</div>"].join(""),
				r = e(a);
			e("#header .o-login").append(r), y.set("headNobleTips", n, 86400), o = setTimeout(function() {
				e(".noble-countdown-tips").remove(), clearTimeout(o)
			}, 5e3)
		},
		showNobleHeaderGuide: function() {
			var t = y.get(R.storagekey);
			if (1 != t && !this.headerGuide) {
				var i = ['<div class="myvip--guide--login">', '<i class="guide-login--icon"></i>', '<i class="guide-login--iconbor"></i>', '<div class="guide--login--wrap">', '<a href="javascript:;" class="guide--login--close">×</a>', '<div class="login--wrap--content">', "<p>试试全站隐身进房吧！</p>", "</div>", "</div>", "</div>"].join("");
				this.headerGuide = e(i), this.headerGuide.show(), e("#header .o-login").append(R.headerGuide), this.headerGuide.on("click", ".guide--login--close", function() {
					return R.headerGuide.hide(), y.set(R.storagekey, 1), !1
				}).on("mouseenter click", function() {
					return !1
				})
			}
		},
		showInvisGuide: function() {
			var t = y.get(R.storagekey);
			1 == t || this.invisGuide || (this.invisGuide = e('<span class="myvip--guide--sp"><i class="icon--guide--sp"></i>新特权</span>').css({
				display: "block"
			}), this.invis.append(this.invisGuide))
		},
		hideInvisGudie: function() {
			this.invisGuide && this.invisGuide.fadeOut()
		}
	};
	i.on("mod.room.chat.gift.noble.info", function(e) {
		var t = 0,
			i = !1,
			n = new Date,
			o = n.getMonth() + 1 + "-" + n.getDate(),
			a = o == y.get("headNobleTips");
		if (e.nl > 0 && $ROOM) {
			var r = $ROOM.nobleConfig[e.nl] || {};
			e.nets > 0 && !a && (t = Math.ceil((e.nets - (new Date).getTime() / 1e3) / 3600 / 24), 7 >= t && (R.showNobleOvertimeTips(t), i = !0)), 1 == r.into_room_hide && (R.init(e.iha), i || R.showNobleHeaderGuide())
		}
	});
	var $ = {
		timer: null,
		init: function() {
			var e = $SYS.webconfUrl + "/resource/common/wanxingren/wxrconfig.json";
			c.load(e, "wxrconfig", function(e) {
				e && 1 === parseInt(e.isOn, 10) && ($.getDoms(), $.render(e), $.addEvent())
			})
		},
		getDoms: function() {
			var t = e("#header");
			$.headLeft = t.find(".head-nav"), $.headeRight = t.find(".head-oth"), $.wxrMenu = t.find(".wxr-menu"), $.wxrLink = $.wxrMenu.find("a"), $.wxrImage = $.wxrMenu.find("img")
		},
		render: function(e) {
			$.wxrLink.text(e.title), $.wxrLink.attr("href", e.url), e.logo && e.logo.length ? $.wxrImage.attr("src", e.logo) : $.wxrImage.hide(), $.wxrWidth = $.wxrMenu.outerWidth(!0), $.layout()
		},
		addEvent: function() {
			var t = this;
			$.wxrMenu.on("click", function() {
				DYS.sub({
					action_code: "click_topnavi_wanxingren",
					ext: {}
				})
			}), i.on("mod.header.userinforended", $.layout), e(window).resize(function() {
				t.timer = setTimeout(function() {
					$.layout(), clearTimeout(t.timer)
				}, 100)
			})
		},
		layout: function() {
			var e = $.wxrWidth;
			$.wxrMenu.is(":visible") && (e = 0);
			var t = $.headLeft.offset().left + $.headLeft.outerWidth(!0),
				i = $.headeRight.offset().left;
			e > i - t - 45 ? $.wxrMenu.addClass("status-hidden") : $.wxrMenu.removeClass("status-hidden")
		}
	},
		F = {
			url: {
				getTasksList: "/lapi/sign/questapi/getUserNewTasks"
			},
			adCenterPath: "/member/ad_quest/quest/unaccept",
			lazyTime: 3,
			time: 180,
			information: {
				readContract: null,
				readContractString: "",
				text: "",
				contract: [],
				receive: ""
			},
			doms: {
				$loginBox: x.loginBox || e('[data-login-content="yes"]')
			},
			getType: function(e) {
				return Object.prototype.toString.call(e).slice(8, -1).toLowerCase()
			},
			join: function() {
				return Array.prototype.join.call(arguments, "")
			},
			init: function() {
				var e = this;
				setTimeout(function() {
					e.check() && (e.addAdSec(), e.cacheDoms(), e.getReadContract(), e.bindEvent(), e.intervalList(e.time || 60))
				}, 1e3 * e.lazyTime)
			},
			bindEvent: function() {
				var e = this;
				e.doms.$box.on("click", ".business-tip-close", function() {
					e.doms.$readTips.prop("checked") && e.addReadContract(), e.hideTips()
				}), e.doms.$contract.on("click", "li a", function() {
					e.addReadContract(), e.hideTips()
				}), e.doms.$box.bind("mouseover", function(e) {
					e.stopPropagation()
				})
			},
			getReadContract: function() {
				var e = y.get("adBusinessContract") || "";
				this.information.readContract = e ? e.split("--") : [], this.information.readContractString = this.information.readContract.join("--")
			},
			addReadContract: function() {
				var e = this,
					t = !1,
					i = e.information.contract;
				"string" === e.getType(i) && (t = !0, e.information.readContract.push(i)), "array" === e.getType(i) && (t = !0, e.information.readContract = e.information.readContract.concat(i)), t && (e.information.readContractString = e.information.readContract.join("--"), y.set("adBusinessContract", e.information.readContractString))
			},
			checkReadContract: function(e) {
				return -1 !== this.information.readContractString.indexOf(e)
			},
			addAdSec: function() {
				var t = this.doms,
					i = this.join('<div class="business-tip">', '<i class="business-tip-icon"></i>', '<div class="business-tip-header">', '<a href="javascript:;" class="business-tip-close"></a>', "</div>", '<div class="business-tip-content">', '<div class="business-word">', '<i class="business-word-icon"></i>', '<a class="business-word-text" href="javascript:;">--</a>', "</div>", '<ul class="business-list">', "</ul>", "</div>", '<div class="business-tip-footer">', '<input type="checkbox">', "<span>不再提示</span>", "</div>", "</div>");
				t.$box = e(i), t.$loginBox.append(t.$box), t.$box.hide()
			},
			cacheDoms: function() {
				var e = this.doms,
					t = e.$box;
				e.$triangle = t.find(".business-tip-icon"), e.$text = t.find(".business-word-text"), e.$contract = t.find(".business-list"), e.$readTips = t.find(".business-tip-footer > input")
			},
			check: function() {
				return h.check() && 1 === +r.get("sys.own_room")
			},
			intervalList: function(e) {
				var t = this,
					i = e || 60,
					n = arguments;
				t.ajaxAd(), t.timeTicket = setTimeout(function() {
					n.callee.apply(t, n)
				}, 1e3 * i)
			},
			ajaxAd: function() {
				var t = this;
				e.ajax({
					url: t.url.getTasksList,
					type: "POST",
					success: function(e) {
						var i = e;
						if ("string" == typeof i) try {
							i = JSON.parse(i)
						} catch (n) {
							return void t.setReceive("")
						}
						try {
							t.setReceive(i), t.resolve()
						} catch (n) {
							return void t.setReceive("")
						}
					},
					error: function() {
						t.setReceive("")
					}
				})
			},
			setReceive: function(e) {
				this.information.receive = e
			},
			hideTips: function() {
				this.doms.$box.hide()
			},
			resolve: function() {
				var e = this,
					t = e.information;
				t.contract = [];
				var i = t.receive,
					n = i.notifyText;
				if (n) {
					n !== t.text && (t.text = n, e.doms.$text.text(n), e.doms.$text.prop("title", n));
					var o = i.tasks;
					for (var a in o) Object.hasOwnProperty.call(o, a) && (e.checkReadContract(a) || t.contract.push(a));
					return t.contract.length ? void e.randerTips() : void e.hideTips()
				}
			},
			randerTips: function() {
				var e = this,
					t = e.information;
				if (!e.rander) {
					var i = e.join("{{each list as item}}", "<li>", "<i></i>", '<a href="{{path}}" target="_blank" data-tasks="{{item}}" title="{{tasks[item].title}}">{{tasks[item].title}}</a>', "</li>", "{{/each}}");
					e.rander = o.compile(i)
				}
				var n = e.rander({
					list: t.contract,
					tasks: t.receive.tasks,
					path: e.adCenterPath
				});
				e.doms.$contract.empty().append(n), e.doms.$box.show()
			}
		},
		q = {
			getMaskTpl: function() {
				var e, t;
				return e = n.string.join('<div class="common-pay-mask" style="position: fixed; z-index: 9999; top: 0; left: 0; right: 0; bottom: 0;background: rgba(0, 0 , 0, .6); text-align: center; margin: auto;">', '<div style="position: relative;display: inline-block; width: 712px; height: 542px; border:none; vertical-align: middle; border-radius: 5px;">', '<a class="close J_pay_iframe_close" href="javascript:;" style="position: absolute;right: 10px;top: 2px; padding: 0px 10px;cursor: pointer;z-index: 5;">', '<em style="display: inline-block;font-size: 30px;color: #fff;font-weight: 400;">×</em>', "</a>", '<iframe style="position: relative;display: inline-block; width: 712px; height: 542px; border-radius: 5px; vertical-align: middle;" id="login-passport-frame" scrolling="no" frameborder="0" src="{{ url }}"></iframe>', "</div>", '<div class="common-pay-holder" style="display: inline-block;vertical-align: middle;height: 100%;width: 1px;visibility: hidden;"></div>', "</div>"), t = o.compile(e)
			},
			init: function() {
				var t = (r.get("sys.pay_site_host").replace(/^http(s?):/, "").replace(/\/$/g, ""), this);
				e("body").on("click", '[data-pay="hIframe"]', function() {
					return t.showIframePay(), !1
				}), e("body").on("click", ".J_pay_iframe_close", function() {
					e(".common-pay-mask").remove()
				})
			},
			showIframePay: function() {
				var t = this.getMaskTpl(),
					i = r.get("sys.pay_site_host").replace(/^http(s?):/, "").replace(/\/$/g, ""),
					n = e(".common-pay-mask");
				return h.check() ? (n.length && n.remove(), e("body").append(t({
					url: i + "/item/gold/iframe?pageCode=" + DYS.sub.getPageCode() + "&source=0"
				}))) : h.show("login"), !1
			}
		},
		z = {
			init: function(t) {
				return videoEntry.init(), $.init(), d.init(), q.init(), F.init(), w.init(), l.aop("clean", "header-assort", function(t) {
					if (t && 1 == t.id) {
						var i = e(t.el);
						i[i.html() ? "removeClass" : "addClass"]("hide")
					}
				}), l.aop("clean", "header-game", function(t) {
					if (t && 2 == t.id) {
						var i = e(t.el);
						i[i.html() ? "removeClass" : "addClass"]("hide")
					}
				}), l.aop("clean", "history", function(t) {
					if (t && 24 == t.id) {
						var i = e(t.el);
						i[i.html() ? "removeClass" : "addClass"]("hide")
					}
				}), l.aop("clean", "attention", function(t) {
					if (t && 23 == t.id) {
						var i = e(t.el);
						i[i.html() ? "removeClass" : "addClass"]("hide")
					}
				}), C ? void 0 : C = new x(t)
			}
		};
	return z
}), define("douyu/page/room/normal/mod/video", ["jquery", "shark/observer", "shark/ext/swfobject", "shark/util/cookie/1.0", "shark/util/storage/1.0", "shark/util/flash/data/1.0", "douyu/context", "douyu/page/room/base/api", "douyu/com/flash-check"], function(e, t, i, n, o, a, r, s, l) {
	var c = {
		crsf: "/curl/csrfApi/getCsrfCookie",
		getCSRFCookie: function(t) {
			var i = this,
				o = n.get(r.get("sys.tvk"));
			return o ? void(t && t({
				name: $SYS.tn,
				value: o
			})) : void e.ajax({
				url: i.crsf,
				type: "GET",
				dataType: "json",
				success: function(e) {
					0 === +e.error && i.getCSRFCookie(t)
				}
			})
		}
	},
		d = {
			flash: {
				id: "douyu_room_flash_proxy",
				box_id: "douyu_room_normal_flash_proxy_box",
				ver: "11.1.4",
				full_key: "douyu_room_flash_full",
				state: {
					full: "full",
					norm: "norm"
				}
			},
			fullClass: {
				flashBox: "flash-fullpage",
				bodyBox: "body-flash-fullpage"
			}
		},
		u = {},
		f = {},
		h = {};
	u.URL = {
		param: function(e) {
			var t, i;
			return e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"), t = new RegExp("[\\?&]" + e + "=([^&#]*)"), i = t.exec(location.search), null == i ? "" : decodeURIComponent(i[1].replace(/\+/g, " "))
		}
	}, f.build = function() {
		l.check("#js-room-video");
		var t, o = (r.get("room.args"), r.get("room.effectConfig")),
			a = r.get("room.flashConfig"),
			s = r.get("room.is_video_high_quality_time"),
			c = r.get("room.video_high_quality_resolution"),
			f = r.get("room.video_high_quality_num"),
			h = r.get("sys.webconfUrl"),
			p = {},
			g = {},
			m = {};
		"undefined" !== s && "undefined" !== c && "undefined" !== f && (t = [parseInt(c), parseInt(f), parseInt(s)]), p.DomainName = window.location.host, p.cdn = u.URL.param("cdn"), p.asset_url = r.get("sys.res_url"), p.checkowne = r.get("sys.uid") == r.get("room.owner_uid") ? 1 : 0, p.usergroupid = r.get("sys.groupid"), p.uid = r.get("sys.uid") || 0, p.Servers = r.get("room.args.server_config"), p.RoomId = r.get("room.room_id"), p.RoomTitle = r.get("room.room_name"), p.OwnerId = r.get("room.owner_uid"), p.Status = 1 === r.get("room.show_status"), p.roompass = r.get("room.room_pwd"), navigator.appVersion.indexOf("MSIE") > 0 ? p.barrage_delay_time = 400 : p.barrage_delay_time = 250, r.get("room.eticket") && (p.eticket = r.get("room.eticket")), p.phonestatus = n.get("phonestatus") || 0, p.effectConfig = o ? escape(JSON.stringify(o)) : "", p.flashConfig = a ? escape(JSON.stringify(a)) : "", p.effectSwf = r.get("room.effectSwf"), p.avatar_url = r.get("sys.avatar_url"), p.sbe = !("addEventListener" in window), h && (p.webconfUrl = h), p.definitionConfig = t ? escape(JSON.stringify(t)) : "", p.logUrl = r.get("sys.fh2") || "", g.quality = "high", g.bgcolor = "#333333", g.allowscriptaccess = "always", g.allowfullscreen = "true", g.wmode = "Opaque", g.allowFullScreenInteractive = "true", m.id = d.flash.id, m.name = d.flash.id, m.align = "middle", m.allowscriptaccess = "always", m.allowfullscreen = "true", m.allowFullScreenInteractive = "true";
		var v = e("#" + d.flash.box_id);
		require.use(["douyu-liveH5/live/js/player"], function(e) {
			e.load({
				root: v[0],
				id: d.flash.id,
				flashvars: p,
				params: g,
				attributes: m
			})
		}), i.createCSS(d.flash.box_id, "display:block;text-align:left;")
	}, h.pageFull = function() {
		var t = e("body"),
			i = e("#" + d.flash.id),
			n = i.parent();
		document.body.style.overlfow = "hidden", document.documentElement.style.overflow = "hidden", n.addClass(d.fullClass.flashBox), t.data(d.flash.full_key, !0).addClass(d.fullClass.bodyBox), "undefined" != typeof $ROOM.isActive && 1 === parseInt($ROOM.isActive) && s.exe("js_page_fullscreen_state", 1)
	}, h.pageNorm = function() {
		var t = e("body"),
			i = e("#" + d.flash.id),
			n = i.parent();
		document.body.style.overlfow = "auto", document.documentElement.style.overflow = "auto", n.removeClass(d.fullClass.flashBox), t.data(d.flash.full_key, !1).removeClass(d.fullClass.bodyBox)
	}, h.pageToggle = function(i) {
		var n = e("body");
		void 0 !== i && null !== i || (i = n.data(d.flash.full_key)), i ? h.pageNorm() : h.pageFull(), t.trigger("mod.video.state.change", !i), t.trigger("mod.chat.height.change"), t.trigger("mod.normal.pagefull.videoSidebar.toggle"), t.trigger("mod.normal.pagefull.videoSidebarStateInit")
	};
	var p = e("#js-room-video"),
		g = {
			illeaglMsg: function(e) {
				this.showIlleaglMsgTpl(e)
			},
			showIlleaglMsgTpl: function(t) {
				var i = p.find('[data-video-illeagl="illeag"]'),
					n = p.find(".watch"),
					o = e('[data-super-meun="js-set-violation-remind"]');
				1 == parseInt(t.flag) ? i.length ? (i.show(), o && (o.html("关闭违规提醒"), o.attr("data-isopen", 0))) : (p.append(this.checkTpl(t.data.context, this.userrole)), p.append('<div class="watch"></div>'), 4 != this.roll && 2 != this.roll || this.illRemindCountdown(t.data.startTime, t.data.serverTime), 4 == this.roll && o && (o.html("关闭违规提醒"), o.attr("data-isopen", 0))) : (i.hide(), n.hide(), o.length && (o.html("开启违规提醒"), o.attr("data-isopen", 1)), this.removeIllegalRemind())
			},
			checkTpl: function(e, t) {
				var i = "";
				return e = e ? e : this.info.supremindtip, -1 != t.indexOf(4) && -1 == t.indexOf(2) ? (i = '<div class="super-illremtip" data-video-illeagl="illeag"><a style=""></a><p>该直播间涉嫌违规正在处理中...</p><p>主播整改已用时<span class="cdTime" data-illeag-time="time">02分:36秒</span></p></div>', this.roll = 4) : -1 != t.indexOf(2) && (i = '<div class="anchor-illremtip" data-video-illeagl="illeag"><div class="con"><p style="top: 42px;">' + e + '<span style="text-align: center; display: block; color: #ff0000;">已用时<span class="cdTime" data-illeag-time="time">02分:36秒</span></span></p></div></div>', this.roll = 2), i
			},
			illRemindCountdown: function(t, i) {
				var n = this,
					a = (new Date).getTime(),
					r = i - t,
					s = 36e5,
					l = parseInt(r);
				if (s > l) {
					var c = l % 36e5,
						d = parseInt(c / 6e4),
						u = c % 6e4,
						f = parseInt(u / 1e3);
					d = 10 > d ? "0" + d : d, f = 10 > f ? "0" + f : f;
					var h = d + "分:" + f + "秒";
					e(".super-illremtip .cdTime, .anchor-illremtip .cdTime").length > 0 && e(".super-illremtip .cdTime, .anchor-illremtip .cdTime").html(h), n.timer = setTimeout(function() {
						var e = (new Date).getTime() - a,
							o = i + e;
						n.illRemindCountdown(t, o)
					}, 200)
				} else if (l >= s) {
					if ($SYS.uid == $ROOM.owner_uid && o.set("illAchorCheck", JSON.stringify({
						roomid: $ROOM.owner_uid,
						flag: 1
					}), 864e3), n.removeIllegalRemind(), l > s) return void clearTimeout(n.timer);
					if (5 == $SYS.groupid) {
						var p = "/" + $ROOM.room_id + "?_r=" + Math.random(1);
						location.href = p
					}
				}
			},
			removeIllegalRemind: function() {
				var t = this;
				if ($SYS.uid == $ROOM.owner_uid) {
					var i = {};
					if (o.get("illAchorCheck") && (i = JSON.parse(o.get("illAchorCheck"))), "1" == i.flag && i.roomid == $ROOM.owner_uid) {
						o.set("illAchorCheck", JSON.stringify({
							roomid: $ROOM.owner_uid,
							flag: 0
						}), 864e3);
						var n = p.find(".super-illremtip");
						n.length || (n = p.find(".anchor-illremtip")), n.length && n.remove(), clearTimeout(t.timer), p.append('<div class="anchor-cheSuccess anchorRmSuc"> <a href="javascript:;" class="close"></a></div>');
						var a = e(".anchor-cheSuccess");
						a.find(".close").click(function() {
							e(".anchorRmSuc").hide()
						}), setTimeout(function() {
							a.hide()
						}, 3e4)
					} else o.set("illAchorCheck", JSON.stringify({
						roomid: $ROOM.owner_uid,
						flag: 0
					}), 864e3), e(".anchorRmSuc").hide()
				} else {
					e(".illeagalReminds").hide(), e(".super-illremtip").hide();
					var r = e('[data-super-meun="js-set-violation-remind"]');
					r.html("开启违规提醒"), r.attr("data-isopen", 1)
				}
				e(".watch").hide()
			},
			reduceIlleaglMsg: function(e) {
				this.showReduceIlleaglMsgTpl(e)
			},
			showReduceIlleaglMsgTpl: function(e) {
				var t = '<div class="live-rule-out"><div class="lead-close"></div><p>你由于违法主播规范：<span>版权问题</span>，被扣除<span>100分</span>，请阅读<span><a href="">主播积分管理详细规则</a>。</span></p><p>合理播放内容，共同净化互联网环境！</p></div>';
				return t
			}
		};
	g.info = {
		roomid: $ROOM.owner_uid,
		supremindtip: "直播内容已经涉嫌违规，请您迅速进行整改，在整改期间，您的直播内容（包括图像和声音）都将被屏蔽。整改通过后直播间将正常播放。如果未做出整改，我们将会关闭您的直播间并扣除一定主播积分，详情请查看私信!!",
		flag: 0
	}, t.on("mod.video.showroomillega", function(e) {
		g.userrole = e.userrole.join(","), g.illeaglMsg(e)
	}), t.on("mod.video.state.get", function() {
		var t = e("body").data(d.flash.full_key);
		return t ? d.flash.state.full : d.flash.state.norm
	}), t.on("mod.video.state.norm", function() {
		h.pageNorm()
	}), t.on("mod.video.state.flashnorm", function() {
		var e = t.fire("mod.video.state.get");
		e === d.flash.state.full && s.exe("js_breakRuleTip", 1)
	}), t.on("mod.video.state.full", function() {
		h.pageFull()
	}), s.reg("room_bus_pagescr", function(e) {
		h.pageToggle(e)
	}), s.reg("room_screenChange", function(e) {
		var i = a.decode(e).too();
		t.trigger("mod.chat.sign.video.state", i)
	}), s.reg("room_data_illchange", function(t) {
		var i = e("body").data(d.flash.full_key),
			n = a.decode(t),
			r = parseInt(a.get(n, "ii")),
			l = 1e3 * parseInt(a.get(n, "timestamp")),
			c = a.get(n, "content"),
			u = 1e3 * parseInt(a.get(n, "now"));
		s.exe("js_breakRuleTip", i), i && h.pageNorm(), s.exe("js_exitFullScreen"), 0 == r && o.set("illAchorCheck", JSON.stringify({
			roomid: $ROOM.owner_uid,
			flag: 1
		}), 864e3), 1 == r ? g.illeaglMsg({
			flag: r,
			data: {
				startTime: l,
				serverTime: u,
				context: c
			}
		}) : 0 == r && g.removeIllegalRemind()
	});
	var m = !1,
		v = "hidden" in document ? "hidden" : "webkitHidden" in document ? "webkitHidden" : "mozHidden" in document ? "mozHidden" : null,
		y = function(e) {
			"undefined" == typeof document[v] || m || (m = document[v])
		};
	if (v) {
		var _ = v.replace(/hidden/i, "visibilitychange");
		m = document[v], document.addEventListener && document.addEventListener(_, y, !1)
	}
	s.reg("room_video_catchtime", function(e) {
		if (document.removeEventListener && document.removeEventListener(_, y, !1), !m && void 0 !== e && null !== e && null !== window.performance.timing && void 0 !== window.performance.timing && void 0 !== window.__player.getflashShellLoadTime && null !== window.__player.getflashShellLoadTime) {
			var t = window.performance.timing,
				i = 0,
				n = t.navigationStart,
				o = (t.loadEventEnd, e.enterFlashTimer),
				a = e.getStramUrlTimer,
				r = e.starRequstStramTimer,
				s = e.showStramTimer,
				l = e.getRoomInfoTimer,
				c = window.__player.getflashShellLoadTime(),
				d = e.enterShellTime,
				u = e.requsetCoreTime,
				f = e.getCoreTime,
				h = e.requsetRoomInfoTimer2,
				p = e.getRoomInfoTimer2,
				g = e.requestStramUrlTimer2,
				v = e.getStramUrlTimer2,
				b = e.starRequstStramTimer2,
				w = e.showStramTimer2,
				k = e.requestSDKTime,
				x = e.getSDKTime,
				C = e.type,
				S = e.service_t,
				j = e.isH5,
				T = e.is_back || 0,
				I = e.av || "";
			if (void 0 !== window.performance.getEntries) {
				var D = window.performance.getEntries().filter(function(e) {
					return "first-paint" === e.name
				});
				i = 0 !== D.length ? s - t.navigationStart : s - t.navigationStart
			} else i = s - t.navigationStart;
			var A = 0;
			if (void 0 !== window.performance.getEntries) {
				var L = window.performance.getEntries().filter(function(e) {
					return -1 !== e.name.indexOf("WebRoomNormal.swf")
				});
				A = 0 !== L.length ? o - n : o - n
			} else A = o - n;
			if (!(0 >= i || 0 >= A || 0 >= a - o || 0 >= r - a || 0 >= l - o || 0 >= s - r)) {
				var N, O, E = {},
					M = navigator.userAgent.toLowerCase();
				(N = M.match(/msie ([\d.]+)/)) ? E.ie = N[1] : (N = M.match(/firefox\/([\d.]+)/)) ? E.firefox = N[1] : (N = M.match(/chrome\/([\d.]+)/)) ? E.chrome = N[1] : (N = M.match(/opera.([\d.]+)/)) ? E.opera = N[1] : (N = M.match(/version\/([\d.]+).*safari/)) ? E.safari = N[1] : 0, !E.ie && M.match(/trident/) && (E.ie = M.match(/rv:([\d].)/)[1]), M.match(/edge\/([(\d).]+)/) && (E.edge = M.match(/edge\/([(\d).]+)/)[1]), E.ie && (O = "IE: " + E.ie), E.edge && (O = "Edge: " + E.edge), E.firefox && (O = "Firefox: " + E.firefox), E.chrome && !document.getBoxObjectFor && (O = "Chrome: " + E.chrome), E.opera && (O = "Opera: " + E.opera), E.safari && (O = "Safari: " + E.safari), window.DYS && DYS.sub.config({
					flash_url: window.$SYS ? $SYS.fh_deliver || "" : ""
				});
				var P = {};
				if (j) P = {
					prf_pl_fs_0: i,
					prf_pl_rp_0: A,
					prf_pl_sa_0: a - l,
					prf_pl_ro_0: l - o,
					prf_pl_pf_0: r - a,
					type: C,
					service_t: S,
					is_back: T
				}, 1 === C ? P.prf_pl_ss_cdn_0 = s - r : P.prf_pl_ss_p2p_0 = s - r;
				else {
					if (0 > d - c || 0 > f - u || 0 > p - h || 0 > w - b) return;
					P = {
						prf_pl_fs_0: i,
						prf_pl_rp_0: A,
						prf_pl_sa_0: a - l,
						prf_pl_ro_0: l - o,
						prf_pl_pf_0: r - a,
						prf_pl_fs_d1_0: d - c,
						prf_pl_fs_d2_0: f - u,
						prf_pl_sa_a1_0: p - h,
						prf_pl_pf_a1_0: v - g,
						type: C,
						service_t: S,
						is_back: T
					}, x && k && x - k > 0 ? P.prf_pl_p2p_d1_0 = x - k : P.prf_pl_p2p_d1_0 = 0, 1 === C ? (P.prf_pl_ss_cdn_0 = s - r, P.prf_pl_cdn_a1_0 = w - b) : (P.prf_pl_ss_p2p_0 = s - r, P.prf_pl_p2p_a1_0 = w - b)
				}
				P.bws = O, 1 === C ? DYS.sub({
					type: "flash"
				}, {
					action_code: "player_load_f",
					ct_code: j ? "h5_video" : "web",
					app_version: I,
					ext: P
				}) : 2 === C && DYS.sub({
					type: "flash"
				}, {
					action_code: "player_load_f",
					ct_code: j ? "h5_video" : "web",
					app_version: I,
					ext: P
				})
			}
		}
	}), s.reg("room_data_burst", function() {});
	var b = {
		init: function(i) {
			var n = this;
			this.config = e.extend(!0, {
				target: "#js-room-video",
				delay: 5e3,
				isFirst: !0
			}, i), this.$target = e(this.config.target), this.$target.length && t.on("mod.room.chat.gift.noble.info", function(e) {
				e.ih && n.config.isFirst && (n.config.isFirst = !1, n.render(), n.$taste.fadeIn(400).delay(n.config.delay).fadeOut(400))
			})
		},
		render: function() {
			this.$taste = e('[selector="invisible-taste"]'), this.$taste.length || (this.$taste = e('<div selector="invisible-taste" class="room-invisible-taste">您已悄悄进入房间</div>'), this.$target.append(this.$taste))
		}
	};
	e(function() {
		b.init()
	});
	var w = {
		init: function() {
			$ROOM.owner_uid == $SYS.uid && 1 == $ROOM.show_status && e.post("/turntable/tt_interaction/isIn", {
				roomid: $ROOM.room_id
			}, function(e) {
				0 == e.result && 1 == e.is_in && w.add()
			}, "json")
		},
		add: function() {
			var i, n, a = null,
				r = e('<div class="turntable-wrap"><div class="turntable-icon" id="turntable"></div><div class="turntable-tips-wrap" data-turntable="tips"><span class="turntable-tips"><span class="close-btn" data-btn="close">&times;</span><ul class="turntable-txt"><li class="turntable-tit">直播新花样！</li><li class="turntable-con">水友互动新玩法。互动转盘走一走，粉丝收益全都有！</li></ul></span></div></div>');
			r.appendTo("#js-stats-and-actions"), t.trigger("mod.chat.action.view.add", {
				flag: "turntable",
				dom: r,
				tips: "互动转盘"
			}), n = e("#js-stats-and-actions").find('[data-turntable="tips"]'), i = o.get("isTurntableShow"), n.on("click", '[data-btn="close"]', function() {
				n.remove()
			}), i || (n.show(), a = setTimeout(function() {
				n.remove(), clearTimeout(a)
			}, 3e3), o.set("isTurntableShow", !0)), r.on("click", function() {
				c.getCSRFCookie(function(t) {
					var i = {};
					i[t.name] = t.value, e.ajax({
						url: "/member/lottery/get_room_status",
						type: "GET",
						dataType: "json",
						data: i,
						success: function(t) {
							if (0 === +t.error) {
								var i = t.data,
									n = +i.status;
								return 0 !== n && 1 !== n ? void e.dialog.tips_black(i.start_info) : void s.exe("js_turntable")
							}
						}
					})
				})
			})
		}
	},
		k = {
			init: function() {
				var e = r.get("room.st");
				3 == e && s.reg("room_video_ready", k.render)
			},
			render: function() {
				setTimeout(function() {
					var t = e("#js-room-video");
					0 == t.find(".playback-tip").length && (t.append(e("<div class='playback-tip'></div>")), e("#js-room-video .playback-tip").click(function() {
						k.hide()
					}), setTimeout(function() {
						k.hide()
					}, 15e3))
				}, 5e3)
			},
			hide: function() {
				var t = e("#js-room-video .playback-tip");
				t.is(".over") || (t.addClass("over"), setTimeout(function() {
					e(t).hide()
				}, 2e3))
			}
		};
	return {
		init: function() {
			w.init(), k.init(), s.set("flash.id", d.flash.id), f.build()
		}
	}
}), define("douyu/page/room/normal/mod/layout", ["jquery", "shark/observer", "douyu/com/left", "douyu/com/user"], function(e, t, i, n) {
	var o = {
		MIN_WIDTH: 1366,
		isLeftOpen: !0
	},
		a = {},
		r = {};
	return a.init = function() {
		a.$win = e(window), a.$main = e("#mainbody"), a.$left = e("#left"), a.$mainLeft = e("#js-live-room-normal-left"), a.$mainRight = e("#js-live-room-normal-right"), a.$video = e("#js-room-video"), a.$actions = e("#js-stats-and-actions"), a.$rank = e("#js-fans-rank"), a.$chatCont = e("#js-chat-cont"), a.$chatContWrap = a.$chatCont.find('[data-type="chat-cont"]'), a.$chatSpeak = e("#js-chat-speak"), a.$noLogin = e(".no-login"), a.$member = e(".chat-member"), a.$anchorInfo = e("#anchor-info"), a.$headline = a.$mainLeft.find(".headline"), a.$h1 = a.$headline.find("h2"), a.$tag = a.$headline.find(".head-room-tag"), a.$report = a.$headline.find(".feedback-report-button"), a.islog = n.check(), a.$playerSub = e(".PlayerCaseSub-Main"), a.islog || a.$playerSub.addClass("is-unlogin"), a.layout(), t.on("mod.video.state.change", function(e) {
			a.layout()
		}), t.on("mod.sign.start", function() {
			a.$chatContWrap.attr("sign-start", 1), a.layoutChatCon()
		}), t.on("mod.sign.end", function() {
			a.$chatContWrap.attr("sign-start", 0)
		}), t.on("mod.chat.height.change", function() {
			a.layoutChatCon()
		})
	}, a.layoutChatCon = function() {
		t.trigger("mod.chat.gift.layout")
	}, a.layout = function() {
		a.$win.width() <= o.MIN_WIDTH ? t.trigger("mod.layout.screen.change", "small") : t.trigger("mod.layout.screen.change", "normal"), t.trigger("mod.normal.title.layout");
		var i = a.$anchorInfo.find(".video-recording"),
			n = 0,
			r = 0;
		i.length > 0 && i.is(":visible") && (r = i.outerWidth(!0));
		var s = e(".room-emperor-recommend");
		s.length > 0 && s.is(":visible") && (n += s.outerWidth(!0));
		var l = 0 === e(".no-anchor-impress").length,
			c = l ? 350 : 300;
		a.$headline.css({
			width: a.$mainLeft.width() - c - r
		}), a.$h1.css({
			"max-width": a.$mainLeft.width() - c - 32 - n - r
		}), t.trigger("mod.layout.guess"), t.trigger("mod.normal.chat.gift.slider"), t.trigger("mod.layout.set.googleIconHide"), t.trigger("mod.normal.gift.expand"), a.layoutChatCon(), t.trigger("mod.normal.recommand.layout"), t.trigger("mod.normal.achorinfo.layout"), t.trigger("mod.normal.taobaogoods.layout"), t.trigger("mod.normal.h5player.layout"), t.trigger("mod.layout.set.googleIcon")
	}, r.init = function() {
		var e = null;
		a.$win.resize(function() {
			navigator.userAgent.indexOf("MSIE 7.0") > 0 ? (e && clearTimeout(e), e = setTimeout(function() {
				a.layout()
			}, 50)) : a.layout()
		}), i.onToggle(function(e) {
			"full" !== t.fire("mod.video.state.get") && ("open" === e ? o.isLeftOpen = !0 : o.isLeftOpen = !1, a.layout(), t.trigger("douyu.activity.fishpond"))
		})
	}, {
		init: function() {
			a.init(), r.init()
		}
	}
}), define("douyu/page/room/normal/mod/title", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/cookie/1.0", "shark/util/template/1.0", "shark/util/flash/data/1.0", "douyu/context", "douyu/page/room/base/api", "douyu/com/user", "shark/util/storage/1.0", "douyu/com/exjsonp"], function(e, t, i, n, o, a, r, s, l, c, d) {
	var u = {},
		f = {
			data: null,
			promise: e.Deferred(),
			isLoading: 0,
			load: function() {
				var e = this,
					t = e.promise,
					i = r.get("sys.webconfUrl") + "resource/common/coin_weight/web_show_switch.json";
				return e.data ? t.resolve(e.data) : e.isLoading ? t : (e.isLoading = 1, d.load(i, "coinShowSwitch", function(i) {
					i ? (e.data = i, t.resolve(e.data)) : t.reject()
				}, function() {
					t.reject()
				}), t.promise())
			}
		},
		h = {
			getDoms: function() {
				var t = e("#anchor-info");
				this.doms = {
					anchorInfoContent: t,
					anchorPic: t.find(".anchor-pic"),
					fansNum: t.find('[data-anchor-info="nic"]'),
					followBtn: t.find('[data-anchor-info="follow"]'),
					followedBtn: t.find('[data-anchor-info="followed"]'),
					weightBox: t.find('[data-anchor-info="weighttit"]'),
					hotBox: t.find('[data-anchor-info="hot"]'),
					olUmBox: t.find('[data-anchor-info="ol-num"]'),
					lastTimeBox: t.find('[data-anchor-info="timetit"]'),
					feedBackReportButton: t.find("#feedback-report-button"),
					tips: t.find('[data-tip-title="tip"]'),
					feedbackBtn: t.find(".feedback-report-button"),
					privateLetterBtn: t.find(".zb-sendmsg-icon"),
					shareContent: t.find("#share-content"),
					relseTag: t.find(".r-else")
				}
			},
			renderFedDoms: function() {
				if (1 !== e("#anchor-info [data-anchor-info=hot]").length) {
					var t = e(i.string.join("<li>", '<a href="//www.douyu.com/cms/gong/201711/17/6722.shtml" target="_blank" class="hot-box" data-tip-title="tip">', '<div class="tip" style="display: none;">', '<div class="arrow"></div>', "点击查看热度介绍", "</div>", '<div class="hot-v-con">', '<i class="hot-v-icon"></i>', '<span  class="hot-v" data-anchor-info="hot"></span>', "</div>", "</a>", "</li>"));
					e(".r-else .weight-box").closest("li").before(t)
				}
			},
			init: function() {
				var i, n = this;
				this.renderFedDoms(), this.getDoms(), i = n.doms, this.is_follow_loading = !1, i.weightBoxWrap = i.weightBox.closest("li").addClass("anchorweight"), f.load().then(function(e) {
					0 === e.show_switch ? i.weightBoxWrap.hide() : i.weightBoxWrap.show()
				}), this.addEvent(), this.getFlashData(), n.doms.lastTimeBox.length && n.toggleLastAnchorTime(), t.on("mod.normal.achorinfo.layout", function() {
					n.doms.lastTimeBox.length && n.toggleLastAnchorTime()
				}), $ROOM.show_status && this.doms.feedbackBtn.show(), this.doms.anchorInfoContent.find(".zb-name").attr("title", this.doms.anchorInfoContent.find(".zb-name").text()), this.doms.anchorInfoContent.find(".zb-location").size() > 0 && this.doms.anchorInfoContent.find(".zb-location").attr("title", this.doms.anchorInfoContent.find(".zb-location").html());
				var o = r.get("room.emperorPush") || [];
				o && !e.isArray(o) && this.emperorRecommendShow(o.pushnickname), t.on("mod.room.msg.follow", function() {
					n.followRoom()
				})
			},
			addEvent: function() {
				var i = this,
					n = this.doms;
				n.followBtn.on("click", function() {
					i.followRoom()
				}), n.followedBtn.on("click", function() {
					i.unFollowRoom()
				}), n.anchorInfoContent.on("mousedown", ".head-room-tag:eq(0)", function() {
					t.trigger("dys", {
						key: "dys.room.title.cate.click"
					})
				}).on("mousedown", ".head-room-tag:eq(1)", function() {
					t.trigger("dys", {
						key: "dys.room.title.tag.click"
					})
				}).on("mousedown", ".head-room-tag:eq(2)", function() {
					t.trigger("dys", {
						key: "dys.room.title.child.click"
					})
				}).on("mousedown", "#qrcode-content .tit a", function() {
					t.trigger("dys", {
						key: "dys.room.title.mobileview.click"
					})
				}).on("mousedown", ".download", function() {
					t.trigger("dys", {
						key: "dys.room.title.download.click"
					})
				}).on("mousedown", ".feedback-report-button", function() {
					t.trigger("dys", {
						key: "dys.room.title.report.click"
					})
				}), n.feedBackReportButton.on("click", function() {
					var e = l.check();
					return e ? void 0 : (l.show("login"), !1)
				}), n.privateLetterBtn.on("click", function(e) {
					var i = $ROOM.owner_uid,
						n = l.check();
					return e.stopPropagation(), n ? void t.trigger("mod.room.privateLetter.open", i) : (l.show("login"), !1)
				}), n.tips.hover(function() {
					e(this).find(".tip").show()
				}, function() {
					e(this).find(".tip").hide()
				}), t.on("mod.titleinfo.change", function(e) {
					e.weight && n.weightBox.html(i.weight_conversion(parseInt(e.weight)))
				}), t.on("room.anchor.follow.change", function(e, t) {
					var n = parseInt(e) || 0;
					i.renderFollowBtn(n, t), s.exe("js_follow_change", n)
				}), e('.r-else-tag span.head-room-tag,.head-room-tag[data-aochar-tag="third"]').on("click", function() {
					return !1
				})
			},
			weight_conversion: function(e) {
				return 1e3 > e ? e + "g" : 1e6 > e ? e / 1e3 + "kg" : Math.round(e / 1e4) / 100 + "t"
			},
			followRoom: function() {
				t.trigger("dys", {
					key: "dys.room.title.follow.click"
				});
				var i = this,
					n = this.doms;
				if (!isNaN(parseInt(n.fansNum.html().replace(/,/g, ""), 10)) && !i.is_follow_loading) {
					if (!l.check()) return l.show("login", {
						source: "click_title_follow"
					}), i.is_follow_loading = !1, !1;
					if ($SYS.uid == $ROOM.owner_uid) return e.dialog.tips_black("不能关注自己的房间", 2), !1;
					i.is_follow_loading = !0, i.getCSRFCookie(function(n, o) {
						var a = {
							room_id: $ROOM.room_id
						};
						a[n] = o, e.ajax("/room/follow/add_confuse/" + $ROOM.room_id, {
							type: "post",
							data: a,
							dataType: "json",
							success: function(n) {
								if (i.is_follow_loading = !1, 0 === n.error && n.data) {
									var o = n.data;
									i.renderFollowNum(o.cfer, o["in"]), t.trigger("room.anchor.follow.change", 1), clearTimeout(i.followTimer), t.trigger("dys", {
										key: "dys.room.follow.action",
										stat: 1
									})
								} else e.dialog.alert(n.msg || "关注失败!")
							}
						})
					})
				}
			},
			shareAnchorTpl: function() {
				var i = e(".share-lead");
				if (i.length) i.show();
				else {
					var n = '<div class="share-lead"><div class="lead-close"></div></div>';
					this.doms.anchorInfoContent.append(n);
					var i = e(".share-lead");
					i.find(".lead-close").on("click", function() {
						c.set("share-lead", "1", 86400), e(".share-lead").hide(), t.trigger("dys", {
							key: "dys.room.title.follow.tip.close"
						})
					})
				}
			},
			followAnchorTpl: function() {
				var i = e(".focus-lead");
				if (i.length) i.show();
				else {
					var n = '<div class="focus-lead"><div class="lead-close"></div></div>',
						o = e(n),
						a = this.doms.anchorInfoContent;
					t.trigger("mod.layer.tips.render", {
						storagename: "followAnchor",
						$tip: o,
						$el: a,
						closeEleClassName: ".lead-close",
						handleFn: function() {}
					})
				}
				t.trigger("dys", {
					key: "dys.room.follow.tip.show"
				})
			},
			unFollowRoom: function() {
				var i = this,
					n = this.doms;
				return isNaN(parseInt(n.fansNum.html().replace(/,/g, ""), 10)) || i.is_rm_follow_loading ? void 0 : $SYS.uid ? void e.dialog({
					content: "您是否取消关注？",
					icon: "question",
					okVal: "确定",
					ok: function() {
						i.is_rm_follow_loading = !0, i.getCSRFCookie(function(n, o) {
							var a = {
								room_id: $ROOM.room_id
							};
							e.ajax("/room/follow/cancel_confuse/" + $ROOM.room_id, {
								data: a,
								dataType: "json",
								type: "post",
								success: function(n) {
									if (i.is_rm_follow_loading = !1, 0 === n.error && n.data) {
										t.trigger("room.anchor.follow.change", 0);
										var o = n.data;
										i.renderFollowNum(o.cfer, o["in"]), e.dialog.tips_black("已取消关注", 2), t.trigger("dys", {
											key: "dys.room.follow.action",
											stat: 2
										})
									} else e.dialog.alert("服务器错误！")
								},
								error: function() {
									i.is_rm_follow_loading = !1
								}
							})
						})
					},
					cancelVal: "取消",
					lock: !0,
					cancel: function() {}
				}) : (l.show("login"), !1)
			},
			renderFollowBtn: function(e, t) {
				var i = this.doms;
				e ? (i.followBtn.addClass("hide"), i.followedBtn.removeClass("hide")) : (i.followBtn.removeClass("hide"), i.followedBtn.addClass("hide"))
			},
			renderUserInfo: function(e) {
				var i = this,
					n = this.doms;
				e = a.decode(e).too();
				var o = e.fans_count,
					r = e.weight,
					s = parseInt(e.fl);
				o = o > 0 ? o : 0, t.trigger("room.anchor.follow.change", s, o), n.weightBox.html(i.weight_conversion(parseInt(r))), parseInt(o) < 5e4 && !s && $SYS.uid && $ROOM.owner_uid != $SYS.uid && (i.followTimer = setTimeout(function() {
					i.followAnchorTpl()
				}, 3e5))
			},
			toggleLastAnchorTime: function() {
				var t = h.doms,
					i = t.lastTimeBox.parents("li"),
					n = t.anchorInfoContent.width(),
					o = 0 === e(".no-anchor-impress").length,
					a = t.anchorInfoContent.find(".sq-wrap").outerWidth(!0),
					r = o ? 100 : 130 + a;
				i.css({
					display: "block",
					opacity: 0
				});
				var s = t.relseTag.width(),
					l = n - r - s;
				0 >= l ? i.hide() : i.show(), i.css({
					opacity: 1
				})
			},
			getCSRFCookie: function(t) {
				var i = this,
					o = n.get(r.get("sys.tvk")),
					a = r.get("sys.tn"),
					s = e.isFunction(t) ? t : function() {};
				return o ? void s(a, o) : void e.ajax({
					url: "/curl/csrfApi/getCsrfCookie",
					type: "GET",
					dataType: "json",
					success: function(e) {
						0 === e.error && i.getCSRFCookie(s)
					}
				})
			},
			generateFontStyle: function(t) {
				if (t && this.followFontFamily !== t) {
					this.followFontFamily = t;
					var i = e("#upsetFontStyle");
					0 === i.length && (i = e('<div id="upsetFontStyle"></div>'), e("body").append(i));
					var n = $SYS.web_url + "app/douyu/res/font/" + t,
						o = ["<style>@font-face {", 'font-family: "douyu";', 'src: url("' + n + '.eot"); ', 'src: url("' + n + '.eot?#iefix") format("embedded-opentype"), ', 'url("' + n + '.svg#uxdouyu") format("svg"),', 'url("' + n + '.woff") format("woff"), ', 'url("' + n + '.ttf") format("truetype");', "}</style>"].join("");
					i.html(o)
				}
			},
			renderFollowNum: function(e, t) {
				this.generateFontStyle(t), "undefined" != typeof e && this.doms.fansNum.text(e), this.doms.fansNum.css("fontFamily", "douyu")
			},
			getFlashData: function() {
				var i = this,
					n = this.doms;
				t.on("mod.login.userinfo", function(e) {
					i.renderUserInfo(e)
				}), n.olUmBox.closest("li").hide(), s.reg("room_data_tbredpacket", function(i) {
					var n = a.decode(i).too();
					if ("keeplive" === n.type) {
						var o = parseInt(n.hot) || 0;
						if (parseInt(n.ahot)) {
							var r = parseInt(n.ahot) || 0,
								s = o - r;
							e("#anchor-info .r-else li .hot-box .tip").html('<div class="arrow"></div>通过暑期活动"激情似火BUFF"额外增加热度'), e("#anchor-info .r-else li .hot-v-con").html('<i class="summer_hot_icon"></i><div class="summer_hot_value">' + s + '<span style="color:#fff58a">+</span>' + r + "</div>")
						} else e("#anchor-info .r-else li .hot-box .tip").html('<div class="arrow"></div>点击查看热度介绍'), e("#anchor-info .r-else li .hot-v-con").html('<i class="hot-v-icon"></i><span class="hot-v" data-anchor-info="hot">' + o + "</span>")
					}
					t.trigger("mod.normal.achorinfo.layout")
				}), s.reg("room_data_handler", function(e) {
					var t = a.decode(e).too();
					"redirect" === t.type && "emperor_push" === t.msgtype ? i.emperorRecommendShow(t.nickname) : "followed_count" === t.type && i.renderFollowNum(t.cfdc, t.ci)
				}), t.on("mod.normal.follow.render", function(e) {
					i.renderFollowNum(e.cfer, e["in"])
				}), t.on("mod.normal.title.layout", function() {
					i.emperorRecommendLayout()
				})
			},
			emperorRecommendShow: function(n) {
				var o = r.get("room.nobleConfig") || [],
					a = r.get("sys.resource_url") || "",
					s = o[6] || {},
					l = n || "神秘" + $ROOM.nobleConfig[6].noble_name,
					c = a + (s.symbol ? s.symbol.web_symbol_pic2 : "");
				e(".room-emperor-recommend").remove();
				var d = i.string.join('<div class="room-emperor-recommend">', '<div class="emperor-recommend">', '<img class="emperor-icon" src=' + c + ">", '<span class="emperor-name" title="' + l + '">' + l + "</span><span>推荐</span>", "</div>", "</div>");
				this.doms.anchorInfoContent.find(".feedback-report-button").after(d), this.doms.anchorInfoContent.addClass("js-emperor-recommend"), t.trigger("mod.video.state.change")
			},
			emperorRecommendLayout: function() {
				var t = e(".js-emperor-recommend");
				if (0 !== t.length) {
					var i = this.doms.anchorInfoContent.width();
					t.removeClass("roommes-bg-big roommes-bg-small"), t.find(".emperor-name").removeClass("emperor-name-small"), i >= 1180 ? t.addClass("roommes-bg-big") : i >= 842 ? t.addClass("roommes-bg-small") : t.find(".emperor-name").addClass("emperor-name-small")
				}
			}
		},
		p = '<span class="recording-wrap"><a href="' + $SYS.vsite_url + "/author/" + $ROOM.up_id + '" target="_blank" class="video-recording"></a></span>';
	u = {
		init: function() {
			$SYS.uid != $ROOM.owner_uid && 1 !== $ROOM.show_status || e.ajax({
				url: "/swf_api/getRoomRecordStatus/" + $ROOM.room_id,
				type: "get",
				dataType: "json",
				success: function(e) {
					if (0 === e.error && e.data && 1 === e.data.enable) {
						var t = 1 === e.data.recording ? "open" : "close";
						u.autoSwitchStatus = t, u.btnToggle(), u.autoSwitch && u.toggleSwitch(t)
					}
				}
			}), u.getDoms(), u.bindEvent()
		},
		getDoms: function() {
			u.recordingGif = e(p), h.doms.anchorInfoContent.find(".focus-box-con").before(u.recordingGif)
		},
		bindEvent: function() {
			u.recordingGif.on("click", function() {
				t.trigger("dys", {
					key: "dys.room.title.recording.click"
				})
			}), t.on("mod.normal.menu.starup.ready", function() {
				u.autoSwitch = e("#J_anchorandsupermenu").find('[data-live-group="autorec"]'), u.autoSwitch.on("click", function() {
					u.autoSwitch.hasClass("active") ? e.dialog({
						lock: !0,
						icon: "warning",
						content: "关闭后水友将无法及时看到最新录像，<br>可能会影响您的人气，确定要关闭吗",
						okVal: "确定",
						cancelVal: "取消",
						ok: function() {
							u.submitSwitchStatus("close"), this.close()
						},
						cancel: function() {
							this.close()
						}
					}) : u.submitSwitchStatus("open")
				}), u.btnToggle(), u.autoSwitchStatus && u.toggleSwitch(u.autoSwitchStatus)
			})
		},
		btnToggle: function() {
			$SYS.uid == $ROOM.owner_uid && u.autoSwitchStatus && u.autoSwitch && u.autoSwitch.removeClass("hide")
		},
		toggleSwitch: function(e) {
			"close" === e ? u.autoSwitch.removeClass("active") : "open" === e && (u.autoSwitch.addClass("active"), 1 === $ROOM.show_status && t.trigger("mod.video.state.change"))
		},
		submitSwitchStatus: function(t) {
			var i = 0,
				n = "关闭";
			"open" === t && (i = 1, n = "开启"), e.ajax({
				url: "/member/myTimemachine/setsubmitSwitch",
				data: {
					type: i
				},
				type: "post",
				dataType: "json",
				success: function(i) {
					0 === i.error ? (u.toggleSwitch(t), e.dialog.tips_black("已" + n + "自动投稿", 1.5)) : e.dialog.tips_black(n + "自动投稿失败", 1.5)
				},
				error: function() {
					e.dialog.tips_black("网络错误！", 1.5)
				}
			})
		}
	};
	var g = {
		init: function() {
			h.init(), u.init()
		}
	};
	return g
}), define("douyu/page/room/normal/mod/userinfo", ["jquery", "shark/class", "shark/observer", "shark/util/flash/data/1.0", "douyu/page/room/base/api", "douyu/com/user", "douyu/context"], function(e, t, i, n, o, a, r) {
	var s = t({
		getDoms: function() {
			var t = e("#js-stats-and-actions");
			this.doms = {
				body: e("body"),
				statsAction: t,
				ywyc: t.find('[data-uinfo-content="ywyc"]'),
				silverBox: t.find('[data-login-user="silver"]'),
				goldBox: t.find('[data-login-user="gold"]'),
				chargeBtn: t.find(".getYc"),
				roomWaringClose: e('[data-room-gift="close"]')
			}
		},
		init: function(t) {
			this.config = e.extend(!0, {}, {}, t), this.getDoms(), this.addEvent()
		},
		ywycRender: function() {
			$SYS.uid || (this.doms.silverBox.html(0), this.doms.goldBox.html(0))
		},
		addEvent: function() {
			var e = this,
				t = this.doms;
			i.on("mod.login.userinfo", function(t) {
				e.ywycRender()
			}), i.on("mod.userinfo.updateSilverGold", function(e) {
				e && "undefined" != typeof e.silver && t.silverBox.html(e.silver), e && "undefined" != typeof e.gold && t.goldBox.html(e.gold)
			}), t.chargeBtn.on("mousedown", function() {
				try {
					DYS.storage.save("_dypay_fp", 1)
				} catch (e) {}
				i.trigger("dys", {
					key: "dys.room.gift.charge"
				})
			})
		}
	}),
		l = {
			init: function(e) {
				return new s(e)
			}
		};
	return l
}), define("douyu/page/room/normal/mod/dp", ["jquery", "shark/observer", "shark/util/cookie/1.0", "douyu/page/room/base/api", "douyu/context", "shark/util/storage/1.0"], function(e, t, i, n, o, a) {
	function r(e, t) {
		t ? DYS.sub({
			kernelFlag: !0
		}, e) : DYS.sub(e)
	}
	return require.use(["douyu/page/room/normal/mod/dp-config"], function(i) {
		t.on("dys", function(t) {
			var n = e.extend(null, !0, t),
				o = 0,
				a = i[t.key];
			if (a) {
				delete n.key;
				for (var r in n) o++;
				0 === o && (n = void 0), a.call(this, n)
			}
		})
	}), function() {
		var e = "hidden" in document ? "hidden" : "webkitHidden" in document ? "webkitHidden" : "mozHidden" in document ? "mozHidden" : null,
			t = o.get("room.room_id"),
			i = 0,
			n = 0;
		if (null !== e) {
			var a = e.replace(/hidden/i, "visibilitychange"),
				s = function(o) {
					document[e] ? (i = 1 * new Date, r({
						action_code: "click_btop_cback_room",
						ext: {
							rid: t
						}
					})) : (i && (n = 1 * new Date - i), r({
						action_code: "click_btop_chead_room",
						ext: {
							rid: t,
							htm: n / 1e3
						}
					}))
				};
			document.addEventListener(a, s)
		}
	}(), {
		init: function(t, o, a) {
			DYS.sub.setPageCode(t);
			var r = a ? a : {},
				s = r.ext ? r.ext : {};
			DYS.sub.setPublicExt({
				ext: s
			}), n.reg("room_data_pageinfo", function(e) {
				n.exe("js_page_type", {
					page_code: t,
					dzh_type: s.dzh_type,
					zhtname: s.zhtname
				})
			}), e(document).ready(function() {
				DYS.sub({
					action_code: o || "init_page_studio_normal",
					ext: {
						domr: 1,
						ut: navigator.userAgent,
						chan_code: i.get("ditchName"),
						type: a ? a.type : void 0,
						duration: new Date - DYS.property.loadtime
					}
				})
			})
		}
	}
}), define("douyu/page/room/normal/mod/center", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/cookie/1.0", "shark/util/storage/1.0", "shark/util/flash/data/1.0", "shark/util/template/2.0", "douyu/context", "douyu/com/user", "douyu/page/room/base/api", "douyu/page/room/normal/mod/room-login-queue"], function(e, t, i, n, o, a, r, s, l, c, d) {
	function u() {
		var t = o.get("chat-shield-config") || "",
			i = [],
			n = {
				smallgift: 105,
				allGift: 106,
				message: 107,
				videoBroadcast: 108
			},
			r = "";
		if (t) try {
			var s = JSON.parse(t);
			e.each(s, function(e) {
				"" + this == "1" && i.push("sn@A=" + n[e] + "@Sss@A=" + this)
			}), i.length && (r = a.encode([{
				name: "dfl",
				value: i.join("/")
			}]))
		} catch (l) {
			r = ""
		}
		return r
	}
	var f = {
		usergroup: {},
		user_role: [],
		user_role_key: {
			visitor: 0,
			normal: 1,
			anchor: 2,
			room_admin: 3,
			super_admin: 4
		},
		paytask: {
			timeout: 48e4,
			cookie: "paytask"
		}
	},
		h = function(e, t) {
			return parseInt(Math.random() * (t - e) + e)
		},
		p = {
			initShowmore: function() {
				var n = ['<div class="dialog-more-video" id="dialog-more-video" style="display:none">', '<div class="v-tit">', "<h3>更多精彩！尽在斗鱼</h3>", '<a href="javascript:;" class="close"></a>', "</div>", '<div class="v-con">', '<ul class="clearfix"></ul>', '<p class="info">主播已经离开，浏览器将在 <em></em> 秒后自动跳转到下一个直播间</p>', "</div>", "</div>"];
				e("body").append(n.join("")), p.showmore = function() {
					var n = s.get("room.room_id"),
						o = s.get("room.cate_id"),
						a = e(".catagory-order-num-item").eq(0).data("tag-id"),
						l = "/lapi/athena/room/",
						c = function(t, i, n, o) {
							e.ajax(t, {
								type: "get",
								dataType: "json",
								data: i,
								success: function(e) {
									return 0 === e.error || e.room_list_info ? void(n && n(e)) : void(o && o())
								},
								error: function() {
									o && o()
								}
							})
						},
						d = function(e, i, n, o, r) {
							t.trigger("dys", {
								key: "dys.room.athena.live.end." + e,
								bid: i,
								booth_id: 7,
								con_id: n,
								jurl: o ? window.location.protocol + window.location.hostname + "/" + o : "",
								rid: o || 0,
								ruleset_id: r,
								vid: 0,
								ctid: a
							}), c(l + ("show" === e ? "dot" : "catch"), {
								bizid: i,
								bthid: 7,
								conId: n,
								roomId: o,
								ctid: a,
								t: +new Date
							})
						},
						u = function(e, t) {
							var i = [],
								o = {};
							o[n] = 1;
							for (var a = 0; a < e.length; a++) o[e[a][t]] || (i.push(e[a]), o[e[a][t]] = 1);
							return o = null, i
						},
						f = function(t) {
							if (t) {
								var n, o, a, s;
								s = u(t, "room_id"), s = Array.prototype.slice.call(s, 0, 8), n = i.string.join("{{each list}}", '<li bid="{{$value.bid}}" con-id="{{$value.con_id}}" jump-to="{{$value.room_id}}" ruleset-id="{{$value.ruleset_id}}">', '<a target="_blank" href="/{{+$value.vipId ? $value.vipId : $value.room_id}}">', '<div class="pic">', '<img src="{{$value.room_src}}">', "</div>", "<h3>{{$value.name}}</h3>", "<p>", '<span class="icon2 fl">{{$value.online}}</span>', '<span class="icon1 fl">{{$value.nickname}}</span>', "</p>", "</a>", "</li>", "{{/each}}"), o = r.compile(n), a = o({
									list: s
								});
								var l = e("#dialog-more-video"),
									c = l.find(".v-con ul"),
									f = l.find(".v-tit .close");
								c.html(a), c.find("li").on("click", function() {
									var t = e(this).attr("bid"),
										i = e(this).attr("con-id"),
										n = e(this).attr("jump-to"),
										o = e(this).attr("ruleset-id");
									t && i && o && d("click", t, i, n, o)
								}), f.off().on("click", function() {
									var t = e("#dialog-more-video"),
										i = t.data("timer");
									t.hide(), clearTimeout(i)
								}), l.show(), p(1e3 * parseInt(16 * Math.random() + 10))
							}
						},
						p = function(t) {
							var i, n = e("#dialog-more-video"),
								o = n.find(".v-con .info em");
							return 0 >= t ? (n.find(".v-con ul li").eq(0).click(), location.href = n.find(".v-con ul li a").eq(0).attr("href") || "/") : (o.text(t / 1e3), i = setTimeout(function() {
								p(t - 1e3)
							}, 1e3), void n.data("timer", i))
						},
						g = function() {
							var t = e.Deferred();
							return c(l + "closeRecommVod", {
								position: "7",
								roomId: n,
								cid: o,
								t: +new Date
							}, t.resolve, t.reject), t.promise()
						},
						m = function(e) {
							c("/swf_api/get_more_video", {
								cate_id: o
							}, function(t) {
								var i = e && e.length ? e : [];
								f(i.concat(t.room_list_info))
							})
						},
						v = function(e) {
							var t = [];
							return e.forEach(function(e) {
								var i = e.bid,
									n = e.con_id,
									o = e.jump_to,
									a = e.ruleset_id;
								t.push({
									name: e.title,
									room_id: o,
									vipId: e.vipId,
									nickname: e.userName,
									room_src: e.icon,
									online: e.online,
									bid: e.bid,
									con_id: n,
									ruleset_id: a
								}), d("show", i, n, o, a)
							}), t
						};
					setTimeout(function() {
						e.when(g()).done(function(e) {
							var t = e.data,
								i = t && t.length ? v(t) : [];
							m(i)
						}).fail(m)
					}, 1e3 * h(1, 11))
				}, t.on("mod.center.showmore", function() {
					"full" !== t.fire("mod.video.state.get") && p.showmore()
				})
			},
			initUserRole: function(i) {
				var n, o = [],
					a = l.check();
				n = function(e, t) {
					for (var i = 0, n = e.length; n > i; i++) if (t == e[i]) return !0;
					return !1
				}, a ? (o.push(f.user_role_key.normal), s.get("sys.uid") == s.get("room.owner_uid") && o.push(f.user_role_key.anchor), 4 == i.roomgroup && o.push(f.user_role_key.room_admin), 5 == i.group && (s.set("sys.groupid", i.group), o.push(f.user_role_key.super_admin))) : o.push(f.user_role_key.visitor), p.userrole = function(e) {
					for (var t = f.user_role, i = !1, n = 0, o = t.length; o > n; n++) if (t[n] === e) {
						i = !0;
						break
					}
					i || f.user_role.push(e)
				}, f.user_role = o, e.extend(f.user_role, {
					isVistor: function() {
						return n(this, f.user_role_key.visitor)
					},
					isNormal: function() {
						return n(this, f.user_role_key.normal)
					},
					isAnchor: function() {
						return n(this, f.user_role_key.anchor)
					},
					isRoomAdmin: function() {
						return n(this, f.user_role_key.room_admin)
					},
					isSuperAdmin: function() {
						return n(this, f.user_role_key.super_admin)
					}
				}), t.on("mod.center.userrole.get", function() {
					return f.user_role
				}), t.trigger("mod.center.userrole.ready", f.user_role)
			},
			initUsergroup: function() {
				p.usergroup = function() {
					var t = [].slice.call(arguments),
						i = t.length;
					if (1 === i) return f.usergroup[t[0]];
					if (2 === i) {
						var n = t[0],
							o = t[1];
						f.usergroup[n] = f.usergroup[n] || {}, e.extend(f.usergroup[n], o)
					}
				}, t.on("mod.center.usergroup.get", function(e) {
					return p.usergroup(e)
				}), t.on("mod.center.usergroup.set", function(e, t) {
					return p.usergroup(e, t)
				})
			},
			getCSRFCookie: function(t) {
				var i = n.get(s.get("sys.tvk")),
					o = s.get("sys.tn"),
					a = e.isFunction(t) ? t : function() {};
				return i ? void a(o, i) : void e.ajax({
					url: "/curl/csrfApi/getCsrfCookie",
					type: "GET",
					dataType: "json",
					success: function(e) {
						0 === e.error && p.getCSRFCookie(a)
					}
				})
			}
		};
	return {
		init: function() {
			p.initShowmore(), p.initUsergroup(), c.reg("room_login_show", function(e) {
				var t = l.check();
				t || (c.exe("js_exitFullScreen"), l.show("login", {
					source: e
				}))
			}), c.reg("room_reg_show", function(e) {
				c.exe("js_exitFullScreen"), l.show("reg", {
					source: e
				})
			}), c.reg("room_dycookie_set", function(e, t, i) {
				n.set(e, t, i)
			}), c.reg("room_dycookie_get", function(e) {
				return n.get(e)
			}), c.reg("room_csrf_get", function() {
				p.getCSRFCookie(function(e, t) {
					c.exe("js_setCsrf", e, t)
				})
			});
			var r = !1;
			c.reg("room_bus_login", function() {
				function i() {
					e.isFunction(window.flash_load_success) && window.flash_load_success();
					var t = "type@=loginreq/username@=" + (s.get("sys.username") || "") + "/password@=" + (n.get("auth_wl") || "") + "/roomid@=" + (s.get("room.room_id") || 0) + "/ltkid@=" + (n.get("ltkid") || "") + "/biz@=" + (n.get("biz") || "") + "/stk@=" + (n.get("stk") || "") + "/" + u();
					c.exe("js_userlogin", t), d.init()
				}
				r ? i() : (r = !0, t.trigger("second-queue-willLoad"), t.on("second-queue-hasLoaded", i))
			}), c.reg("room_bus_login2", function(e) {
				var t = "type@=loginreq/username@=" + (s.get("sys.username") || "") + "/password@=" + (n.get("auth_wl") || "") + "/roomid@=" + (s.get("room.room_id") || 0) + "/ltkid@=" + (n.get("ltkid") || "") + "/biz@=" + (n.get("biz") || "") + "/stk@=" + (n.get("stk") || "") + "/" + u();
				1 === e && c.exe("js_anotherlogin", t), 0 === e && c.exe("js_userlogin", t)
			}), c.reg("room_data_login", function(e) {
				c.exe("js_newQueryTask"), e = a.decode(e).too(), s.set("room.user_best_cq", e.best_dlev), p.initUserRole({
					group: e.pg,
					roomgroup: e.roomgroup
				}), p.usergroup(e.userid, {
					pg: e.pg,
					rg: e.roomgroup
				}), t.trigger("mod.video.showroomillega", {
					flag: e.is_illegal,
					data: {
						startTime: 1e3 * e.ill_ts,
						serverTime: 1e3 * e.now,
						context: e.ill_ct
					},
					userrole: f.user_role
				}), t.trigger("mod.header.identify", e), t.trigger("mod.chat.send", e);
				var i = o.get(f.paytask.cookie);
				i || setTimeout(function() {
					t.trigger("pay.task.timeout")
				}, f.paytask.timeout), t.trigger("mod.anchorwhitelist.getAnchorWhList", e), t.trigger("mod.room.userrole.get", e.roomgroup || {}), t.trigger("mod.room.loginQueue.clearInterval", 1), t.trigger("mod.room.filter.keywords.set"), t.trigger("mod.chat.success", "chat"), t.trigger("mod.chat.kpl.color")
			}), c.reg("room_data_info", function(e) {
				var i = a.decode(e).too();
				t.trigger("mod.chat.bonus.call", e), t.trigger("mod.chat.gift.call", i), t.trigger("mod.login.userinfo", e), t.trigger("mod.vipsit.query.ready", e), t.trigger("mod.noble.info.get", i), t.trigger("mod.noble.info.get.rank", i), t.trigger("mod.anthor.levelInfo.get", i), t.trigger("mod.anthor.setFansSpeak.get", i), t.trigger("mod.msg.luckDraw.info", i), t.trigger("mod.backpack.noble.info", i), t.trigger("room.activity.userinfo.actGuess", i)
			}), c.reg("room_data_sererr", function(n) {
				var o;
				if (n = a.decode(n), o = n.get("code"), 51 == o) return e.dialog.tips_black("数据传输出错！");
				if (52 == o) {
					var r = "",
						d = s.get("sys.uid") == s.get("room.owner_uid");
					return r = d ? "您的房间已被关闭，详情请联系客服人员。" : "您观看的房间已被关闭，请选择其他直播进行观看哦！", e.dialog({
						icon: "warning",
						title: "房间关闭提示",
						content: '<p style="color:red">' + r + "</p>",
						lock: !0,
						init: function() {
							var e = this,
								t = 8,
								n = function() {
									return e.title(t + "秒后关闭"), t ? void t-- : (e.close(), !1)
								};
							i.interval(n, 1e3, !0)
						},
						ok: function() {
							this.close()
						},
						close: function() {
							location.href = d ? "/room/my" : "/"
						}
					})
				}
				if (53 == o) return e.dialog.tips_black("服务器繁忙！");
				if (54 == o) return e.dialog.tips_black("服务器维护中！");
				if (55 == o) return e.dialog.tips_black("用户满员！");
				if (56 == o) return e.dialog.tips_black("您已被管理员做封号处理.您当前IP也被禁止登陆12小时！"), e.post("/member/logout/ajax", function(e) {
					try {
						c.exe("js_userlogout")
					} catch (t) {}
				}, "json"), setTimeout(function() {
					location.href = "/"
				}, 3e3);
				if (57 == o) return e.dialog.tips_black("帐号被封禁！"), setTimeout(function() {
					location.href = "/"
				}, 3e3);
				if (58 == o) return e.dialog.tips_black("昵称密码错误！");
				if (59 == o) {
					var u = '<li class="jschartli normal-notice-new"><i class="sys-icon"></i><p class="text-cont"><span class="highLight">消息提醒：</span>您的账号在另一地点登录，弹幕连接已断开 <a class="js-danmu-reconnect highLight" style="cursor: pointer;">点击重新连接弹幕</a>。';
					return e('.c-list[data-type="chat-list"]').on("click", ".js-danmu-reconnect", function() {
						c.exe("js_setReConnectDanmu")
					}), e.dialog.tips_black("您的账号已在其他地方登录，请注意账号安全！"), t.trigger("mod.chat.msg.msg", u)
				}
				return 60 == o ? e.dialog.tips_black("聊天信息包含敏感词语！") : 203 == o ? e.dialog.tips_black("网络异常") : 252 == o ? (e.dialog.tips_black("您的登录已过期请重新登录！"), setTimeout(function() {
					l.show("login")
				}, 3500)) : 287 == o ? e.dialog({
					icon: "warning",
					content: "服务器正在维护中，请重新刷新页面！",
					okVal: "刷新",
					ok: function() {
						location.reload()
					},
					cancelVal: "确定",
					cancel: function() {}
				}) : void 0
			}), c.reg("room_bus_checksevertime", function() {
				e.dialog({
					icon: "warning",
					lock: !0,
					content: i.string.join("本机系统时间有误！", "错误的系统时间会导致flash播放器出现无限加载及其他不可预知的错误。<br>", "请校准本机系统时间后刷新页面。")
				})
			}), c.reg("room_bus_phock", function() {
				return l.check() ? void e.dialog.confirm("完成手机验证后才能进行弹幕发送", function() {
					window.location.href = "/member/cp#phone"
				}) : l.show("login")
			}), c.reg("room_data_state", function(i) {
				if (i = a.decode(i).too(), void 0 !== i.notify || void 0 !== i.rid) {
					if (i.notify > 0 && i.rid == s.get("room.room_id")) {
						var n = 2 == i.code ? "该主播涉嫌违规播放，本次直播已被管理员关闭" : "本次直播已经结束";
						e.dialog.alert(n)
					}
					if (1 == i.code) {
						var o = s.get("sys.uid"),
							r = o == s.get("room.owner_uid"),
							l = s.get("sys.groupid"),
							d = p.usergroup(o),
							u = i.endtime - s.get("room.show_time");
						!r && 5 > l && (!o || d.rg < 4) && u > 900 && ("undefined" != typeof $ROOM.isActive && 1 === parseInt($ROOM.isActive) && (c.exe("js_exitFullScreen"), t.trigger("mod.video.state.flashnorm")), t.trigger("mod.center.showmore"))
					}
					t.trigger("mod.video.state.flashlivestate", i)
				}
			}), c.reg("room_data_flaerr", function(e) {
				if (4202 != e && 4203 != e && 4204 != e && 4208 != e && 210 != e && 365 != e || l.exit(), 4205 != e && 4206 != e && 4207 != e && 203 != e || l.show("login"), 56 != e && 57 != e && 59 != e || t.trigger("mod.center.onekey.closure", {
					code: e
				}), 267 == e) {
					var i = '<li class="jschartli sys-msg">系统提示：抱歉，您的帐号目前打开的房间过多~</li>';
					t.trigger("mod.chat.msg.msg", i)
				}
			})
		}
	}
}), define("douyu/com/marketingSDK", ["jquery", "shark/util/storage/1.0", "shark/util/flash/data/1.0", "douyu/context"], function(e, t, i, n) {
	function o(e) {
		for (var t in l.prototype) e[t] = l.prototype[t];
		return e
	}
	var a = {
		staticConfigUrl: {
			"": "http://localhost:8083/config",
			"www.dev.dz11.com": "https://marketing-dev.dz11.com/widget/list?platform=3",
			"live.dz11.com": "https://marketing-live.dz11.com/widget/list?platform=3",
			"www.dz11.com": "https://marketing-pre.dz11.com/widget/list?platform=3",
			"www.douyu.com": "https://marketing.douyu.com/widget/list?platform=3"
		},
		staticConfigCachetTime: 43200,
		staticConfigStorageName: "MARKETING",
		agreementName: "actcomm"
	},
		r = {},
		s = function() {
			this.init()
		};
	s.prototype = {
		component: {},
		init: function() {
			this.staticConfig = t.get(a.staticConfigStorageName), !this.staticConfig && this.loadConfig(), this.hook_ACJ_(), this.event = new l
		},
		cacheConfig: function(e) {
			this.staticConfig = e, t.set(a.staticConfigStorageName, e, a.staticConfigCachetTime)
		},
		hook_ACJ_: function() {
			var e = window._ACJ_;
			this._ACJ_ = function(t) {
				"room_data_handler" === t[0] && t.length > 1 && i.decode(t[1]).too().type == a.agreementName ? this.analysis(t) : e(t)
			}.bind(this), window._ACJ_ = this._ACJ_
		},
		analysis: function(t) {
			var n = Array.prototype.slice.call(t, 1);
			if (n = i.decode(n).too(), n.ver > this.staticConfig.globalVersion && this.loadConfig(), r[n.cid]) r[n.cid].update(e.parseJSON(n.data));
			else {
				var o = this.findConponent(n.cid);
				if (null === o) return;
				require.use(["douyu-activity/marketingComponent/" + o.templateCode], function(t) {
					if (t) {
						var i = new t({
							staticData: o.conf,
							dynamicData: e.parseJSON(n.data)
						});
						i.render(), r[n.cid] = i
					}
				})
			}
		},
		findConponent: function(e) {
			for (var t in this.staticConfig.widgetConfList) {
				var i = this.staticConfig.widgetConfList[t];
				if (i.identity == e) return i
			}
			return null
		},
		registry: function(e, t) {
			this.event.on(e, t)
		},
		loadConfig: function() {
			var t = this;
			e.ajax({
				url: n.get("sys.marketing_url") || a.staticConfigUrl[location.host],
				type: "GET",
				dataType: "jsonp",
				jsonp: "callback",
				callback: "json_callback",
				success: function(e) {
					t.cacheConfig(e.data)
				},
				error: function(e) {}
			})
		}
	};
	var l = function(e) {
			return e ? o(e) : void 0
		};
	return l.prototype.on = l.prototype.addEventListener = function(e, t) {
		return this._callbacks = this._callbacks || {}, (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t), this
	}, l.prototype.once = function(e, t) {
		function i() {
			this.off(e, i), t.apply(this, arguments)
		}
		return i.fn = t, this.on(e, i), this
	}, l.prototype.off = function(e, t) {
		if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
		var i = this._callbacks["$" + e];
		if (!i) return this;
		if (1 == arguments.length) return delete this._callbacks["$" + e], this;
		for (var n, o = 0; o < i.length; o++) if (n = i[o], n === t || n.fn === t) {
			i.splice(o, 1);
			break
		}
		return 0 === i.length && delete this._callbacks["$" + e], this
	}, l.prototype.removeListener = l.prototype.off, l.prototype.removeAllListeners = l.prototype.off, l.prototype.removeEventListener = l.prototype.off, l.prototype.emit = l.prototype.trigger = function(e) {
		this._callbacks = this._callbacks || {};
		var t = [].slice.call(arguments, 1),
			i = this._callbacks["$" + e];
		if (i) {
			i = i.slice(0);
			for (var n = 0, o = i.length; o > n; ++n) i[n].apply(this, t)
		}
		return this
	}, l.prototype.listeners = function(e) {
		return this._callbacks = this._callbacks || {}, this._callbacks["$" + e] || []
	}, l.prototype.hasListeners = function(e) {
		return !!this.listeners(e).length
	}, {
		init: function() {
			new s
		}
	}
}), define("douyu/page/room/normal/app1", ["jquery", "douyu/com/header", "douyu/com/user", "shark/observer", "douyu/page/room/base/api", "douyu/page/room/normal/mod/video", "douyu/page/room/normal/mod/layout", "douyu/page/room/normal/mod/title", "douyu/page/room/normal/mod/userinfo", "douyu/page/room/normal/mod/dp", "douyu/page/room/normal/mod/center", "douyu/com/marketingSDK"], function(e, t, i, n, o, a, r, s, l, c, d, u) {
	var f = function() {
			u.init();
			var e = t.init({
				onLogin: function(e) {
					i.show("login", {
						source: e
					})
				},
				onReg: function(e) {
					i.show("reg", {
						source: e
					})
				},
				onExit: function() {
					i.exit()
				}
			});
			i.init({
				onAuto: function(t) {
					t && e.login()
				}
			}), c.init("page_studio_normal"), a.init(), d.init(), r.init(), s.init(), l.init(), n.on("second-queue-willLoad", function() {
				require.use(["douyu/com/lazyLoad"], function(e) {
					e.echelon([
						["douyu/page/room/normal/mod-all1.js",
						{
							"douyu/page/room/normal/mod/gift": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/chat": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/fans-medal-set2": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/fans-medal-config": function(e) {
								e.init()
							},
							"douyu/com/kill-ie": function(e) {
								e.init()
							},
							"douyu/com/imgp": function(e) {
								e.build()
							},
							"douyu/page/room/normal/mod/baidu-hm": function(e) {
								e.init()
							},
							"douyu/com/avatar": function(e) {},
							"douyu/com/zoom": function(e) {},
							"douyu/page/room/normal/mod/page-full": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/freetime": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/cover-title-remind": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/charge": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/anchor-white-list": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/weibo": function(e) {},
							"douyu/page/room/normal/mod/private-letter": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/noble-speaker": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/chat-noble-enter": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/girl-privilege": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/level120-enter": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/noble-overtime-tips": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/broadcast": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/super-recommended": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/bonus": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/layertip": function(e) {},
							"douyu/page/room/normal/mod/room-menu-startup": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/draw": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/energy-charge-task": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/gameRecommend": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/live-rank-info": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/yz-rank-list": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/yuba-group-dynamic": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/anchor-level": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/anchor-impress": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/share": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/anchor-games": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/qr-code": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/olyw": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/guess": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/anchor-guess": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/yz-gift-rank": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/taobao-goods": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/anchor-dynamic": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/yz-rank-info": function(e) {},
							"douyu/page/room/normal/mod/jifen": function(e) {
								e.init()
							},
							"douyu/com/room-gift-tmp": function(e) {
								e.render()
							},
							"douyu/page/room/normal/mod/motorcade": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/rec-video": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/recommended": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/guide": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/filter-keywords": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/center": function() {
								n.trigger("second-queue-hasLoaded")
							}
						}],
						["douyu/page/room/normal/mod-all2.js",
						{
							"douyu/page/room/normal/mod/sign": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/rotary-draw": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/guess-game/guess-game": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/task-addon": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/task": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/backpack": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/game2": function(e) {
								e.init()
							},
							"douyu/page/room/normal/mod/anchor-like": function(e) {},
							"douyu/page/room/normal/mod/yz-pk-treasure": function(e) {
								e.init()
							},
							"douyu/com/com-pay": function(e) {
								e.init()
							},
							"douyu-activity/activity": function(e) {
								e.init();
							},
							"douyu/com/footer": function(e) {}
						}]
					])
				})
			})
		};
	e(f)
});