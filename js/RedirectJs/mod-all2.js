console.log("I'm form%c mod-all2.js","color:green");
function insertData(_data) {
	console.log(_data);
	window.postMessage({"insertSql": _data}, '*');
};
define("douyu/page/room/normal/mod/sign-rate", ["douyu/com/sign", "douyu/com/imgp", "douyu/com/exjsonp", "douyu/context", "shark/util/storage/1.0"], function(e, t, a, s, i) {
	var n = {
		cateId: s.get("room.cate_id"),
		categoryId: s.get("room.category_id"),
		url: $SYS.webconfUrl.replace(/^http(s?):/, "").replace(/\/$/g, "") + "/resource/ap/live_room_ap_freq.json",
		fn: function() {},
		ctime: s.get("room.stsign_room.ctime") || 0,
		roomChatAdid: "10020",
		roomTopAdid: "30009"
	},
		r = {
			init: function(e) {
				a.load(n.url, "setadrate", function(t) {
					t && t[n.roomChatAdid] && t[n.roomTopAdid] && (r.roomChat = $.extend(!0, r.roomChat, t[n.roomChatAdid]), r.roomTop = $.extend(!0, r.roomTop, t[n.roomTopAdid])), e()
				}, e, n.fn, !0)
			},
			isShowAd: function(e, t) {
				var a = this;
				a.isCateShowAd(t) ? a.isTimeShowAd(e, t) : t.setAd(e, !0)
			},
			isCateShowAd: function(e) {
				var t = this,
					a = e.cate1,
					s = e.cate2,
					i = n.cateId,
					r = n.categoryId,
					o = t.isStrInArr(r, a),
					d = t.isStrInArr(i, s);
				return !(!o && !d)
			},
			isTimeShowAd: function(e, t) {
				var a = t.type,
					s = i.get(a + "ShowTime"),
					r = s ? s : 0,
					o = +new Date,
					d = (o - r) / 1e3,
					c = t.daily_cap;
				c >= 0 && t.interval >= 0 && d > 0 ? n.ctime === i.get(a) ? d >= t.interval && t.setAd(e) : (i.set(a, n.ctime), t.setAd(e, null, !0)) : t.setAd(e, !0)
			},
			isStrInArr: function(e, t) {
				var a, t = t || [];
				if (0 === t.length) return !1;
				for (var s = 0, i = t.length; i > s; s += 1) t[s] == e && (a = !0);
				return a
			},
			setStoreRate: function(e, t) {
				i.set(e + "ShowTime", +new Date), i.set(e + "ShowRate", t)
			},
			getStoreRate: function(e) {
				var t, a = i.get(e.type + "ShowRate");
				return t = null === a && 0 !== a ? e.daily_cap : a
			},
			roomChat: {
				type: "roomChat",
				showAgain: !0,
				timer: null,
				adid: n.roomChatAdid,
				init: function(e) {
					var t = this;
					r.isShowAd(e, t)
				},
				setAd: function(e, t, a) {
					var s = this;
					s.rate = a ? s.daily_cap : r.getStoreRate(s);
					var i = $("[data-dysign=" + s.adid + "]");
					!t && s.rate > 0 && (i.hasClass("hide") && (s.rate--, r.setStoreRate(s.type, s.rate)), s.isShowAd(i, e, t)), t && s.isShowAd(i, e, t)
				},
				isShowAd: function(e, a, s) {
					var i = this;
					return e.html() ? void(e.hasClass("hide") && (i.setAdEvt(e, a, s), $("#js-chat-cont").append(e), e.removeClass("hide"), t.build())) : void e.addClass("hide")
				},
				setAdEvt: function(e, t, a) {
					var s = e.find(".chat-ad-cls"),
						i = e.data("showTime"),
						n = 3;
					0 === s.length && (e.append('<a class="chat-ad-cls" href="javascript:;" title="关闭"><em>3S后可</em>关闭</a>'), s = e.find(".chat-ad-cls"));
					var r = s.find("em"),
						o = setInterval(function() {
							0 === --n ? (clearInterval(o), r.remove()) : r.text(n + "S后可")
						}, 1e3);
					i && setTimeout(function() {
						e.addClass("hide"), s.remove()
					}, 1e3 * i), s.off("click").on("click", function() {
						0 === n && e.remove()
					})
				}
			},
			roomTop: {
				type: "roomTop",
				showAgain: !0,
				adid: n.roomTopAdid,
				init: function(e, t) {
					var a = this;
					a.IsDiy = t, r.isShowAd(e, a)
				},
				setAd: function(e, t, a) {
					var s = $(e.el),
						i = this;
					i.rate = a ? i.daily_cap : r.getStoreRate(i), t || 0 === i.rate || (s.hasClass("hide") && (i.rate && i.rate--, r.setStoreRate(i.type, i.rate)), i.isShowRoomTop(s), i.showAgain = !1), t && i.isShowRoomTop(s), i.timer && clearTimeout(i.timer)
				},
				isShowRoomTop: function(e) {
					var a = this;
					if (!e.html()) return e.addClass("hide"), void(a.showAgain = !1);
					if (e.hasClass("hide")) {
						e.removeClass("hide"), t.build(), e.find("a").addClass("adBoradius");
						var s = e.data("dysignShowtime") ? e.data("dysignShowtime") : e.data("dysignShowtime");
						a.IsDiy && s && setTimeout(function() {
							e.addClass("hide")
						}, 1e3 * s)
					}
				}
			}
		};
	return r
}), define("douyu/page/room/normal/mod/broadcast", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/storage/1.0", "shark/util/flash/data/1.0", "shark/util/template/2.0", "douyu/context", "douyu/com/sign", "douyu/com/exjsonp", "douyu/page/room/base/api", "shark/lib/json2"], function(e, t, a, s, i, n, r, o, d, c) {
	var l = {
		urls: {
			config: r.get("sys.webconfUrl") + "resource/common/broadcast/broadcastJsonp.json"
		},
		adQueue: [],
		flags: {
			configLoaded: 0,
			detailLoaded: 0,
			signLoaded: 0,
			isShow: 0,
			pageLoaded: 1
		},
		storeNames: {
			configData: "broadcastconfig",
			broadcasts: "broadcasts",
			broadcastlimit: "broadcastlimit"
		},
		timers: {
			delayTime: null,
			displayTime: null
		},
		data: {
			currentData: null,
			roomId: r.get("room.room_id")
		},
		config: {},
		init: function() {
			var a = this;
			this.doms = {
				sysBroadcast: e("#js-chat-notice")
			}, this.renders = {
				renderAd: this.renderAdFn(),
				renderNotify: this.renderNotifyFn(),
				renderImg: this.renderImgFn()
			}, d.load(a.urls.config, "setSysBroadcastConf", function(e) {
				a.config = e, s.set(a.storeNames.configData, e), t.trigger("mod.broadcast.config.loaded")
			}, function() {
				a.config = s.get(a.storeNames.configData), a.config && t.trigger("mod.broadcast.config.loaded")
			}), a.bindEvents()
		},
		renderAdFn: function() {
			var e = a.string.join('<div class="chat-sysbroadcast-ad {{ if !data.link }} chat-sysbroadcast-ad-nolink{{ /if }}" {{if data.posid }} data-dysign={{data.posid}} {{/if}}>', '<div class="chat-sysbroadcast-header clearfix">', '<a data-sysbroadcast="btn-close" class="chat-sysbroadcast-close" href="javascript:;" title="关闭">关闭</a>', "</div>", '<div class="chat-sysbroadcast-body clearfix  {{if data.posid }} dysign-text-dot {{/if}}">', "{{ if data.link }}", '<a href="{{ data.link }}" data-sysbroadcast="cont" class="chat-sysbroadcast-cont" target="_blank" title="{{ data.c }}">', "{{ data.c }}", "</a>", '<a href="{{ data.link }}" data-sysbroadcast="godetail" class="chat-sysbroadcast-godetail fr" target="_blank" title="查看详情">查看详情</a>', "{{ else }}", '<div data-sysbroadcast="cont" class="chat-sysbroadcast-cont" target="_blank" title="{{ data.c }}">', "{{ data.c }}", "</div>", "{{ /if }}", "</div>", "</div>"),
				t = n.compile(e);
			return t
		},
		renderNotifyFn: function() {
			var e = a.string.join('<div class="chat-sysbroadcast">', '<div class="chat-sysbroadcast-header clearfix">', '<a data-sysbroadcast="btn-close" class="chat-sysbroadcast-close" href="javascript:;" title="关闭">关闭</a>', "</div>", '<div class="chat-sysbroadcast-body clearfix">', "{{ if data.link }}", '<a href="{{ data.link }}" data-sysbroadcast="cont" class="chat-sysbroadcast-cont" target="_blank" title="{{ data.c }}">', "{{ data.c }}", "</a>", "{{ else }}", '<div data-sysbroadcast="cont" class="chat-sysbroadcast-cont" title="{{ data.c }}">', "{{ data.c }}", "</div>", "{{ /if }}", "</div>", "</div>"),
				t = n.compile(e);
			return t
		},
		renderImgFn: function() {
			var e = a.string.join('<div class="chat-sysbroadcast-imgad" {{if data.posid }} data-dysign={{data.posid}} {{/if}}>', "{{ if data.link }}", '<a href="{{ data.link }}" data-sysbroadcast="cont" class="chat-sysbroadcast-cont" target="_blank">', '<img style="width: 335px; height: 116px;" src="{{ data.wis }}" title="{{ data.c }}" />', "</a>", "{{ else }}", '<div data-sysbroadcast="cont" class="chat-sysbroadcast-cont">', '<img style="width: 335px; height: 116px;" src="{{ data.wis }}" title="{{ data.c }}" />', "</div>", "{{ /if }}", "{{ if data.mtype == 1 }}", '<div class="chat-sysbroadcast-ad-flag">广告</div>', "{{ /if }}", '<a data-sysbroadcast="btn-close" class="chat-sysbroadcast-close" href="javascript:;" title="关闭">关闭</a>', "</div>"),
				t = n.compile(e);
			return t
		},
		bindEvents: function() {
			var e = this,
				a = e.doms.sysBroadcast;
			t.on("mod.broadcast.config.loaded", function() {
				e.flags.configLoaded = 1, e.check() && (e.flags.signLoaded ? e.adQueue.push(1) : e.setBroadcast())
			}), c.reg("room_data_brocast", function(t) {
				var a = i.decode(t).too();
				window.removeSign || "rsm" == a.type && (e.data.currentData = a, e.flags.detailLoaded = 1, e.check() && (e.flags.signLoaded ? e.adQueue.push(1) : e.setBroadcast()))
			}), a.on("click", '[data-sysbroadcast="btn-close"]', function() {
				var a = e.data.currentData;
				e.hideBroadcast(), a && t.trigger("dys", {
					key: "dys.room.sysbroadcast.close",
					radio_type: parseInt(a.mtype, 10) + 1,
					radio_id: a.id
				})
			}), a.on("click", 'a[data-sysbroadcast="cont"], [data-sysbroadcast="godetail"]', function() {
				var a = e.data.currentData;
				a && t.trigger("dys", {
					key: "dys.room.sysbroadcast.click",
					radio_type: parseInt(a.mtype, 10) + 1,
					radio_id: a.id,
					jurl: 1 == a.jmptp ? "" : a.weburl,
					rid: 1 == a.jmptp ? a.weburl : 0
				})
			})
		},
		check: function() {
			return this.flags.configLoaded && this.flags.detailLoaded
		},
		setBroadcast: function() {
			var e, t, a, i = this,
				n = i.data.roomId,
				r = i.storeNames.broadcasts,
				o = i.storeNames.broadcastlimit,
				d = i.config,
				c = i.timers,
				l = i.renders,
				g = i.data.currentData,
				u = g && g.id,
				m = g && g.t,
				p = (new Date).getTime();
			if (u && g.clitp % 2 == 1 && (2 == m || 3 == m || 4 == m || 5 == m)) {
				if (u && (u = parseInt(g.id, 10)), 0 != d.frequency.time && 0 != d.frequency.count || s.remove(o), a = s.get(o), a || (a = {}), a.showedTimes || (a.showedTimes = 0, a.firstTime = (new Date).getTime()), 0 != d.frequency.time && 0 != d.frequency.count) if (a.firstTime + 6e4 * d.frequency.time > p) {
					if (a.showedTimes >= d.frequency.count) return
				} else a = {
					showedTimes: 0,
					firstTime: (new Date).getTime()
				};
				e = s.get(r), e || (e = {}), i.flags.pageLoaded && (i.flags.pageLoaded = 0, e[n] = null, delete e[n]), t = e && e[n], t && d.sort[g.t] < d.sort[t.t] || (i.currentRender = function() {
					return ""
				}, 1 == g.jmptp ? g.link = "/" + g.weburl : g.link = g.weburl, g.wis ? (g.wis = d.broadcast_img_prefix + g.wis, i.currentRender = l.renderImg) : 1 == g.mtype ? i.currentRender = l.renderAd : i.currentRender = l.renderNotify, clearTimeout(c.displayTime), i.flags.isShow && i.hideBroadcast(), 0 != d.delay ? c.delayTime = setTimeout(function() {
					i.render(), clearTimeout(c.delayTime)
				}, 1e3 * parseInt(d.delay, 10)) : i.render(), a.showedTimes++, e[n] = g, s.set(o, a), s.set(r, e, 31536e3))
			}
		},
		render: function() {
			var t = this.data.currentData,
				a = "";
			a = e.trim(this.currentRender({
				data: t
			})), a && (this.doms.sysBroadcast.html(a), this.showBroadcast())
		},
		showBroadcast: function() {
			var e = this,
				a = e.timers,
				s = e.data.currentData,
				i = e.doms.sysBroadcast;
			t.trigger("dys", {
				key: "dys.room.sysbroadcast.show",
				radio_type: parseInt(s.mtype, 10) + 1,
				radio_id: s.id
			}), i.removeClass("hide").animate({
				bottom: 90,
				opacity: 1
			}), i.find('[data-sysbroadcast="cont"]').animate({
				height: "auto"
			}, function() {
				e.flags.isShow = 1, "0" != s.distm && (a.displayTime = setTimeout(function() {
					e.hideBroadcast()
				}, 1e3 * s.distm || 1500))
			})
		},
		hideBroadcast: function() {
			var e = this,
				t = e.doms.sysBroadcast,
				a = e.timers;
			clearTimeout(a.displayTime), t.animate({
				bottom: 3,
				opacity: 0
			}).find('[data-sysbroadcast="cont"]').animate({
				height: 0
			}, function() {
				e.flags.isShow = 0, g.canShowBroadcast()
			})
		}
	},
		g = {
			flag: !1,
			id: 10014,
			init: function() {
				var e = this;
				t.on("direction.sign." + e.id, function(t) {
					parseInt(t.posid, 10) === e.id && (l.flags.signLoaded = 1, g.render(t))
				}), this.addEvent()
			},
			render: function(t) {
				var a = this.buildComData(t),
					s = "",
					i = t.srcid ? l.renders.renderImg : l.renders.renderAd,
					n = t.ec || {},
					r = n.cd;
				if (n.text && (a.c = n.text), this.isSignGapExpired(r)) {
					if (s = e.trim(i({
						data: a
					})), !s) return void this.canShowBroadcast();
					l.doms.sysBroadcast.html(s), this.showSign(t), o.exposure()
				}
			},
			showSign: function(e) {
				var t = this,
					a = l.doms.sysBroadcast;
				a.removeClass("hide").animate({
					bottom: 90,
					opacity: 1
				}), a.find('[data-sysbroadcast="cont"]').animate({
					height: "auto"
				}, function() {
					t.displayTime = setTimeout(function() {
						t.hideSign()
					}, 1e3 * e.ec.showtime || 15e3)
				})
			},
			hideSign: function() {
				var e = this,
					t = l.doms.sysBroadcast;
				clearTimeout(e.displayTime), t.animate({
					bottom: 3,
					opacity: 0
				}).find('[data-sysbroadcast="cont"]').animate({
					height: 0
				}, function() {
					e.canShowBroadcast()
				})
			},
			canShowBroadcast: function() {
				l.flags.signLoaded = 0, l.adQueue.length > 0 && (l.adQueue.pop(), l.setBroadcast())
			},
			isSignGapExpired: function(e) {
				var t = Number(e),
					a = "sign_last_show",
					i = s.get(a);
				if (isNaN(t) || void 0 === e || null === i) return s.set(a, +new Date), !0;
				var n = +new Date - i,
					r = 1e3 * t;
				return n > r ? (s.set(a, +new Date), !0) : !1
			},
			buildComData: function(e) {
				var t = {};
				return t.link = o.helper.innerLink(e), t.wis = e.srcid, t.c = e.adtitle, t.mtype = e.priority, t.posid = e.posid, t
			},
			addEvent: function() {
				e("#mainbody").on("click", ".dysign-text-dot a", function(e) {
					t.trigger("mod.sign.dot", 10014)
				})
			}
		};
	return {
		init: function() {
			l.init()
		},
		signInit: function() {
			g.init()
		}
	}
}), define("douyu/page/room/normal/mod/sign", ["douyu/com/sign", "douyu/com/user", "douyu/context", "shark/util/cookie/1.0", "shark/observer", "shark/util/storage/1.0", "shark/util/flash/data/1.0", "douyu/page/room/base/api", "douyu/page/room/normal/mod/sign-rate", "douyu/page/room/normal/mod/broadcast", "douyu/com/imgp"], function(e, t, a, s, i, n, r, o, d, c, l) {
	function g(e) {
		for (var t = 0, a = e.length; a > t; t++) e[t].isReverse = e[t].remark - 1;
		return e
	}
	function u() {
		_ || p.distributeBarrageByQueue(k), _ = 1
	}
	var m = {
		count: 0,
		adplaytime: 60,
		distributeTaskTimer: 0,
		distributeTaskDelay: 6e4,
		athenaSwitch: a.get("colligate.athena_switch") || {
			zmd: 0,
			sdm: 0,
			lmt: 60
		},
		giftBottomInterval: 1e4,
		giftBottomTimer: 0,
		marqueeCount: 1,
		loadAdFlag: !1
	},
		p = {},
		f = {},
		h = {},
		v = 0,
		y = !1,
		b = window.$SYS ? $SYS.sign_newver : !1,
		k = [],
		_ = 0,
		w = {},
		T = {},
		S = function() {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(e) {
				window.setTimeout(e, 1e3 / 60)
			}
		}();
	i.on("mod.chat.sign.video.state", function(e) {
		v = e.state || 0
	}), p.down15 = function(t) {
		var a = parseInt(t.posid);
		return 15 === a || 18 === a ? (m.count++, e.helper.defview(t), 2 === m.count && ($("[data-dysign=15]").removeClass("hide"), e.exposure(), setTimeout(function() {
			$("[data-dysign=15]").remove(), $("[data-dysign=18]").removeClass("hide"), e.exposure(), setTimeout(function() {
				$("[data-dysign=18]").remove()
			}, 15e3)
		}, 15e3)), !0) : !1
	}, f.roomVideoBottom = function(e) {
		if (e && 11 == e.id) {
			var t = $(e.el);
			t[t.html() ? "removeClass" : "addClass"]("hide"), t.find("a").addClass("adBoradius");
			var a = t.data("dysign-showtime");
			y && a && setTimeout(function() {
				t.hide()
			}, 1e3 * a)
		}
	}, f.roomBottom = function(e) {
		if (e && 30008 == e.id) {
			var t = $(e.el);
			t[t.html() ? "removeClass" : "addClass"]("hide"), t.find("a").addClass("adBoradius")
		}
	}, f.roomGiftBottom = function(t, a) {
		return t && 30012 == t.posid ? (S(function() {
			var s = $("[data-dysign=30012]"),
				i = "",
				n = "";
			if ("string" == typeof a) i = a, n = a;
			else {
				var r = "" == t.link ? "" : e.helper.innerLink(t);
				i = '<a href="' + r + '" ', i += 'class="room-dysign" ', i += 'title="' + t.srcid + '" ', i += 'data-dysign="' + t.posid + '" ', i += 'data-gid="' + t.gid + '" ', i += 'data-mid="' + t.mid + '" ', i += 'data-adid="' + t.adid + '" ', i += 'data-proid="' + t.proid + '" ', i += 'target="_blank">' + t.srcid + "</a>", n = '<a href="' + r + '" ', n += 'class="room-dysign" ', n += 'title="' + t.srcid + '" ', n += 'target="_blank">' + t.srcid + "</a>"
			}
			if (0 === s.find(".ft-roll-cont").length) {
				s.append('<div class="laba"></div><div class="ft-roll-cont"></div> '), s.removeClass("hide");
				var o = $(n);
				o.removeClass("js-athena-sign"), s.find(".ft-roll-cont").append(o)
			}
			s.data({
				"dysign-mid": t.mid,
				"dysign-gid": t.gid
			}), s.find(".ft-roll-cont a:last").before(i), f.roomGiftBottomMarquee()
		}), !0) : void 0
	}, f.roomGiftBottomMarquee = function() {
		if (0 === m.giftBottomTimer) {
			var e = $("[data-dysign=30012]"),
				t = function() {
					if (2 === e.find(".ft-roll-cont").children().length) return clearInterval(m.giftBottomTimer), void(m.giftBottomTimer = 0);
					$(".ft-roll-cont").animate({
						top: 18 * -m.marqueeCount
					}, function() {
						1 === m.marqueeCount && $(".ft-roll-cont").css("top", "0")
					});
					var t = e.find("a").eq(m.marqueeCount);
					f.athenaDys(t), m.marqueeCount === e.find(".ft-roll-cont").children().length - 1 && (m.marqueeCount = 0), m.marqueeCount++
				};
			f.athenaDys(e.find("a").eq(0)), m.giftBottomTimer = setInterval(function() {
				t()
			}, m.giftBottomInterval), $(window).trigger("scroll")
		}
	}, f.athenaDys = function(e) {
		var t = $(e);
		if (t.hasClass("js-athena-sign")) {
			var s = t.data();
			if ("1" !== t.data("dys-athena")) {
				$.get("/lapi/athena/room/dot", {
					t: (new Date).getTime(),
					bizid: s.bid,
					bthid: s.booth_id,
					conId: s.con_id,
					roomId: a.get("room.room_id") || 0
				});
				var n = $.extend({
					key: "dys.room.normal.show.athena.zmd",
					ctid: $ROOM.cate_id
				}, s);
				i.trigger("dys", n), t.data("dys-athena", "1")
			}
		}
	}, f.roomChatBottom = function(t) {
		t && 30011 == t.id && (n.get("roomChatBottomAD") || setTimeout(function() {
			if (!v) {
				var a = $(t.el);
				a.children().length > 0 && (a[a.html() ? "removeClass" : "addClass"]("hide"), a.append("<span></span>"), a.find("span").on("click", function() {
					a.remove()
				}), l.build(), e.exposure(), setTimeout(function() {
					a.remove()
				}, 15e3), n.set("roomChatBottomAD", 1, 259200))
			}
		}, 18e4))
	}, h.room_15_18 = function() {
		var t = $("[data-dysign=15]"),
			a = $("[data-dysign=18]"),
			s = m.adplaytime,
			r = t.children().length > 0,
			o = a.children().length > 0;
		s && s == Number(n.get("adplaytime")) || (r ? (t.removeClass("hide"), e.exposure(), t.is(":hidden") || i.trigger("mod.sign.start", {}), setTimeout(function() {
			t.remove(), i.trigger("mod.sign.end", {}), o && (a.removeClass("hide"), a.is(":hidden") || i.trigger("mod.sign.start", {}), e.exposure(), setTimeout(function() {
				a.remove(), i.trigger("mod.sign.end", {})
			}, 15e3))
		}, 15e3)) : o && (a.removeClass("hide"), a.is(":hidden") || i.trigger("mod.sign.start", {}), setTimeout(function() {
			a.remove(), i.trigger("mod.sign.end", {})
		}, 15e3)), $("body").width() <= 1366 && n.set("adplaytime", s, s))
	}, p.loadDistributeInfo = function() {
		$.ajax({
			url: "/lapi/athena/room/barrage",
			type: "get",
			dataType: "json",
			data: {
				t: (new Date).getTime(),
				roomId: $ROOM.room_id,
				cid: $ROOM.cate_id
			},
			success: function(e) {
				if (0 === e.error && e.data) {
					var t = e.data.length > 0 ? g(e.data) : [];
					_ ? p.distributeBarrageByQueue(t) : k = t
				} else p.distributeBarrageByQueue([])
			},
			error: function() {
				p.distributeBarrageByQueue([])
			}
		})
	}, p.distributeBarrage = function() {
		var e = m.athenaSwitch.sdm || 0,
			t = 100 * Math.random();
		e > t && p.loadDistributeInfo()
	}, p.distributeBarrageByQueue = function(e) {
		clearTimeout(m.distributeTaskTimer);
		var t = m.athenaSwitch.lmt || 60;
		if (t = 1e3 * t, e && 0 !== e.length) {
			var a = e.shift();
			o.exe("js_send_super_danmu", JSON.stringify([a])), m.distributeTaskTimer = setTimeout(function() {
				p.distributeBarrageByQueue(e)
			}, t)
		} else m.distributeTaskTimer = setTimeout(function() {
			p.loadDistributeInfo()
		}, m.distributeTaskDelay)
	}, p.distributeRoomBottom = function() {
		var e = m.athenaSwitch.zmd || 0,
			t = 100 * Math.random();
		e > t && $.ajax({
			url: "/lapi/athena/room/marquee",
			type: "get",
			dataType: "json",
			data: {
				t: (new Date).getTime(),
				roomId: $ROOM.room_id,
				cid: $ROOM.cate_id
			},
			success: function(e) {
				0 === e.error && e.data && e.data.length > 0 && p.renderRoomGiftBottom(e.data)
			}
		})
	}, p.renderRoomGiftBottom = function(e) {
		$(e).each(function(e, t) {
			p.addRoomGiftBottom(t)
		})
	}, p.addRoomGiftBottom = function(e) {
		if ("" !== $.trim(e.title)) {
			e.jump_type = parseInt(e.jump_type, 10), 1 === e.jump_type ? (e.jurl = e.jump_to, e.rid = "", e.vid = "") : 2 === e.jump_type ? (e.vid = "", e.rid = e.jump_to, e.jurl = "/" + (+e.vipId ? e.vipId : e.jump_to)) : (e.rid = "", e.vid = e.jump_to, e.jurl = $SYS.vsite_url + "/show/" + e.jump_to), e.booth_id = 2;
			var t = [];
			t.push('<a target="_blank" class="js-athena-sign" '), t.push('data-bid="' + e.bid + '" '), t.push('data-booth_id="' + e.booth_id + '" '), t.push('data-ruleset_id="' + e.ruleset_id + '" '), t.push('data-con_id="' + e.con_id + '" '), t.push('data-rid="' + e.rid + '" '), t.push('data-vid="' + e.vid + '" '), t.push('data-jurl="' + e.jurl + '" '), t.push('href="' + e.jurl + '" >'), t.push(e.title), t.push("</a>"), t = t.join(""), f.roomGiftBottom({
				posid: 30012
			}, t)
		}
	}, p.initEvent = function() {
		$("[data-dysign=30012]").on("click", ".js-athena-sign", function() {
			var e = $(this).data(),
				t = $.extend({
					key: "dys.room.normal.click.athena.zmd",
					ctid: $ROOM.cate_id
				}, e);
			$.get("/lapi/athena/room/catch", {
				t: (new Date).getTime(),
				bizid: e.bid,
				bthid: e.booth_id,
				conId: e.con_id,
				roomId: a.get("room.room_id") || 0
			}), delete t.dysAthena, i.trigger("dys", t)
		})
	}, o.reg("room_video_ready", u), o.reg("room_data_login", function() {
		1 !== parseInt($ROOM.show_status, 10) && u()
	}), w = {
		init: function() {
			$.ajax({
				url: "/lapi/sign/phonegameapi/getinfo",
				type: "post",
				data: {
					posidstr: "1",
					rid: $ROOM.room_id,
					cid: $ROOM.category_id,
					tid: $ROOM.cate_id
				},
				dataType: "json",
				success: function(e) {
					0 === e.code && e.data && e.data.length > 0 && (w.titleSignData = e.data[0], w.renderTitleSign(), w.bindEvent())
				}
			})
		},
		renderTitleSign: function(t) {
			var a = "";
			2 == w.titleSignData.ad_type && (a = '<i class="sign-spec"></i>');
			var s = e.helper.innerPath(w.titleSignData.ad_img),
				n = ['<div class="sq-ad fl" style="position:relative">', a, '<a href="' + w.titleSignData.link + '" target="_blank">', '<img src="' + s + '"  style="width:125px;height:25px"></a>', "</div>"].join("");
			w.titleSign = $(n).hide(), $("#anchor-info .sq-wrap").prepend(w.titleSign), i.trigger("mod.normal.achorinfo.layout")
		},
		titleSignLayout: function() {
			if (w.titleSign) {
				var e = w.titleSign,
					t = $("#js-live-room-normal-left").width(),
					a = 0 === $(".no-anchor-impress").length,
					s = a ? 350 : 300,
					n = a ? $("#anchor-info .anchor-impress") : $("#anchor-info .r-else");
				t - n.outerWidth(!0) - e.outerWidth(!0) - s > 0 ? (e.show(), 1 !== e.data("dys-mgamead-show") && (i.trigger("dys", {
					key: "mod.room.noraml.mgamead.show",
					tg_id: w.titleSignData.ad_id
				}), e.data("dys-mgamead-show", 1))) : e.hide()
			}
		},
		bindEvent: function() {
			w.titleSign.on("click", function() {
				i.trigger("dys", {
					key: "mod.room.noraml.mgamead.click",
					tg_id: w.titleSignData.ad_id
				})
			})
		}
	}, i.on("mod.normal.achorinfo.layout", function() {
		w.titleSignLayout()
	}), T = {
		init: function() {
			var e = this;
			i.on("direction.sign.10010", function(t) {
				t && e.renderTitleSign(t)
			})
		},
		renderTitleSign: function(t) {
			var a = "",
				s = this,
				i = e.helper.innerPath(t.srcid),
				n = e.helper.innerLink(t),
				r = this.makePhoneSignTpl(i, n, a),
				d = $(r).show();
			$("#anchor-info .sq-wrap").prepend(d), o.reg("room_data_tbredpacket", function(e) {
				s.titleSignLayout()
			}), e.exposure()
		},
		titleSignLayout: function() {
			var e = $("#anchor-info .sq-wrap").find("[data-dysign]"),
				t = $("#js-live-room-normal-left").width(),
				a = 0 === $(".no-anchor-impress").length,
				s = a ? 350 : 300,
				i = a ? $("#anchor-info .anchor-impress") : $("#anchor-info .r-else");
			t - i.outerWidth(!0) - e.outerWidth(!0) - s > 0 ? $(e).show() : $(e).hide()
		},
		makePhoneSignTpl: function(e, t, a) {
			var s = ['<div class="sq-ad fl" data-dysign="10010" style="position:relative">', a, '<a href="' + t + '" target="_blank">', '<img src="' + e + '"  style="width:125px;height:25px"></a>', "</div>"].join("");
			return s
		}
	}, f.recommendSign = function(t) {
		return t && 30014 == t.posid ? (S(function() {
			var a, s = "" == t.link ? "" : e.helper.innerLink(t);
			a = '<a href="' + s + '" ', a += 'class="room-dysign" ', a += 'data-dysign="' + t.posid + '" ', a += 'data-gid="' + t.gid + '" ', a += 'data-mid="' + t.mid + '" ', a += 'data-adid="' + t.adid + '" ', a += 'data-proid="' + t.proid + '" ', a += 'title="' + t.srcid + '" ', a += 'target="_blank"><span class="icon-ad"></span>' + t.srcid + "</a>", $("[data-dysign=30014]").removeClass("hide").append(a)
		}), !0) : void 0
	}, f.roomChatCont = function(t) {
		if (t && 10020 == t.id) {
			var a = e.helper.getAdInfoInData(t.id);
			e.helper.defview(a);
			var s = d.roomChat;
			s.init(t)
		}
	}, f.roomDySign = function(t) {
		var a = [12, 13, 14, 10001, 10002, 10003, 10004, 10005, 10006];
		e.helper.setSignNormalImg(t, a, "room-dysign")
	};
	var C = function() {
			var e = new Image,
				t = "http://cm.adxvip.com/CookieMapping?mid=REU1NjI2NTNERTZDMTRD&uid=";
			e.src = t + s.get("did")
		};
	if (window._pageadvar && _pageadvar.length) {
		for (var x = !1, D = 0, P = _pageadvar.length; P > D; D++) if (2 === _pageadvar[D].isthird) {
			x = !0;
			break
		}
		x && C()
	}
	$("#mainbody").on("click", ".room-dysign", function() {
		if ($SYS && $SYS.sign_newver) {
			var t = $(this).closest("[data-dysign]").data("dysign"),
				a = $(this).data("gid"),
				s = $(this).data("mid"),
				n = e.helper.getTextAdInfo(t, a, s);
			i.trigger("mod.sign.dot", t, n)
		}
	}), $("body").on("click", '[data-dysign="30010"] img', function() {
		var e = $(this).closest("[data-dysign]").data("dysign");
		i.trigger("mod.sign.dot", e)
	});
	var R = [30009, 10010, 10014],
		B = {
			init: function() {
				var t = this;
				e.getAdInfo(R.join(","), t.distributeSign)
			},
			distributeSign: function(e) {
				if (e.length > 0) for (var t = e, a = 0; a < t.length; a++) {
					var s = parseInt(t[a].posid, 10); - 1 !== $.inArray(s, R) && i.trigger("direction.sign." + s, t[a])
				}
			}
		};
	i.on("direction.sign.30009", function(t) {
		if (t) {
			e.helper.defview(t), t.id = 30009, t.el = $('.room-ad-top[data-dysign="30009"]')[0];
			var a = d.roomTop;
			a.init(t, y)
		}
	});
	var I = {
		init: function() {
			$.get("/ztCache/mobilegame/getPush", {
				room_id: $ROOM.room_id,
				client_sys: "web"
			}, function(e) {
				0 === e.error && e.data && 1 === e.data.show && (I.data = e.data, I.render(e.data), i.on("mod.normal.achorinfo.layout", I.layout), i.trigger("mod.normal.achorinfo.layout"))
			}, "json")
		},
		render: function(e) {
			if (e.app_name && e.qrcode_url && !I.$down) {
				var t = ['<div class="GameDownload">', '<div class="GameDownload-btn">下载游戏</div>', '<div class="GameDownload-expand">', '<div class="GameDownload-fill"></div>', '<div class="GameDownload-arrawOut">', '<div class="GameDownload-arrowInner"></div>', "</div>", '<div class="GameDownload-qrcord">', '<div class="GameDownload-cont" id="GameDownloadCont"></div>', e.icon ? '<img class="GameDownload-icon" src="' + e.icon + '"/>' : "", "</div>", '<div class="GameDownload-desc">' + e.app_name + "</div>", '<div class="GameDownload-guideText">使用斗鱼APP扫码下载！</div>', "</div>", "</div>"].join("");
				$("#qrcode-content").after(t), this.$down = $(".GameDownload"), $("#GameDownloadCont").qrcode({
					render: "canvas",
					width: 160,
					height: 160,
					text: e.qrcode_url
				}), this.$down.on("mouseenter", function() {
					var t = {
						key: "dys.room.normal.title.GameDownload.show",
						game_id: e.app_id
					};
					i.trigger("dys", t)
				})
			}
		},
		layout: function() {
			var e = I.$down;
			e && e.hide();
			var t = $("#anchor-info .sq-wrap").outerWidth(),
				a = $("#js-live-room-normal-left").width(),
				s = 0 === $(".no-anchor-impress").length,
				i = s ? $("#anchor-info .anchor-impress") : $("#anchor-info .r-else");
			a - i.outerWidth(!0) - e.outerWidth(!0) - t > 0 ? e && e.show() : e && e.hide()
		}
	},
		q = {
			init: function() {
				var e = this,
					t = [30009, 30011, 10020, 10010, 11, 12, 13, 14, 10001, 10002, 10003, 10004, 10005, 10006, 10014, 30008, 30010, 30012, 30014];
				$.ajax({
					url: "/japi/sign/web/getinfo",
					type: "post",
					dataType: "json",
					data: {
						posid: t.join(","),
						roomid: $ROOM.room_id,
						uid: $SYS.uid,
						cate1: $ROOM.category_id,
						cate2: $ROOM.cate_id,
						ver: ""
					},
					timeout: 5e3,
					success: function(a) {
						0 === a.error && 0 === a.data.length ? (t.forEach(function(e) {
							$("[data-dysign=" + e + "]").remove()
						}), e.hide(), $(".promote").parent(".tab-body").remove(), $(".promotion").parent(".tab-header").remove()) : e.show()
					},
					error: function() {
						e.show()
					}
				})
			},
			show: function() {
				e.aop("clean", "room-chat-bottom", f.roomChatBottom), d.init(function() {
					B.init(), e.requestPage()
				}), b ? T.init() : w.init(), c.signInit()
			},
			hide: function() {
				B.init(), e.requestPage()
			}
		};
	return {
		init: function(a) {
			y = a, e.aop("clean", "room-video-bottom", f.roomVideoBottom), e.aop("clean", "room-bottom", f.roomBottom), e.aop("view", "room-gift-bottom", f.roomGiftBottom), e.aop("view", "recommend-ad", f.recommendSign), e.aop("clean", "room-chat-cont", f.roomChatCont), e.aop("clean", "room-dysign", f.roomDySign), t.check() ? (p.distributeBarrage(), p.distributeRoomBottom(), p.initEvent(), q.init()) : q.show(), I.init()
		}
	}
}), define("douyu/com/get-gift-configs", ["jquery", "shark/util/cookie/1.0", "shark/util/storage/1.0", "douyu/context", "douyu/com/exjsonp"], function(e, t, a, s, i) {
	var n = {
		initConfigs: function() {
			this.configs = {
				webconfUrl: s.get("sys.webconfUrl"),
				lastReqTimestamp: 0,
				propCBName: "propGiftConfig",
				giftCBName: "roomGiftConfig",
				giftBatchCBName: "commonConfig",
				loadProgress: [],
				urls: {
					getGiftConfigs: "resource/common/gift/gift_template/" + s.get("room.giftTempId") + ".json",
					getGiftBatchConfigs: "resource/common/gift/common_config_v2.json",
					getPropConfigs: "resource/common/prop_gift_list/prop_gift_config.json",
					getGiftConf: s.get("room.giftHost") + "/lapi/gift/webProp/getPropGift"
				},
				giftConfigArray: [],
				giftConfigsData: null,
				giftBatchConfigsData: null,
				propConfigsData: null,
				allConfigsData: null,
				loadPromise: e.Deferred()
			}
		},
		handleGiftConfig: function() {
			var e, t, a = this.configs,
				s = 0;
			if (a.giftConfigsData = {}, a.giftConfigArray && a.giftConfigArray.length) for (e = a.giftConfigArray.length; e > s; s++) t = a.giftConfigArray[s], t && (a.giftConfigsData[t.id] = t)
		},
		handleGiftBatchConfig: function(t) {
			var a, s, i = (this.configs, e.extend({}, t));
			if (!e.isEmptyObject(i)) for (var n in i) if (a = e.extend({}, i[n])) {
				if (a.batchTemp = {}, a.batchNum = [], a.list) for (var r = 0; r < a.list.length; r++) s = a.list[r], s.num && (a.batchTemp[s.num] = s, a.batchNum.push(s.num));
				a.batchNum.sort(function(e, t) {
					return e - t
				}), i[n] = a
			}
			return i
		},
		reqPropJson: function() {
			var t = this,
				a = t.configs,
				s = e.Deferred();
			return a.propConfigsData ? s.resolve(a.propConfigsData) : (i.load(a.webconfUrl + a.urls.getPropConfigs, a.propCBName, function(e) {
				return a.propConfigsData = e || {}, s.resolve(a.propConfigsData)
			}), s)
		},
		reqGiftJson: function() {
			var t = this,
				a = t.configs,
				n = e.Deferred();
			return void 0 === s.get("room.giftTempId") ? n.reject() : a.giftConfigsData ? n.resolve(a.giftConfigsData) : (i.load(a.webconfUrl + a.urls.getGiftConfigs, a.giftCBName, function(s) {
				a.giftConfigArray = s, t.handleGiftConfig(), i.load(a.webconfUrl + a.urls.getGiftBatchConfigs, a.giftBatchCBName, function(s) {
					if (!e.isEmptyObject(s)) {
						var i = s.batch_conf,
							r = t.handleGiftBatchConfig(i);
						if (!e.isEmptyObject(a.giftConfigsData) && !e.isEmptyObject(r)) {
							a.giftConfigsData.bimg = s.bimg || {};
							for (var o in a.giftConfigsData) {
								var d = r[o],
									c = a.giftConfigsData[o];
								r[o] && (c.isBatchGift = 1, c.culture_content = d.culture_content || "", c.desc_content_1 = d.desc_content_1 || "", c.desc_content_2 = d.desc_content_2 || "", c.list = d.list || [], c.batchTemp = d.batchTemp || {}, c.batchNum = d.batchNum || {})
							}
						}
					}
					return n.resolve(a.giftConfigsData)
				}, function() {
					return n.resolve(a.giftConfigsData)
				})
			}), n)
		},
		reqAllConfig: function() {
			var t = this,
				a = t.configs,
				s = e.Deferred();
			return e.when(t.reqPropJson(), t.reqGiftJson()).done(function(t, i) {
				a.allConfigsData = e.extend(!0, {}, a.propConfigsData, a.giftConfigsData), s.resolve(a.allConfigsData)
			}), s
		},
		reqGiftConfig: function(t) {
			var a = this,
				s = a.configs,
				i = e.Deferred();
			return e.ajax({
				url: s.urls.getGiftConf,
				type: "GET",
				dataType: "json",
				data: {
					gid: t
				}
			}).done(function(e) {
				return e && 0 == e.error ? i.resolve(e.data) : i.reject()
			}).fail(function() {
				return i.reject()
			}), i
		},
		getGiftConfig: function(t) {
			var a = this,
				s = a.configs,
				i = s.allConfigsData[t],
				n = e.Deferred();
			return i ? n.resolve(i) : (a.reqGiftConfig(t).done(function(e) {
				return i = e || {}, e && (s.giftConfigsData[t] = e, s.allConfigsData[t] = e), n.resolve(i)
			}), n)
		},
		load: function() {
			var e = n;
			return e.configs ? "" : e.initConfigs(), e.configs.allConfigsData ? n.configs.loadPromise.resolve(e.configs.allConfigsData) : (e.reqAllConfig().done(function(e) {
				return n.configs.loadPromise.resolve(e)
			}), n.configs.loadPromise)
		},
		getGift: function() {
			var t = n,
				a = e.Deferred();
			return t.configs ? "" : t.initConfigs(), t.reqGiftJson().done(function(e) {
				return a.resolve(e)
			}), a
		},
		getProp: function() {
			var t = n,
				a = e.Deferred();
			return t.configs ? "" : t.initConfigs(), t.reqPropJson().done(function(e) {
				return a.resolve(e)
			}), a
		},
		get: function(t) {
			var a = n,
				s = e.Deferred();
			return a.configs ? "" : a.initConfigs(), a.configs.allConfigsData ? a.getGiftConfig(t).done(function(e) {
				return s.resolve(e)
			}) : a.reqAllConfig().done(function(e) {
				a.getGiftConfig(t).done(function(e) {
					return s.resolve(e)
				})
			}), s
		}
	},
		r = {
			data: null,
			promise: e.Deferred(),
			isLoading: 0,
			load: function() {
				var e = this,
					t = e.promise,
					a = s.get("sys.webconfUrl") + "resource/common/return_coin/web_return_switch.json";
				return e.data ? t.resolve(e.data) : e.isLoading ? t : (e.isLoading = 1, i.load(a, "yuwanReturnSwitch", function(a) {
					a ? (e.data = a, t.resolve(e.data)) : t.reject()
				}, function() {
					t.reject()
				}), t.promise())
			}
		};
	return {
		getGift: n.getGift,
		getProp: n.getProp,
		load: n.load,
		get: n.get,
		loadYwReturnSwitch: function() {
			return r.load()
		}
	}
}), define("douyu/com/room-gift-tmp", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/flash/data/1.0", "shark/util/template/2.0", "douyu/context", "douyu/com/exjsonp", "douyu/page/room/base/api"], function(e, t, a, s, i, n, r, o) {
	var d = {
		isGetData: !1,
		isTplRender: !1,
		reqDefered: null,
		configUrl: n.get("sys.webconfUrl") + "resource/common/gift/gift_template/" + n.get("room.giftTempId") + ".json",
		batchConfigUrl: n.get("sys.webconfUrl") + "resource/common/gift/common_config_v2.json",
		callbackName: "roomGiftConfig",
		batchCallbackName: "commonConfig",
		$giftListWrap: e("#gift-content"),
		cqSwitch: n.get("room.cqSwitch") || 0,
		isFlashInit: !1,
		isConfigInit: !1,
		isPostData: !1,
		isEvtBind: !1,
		configData: [],
		batchConfigData: []
	},
		c = {};
	return e("body").data("cq") || e("body").data("cq", d.cqSwitch), d.reqDefered = e.Deferred(), c = {
		impl: function() {
			d.isEvtBind || (c.bindEvt(), d.isEvtBind = !0)
		},
		init: function() {
			return c.regData(), d.reqDefered.promise()
		},
		regData: function() {
			var e = this;
			return d.isTplRender ? d.reqDefered.resolve() : void 0 === $ROOM.giftTempId ? d.reqDefered.reject() : void r.load(d.configUrl, d.callbackName, function(t) {
				r.load(d.batchConfigUrl, d.batchCallbackName, function(a) {
					var s = t.concat(),
						i = e.handleBatchData(t, a);
					d.batchConfigData = a, d.configData = i, d.isConfigInit = !0, e.postData(), e.handleData(s)
				}, function() {
					d.configData = t, d.isConfigInit = !0, e.postData(), e.handleData(d.configData)
				})
			})
		},
		bindEvt: function() {
			var e = this;
			o.reg("room_data_login", function() {
				d.isFlashInit = !0, e.postData()
			}), o.reg("room_data_req_gift_config", function() {
				c.init().done(function() {
					o.exe("js_gift_config", d.configData), o.exe("js_setConf", {
						business: "batch_gift_config",
						data: d.batchConfigData
					})
				})
			})
		},
		postData: function() {
			d.isConfigInit && d.isFlashInit && !d.isPostData && (o.exe("js_gift_config", d.configData), o.exe("js_setConf", {
				business: "batch_gift_config",
				data: d.batchConfigData
			}), d.isPostData = !0)
		},
		handleData: function(e) {
			var t, a = this,
				s = e.length,
				i = {
					visibleGift: [],
					invisible: {
						normal: [],
						noble: []
					}
				},
				n = 0;
			for (n; s > n; n++) t = e[n], t.isAlipay || (7 > n ? i.visibleGift.push(t) : 1 !== parseInt(t.gt, 10) ? i.invisible.normal.push(t) : i.invisible.noble.push(t));
			return d.isTplRender ? d.reqDefered.resolve() : void a.initGiftTpl(i)
		},
		handleBatchData: function(t, a) {
			var s = this;
			a = a || {};
			var i = s.handleGiftConfig(t, "id"),
				n = a.batch_conf;
			if (!e.isEmptyObject(i) && !e.isEmptyObject(n)) for (var r in i) {
				var o = n[r],
					d = i[r];
				if (!e.isEmptyObject(o)) {
					d.isBatchGift = 1, d.culture_content = o.culture_content || "", d.desc_content_1 = o.desc_content_1 || "", d.desc_content_2 = o.desc_content_2 || "", d.list = o.list || [], d.batchTemp = {}, d.batchNum = [];
					for (var c = 0; c < d.list.length; c++) {
						var l = d.list[c];
						l.num && (d.batchTemp[l.num] = l, d.batchNum.push(l.num))
					}
					d.batchNum.sort(function(e, t) {
						return e - t
					})
				}
			}
			var g = s.getArrayByObject(i);
			return g
		},
		handleGiftConfig: function(e, t) {
			var a, s, i = 0,
				n = {};
			if (e && e.length) for (a = e.length; a > i; i++) s = e[i], s && (n[s[t]] = s);
			return n
		},
		getArrayByObject: function(e) {
			var t = this,
				a = [];
			for (var s in e) a.push(e[s]);
			var i = a.sort(t.compare("index"));
			return i
		},
		compare: function(e) {
			return function(t, a) {
				var s = t[e],
					i = a[e];
				return s - i
			}
		},
		initGiftTpl: function(e) {
			var s, r, o;
			s = a.string.join('<div class="g-list clearfix" data-slider="slider">', '<div class="gift-info-panel" data-type="gift-info-panel">', '<div class="gift-info-panel-cont clearfix" data-type="gift-info-panel-cont"></div>', '<i class="gift-info-panel-fill"></i>', '<i class="gift-info-panel-arrow1"></i>', '<i class="gift-info-panel-arrow2"></i>', "</div>", '<ul class="clearfix fl" data-slider="list">', "{{ each initGift as item }}", '<li class="gift-item" data-type="gift" data-noble="{{item.gt}}" data-send="{{item.type}}" data-giftid="{{item.id}}" data-giftname="{{item.name}}" data-name="{{item.price_name}}" data-gifticon="{{item.himg}}" data-exp="{{item.exp}}" data-devote="{{item.devote}}" data-intro="{{item.intro}}" data-explain="{{item.desc}}" data-bi="{{item.batch_interval}}" data-intimate="{{item.devote}}" data-returnyw="{{item.ry}}" data-face="{{ item.face_effect }}" data-price="{{ item.pc }}">', '<img class="g-img" src="{{ item.gift_pic }}">', "{{ if (item.gift_active_icon_style && item.gift_active_icon_style > 0 && item.gift_web_active_text) }}", '<div class="icon--conner-mark icon--conner-mark-s{{ item.gift_active_icon_style}}">', "<span>{{ item.gift_web_active_text}}</span>", "</div>", "{{ else }}", "{{ if ((!item.gift_active_icon_style || item.gift_active_icon_style == 0) && (item.gt == 1)) }}", '<div class="icon--conner-mark icon--conner-mark-s1">', "<span>贵</span>", "</div>", "{{ else if ((!item.gift_active_icon_style || item.gift_active_icon_style == 0) && (item.gt == 2)) }}", '<div class="icon--conner-mark icon--conner-mark-s1">', "<span>周</span>", "</div>", "{{ /if }}", "{{ /if }}", "</li>", "{{ /each }}", "</ul>", '<div class="item-expand-panel expand-gift-panel">', '<a class="expand-gift-panel-close" href="javascript:;">×</a>', '<div class="item-expand-tran-outer">', '<div class="item-expand-tran-inner">', "</div>", "</div>", "{{ if popInitGift.length }}", '<div class="gift--box">', '<div class="box--title">', "<strong>普通礼物</strong>", "<span>", "拥有数：<em>{{ popInitGift.length }}</em>", "</span>", "</div>", '<div class="box--content">', '<ul class="item-expand-cont clearfix" data-slider="list">', "{{ each popInitGift as item }}", '<li class="gift-item" data-type="gift" data-noble="{{ item.gt }}" data-send="{{ item.type }}" data-giftid="{{ item.id }}" data-giftname="{{ item.name }}" data-name="{{ item.price_name }}" data-gifticon="{{ item.himg }}" data-exp="{{ item.exp }}" data-devote="{{ item.devote }}" data-intro="{{ item.intro }}" data-explain="{{ item.desc }}" data-bi="{{ item.batch_interval }}" data-intimate="{{ item.devote }}" data-returnyw="{{ item.ry }}" data-face="{{ item.face_effect }}" data-price="{{ item.pc }}">', '<img class="g-img" src="{{ item.gift_pic }}" />', "{{ if (item.gift_active_icon_style && item.gift_active_icon_style > 0 && item.gift_web_active_text) }}", '<div class="icon--conner-mark icon--conner-mark-s{{ item.gift_active_icon_style || ""}}">', "<span>{{ item.gift_web_active_text }}</span>", "</div>", "{{ else if ((!item.gift_active_icon_style || item.gift_active_icon_style == 0) && item.gt == 2) }}", '<div class="icon--conner-mark icon--conner-mark-s1">', "<span>周</span>", "</div>", "{{ /if }}", "</li>", "{{ /each }}", "</ul>", "</div>", "</div>", "{{ /if }}", "{{ if nobleGift.length }}", '<div class="gift--box gift--noble-box">', '<div class="box--title">', "<strong>贵族礼物</strong>", "<span>", "拥有数：<em>{{ nobleGift.length }}</em>", "</span>", "</div>", '<div class="box--content">', '<ul class="item-expand-cont clearfix" data-slider="list">', "{{ each nobleGift as item }}", '<li class="gift-item" data-type="gift" data-noble="{{ item.gt }}" data-send="{{ item.type }}" data-giftid="{{ item.id }}" data-giftname="{{ item.name }}" data-name="{{ item.price_name }}" data-gifticon="{{ item.himg }}" data-exp="{{ item.exp }}" data-devote="{{ item.devote }}" data-intro="{{ item.intro }}" data-explain="{{ item.desc }}" data-bi="{{ item.batch_interval }}" data-intimate="{{ item.devote }}" data-returnyw="{{ item.ry }}" data-face="{{ item.face_effect }}" data-price="{{ item.pc }}">', '<img class="g-img" src="{{ item.gift_pic }}" />', "{{ if (item.gift_active_icon_style && item.gift_active_icon_style > 0 && item.gift_web_active_text) }}", '<div class="icon--conner-mark icon--conner-mark-s{{ item.gift_active_icon_style || ""}}">', "<span>{{ item.gift_web_active_text}}</span>", "</div>", "{{ else }}", '<div class="icon--conner-mark icon--conner-mark-s1">', "<span>贵</span>", "</div>", "{{ /if }}", "</li>", "{{ /each }}", "</ul>", "</div>", "</div>", "{{ /if }}", "</div>", "{{ if popInitGift.length || nobleGift.length}}", '<div class="more-gift-btn fl"></div>', "{{ /if }}", "{{ if (isOpenCq == 1) }}", '<div class="gift-item" data-type="cq" data-point-2="0" data-send="0" data-giftid="cq"', 'data-giftname="酬勤" data-name="15/30/50 鱼翅" data-gifticon="' + $SYS.web_url + 'app/douyu/res/page/room-normal/gift/chouqin_90.gif" data-exp="0"', 'data-devote="0" data-intro="0"', 'data-explain="可获得鱼丸奖励/可获得贡献值奖励/', '可获得30天酬勤头衔">', '<img class="g-img" src="' + $SYS.web_url + 'app/douyu/res/page/room-normal/gift/chouqin_48.png" />', "</div>", "{{ /if }}", "</div>"), r = i.compile(s), o = r({
				initGift: e.visibleGift || [],
				popInitGift: e.invisible.normal || [],
				nobleGift: e.invisible.noble || [],
				isOpenCq: d.cqSwitch
			}), d.$giftListWrap.html(o), d.isTplRender = !0, d.reqDefered.resolve(), n.get("room.owner_uid") == n.get("sys.uid") && d.$giftListWrap.find('[data-slider="slider"]').hide(), t.trigger("mod.normal.gift.expand")
		}
	}, c.impl(), {
		render: c.init
	}
}), define("douyu/page/room/normal/mod/rotary-draw", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/flash/data/1.0", "shark/util/template/2.0", "shark/util/storage/1.0", "douyu/context", "douyu/com/user", "douyu/com/exjsonp", "douyu/com/sign", "douyu/com/get-gift-configs", "douyu/com/room-gift-tmp", "douyu/page/room/base/api"], function(e, t, a, s, i, n, r, o, d, c, l, g, u) {
	var m = {
		renderPanelFrame: function() {
			var e = ['<div class="RotaryDraw-container">', '<i class="RotaryDraw-icon"></i>', '<div class="RotaryDraw-content">', '<p class="RotaryDraw-return"><span data-flag="RotaryDraw-return">返回</span></p>', '<div class="RotaryDraw-record RotaryDraw-box is-cur is-empty">', '<p class="RotaryDraw-record-title">我的记录</p>', '<div class="RotaryDraw-record-rankTitle">', '<p class="RotaryDraw-record--reward">获得礼物</p>', '<p class="RotaryDraw-record--type">类型</p>', '<p class="RotaryDraw-record--time">时间</p>', "</div>", '<p class="RotaryDraw-record-empty">当前没有记录</p>', '<div class="RotaryDraw-record-wrap">', '<ul class="RotaryDraw-record-ul">', "</ul>", "</div>", '<div class="RotaryDraw-record-page">', '<p class="recordPage-first">首页</p>', '<p class="recordPage-pre">上一页</p>', '<div class="recordPage-list">', '<p class="recordPage-num is-cur">1</p>', '<p class="recordPage-num">2</p>', '<p class="recordPage-num">3</p>', '<p class="recordPage-num">4</p>', "<span>...</span>", '<p class="recordPage-num">6</p>', "</div>", '<p class="recordPage-next">下一页</p>', '<p class="recordPage-end">尾页</p>', "</div>", "</div>", '<div class="RotaryDraw-rank RotaryDraw-box">', "<!-- 主播榜 -->", '<div class="RotaryDraw-rank-L RotaryDraw-rank-box">', '<h3 class="RotaryDraw-rank-title">主播榜</h3>', '<ul class="RotaryDraw-rank-rankTitle">', '<li class="RotaryDraw-rank--idx">排名</li>    ', '<li class="RotaryDraw-rank--name">主播</li>    ', '<li class="RotaryDraw-rank--value" title="收到{{ sendGiftName }}数量">', '<span>收到</span><span class="sendGiftName" data-flag="RotaryDraw-sendGiftName">{{ sendGiftName }}</span><span>数量</span>', "</li>", "</ul>", '<div class="RotaryDraw-rank-warp" id="RotaryDraw-anchorRank-warp">', '<ul class="RotaryDraw-rank-ul" id="RotaryDraw-anchorRank-ul">', "</ul>", '<p class="RotaryDraw-rank-numRemain">仅展示排名前50主播</p>', "</div>", "</div>", "<!-- 用户榜 -->", '<div class="RotaryDraw-rank-R RotaryDraw-rank-box">', '<h3 class="RotaryDraw-rank-title">用户榜</h3>', '<ul class="RotaryDraw-rank-rankTitle">', '<li class="RotaryDraw-rank--idx">排名</li>    ', '<li class="RotaryDraw-rank--name">用户</li>    ', '<li class="RotaryDraw-rank--value">', "获得礼物", "</li>", "</ul>", '<div class="RotaryDraw-rank-warp" id="RotaryDraw-userRank-warp">', '<ul class="RotaryDraw-rank-ul is-type2" id="RotaryDraw-userRank-ul">', "</ul>", '<p class="RotaryDraw-rank-numRemain">仅展示排名前10用户</p>', "</div>", "</div>", '<p class="RotaryDraw-rank-remain">每天0点清空榜单</p>', "</div>", '<div class="RotaryDraw-help RotaryDraw-box">', '<div class="RotaryDraw-help-wrap">', '<p class="RotaryDraw-help-title"></p>', '<div class="RotaryDraw-help-desc">', '<div class="RotaryDraw-help-scroll">', '<img class="RotaryDraw-intro_img" src="{{ rotaryConfig.intro_img.web }}" />', "</div>", "</div>", "</div>", "</div>", "</div>", "</div>"].join(""),
				t = i.compile(e);
			return t
		},
		renderAnchorRank: function() {
			var e = ["{{ each rankList as item index }}", '<li class="RotaryDraw-rank-item is-top{{ item.idx }} {{ item.noData ? "is-noData" : ""}} {{ item.roomid == roomId ? "is-curRoom" : ""}}">', '<p class="RotaryDraw-rank--idx"><span>{{ item.idx }}</span></p>', "{{ if (item.roomid && item.roomid != roomId) }}", '<a href="/{{ item.roomid }}" target="_blank" class="RotaryDraw-rank--name" title="{{ item.nickname }}">{{ item.nickname }}</a>', "{{ else }}", '<a class="RotaryDraw-rank--name" title="{{ item.nickname }}">{{ item.nickname }}</a>', "{{ /if }}", '<p class="RotaryDraw-rank--value" title="{{ item.giftcount }}">{{ item.giftcount }}</p>', "</li>", "{{ /each }}"].join(""),
				t = i.compile(e);
			return t
		},
		renderUserRank: function() {
			var e = ["{{ each rankList as item index }}", '<li class="RotaryDraw-rank-item {{ item.noData ? "is-noData" : ""}} {{ item.userId == userId ? "is-curRoom" : ""}}">', '<p class="RotaryDraw-rank--idx"><span>{{ item.idx }}</span></p>', '<p class="RotaryDraw-rank--name" title="{{ item.nickname }}">{{ item.nickname }}</p>', '<div class="RotaryDraw-rank--value">', "{{ if item.prize_list && item.prize_list.length }}", "{{ each item.prize_list as oitem oindex }}", '<p class="RotaryDraw-rank-rewards {{ oitem.award_count > 99 ? "is-num4" : "is-num3" }}" title="{{ oitem.giftname }}">', '<img src="{{ oitem.gifticon }}" />', "<span>{{ formatNumType(oitem.award_count) }}</span>", "</p>", "{{ /each }}", "{{ else }}", "--", "{{ /if }}", "</div>", "</li>", "{{ /each }}"].join(""),
				t = i.compile(e);
			return t
		},
		renderRecordList: function() {
			var e = ["{{ each recordData as item index }}", '<li class="RotaryDraw-record-item">', '<div class="RotaryDraw-record--reward">', "{{ if item.prize_list && item.prize_list.length }}", "{{ each item.prize_list as oitem oindex }}", '<p class="RotaryDraw-rank-rewards {{ oitem.award_count > 999 ? "is-num4" : "is-num3" }}" title="{{ oitem.giftname }} X{{ oitem.award_count }}">', '<img src="{{ oitem.gifticon }}" />', "<span>{{ formatNumType(oitem.award_count) }}</span>", "</p>", "{{ /each }}", "{{ else }}", "--", "{{ /if }}", "</div>", '<div class="RotaryDraw-record--type">', '<p>{{ item.win_source == 2 ? "高级探险" : "普通探险" }}</p>', "{{ if (item.join_type == 1) }}", "<span>(探1次)</span>", "{{ else if (item.join_type == 2) }}", "<span>(10连探)</span>", "{{ else if (item.join_type == 3) }}", "<span>(100连探)</span>", "{{ else if (item.join_type == 4) }}", "<span>(首探)</span>", "{{ /if }}", "</div>", '<div class="RotaryDraw-record--time"><p>{{ item.getDate }}</p></div>', "</li>", "{{ /each }}"].join(""),
				t = i.compile(e);
			return t
		},
		init: function() {
			this.render = {
				renderPanelFrame: this.renderPanelFrame(),
				renderAnchorRank: this.renderAnchorRank(),
				renderUserRank: this.renderUserRank(),
				renderRecordList: this.renderRecordList()
			}
		}
	},
		p = {
			config: {
				rotaryConfig: null,
				isConnect: !1,
				isSendConfig: !1,
				defaultGiftIcon: "",
				defaultAvatar: "",
				reqingAnchorRank: !1,
				reqAnchorRankTimes: 0,
				anchorRankData: null,
				reqingUserRank: !1,
				reqUserRankTimes: 0,
				userRankData: null,
				reqingRecord: !1,
				reqRecordTimes: 0,
				recordData: null,
				recordPage: 1,
				recordTotalNum: 0,
				recordTotalPage: 0,
				appData: {},
				giftConfigs: {},
				timerConfig: [],
				sendGiftName: "礼物"
			},
			init: function() {
				this.config = e.extend({}, this.config, {
					roomId: r.get("room.room_id"),
					userId: r.get("sys.uid"),
					ownerUid: r.get("room.owner_uid"),
					giftActivity: r.get("room.giftActivity"),
					configUrl: r.get("sys.webconfUrl") + "/resource/common/turntable_lottery_config.json",
					defaultGiftIcon: r.get("sys.web_url") + "/app/douyu/res/page/room-normal/rotary-draw/defaultgift.png",
					recordUrl: "/member/turntableLottery/myWinLogs",
					anchorRankUrl: "/lapi/interact/turntableLottery/anchorRankList",
					userRankUrl: "/lapi/interact/turntableLottery/userRankList"
				})
			},
			reqData: function(t) {
				var a = e.Deferred();
				return e.ajax({
					url: t.url,
					dataType: "json",
					data: t.data
				}).done(function(e) {
					return a.resolve(e)
				}).fail(function() {
					return a.reject()
				}), a
			},
			getJsonpData: function(t) {
				var a = e.Deferred();
				return d.load(t.url, t.cbname, function(e) {
					var t = e || {};
					return a.resolve(t)
				}, function() {}, function() {}, t.noCatche), a
			},
			formatTime: function(e) {
				return 0 == e ? "00" : 10 > e ? "0" + e : e
			},
			formatNumType: function(e) {
				return e > 99 ? "99+" : e
			},
			formatNumType2: function(e) {
				return e > 99999999 ? parseInt(e / 1e8, 10) + "亿" : e > 9999 ? parseInt(e / 1e4, 10) + "万" : e
			},
			returnYYYYMMDD: function() {
				var e = new Date;
				return [e.getFullYear(), this.formatTime(e.getMonth() + 1), this.formatTime(e.getDate())].join("")
			},
			returnDate: function(e, t, a) {
				var s, i = 1e3 * e,
					n = new Date,
					r = n.getDate(),
					o = new Date(i),
					d = o.getDate() || "--",
					c = o.getMonth() + 1 || "--",
					l = this.formatTime(o.getHours()) || "00",
					g = this.formatTime(o.getMinutes()) || "00",
					u = this.formatTime(o.getSeconds()) || "00",
					m = o.getFullYear(),
					p = +t || 1;
				switch (+p) {
				case 1:
					s = c + "月" + d + "日";
					break;
				case 2:
					s = c + "月" + d + "日" + l + ":" + g;
					break;
				case 3:
					s = d + "日";
					break;
				case 4:
					s = a && r == d ? l + ":" + g : d + "日" + l + ":" + g;
					break;
				case 5:
					s = l + ":" + g;
					break;
				case 6:
					s = [m, c, d].join("-"), s += " ", s += [l, g, u].join(":");
					break;
				default:
					s = c + "月" + d + "日"
				}
				return s
			},
			returnTime: function(e) {
				if (0 >= e) return {
					hour: "--",
					min: "--",
					sec: "--"
				};
				var t = Math.round(e / 1e3, 10),
					a = p.formatTime(parseInt(t / 3600, 10)),
					s = p.formatTime(parseInt((t - 60 * a * 60) / 60, 10)),
					i = p.formatTime(parseInt(t - 60 * a * 60 - 60 * s, 10)),
					n = {
						hour: a,
						min: s,
						sec: i
					};
				return n
			},
			returnRewardData: function(e) {
				for (var t = this.config.rotaryConfig || {}, a = t.prize_list || [], s = 0; s < a.length; s++) if (a[s] && a[s].prize_id == e) return a[s];
				return {}
			},
			handleAnchorRankData: function(e, t) {
				for (var a, s = this.config, i = t || 50, n = e || [], r = [], o = 0; i > o; o++) a = n[o] || {}, r.push({
					idx: o + 1,
					roomid: a.room_id || 0,
					nickname: a.nickname || "虚位以待",
					avatar: a.avatar || s.defaultAvatar,
					giftcount: a.gift_count >= 0 ? a.gift_count : "--",
					noData: !n[o]
				});
				return s.anchorRankData = r, r
			},
			handleUserRankData: function(t, a) {
				for (var s, i, n, r, o = this.config, d = a || 10, c = t || [], l = [], g = [], u = 0; d > u; u++) {
					if (s = c[u] || {}, g = [], s.prize_list && s.prize_list.length) for (var m = 0; m < s.prize_list.length; m++) s.prize_list[m] = s.prize_list[m] || {}, i = this.returnRewardData(s.prize_list[m].prize_id), r = {
						giftname: i.prize_name || "神秘礼物",
						gifticon: i.prize_img && i.prize_img.web ? i.prize_img.web : o.defaultGiftIcon
					}, n = e.extend({}, s.prize_list[m], r), g.push(n);
					l.push({
						idx: u + 1,
						userId: s.uid,
						nickname: s.nickname || "虚位以待",
						prize_list: g || [],
						noData: !c[u]
					})
				}
				return o.userRankData = l, l
			},
			handleRecordListData: function(t) {
				for (var a, s, i, n, r = this.config, o = t || [], d = [], c = [], l = 0; l < o.length; l++) {
					if (a = o[l] || {}, c = [], a.prize_list && a.prize_list.length) for (var g = 0; g < a.prize_list.length; g++) a.prize_list[g] = a.prize_list[g] || {}, s = this.returnRewardData(a.prize_list[g].prize_id), n = {
						giftname: s.prize_name || "神秘礼物",
						gifticon: s.prize_img && s.prize_img.web ? s.prize_img.web : r.defaultGiftIcon
					}, i = e.extend({}, a.prize_list[g], n), c.push(i);
					d.push({
						idx: l + 1,
						join_type: a.join_type,
						win_source: a.win_source,
						created_at: a.created_at,
						getDate: a.created_at > 0 ? this.returnDate(a.created_at, 6) : "--",
						prize_list: c || [],
						noData: !o[l]
					})
				}
				return r.recordData = d, d
			}
		},
		f = {
			init: function() {
				var e = this,
					t = p.config;
				this.getDoms(), this.initEvent(), this.getRotaryConfig().done(function(a) {
					1 == a.is_open && e.runApp(), t.isConnect && !t.isSendConfig && (t.isSendConfig = !0, u.exe("js_zhuanpan", {
						type: 1,
						data: a
					}))
				})
			},
			getDoms: function() {
				this.doms = {
					$RoomVideo: e("#js-room-video"),
					$StatusActions: e("#js-stats-and-actions"),
					$Backpack: e(".backpack-btn")
				}
			},
			runApp: function() {
				this.showEnter(), this.listenConfigSend(), this.listenMsgPush()
			},
			getEnterConfig: function() {
				var e, t = p.config.giftActivity || {};
				for (var a in t) if (e = t[a], e && e.length) for (var s = 0; s < e.length; s++) if (e[s] && "rotary_draw" == e[s].activity_flag) return e[s];
				return {}
			},
			showEnter: function() {
				var a = this.doms,
					s = this.getEnterConfig(),
					i = s.icon_default,
					n = ['<div class="RotaryDraw-enter" style=background-image:url(' + i + ")>", '<i class="RotaryDraw-BT JS_RotaryDraw_enter"></i>', '<span class="RotaryDraw-luck-time"></span>', "</div>"].join(""),
					r = e(n);
				t.trigger("mod.chat.action.view.add", {
					flag: "rotary_draw",
					dom: r,
					lock: !1
				}), e('#js-stats-and-actions [data-flag="rotary_draw"]').show(), a.$RotaryEnter = e(".RotaryDraw-enter"), this.enterEvent()
			},
			getRotaryConfig: function() {
				var t = p.config,
					a = e.Deferred();
				return p.getJsonpData({
					url: p.config.configUrl,
					cbname: "turntable_lottery_config"
				}).done(function(e) {
					return t.rotaryConfig = e || {}, a.resolve(t.rotaryConfig)
				}), a
			},
			checkPanelFrame: function() {
				var e, t = this,
					a = this.doms,
					s = p.config;
				a.$RotaryContainer && a.$RotaryContainer.length || (e = m.render.renderPanelFrame({
					sendGiftName: s.sendGiftName,
					rotaryConfig: s.rotaryConfig || {}
				}), a.$RoomVideo.append(e), a.$RotaryContainer = a.$RoomVideo.find(".RotaryDraw-container"), a.$RotaryBox = a.$RotaryContainer.find(".RotaryDraw-box"), a.$RotaryRecordBox = a.$RotaryContainer.find(".RotaryDraw-record"), a.$AnchorRankWrap = a.$RotaryContainer.find("#RotaryDraw-anchorRank-warp"), a.$AnchorRankUl = a.$RotaryContainer.find("#RotaryDraw-anchorRank-ul"), a.$UserRankWrap = a.$RotaryContainer.find("#RotaryDraw-userRank-warp"), a.$UserRankUl = a.$RotaryContainer.find("#RotaryDraw-userRank-ul"), a.$RecordListWrap = a.$RotaryContainer.find(".RotaryDraw-record-wrap"), a.$RecordListUl = a.$RotaryContainer.find(".RotaryDraw-record-ul"), a.$RecordListPage = a.$RotaryContainer.find(".recordPage-list"), a.$HelpDescWrap = a.$RotaryContainer.find(".RotaryDraw-help-desc"), a.$SendGiftName = a.$RotaryContainer.find('[data-flag="RotaryDraw-sendGiftName"]'), t.updateGiftName(), t.setHelpBoxScroll(), p.handleAnchorRankData([]), p.handleUserRankData([]), t.appendAnchorRank(), t.appendUserRank(), t.panelEvent())
			},
			setHelpBoxScroll: function() {
				var e = this.doms;
				e.$HelpDescWrap.mCustomScrollbar()
			},
			reqAnchorRank: function() {
				var e = this,
					t = p.config,
					a = (new Date).getTime();
				t.reqingAnchorRank || (a - t.reqAnchorRankTimes < 6e4 ? e.appendAnchorRank() : (t.reqingAnchorRank = !0, p.reqData({
					url: "/lapi/interact/turntableLottery/anchorRankList",
					data: {
						period: p.returnYYYYMMDD()
					}
				}).done(function(a) {
					t.reqingAnchorRank = !1, t.reqAnchorRankTimes = (new Date).getTime(), a && 0 == a.error && a.data && (p.handleAnchorRankData(a.data), e.appendAnchorRank())
				}).fail(function() {
					t.reqingAnchorRank = !1, t.reqAnchorRankTimes = (new Date).getTime()
				})))
			},
			reqUserRank: function() {
				var e = this,
					t = p.config,
					a = (new Date).getTime();
				t.reqingUserRank || (a - t.reqUserRankTimes < 6e4 ? e.appendUserRank() : (t.reqingUserRank = !0, p.reqData({
					url: "/lapi/interact/turntableLottery/userRankList",
					data: {
						period: p.returnYYYYMMDD()
					}
				}).done(function(a) {
					t.reqingUserRank = !1, t.reqUserRankTimes = (new Date).getTime(), a && 0 == a.error && a.data && (p.handleUserRankData(a.data), e.appendUserRank())
				}).fail(function() {
					t.reqingUserRank = !1, t.reqUserRankTimes = (new Date).getTime()
				})))
			},
			reqRecordList: function() {
				var e = this,
					t = p.config;
				t.reqingRecord || (t.reqingRecord = !0, p.reqData({
					url: "/member/turntableLottery/myWinLogs",
					data: {
						page_num: t.recordPage,
						page_size: 6
					}
				}).done(function(a) {
					t.reqingRecord = !1, t.reqRecordTimes = (new Date).getTime(), a && 0 == a.error && a.data && (t.recordTotalNum = a.data.total_rows || 0, p.handleRecordListData(a.data.prize_list), e.appendRecordList())
				}).fail(function() {
					t.reqingRecord = !1, t.reqRecordTimes = (new Date).getTime()
				}))
			},
			reqMergeProp: function() {
				var t = this,
					a = p.config;
				a.reqingMergeProp || (a.reqingMergeProp = !0, p.reqData({
					url: "/member/turntableLottery/xxx",
					data: {}
				}).done(function(s) {
					a.reqingMergeProp = !1, s && 0 == s.error && s.data && s.data.pid ? t.showMergePropDialog(s.data.pid, s.data.num) : e.dialog.tips_black("道具合并失败")
				}).fail(function() {
					a.reqingMergeProp = !1, e.dialog.tips_black("道具合并失败")
				}))
			},
			updateGiftName: function() {
				var e = this.doms,
					t = p.config,
					a = t.rotaryConfig;
				a && a.gift_id && l.get(a.gift_id).then(function(a) {
					t.sendGiftName = a && a.name ? a.name : "礼物", e.$SendGiftName && e.$SendGiftName.length && (e.$SendGiftName.text(t.sendGiftName), e.$SendGiftName.prop({
						title: "收到" + t.sendGiftName + "数量"
					}))
				})
			},
			appendAnchorRank: function() {
				var e = this.doms,
					t = p.config,
					a = t.anchorRankData || [],
					s = m.render.renderAnchorRank({
						rankList: a,
						roomId: t.roomId
					});
				return e.$AnchorRankUl.html(s), t.anchorRankScroll ? (t.anchorRankScroll = 1, void e.$AnchorRankWrap.mCustomScrollbar("update")) : void e.$AnchorRankWrap.mCustomScrollbar()
			},
			appendUserRank: function() {
				var e = this.doms,
					t = p.config,
					a = t.userRankData || [],
					s = m.render.renderUserRank({
						rankList: a,
						userId: t.userId,
						formatNumType: p.formatNumType
					});
				return e.$UserRankUl.html(s), t.userRankScroll ? (t.userRankScroll = 1, void e.$UserRankWrap.mCustomScrollbar("update")) : void e.$UserRankWrap.mCustomScrollbar()
			},
			appendRecordList: function() {
				var e, t = this.doms,
					a = p.config,
					s = a.recordData || [];
				if (s.length) {
					if (e = m.render.renderRecordList({
						recordData: s,
						formatNumType: p.formatNumType2
					}), t.$RotaryRecordBox.removeClass("is-empty"), t.$RecordListUl.html(e), this.appendGuessRecordPage(), a.recordListScroll) return a.recordListScroll = 1, void t.$RecordListWrap.mCustomScrollbar("update");
					t.$RecordListWrap.mCustomScrollbar()
				} else t.$RotaryRecordBox.addClass("is-empty")
			},
			appendGuessRecordPage: function() {
				var e = this,
					t = e.doms,
					a = p.config,
					s = "",
					i = a.recordPage,
					n = Math.ceil(a.recordTotalNum / 6);
				if (a.recordTotalPage = n, 1 >= n ? t.$RotaryContainer.find(".RotaryDraw-record-page").hide() : t.$RotaryContainer.find(".RotaryDraw-record-page").show(), n > 6) if (2 >= i) for (var r = 0; n > r; r++) 3 > r ? s += r == i - 1 ? '<p class="recordPage-num is-cur">' + (r + 1) + "</p>" : '<p class="recordPage-num">' + (r + 1) + "</p>" : 3 == r ? s += "<span>...</span>" : r == n - 1 && (s += '<p class="recordPage-num">' + (r + 1) + "</p>");
				else for (var r = 0; n > r; r++) i + 2 > r ? i - 2 > 1 ? 0 == r || r >= i - 3 && i + 3 >= r ? s += r == i - 1 ? '<p class="recordPage-num is-cur">' + (r + 1) + "</p>" : '<p class="recordPage-num">' + (r + 1) + "</p>" : r == i - 4 && (s += "<span>...</span>") : s += r == i - 1 ? '<p class="recordPage-num is-cur">' + (r + 1) + "</p>" : '<p class="recordPage-num">' + (r + 1) + "</p>" : r == i + 2 && r != n - 1 ? s += "<span>...</span>" : r == n - 1 && (s += '<p class="recordPage-num">' + (r + 1) + "</p>");
				else for (var r = 0; n > r; r++) s += r == i - 1 ? '<p class="recordPage-num is-cur">' + (r + 1) + "</p>" : '<p class="recordPage-num">' + (r + 1) + "</p>";
				t.$RecordListPage.html(s)
			},
			appendGetTicketTips: function(e) {
				var t, a = this.doms,
					s = p.config || {},
					i = (s.rotaryConfig || {}, a.$RoomVideo.find("RotaryDraw-getTicket-tips")),
					r = n.get("RotaryDraw_getTicket_tipShow");
				r > 0 || (t = ['<div class="RotaryDraw-getTicket-tips">', '<i class="RotaryDraw-getTicket-close"></i>', '<i class="RotaryDraw-getTicket-icon"></i>', '<p class="RotaryDraw-getTicket-desc">', '<span class="ticket-desc1">获得 ' + e + " 张探险券</span>", '<span class="ticket-desc2">参与太空探险，赢稀有礼物！</span>', "</p>", '<p class="RotaryDraw-getTicket-btn">去探险</p>', "</div>"].join(""), i && i.length && i.remove(), a.$RoomVideo.append(t), n.set("RotaryDraw_getTicket_tipShow", 1))
			},
			showMergePropDialog: function(e, t) {
				var a = this.doms,
					s = p.config || {};
				l.get(e).then(function(e) {
					var t, i = e || {},
						n = a.$RoomVideo.find(".RotaryDraw-mergeTicket-tips");
					i.mPic = i.pc_full_icon || i.cimg || s.defaultGiftIcon, i.mName = i.name || "神秘礼物", t = ['<div class="RotaryDraw-mergeTicket-tips">', '<i class="RotaryDraw-mergeTicket-close"></i>', '<div class="RotaryDraw-mergeTicket-icon">', '<img src="' + i.mPic + '" />', "</div>", '<p class="RotaryDraw-mergeTicket-desc"><span>价值 ' + (parseInt(i.pc / 100, 10) || "--") + " 鱼翅</span></p>", '<p class="RotaryDraw-mergeTicket-desc">成功合成 <span>' + i.mName + "</span> 礼物</p>", '<p class="RotaryDraw-mergeTicket-ok">美滋滋</p>', "</div>"].join(""), n && n.length && n.remove(), a.$RoomVideo.append(t), n = a.$RoomVideo.find(".RotaryDraw-mergeTicket-tips"), n.show(), n.on("click", ".RotaryDraw-mergeTicket-close", function() {
						n.hide()
					}).on("click", ".RotaryDraw-mergeTicket-ok", function() {
						n.hide()
					})
				})
			},
			timerPush: function(e) {
				var t = p.config,
					a = 0;
				if (e) {
					t.timerConfig || (t.timerConfig = []);
					for (var s = 0; s < t.timerConfig.length; s++) if (e.type == t.timerConfig[s].type) {
						a = 1, t.timerConfig[s] = e;
						break
					}
					a ? "" : t.timerConfig.push(e), t.timerIsPlaying || this.timerCheck()
				}
			},
			timerCheck: function() {
				var t, a, s, i = p.config;
				if (i.timerConfig && i.timerConfig.length > 0) {
					t = e.extend([], i.timerConfig);
					for (var n = 0; n < i.timerConfig.length; n++) a = (new Date).getTime(), i.nowServerTimes = a / 1e3, t[n] && t[n].endTimes > a ? t[n].nowTimes = a : s = t.splice(n, 1);
					t.length > 0 ? (i.timerIsPlaying = 1, i.timerConfig = t, this.timerCenter()) : this.timerClear()
				} else this.timerClear()
			},
			timerCenter: function() {
				var e = p.config,
					t = this;
				clearTimeout(e.timerVar), e.timerVar = setTimeout(function() {
					t.timerCheck(), t.timerUpdate()
				}, 500)
			},
			timerUpdate: function() {
				for (var t, a, s, i, n = p.config, r = 0; r < n.timerConfig.length; r++) a = n.timerConfig[r], i = e(".RotaryDraw-enter .RotaryDraw-luck-time"), a && i && i.length && (t = p.returnTime(a.endTimes - a.nowTimes), s = [t.min, t.sec].join(":"), i.html(parseInt((a.endTimes - a.nowTimes) / 1e3), 10))
			},
			timerClear: function() {
				var e = p.config,
					t = e.appData || {},
					a = this.doms || {};
				a.$RotaryEnter && a.$RotaryEnter.length && (a.$RotaryEnter.removeClass("is-lucking"), a.$RotaryEnter.find(".RotaryDraw-luck-time").text("")), e.timerIsPlaying = 0, e.timerConfig = [], t.lts = 0, t.ctd = 0, clearTimeout(e.timerVar)
			},
			checkDrawLuckingTime: function() {
				var e = p.config || {},
					t = e.appData || {},
					a = this.doms || {};
				e.roomId == t.rid && t.ctd > 0 && (a.$RotaryEnter && a.$RotaryEnter.length && a.$RotaryEnter.addClass("is-lucking"), this.timerPush({
					type: "ROTARY_LUCKING_TIME",
					endTimes: (new Date).getTime() + 1e3 * t.ctd,
					nowTimes: (new Date).getTime()
				}))
			},
			openPanel: function(e) {
				var t, a = this,
					s = this.doms;
				switch (a.checkPanelFrame(), parseInt(e, 10)) {
				case 1:
					t = 0, a.reqRecordList();
					break;
				case 2:
					t = 1, a.reqUserRank(), a.reqAnchorRank();
					break;
				case 4:
					t = 2
				}
				t >= 0 && (s.$RotaryBox.eq(t).addClass("is-cur").siblings().removeClass("is-cur"), s.$RotaryContainer.show())
			},
			hidePanel: function() {
				var e = this.doms;
				e && e.$RotaryContainer && e.$RotaryContainer.length && e.$RotaryContainer.hide()
			},
			listenConfigSend: function() {
				var e = p.config;
				u.reg("room_data_login", function() {
					e.isConnect = !0, e.isSendConfig = !1, e.rotaryConfig && (e.isSendConfig = !0, u.exe("js_zhuanpan", {
						type: 1,
						data: e.rotaryConfig
					}))
				})
			},
			listenMsgPush: function() {
				var a = this,
					s = p.config;
				t.on("room.rotaryDraw.listen.getTicket", function(e) {
					var t = s.rotaryConfig || {};
					1 == t.is_open && e && e.gid == t.gift_id && (a.appendGetTicketTips(e.num * t.gift_rebate_coupon), u.exe("js_zhuanpan", {
						type: 3,
						data: e.num * t.gift_rebate_coupon
					}))
				}), u.reg("room_zhuanpan", function(i) {
					var n = i || {};
					switch (parseInt(n.type, 10)) {
					case 1:
					case 2:
					case 4:
						l.load().done(function(e) {
							s.giftConfigs = e || {}, a.openPanel(n.type)
						});
						break;
					case 3:
						if (!o.check()) return o.show("login");
						if (s.ownerUid == s.userId) return e.dialog.tips_black("主播不能给自己赠送礼物");
						n.data > 0 && g.render().done(function() {
							var a = e('#gift-content [data-type=gift][data-giftid="' + s.rotaryConfig.gift_id + '"]');
							a && a.length ? t.trigger("mod.gift.draw.batch.send", {
								target: a,
								number: +n.data,
								batch: n.data > 1 ? 1 : 0
							}) : e.dialog.tips_black("赠送失败，礼物已失效")
						});
						break;
					case 5:
						n.data && e.dialog.tips_black(n.data);
						break;
					case 6:
						a.hidePanel();
						break;
					case 7:
						o.check() || o.show("login")
					}
				})
			},
			openFlashRotaryPanel: function() {
				var e = p.config || {},
					t = e.rotaryConfig || {};
				t.gift_id ? l.get(t.gift_id).done(function(e) {
					u.exe("js_zhuanpan", {
						type: 2,
						data: t,
						giftObj: e || {}
					})
				}) : u.exe("js_zhuanpan", {
					type: 2,
					data: t,
					giftObj: {}
				})
			},
			enterEvent: function() {
				var t = this,
					a = this.doms;
				e(".JS_RotaryDraw_enter").on("click", function() {
					return t.openFlashRotaryPanel(), !1
				}), a.$RoomVideo.on("click", ".RotaryDraw-getTicket-close", function() {
					a.$RoomVideo.find(".RotaryDraw-getTicket-tips").hide()
				}).on("click", ".RotaryDraw-getTicket-btn", function() {
					return t.openFlashRotaryPanel(), a.$RoomVideo.find(".RotaryDraw-getTicket-tips").hide(), !1
				})
			},
			panelEvent: function() {
				var t = this,
					a = this.doms,
					s = p.config;
				a.$RotaryContainer.on("click", '[data-flag="RotaryDraw-return"]', function() {
					return t.hidePanel(), t.openFlashRotaryPanel(), !1
				}).on("click", ".recordPage-list .recordPage-num", function() {
					var a = e(this).text();
					return s.reqingRecord ? !1 : (a > 0 && (s.recordPage = +a, t.reqRecordList()), !1)
				}).on("click", ".RotaryDraw-record-page .recordPage-first", function() {
					return s.reqingRecord ? !1 : (s.recordPage = 1, t.reqRecordList(), !1)
				}).on("click", ".RotaryDraw-record-page .recordPage-end", function() {
					return s.reqingRecord ? !1 : (s.recordPage = +s.recordTotalPage || 1, t.reqRecordList(), !1)
				}).on("click", ".RotaryDraw-record-page .recordPage-pre", function() {
					return s.reqingRecord ? !1 : (s.recordPage = s.recordPage - 1 <= 0 ? 1 : s.recordPage - 1, t.reqRecordList(), !1)
				}).on("click", ".RotaryDraw-record-page .recordPage-next", function() {
					return s.reqingRecord ? !1 : (s.recordPage = s.recordPage + 1 >= s.recordTotalPage ? s.recordTotalPage : s.recordPage + 1, t.reqRecordList(), !1)
				})
			},
			initEvent: function() {
				var a = this,
					i = p.config || {};
				t.on("room.rotaryDraw.merge.props", function() {}), t.on("room.rotaryDraw.return.config", function() {
					var t = e.Deferred();
					return a.getRotaryConfig().then(function(e) {
						var a = e || {};
						return t.resolve(a)
					}), t
				}), t.on("room.rotaryDraw.listen.mergeProp", function(e) {
					e && e.used_prop && 16 == e.used_prop.prop_type && a.showMergePropDialog(e.used_prop.dst_gid, 1)
				}), t.on("room.rotaryDraw.open.panel", function() {
					this.getRotaryConfig().done(function(e) {
						1 == e.is_open && a.openFlashRotaryPanel(), i.isConnect && !i.isSendConfig && (i.isSendConfig = !0, u.exe("js_zhuanpan", {
							type: 1,
							data: e
						}))
					})
				}), u.reg("room_data_handler", function(e) {
					var t = s.decode(e).too();
					switch (t.type) {
					case "ltst":
						i.appData = t, a.checkDrawLuckingTime()
					}
				})
			}
		},
		h = {
			init: function() {
				m.init(), p.init(), f.init()
			}
		};
	return {
		init: function() {
			h.init()
		}
	}
}), define("douyu/page/room/normal/mod/guess-game/guess-game-common", ["jquery", "shark/observer", "shark/util/cookie/1.0", "shark/util/storage/1.0", "douyu/context"], function(e, t, a, s, i) {
	var n = {
		cache: {},
		waitSubmit: !1,
		crsf: "/curl/csrfApi/getCsrfCookie",
		getCSRFCookie: function(t) {
			var s = this,
				n = a.get(i.get("sys.tvk"));
			return n ? void(t && t({
				name: $SYS.tn,
				value: n
			})) : void e.ajax({
				url: s.crsf,
				type: "GET",
				dataType: "json",
				success: function(e) {
					0 === +e.error && s.getCSRFCookie(t)
				}
			})
		},
		sendAjax: function(t, a) {
			var s = this,
				i = {
					url: "",
					type: "GET",
					data: {},
					dataType: "JSON",
					success: null,
					error: null,
					complete: function() {
						s.waitSubmit = !1
					}
				},
				n = e.extend(!0, i, t),
				r = n.success,
				o = n.error;
			r && (n.success = function() {
				s.waitSubmit = !1, r.apply(window, arguments)
			}), o && (n.error = function() {
				s.waitSubmit = !1, o.apply(window, arguments)
			}), n.url && (!a && s.waitSubmit || (s.waitSubmit = !0, "post" === n.type.toLowerCase() ? s.getCSRFCookie(function(t) {
				n.data[t.name] = t.value, e.ajax(n)
			}) : e.ajax(n)))
		},
		isAnchor: function() {
			var e = this;
			if (void 0 != e.cache.isAnchor) return e.cache.isAnchor;
			var t = +i.get("sys.uid"),
				a = +i.get("room.owner_uid");
			return e.cache.isAnchor = t === a, e.cache.isAnchor
		},
		isLiving: function() {
			var e = +i.get("room.show_status");
			return 1 === e
		},
		per: function(e, t, a) {
			var s = parseInt(e),
				i = parseInt(t),
				n = s + i;
			if (0 == n) return "0%";
			var r = a ? s : i,
				o = Math.floor(r / n * 100);
			return o + "%"
		},
		numToFix: function(e) {
			return e % 100 == 0 ? (e / 100).toFixed(1) : e / 100
		},
		formatTotalBidNum: function(e) {
			var t, a;
			if (t = parseInt(e)) if (t >= 1e5 && 1e8 > t) {
				var s = (t / 1e4).toFixed(1);
				a = s + "万"
			} else if (t >= 1e8) {
				var s = (t / 1e8).toFixed(1);
				a = s + "亿"
			} else a = t;
			else a = 0;
			return a
		},
		mathAbs: function(e) {
			var t = +e;
			return Math.abs(t)
		},
		keyHandler: function(e) {
			var t = e.split("-");
			return {
				qid: t[0],
				option: t[1]
			}
		},
		triggerSilverChange: function(e) {
			var a = parseInt(e);
			a >= 0 && t.trigger("mod.userinfo.change", {
				current: {
					silver: a
				}
			})
		},
		formatEt: function(e) {
			var t = parseInt(e / 60);
			10 > t && (t = "0" + t);
			var a = parseInt(e % 60);
			10 > a && (a = "0" + a);
			var s = t + ":" + a + "后封盘";
			return s
		},
		suitVideoChange: function() {
			var t, a = e("#js-room-video").width();
			return t = a > 968 ? "big4" : a > 746 ? "big3" : "small3"
		},
		compareAnchorLevel: function(t) {
			var a = e("#js-anchor-level-wrap").find(".anchor-level-icon").eq(0).attr("data-anchor-levelimg");
			return +a >= t
		},
		accMul: function(e, t) {
			var a, s, i, n, r = 0,
				o = e.toString(),
				d = t.toString();
			return i = o.split(".")[1], r += i ? i.length : 0, n = d.split(".")[1], r += n ? n.length : 0, a = Number(o.replace(".", "")), s = Number(d.replace(".", "")), a * s / Math.pow(10, r)
		},
		accDiv: function(e, t) {
			var a, s, i, n, r, o, d = e.toString(),
				c = t.toString();
			return r = d.split(".")[1], a = r ? r.length : 0, o = c.split(".")[1], s = o ? o.length : 0, i = Number(d.replace(".", "")), n = Number(c.replace(".", "")), i / n * Math.pow(10, s - a)
		},
		dys: function(e) {
			t.trigger("dys", e)
		},
		base64_encode: function(e) {
			var t, a, s, i, n, r, o, d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
				c = "",
				l = 0;
			for (e = this.utf8_encode(e); l < e.length;) t = e.charCodeAt(l++), a = e.charCodeAt(l++), s = e.charCodeAt(l++), i = t >> 2, n = (3 & t) << 4 | a >> 4, r = (15 & a) << 2 | s >> 6, o = 63 & s, isNaN(a) ? r = o = 64 : isNaN(s) && (o = 64), c = c + d.charAt(i) + d.charAt(n) + d.charAt(r) + d.charAt(o);
			return c
		},
		utf8_encode: function(e) {
			for (var t = String(e).replace(/\r\n/g, "\n"), a = "", s = 0; s < t.length; s++) {
				var i = t.charCodeAt(s);
				128 > i ? a += String.fromCharCode(i) : i > 127 && 2048 > i ? (a += String.fromCharCode(i >> 6 | 192), a += String.fromCharCode(63 & i | 128)) : (a += String.fromCharCode(i >> 12 | 224), a += String.fromCharCode(i >> 6 & 63 | 128), a += String.fromCharCode(63 & i | 128))
			}
			return a
		}
	};
	return n
}), define("douyu/page/room/normal/mod/guess-game/guess-game-popup", ["jquery", "shark/observer", "shark/util/cookie/1.0", "shark/util/flash/data/1.0", "shark/util/template/2.0", "shark/util/storage/1.0", "douyu/context", "douyu/page/room/base/api", "shark/util/lang/1.0", "douyu/com/user", "douyu/com/exjsonp", "douyu/page/room/normal/mod/guess-game/guess-game-common"], function(e, t, a, s, i, n, r, o, d, c, l, g) {
	var u = {
		GUESSTHEMEFIRSTGUIDE: "ifshowSettingFirstGuideNote"
	},
		m = {
			init: function() {
				this.configs = {
					webUrl: r.get("sys.web_url"),
					userInfo: {
						roomId: "" + r.get("room.room_id"),
						userId: "" + r.get("sys.uid"),
						anchorId: "" + r.get("room.owner_uid"),
						cateId: "" + r.get("room.cate_id"),
						avatar: r.get("room.avatar.small"),
						nickname: r.get("room.owner_name")
					},
					urls: {
						interact: r.get("sys.webconfUrl") + "resource/common/interact.json",
						interactActive: r.get("sys.webconfUrl") + "resource/quiz/quiz_info.json",
						serverTime: "/api/v1/timestamp"
					}
				}
			},
			vars: {},
			guessTheme: {
				mode: 2
			}
		},
		p = {
			cache: {},
			data: {},
			flag: {
				api: !1,
				dom: !1,
				push: !1,
				memberInfo: null
			},
			init: function(e) {
				m.guessMainPanel = e, $ROOM.room_id && $ROOM.cate_id && this.showGEntryCheck()
			},
			render: {
				enterTpl: function(e) {
					var t = d.string.join('<div class="guess-game-wrap">', '<div class="guess-game-btn"></div>', '<div class="guess-ancher-reminding-out">', '<div class="guess-ancher-reminding">', '<div class="guess-ancher-reminding-close"></div>', '<div class="guess-ancher-reminding-img"></div>', '<div class="guess-ancher-reminding-content">', '<span class="guess-ancher-reminding-title">互动竞猜让直播效果爆炸!</span>', '<span class="guess-ancher-reminding-text">你要的互动、收益、话题、人气... 开启竞猜全都有!</span>', "</div>", '<div class="guess-ancher-reminding-part"></div>', "</div>", "</div>", '<div class="guess-user-reminding-out">', '<div class="guess-user-reminding js-new-guess-entertips">', '<div class="guess-user-reminding-close"></div>', '<img class="guess-user-reminding-img" src={{ pic }} />', '<div class="guess-user-reminding-content">', '<span class="guess-user-reminding-name" title="{{ name }}">{{ name }}</span>', '<span class="guess-user-reminding-title">邀请您参与互动竞猜</span>', '<span class="guess-user-reminding-text">鱼丸奖金池爆满，快来抢!</span>', "</div>", '<div class="guess-user-reminding-part"></div>', "</div>", "</div>", "</div>"),
						a = i.compile(t);
					return a(e)
				}
			},
			getInteract: function() {
				var t = e.Deferred(),
					a = this;
				return a.cache.interact ? (t.resolve(a.cache.interact), t.promise()) : (l.load(m.configs.urls.interact, "interact", function(e) {
					a.cache.interact = e, t.resolve(e)
				}, function(e) {
					t.reject(e)
				}, function() {}, !0), t.promise())
			},
			getInteractActive: function(t) {
				var a = e.Deferred(),
					s = this;
				return s.cache.interactActive ? (a.resolve(s.cache.interactActive), a.promise()) : (l.load(m.configs.urls.interactActive, "getQuizInfo", function(e) {
					e.activity_info ? (s.cache.interactActive = e, a.resolve(e)) : (s.cache.interactActive = {
						activity_info: {}
					}, a.resolve(s.cache.interactActive))
				}, function(e) {
					s.cache.interactActive = {
						activity_info: {}
					}, a.resolve(s.cache.interactActive)
				}, function() {}, !0), a.promise())
			},
			getServerTime: function() {
				var t = e.Deferred(),
					a = this;
				return a.cache.serverTime && t.resolve(a.cache.serverTime), e.ajax({
					url: m.configs.urls.serverTime,
					type: "GET",
					dataType: "JSON",
					success: function(e) {
						0 == e.error ? (a.cache.serverTime = e.data, t.resolve(e.data)) : t.reject(e)
					},
					error: function(e) {
						t.reject(e)
					}
				}), t.promise()
			},
			getActiveState: function() {
				var t = this,
					a = e.Deferred();
				return e.when(t.getInteract(), t.getServerTime(), t.getInteractActive()).then(function(e, t, s) {
					if (s && s.activity_info) {
						var i = s.activity_info.start_timestamp,
							n = s.activity_info.end_timestamp;
						s.server_time = t, s.active_status = t >= i && n >= t && s.activity_info.activity_open
					}
					a.resolve(e, s)
				}, function(e) {
					a.reject(e)
				}), a.promise()
			},
			showGEntryCheck: function() {
				var e = this;
				g.sendAjax({
					url: "/lapi/interact/quiz/openStatus",
					type: "GET",
					data: {
						room_id: $ROOM.room_id,
						cate2_id: $ROOM.cate_id
					},
					success: function(t) {
						0 == t.error ? (m.vars.openStatus = t.data || {}, 1 != t.data.is_open && 1 != t.data.is_open_simple || (t.data.is_open_simple || (m.guessTheme.mode = 1), e.getActiveState().then(function(t, a) {
							m.vars.mainMsg = t, m.vars.interactActive = a, m.vars.activeGiftName = a.activity_info.property_name || "", h.tryShowGuide(), m.guessMainPanel.getRoomType() ? e.showEnterPanel() : e.showEnter()
						}))) : -1 == t.error
					}
				}, !0)
			},
			showEnterFirstTips: function() {
				var t = JSON.parse(n.get("ifAnchorNote"));
				!t && g.isAnchor() && (e(".guess-ancher-reminding").show(), n.set("ifAnchorNote", JSON.stringify(!0)))
			},
			popTips: function() {
				n.get("GameGuess-isShowGuessTip");
				n.set("GameGuess-isShowGuessTip", 1, 600), e("#js-guess-start").hide(), p.getActiveState().then(function(t, a) {
					a.active_status ? (e(".guess-user-reminding-special").show(), setTimeout(function() {
						e(".guess-user-reminding-special").hide()
					}, 1e4)) : (e(".guess-user-reminding").show(), setTimeout(function() {
						e(".guess-user-reminding").hide()
					}, 1e4)), g.dys({
						key: "dys.room.guess-game.showtip"
					})
				}, function() {
					e(".guess-user-reminding").show(), setTimeout(function() {
						e(".guess-user-reminding").hide()
					}, 1e4)
				})
			},
			showMsgCenter: function(e) {
				var t = this;
				switch (e) {
				case "api":
					t.flag.api = !0;
					break;
				case "dom":
					t.flag.dom = !0;
					break;
				case "push":
					t.flag.push = !0
				}
				t.flag.dom && t.flag.memberInfo && t.flag.api && !t.flag.push && t.popTips()
			},
			showEnter: function() {
				var e = {
					name: m.configs.userInfo.nickname,
					pic: m.configs.userInfo.avatar
				},
					a = this.render.enterTpl(e);
				t.trigger("mod.chat.action.view.add", {
					flag: "anchor_quiz",
					dom: a,
					lock: !0,
					tips: "猜直播，赢鱼丸，加热度！"
				}), g.dys({
					key: "dys.room.guess-game.anchor.showenter"
				}), this.showMsgCenter("dom"), this.bindTipEvent(), this.showEnterFirstTips()
			},
			bindTipEvent: function() {
				e(document).on("click", ".guess-game-btn", function() {
					g.dys({
						key: "dys.room.anchor.guess.click"
					}), e(".guess-user-reminding").hide(), e(".guess-ancher-reminding").hide(), m.guessMainPanel.initMainPanel()
				}), e(".guess-user-reminding-close").on("click", function() {
					event.stopPropagation(), e(".guess-user-reminding").hide()
				}), e(".guess-user-reminding").on("click", function(t) {
					g.dys({
						key: "dys.room.guess-game.fromtips"
					}), e(".guess-user-reminding").hide(), m.guessMainPanel.initMainPanel()
				}), e(".guess-ancher-reminding-close").on("click", function() {
					event.stopPropagation(), e(".guess-ancher-reminding").hide()
				}), e(".guess-ancher-reminding").on("click", function(t) {
					e(".guess-ancher-reminding").hide(), m.guessMainPanel.initMainPanel()
				})
			},
			showEnterPanel: function() {
				m.guessMainPanel.initMainPanel()
			}
		},
		f = {
			timer: {},
			render: {
				sendGiftGuideTpl: function(e) {
					var t = d.string.join('<div class="guess-guide-sendGift-dialog">', '<div class="closeBtn"></div>', '<div class="headBox">', '<p class="desc1">竞猜没鱼丸？</p>', '<p class="desc2">限时<span class="guess-color-ff7700">{{multiple}}倍</span>返还</p>', "</div>", '<div class="giftBox">', '<div class="giftImg">', '<img src="{{ img }}"></img>', "</div>", '<div class="gitfImgDesc">', '<p class="desc1">{{giftname}} x1</p>', '<p class="desc2">{{name}}可返<span>{{returnyw}}鱼丸</span><span>{{multipleReturnyw}}鱼丸</span></p>', "</div>", "</div>", '<div class="J-guess-guide-sendGift-clock clockBox"></div>', '<div class="sendGiftBtn"></div>', "</div>"),
						a = i.compile(t);
					return a(e)
				}
			},
			countDown: function(t) {
				function a(t) {
					if (0 > t) return clearInterval(i.sendGift), delete i.sendGift, void s.closeSendGiftGuide();
					var a = parseInt(t / 60 % 60);
					10 > a && (a = "0" + a);
					var n = parseInt(t % 60);
					10 > n && (n = "0" + n);
					var r = '<span class="timer">' + a + '</span> : <span class="timer">' + n + "</span>";
					e(".J-guess-guide-sendGift-clock").html(r)
				}
				var s = this,
					i = s.timer,
					n = t;
				i.sendGift || (a(n), i.sendGift = setInterval(function() {
					n--, a(n)
				}, 1e3))
			},
			closeSendGiftGuide: function(t) {
				var a = this.timer;
				clearInterval(a.sendGift), delete a.sendGift, e(".guess-guide-sendGift-dialog").remove()
			},
			showSendGiftGuide: function(a) {
				var s = this,
					i = m.vars.mainMsg.quiz_setting,
					n = e('#gift-content [data-type=gift][data-giftid="' + i.gift_return_ball_id + '"]');
				if (n && n.length) {
					var r = {
						id: i.gift_return_ball_id,
						multiple: i.gift_return_ball_multiple,
						giftname: n.attr("data-giftname"),
						name: n.attr("data-name"),
						returnyw: n.attr("data-returnyw"),
						multipleReturnyw: n.attr("data-returnyw") * i.gift_return_ball_multiple,
						img: n.find(".g-img").attr("src")
					},
						o = s.render.sendGiftGuideTpl(r);
					if (!e(".guess-main-panel")) return;
					e(".guess-main-panel").append(e(o)), this.countDown(a), g.dys({
						key: "dys.room.guess-game.ywsale.show"
					}), e(".guess-guide-sendGift-dialog").on("click", function(a) {
						var r = e(a.target);
						r.hasClass("closeBtn") ? s.closeSendGiftGuide() : r.hasClass("sendGiftBtn") && (t.trigger("mod.gift.draw.batch.send", {
							target: n,
							number: 1,
							batch: 0
						}), e.dialog.tips_black("恭喜获得" + i.gift_return_ball_multiple + "倍鱼丸返利，请刷新余额查收~"), g.dys({
							key: "dys.room.guess-game.ywsale.send",
							stat: 1
						}), s.closeSendGiftGuide())
					})
				}
			}
		},
		h = {
			doms: {},
			config: {
				dailyTask: "/member/quiz/daily_task"
			},
			render: {
				active: function(e) {
					var t = d.string.join('<div class="guess-active-task" style="background:url({{ img.web_pop }});background-size:cover;">', '<div class="guess-active-task-close"></div>', "{{ if (ifOver) }}", '<div class="guess-active-task-ifFirstDone">已完成</div>', "{{ /if }}", "{{ if (!ifOver) }}", '<div class="guess-active-task-ifFirstDone" style="color:red">未完成</div>', "{{ /if }}", '<div class="guess-active-task-haveGet"><span class="guess-active-task-have">{{ now }}</span>/<spanclass="guess-active-task-max">{{ max }}</span></div>', '<div class="guess-active-task-ruleShow" style="background:url({{ img.web_rule_declaration }});background-size:cover;"></div>', '<div class="guess-active-task-rule"></div>', '<div class="guess-active-task-btn" style="background:url({{ img.web_participate_button }})"></div>', "</div>"),
						a = i.compile(t);
					return a(e)
				}
			},
			showActiveDialog: function() {
				var t = this;
				e(".guess-active-task").length || g.sendAjax({
					url: t.config.dailyTask,
					type: "GET",
					dataType: "JSON",
					success: function(e) {
						0 == e.error && e.data && t.renderActiveData(e.data)
					},
					error: function(a) {
						e.dialog.tips_black("网络错误，请稍后再试"), t.renderActiveData()
					}
				})
			},
			renderActiveData: function(t) {
				var a = this,
					s = a.doms,
					i = !(t.bet.task1.current != t.bet.task1.max || !t.bet.task2.max),
					n = t.bet.task1.max + t.bet.task2.max,
					r = t.bet.task1.current + t.bet.task2.current,
					o = {
						ifOver: i,
						max: n || 0,
						now: r || 0,
						img: m.vars.interactActive.activity_info || ""
					};
				s.$dialog = e(a.render.active(o)), e("body").append(s.$dialog), e(".guess-active-task-rule").hover(function() {
					e(".guess-active-task-ruleShow").show()
				}, function() {
					e(".guess-active-task-ruleShow").hide()
				}), e(".guess-active-task-btn").hover(function() {
					e(this).attr("style", "background:url(" + o.img.web_participate_button_click + ")")
				}, function() {
					e(this).attr("style", "background:url(" + o.img.web_participate_button + ")")
				}), e(".guess-active-task-btn").on("click", function() {
					return c.check() ? (e(".guess-game-btn").trigger("click"), void s.$dialog.remove()) : void c.show("login")
				}), s.$dialog.on("click", ".guess-active-task-close", function() {
					s.$dialog.remove()
				})
			},
			getFormatDate: function(e, t) {
				var a, s, i, n, r;
				return e ? (a = 1e3 * parseInt(e, 10), s = new Date(a), n = ("00" + (s.getMonth() + 1)).substr(-2), r = ("00" + s.getDate()).substr(-2), n + "月" + r + "日") : (s = t ? new Date(t) : new Date, i = ("0000" + s.getFullYear()).substr(-4), n = ("00" + (s.getMonth() + 1)).substr(-2), r = ("00" + s.getDate()).substr(-2), i + "-" + n + "-" + r)
			},
			tryShowGuide: function() {
				var e = this,
					t = m.vars.interactActive;
				if (t && t.active_status && t.activity_info) {
					var a = n.get("guessActiveShowTime") || "",
						s = e.getFormatDate(),
						i = t.activity_info.pop_days,
						r = t.activity_info.start_timestamp;
					0 != i && (e.getFormatDate(null, 1e3 * r + 24 * i * 60 * 60 * 1e3) <= s || s > a && (n.set("guessActiveShowTime", s), e.showActiveDialog()))
				}
			}
		},
		v = {
			init: function() {
				e(".flexslider").length > 0 ? e(".flexslider").show() : this.render(), this.bindEvent()
			},
			bindEvent: function() {
				e(".guess-setting-none").on("click", function(t) {
					var a = e(t.target);
					a.hasClass("guess-dialog-closeBtn") ? e(".guess-setting-none").remove() : a.hasClass("noGuessThemeAdd") && (e(".guess-setting-none").remove(), b.Setting_add(1))
				})
			},
			render: function() {
				var t = g.isAnchor() ? "anchor" : "user",
					a = r.get("sys.web_url") + "app/douyu/res/page/room-normal/guess-game/" + t,
					s = '<div class="flexslider guess-setting-none"><ul class="slides"><li><img src="' + a + '1.png" /></li><li><img src="' + a + '2.png" /></li><li><img src="' + a + '3.png" /></li></ul><div class="guess-dialog-closeBtn"></div><div class="noGuessThemeTitle">竞猜主题设置</div><a href="https://www.douyu.com/cms/gong/201712/25/6965.shtml" target="_blank" class="noGuessThemeRule">竞猜规则</a><div class="guess-btn-181 empty noGuessThemeAdd">+添加主题</div></div>';
				e("body").append(s), e(".flexslider").flexslider({
					animation: "slide",
					animationLoop: !0,
					prevText: "",
					nextText: "",
					keyboard: !1
				})
			}
		},
		y = {
			doms: {},
			vars: {
				titleHistory: [],
				title_num: 1,
				user_num: null
			},
			render: {
				setting_have: function(t) {
					var a = d.string.join("<div class=\"guess-setting-have guess-themeBox {{ mode == 2 ? 'guess-themeBox-modeEasy' : '' }}\">", '<div class="guess-setting-have-close guess-dialog-closeBtn white"></div>', '<p class="themeTitle">竞猜主题设置</p>', '<div class="themeTitle2">', '<p class="tip">您最多可同时发起3个主题(<span class="guess-color-ff7700">已选中：<span class="guess-setting-have-ask-num">0</span>个</span>)</p>', '<a href="https://www.douyu.com/cms/gong/201712/25/6965.shtml" target="_blank" class="rule">竞猜规则</a>', "</div>", '<div class="guess-setting-have-main">', "{{ each themeList }}", "{{ if ($value.status==0||$value.status==2) }}", '<div class="guess-setting_one guess-setting-diabled" data-titleId = {{ $value.quize_id }}  data-limit-time = {{ $value.stop_timestamp }}>', "<div class=\"guess-setting_one-audit {{ ($value.status==0) ? 'auditing' : 'failAudit' }}\"></div>", "<span class=\"guess-setting_one-change {{ ($value.status==0) ? '' : 'ableEdit' }}\"></span>", '<span class="guess-setting_one-false"></span>', '<span class="guess-setting_one-error">{{ $value.remark }}</span>', "{{ /if }}", "{{ if ($value.status==1) }}", '<div class="guess-setting_one" data-titleId = {{ $value.quize_id }}  data-limit-time = {{ $value.stop_timestamp }}>', '<div class="guess-setting_one-audit"></div>', '<span class="guess-setting_one-change ableEdit"></span>', "{{ if ($value.is_invalid==1) }}", '<span class="guess-setting_one-false"></span>', '<span class="guess-setting_one-error">主题失效，请重新编辑或删除</span>', "{{ /if }}", "{{ if ($value.is_invalid==0) }}", '<span class="guess-setting_one-sure"></span>', '<span class="guess-setting_one-error"></span>', "{{ /if }}", "{{ /if }}", '<span class="guess-setting_one-close"></span>', '<div class="themeItemLine">', '<span class="guess-setting_one-title">{{ $value.quize_theme }}</span>', "{{ if ($value.stop_timestamp!=0) }}", '<span class="timeTip">发起后<span>{{ $value.stop_timestamp/60 }}分钟</span>封盘</span>', "{{ /if }}", "</div>", '<div class="themeItemLine">', '<span class="guess-setting_one-chooseOne">{{ $value.first_option_name }}</span>', '<span class="vs">vs</span>', '<span class="guess-setting_one-chooseTwo">{{ $value.second_option_name }}</span>', "</div>", "</div>", "{{ /each }}", "</div>", "<div>", "{{ if (showNormalGuess==1) }}", '<div class="J-guess-setting-mode1 guess-setting-modeBox">', '<span class="guessMode" data-mode=1>', '<div class="guess-bubble tipsBubble">', '<p class="title">水友开猜设置赔率：</p>', "<p>原有玩法，手动封盘，用户可开猜，玩法更专业，竞猜停不下来</p>", "</div>", "</span>", "<span>水友开猜设置赔率</span>", "</div>", "{{ /if }}", "{{ if (showSimpleGuess==1) }}", '<div class="J-guess-setting-mode2 guess-setting-modeBox">', '<span class="guessMode" data-mode=2>', '<div class="guess-bubble tipsBubble">', '<p class="title">自动赔率：</p>', "<p>最新玩法，用户只需投注，结算以封盘赔率为准，玩法更简单的～</p>", '<span class="new"></span>', "</div>", "</span>", "<span>自动赔率（平台实时计算赔率）</span>", "</div>", "{{ /if }}", "</div>", '<div class="guess-btnBox">', '<div class="guess-btn-181 empty guess-mgr-20 gusssThemeAdd">+添加主题</div>', '<div class="guess-btn-181 guess-setting-have-knowBtn">发起竞猜</div>', "</div>", '<div class="guess-setting-firstGuide">', '<div class="firstGuideClose"></div>', "</div>", "</div>"),
						s = e.extend({}, {
							themeList: t,
							showNormalGuess: m.vars.openStatus.is_open,
							showSimpleGuess: m.vars.openStatus.is_open_simple,
							mode: m.guessTheme.mode
						}),
						n = i.compile(a);
					return n(s)
				},
				setting_add: function(e) {
					var t = d.string.join('<div class="guess-setting-edit guess-themeBox">', '<div class="editClose guess-dialog-closeBtn white"></div>', '<div class="editBack guess-dialog-backBtn">返回</div>', '<p class="themeTitle">{{type}}竞猜主题</p>', '<div class="themeTitle2">输入竞猜内容<span class="guess-setting-edit-errMsg"></span></div>', '<div class="editThemeBox">', '<input class="guess-setting-edit-editTitle" onKeypress="return (event.which||event.keyCode) !=32" maxlength="15" placeholder="竞猜主题（1-15个字）" />', '<div class="guess-mgt-10">', '<input class="guess-setting-edit-chooseOne J-guess-setting-editCheck" onKeypress="return (event.which||event.keyCode) !=32" maxlength="5" placeholder="选项A（1-5个字）"/>', '<span class="guess-setting-edit-editVs">VS</span>', '<input class="guess-setting-edit-chooseTwo J-guess-setting-editCheck" onKeypress="return (event.which||event.keyCode) !=32" maxlength="5" placeholder="选项B（1-5个字）"/>', "</div>", "</div>", '<div class="themeTitle2">自动赔率模式封盘时间<span class="guess-color-ff0000">（仅针对自动赔率模式竞猜有效）</span></div>', '<p class="themeTitle3">自动赔率模式必须定时封盘；水友开猜模式无定时封盘，只能手动封盘。</p>', '<div class="editThemeBox">', "{{ each time_choose.stop_timestamp}}", "{{ if ($value==0) }}", '<span class="guess-setting-edit-time" data-limit-time="{{$value}}">不限制</span>', "{{ else }}", '<span class="guess-setting-edit-time', "{{ if ($index==0) }}", " guess-setting-edit-timeActive", "{{ /if }}", '" data-limit-time="{{$value}}">{{$value/60}}分钟</span>', "{{ /if }}", "{{ /each }}", "</div>", '<div class="guess-btnBox">', '<div class="guess-btn-181 guess-setting-edit-knowBtn">提交审核</div>', "</div>", "</div>"),
						a = i.compile(t);
					return a(e)
				}
			},
			showSetting: function() {
				var t = this;
				e(".guess-setting-have").length && e(".guess-setting-have").remove(), e(".guess-setting-edit").length && e(".guess-setting-edit").remove(), g.sendAjax({
					url: g.isAnchor() ? "/member/quiz/get_quiz_list" : "/member/quiz/user_get_quiz_list",
					type: "GET",
					data: g.isAnchor() ? {
						t: (new Date).getTime()
					} : {
						room_id: m.configs.userInfo.roomId,
						t: (new Date).getTime()
					},
					success: function(a) {
						if (0 == a.data.length) v.init();
						else {
							var s = t.render.setting_have(a.data);
							t.doms.$setting_have = e(s), e("body").append(t.doms.$setting_have), t.showHistory(), t.bindSettingHaveEvent(), t.doms.$setting_have.show(), t.showSettingFirstGuide()
						}
					}
				})
			},
			showSettingFirstGuide: function() {
				var t = JSON.parse(n.get(u.GUESSTHEMEFIRSTGUIDE));
				t || (e(".guess-setting-firstGuide").show(), n.set(u.GUESSTHEMEFIRSTGUIDE, JSON.stringify(!0)), e(".guess-setting-firstGuide").find(".firstGuideClose").on("click", function(t) {
					e(".guess-setting-firstGuide").hide()
				}))
			},
			collectId: function() {
				var t = [];
				return e(".guess-setting_one-sureYes").each(function(a, s) {
					var i = e(s).parents(".guess-setting_one").attr("data-titleId");
					t.push(i)
				}), t
			},
			showHistory: function() {
				var t = this.vars.titleHistory;
				e(".guess-setting_one").each(function(a, s) {
					for (var i = 0; i < t.length; i++) t[i] == e(s).attr("data-titleId") && e(s).find(".guess-setting_one-sure").addClass("guess-setting_one-sureYes")
				}), this.guessThemeModeSwitch(m.guessTheme.mode), e(".J-guess-setting-mode" + m.guessTheme.mode).find(".guessMode").addClass("active")
			},
			guessThemeModeSwitch: function(t) {
				m.guessTheme.mode = t;
				var a = e(".guess-setting_one-sureYes");
				this.vars.title_num > 0 && a.each(function(a, s) {
					var i = e(s).parents(".guess-setting_one").find(".guess-setting_one-error"),
						n = e(s).parents(".guess-setting_one").attr("data-limit-time");
					i.removeClass("disable"), 2 == t && 0 >= n ? (i.text("自动赔率模式必须设置封盘时间"), i.addClass("disable")) : i.text("")
				})
			},
			bindSettingHaveEvent: function() {
				var t = this,
					a = (t.doms, t.vars);
				a.title_num = e(".guess-setting_one-sureYes").length, e(".guess-setting-have-ask-num").text(this.vars.title_num), e(".guess-setting-have-main").mCustomScrollbar(), e(".guess-setting-have").on("click", function(s) {
					var i = e(s.target);
					if (i.hasClass("guess-setting-have-close")) e(".guess-setting-have").remove();
					else if (i.hasClass("ableEdit")) {
						var n = i.parents(".guess-setting_one").attr("data-titleId"),
							r = i.parents(".guess-setting_one").attr("data-limit-time"),
							o = i.parents(".guess-setting_one").find(".guess-setting_one-title").text(),
							d = i.parents(".guess-setting_one").find(".guess-setting_one-chooseOne").text(),
							c = i.parents(".guess-setting_one").find(".guess-setting_one-chooseTwo").text();
						a.titleHistory = t.collectId(), e(".guess-setting-have").hide(), t.Setting_add(2), e(".guess-setting-edit").attr("data-titleId", n), e(".guess-setting-edit-editTitle").val(o), e(".guess-setting-edit-chooseOne").val(d), e(".guess-setting-edit-chooseTwo").val(c), e(".guess-setting-edit-time").each(function(t, a) {
							e(a).removeClass("guess-setting-edit-timeActive"), e(a).attr("data-limit-time") == r && e(a).addClass("guess-setting-edit-timeActive")
						})
					} else if (i.hasClass("gusssThemeAdd")) {
						if (10 == e(".guess-setting_one").length) return void e.dialog.tips_black("最多添加10个主题~");
						a.titleHistory = t.collectId(), e(".guess-setting-have").hide(), t.Setting_add(1)
					} else if (i.hasClass("guess-setting_one-close")) g.sendAjax({
						url: g.isAnchor() ? "/member/quiz/del_quiz" : "/member/quiz/user_del_quiz",
						type: "POST",
						data: g.isAnchor() ? {
							quize_id: i.parents(".guess-setting_one").attr("data-titleId")
						} : {
							room_id: a.roomId,
							quize_id: i.parents(".guess-setting_one").attr("data-titleId")
						},
						success: function(s) {
							if (0 == s.error) {
								var n = i.parents(".guess-setting_one").find(".guess-setting_one-sureYes").length;
								a.title_num = a.title_num - n, e(".guess-setting-have-ask-num").html(a.title_num), i.parents(".guess-setting_one").remove(), e(".guess-setting_one").length || (e(".guess-setting-have").remove(), t.showSetting())
							} else e.dialog.tips_black(s.msg)
						}
					});
					else if (i.hasClass("guess-setting-have-knowBtn")) {
						if (!a.title_num) return void e.dialog.tips_black("请勾选竞猜主题");
						if (e(this).find(".guess-setting_one-error.disable").length > 0) return void e.dialog.tips_black("自动赔率模式必须设置封盘时间");
						var l = t.collectId();
						g.dys({
							key: "dys.room.guess-game.anchor.create",
							is_anch: g.isAnchor() ? 1 : 0,
							type: m.guessTheme.mode
						}), g.sendAjax({
							url: g.isAnchor() ? "/member/quiz/start_quiz_v2" : "/member/quiz/user_start_quiz",
							type: "POST",
							data: g.isAnchor() ? {
								play_type: m.guessTheme.mode,
								quize_ids: l
							} : {
								play_type: m.guessTheme.mode,
								room_id: m.configs.userInfo.roomId,
								quize_ids: l
							},
							success: function(s) {
								0 == s.error ? (g.dys({
									key: "dys.room.guess-game.suresetting",
									is_anch: g.isAnchor() ? 1 : 0,
									stat: 1,
									num: l.length
								}), e.dialog.tips_black(s.msg), e(".guess-setting-have").remove(), a.titleHistory = l) : -1 == s.error ? (g.dys({
									key: "dys.room.guess-game.suresetting",
									is_anch: g.isAnchor() ? 1 : 0,
									stat: 2,
									num: l.length
								}), e.dialog.tips_black(s.msg), "number" == typeof s.data.index && e(".guess-setting_one-sureYes").each(function(t, i) {
									t == s.data.index && (e(i).removeClass("guess-setting_one-sureYes"), e(i).removeClass("guess-setting_one-sure"), e(i).addClass("guess-setting_one-false"), e(".guess-setting_one-error").length || e(i).parents(".guess-setting_one").append(e('<span class="guess-setting_one-error">' + s.msg + "</span>")), a.title_num--, e(".guess-setting-have-ask-num").html(a.title_num))
								})) : -2 == s.error && (g.dys({
									key: "dys.room.guess-game.suresetting",
									is_anch: g.isAnchor() ? 1 : 0,
									stat: 2,
									num: l.length
								}), e(".guess-setting-have").remove(), t.showNoPass(s.msg))
							}
						})
					}
				}), e(".J-guess-setting-mode1").on("click", function(a) {
					e(".J-guess-setting-mode1").find(".guessMode").addClass("active"), e(".J-guess-setting-mode2").find(".guessMode").removeClass("active"), e(".guess-setting-have").removeClass("guess-themeBox-modeEasy"), t.guessThemeModeSwitch(1)
				}), e(".J-guess-setting-mode2").on("click", function(a) {
					e(".J-guess-setting-mode2").find(".guessMode").addClass("active"), e(".J-guess-setting-mode1").find(".guessMode").removeClass("active"), e(".guess-setting-have").addClass("guess-themeBox-modeEasy"), t.guessThemeModeSwitch(2)
				}), e(".guess-setting_one").on("click", function(s) {
					var i = e(s.target);
					if (!i.hasClass("guess-setting_one-close") && !i.hasClass("guess-setting_one-change") && 1 != e(this).find(".guess-setting_one-false").length) if (e(this).find(".guess-setting_one-sureYes").length) e(this).find(".guess-setting_one-sure").removeClass("guess-setting_one-sureYes"), a.title_num--, e(".guess-setting-have-ask-num").html(a.title_num), e(this).find(".guess-setting_one-error").removeClass("disable").text(""), a.titleHistory = t.collectId();
					else {
						if (3 == a.title_num) return void e.dialog.tips_black("最多只能同时发布3个主题哦~");
						if (2 == m.guessTheme.mode) {
							var n = e(this).attr("data-limit-time");
							if (0 >= n) return void e.dialog.tips_black("自动赔率模式需要设置封盘时间")
						}
						e(this).find(".guess-setting_one-sure").addClass("guess-setting_one-sureYes"), a.title_num++, e(".guess-setting-have-ask-num").html(a.title_num), a.titleHistory = t.collectId()
					}
				})
			}
		},
		b = {
			doms: {},
			vars: {
				openStatus: null,
				mainMsg: null,
				odds_now: null,
				DeJin_now: null,
				Betting_now: null,
				title_num: 1,
				roomId: $ROOM.room_id,
				titleHistory: [],
				user_num: null
			},
			flag: {},
			scrollTimer: null,
			powerTimer: null,
			cacheDealerDoms: function() {
				var t = this.doms,
					a = e(".guess-tip-dealer");
				t.$Dealer = a, t.$chooseTrue = a.find(".guess-tip-dealer-choose_one"), t.$chooseFalse = a.find(".guess-tip-dealer-choose_two"), t.$chooseNotice = a.find(".J-choose-notice"), t.$odds_choose = a.find(".guess-tip-dealer-odds_num"), t.$DeJin_choose = a.find(".guess-tip-dealer-DeJin_num"), t.$odds_yours = a.find(".guess-tip-dealer-freedom_odds"), t.$DeJin_yours = a.find(".guess-tip-dealer-freedom_DeJin"), t.$Dealer_sureBtn = a.find(".guess-tip-dealer-sureBtn"), t.$Dealer_helper = a.find(".guess-tip-dealer-help"), t.$Dealer_helper_content = a.find(".guess-tip-dealer-help-tip_out"), t.$Dealer_myFishBall = a.find(".guess-tip-dealer-my_fishBall_num");
				var s = e(".guess-tip-betting");
				t.$Betting = s, t.$Betting_yours = s.find(".guess-tip-betting-input input"), t.$Betting_choose = s.find(".guess-tip-betting-num"), t.$odds_value = s.find(".guess-tip-betting-msgOdds span"), t.$win_value = s.find(".guess-tip-betting-msgWin span"), t.$Betting_fishBall = e(".fishBall_NUM"), t.$Betting_Btn = s.find(".guess-tip-betting-doneBtn");
				e(".ancher-result")
			},
			render: {
				setting_have: function(t) {
					var a = d.string.join("<div class=\"guess-setting-have guess-themeBox {{ mode == 2 ? 'guess-themeBox-modeEasy' : '' }}\">", '<div class="guess-setting-have-close guess-dialog-closeBtn white"></div>', '<p class="themeTitle">竞猜主题设置</p>', '<div class="themeTitle2">', '<p class="tip">您最多可同时发起3个主题(<span class="guess-color-ff7700">已选中：<span class="guess-setting-have-ask-num">0</span>个</span>)</p>', '<a href="https://www.douyu.com/cms/gong/201712/25/6965.shtml" target="_blank" class="rule">竞猜规则</a>', "</div>", '<div class="guess-setting-have-main">', "{{ each themeList }}", "{{ if ($value.status==0||$value.status==2) }}", '<div class="guess-setting_one guess-setting-diabled" data-titleId = {{ $value.quize_id }}  data-limit-time = {{ $value.stop_timestamp }}>', "<div class=\"guess-setting_one-audit {{ ($value.status==0) ? 'auditing' : 'failAudit' }}\"></div>", "<span class=\"guess-setting_one-change {{ ($value.status==0) ? '' : 'ableEdit' }}\"></span>", '<span class="guess-setting_one-false"></span>', '<span class="guess-setting_one-error">{{ $value.remark }}</span>', "{{ /if }}", "{{ if ($value.status==1) }}", '<div class="guess-setting_one" data-titleId = {{ $value.quize_id }}  data-limit-time = {{ $value.stop_timestamp }}>', '<div class="guess-setting_one-audit"></div>', '<span class="guess-setting_one-change ableEdit"></span>', "{{ if ($value.is_invalid==1) }}", '<span class="guess-setting_one-false"></span>', '<span class="guess-setting_one-error">主题失效，请重新编辑或删除</span>', "{{ /if }}", "{{ if ($value.is_invalid==0) }}", '<span class="guess-setting_one-sure"></span>', '<span class="guess-setting_one-error"></span>', "{{ /if }}", "{{ /if }}", '<span class="guess-setting_one-close"></span>', '<div class="themeItemLine">', '<span class="guess-setting_one-title">{{ $value.quize_theme }}</span>', "{{ if ($value.stop_timestamp!=0) }}", '<span class="timeTip">发起后<span>{{ $value.stop_timestamp/60 }}分钟</span>封盘</span>', "{{ /if }}", "</div>", '<div class="themeItemLine">', '<span class="guess-setting_one-chooseOne">{{ $value.first_option_name }}</span>', '<span class="vs">vs</span>', '<span class="guess-setting_one-chooseTwo">{{ $value.second_option_name }}</span>', "</div>", "</div>", "{{ /each }}", "</div>", "<div>", "{{ if (showNormalGuess==1) }}", '<div class="J-guess-setting-mode1 guess-setting-modeBox">', '<span class="guessMode" data-mode=1>', '<div class="guess-bubble tipsBubble">', '<p class="title">水友开猜设置赔率：</p>', "<p>原有玩法，手动封盘，用户可开猜，玩法更专业，竞猜停不下来</p>", "</div>", "</span>", "<span>水友开猜设置赔率</span>", "</div>", "{{ /if }}", "{{ if (showSimpleGuess==1) }}", '<div class="J-guess-setting-mode2 guess-setting-modeBox">', '<span class=" guessMode" data-mode=2>', '<div class="guess-bubble tipsBubble">', '<p class="title">自动赔率：</p>', "<p>最新玩法，用户只需投注，结算以封盘赔率为准，玩法更简单的～</p>", '<span class="new"></span>', "</div>", "</span>", "<span>自动赔率（平台实时计算赔率）</span>", "</div>", "{{ /if }}", "</div>", '<div class="guess-btnBox">', '<div class="guess-btn-181 empty guess-mgr-20 gusssThemeAdd">+添加主题</div>', '<div class="guess-btn-181 guess-setting-have-knowBtn">发起竞猜</div>', "</div>", '<div class="guess-setting-firstGuide">', '<div class="firstGuideClose"></div>', "</div>", "</div>"),
						s = e.extend({}, {
							themeList: t,
							showNormalGuess: m.vars.openStatus.is_open,
							showSimpleGuess: m.vars.openStatus.is_open_simple,
							mode: m.guessTheme.mode
						}),
						n = i.compile(a);
					return n(s)
				},
				setting_add: function(e) {
					var t = d.string.join('<div class="guess-setting-edit guess-themeBox">', '<div class="editClose guess-dialog-closeBtn white"></div>', '<div class="editBack guess-dialog-backBtn">返回</div>', '<p class="themeTitle">{{type}}竞猜主题</p>', '<div class="themeTitle2">输入竞猜内容<span class="guess-setting-edit-errMsg"></span></div>', '<div class="editThemeBox">', '<input class="guess-setting-edit-editTitle" onKeypress="return (event.which||event.keyCode) !=32" maxlength="15" placeholder="竞猜主题（1-15个字）" />', '<div class="guess-mgt-10">', '<input class="guess-setting-edit-chooseOne J-guess-setting-editCheck" onKeypress="return (event.which||event.keyCode) !=32" maxlength="5" placeholder="选项A（1-5个字）"/>', '<span class="guess-setting-edit-editVs">VS</span>', '<input class="guess-setting-edit-chooseTwo J-guess-setting-editCheck" onKeypress="return (event.which||event.keyCode) !=32" maxlength="5" placeholder="选项B（1-5个字）"/>', "</div>", "</div>", '<div class="themeTitle2">自动赔率模式封盘时间<span class="guess-color-ff0000">（仅针对自动赔率模式竞猜有效）</span></div>', '<p class="themeTitle3">自动赔率模式必须定时封盘；水友开猜模式无定时封盘，只能手动封盘。</p>', '<div class="editThemeBox">', "{{ each time_choose.stop_timestamp}}", "{{ if ($value==0) }}", '<span class="guess-setting-edit-time" data-limit-time="{{$value}}">不限制</span>', "{{ else }}", '<span class="guess-setting-edit-time', "{{ if ($index==0) }}", " guess-setting-edit-timeActive", "{{ /if }}", '" data-limit-time="{{$value}}">{{$value/60}}分钟</span>', "{{ /if }}", "{{ /each }}", "</div>", '<div class="guess-btnBox">', '<div class="guess-btn-181 guess-setting-edit-knowBtn">提交审核</div>', "</div>", "</div>"),
						a = i.compile(t);
					return a(e)
				},
				dealer: function(t) {
					var a = d.string.join('<div class="guess-tip-dealer" data-qid={{ changeMsg.qid }}>', '<div class="closeBtn guess-dialog-closeBtn"></div>', '<div class="guess-tip-dealer-help-tip_out">', '<span class="guess-tip-dealer-help-tip">您的底金可以被其他玩家购买,</br>若您猜对可以获得其他玩家购买的金额.</span>', '<span class="guess-tip-dealer-part"></span>', "</div>", '<div class="headTitle">我要开猜', '<div class="rulesBox">', '<i class="iconHorn"></i>', '<div class="scrollBox">', '<div class="J-scrollBody1">', "<p>开猜后，您的底金会被其他用户购买</p>", "<p>猜对即可获得用户投注到您的开猜上的鱼丸</p>", "<p>赔率设得越高，开猜越容易被其他用户买</p>", "<p>若开猜没有被购买，这部分鱼丸会返还给您</p>", "</div>", '<div class="J-scrollBody2"></div>', "</div>", '<div class="tipsTextBox">', '<div class="tipsTitle">开猜说明</div>', '<div><span class="iconNum">1</span>开猜后，您的底金会被其他用户购买</div>', '<div><span class="iconNum">2</span>猜对即可获得用户投注到您的开猜上的鱼丸</div>', '<div><span class="iconNum">3</span>赔率设得越高，开猜越容易被其他用户买</div>', '<div><span class="iconNum">4</span>若开猜没有被购买，这部分鱼丸会返还给您</div>', "</div>", "</div>", "</div>", '<div class="itemBox">', '<span class="item-name">主　题：</span>', '<span class="item-content">{{ changeMsg.title }}</span>', "</div>", '<div class="guess-tip-dealer-choose_out">', '<span class="item-name">猜胜方：</span>', '<span class="guess-tip-dealer-choose_one choose-option" data-chooseNum=1>{{ changeMsg.chooseOne }}</span>', '<span class="guess-tip-dealer-choose_two choose-option" data-chooseNum=2>{{ changeMsg.chooseTwo }}</span>', '<span class="J-choose-notice"></span>', "</div>", '<div class="guess-tip-dealer-odds_out">', '<span class="item-name">赔　率：</span>', '<input class="guess-tip-dealer-freedom_odds" onKeypress="return (event.which||event.keyCode) !=32" maxlength="3"  placeholder="输入0.1-9.9"/>', "</div>", '<div class="guess-tip-dealer-over">超出鱼丸上限</div>', '<div class="guess-tip-dealer-DeJin_out">', '<span class="item-name">底　金：</span>', '<input class="guess-tip-dealer-freedom_DeJin" onKeypress="return (event.which||event.keyCode) !=32" maxlength="9" placeholder="输入{{ sureMsg.min_base_gold }}及以上"/>', '<div class="guess-tip-dealer-clear"></div>', '<span class="guess-tip-dealer-DeJin_num firstItem">1000</span>', '<span class="guess-tip-dealer-DeJin_num">5000</span>', '<span class="guess-tip-dealer-DeJin_num">10000</span>', '<span class="guess-tip-dealer-DeJin_num">50000</span>', "</div>", '<div class="guess-tip-dealer-my_fishBall">', '<span class="item-name">猜对且底金被买完则获得：</span>', '<span class="expectFishBall">0</span>', "</div>", '<div class="guess-btnBox">', '<div class="guess-btn-121 guess-tip-dealer-sureBtn">确 定</div>', "</div>", "</div>"),
						s = e.extend({}, t, {
							calcSilverFunc: function(e, t) {
								return b.calcSilverFunc(e, t)
							}
						}),
						n = i.compile(a);
					return n(s)
				},
				beforeOdds: function(e) {
					var t = d.string.join('<div class="guess-bubble guess-tip-dealer-odds_history">', '<div class="historyTitle">历史赔率:</div>', '<div class="history-closeBtn guess-dialog-closeBtn"></div>', "<div>", "{{ each data }}", "{{ if ($index < 9) }}", '<div class="guess-tip-dealer-odds_historyOne">{{ $value }}</div>', "{{ /if }}", "{{ /each }}", "</div>", "</div>"),
						a = i.compile(t);
					return a(e)
				},
				dealerSure: function(e) {
					var t = d.string.join('<div class="guess-dealer-remember-out">', '<div class="guess-dealer-remember">', '<div class="headTitle"><i class="tipIcon"></i>特别提示</div>', '<div class="contentBox">', '<div class="item"><span class="index">1. </span>若开猜没被其他用户买完，赢了可能无法赢到预期的鱼丸，没有被购买的底金会返还给您</div>', '<div class="item"><span class="index">2. </span>您开猜后，赔率会显示在相反的选项上</div>', '<div class="item"><span class="index">3. </span>系统会优先显示最高的赔率，提高赔率可以吸引其他用户购买</div>', "</div>", '<div class="guess-mgt-10">', '<input class="guess-dealer-remember-input" type="checkbox" />', '<span class="sureContent">我已经了解开猜规则，不再提示</span>', "</div>", '<div class="guess-btnBox">', '<div class="guess-dealer-remember-sure guess-btn-121 guess-mgr-20">确定开猜</div>', '<div class="guess-dealer-remember-false guess-btn-121 guess-btn-empty">取消</div>', "</div>", "</div>", "</div>"),
						a = i.compile(t);
					return a(e)
				},
				betting: function(e) {
					var t = d.string.join("<div class=\"guess-tip-betting-total {{ option == 1? '' : ''}}\">", '<div class="guess-tip-betting" data-guesstype="{{guessType}}" data-bankerid="{{ sbid }}" data-qid="{{ qid }}"  data-balance="{{ leaves }}" data-min="{{ min }}"  data-join="{{ joinnum }}"  data-option="{{ option }}">', '<div class="closeBtn guess-dialog-closeBtn"></div>', '<div class="guess-tip-betting-over">', "{{ if (guessType == 2) }}", "超出鱼丸余额", "{{ else }}", "超出鱼丸余额或资金池上限", "{{ /if }}", "</div>", '<div class="guess-tip-betting-msgOut">', '<span class="guess-tip-betting-msgOdds bettingTitle bettingTitle-position2">', '<div class="oddPicture"></div>', '<div class="oddContent">赔率 <span>{{ odds }}</span></div>', "{{ if (guessType == 2) }}", '<em class="ActGuess-tip-remain">(以封盘时赔率为准，结算收益)</em>', "{{ /if }}", "</span>", "{{ if (guessType == 2) }}", '<span class="guess-tip-betting-msgWin bettingTitle bettingTitle-position1">', '<div class="poolPicture"></div>', '<div class="oddContent">赢则获得 <span>0</span><em class="ActGuess-tip-remain">(含本金)</em></div>', "</span>", "{{ else }}", '<span class="guess-tip-betting-msgWin bettingTitle bettingTitle-position3">赢则获得 <span>0</span></span>', '<span class="guess-tip-betting-pools bettingTitle bettingTitle-position1">', '<div class="poolPicture"></div>', '<div class="oddContent">资金池 <span>{{ leaves }}</span></div>', "</span>", "{{ /if }}", "</div>", '<div class="guess-tip-betting-error"></div>', '<div class="guess-tip-betting-input">', '<div class="guess-tip-betting-clear"></div>', '<input maxlength="9" placeholder="请输入鱼丸数量"/>', "</div>", '<div class="guess-tip-betting-numBtnIn">', "{{ each betAmount}}", '<span class="guess-tip-betting-num guess-tip-betting-num-left">{{$value}}</span>', "{{ /each }}", '<span class="guess-tip-betting-num guess-tip-betting-num-left">全部</span>', "</div>", '<div class="guess-btnBox">', '<span class="guess-tip-betting-doneBtn guess-btn-121">投注</span>', "</div>", "</div>", '<div class="guess-tip-betting-part"></div>', "</div>"),
						a = i.compile(t);
					return a(e)
				},
				ancher_result: function(e) {
					var t = d.string.join('<div class="ancher-result guess-themeBox">', '<div class="ancher-result-close3 guess-dialog-closeBtn white"></div>', '<p class="themeTitle">提交结果</p>', '<p class="ancher-result-tips">请谨慎提交结果！提交后将无法再修改，若提交错误，请自行与水友协商解决，若用户多次投诉，将收回竞猜权限。</p>', "{{ each part}}", '<div class="ancher-result_one" data-qid={{ $value.qid }}>', '<span class="ancher-result_title">{{ $value.title }}</span>', '<div class="ancher-result_time">', '<span class="ancher-result_min">{{ $value.endTime }}</span>', "</div>", '<div class="ancher-answerAndNum">', '<span class="ancher-result_answer" data-chooseId=1>{{ $value.chooseOne }}</span>', '<span class="ancher-result_answer" data-chooseId=2>{{ $value.chooseTwo }}</span>', '<span class="ancher-result_answer" data-chooseId=3>流局</span>', '<div class="ancher-result-help">?', '<div class="ancher-result-help-tip_out">', '<span class="ancher-result-help-tip">选中流局后，此竞猜无效，将返还用户投注鱼丸</span>', '<span class="ancher-result-part"></span>', "</div>", "</div>", "</div>", "</div>", "{{ /each }}", '<div class="guess-btnBox">', '<div class="ancher-knowBtn-false guess-btn-138 guess-btn-empty guess-mgr-20">取　消</div>', '<div class="ancher-knowBtn-true guess-btn-138 disabled" data-guesstype="{{ guesstype }}">提　交</div>', "</div>", "</div>"),
						a = i.compile(t);
					return a(e)
				},
				anchor_resultSure: function(e) {
					var t = d.string.join("{{ each part}}", '<div class="anchor_resultSure-one">', '<span class="anchor_resultSure-one-left">{{ $value.title }}</span>', '<span class="anchor_resultSure-one-right">[ {{ $value.choose }} ]</span>', "</div>", "{{ /each }}"),
						a = i.compile(t);
					return a(e)
				},
				user_result: function(e) {
					var t = d.string.join('<div class="guess-user-result">', '<div class="guess-user-result-head">', '<p class="headTips">若主播结错帐，请联系主播协商处理，若主播不受理，请联系客服，官方将视情节对主播进行处罚。</p>', "</div>", '<div class="guess-user-result-content">', "{{ each part}}", '<div class="guess-user-result_one">', '<div class="guess-user-resultAndTitle">{{$index+1}}、{{ $value.qt }}</div>', "<div>", "{{ if ($value.qet==2) }}", '<span class="guess-user-result_answer" style="color:#999;">{{ $value.won }}</span>', "{{ /if }}", "{{ if ($value.qet==1) }}", '<span class="guess-user-result_answer">胜利方：{{ $value.won }}</span>', "{{ /if }}", "{{ if ($value.ec>=0&&$value.qet==1) }}", '<span class="guess-user-result_num">+{{ $value.ec }}鱼丸</span>', "{{ /if }}", "{{ if ($value.qet==2) }}", '<span class="guess-user-result_num" style="color:#ff7700;" >返回竞猜鱼丸</span>', "{{ /if }}", "{{ if ($value.ec<0) }}", '<span class="guess-user-result_num" style="color:#999;" >{{ $value.ec }}鱼丸</span>', "{{ /if }}", "</div>", "</div>", "{{ /each }}", '<div class="guess-user-knowBtn">我知道了</div>', "</div>", "</div>"),
						a = i.compile(t);
					return a(e)
				},
				noPass: function(e) {
					var t = d.string.join('<div class="guess-noPass">', '<div class="guess-noPass-close"></div>', '<div class="guess-noPass-title">提示</div>', '<div class="guess-noPass-content">{{ content }}</div>', '<div class="guess-noPass-knowBtnOut">', '<div class="guess-noPass-knowBtn">知道啦</div>', "</div>", "</div>"),
						a = i.compile(t);
					return a(e)
				},
				userSet: function(e) {
					var t = d.string.join('<div class="guess-userPermissions">', '<div class="guess-userPermissions-close guess-dialog-closeBtn"></div>', '<div class="guess-userPermissions-title">发起竞猜权限设置</div>', '<div class="guess-userPermissions-tip">', '<div class="guess-userPermissions-voice"></div>', '<div class="guess-userPermissions-move">', "<div>被勾选的用户将可以在您的直播间发起竞猜,主播可以专心直播啦</div>", "<div>用户发起的竞猜正常结束后，您也可以获得鱼丸抽成加热度</div>", "<div>若您需自己发起竞猜，可随时结束用户的竞猜，请提交正确结果</div>", "<div>请合理分配发起权限，若用户发起竞猜违规，将收回您的权限</div>", "</div>", "</div>", '<div class="guess-userPermissions-instructions">', '<div class="guess-userPermissions-instructionsTitle">权限设置说明</div>', '<div class="guess-userPermissions-instructionsOne">1</div>', '<div class="guess-userPermissions-instructionsTwo">2</div>', '<div class="guess-userPermissions-instructionsThree">3</div>', '<div class="guess-userPermissions-instructionsFour">4</div>', '<div class="guess-userPermissions-contentOne">被勾选的用户将可以在您的直播间发起竞猜,主播可以专心直播啦</div>', '<div class="guess-userPermissions-contentTwo">用户发起的竞猜正常结束后，您也可以获得鱼丸抽成加热度</div>', '<div class="guess-userPermissions-contentThree">若您需自己发起竞猜，可随时结束用户的竞猜，请提交正确结果</div>', '<div class="guess-userPermissions-contentFour">请合理分配发起权限，若用户发起竞猜违规，将收回您的权限</div>', "</div>", "{{ each pageIfShow as show }}", '{{ if (show=="management") }}', '<div class="guess-userPermissions-admin">', "{{ if (msg.management==0) }}", '<div class="guess-userPermissions-adminIf"></div>', "{{ /if }}", "{{ if (msg.management==1) }}", '<div class="guess-userPermissions-adminIf guess-userPermissions-adminIfSure"></div>', "{{ /if }}", '<div class="guess-userPermissions-name">房管</div>', "</div>", "{{ /if }}", '{{ if (show=="specific_users") }}', '<div class="guess-userPermissions-user">', '<div class="guess-userPermissions-userSet">', "{{ if (msg.specific_permission==0) }}", '<div class="guess-userPermissions-userIf"></div>', '<div class="guess-userPermissions-name">指定用户</div>', '<input class="guess-userPermissions-input" maxlength="50" disabled="disabled" onKeypress="return (event.which||event.keyCode) !=32" placeholder="请输入用户昵称" />', '<div class="guess-userPermissions-search">添加</div>', "{{ /if }}", "{{ if (msg.specific_permission==1) }}", '<div class="guess-userPermissions-userIf guess-userPermissions-userIfSure"></div>', '<div class="guess-userPermissions-name">指定用户</div>', '<input class="guess-userPermissions-input guess-userPermissions-inputYes" maxlength="50" onKeypress="return (event.which||event.keyCode) !=32" placeholder="请输入用户昵称" />', '<div class="guess-userPermissions-search guess-userPermissions-searchYes">添加</div>', "{{ /if }}", "</div>", '<div class="guess-userPermissions-list">', "{{ if (msg.specific_user.length==0) }}", "最多指定8个用户哦", "{{ /if }}", "{{ if (msg.specific_user.length!=0) }}", "{{ each msg.specific_user }}", '<div class="guess-userPermissions-userOne title="{{ $value.nickname }}">', '<div class="guess-userPermissions-userOne-close"></div>', '<img class="guess-userPermissions-userPic" title="{{ $value.nickname }}" src="{{ $value.icon }}" />', '<div class="guess-userPermissions-username" title="{{ $value.nickname }}">{{ $value.nickname }}</div>', "</div>", "{{ /each }}", "{{ /if }}", "</div>", '<div class="guess-userPermissions-cover"></div>', "</div>", "{{ /if }}", "{{ /each }}", '<div class="guess-userPermissions-knowBtnOut">', '<div class="guess-userPermissions-knowBtn">确　定</div>', "</div>", "</div>"),
						a = i.compile(t);
					return a(e)
				},
				userSetAdd: function(e) {
					var t = d.string.join('<div class="guess-userPermissions-userOne" title="{{ data.nickname }}">', '<div class="guess-userPermissions-userOne-close"></div>', '<img class="guess-userPermissions-userPic" title="{{ data.nickname }}" src="{{ data.icon }}" />', '<div class="guess-userPermissions-username" title="{{ data.nickname }}">{{ data.nickname }}</div>', "</div>"),
						a = i.compile(t);
					return a(e)
				}
			},
			calcSilverFunc: function(e, t) {
				var a = +e,
					s = +t,
					i = +m.vars.mainMsg.quiz_setting.divided_rate;
				if (m.guessMainPanel.guessData.guessList.length > 0 && (i = 100 - Number(m.guessMainPanel.guessData.guessList[0].aktp)), a > 0) {
					var n = Math.floor(s / a * i / 100);
					return n
				}
				return !1
			},
			bindNoPassEvent: function() {
				e(".guess-noPass").on("click", function(t) {
					var a = e(t.target);
					(a.hasClass("guess-noPass-knowBtn") || a.hasClass("guess-noPass-close")) && e(".guess-noPass").remove()
				})
			},
			showNoPass: function(t) {
				var a = this.doms;
				if (!e(".guess-noPass").length) {
					var s = {
						content: t
					},
						i = this.render.noPass(s);
					a.$noPass = e(i), e("body").append(a.$noPass), this.bindNoPassEvent(), a.$noPass.show()
				}
			},
			removeSome: function() {
				e(".guess-tip-dealer").length && e(".guess-tip-dealer").remove(), e(".guess-tip-betting-total").length && e(".guess-tip-betting-total").remove()
			},
			overMyfishBetting: function(t) {
				var a = this;
				this.cacheDealerDoms();
				var s = a.doms,
					i = a.vars,
					n = 1 * s.$odds_value.html(),
					r = 1 * s.$Betting_yours.val(),
					o = 1 * s.$Betting_fishBall.html(),
					d = 1 * e(".guess-tip-betting").attr("data-balance"),
					c = d > o ? o : d,
					l = m.vars.mainMsg.quiz_setting.divided_rate / 100;
				if (m.guessMainPanel.guessData.guessList.length > 0 && (l = (100 - Number(m.guessMainPanel.guessData.guessList[0].aktp)) / 100), r > 0 && r % 1 == 0 && c >= r) i.Betting_now = r, e(".guess-tip-betting-clear").show(), s.$Betting_yours.css("font-size", "18px"), s.$Betting_yours.css("font-weight", "bold");
				else if (r > c) {
					s.$Betting_yours.val(c);
					var g = e(".guess-tip-betting-over");
					g.stop(!0), g.animate({
						opacity: 1
					}, 500), setTimeout(function() {
						g.animate({
							opacity: 0
						}, 500)
					}, 2e3), r = c
				} else 0 == r ? (s.$Betting_yours.val(""), s.$Betting_yours.css("font-size", "14px"), s.$Betting_yours.css("font-weight", ""), e(".guess-tip-betting-clear").hide()) : (s.$Betting_yours.val(i.Betting_now), r = i.Betting_now);
				a.updateWinValue(r, n, t)
			},
			inputAnimate: function() {
				var t = e(".guess-tip-betting-input input");
				t.stop(!0), t.val(""), t.css("font-size", "14px"), t.css("font-weight", ""), t.focus(), t.animate({
					marginLeft: -20
				}, 100, "easeOutBounce"), t.animate({
					marginLeft: 20
				}, 100, "swing"), t.animate({
					marginLeft: -8
				}, 100, "easeOutBounce"), t.animate({
					marginLeft: 8
				}, 100, "swing"), t.animate({
					marginLeft: 0
				}, 100, "swing")
			},
			updateWinValue: function(e, t, a) {
				var s = m.vars.mainMsg.quiz_setting.divided_rate / 100;
				2 == a ? s = 1 : m.guessMainPanel.guessData.guessList.length > 0 && (s = (100 - Number(m.guessMainPanel.guessData.guessList[0].aktp)) / 100);
				var i = Math.round(e * t * s * 100),
					n = parseInt(i / 100);
				this.doms.$win_value.html(n)
			},
			showBettingErrorMsg: function(t) {
				var a = e(".guess-tip-betting-over");
				a.stop(!0), a.animate({
					opacity: 0
				}, 10), e(".guess-tip-betting-error").html(t)
			},
			bindBettingEvent: function(t) {
				var a = this;
				this.cacheDealerDoms();
				var s = a.doms,
					i = a.vars,
					n = m.vars.activeGiftName;
				a.flag;
				i.Betting_now = null;
				var r = e(".guess-tip-betting").attr("data-guesstype");
				e(".guess-tip-betting").on("click", function(o) {
					var d = e(o.target);
					if (d.hasClass("closeBtn")) d.parents(".guess-tip-betting-total").remove();
					else if (d.hasClass("guess-tip-betting-clear")) e(".guess-tip-betting-input input").val(""), s.$Betting_yours.css("font-size", "14px"), s.$Betting_yours.css("font-weight", ""), s.$win_value.html(0), e(".guess-tip-betting-clear").hide();
					else if (d.hasClass("guess-tip-betting-num")) {
						a.showBettingErrorMsg("");
						var c = 1 * e(".guess-tip-betting-input input").val(),
							l = 1 * d.text();
						e(".guess-tip-betting-input input").val(c + l), e(".guess-tip-betting-clear").show(), a.overMyfishBetting(r);
						var u = 1 * d.parents(".guess-tip-betting").attr("data-balance"),
							p = d.html();
						"全部" == p && (u < s.$Betting_fishBall.html() ? s.$Betting_yours.val(u) : s.$Betting_yours.val(s.$Betting_fishBall.html())), s.$Betting_yours.css("font-size", "18px"), s.$Betting_yours.css("font-weight", "bold");
						var f = 1 * s.$odds_value.html(),
							h = 1 * s.$Betting_yours.val();
						a.updateWinValue(h, f, r)
					} else if (d.hasClass("guess-tip-betting-doneBtn")) {
						var u = d.parents(".guess-tip-betting").attr("data-balance"),
							v = d.parents(".guess-tip-betting").attr("data-min"),
							y = 1 * d.parents(".guess-tip-betting").find("input").val();
						if (!y) return a.showBettingErrorMsg("请输入投注数量"), void a.inputAnimate();
						if (v > y) return a.showBettingErrorMsg("最少投注" + v + "鱼丸"), void a.inputAnimate();
						if (y > u) return a.showBettingErrorMsg.html("最多投注" + u + "鱼丸"), void a.inputAnimate();
						var b = {
							room_id: i.roomId,
							quiz_id: d.parents(".guess-tip-betting").attr("data-qid"),
							bet_amount: y
						},
							k = d.parents(".guess-tip-betting").data("option");
						1 == r ? b.banker_id = d.parents(".guess-tip-betting").attr("data-bankerid") : b.option = k;
						var _ = 1 * d.parents(".guess-tip-betting").attr("data-join"),
							w = _ ? y + _ : y;
						g.sendAjax({
							url: 1 == r ? "/member/quiz/user_bet" : " /member/quiz/simple_bet",
							type: "POST",
							data: b,
							success: function(s) {
								switch (s.error) {
								case 0:
									0 != s.data.ndsdprop ? s.data.real_bet_amount < b.bet_amount ? e.dialog.tips_black("投注成功" + s.data.real_bet_amount + "鱼丸，获得" + s.data.ndsdprop + "个" + n) : e.dialog.tips_black("投注成功，获得" + s.data.ndsdprop + "个" + n) : s.data.real_bet_amount < b.bet_amount && e.dialog.tips_black("投注成功" + s.data.real_bet_amount + "鱼丸"), e(".guess-tip-betting-total").remove(), t(s.data.real_bet_amount || b.bet_amount), g.triggerSilverChange(s.data.balance), m.guessMainPanel.saveJoinToPool(b.quiz_id, k, !0, w), m.guessMainPanel.handleUserJoinPool(m.guessMainPanel.guessData.userJoinPool, !1);
									break;
								case -1:
									e.dialog.tips_black(s.msg);
									break;
								case 283:
									a.showBettingErrorMsg("鱼丸不足！"), g.triggerSilverChange(s.data.balance), e(".guess-tip-betting-input input").focus();
									break;
								case 514006:
									e.dialog.tips_black("投注失败，竞猜不存在！"), e(".guess-tip-betting-total").remove();
									break;
								case 514007:
									e.dialog.tips_black("投注失败，竞猜已封盘！"), e(".guess-tip-betting-total").remove();
									break;
								case 514008:
									e.dialog.tips_black("投注失败，竞猜已结束！"), e(".guess-tip-betting-total").remove();
									break;
								case 514009:
									e.dialog.tips_black("投注失败，开猜不存在！"), e(".guess-tip-betting-total").remove();
									break;
								case 514010:
									if (a.showBettingErrorMsg("赔率发生变化，请重新投注"), s.data.banker_id > 0) {
										var i = (s.data.loss_per_cent / 100).toFixed(1);
										e(".guess-tip-betting").attr("data-balance", s.data.max_count), e(".guess-tip-betting-pools span").text(s.data.max_count), e(".guess-tip-betting").attr("data-bankerid", s.data.banker_id), e(".guess-tip-betting-msgOdds span").html(i);
										var o = e(".guess-tip-betting-input input");
										o.stop(!0), o.animate({
											marginLeft: -20
										}, 100, "easeOutBounce"), o.animate({
											marginLeft: 20
										}, 100, "swing"), o.animate({
											marginLeft: -8
										}, 100, "easeOutBounce"), o.animate({
											marginLeft: 8
										}, 100, "swing"), o.animate({
											marginLeft: 0
										}, 100, "swing"), s.data.max_count > b.bet_amount ? o.val(b.bet_amount) : o.val(s.data.max_count), a.updateWinValue(o.val(), i, r)
									} else e(".guess-tip-betting-total").remove(), e.dialog.tips_black("资金池被买光了")
								}
								g.dys({
									key: "dys.room.guess-game.surebetting",
									stat: 0 == s.error ? 1 : 2,
									type: r,
									num: b.bet_amount,
									em: s.error
								})
							}
						})
					}
				}), s.$Betting_yours.on("change keydown keyup keypress", function() {
					a.overMyfishBetting(r)
				})
			},
			showBetting: function(t, a, s) {
				var i = this.doms,
					n = (this.vars, m.vars.mainMsg.quiz_setting.max_bet_gold),
					r = a.leaves > n ? n : a.leaves,
					o = m.vars.mainMsg.quiz_setting.min_bet_gold;
				"easy" == a.guessType && (r = m.vars.mainMsg.quiz_setting.max_simple_bet_gold, o = m.vars.mainMsg.quiz_setting.min_simple_bet_gold);
				var d = {
					betting_choice: m.vars.mainMsg.quiz_setting,
					guessType: "easy" == a.guessType ? 2 : 1,
					odds: a.odds,
					qid: a.qid,
					sbid: a.sbid,
					leaves: r,
					min: o,
					option: "left" == a.leftOrRight ? 1 : 2,
					joinnum: a.joinnum,
					betAmount: "easy" == a.guessType ? m.vars.mainMsg.quiz_setting.simple_bet_amount : m.vars.mainMsg.quiz_setting.bet_amount
				};
				this.removeSome();
				var c = this.render.betting(d);
				i.$betting = e(c), t.append(i.$betting), this.bindBettingEvent(s), i.$betting.show(), "right" == a.leftOrRight ? t.find(".guess-tip-betting-part").css("left", "310px") : "left" == a.leftOrRight && t.find(".guess-tip-betting-part").css("left", "45px")
			},
			hasChooseOdds: function() {
				var t, a = this,
					s = a.doms,
					i = e(".guess-tip-dealer-odds_out").find(".dealer_active"),
					n = +s.$odds_yours.val();
				return t = 0 === n && 0 === i.length ? 0 : n > 0 ? n : +i.text()
			},
			hasChoosePrincipal: function() {
				var t, a = this,
					s = a.doms,
					i = e(".guess-tip-dealer-DeJin_out").find(".dealer_active"),
					n = i.text(),
					r = s.$DeJin_yours.val();
				return r ? t = +r : "全部" !== n ? t = +n : "全部" === n && (t = s.$Dealer_myFishBall.text()), t
			},
			calcSilver: function() {
				var e = this,
					t = e.doms,
					a = e.hasChoosePrincipal(),
					s = e.hasChooseOdds();
				if (s > 0) {
					var i = e.calcSilverFunc(s, a);
					t.$Dealer.find(".expectFishBall").text(i)
				}
			},
			clearScrollTimer: function() {
				var e = this;
				e.scrollTimer && clearInterval(e.scrollTimer)
			},
			bindHistoryEvent: function() {
				var t = this;
				this.cacheDealerDoms();
				var a = t.doms;
				t.vars;
				e(".guess-tip-dealer").on("click", function(s) {
					var i = e(s.target);
					if (i.hasClass("guess-tip-dealer-odds_historyOne")) {
						var n = i.text();
						a.$odds_yours.val(n), t.calcSilver(), e(".guess-tip-dealer-odds_history").hide()
					} else i.hasClass("history-closeBtn") && e(".guess-tip-dealer-odds_history").hide()
				}), e(".guess-tip-dealer-freedom_DeJin").focus(function() {
					e(".guess-tip-dealer-odds_history").hide()
				})
			},
			OddHistory: function() {
				var t = this.doms,
					a = n.get("oddHistory") || "";
				if (a) {
					if (e(".guess-tip-dealer-odds_history").length) return void e(".guess-tip-dealer-odds_history").show();
					var s = {
						data: a
					},
						i = this.render.beforeOdds(s);
					t.$History = e(i), e(".guess-tip-dealer").append(t.$History), this.bindHistoryEvent(), t.$History.show()
				}
			},
			oddsSorting: function(e) {
				var t = n.get("oddHistory") || [],
					a = (1 * e).toFixed(1);
				t.unshift(a);
				for (var s = [], i = [], r = !0, o = 0; o < t.length; o++) {
					for (var d = 0; d < s.length; d++) t[o] == s[d] && (r = !1);
					r && s.push(t[o]), r = !0
				}
				for (var c = 0; c < s.length; c++) 9 > c && s[c] > 0 && i.push(s[c]);
				n.set("oddHistory", i)
			},
			trueOdds: function(t) {
				var a = e(".guess-tip-dealer").attr("data-qid"),
					s = null,
					i = null;
				return e(".guess-game-box").each(function(t, i) {
					e(i).attr("data-qid") == a && (s = e(i))
				}), 1 == t ? (i = 1 * s.find(".item-right").attr("data-loss"), 9.9 > i && (i += .1)) : 2 == t && (i = 1 * s.find(".item-left").attr("data-loss"), 9.9 > i && (i += .1)), i.toFixed(1)
			},
			overMyfishDealer: function() {
				var t = this,
					a = t.vars,
					s = 1 * e(".guess-tip-dealer-freedom_DeJin").val(),
					i = e(".fishBall_NUM").html();
				if (s >= 0 && i >= s && s % 1 == 0) a.DeJin_now = s, e(".guess-tip-dealer-clear").show();
				else if (s > i) {
					e(".guess-tip-dealer-clear").show(), t.doms.$DeJin_yours.val(i);
					var n = e(".guess-tip-dealer-over");
					n.stop(!0), n.animate({
						opacity: 1
					}, 500), setTimeout(function() {
						n.animate({
							opacity: 0
						}, 500)
					}, 2e3)
				} else t.doms.$DeJin_yours.val(a.DeJin_now);
				0 == s && (t.doms.$DeJin_yours.val(""), e(".guess-tip-dealer-clear").hide())
			},
			DealerSure: function(t) {
				var a = this.doms;
				if (!e(".guess-dealer-remember").length) {
					var s = this.render.dealerSure();
					a.$makeSure = e(s), e("body").append(a.$makeSure), this.bindSureEvent(t)
				}
			},
			bindSureEvent: function(t) {
				var a = this;
				e(".guess-dealer-remember-false").on("click", function() {
					e(".guess-dealer-remember-out").remove()
				}), e(".guess-dealer-remember-sure").on("click", function() {
					e(".guess-dealer-remember-input").get(0).checked && n.set("sureDealer", 1), a.dealerAjax(t), e(".guess-dealer-remember-out").remove()
				})
			},
			dealerAjax: function(t) {
				var a = this,
					s = a.doms,
					i = (a.vars, m.vars.activeGiftName);
				g.sendAjax({
					url: "/member/quiz/become_banker",
					type: "POST",
					data: t,
					success: function(n) {
						switch (n.error) {
						case 0:
							0 == n.data.ndsdprop ? e.dialog.tips_black("开猜成功！") : e.dialog.tips_black("开猜成功，获得" + n.data.ndsdprop + "个" + i), a.oddsSorting(s.$odds_yours.val()), s.$dealer.remove(), g.triggerSilverChange(n.data.balance), m.guessMainPanel.saveJoinToPool(t.quiz_id, t.option, !0), m.guessMainPanel.handleUserJoinPool(m.guessMainPanel.guessData.userJoinPool, !1);
							break;
						case -1:
							e.dialog.tips_black(n.msg);
							break;
						case 283:
							e.dialog.tips_black("鱼丸不足！"), g.triggerSilverChange(n.data.balance), e(".guess-tip-dealer-my_fishBall_num").html(n.data.balance);
							break;
						case 514006:
							e.dialog.tips_black("开猜失败，竞猜不存在！"), s.$dealer.remove();
							break;
						case 514007:
							e.dialog.tips_black("开猜失败，竞猜已封盘！"), s.$dealer.remove();
							break;
						case 514008:
							e.dialog.tips_black("开猜失败，竞猜已结束！"), s.$dealer.remove();
							break;
						case 514015:
							e.dialog.tips_black("正在开猜中，请勿重复操作")
						}
						0 == n.error ? g.dys({
							key: "dys.room.guess-game.suredealer",
							stat: 1,
							odd: t.loss_per_cent,
							cost: t.amount
						}) : g.dys({
							key: "dys.room.guess-game.suredealer",
							stat: 2,
							odd: t.loss_per_cent,
							cost: t.amount
						})
					}
				})
			},
			chooseNotice: function(e) {
				var t = this,
					a = t.doms,
					s = "若竞猜结果为【" + e + "】，则您获胜";
				a.$chooseNotice.text(s).show()
			},
			bindDealerEvent: function() {
				e(".guess-tip-dealer").hide();
				var t = this;
				this.cacheDealerDoms();
				var a, s = t.doms,
					i = t.vars;
				t.flag;
				i.odds_now = null, i.DeJin_now = null;
				var r = e(".guess-tip-dealer");
				r.mousedown(function(t) {
					var a = t || event,
						s = e(a.target);
					if (!s.hasClass("guess-tip-dealer-freedom_odds") && !s.hasClass("guess-tip-dealer-freedom_DeJin")) {
						var i = a.clientX - r.position().left,
							n = a.clientY - r.position().top;
						r.mousemove(function(t) {
							var a = t.clientX,
								s = t.clientY,
								o = s - n,
								d = a - i,
								c = e(window).width(),
								l = e(window).height();
							0 > o ? o = 0 : o > l && (o = l), 0 > d ? d = 0 : d > c && (d = c), r.css({
								top: o,
								left: d
							})
						})
					}
				}), r.mouseup(function() {
					e(this).unbind("mousemove")
				}), e(".guess-tip-dealer").on("mouseover", function(t) {
					var a = e(t.target);
					a.hasClass("dealer_active") || (a.hasClass("guess-tip-dealer-choose_one") || a.hasClass("guess-tip-dealer-choose_two") || a.hasClass("guess-tip-dealer-odds_num") || a.hasClass("guess-tip-dealer-DeJin_num")) && a.addClass("dealer_hover")
				}), e(".guess-tip-dealer-freedom_odds").focus(function() {
					t.OddHistory()
				}), e(".guess-tip-dealer-freedom_odds").blur(function() {
					setTimeout(function() {
						e(".guess-tip-dealer-odds_history").hide()
					}, 300)
				}), e(".guess-tip-dealer").on("mouseout", function(t) {
					var a = e(t.target);
					a.hasClass("dealer_active") || (a.hasClass("guess-tip-dealer-choose_one") || a.hasClass("guess-tip-dealer-choose_two") || a.hasClass("guess-tip-dealer-odds_num") || a.hasClass("guess-tip-dealer-DeJin_num")) && a.removeClass("dealer_hover")
				}), e(".guess-tip-dealer-DeJin_num").on("mousedown", function() {
					e(this).removeClass("dealer_hover"), e(this).addClass("dealer_active")
				}), e(".guess-tip-dealer-DeJin_num").on("mouseup", function() {
					e(this).removeClass("dealer_active"), e(this).addClass("dealer_hover")
				}), e(".guess-tip-dealer").on("click", function(r) {
					var o = e(r.target);
					if (o.hasClass("closeBtn")) s.$dealer.hide(), t.clearScrollTimer();
					else if (o.hasClass("guess-tip-dealer-choose_one")) {
						s.$chooseFalse.removeClass("dealer_active"), s.$chooseTrue.addClass("dealer_active"), s.$chooseTrue.removeClass("dealer_hover");
						var d = s.$chooseTrue.text();
						t.chooseNotice(d), s.$odds_yours.val(t.trueOdds(1)), t.calcSilver()
					} else if (o.hasClass("guess-tip-dealer-choose_two")) {
						s.$chooseTrue.removeClass("dealer_active"), s.$chooseFalse.addClass("dealer_active"), s.$chooseFalse.removeClass("dealer_hover");
						var d = s.$chooseFalse.text();
						t.chooseNotice(d), s.$odds_yours.val(t.trueOdds(2)), t.calcSilver()
					} else if (o.hasClass("guess-tip-dealer-DeJin_num")) {
						var c = 1 * s.$DeJin_yours.val(),
							l = 1 * o.text();
						s.$DeJin_yours.val(c + l), t.overMyfishDealer(), t.calcSilver()
					} else if (o.hasClass("guess-tip-dealer-clear")) e(".guess-tip-dealer-freedom_DeJin").val(""), t.calcSilver(), e(".guess-tip-dealer-clear").hide();
					else if (o.hasClass("guess-tip-dealer-sureBtn")) {
						if (!e(".guess-tip-dealer").find(".guess-tip-dealer-choose_out .dealer_active").length) return void e.dialog.tips_black("请选择你认为的胜方");
						var g, u, p = e(".guess-tip-dealer-DeJin_out .dealer_active").html(),
							f = e(".guess-tip-dealer-odds_out .dealer_active").html(),
							h = m.vars.mainMsg.quiz_setting.min_base_gold,
							v = m.vars.mainMsg.quiz_setting.max_base_gold;
						if (0 == +s.$odds_yours.val() && !e(".guess-tip-dealer-odds_out .dealer_active").length) return void e.dialog.tips_black("赔率不能为0");
						if (g = s.$odds_yours.val() > 0 ? 100 * s.$odds_yours.val() : 100 * f, s.$DeJin_yours.val()) {
							if (+s.$DeJin_yours.val() < h) return void e.dialog.tips_black("底金最少为" + h);
							if (+s.$DeJin_yours.val() > v) return void e.dialog.tips_black("底金最多为" + v);
							u = 1 * s.$DeJin_yours.val()
						} else {
							if ("全部" != p) return void e.dialog.tips_black("请输入您的底金");
							u = s.$Dealer_myFishBall.html()
						}
						a = e(".guess-tip-dealer").find(".guess-tip-dealer-choose_out .dealer_active").attr("data-chooseNum");
						var y = {
							room_id: i.roomId,
							quiz_id: s.$dealer.attr("data-qid"),
							option: a,
							amount: u,
							loss_per_cent: 1 * g.toFixed(0)
						},
							b = n.get("sureDealer") || "";
						if (!b) return void t.DealerSure(y);
						t.dealerAjax(y)
					}
				}), s.$Dealer_helper.hover(function() {
					s.$Dealer_helper_content.show()
				}, function() {
					s.$Dealer_helper_content.hide()
				}), s.$odds_yours.on("change keydown", function(e) {
					function t(e) {
						return e >= 48 && 57 >= e ? !0 : e >= 96 && 105 >= e ? !0 : 8 == e
					}
					var a = e.which || e.keyCode;
					return t(a) ? void 0 : !1
				}), s.$odds_yours.on("change keydown keyup keypress", function(e) {
					var t = e.which || e.keyCode,
						a = 1 * this.value,
						n = s.$odds_yours.val().length;
					1 == n && 8 != t && (a += ".", s.$odds_yours.val(a)), 1 == n && 8 == t && s.$odds_yours.val(""), n && s.$odds_choose.removeClass("dealer_active"), a >= 0 && 10 > a && 10 * a % 1 == 0 ? (s.$odds_choose.removeClass("dealer_active"), i.odds_now = a) : n ? s.$odds_yours.val("") : i.odds_now = a
				}), s.$odds_yours.on("change keyup keypress", function() {
					t.calcSilver()
				}), s.$DeJin_yours.on("change keydown keyup keypress", function() {
					t.overMyfishDealer()
				}), s.$DeJin_yours.on("change keyup keypress", function() {
					t.calcSilver()
				})
			},
			scrollRules: function() {
				function e(a) {
					var i;
					if (a) i = 5e3;
					else {
						var n = s.scrollTop();
						n >= r ? s.scrollTop(0) : (n++, s.scrollTop(n)), i = n % 18 ? 10 : 5e3
					}
					t.clearScrollTimer(), t.scrollTimer = setTimeout(e, i)
				}
				var t = this,
					a = t.doms,
					s = a.$Dealer.find(".scrollBox"),
					i = a.$Dealer.find(".J-scrollBody1"),
					n = a.$Dealer.find(".J-scrollBody2"),
					r = i.height();
				n.html(i.html()), e(!0)
			},
			showDealer: function(t) {
				var a = this.doms,
					s = {
						sureMsg: m.vars.mainMsg.quiz_setting,
						changeMsg: t
					};
				this.removeSome();
				var i = this.render.dealer(s);
				a.$dealer = e(i), e("body").append(a.$dealer), this.bindDealerEvent(), a.$dealer.show(), this.scrollRules()
			},
			showSetting: function() {
				var t = this.doms,
					a = this.vars,
					s = this;
				e(".guess-setting-have").length && e(".guess-setting-have").remove(), e(".guess-setting-edit").length && e(".guess-setting-edit").remove(), g.sendAjax({
					url: g.isAnchor() ? "/member/quiz/get_quiz_list" : "/member/quiz/user_get_quiz_list",
					type: "GET",
					data: g.isAnchor() ? {
						t: (new Date).getTime()
					} : {
						room_id: a.roomId,
						t: (new Date).getTime()
					},
					success: function(a) {
						if (0 == a.data.length) v.init();
						else {
							var i = s.render.setting_have(a.data);
							t.$setting_have = e(i), e("body").append(t.$setting_have), s.showHistory(), s.bindSettingHaveEvent(), t.$setting_have.show(), s.showSettingFirstGuide()
						}
					}
				})
			},
			showSettingFirstGuide: function() {
				var t = JSON.parse(n.get("ifshowSettingFirstGuideNote"));
				t || (e(".guess-setting-firstGuide").show(), n.set("ifshowSettingFirstGuideNote", JSON.stringify(!0)), e(".guess-setting-firstGuide").find(".firstGuideClose").on("click", function(t) {
					e(".guess-setting-firstGuide").hide()
				}))
			},
			collectId: function() {
				var t = [];
				return e(".guess-setting_one-sureYes").each(function(a, s) {
					var i = e(s).parents(".guess-setting_one").attr("data-titleId");
					t.push(i)
				}), t
			},
			showHistory: function() {
				var t = this.vars.titleHistory;
				e(".guess-setting_one").each(function(a, s) {
					for (var i = 0; i < t.length; i++) t[i] == e(s).attr("data-titleId") && e(s).find(".guess-setting_one-sure").addClass("guess-setting_one-sureYes")
				}), this.guessThemeModeSwitch(m.guessTheme.mode), e(".J-guess-setting-mode" + m.guessTheme.mode).find(".guessMode").addClass("active")
			},
			guessThemeModeSwitch: function(t) {
				m.guessTheme.mode = t;
				var a = e(".guess-setting_one-sureYes");
				this.vars.title_num > 0 && a.each(function(a, s) {
					var i = e(s).parents(".guess-setting_one").find(".guess-setting_one-error"),
						n = e(s).parents(".guess-setting_one").attr("data-limit-time");
					i.removeClass("disable"), 2 == t && 0 >= n ? (i.text("自动赔率模式必须设置封盘时间"), i.addClass("disable")) : i.text("")
				})
			},
			bindSettingHaveEvent: function() {
				var t = this;
				this.cacheDealerDoms();
				var a = (t.doms, t.vars);
				a.title_num = e(".guess-setting_one-sureYes").length, e(".guess-setting-have-ask-num").text(this.vars.title_num), e(".guess-setting-have-main").mCustomScrollbar(), e(".guess-setting-have").on("click", function(s) {
					var i = e(s.target);
					if (i.hasClass("guess-setting-have-close")) e(".guess-setting-have").remove();
					else if (i.hasClass("ableEdit")) {
						var n = i.parents(".guess-setting_one").attr("data-titleId"),
							r = i.parents(".guess-setting_one").attr("data-limit-time"),
							o = i.parents(".guess-setting_one").find(".guess-setting_one-title").text(),
							d = i.parents(".guess-setting_one").find(".guess-setting_one-chooseOne").text(),
							c = i.parents(".guess-setting_one").find(".guess-setting_one-chooseTwo").text();
						a.titleHistory = t.collectId(), e(".guess-setting-have").hide(), t.Setting_add(2), e(".guess-setting-edit").attr("data-titleId", n), e(".guess-setting-edit-editTitle").val(o), e(".guess-setting-edit-chooseOne").val(d), e(".guess-setting-edit-chooseTwo").val(c), e(".guess-setting-edit-time").each(function(t, a) {
							e(a).removeClass("guess-setting-edit-timeActive"), e(a).attr("data-limit-time") == r && e(a).addClass("guess-setting-edit-timeActive")
						})
					} else if (i.hasClass("gusssThemeAdd")) {
						if (10 == e(".guess-setting_one").length) return void e.dialog.tips_black("最多添加10个主题~");
						a.titleHistory = t.collectId(), e(".guess-setting-have").hide(), t.Setting_add(1)
					} else if (i.hasClass("guess-setting_one-close")) g.sendAjax({
						url: g.isAnchor() ? "/member/quiz/del_quiz" : "/member/quiz/user_del_quiz",
						type: "POST",
						data: g.isAnchor() ? {
							quize_id: i.parents(".guess-setting_one").attr("data-titleId")
						} : {
							room_id: a.roomId,
							quize_id: i.parents(".guess-setting_one").attr("data-titleId")
						},
						success: function(s) {
							if (0 == s.error) {
								var n = i.parents(".guess-setting_one").find(".guess-setting_one-sureYes").length;
								a.title_num = a.title_num - n, e(".guess-setting-have-ask-num").html(a.title_num), i.parents(".guess-setting_one").remove(), e(".guess-setting_one").length || (e(".guess-setting-have").remove(), t.showSetting())
							} else e.dialog.tips_black(s.msg)
						}
					});
					else if (i.hasClass("guess-setting-have-knowBtn")) {
						if (!a.title_num) return void e.dialog.tips_black("请勾选竞猜主题");
						if (e(this).find(".guess-setting_one-error.disable").length > 0) return void e.dialog.tips_black("自动赔率模式必须设置封盘时间");
						var l = t.collectId();
						g.dys({
							key: "dys.room.guess-game.anchor.create",
							is_anch: g.isAnchor() ? 1 : 0,
							type: m.guessTheme.mode
						}), g.sendAjax({
							url: g.isAnchor() ? "/member/quiz/start_quiz_v2" : "/member/quiz/user_start_quiz",
							type: "POST",
							data: g.isAnchor() ? {
								play_type: m.guessTheme.mode,
								quize_ids: l
							} : {
								play_type: m.guessTheme.mode,
								room_id: a.roomId,
								quize_ids: l
							},
							success: function(s) {
								0 == s.error ? (g.dys({
									key: "dys.room.guess-game.suresetting",
									is_anch: g.isAnchor() ? 1 : 0,
									stat: 1,
									num: l.length
								}), e.dialog.tips_black(s.msg), e(".guess-setting-have").remove(), a.titleHistory = l) : -1 == s.error ? (g.dys({
									key: "dys.room.guess-game.suresetting",
									is_anch: g.isAnchor() ? 1 : 0,
									stat: 2,
									num: l.length
								}), e.dialog.tips_black(s.msg), "number" == typeof s.data.index && e(".guess-setting_one-sureYes").each(function(t, i) {
									t == s.data.index && (e(i).removeClass("guess-setting_one-sureYes"), e(i).removeClass("guess-setting_one-sure"), e(i).addClass("guess-setting_one-false"), e(".guess-setting_one-error").length || e(i).parents(".guess-setting_one").append(e('<span class="guess-setting_one-error">' + s.msg + "</span>")), a.title_num--, e(".guess-setting-have-ask-num").html(a.title_num))
								})) : -2 == s.error && (g.dys({
									key: "dys.room.guess-game.suresetting",
									is_anch: g.isAnchor() ? 1 : 0,
									stat: 2,
									num: l.length
								}), e(".guess-setting-have").remove(), t.showNoPass(s.msg))
							}
						})
					}
				}), e(".J-guess-setting-mode1").on("click", function(a) {
					e(".J-guess-setting-mode1").find(".guessMode").addClass("active"), e(".J-guess-setting-mode2").find(".guessMode").removeClass("active"), e(".guess-setting-have").removeClass("guess-themeBox-modeEasy"), t.guessThemeModeSwitch(1)
				}), e(".J-guess-setting-mode2").on("click", function(a) {
					e(".J-guess-setting-mode2").find(".guessMode").addClass("active"), e(".J-guess-setting-mode1").find(".guessMode").removeClass("active"), e(".guess-setting-have").addClass("guess-themeBox-modeEasy"), t.guessThemeModeSwitch(2)
				}), e(".guess-setting_one").on("click", function(s) {
					var i = e(s.target);
					if (!i.hasClass("guess-setting_one-close") && !i.hasClass("guess-setting_one-change") && 1 != e(this).find(".guess-setting_one-false").length) if (e(this).find(".guess-setting_one-sureYes").length) e(this).find(".guess-setting_one-sure").removeClass("guess-setting_one-sureYes"), a.title_num--, e(".guess-setting-have-ask-num").html(a.title_num), e(this).find(".guess-setting_one-error").removeClass("disable").text(""), a.titleHistory = t.collectId();
					else {
						if (3 == a.title_num) return void e.dialog.tips_black("最多只能同时发布3个主题哦~");
						if (2 == m.guessTheme.mode) {
							var n = e(this).attr("data-limit-time");
							if (0 >= n) return void e.dialog.tips_black("自动赔率模式需要设置封盘时间")
						}
						e(this).find(".guess-setting_one-sure").addClass("guess-setting_one-sureYes"), a.title_num++, e(".guess-setting-have-ask-num").html(a.title_num), a.titleHistory = t.collectId()
					}
				})
			},
			Setting_add: function(t) {
				g.dys({
					key: "dys.room.guess-game.addTitle",
					is_anch: g.isAnchor() ? 1 : 0
				});
				var a = this.doms,
					s = {
						num: this.vars.title_num,
						time_choose: m.vars.mainMsg.quiz_setting,
						type: 1 == t ? "添加" : "编辑"
					},
					i = this.render.setting_add(s);
				a.$settingAdd = e(i), e("body").append(a.$settingAdd), this.bindSettingAddEvent(), a.$settingAdd.show()
			},
			bindSettingAddEvent: function() {
				var t = this;
				this.cacheDealerDoms();
				var a = (t.doms, t.vars);
				e(".guess-setting-edit-editTitle").on("change keydown keyup keypress", function() {
					"" != e(this).val() && (e(this).removeClass("guess-setting-edit-error"), e(".guess-setting-edit-errMsg").html(""))
				}), e(".J-guess-setting-editCheck").on("change keydown keyup keypress", function() {
					"" != e(this).val() && (e(".guess-setting-edit-chooseOne").removeClass("guess-setting-edit-error"), e(".guess-setting-edit-chooseTwo").removeClass("guess-setting-edit-error"), e(".guess-setting-edit-errMsg").html(""))
				}), e(".guess-setting-edit").on("click", function(s) {
					var i = e(s.target);
					if (i.hasClass("editClose")) e(".guess-setting-edit").remove();
					else if (i.hasClass("editBack")) e(".guess-setting-edit").remove(), e(".guess-setting-have").show();
					else if (i.hasClass("guess-setting-edit-time")) i.hasClass("guess-setting-edit-timeActive") ? i.removeClass("guess-setting-edit-timeActive") : (e(".guess-setting-edit-time").removeClass("guess-setting-edit-timeActive"), i.addClass("guess-setting-edit-timeActive"));
					else if (i.hasClass("guess-setting-edit-knowBtn")) {
						var n = t.checkIfAdd(),
							r = e(".guess-setting-edit").attr("data-titleId");
						if (!n) return;
						var o = {
							quize_theme: n.quize_theme,
							first_option_name: n.first_option_name,
							second_option_name: n.second_option_name,
							stop_timestamp: n.stop_timestamp
						},
							d = g.isAnchor() ? "/member/quiz/edit_quiz" : "/member/quiz/user_edit_quiz",
							c = g.isAnchor() ? "/member/quiz/add_quiz" : "/member/quiz/user_add_quiz",
							l = r ? d : c;
						r && (o.quize_id = r), g.isAnchor() || (o.room_id = a.roomId), g.sendAjax({
							url: l,
							type: "POST",
							data: o,
							success: function(a) {
								if (0 == a.error) g.dys({
									key: "dys.room.guess-game.addSure",
									is_anch: g.isAnchor() ? 1 : 0
								}), e.dialog.tips_black("已提交审核，请等待1-2分钟~"), e(".guess-setting-edit").remove(), t.showSetting();
								else if (e(".guess-setting-edit-errMsg").html(a.msg), a.data.key) switch (a.data.key) {
								case "quize_theme":
									e(".guess-setting-edit-editTitle").addClass("guess-setting-edit-error");
									break;
								case "first_option_name":
									e(".guess-setting-edit-chooseOne").addClass("guess-setting-edit-error");
									break;
								case "second_option_name":
									e(".guess-setting-edit-chooseTwo").addClass("guess-setting-edit-error")
								}
							}
						})
					}
				})
			},
			checkIfAdd: function() {
				var t = null,
					a = e(".guess-setting-edit-editTitle").val(),
					s = e(".guess-setting-edit-chooseOne").val(),
					i = e(".guess-setting-edit-chooseTwo").val(),
					n = e(".guess-setting-edit-timeActive").attr("data-limit-time");
				if ("" == a && (e(".guess-setting-edit-editTitle").addClass("guess-setting-edit-error"), t = 0), "" == s && (e(".guess-setting-edit-chooseOne").addClass("guess-setting-edit-error"), t = 0), "" == i && (e(".guess-setting-edit-chooseTwo").addClass("guess-setting-edit-error"), t = 0), 0 == t) return e(".guess-setting-edit-errMsg").html("竞猜主题未填写完整"), !1;
				if (s == i) return e(".guess-setting-edit-chooseOne").addClass("guess-setting-edit-error"), e(".guess-setting-edit-chooseTwo").addClass("guess-setting-edit-error"), e(".guess-setting-edit-errMsg").html("选项不能相同"), !1;
				var r = {
					quize_theme: a,
					first_option_name: s,
					second_option_name: i,
					stop_timestamp: n
				};
				return r
			},
			submitResultNum: function() {
				var t = e("#guess-main-panel").find(".guess-game-box"),
					a = [];
				return t.each(function(t, s) {
					var i = e(s).find(".guess-game-box-theme").attr("data-qs");
					1 != +i && 2 != +i || a.push({
						title: e(s).attr("data-qt"),
						chooseOne: e(s).attr("data-fon"),
						chooseTwo: e(s).attr("data-son"),
						endTime: e(s).find(".et").text(),
						qid: e(s).attr("data-qid")
					})
				}), a
			},
			bindAncher_resultEvent: function() {
				var t = this;
				this.cacheDealerDoms();
				var a = t.doms,
					s = t.vars;
				t.flag;
				e(".ancher-result").on("click", function(i) {
					var n = e(i.target);
					if (n.hasClass("ancher-result-close3") || n.hasClass("ancher-knowBtn-false")) a.$ancher_result.hide();
					else if (n.hasClass("ancher-result_answer")) n.parent().children(".ancher-result_answer").removeClass("ancher-result_answer_active"), n.addClass("ancher-result_answer_active"), e(".ancher-result_answer_active").length == e(".ancher-result_one").length && e(".ancher-knowBtn-true").addClass("active");
					else if (n.hasClass("ancher-knowBtn-true")) {
						if (!n.hasClass("active")) return;
						g.dys({
							key: "dys.room.guess-game.resultEndSubmit",
							is_anch: g.isAnchor() ? 1 : 0
						});
						var r = g.isAnchor() ? {
							quize_data: t.submitResult(),
							play_type: n.attr("data-guesstype")
						} : {
							room_id: s.roomId,
							quize_data: t.submitResult(),
							play_type: n.attr("data-guesstype")
						},
							o = {
								part: t.submitResultSure()
							},
							d = t.render.anchor_resultSure(o);
						e.dy_dialog(d, {
							className: "shark-ui-confirm guessResult-sure",
							mask: !0,
							zIndex: 502,
							title: "请再次确认竞猜结果！",
							buttons: [{
								content: "返回",
								callback: function() {
									this.hide()
								}
							}, {
								content: "提交",
								callback: function() {
									var a = this;
									g.sendAjax({
										url: g.isAnchor() ? "/member/quiz/finish_quiz" : "/member/quiz/user_finish_quiz",
										type: "POST",
										data: r,
										success: function(s) {
											a.hide(), 0 == s.error ? (g.dys({
												key: "dys.room.guess-game.resultEnd",
												is_anch: g.isAnchor() ? 1 : 0
											}), e.dialog.tips_black(s.msg), e(".ancher-result").remove()) : -1 == s.error ? (e(".ancher-result").remove(), e.dialog.tips_black(s.msg)) : -2 == s.error && (e(".ancher-result").remove(), t.showNoPass(s.msg))
										}
									})
								}
							}]
						})
					}
				})
			},
			submitResult: function() {
				var t, a, s, i, n, r, o = e(".ancher-result_one").length,
					d = [];
				return e(".ancher-result_one").each(function(o, d) {
					0 == o ? (t = e(d).attr("data-qid"), i = e(d).find(".ancher-result_answer_active").attr("data-chooseId")) : 1 == o ? (a = e(d).attr("data-qid"), n = e(d).find(".ancher-result_answer_active").attr("data-chooseId")) : 2 == o && (s = e(d).attr("data-qid"), r = e(d).find(".ancher-result_answer_active").attr("data-chooseId"))
				}), 1 == o ? d = [{
					quize_id: t,
					option_type: i
				}] : 2 == o ? d = [{
					quize_id: t,
					option_type: i
				}, {
					quize_id: a,
					option_type: n
				}] : 3 == o && (d = [{
					quize_id: t,
					option_type: i
				}, {
					quize_id: a,
					option_type: n
				}, {
					quize_id: s,
					option_type: r
				}]), d
			},
			submitResultSure: function() {
				var t, a, s, i, n, r, o = e(".ancher-result_one").length,
					d = [];
				return e(".ancher-result_one").each(function(o, d) {
					0 == o ? (t = e(d).find(".ancher-result_title").html(), i = e(d).find(".ancher-result_answer_active").html()) : 1 == o ? (a = e(d).find(".ancher-result_title").html(), n = e(d).find(".ancher-result_answer_active").html()) : 2 == o && (s = e(d).find(".ancher-result_title").html(), r = e(d).find(".ancher-result_answer_active").html())
				}), 1 == o ? d = [{
					title: t,
					choose: i
				}] : 2 == o ? d = [{
					title: t,
					choose: i
				}, {
					title: a,
					choose: n
				}] : 3 == o && (d = [{
					title: t,
					choose: i
				}, {
					title: a,
					choose: n
				}, {
					title: s,
					choose: r
				}]), d
			},
			showAncherResult: function(t, a) {
				var s = this.doms;
				config = {
					part: t,
					guesstype: a
				}, s.$ancher_result && e(".ancher-result").remove();
				var i = this.render.ancher_result(config);
				s.$ancher_result = e(i), e("body").append(s.$ancher_result), this.bindAncher_resultEvent(), s.$ancher_result.show()
			},
			clearTimer: function() {
				var e = this;
				e.powerTimer && clearInterval(e.powerTimer)
			},
			addUser: function(t) {
				var a = (this.doms, this.render.userSetAdd(t));
				e(".guess-userPermissions-list").append(e(a))
			},
			powerMsg: function() {
				var t = null,
					a = null,
					s = [];
				t = e(".guess-userPermissions-adminIfSure").length ? 1 : 0, a = e(".guess-userPermissions-userIfSure").length ? 1 : 0, e(".guess-userPermissions-username").each(function(t, a) {
					s.push(e(a).text())
				});
				var i = {
					management: t,
					specific_permission: a,
					specific_users: s
				};
				return i
			},
			userNoRepeat: function() {
				var t = e(".guess-userPermissions-inputYes").val(),
					a = !1;
				return e(".guess-userPermissions-username").each(function(s, i) {
					e(i).text().toUpperCase() == t.toUpperCase() && (e.dialog.tips_black("用户已被添加在列表中"), a = !0)
				}), a
			},
			bindUserSetEvent: function() {
				var t = this,
					a = (t.doms, t.vars);
				a.user_num = e(".guess-userPermissions-userOne").length, e(".guess-userPermissions-tip").hover(function() {
					e(".guess-userPermissions-instructions").show()
				}, function() {
					e(".guess-userPermissions-instructions").hide()
				}), e(".guess-userPermissions-instructions").hover(function() {
					e(".guess-userPermissions-instructions").show()
				}, function() {
					e(".guess-userPermissions-instructions").hide()
				}), e(".guess-userPermissions").on("click", function(s) {
					var i = e(s.target);
					if (i.hasClass("guess-userPermissions-close")) e(".guess-userPermissions").remove(), t.clearTimer();
					else if (i.hasClass("guess-userPermissions-adminIf") && !i.hasClass("guess-userPermissions-adminIfSure")) i.addClass("guess-userPermissions-adminIfSure");
					else if (i.hasClass("guess-userPermissions-adminIf") && i.hasClass("guess-userPermissions-adminIfSure")) i.removeClass("guess-userPermissions-adminIfSure");
					else if (i.hasClass("guess-userPermissions-userIf") && !i.hasClass("guess-userPermissions-userIfSure")) i.addClass("guess-userPermissions-userIfSure"), e(".guess-userPermissions-input").addClass("guess-userPermissions-inputYes"), e(".guess-userPermissions-input").removeAttr("disabled"), e(".guess-userPermissions-search").addClass("guess-userPermissions-searchYes"), e(".guess-userPermissions-cover").hide();
					else if (i.hasClass("guess-userPermissions-userIf") && i.hasClass("guess-userPermissions-userIfSure")) i.removeClass("guess-userPermissions-userIfSure"), e(".guess-userPermissions-input").removeClass("guess-userPermissions-inputYes"), e(".guess-userPermissions-input").attr("disabled", "disabled"), e(".guess-userPermissions-search").removeClass("guess-userPermissions-searchYes"), e(".guess-userPermissions-cover").show();
					else if (i.hasClass("guess-userPermissions-searchYes")) if (a.user_num < 8) {
						if ("最多指定8个用户哦" == e(".guess-userPermissions-list").text() && e(".guess-userPermissions-list").text(""), t.userNoRepeat()) return;
						var n = e(".guess-userPermissions-inputYes").val();
						g.sendAjax({
							url: "/member/quiz/add_start_user",
							type: "POST",
							data: {
								specific_user: n
							},
							success: function(s) {
								0 == s.error ? (t.addUser(s), a.user_num++) : e.dialog.tips_black(s.msg), e(".guess-userPermissions-inputYes").focus(), e(".guess-userPermissions-inputYes").val("")
							}
						})
					} else e.dialog.tips_black("最多添加8个用户哦~");
					else if (i.hasClass("guess-userPermissions-userOne-close")) i.parents(".guess-userPermissions-userOne").remove(), a.user_num--, 0 == a.user_num && e(".guess-userPermissions-list").text("最多指定8个用户哦");
					else if (i.hasClass("guess-userPermissions-knowBtn")) {
						var r = t.powerMsg();
						g.sendAjax({
							url: "/member/quiz/edit_start_setting",
							type: "POST",
							data: r,
							success: function(a) {
								if (0 == a.error) {
									var s = t.powerPointMsg();
									g.dys({
										key: "dys.room.guess-game.powerSure",
										is_admin: s.admin,
										num: s.user
									}), e.dialog.tips_black("权限设置成功"), t.clearTimer(), e(".guess-userPermissions").remove()
								} else e.dialog.tips_black(a.msg)
							}
						})
					}
				})
			},
			powerPointMsg: function() {
				var t = null,
					a = null;
				return t = e(".guess-userPermissions-adminIfSure").length ? 1 : 0, a = e(".guess-userPermissions-userIfSure").length ? e(".guess-userPermissions-userOne").length : 0, config = {
					admin: t,
					user: a
				}
			},
			powerTimerEvent: function() {
				var t = this;
				t.clearTimer(), t.powerTimer = setInterval(function() {
					e(".guess-userPermissions-move").animate({
						top: "-26px"
					}), setTimeout(function() {
						e(".guess-userPermissions-move").css("top", "0px");
						var t = e(e(".guess-userPermissions-move").children("div")[0]).text();
						e(e(".guess-userPermissions-move").children("div")[0]).remove(), e(".guess-userPermissions-move").append("<div>" + t + "</div>")
					}, 1e3)
				}, 4e3)
			},
			showPowerSet: function() {
				var t = this.doms,
					a = (this.vars, this);
				e(".guess-userPermissions").length || g.sendAjax({
					url: "/member/quiz/get_start_setting",
					type: "POST",
					data: {
						room_id: a.vars.roomId,
						cate2_id: $ROOM.cate_id
					},
					success: function(s) {
						if (0 == s.error) {
							var i = {
								pageIfShow: m.guessMainPanel.data.authorityData.show_fild,
								msg: s.data
							},
								n = a.render.userSet(i);
							t.$userSet = e(n), e("body").append(t.$userSet), a.bindUserSetEvent(), a.powerTimerEvent(), s.data.specific_permission ? e(".guess-userPermissions-cover").hide() : e(".guess-userPermissions-cover").show()
						} else e.dialog.tips_black(s.msg)
					}
				})
			},
			bindUserResultEvent: function() {
				e(".guess-user-result").on("click", function(t) {
					var a = e(t.target);
					(a.hasClass("guess-user-knowBtn") || a.hasClass("guess-user-close3")) && e(".guess-user-result").hide()
				})
			},
			showUserResult: function(t) {
				var a = this.doms;
				config = {
					part: t
				}, a.$user_result && e(".guess-user-result").remove();
				var s = this.render.user_result(config);
				a.$user_result = e(s), e("body").append(a.$user_result), this.bindUserResultEvent(), a.$user_result.show()
			}
		};
	return o.reg("room_data_handler", function(t) {
		var a = s.decode(t).too();
		switch (a.type) {
		case "quiz_audit":
			e(".guess-setting_one").each(function(t, s) {
				e(s).attr("data-titleid") == a.qid && (1 == a.is_pass ? (e(s).removeClass("guess-setting-diabled"), e(s).find(".guess-setting_one-audit").removeClass("auditing"), e(s).find(".guess-setting_one-audit").removeClass("failAudit"), e(s).find(".guess-setting_one-change").addClass("ableEdit"), e(s).find(".guess-setting_one-error").text(""), e(s).find(".guess-setting_one-false").addClass("guess-setting_one-sure"), e(s).find(".guess-setting_one-false").removeClass("guess-setting_one-false")) : (e(s).addClass("guess-setting-diabled"), e(s).find(".guess-setting_one-audit").addClass("failAudit"), e(s).find(".guess-setting_one-change").addClass("ableEdit"), e(s).find(".guess-setting_one-audit").removeClass("guess-setting_one-auditYes"), e(s).find(".guess-setting_one-error").text(a.remark), e(s).find(".guess-setting_one-sure").length && (e(s).find(".guess-setting_one-sure").addClass("guess-setting_one-false"), e(s).find(".guess-setting_one-sure").removeClass("guess-setting_one-sure"))))
			})
		}
	}), t.on("room.activity.userinfo.actGuess", function(e) {
		p.flag.memberInfo = e, p.showMsgCenter()
	}), {
		Model: m,
		guessEntryAPP: p,
		guessSendGiftGuide: f,
		guessActive: h,
		guessThemeLaunch: y,
		guessPopup: b
	}
}), define("douyu/page/room/normal/mod/guess-game/guess-game-anchor-feedback", ["jquery", "shark/observer", "shark/util/template/2.0", "shark/util/lang/1.0", "douyu/context", "douyu/page/room/normal/mod/guess-game/guess-game-common"], function(e, t, a, s, i, n) {
	var r = {
		url: {
			submitFeedback: "/member/quiz/anchor_change_result"
		},
		doms: {},
		dataCache: {},
		render: {
			main: function(e) {
				var t = s.string.join('<div class="accountErrorFeedback">', '<div class="feedbackTitle">', "<span>结错账反馈</span>", '<div class="closeBtn"></div>', "</div>", '<div class="feedbackContent">', '<div class="row mt-10">', '<div class="col1">竞猜ID:</div>', '<div class="col2">{{qid}}</div>', "</div>", '<div class="row mt-2">', '<div class="col1">申诉主题:</div>', '<div class="col2">{{title}}</div>', "</div>", '<div class="row mt-2">', '<div class="col1">原结果:</div>', '<div class="col2">{{oldWinOption.wo_name}}</div>', "</div>", '<div class="divisionLine"></div>', '<div class="row">', '<div class="col1 pt-3">更改结果:</div>', '<div class="col2 J-modifyEndBox">', '<div class="modifyEnd" data-nwo="1">{{chooseOne}}</div>', '<div class="modifyEnd gap" data-nwo="2">{{chooseTwo}}</div>', '<div class="modifyEnd gap" data-nwo="3">流局</div>', "</div>", "</div>", '<div class="row mt-10">', '<div class="col1 pt-3">更改原因:</div>', '<div class="col2">', '<textarea class="modifyReason J-modifyReason" maxlength="200" placeholder="详细描述您的问题，最多200字"></textarea>', '<div class="reasonNotice">＊请填写更改原因</div>', "</div>", "</div>", '<div class="submitBox">', '<span class="feedbackBtn submitBtn">提交</span>', '<span class="feedbackBtn cancelBtn">取消</span>', "</div>", '<div class="notice">', '<div class="noticeText">每天最多可提交2次结错账反馈</div>', '<div class="noticeText">提交过于频繁，可能会收回主播的竞猜权限</div>', '<div class="noticeText">申请提交后，请等待客服核查处理</div>', '<div class="noticeText">处理成功的通知，将会私信您和水友</div>', "</div>", "</div>", "</div>"),
					i = a.compile(t);
				return i(e)
			},
			feedbackSuccess: function() {
				var e = s.string.join('<div class="feedbackSuccessContent">', "<div>请等待客服核查！处理成功通知，</div>", "<div>将会以私信形式发送给您和水友</div>", "</div>"),
					t = a.compile(e);
				return t()
			}
		},
		showFeedback: function(t, a) {
			var s = this,
				i = s.doms,
				n = s.dataCache;
			n.init = t, n.guessMainPanel = a;
			var r = s.render.main(t),
				o = e(r);
			i.$feedback = o, e("body").append(o)
		},
		removeFeedbackPopup: function() {
			var e = this,
				t = e.doms,
				a = e.dataCache;
			e.hasFeedbackPopup() && (t.$feedback.remove(), delete t.$feedback, delete a.init, delete a.guessMainPanel)
		},
		hasFeedbackPopup: function() {
			var e = this,
				t = e.doms;
			return !(!t.$feedback || !t.$feedback.length)
		},
		submitSuccessPopup: function() {
			var t = this,
				a = t.render.feedbackSuccess();
			e.dy_dialog(a, {
				className: "shark-ui-confirm feedbackSuccess",
				mask: !1,
				zIndex: 502,
				title: "提交成功",
				buttons: [{
					content: "确定",
					callback: function() {
						this.hide()
					}
				}]
			})
		},
		changeFeedbackBtn: function() {
			var t = this,
				a = (t.doms, t.dataCache),
				s = a.init.qid,
				i = a.guessMainPanel.guessData.guessList,
				n = e("#guess-main-panel").find('.guess-game-box[data-qid="' + s + '"]'),
				r = n.find(".feedback");
			r.length > 0 && (t.saveFeedbackStatus(i, s), r.text("结错账已反馈"), r.removeClass("feedback"))
		},
		saveFeedbackStatus: function(t, a) {
			e.each(t, function(t, s) {
				return +s.qid === +a ? (e.extend(s, {
					feedback: !0
				}), !1) : void 0
			})
		},
		bindEvent: function() {
			var t = this,
				a = t.doms;
			a.$feedback.on("click", ".closeBtn", function() {
				t.removeFeedbackPopup()
			}), a.$feedback.on("click", ".modifyEnd", function() {
				var t = e(this);
				t.siblings(".choose").removeClass("choose"), t.addClass("choose")
			}), a.$feedback.on("click", ".cancelBtn", function() {
				t.removeFeedbackPopup()
			}), a.$feedback.on("click", ".submitBtn", function() {
				var a = e(".J-modifyEndBox"),
					s = a.find(".choose");
				if (0 === s.length) return void e.dialog.tips_black("请选择更改结果");
				var r = e(".J-modifyReason"),
					o = e.trim(r.val());
				if (!o) return void e.dialog.tips_black("请填写更改原因");
				var d = +s.attr("data-nwo"),
					c = t.dataCache.init;
				return d === c.oldWinOption.wo ? void e.dialog.tips_black("提交失败！您提交的结果没有发生变化！") : void n.sendAjax({
					url: t.url.submitFeedback,
					type: "POST",
					data: {
						room_id: +i.get("room.room_id"),
						quiz_id: +c.qid,
						old_win_option: c.oldWinOption.wo,
						new_win_option: d,
						reason: o
					},
					success: function(a) {
						var s = +a.error;
						0 === s ? (t.changeFeedbackBtn(), t.removeFeedbackPopup(), t.submitSuccessPopup()) : -1 === s && e.dialog.tips_black(a.msg)
					},
					error: function() {}
				})
			})
		},
		init: function(e, t) {
			var a = this,
				s = a.dataCache;
			s.init && e.qid === s.init.qid || (a.removeFeedbackPopup(), a.showFeedback(e, t), a.bindEvent())
		}
	};
	return r
}), define("douyu/page/room/normal/mod/guess-game/guess-game-rank", ["jquery", "shark/observer", "shark/util/template/2.0", "shark/util/lang/1.0", "douyu/context", "douyu/page/room/normal/mod/guess-game/guess-game-common", "douyu/page/room/normal/mod/guess-game/guess-game-popup"], function(e, t, a, s, i, n, r) {
	var o = {
		vars: {
			avatar_domain: i.get("sys.avatar_url"),
			resource_url: i.get("sys.resource_url"),
			web_url: i.get("sys.web_url")
		},
		dealUserIcon: function(e) {
			return e ? s.string.format("{0}upload/{1}_middle.jpg", o.vars.avatar_domain, e) : s.string.format("{0}/app/douyu/res/com/defaultAvatar.png?20161229", o.vars.web_url)
		},
		dealNickName: function(e) {
			return e ? e : "虚位以待"
		},
		dealWealthAmount: function(e) {
			var t = 1e4,
				a = 1e8;
			if (e = Number(e), "" == e) return "";
			if (t > e) return e;
			if (e >= t && a > e) {
				var s = new String(Math.round(e / 1e3) / 10) + "";
				return (s.indexOf(".") > -1 ? s : s + ".0") + "万"
			}
			if (e >= a) {
				var s = new String(Math.round(e / 1e7) / 10) + "";
				return (s.indexOf(".") > -1 ? s : s + ".0") + "亿"
			}
		},
		dealWealthText: function(e, t, a) {
			var s = "",
				i = "";
			return "" == a ? "" : (s = 1 == e ? "收益" : "亏损", i = 1 == t ? "日" : "周", i + s)
		},
		dealWealthColor: function(e, t) {
			return "" == t ? "" : 1 == e ? "orange" : "blue"
		},
		dealRenderObj: function(e) {
			for (var t = {
				amount: "",
				uid: "",
				nickname: "",
				noble_level: "",
				exp_level: "",
				avatar_url: ""
			}, a = (e.length, []), s = 0; 10 > s; s++) {
				var i = e[s];
				i ? a.push(i) : a.push(t)
			}
			var n = a[0];
			return a[0] = a[1], a[1] = n, a
		},
		handleNobleConfig: function(e, t) {
			var a = window.$ROOM.nobleConfig || {};
			return "pic" === t ? a[e] && a[e].symbol ? o.vars.resource_url + a[e].symbol.web_symbol_pic2 : "" : "desc" === t ? a[e] && a[e].symbol ? a[e].symbol.name : "" : void 0
		},
		getIconByLevel: function(e) {
			var t = 120,
				a = e > t ? t : e,
				i = e >= 70 ? "gif" : "png";
			return s.string.format("{0}app/douyu/res/page/room-normal/level/LV{1}.{2}?v=20170922", o.vars.web_url, a, i)
		}
	},
		d = {
			doms: {},
			urls: {
				ranklist: "/lapi/interact/quiz/ranklist"
			},
			data: {
				type: 1,
				period: 1
			},
			init: function() {},
			getDoms: function() {
				this.doms.$guessGameRank = e(".guess-game-rank"), this.doms.$rankHeader = e(".rank-header"), this.doms.$rankBody = e(".rank-body"), this.doms.$plTime = e(".pl-time"), this.doms.$plContent = e(".pl-content")
			},
			bindEvents: function() {
				var t = this;
				this.doms.$guessGameRank.on("click", ".rank-header li", function() {
					var a = t.data.type,
						s = e(this).attr("data-type").split("-")[0];
					a != s && (t.data.type = s, t.data.period = 1, t.refreshMyBox())
				}).on("click", ".pl-time li", function() {
					var a = t.data.period,
						s = e(this).attr("data-tperiod").split("-")[1],
						i = e(this).attr("data-tperiod").split("-")[0];
					a != s && (t.data.type = i, t.data.period = s, t.refreshMyBox())
				}).on("click", ".rank-header .close", function() {
					t.hideRank()
				})
			},
			renderMyBox: function() {
				var e = this;
				e.renderPopup(function() {
					e.renderRankHeader(), e.renderTimeTab(), e.renderTimeContent()
				})
			},
			refreshMyBox: function() {
				var e = this;
				e.renderRankHeader(), e.renderTimeTab(), e.renderTimeContent()
			},
			getCurrListContent: function() {
				var t = this,
					a = t.data.type + "-" + t.data.period;
				return e(".dw-content-" + a)
			},
			renderLoading: function() {
				var e = this;
				e.getCurrListContent().html('<div class="rank-loading"></div>')
			},
			hideLoading: function() {
				var e = this;
				e.getCurrListContent().find(".rank-loading").hide()
			},
			renderEmpty: function() {
				var e = this;
				e.getCurrListContent().html('<div class="rank-emty"></div>')
			},
			hideEmpty: function() {
				var e = this;
				e.getCurrListContent().find(".rank-emty").hide()
			},
			renderList: function(e) {
				var t = this,
					i = o.dealRenderObj(e),
					n = s.string.join('<div class="top-three">', "<ul>", "{{ each newReaderObj }}", "{{ if $index < 3 }}", "<li data-uid={{ $value.uid }}>", '<div class="user-area">', '<div class="user-icon"><img src="{{ dealUserIcon($value.avatar_url) }}"/></div>', "{{ if $index == 1}}", '<div class="user-icon-sides"></div>', "{{ /if }}", '<div class="mingci"></div>', "</div>", '<p class="user-name" title="{{ dealNickName($value.nickname) }}">{{ dealNickName($value.nickname) }}</p>', '<div class="user-levels">', "{{ if $value.noble_level > 0  }}", '<img class="user-noble" title="{{ handleNobleConfig($value.noble_level, "desc") }}" src="{{ handleNobleConfig($value.noble_level, "pic") }}"/>', "{{ /if }}", "{{ if $value.exp_level > 0  }}", '<img class="user-level" src="{{ getIconByLevel($value.exp_level) }}"/>', "{{ /if }}", '{{ if $value.uid == "" }}', "-", "{{ /if }}", "</div>", '<div class="user-wealth">{{ dealWealthText(type, period, $value.amount) }}<span class="{{ dealWealthColor(type, $value.amount) }}">{{ dealWealthAmount($value.amount) }}</span></div>', "</li>", "{{ /if }}", "{{ /each }}", "</ul>", "</div>", '<div class="rank-list">', "<ul>", "{{ each newReaderObj }}", "{{ if $index >= 3 }}", "<li>", '<span class="rank-num">{{ $index + 1 }}</span>', "{{ if $value.noble_level > 0 }}", '<img class="user-noble" title="{{ handleNobleConfig($value.noble_level, "desc") }}" src="{{ handleNobleConfig($value.noble_level, "pic") }}"/>', "{{ /if }}", "{{ if $value.exp_level > 0  }}", '<img class="user-level" src="{{ getIconByLevel($value.exp_level) }}"/>', "{{ /if }}", '<span class="rank-name" title="{{ dealNickName($value.nickname) }}">{{ dealNickName($value.nickname) }}</span>', '<div class="user-wealth">', '{{ if $value.uid == ""  }}', "-", "{{ else }}", '{{ dealWealthText(type, period, $value.amount) }}<span class="{{ dealWealthColor(type, $value.amount) }}">{{ dealWealthAmount($value.amount) }}</span>', "{{ /if }}", "</div>", "</li>", "{{ /if }}", "{{ /each }}", "</ul>", "</div>"),
					r = a.compile(n);
				t.getCurrListContent().html(r({
					newReaderObj: i,
					dealUserIcon: o.dealUserIcon,
					dealNickName: o.dealNickName,
					dealWealthAmount: o.dealWealthAmount,
					dealWealthText: o.dealWealthText,
					dealWealthColor: o.dealWealthColor,
					handleNobleConfig: o.handleNobleConfig,
					getIconByLevel: o.getIconByLevel,
					type: t.data.type,
					period: t.data.period
				})), t.getCurrListContent().find(".top-three").find("li").eq(0).addClass("top2"), t.getCurrListContent().find(".top-three").find("li").eq(1).addClass("top1"), t.getCurrListContent().find(".top-three").find("li").eq(2).addClass("top3")
			},
			renderTimeTab: function() {
				var e = this,
					t = s.string.join('<p class="text">{{ getBoxTopMsg() }}</p>', '<div class="priod-tab">', "<ul>", '<li class="{{ getBoxTopActive(1, "period") }} {{ getBoxColorType() }}" data-tperiod="{{ type }}-1">日榜</li>', '<li class="{{ getBoxTopActive(2, "period") }} {{ getBoxColorType() }}" data-tperiod="{{ type }}-2">周榜</li>', "</ul>", "</div>"),
					i = a.compile(t);
				e.doms.$plTime.html(i({
					getBoxTopMsg: e.getBoxTopMsg,
					getBoxTopActive: e.getBoxTopActive,
					getBoxColorType: e.getBoxColorType,
					type: e.data.type
				})), e.getDoms()
			},
			renderTimeContent: function() {
				var e = this,
					t = e.getCurrListContent().attr("data-time"),
					a = (new Date).getTime();
				if (e.doms.$plContent.find("div.dw").removeClass("active"), e.getCurrListContent().addClass("active"), t) {
					var s = a - Number(t);
					s >= 5e3 && e.getBoxData()
				} else e.getBoxData()
			},
			renderRankHeader: function() {
				var e = this,
					t = s.string.join("<ul>", '<li class="profit {{ getBoxTopActive(1, "type") }}" data-type="1-1"></li>', '<li class="loss {{ getBoxTopActive(2, "type") }}" data-type="2-1"></li>', "</ul>", '<div class="close"></div>'),
					i = a.compile(t);
				e.doms.$rankHeader.html(i({
					getBoxTopActive: e.getBoxTopActive
				})), e.getDoms()
			},
			renderPopup: function(t) {
				var i = this,
					n = s.string.join('<div class="guess-game-rank">', '<div class="rank-header"></div>', '<div class="rank-body">', '<div class="pl-time"></div>', '<div class="pl-content">', '<div class="dw dw-content-1-1 {{ getBoxShowType("1-1") }}" data-time=""></div>', '<div class="dw dw-content-1-2 {{ getBoxShowType("1-2") }}" data-time=""></div>', '<div class="dw dw-content-2-1 {{ getBoxShowType("2-1") }}" data-time=""></div>', '<div class="dw dw-content-2-2 {{ getBoxShowType("2-2") }}" data-time=""></div>', "</div>", "</div>", "</div>"),
					r = a.compile(n);
				e("body").append(r({
					getBoxShowType: i.getBoxShowType
				})), i.getDoms(), t && t()
			},
			getBoxTopMsg: function() {
				var e = d,
					t = "",
					a = "",
					s = e.data.type + "-" + e.data.period;
				try {
					a = r.Model.vars.mainMsg.quiz_setting.ranklist_intro
				} catch (i) {}
				if (a && a.length > 0) switch (s) {
				case "1-1":
					t = a[0];
					break;
				case "1-2":
					t = a[1];
					break;
				case "2-1":
					t = a[2];
					break;
				case "2-2":
					t = a[3]
				}
				return t
			},
			getBoxTopActive: function(e, t) {
				var a = d;
				return a.data[t] == e ? "active" : ""
			},
			getBoxColorType: function() {
				var e = d;
				return 1 == e.data.type ? "sy" : "tt"
			},
			getBoxShowType: function(e) {
				var t = d,
					a = t.data.type + "-" + t.data.period;
				return a == e ? "active" : ""
			},
			getBoxData: function() {
				var e = this;
				e.getCurrListContent().attr("data-time", (new Date).getTime()), e.renderLoading(), n.sendAjax({
					url: e.urls.ranklist,
					data: {
						room_id: $ROOM.room_id,
						type: e.data.type,
						period: e.data.period
					},
					type: "GET",
					dataType: "JSON",
					success: function(t) {
						e.hideLoading(), 0 == t.error && t.data && (t.data.length > 0 ? (e.hideEmpty(), e.renderList(t.data)) : e.renderEmpty())
					}
				})
			},
			showRank: function() {
				var e = this;
				e.getDoms(), e.doms.$rankBody.length > 0 ? (e.doms.$guessGameRank.show(), e.refreshMyBox()) : (e.renderMyBox(), e.bindEvents()), n.dys({
					key: "dys.room.guess-game.user.toplist.show"
				})
			},
			hideRank: function() {
				this.doms.$guessGameRank.hide()
			}
		};
	return d
}), define("douyu/page/room/normal/mod/guess-game/guess-game", ["jquery", "shark/observer", "shark/util/cookie/1.0", "shark/util/flash/data/1.0", "shark/util/template/2.0", "shark/util/storage/1.0", "douyu/context", "douyu/page/room/base/api", "shark/util/lang/1.0", "douyu/com/user", "douyu/com/exjsonp", "douyu/com/sign", "douyu/page/room/normal/mod/guess-game/guess-game-popup", "douyu/page/room/normal/mod/guess-game/guess-game-common", "douyu/page/room/normal/mod/guess-game/guess-game-anchor-feedback", "douyu/page/room/normal/mod/guess-game/guess-game-rank"], function(e, t, a, s, i, n, r, o, d, c, l, g, u, m, p, f) {
	var h = {
		SIMPLETIPS: "guessModeSimpleTips",
		NEWGUIDEGUESS: "newGuideGuess201808",
		SETTINGGUIDE: "ifshowSettingFirstGuideNote"
	},
		v = {
			init: function() {
				this.configs = {
					gotoActivityUrl: "https://www.douyu.com/t/ecydt",
					webUrl: r.get("sys.web_url"),
					avatarDomain: r.get("sys.avatar_url"),
					userInfo: {
						roomId: "" + r.get("room.room_id"),
						cateId: "" + r.get("room.cate_id"),
						userId: "" + r.get("sys.uid"),
						anchorId: "" + r.get("room.owner_uid"),
						avatar: r.get("room.avatar.small"),
						nickname: r.get("room.owner_name")
					},
					urls: {
						matchStageConfig: r.get("sys.webconfUrl") + "resource/common/activity/ecydt.json",
						anchorRankList: "/lapi/interact/ecydt/anchorRankList",
						userRankList: "/lapi/interact/ecydt/roomUserRankList"
					},
					isBlackList: -1,
					isCate: -1,
					matchStateStatus: 0,
					matchStageConfig: null,
					jsonCbName: {
						matchStageConfig: "activity_ecydt"
					},
					sourceData: null,
					handledData: {
						appStartData: {}
					},
					SuperRocketSwiper: null,
					defaultConfig: {
						name: "虚位以待",
						value: "--",
						avatar: r.get("sys.web_url") + "/app/douyu/activity/res/act20180601/default-pic.png",
						renderLength: 20
					},
					tabRankIndex: 0,
					rankNameList: ["封神榜", "房间贡献榜"],
					updateRankTimes: 6e4,
					anchorRankList: {
						times: 0,
						reqing: 0,
						rankList: []
					},
					userRankList: {
						times: 0,
						reqing: 0,
						rankList: []
					},
					doms: {},
					data: {},
					sliderData: {
						maxRight: 0,
						currentRight: 0,
						step: 300
					},
					clickStatus: {},
					cache: {},
					cornerTimer: {}
				}, this.roomType = r.get("room.is_normal") && 1 == r.get("room.is_normal") ? 1 : 0, this.guessType = 1
			},
			setGuessType: function(e) {
				e && (this.guessType = e), y.guessModeCornerSwitch()
			}
		},
		y = {
			guessModeCornerSwitch: function() {
				e(".JS-guess-mode").removeClass("guess-iconShow"), 2 == v.guessType ? e(".JS-guess-mode").addClass("guess-iconShow") : e(".JS-guess-mode").removeClass("guess-iconShow")
			},
			guessModeTipsSwitch: function(t) {
				t && 2 == v.guessType && e(".JS-guessMode-simpleTips").length > 0 ? (e(".JS-guessMode-simpleTips").addClass("show"), this.guessModeMarquee(17)) : e(".JS-guessMode-simpleTips").removeClass("show")
			},
			guessModeMarqueeClearTimer: function() {
				var e = this;
				e.scrollTimer && clearInterval(e.scrollTimer)
			},
			guessModeMarquee: function(t) {
				function a(e) {
					var n;
					if (e) n = 5e3;
					else {
						var o = i.scrollTop();
						o >= r ? i.scrollTop(0) : (o++, i.scrollTop(o)), n = o % t ? 10 : 5e3
					}
					s.guessModeMarqueeClearTimer(), s.scrollTimer = setTimeout(a, n)
				}
				var s = this,
					i = e(".J-guessMode-scrollBox"),
					n = i.find(".scrollContent"),
					r = n.height();
				a(!0)
			}
		},
		b = {
			doms: {},
			url: {
				authority: "/lapi/interact/quiz/quizStartAuthority",
				recommendList: "/actsc/quiz/get_recommend_quiz_list",
				guessRecordByLua: "/lapi/interact/quiz/myPlayInfo",
				myJoinStatus: "/lapi/interact/quiz/myJoinStatus",
				mySimpleJoinStatus: "/lapi/interact/quiz/simpleMyJoinStatus",
				closeQuiz: "/member/quiz/close_quiz",
				showMallTip: "/lapi/interact/mall/isnew"
			},
			data: {},
			sliderData: {
				maxRight: 0,
				currentRight: 0,
				step: 300
			},
			guessData: {
				guessList: [],
				guessStatusPool: [],
				guessEndPool: [],
				guessSingleEndPool: [],
				restartPool: [],
				userJoinPool: [],
				timer: {},
				sendGiftGuideCountDown: 0
			},
			defaultObj: {
				fbid: "0",
				fbmc: "0",
				fbuid: "0",
				fobc: "0",
				folpc: "0",
				sbid: "0",
				sbmc: "0",
				sbuid: "0",
				sobc: "0",
				solpc: "0",
				scs: "0",
				wo: "0",
				fjoin: !1,
				fjoinAmount: 0,
				sjoin: !1,
				sjoinAmount: 0,
				feedback: !1
			},
			clickStatus: {},
			cache: {},
			cornerTimer: {},
			actGuessConfig: {
				reqAdvanceing: 0,
				advanceConfig: [],
				reqDescAdvanceing: 0,
				descAdvanceConfig: []
			},
			render: {
				newGuide2018: function(e) {
					var t = d.string.join('<div class="newMask-201808">', '<div class="guideHeadBox"></div>', '<div class="guideItemBox">', '<div class="guideItem">', '<div class="guideItemCotent">', '<div class="card1"></div>', '<p class="title">竞猜入口位置调整</p>', '<p class="desc">竞猜内容平铺展示，再也不用担心错过</p>', '<p class="desc">竞猜赢鱼丸的机会啦~</p>', "</div>", "</div>", '<div class="guideItem">', '<div class="guideItemCotent">', '<div class="card2"></div>', '<p class="title">新增<span class="guess-color-ff7700">自动赔率</span>模式玩法</p>', '<p class="desc">赔率随双方投注总额而变动，投注时赔</p>', '<p class="desc"> 率仅作参考，结算以最终赔率为准。~</p>', "</div>", "</div>", '<div class="guideItem">', '<div class="guideItemCotent">', '<div class="card3"></div>', '<p class="title">水友开猜模式玩法</p>', '<p class="desc">竞猜原有玩法，<span class="guess-color-ff7700">无定时封盘</span>，想赢多少</p>', '<p class="desc"> 就赢多少，海量鱼丸等你赚！~</p>', "</div>", "</div>", '<div class="guess-dialog-closeBtn-guide201808 J-guide-201808-closeBtn"></div>', "</div>", "</div>"),
						a = i.compile(t);
					return a()
				},
				mainPanel: function(t) {
					var a = d.string.join('<div class="guess-main-panel {{normalPanelClass}} {{smallScreenClass}}" id="guess-main-panel">', '<div class="guess-main-panel-header clearfix">', '<div class="panel-right">', "{{ if (isShowFansHappy()) }}", '<img class="fansHappy J-fansHappy" src="{{fansBtnSrc()}}" />', "{{ /if }}", '<span class="JS-fishball-rank icon-bar myRank">', '<div class="iconTips iconBubble">排行榜</div>', "</span>", '<span class="division"></span>', '<span class="JS-fishball-mall icon-bar myShop">', '<div class="iconTips iconBubble">鱼丸商城</div>', "</span>", "{{ if (isAnchor && isShowAuthoritySet) }}", '<span class="division"></span>', '<span class="J-setAuthority icon-bar mySet">', '<div class="iconTips iconBubble">发起权限设置</div>', "</span>", "{{ /if }}", "{{ if (!isAnchor) }}", '<span class="division"></span>', '<a class="J-myGuess icon-bar myGuess" href="/member/quiz/history?action=answer" target="_blank">', '<div class="iconTips iconBubble">我的竞猜</div>', "</a>", "{{ /if }}", '<span class="division"></span>', '<span class="J-myMore icon-bar myMore">', '<div class="moreOptionBox">', '<div class="arrowBox"></div>', '<div class="tipsText">', "{{ if (isAnchor) }}", '<p><a class="J-myGuess" href="/member/quiz/history" target="_blank"><i class=" icon-bar myGuess"></i>我的竞猜</a></p>', "{{ /if }}", '<p><a href="https://kefu.douyu.com/" target="_blank"><i class="icon-bar myContact"></i>在线客服</a></p>', "{{ if (isAnchor) }}", '<p><a class="J-helpBtn" href="//www.douyu.com/cms/gong/201712/25/6965.shtml" target="_blank"><i class="icon-bar myHelp"></i>玩法介绍</a></p>', "{{ else }}", '<p><a class="J-helpBtn" href="//www.douyu.com/cms/gong/201712/05/6829.shtml" target="_blank"><i class="icon-bar myHelp"></i>玩法介绍</a></p>', "{{ /if }}", "</div>", "</div>", "</span>", "{{ if (!isNormalPanel) }}", '<span class="division"></span>', '<i class="guess-main-panel-close"></i>', "{{ /if }}", "</div>", '<div class="panel-left">', '<em class="fishBall_NUM hide" data-login-user="silver"></em>', '<i class="guess-logo"></i>', '<span class="guess-name">互动竞猜</span>', '<i class="JS-guess-mode guess-modetype"></i>', "{{ if (!isAnchor && guessModeSimpleTips) }}", '<div class="JS-guessMode-simpleTips simpleTipsBox">', '<div class="voice"></div>', '<div class="J-guessMode-scrollBox scrollBox">', '<div class="scrollContent">', "<p>自动赔率模式中，赔率由系统实时计算</p>", "<p>结算以最终封盘赔率为准</p>", "<p>投注时赔率仅作参考</p>", "<p>投注数x封盘赔率即是最终返还鱼丸数</p>", "</div>", "<div>", "<p>自动赔率模式中，赔率由系统实时计算</p>", "</div>", "</div>", '<div class="J-guessMode-simpleTips-closeBtn guess-dialog-closeBtn closeBtn"></div>', '<div class="guess-bubble bubble">', '<p class="title">自动赔率玩法</p>', "<p>自动赔率模式中，赔率由系统实时计算</p>", "<p>结算以最终封盘赔率为准</p>", "<p>投注时赔率仅作参考</p>", "<p>投注数x封盘赔率即是最终返还鱼丸数</p>", '<div class="notips">', '<span class="J-guessMode-simpleTips-notip">不再提示</span>', "</div>", '<div class="bubble-bottom"></div>', "</div>", "</div>", "{{ /if }}", "{{ if (identy > 1) }}", "{{ if (isAnchor && guessList.length > 0 && guessList[0].suid != uid) }}", '<span class="batch J-headerNotice"><span class="guessUserName" title="{{ guessList[0].sname }}">{{ guessList[0].sname }}</span>发起的竞猜</span>', "{{ else }}", '<span class="batch J-headerNotice"></span>', "{{ /if }}", "{{ /if }}", "</div>", "{{ if (isAnchor) }}", '<a class="guess-btn-120 resetGuessGame J-resetGuessGame" href="javascript:void(0);">重新发起竞猜</a>', "{{ else }}", '<a class="guess-btn-120 resetGuessGame J-resetGuessGame" href="javascript:void(0);">发起竞猜</a>', "{{ /if }}", "{{ if (identy > 1) }}", '<a class="guess-btn-120 resetGuessGame J-batchSubmit" href="javascript:void(0);">批量结束</a>', "{{ /if }}", "</div>", '<div class="guess-game-box-body"></div>', '<div class="slide-bar right-bar"></div>', '<div class="slide-bar left-bar"></div>', "{{ if (!isAnchor) }}", "{{ if (descAdConfig && descAdConfig.posid) }}", '<a class="AnchorGuess-descAdvance" href="{{ descAdConfig.link }}" target="_blank" title="{{ descAdConfig.srcid }}">{{ descAdConfig.srcid }}</a>', "{{ /if }}", "{{ /if }}", "</div>"),
						s = e.extend({}, t, {
							uid: r.get("sys.uid"),
							isAnchor: m.isAnchor(),
							identy: b.getIdenty(),
							isShowAuthoritySet: b.getAuthoritySet(),
							smallScreen: b.isSmallScreen(),
							smallScreenClass: b.isSmallScreen() ? "smallScreen" : "",
							isNormalPanel: v.roomType ? 1 : 0,
							normalPanelClass: v.roomType ? "normal-panel" : "no-normal-panel",
							guessType: v.guessType,
							guessModeSimpleTips: JSON.parse(n.get(h.SIMPLETIPS)) ? 0 : 1,
							descAdConfig: g.helper.getAdInfoInData(411101),
							isShowFansHappy: function() {
								var e = u.Model.vars;
								return !(!e.interactActive || 1 !== e.interactActive.active_status)
							},
							fansBtnSrc: function() {
								var e, t = u.Model.vars;
								return e = t.interactActive && t.interactActive.activity_info.web_entry_button ? t.interactActive.activity_info.web_entry_button : r.get("sys.web_url") + "app/douyu/res/page/room-normal/guess-game/fansHappy.png"
							}
						}),
						o = i.compile(a);
					return o(s)
				},
				selfNoSetGuessGame: function() {
					var e = d.string.join('<div class="noGuessBox anchorSelf">', '<div class="noGuessTitle">当前没有发起竞猜~</div>', '<div class="secondTitle">您可以发起竞猜，带给水友更多欢乐！</div>', '<div class="guess-btn-138 J-guessGameStartBtn">发起竞猜</div>', "</div>"),
						t = i.compile(e);
					return t()
				},
				anchorNoSetGuessGame: function(t) {
					var a = d.string.join('<div class="noGuessBox">', "{{ if (list.length > 0) }}", "{{ if (identy === 2) }}", "{{ if (isLiving) }}", '<div class="guess-btn-138 userGuessGame J-guessGameStartBtn">发起竞猜</div>', "{{ /if }}", '<div class="secondTitle umgt-15">本房间主播暂未发起竞猜，看看下面的竞猜吧~</div>', "{{ else }}", '<div class="noGuessTitle">本房间主播暂未发起竞猜~</div>', '<div class="secondTitle">看看下面正在进行的竞猜吧</div>', "{{ /if }}", '<div class="guessGuideList">', '<div class="guessGuideListBox {{listSize}}">', "{{ each list }}", '<a href="/{{ $value.room_id }}" target="_blank" data-rid="{{ $value.room_id }}" class="guessGuideBox', "{{ if ($index != 0) }}", " guess-mgl-12", "{{ /if }}", '">', "{{ if $value.avatar }}", '<div class="imageBox"><img src="{{ $value.avatar }}"/></div>', "{{ else }}", '<div class="imageBox"><img src="{{ defaultAvatar }}"/></div>', "{{ /if }}", '<div class="recommendBox">', '<h2 title="{{ $value.user_nickname }}">{{ $value.user_nickname }}</h2>', "<p>{{ numFormat($value.player_count) }}人正在竞猜</p>", "<p>{{ $value.room_tag_name }}</p>", "</div>", "</a>", "{{ /each }}", "</div>", '<a class="moreGuess guess-mgl-12" href="/directory/all#quiz_rooms" target="_blank">', '<i class="moreBtn"></i>', "<div>更多竞猜</div>", "</a>", "</div>", "{{ else }}", "{{ if (identy === 2 && isLiving) }}", '<div class="noGuessTitle">本房间主播暂未发起竞猜~</div>', '<div class="secondTitle">竞猜内容由你定，猜你想猜的</div>', '<div class="guess-btn-138 J-guessGameStartBtn">发起竞猜</div>', "{{ else }}", '<div class="guessEmpty"></div>', '<div class="noGuessTitle emptyTitle">本房间主播暂未发起竞猜~</div>', "{{ /if }}", "{{ /if }}", "</div>"),
						s = i.compile(a),
						n = r.get("sys.web_url") + "/app/douyu/res/com/defaultAvatar.png?20171210",
						o = e.extend({}, t, {
							isAnchor: m.isAnchor(),
							identy: b.getIdenty(),
							isLiving: m.isLiving(),
							defaultAvatar: n,
							listSize: m.suitVideoChange(),
							numFormat: function(e) {
								return m.formatTotalBidNum(e)
							}
						});
					return s(o)
				},
				guessRecordLoading: function() {
					var e = d.string.join('<div class="guessRecordLoading"></div>'),
						t = i.compile(e);
					return t()
				},
				recommendLoading: function() {
					var e = d.string.join('<div class="loadingBox">', '<div class="recommendLoading"></div>', "<div>正在加载中...</div>", "</div>"),
						t = i.compile(e);
					return t()
				},
				guessGameBoxTpl1: function() {
					var e = d.string.join("<div class=\"guess-game-box-theme {{ (+$value.qs >= 3) ? 'guessEnd' : '' }}\"", ' data-qs="{{$value.qs}}" data-suid="{{$value.suid}}" data-sname="{{$value.sname}}">', '<div class="guess-game-box-main">', '<div class="guess-game-box-header clearfix">', '<div class="box-left">{{$value.qt}}</div>', '<div class="box-right">', "{{ if (isAnchor) }}", "{{ if (+$value.qs === 2) }}", '<span class="rightBar">已封盘</span>', "{{ else if (((+$value.qs === 3 && +$value.wo > 0) || (+$value.qs === 4 && +$value.ft === 0)) && ifShowFeedbackBtn) }}", "{{ if (!$value.feedback) }}", '<span class="rightBar feedback">结错账反馈</span>', "{{ else }}", '<span class="rightBar">结错账已反馈</span>', "{{ /if }}", "{{ else if (+$value.qs === 4 && +$value.ft === 3) }}", '<span class="rightBar">主题违规流局</span>', "{{ /if }}", "{{ else }}", '{{ if (+$value.qs === 2 && $value.scs === "0") }}', '<span class="rightBar">已封盘</span>', '{{ else if (+$value.qs === 2 && $value.scs === "1") }}', '<span class="rightBar">主播意外下播封盘', '<div class="sealTips">?', '<div class="tipsTextBox">', '<div class="tipsText">超过5分钟后未开播判为流局，</br>将返还您投注鱼丸</div>', '<div class="tipsArrow"></div>', "</div>", "</div>", "</span>", "{{ else if (+$value.qs === 3) }}", "{{ if ($value.ec && +$value.ec >= 0) }}", '<span class="rightBar">赢{{ mathAbs(+$value.ec) }}鱼丸</span>', "{{ else if ($value.ec && +$value.ec < 0) }}", '<span class="rightBar">输{{ mathAbs(+$value.ec) }}鱼丸</span>', "{{ /if }}", "{{ else if (+$value.qs === 4) }}", "{{ if (+$value.ft === 3) }}", '<span class="rightBar">主题违规流局</span>', "{{ else if ($value.ec && +$value.ec === 0) }}", '<span class="rightBar">返还参与鱼丸</span>', "{{ /if }}", "{{ /if }}", "{{ /if }}", "</div>", "</div>", '<div class="guess-game-box-container">', '<div class="simple-item-hover">', '<a class="item item-left', "{{ if (+$value.qs === 3 && +$value.wo === 2) || (+$value.qs === 4)}}", " disabled", "{{ else if ((+$value.folpc === 0 || !$value.folpc || +$value.fbmc ===0 || !$value.fbmc) && +$value.qs === 1 ) }}", " waitGuess", "{{ /if }}", '" data-loss="{{numToFix($value.folpc)}}" data-bankerId="{{$value.fbid}}" data-balance="{{$value.fbmc}}" data-joinnum="{{$value.fjoinAmount}}">', "{{ if (+$value.qs === 3 && +$value.wo === 1) }}", '<i class="guessSuccessIcon"></i>', "{{else if (+$value.qs === 3 && +$value.wo === 2) }}", '<i class="guessFailIcon"></i>', "{{else if (+$value.qs === 4) }}", '<i class="guessFlowIcon"></i>', "{{ /if }}", '<p class="title', "{{ if (+$value.qs >=3) }}", " guess-mgt-15", "{{ /if }}", '">{{$value.fon}}</p>', '<p class="peilv">', "{{ if ((+$value.folpc === 0 || !$value.folpc || +$value.fbmc === 0 || !$value.fbmc) && +$value.qs === 1 ) }}", " 等待开猜", "{{ else }}", "赔率{{ numToFix($value.folpc)}}", "{{ /if }}", "</p>", "{{ if (!isAnchor && $value.fjoin) }}", '<i class="icon-hasBid icon-hasBid-easy" data-option="1"></i>', "{{ /if }}", "</a>", "</div>", "{{ if (isAnchor) }}", '<div class="item-middle">VS</div>', "{{ else }}", '<div class="beginGuessBtn-box">', '<div class="beginGuessBtn', "{{ if (+$value.qs === 1) }}", " beginGuess", "{{ else if (+$value.qs >= 3) }}", " disabled", "{{ /if }}", '">开猜', '<div class="beginGuessTips">开猜有机会赢得更多鱼丸哦</div>', "</div>", "</div>", "{{ /if }}", '<div class="simple-item-hover">', '<a class="item item-right', "{{ if (+$value.qs === 3 && +$value.wo === 1) || (+$value.qs === 4)}}", " disabled", "{{ else if ((+$value.solpc === 0 || !$value.solpc || +$value.sbmc ===0 || !$value.sbmc) && +$value.qs === 1 ) }}", " waitGuess", "{{ /if }}", '" data-loss="{{numToFix($value.solpc)}}" data-bankerId="{{$value.sbid}}" data-balance="{{$value.sbmc}}" data-joinnum="{{$value.sjoinAmount}}">', "{{ if (+$value.qs === 3 && +$value.wo === 2) }}", '<i class="guessSuccessIcon"></i>', "{{else if (+$value.qs === 3 && +$value.wo === 1) }}", '<i class="guessFailIcon"></i>', "{{else if (+$value.qs === 4) }}", '<i class="guessFlowIcon"></i>', "{{ /if }}", '<p class="title', "{{ if (+$value.qs >=3) }}", " guess-mgt-15", "{{ /if }}", '">{{$value.son}}</p>', '<p class="peilv">', "{{ if ((+$value.solpc === 0 || !$value.solpc || +$value.sbmc === 0 || !$value.sbmc) && +$value.qs === 1 ) }}", " 等待开猜", "{{ else if (+$value.qs <= 2) }}", "赔率{{ numToFix($value.solpc)}}", "{{ /if }}", "</p>", "{{ if (!isAnchor && $value.sjoin) }}", '<i class="icon-hasBid icon-hasBid-easy" data-option="2"></i>', "{{ /if }}", "</a>", "</div>", "</div>", '<div class="guess-game-box-footer clearfix difficult-guess">', '<div class="progress-left-default"></div>', '<div class="progress-right-default"></div>', '<div class="progress-left', "{{ if (+$value.qs === 3 && +$value.wo === 2)}}", " disabled", "{{ /if }}", '" style="width:{{per2(+$value.fobc, +$value.sobc, true) }}; data-bidNum="{{ $value.sobc ? $value.sobc : 0 }}"></div>', '<div class="progress-right', "{{ if (+$value.qs === 3 && +$value.wo === 1)}}", " disabled", "{{ /if }}", '" style="width:{{per2(+$value.fobc, +$value.sobc, false)}}; data-bidNum="{{ $value.fobc ? $value.fobc : 0 }}"></div>', '<span class="bidNum-left">{{ formatTotalBidNum($value.fobc) }}</span>', '<span class="bidNum-right">{{ formatTotalBidNum($value.sobc) }}</span>', '{{ if (!isAnchor) }}<i class="vs"></i>{{ /if }}', "</div>", "</div>", "{{ if (isAnchor || (identy === 2 && uid == $value.suid)) }}", '<div class="guess-game-box-footer-plus">', '<div class="division"></div>', "{{ if (+$value.qs === 1) }}", '<div class="foot-button foot-button-left stopBidBtn">封&nbsp;&nbsp;&nbsp;&nbsp;盘</div>', "{{ else }}", '<div class="foot-button foot-button-left stopBidBtn disable">已封盘</div>', "{{ /if }}", "{{ if (+$value.qs === 1 || +$value.qs === 2) }}", '<div class="foot-button foot-button-right endBtn">结&nbsp;&nbsp;&nbsp;&nbsp;束</div>', "{{ else }}", '<div class="foot-button foot-button-right endBtn disable">已结束</div>', "{{ /if }}", "</div>", "{{ /if }}", "</div>");
					return e
				},
				guessGameBoxTpl2: function() {
					var e = d.string.join("<div class=\"guess-game-box-theme guessTheme-mode2 {{ (+$value.qs >= 3) ? 'guessEnd' : '' }}\"", ' data-qs="{{$value.qs}}" data-suid="{{$value.suid}}" data-sname="{{$value.sname}}">', '<div class="guess-game-box-main">', '<div class="guess-game-box-header clearfix">', '<div class="box-left">{{$value.qt}}</div>', '<div class="box-right">', "{{ if (isAnchor) }}", "{{ if (+$value.qs === 1) }}", "{{ if (+$value.et > 0) }}", '<span class="et" data-et="{{$value.et}}">{{formatEt($value.et)}}</span>', "{{ /if }}", "{{ else if (+$value.qs === 2) }}", '<span class="rightBar">已封盘</span>', "{{ else if (((+$value.qs === 3 && +$value.wo > 0) || (+$value.qs === 4 && +$value.ft === 0)) && ifShowFeedbackBtn) }}", "{{ if (!$value.feedback) }}", '<span class="rightBar feedback">结错账反馈</span>', "{{ else }}", '<span class="rightBar">结错账已反馈</span>', "{{ /if }}", "{{ else if (+$value.qs === 4 && +$value.ft === 3) }}", '<span class="rightBar">主题违规流局</span>', "{{ /if }}", "{{ else }}", "{{ if (+$value.qs === 1) }}", "{{ if (+$value.et > 0) }}", '<span class="et" data-et="{{$value.et}}">{{formatEt($value.et)}}</span>', "{{ /if }}", '{{ else if (+$value.qs === 2 && $value.scs === "0") }}', '<span class="rightBar">已封盘</span>', '{{ else if (+$value.qs === 2 && $value.scs === "1") }}', '<span class="rightBar">主播意外下播封盘', '<div class="sealTips">?', '<div class="tipsTextBox">', '<div class="tipsText">超过5分钟后未开播判为流局，</br>将返还您投注鱼丸</div>', '<div class="tipsArrow"></div>', "</div>", "</div>", "</span>", "{{ else if (+$value.qs === 3) }}", "{{ if ($value.ec && +$value.ec >= 0) }}", '<span class="rightBar">赢{{ mathAbs(+$value.ec) }}鱼丸</span>', "{{ else if ($value.ec && +$value.ec < 0) }}", '<span class="rightBar">输{{ mathAbs(+$value.ec) }}鱼丸</span>', "{{ /if }}", "{{ else if (+$value.qs === 4) }}", "{{ if (+$value.ft === 3) }}", '<span class="rightBar">主题违规流局</span>', "{{ else if ($value.ec && +$value.ec === 0) }}", '<span class="rightBar">返还参与鱼丸</span>', "{{ /if }}", "{{ /if }}", "{{ /if }}", "</div>", "</div>", '<div class="guess-game-box-container">', '<div class="simple-item-hover">', '<a class="J-simple-item item-left', "{{ if (+$value.qs === 3 && +$value.wo === 2) || (+$value.qs === 4)}}", " disabled", "{{ /if }}", '" data-loss="{{numToFix($value.op1pr)}}" data-bankerId="{{$value.fbid}}" data-balance="{{$value.fbmc}}" data-joinnum="{{$value.fjoinAmount}}">', "{{ if (+$value.qs === 3 && +$value.wo === 1) }}", '<i class="guessSuccessIcon"></i>', "{{else if (+$value.qs === 3 && +$value.wo === 2) }}", '<i class="guessFailIcon"></i>', "{{else if (+$value.qs === 4) }}", '<i class="guessFlowIcon"></i>', "{{ /if }}", '<p class="title">{{$value.fon}}</p>', '<p class="peilv">赔率{{ numToFix($value.op1pr) }}</p>', "{{ if (!isAnchor && $value.fjoin) }}", '<span class="icon-hasBid-easy" data-option="1">', '<div class="guess-bubble guess-bubble-oppsite tipsBubble">已投注：', '<span class="guess-color-ff7700">{{ $value.fjoinAmount }}</span>', "</div>", "</span>", "{{ /if }}", "</a>", "</div>", '<div class="item-middle"></div>', '<div class="simple-item-hover">', '<a class="J-simple-item item-right', "{{ if (+$value.qs === 3 && +$value.wo === 1) || (+$value.qs === 4)}}", " disabled", "{{ /if }}", '" data-loss="{{numToFix($value.op2pr)}}" data-bankerId="{{$value.sbid}}" data-balance="{{$value.sbmc}}" data-joinnum="{{$value.sjoinAmount}}">', "{{ if (+$value.qs === 3 && +$value.wo === 2) }}", '<i class="guessSuccessIcon"></i>', "{{else if (+$value.qs === 3 && +$value.wo === 1) }}", '<i class="guessFailIcon"></i>', "{{else if (+$value.qs === 4) }}", '<i class="guessFlowIcon"></i>', "{{ /if }}", '<p class="title">{{$value.son}}</p>', '<p class="peilv">赔率{{ numToFix($value.op2pr)}}</p>', "{{ if (!isAnchor && $value.sjoin) }}", '<span class="icon-hasBid-easy" data-option="2">', '<div class="guess-bubble tipsBubble">已投注：', '<span class="guess-color-ff7700">{{ $value.sjoinAmount }}</span>', "</div>", "</span>", "{{ /if }}", "</a>", "</div>", "</div>", '<div class="guess-game-box-footer clearfix">', '<div class="fl progress-box-left">', '<div class="progress" style="width:{{per(+$value.op1to, +$value.op2to, true) }}; data-bidNum="{{ $value.op1to ? $value.op1to : 0 }}"></div>', '<span class="bidNum-left">{{ formatTotalBidNum($value.op1to) }}</span>', "</div>", '<div class="fr progress-box-right">', '<div class="progress" style="width:{{per(+$value.op1to, +$value.op2to, false)}}; data-bidNum="{{ $value.op2to ? $value.op2to : 0 }}"></div>', '<span class="bidNum-right">{{ formatTotalBidNum($value.op2to) }}</span>', "</div>", "</div>", "</div>", "{{ if (isAnchor || (identy === 2 && uid == $value.suid)) }}", '<div class="guess-game-box-footer-plus">', '<div class="division"></div>', "{{ if (+$value.qs === 1) }}", '<div class="foot-button foot-button-left stopBidBtn">封&nbsp;&nbsp;&nbsp;&nbsp;盘</div>', "{{ else }}", '<div class="foot-button foot-button-left stopBidBtn disable">已封盘</div>', "{{ /if }}", "{{ if (+$value.qs === 1 || +$value.qs === 2) }}", '<div class="foot-button foot-button-right endBtn">结&nbsp;&nbsp;&nbsp;&nbsp;束</div>', "{{ else }}", '<div class="foot-button foot-button-right endBtn disable">已结束</div>', "{{ /if }}", "</div>", "{{ /if }}", "</div>");
					return e
				},
				guessGameBox: function(t, a) {
					var s;
					switch (t.guessList.length) {
					case 1:
						s = "one-box";
						break;
					case 2:
						s = "two-box";
						break;
					case 3:
						s = "three-box";
						break;
					default:
						s = ""
					}
					var n = "guess-mgt-20",
						o = m.isAnchor(),
						c = b.getIdenty();
					(o || 2 == c && t && t.guessList.length > 0 && +r.get("sys.uid") == t.guessList[0].suid) && (n = "");
					var l = e.extend({}, t, {
						boxBodyClass: s,
						animateClass: a ? "hasAnimate" : "",
						isAnchorClass: m.isAnchor() ? "isAnchor" : "",
						isAnchor: m.isAnchor(),
						identy: b.getIdenty(),
						per: function(e, t, a) {
							return m.per(e, t, a)
						},
						per2: function(e, t, a) {
							var s = parseInt(e),
								i = parseInt(t),
								n = s + i;
							if (0 == n) return "0%";
							var r = a ? Math.floor(s / n * 100) : 100 - Math.floor(s / n * 100);
							return r > 95 ? r = 95 : 5 > r && (r = 5), r + "%"
						},
						numToFix: function(e) {
							return m.numToFix(e)
						},
						mathAbs: function(e) {
							return m.mathAbs(e)
						},
						formatTotalBidNum: function(e) {
							return m.formatTotalBidNum(e)
						},
						formatEt: function(e) {
							return m.formatEt(e)
						},
						ifShowFeedbackBtn: m.compareAnchorLevel(u.Model.vars.mainMsg.quiz_setting.change_result_min_level),
						uid: +r.get("sys.uid"),
						normaUserClass: n
					}),
						g = 1 == v.guessType ? b.render.guessGameBoxTpl1() : b.render.guessGameBoxTpl2(),
						p = d.string.join('<div class="hasGuessBox {{boxBodyClass}} {{animateClass}} {{isAnchorClass}} {{normaUserClass}}">', "{{ each guessList }}", '<div class="guess-game-box guess-game-box{{$index}}"', 'data-qid="{{$value.qid}}" data-qt="{{$value.qt}}" data-fon="{{$value.fon}}" data-son="{{$value.son}}" data-index="{{$index}}">', '<div class="guess-game-update-box">', g, "</div>", "</div>", "{{ /each }}", "</div>"),
						f = i.compile(p);
					return f(l)
				},
				reRenderThemeTpl1: function() {
					var e = d.string.join('<div class="guess-game-box-theme {{ (+qs >= 3) ? \'guessEnd\' : \'\' }}" data-qs="{{qs}}" data-suid="{{suid}}" data-sname="{{sname}}">', '<div class="guess-game-box-main">', '<div class="guess-game-box-header clearfix">', '<div class="box-left">{{qt}}</div>', '<div class="box-right">', "{{ if (isAnchor) }}", "{{ if (+qs === 1) }}", "{{ else if (+qs === 2) }}", '<span class="rightBar">已封盘</span>', "{{ else if (((+qs === 3 && +wo > 0) || (+qs === 4 && +ft === 0)) && ifShowFeedbackBtn) }}", "{{ if (!feedback) }}", '<span class="rightBar feedback">结错账反馈</span>', "{{ else }}", '<span class="rightBar">结错账已反馈</span>', "{{ /if }}", "{{ else if (+qs === 4 && +ft === 3) }}", '<span class="rightBar">主题违规流局</span>', "{{ /if }}", "{{ else }}", '{{ if (+qs === 2 && scs === "0") }}', '<span class="rightBar">已封盘</span>', '{{ else if (+qs === 2 && scs === "1") }}', '<span class="rightBar">主播意外下播封盘', '<div class="sealTips">?', '<div class="tipsTextBox">', '<div class="tipsText">超过5分钟后未开播判为流局，</br>将返还您投注鱼丸</div>', '<div class="tipsArrow"></div>', "</div>", "</div>", "</span>", "{{ else if (+qs === 3) }}", "{{ if (ec && +ec >= 0) }}", '<span class="rightBar">赢{{ mathAbs(+ec) }}鱼丸</span>', "{{ else if (ec && +ec < 0) }}", '<span class="rightBar">输{{ mathAbs(+ec) }}鱼丸</span>', "{{ /if }}", "{{ else if (+qs === 4) }}", "{{ if (+ft === 3) }}", '<span class="rightBar">主题违规流局</span>', "{{ else if (ec && +ec === 0) }}", '<span class="rightBar">返还参与鱼丸</span>', "{{ /if }}", "{{ /if }}", "{{ /if }}", "</div>", "</div>", '<div class="guess-game-box-container">', '<div class="simple-item-hover">', '<a class="item item-left', "{{ if (+qs === 3 && +wo === 2) || (+qs === 4)}}", " disabled", "{{ else if ((+folpc === 0 || !folpc || +fbmc ===0 || !fbmc) && +qs === 1 ) }}", " waitGuess", "{{ /if }}", '" data-loss="{{numToFix(folpc)}}" data-bankerId="{{fbid}}" data-balance="{{fbmc}}" data-joinnum="{{fjoinAmount}}">', "{{ if (+qs === 3 && +wo === 1) }}", '<i class="guessSuccessIcon"></i>', "{{else if (+qs === 3 && +wo === 2) }}", '<i class="guessFailIcon"></i>', "{{else if (+qs === 4) }}", '<i class="guessFlowIcon"></i>', "{{ /if }}", '<p class="title', "{{ if (+qs >=3) }}", " guess-mgt-15", "{{ /if }}", '">{{fon}}</p>', '<p class="peilv">', "{{ if ((+folpc === 0 || !folpc || +fbmc === 0 || !fbmc) && +qs === 1 ) }}", " 等待开猜", "{{ else if (+qs <= 2) }}", "赔率{{ numToFix(folpc)}}", "{{ /if }}", "</p>", "{{ if (!isAnchor && fjoin) }}", '<i class="icon-hasBid icon-hasBid-easy" data-option="1"></i>', "{{ /if }}", "</a>", "</div>", "{{ if (isAnchor) }}", '<div class="item-middle">VS</div>', "{{ else }}", '<div class="beginGuessBtn-box">', '<div class="beginGuessBtn', "{{ if (+qs === 1) }}", " beginGuess", "{{ else if (+qs >= 3) }}", " disabled", "{{ /if }}", '">开猜', '<div class="beginGuessTips">开猜有机会赢得更多鱼丸哦</div>', "</div>", "</div>", "{{ /if }}", '<div class="simple-item-hover">', '<a class="item item-right', "{{ if (+qs === 3 && +wo === 1) || (+qs === 4)}}", " disabled", "{{ else if ((+solpc === 0 || !solpc || +sbmc ===0 || !sbmc) && +qs === 1 ) }}", " waitGuess", "{{ /if }}", '" data-loss="{{numToFix(solpc)}}" data-bankerId="{{sbid}}" data-balance="{{sbmc}}"  data-joinnum="{{sjoinAmount}}">', "{{ if (+qs === 3 && +wo === 2) }}", '<i class="guessSuccessIcon"></i>', "{{else if (+qs === 3 && +wo === 1) }}", '<i class="guessFailIcon"></i>', "{{else if (+qs === 4) }}", '<i class="guessFlowIcon"></i>', "{{ /if }}", '<p class="title', "{{ if (+qs >=3) }}", " guess-mgt-15", "{{ /if }}", '">{{son}}</p>', '<p class="peilv">', "{{ if ((+solpc === 0 || !solpc || +sbmc === 0 || !sbmc) && +qs === 1 ) }}", " 等待开猜", "{{ else if (+qs <= 2) }}", "赔率{{ numToFix(solpc)}}", "{{ /if }}", "</p>", "{{ if (!isAnchor && sjoin) }}", '<i class="icon-hasBid icon-hasBid-easy" data-option="2"></i>', "{{ /if }}", "</a>", "</div>", "</div>", '<div class="guess-game-box-footer clearfix difficult-guess">', '<div class="progress-left-default"></div>', '<div class="progress-right-default"></div>', '<div class="progress-left', "{{ if (+qs === 3 && +wo === 2)}}", " disabled", "{{ /if }}", '" style="width:{{per2(+fobc, +sobc, true) }}; data-bidNum="{{ fobc ? fobc : 0 }}"></div>', '<div class="progress-right', "{{ if (+qs === 3 && +wo === 1)}}", " disabled", "{{ /if }}", '" style="width:{{per2(+fobc, +sobc, false)}}; data-bidNum="{{ sobc ? sobc : 0 }}"></div>', '<span class="bidNum-left">{{ formatTotalBidNum(fobc) }}</span>', '<span class="bidNum-right">{{ formatTotalBidNum(sobc) }}</span>', '{{ if (!isAnchor) }}<i class="vs"></i>{{ /if }}', "</div>", "</div>", "{{ if (isAnchor || (identy === 2 && uid == suid)) }}", '<div class="guess-game-box-footer-plus">', '<div class="division"></div>', "{{ if (+qs === 1) }}", '<div class="foot-button foot-button-left stopBidBtn">封&nbsp;&nbsp;&nbsp;&nbsp;盘</div>', "{{ else }}", '<div class="foot-button foot-button-left stopBidBtn disable">已封盘</div>', "{{ /if }}", "{{ if (+qs === 1 || +qs === 2) }}", '<div class="foot-button foot-button-right endBtn">结&nbsp;&nbsp;&nbsp;&nbsp;束</div>', "{{ else }}", '<div class="foot-button foot-button-right endBtn disable">已结束</div>', "{{ /if }}", "</div>", "{{ /if }}", "</div>");
					return e
				},
				reRenderThemeTpl2: function() {
					var e = d.string.join("<div class=\"guess-game-box-theme guessTheme-mode2 {{ (+qs >= 3) ? 'guessEnd' : '' }}\"", ' data-qs="{{qs}}" data-suid="{{suid}}" data-sname="{{sname}}">', '<div class="guess-game-box-main">', '<div class="guess-game-box-header clearfix">', '<div class="box-left">{{qt}}</div>', '<div class="box-right">', "{{ if (isAnchor) }}", "{{ if (+qs === 1) }}", "{{ if (+et > 0) }}", '<span class="et" data-et="{{et}}">{{formatEt(et)}}</span>', "{{ /if }}", "{{ else if (+qs === 2) }}", '<span class="rightBar">已封盘</span>', "{{ else if (((+qs === 3 && +wo > 0) || (+qs === 4 && +ft === 0)) && ifShowFeedbackBtn) }}", "{{ if (!feedback) }}", '<span class="rightBar feedback">结错账反馈</span>', "{{ else }}", '<span class="rightBar">结错账已反馈</span>', "{{ /if }}", "{{ else if (+qs === 4 && +ft === 3) }}", '<span class="rightBar">主题违规流局</span>', "{{ /if }}", "{{ else }}", "{{ if (+qs === 1) }}", "{{ if (+et > 0 ) }}", '<span class="et" data-et="{{et}}">{{formatEt(et)}}</span>', "{{ /if }}", '{{ else if (+qs === 2 && scs === "0") }}', '<span class="rightBar">已封盘</span>', '{{ else if (+qs === 2 && scs === "1") }}', '<span class="rightBar">主播意外下播封盘', '<div class="sealTips">?', '<div class="tipsTextBox">', '<div class="tipsText">超过5分钟后未开播判为流局，</br>将返还您投注鱼丸</div>', '<div class="tipsArrow"></div>', "</div>", "</div>", "</span>", "{{ else if (+qs === 3) }}", "{{ if (ec && +ec >= 0) }}", '<span class="rightBar">赢{{ mathAbs(+ec) }}鱼丸</span>', "{{ else if (ec && +ec < 0) }}", '<span class="rightBar">输{{ mathAbs(+ec) }}鱼丸</span>', "{{ /if }}", "{{ else if (+qs === 4) }}", "{{ if (+ft === 3) }}", '<span class="rightBar">主题违规流局</span>', "{{ else if (ec && +ec === 0) }}", '<span class="rightBar">返还参与鱼丸</span>', "{{ /if }}", "{{ /if }}", "{{ /if }}", "</div>", "</div>", '<div class="guess-game-box-container">', '<div class="simple-item-hover">', '<a class="J-simple-item item-left', "{{ if (+qs === 3 && +wo === 2) || (+qs === 4)}}", " disabled", "{{ /if }}", '" data-loss="{{numToFix(op1pr)}}" data-bankerId="{{fbid}}" data-balance="{{fbmc}}" data-joinnum="{{fjoinAmount}}">', "{{ if (+qs === 3 && +wo === 1) }}", '<i class="guessSuccessIcon"></i>', "{{else if (+qs === 3 && +wo === 2) }}", '<i class="guessFailIcon"></i>', "{{else if (+qs === 4) }}", '<i class="guessFlowIcon"></i>', "{{ /if }}", '<p class="title">{{fon}}</p>', '<p class="peilv">赔率{{ numToFix(op1pr) }}</p>', "{{ if (!isAnchor && fjoin) }}", '<span class="icon-hasBid-easy" data-option="1">', '<div class="guess-bubble guess-bubble-oppsite tipsBubble">已投注：', '<span class="guess-color-ff7700">{{ fjoinAmount }}</span>', "</div>", "</span>", "{{ /if }}", "</a>", "</div>", '<div class="item-middle"></div>', '<div class="simple-item-hover">', '<a class="J-simple-item item-right', "{{ if (+qs === 3 && +wo === 1) || (+qs === 4)}}", " disabled", "{{ /if }}", '" data-loss="{{numToFix(op2pr)}}" data-bankerId="{{sbid}}" data-balance="{{sbmc}}" data-joinnum="{{sjoinAmount}}">', "{{ if (+qs === 3 && +wo === 2) }}", '<i class="guessSuccessIcon"></i>', "{{else if (+qs === 3 && +wo === 1) }}", '<i class="guessFailIcon"></i>', "{{else if (+qs === 4) }}", '<i class="guessFlowIcon"></i>', "{{ /if }}", '<p class="title">{{son}}</p>', '<p class="peilv">赔率{{ numToFix(op2pr)}}</p>', "{{ if (!isAnchor && sjoin) }}", '<span class="icon-hasBid-easy" data-option="2">', '<div class="guess-bubble tipsBubble">已投注：', '<span class="guess-color-ff7700">{{ sjoinAmount }}</span>', "</div>", "</span>", "{{ /if }}", "</a>", "</div>", "</div>", '<div class="guess-game-box-footer clearfix">', '<div class="fl progress-box-left">', '<div class="progress-left" style="width:{{per(+op1to, +op2to, true) }}; data-bidNum="{{ op1to ? op1to : 0 }}"></div>', '<span class="bidNum-left">{{ formatTotalBidNum(op1to) }}</span>', "</div>", '<div class="fr progress-box-right">', '<div class="progress-right" style="width:{{per(+op1to, +op2to, false)}}; data-bidNum="{{ op2to ? op2to : 0 }}"></div>', '<span class="bidNum-right">{{ formatTotalBidNum(op2to) }}</span>', "</div>", "</div>", "</div>", "{{ if (isAnchor || (identy === 2 && uid == suid)) }}", '<div class="guess-game-box-footer-plus">', '<div class="division"></div>', "{{ if (+qs === 1) }}", '<div class="foot-button foot-button-left stopBidBtn">封&nbsp;&nbsp;&nbsp;&nbsp;盘</div>', "{{ else }}", '<div class="foot-button foot-button-left stopBidBtn disable">已封盘</div>', "{{ /if }}", "{{ if (+qs === 1 || +qs === 2) }}", '<div class="foot-button foot-button-right endBtn">结&nbsp;&nbsp;&nbsp;&nbsp;束</div>', "{{ else }}", '<div class="foot-button foot-button-right endBtn disable">已结束</div>', "{{ /if }}", "</div>", "{{ /if }}", "</div>");
					return e
				},
				reRenderTheme: function(t, a) {
					var s = 1 == v.guessType ? b.render.reRenderThemeTpl1() : b.render.reRenderThemeTpl2(),
						n = e.extend({}, t, {
							index: a,
							isAnchor: m.isAnchor(),
							identy: b.getIdenty(),
							per: function(e, t, a) {
								return m.per(e, t, a)
							},
							per2: function(e, t, a) {
								var s = parseInt(e),
									i = parseInt(t),
									n = s + i;
								if (0 == n) return "0%";
								var r = a ? Math.floor(s / n * 100) : 100 - Math.floor(s / n * 100);
								return r > 95 ? r = 95 : 5 > r && (r = 5), r + "%"
							},
							numToFix: function(e) {
								return m.numToFix(e)
							},
							formatTotalBidNum: function(e) {
								return m.formatTotalBidNum(e)
							},
							mathAbs: function(e) {
								return m.mathAbs(e)
							},
							formatEt: function(e) {
								return m.formatEt(e)
							},
							ifShowFeedbackBtn: m.compareAnchorLevel(u.Model.vars.mainMsg.quiz_setting.change_result_min_level),
							uid: r.get("sys.uid")
						}),
						o = i.compile(s);
					return o(n)
				},
				bidAnimation: function(e, t) {
					var a = d.string.join('<div class="bid {{side}}">+{{number}}<i class="iconPop"></i></div>'),
						s = i.compile(a);
					return s({
						number: e,
						side: t
					})
				},
				hotTip: function(e) {
					var t = d.string.join('<div class="hotTip">{{hotText}}</div>'),
						a = i.compile(t);
					return a({
						hotText: e
					})
				},
				waitGuessBanner: function() {
					var e = d.string.join('<div class="waitGuessBanner"><i></i>当前无人开猜, 开猜也可赢鱼丸哦~ </div>'),
						t = i.compile(e);
					return t()
				},
				stopBidTip: function(e) {
					var t = d.string.join('<div class="stopBidTip">{{ tipMsg }}</div>'),
						a = i.compile(t);
					return a({
						tipMsg: e
					})
				},
				guessRecordBox: function(e) {
					var t = d.string.join("{{ if (option == 2) }}", '<div class="guessRecordBox option2" data-option="{{option}}">', "{{ else }}", '<div class="guessRecordBox" data-option="{{option}}">', "{{ /if }}", '<div class="arrowBox"></div>', "</div>"),
						a = i.compile(t);
					return a({
						option: e.quiz_option
					})
				},
				guessRecord: function(e, t) {
					var a = d.string.join('<div class="guessRecord" data-time="{{time}}">', '<div class="guessRecordContent">', '<p class="guessRecordTitle"><i></i>竞猜记录</p>', "{{ if (listData.bet_list.length > 0) }}", '<table class="HeaderBag">', '<tr><th class="firstRow">投注数</th><th class="secondRow">赔率</th><th class="thirdRow1">赢则得</th></tr>', "{{ each listData.bet_list }}", '<tr><td class="firstRow">{{formatTotalBidNum($value.amount)}}</td><td class="secondRow">{{numToFix($value.loss_per_cent)}}</td><td class="thirdRow1 income">{{$value.income}}</td></tr>', "{{ /each }}", "</table>", "{{ /if }}", "{{ if (listData.banker_list.length > 0) }}", '<table class="HeaderBag">', '<tr><th class="firstRow">开猜底金</th><th class="secondRow">赔率</th><th class="thirdRow">输则扣<p>(被买底金)</p></th><th class="fouthRow">赢则得</th></tr>', "{{ each listData.banker_list }}", '<tr><td class="firstRow">{{formatTotalBidNum($value.amount)}}</td><td class="secondRow">{{numToFix($value.loss_per_cent)}}</td><td class="income thirdRow">{{$value.used}}</td><td class="fouthRow income">{{calcSilverFunc($value.loss_per_cent, $value.used)}}</td></tr>', "{{ /each }}", "</table>", "{{ /if }}", "</div>", "</div>"),
						s = i.compile(a);
					return s({
						listData: e,
						formatTotalBidNum: function(e) {
							return m.formatTotalBidNum(e)
						},
						time: t,
						numToFix: function(e) {
							return m.numToFix(e)
						},
						calcSilverFunc: function(e, t) {
							var a = b.calcSilverFunc(e, t);
							return a ? m.formatTotalBidNum(a) : 0
						}
					})
				},
				ensureStopBid: function(e) {
					var t = d.string.join('<div class="ensureOutBox">', '<div class="ensureBox">', '<div class="ensureIcon"></div>', '<p style="font-weight:700;">确定要封盘吗？</p>', '<p class="row2">封盘后观众无法投注和开猜</p>', "<div>", '<div class="guess-btn-121 guess-btn-empty guess-mgr-20 cancelStopBid" data-qid="{{ qid }}">取&nbsp;&nbsp;消</div>', '<div class="guess-btn-121 comfirmStopBid" data-qid="{{ qid }}">确&nbsp;&nbsp;定</div>', "</div>", "</div>", '<div class="ensureIcon"></div>', '<div class="themeMask"></div>', "</div>"),
						a = i.compile(t);
					return a({
						qid: e.qid
					})
				}
			},
			getRoomType: function() {
				return v.roomType
			},
			hasDiffProperty: function(t, a) {
				var s = !1;
				return e.each(t, function(e, t) {
					return t !== a[e] && "et" != e ? (s = !0, !1) : void 0
				}), s
			},
			restartCountDown: function(t) {
				var a = this;
				t.length > 0 && (e.each(t, function(e, t) {
					a.countDown(t.qid)
				}), t.length = 0)
			},
			getPercent: function(e, t, a) {
				var s = parseInt(e),
					i = parseInt(t),
					n = s + i;
				if (0 == n) return "0%";
				var r = a ? s : i,
					o = Math.floor(r / n * 100);
				return o + "%"
			},
			delayShowCorner: function(e, t) {
				var a = this;
				a.cornerTimer[e] = setTimeout(function() {
					m.dys({
						key: "dys.room.guess-game.user.realtime.record.hover"
					}), t()
				}, 200)
			},
			clearCornerTimer: function(e) {
				var t = this,
					a = t.cornerTimer;
				clearTimeout(a[e]), delete a[e]
			},
			addGuessRecordLoading: function(t) {
				var a = this,
					s = a.render.guessRecordLoading(),
					i = e(s);
				t.append(i)
			},
			removeRecordLoading: function(e) {
				e.find(".guessRecordLoading").length > 0 && e.find(".guessRecordLoading").remove()
			},
			isSmallScreen: function() {
				var t = e("#js-room-video").width();
				return 684 > t
			},
			calcSilverFunc: function(e, t) {
				var a = this,
					s = +e / 100,
					i = +t,
					n = +u.Model.vars.mainMsg.quiz_setting.divided_rate,
					r = a.guessData.guessList;
				if (r.length > 0 && (n = 100 - Number(r[0].aktp)), s > 0) {
					var o = m.accDiv,
						d = m.accMul,
						c = Math.floor(d(o(i, s), o(n, 100)));
					return c
				}
				return !1
			},
			anchorDescAdvanceAdaption: function() {
				var e, t, a, s = this,
					i = s.doms;
				i && i.$manPanel && i.$manPanel.length && (e = i.$manPanel.find(".AnchorGuess-descAdvance"), t = i.$manPanel.find(".ActGuess2018-switch-logo"), e && e.length && (a = i.$manPanel.outerWidth(), 896 > a ? e.hide() : e.show()), t && t.length && (a = i.$manPanel.outerWidth(), 790 > a ? t.hide() : t.show()))
			},
			isPanelShow: function() {
				return this.doms.$manPanel && this.doms.$manPanel.hasClass("show")
			},
			getAuthority: function() {
				var a = this,
					s = e.Deferred();
				if (!c.check()) return s.resolve(), s.promise();
				if (a.clickStatus.authorityIsSending) return s.reject(), s.promise();
				if (a.data.authorityData) return s.resolve(a.data.authorityData), s.promise();
				var i = t.fire("mod.center.userrole.get");
				return i && e.isArray(i) ? (a.clickStatus.authorityIsSending = !0, e.ajax({
					url: a.url.authority,
					type: "GET",
					data: {
						room_id: r.get("room.room_id"),
						cate2_id: r.get("room.cate_id"),
						uid: r.get("sys.uid") || 0,
						is_anchor: m.isAnchor() ? 1 : 0,
						is_manager: i.isRoomAdmin() ? 1 : 0,
						t: (new Date).getTime()
					},
					dataType: "JSON",
					success: function(e) {
						a.clickStatus.authorityIsSending = !1, 0 == e.error ? (a.data.authorityData = e.data, s.resolve(e.data)) : s.resolve()
					},
					error: function(e) {
						a.clickStatus.authorityIsSending = !1, s.resolve()
					}
				})) : s.resolve(), s.promise()
			},
			getAuthoritySet: function() {
				var e, t = this;
				return e = !(!t.data.authorityData || 1 !== t.data.authorityData.change_start)
			},
			getIdenty: function() {
				var e, t = this,
					a = +r.get("sys.uid"),
					s = +r.get("room.owner_uid");
				return e = a === s ? 3 : t.data.authorityData && 1 === t.data.authorityData.can_start_quiz ? 2 : 1
			},
			guessIsEnd: function() {
				var t = this,
					a = (t.doms, !0),
					s = 0,
					i = !1,
					n = "",
					o = +r.get("sys.uid");
				return e.each(t.guessData.guessList, function(e, t) {
					var r = +t.qs;
					3 > r && (a = !1, s++);
					var d = +t.suid;
					n = t.sname, i = o !== d
				}), {
					isEndFlag: a,
					guessingNum: s,
					isOrtherStartGuess: i,
					sname: n
				}
			},
			changeHeader: function() {
				var e = this,
					t = e.doms,
					a = b.getIdenty();
				if (a > 1) {
					var s = t.$manPanel.find(".J-headerNotice"),
						i = t.$manPanel.find(".batch"),
						n = t.$manPanel.find(".J-batchSubmit"),
						r = t.$manPanel.find(".J-resetGuessGame"),
						o = e.guessIsEnd(),
						d = !1;
					o.isEndFlag ? (i.hide(), n.hide(), r.show()) : (3 === a && o.isOrtherStartGuess ? s.html('<span class="guessUserName" title="' + o.sname + '">' + o.sname + "</span>发起的竞猜") : 3 === a ? s.html("") : 2 !== a || o.isOrtherStartGuess ? (d = !0, i.hide(), n.hide(), r.hide()) : s.html(""), d || (r.hide(), i.show(), n.show()))
				}
			},
			countDown: function(t) {
				var a = this,
					s = a.doms,
					i = a.guessData.timer;
				i[t] || (i[t] = setInterval(function() {
					if (!s.$manPanel) return clearInterval(i[t]), void delete i[t];
					var n = s.$manPanel.find('[data-qid="' + t + '"]').find(".et");
					if (!a.isPanelShow() || 0 === n.length) return clearInterval(i[t]), void delete i[t];
					if (second = n.attr("data-et"), second -= 1, second < 0) return clearInterval(i[t]), void delete i[t];
					n.attr("data-et", second);
					var r = parseInt(second / 60);
					10 > r && (r = "0" + r);
					var o = parseInt(second % 60);
					10 > o && (o = "0" + o);
					var d = r + ":" + o + "后封盘";
					n.text(d);
					var c = e(".ancher-result").find('[data-qid="' + t + '"]');
					c && c.length > 0 && c.find(".ancher-result_min").text(d)
				}, 1e3))
			},
			countDownLoop: function() {
				var t = this,
					a = t.doms,
					s = a.$manPanel.find(".et");
				0 !== s.length && s.each(function(a, s) {
					var i = parseInt(e(this).attr("data-et")),
						n = +e(this).parents(".guess-game-box").attr("data-qid");
					i > 0 && t.countDown(n)
				})
			},
			addLoading: function() {
				var e = this,
					t = e.doms,
					a = e.render.recommendLoading();
				t.$guessBoxBody.append(a)
			},
			removeLoading: function() {
				var e = this,
					t = e.doms,
					a = t.$manPanel.find(".loadingBox");
				a.length > 0 && a.remove()
			},
			getAnchorRecommend: function(t) {
				var a = this,
					s = a.doms;
				s.$guessBoxBody.find(".hasGuessBox").length > 0 || m.sendAjax({
					url: a.url.recommendList,
					type: "GET",
					data: {
						t: (new Date).getTime()
					},
					success: function(s) {
						a.removeLoading();
						var i = s.data;
						0 === s.error && e.isArray(i) ? t && t({
							list: i
						}) : e.dialog.tips_black(s.msg)
					},
					error: function() {
						a.removeLoading()
					}
				}, !0)
			},
			updateFishBall: function() {
				var t = this,
					a = t.doms,
					s = e("#js-stats-and-actions"),
					i = s.find('[data-login-user="silver"]').text();
				a.$manPanel.find('[data-login-user="silver"]').text(i)
			},
			guessMainPanelShowAnimation: function(e) {
				var t = this,
					a = t.doms,
					s = setTimeout(function() {
						a.$manPanel.addClass("show"), e && e(), clearTimeout(s)
					}, 10)
			},
			saveJoinToPool: function(e, t, a, s) {
				var i, n = this;
				1 == +t ? i = {
					qid: e,
					fjoin: a,
					fjoinAmount: s || 0
				} : 2 == +t && (i = {
					qid: e,
					sjoin: a,
					sjoinAmount: s || 0
				}), n.guessData.userJoinPool.push(i)
			},
			handleUserJoinPool: function(t, a) {
				var s = this,
					i = s.doms,
					n = s.guessData.guessList,
					r = n.length;
				if (r > 0) {
					for (var o = 0, d = t.length; d > o; o++) for (var c = t[o], l = 0; r > l; l++) {
						var g = n[l];
						if (g.qid === c.qid && s.hasDiffProperty(c, g) && (e.extend(g, c), !a && i.$manPanel)) {
							var u = i.$manPanel.find('.guess-game-box[data-qid="' + g.qid + '"]');
							u.length > 0 && s.updateTheme(g, l, u.find(".guess-game-update-box"))
						}
					}
					t.length = 0
				}
			},
			initUserCornerByLua: function() {
				var t = this;
				if (t.guessData.guessList.length > 0 && !t.data.hasGetCorner) {
					if (t.clickStatus.myJoinStatusSending) return;
					t.clickStatus.myJoinStatusSending = !0;
					var a = [];
					e.each(t.guessData.guessList, function(e, t) {
						a.push(+t.qid)
					});
					var s = {
						room_id: +r.get("room.room_id"),
						user_id: +r.get("sys.uid"),
						quiz_list: a.join(","),
						t: (new Date).getTime()
					};
					e.ajax({
						url: t.url.myJoinStatus,
						type: "GET",
						data: s,
						dataType: "JSON",
						success: function(a) {
							t.clickStatus.myJoinStatusSending = !1, 0 === a.error && e.isPlainObject(a.data) && (t.data.hasGetCorner = !0, e.each(a.data.join_list, function(e, a) {
								t.saveJoinToPool(a.qid, a.opt, !0, 0)
							}), t.handleUserJoinPool(t.guessData.userJoinPool, !1))
						},
						error: function(e) {
							t.clickStatus.myJoinStatusSending = !1
						}
					})
				}
			},
			initUserEasyCornerByLua: function() {
				var t = this;
				if (t.guessData.guessList.length > 0 && !t.data.hasGetCorner) {
					if (t.clickStatus.myJoinStatusSending) return;
					t.clickStatus.myJoinStatusSending = !0;
					var a = [];
					e.each(t.guessData.guessList, function(e, t) {
						a.push(+t.qid)
					});
					var s = {
						room_id: +r.get("room.room_id"),
						user_id: +r.get("sys.uid"),
						quiz_list: a.join(","),
						t: (new Date).getTime()
					};
					e.ajax({
						url: t.url.mySimpleJoinStatus,
						type: "GET",
						data: s,
						dataType: "JSON",
						success: function(a) {
							t.clickStatus.myJoinStatusSending = !1, 0 === a.error && e.isPlainObject(a.data) && (t.data.hasGetCorner = !0, e.each(a.data.join_list, function(e, a) {
								t.saveJoinToPool(a.qid, a.opt, !0, a.amount || 0)
							}), t.handleUserJoinPool(t.guessData.userJoinPool, !1))
						},
						error: function(e) {
							t.clickStatus.myJoinStatusSending = !1
						}
					})
				}
			},
			ifShowSliderBar: function() {
				var t = this,
					a = t.doms,
					s = e("#js-room-video").width(),
					i = e("#guess-main-panel").find(".hasGuessBox");
				1e3 > s ? y.guessModeTipsSwitch(0) : y.guessModeTipsSwitch(1);
				var n = a.$manPanel.find(".batch");
				900 > s ? n.hide() : n.show();
				var r = i.width();
				if (r > s) {
					var o = r - s;
					t.sliderData.maxRight == t.sliderData.currentRight && 0 != t.sliderData.currentRight && o < t.sliderData.maxRight && (t.sliderData.currentRight = o, a.$guessBoxBody.css({
						right: t.sliderData.currentRight
					})), t.sliderData.maxRight = o, e("#guess-main-panel").attr("data-slidecanshow", "yes")
				} else t.sliderData.currentRight = 0, t.sliderData.maxRight = 0, e("#guess-main-panel").attr("data-slidecanshow", "no"), a.$guessBoxBody.css({
					right: 0
				})
			},
			closeMainPanel: function() {
				var e = this,
					t = e.doms;
				t.$manPanel.removeClass("show");
				var a = setTimeout(function() {
					t.$manPanel.remove(), t.$manPanel = void 0, clearTimeout(a)
				}, 350);
				e.clearSliderData()
			},
			clearSliderData: function() {
				var e = this;
				e.sliderData.currentRight = 0, e.sliderData.maxRight = 0
			},
			waitGuessAnimation: function(t) {
				var a = this;
				if (!(t.find(".waitGuessBanner").length > 0)) {
					var s = a.render.waitGuessBanner(),
						i = e(s);
					t.append(i), i.fadeIn();
					var n = setTimeout(function() {
						i.fadeOut(300, function() {
							i.remove()
						}), clearTimeout(n)
					}, 3e3)
				}
			},
			removeAllWaitguess: function() {
				var e = this,
					t = e.doms;
				t.$manPanel.find(".waitGuessBanner").remove()
			},
			screenAdaption: function() {
				var e = this,
					t = e.doms;
				e.isSmallScreen() ? e.isPanelShow() && !t.$manPanel.hasClass("smallScreen") && t.$manPanel.addClass("smallScreen") : e.isPanelShow() && t.$manPanel.hasClass("smallScreen") && t.$manPanel.removeClass("smallScreen")
			},
			anchorRecommendAdaption: function() {
				var e = this,
					t = e.doms;
				if (e.isPanelShow() && t.$manPanel.find(".guessGuideList").length > 0) {
					var a = m.suitVideoChange();
					t.$manPanel.find(".guessGuideListBox").removeClass("big4").removeClass("big3").removeClass("small3"), t.$manPanel.find(".guessGuideListBox").addClass(a)
				}
			},
			removeAllStopBid: function() {
				var e = this,
					t = e.doms;
				t.$manPanel.find(".ensureOutBox").remove()
			},
			showHasBidList: function(t, a, s) {
				var i = this,
					n = (i.doms, t.find('.guessRecordBox[data-option="' + a.quiz_option + '"]'));
				n.length > 0 && n.remove();
				var r = t.find(".guessRecordBox");
				r.hide();
				var o = i.render.guessRecordBox({
					quiz_option: a.quiz_option
				}),
					d = e(o);
				t.append(d), i.addGuessRecordLoading(d), m.sendAjax({
					url: i.url.guessRecordByLua,
					type: "GET",
					data: a,
					success: function(t) {
						if (i.removeRecordLoading(d), 0 === t.error) {
							var n = (new Date).getTime(),
								r = a.quiz_id + "-" + a.quiz_option,
								o = t.data.banker_list.length + t.data.bet_list.length;
							if (o > 0) {
								s && (i.data.hasGetEndData[r] = t.data);
								var c = i.render.guessRecord(t.data, n),
									l = e(c);
								d.append(l), l.find(".guessRecordContent").mCustomScrollbar(), l.fadeIn(300)
							}
						}
					},
					error: function() {
						i.removeRecordLoading(d)
					}
				}, !0)
			},
			stopBidTip: function(t, a) {
				var s = this,
					i = t.find(".stopBidTip");
				if (i && 0 === i.length) {
					var n = s.render.stopBidTip(a),
						r = e(n);
					t.append(r), r.fadeIn(100);
					var o = setTimeout(function() {
						r.fadeOut(), clearTimeout(o)
					}, 2e6)
				}
			},
			bidAnimation: function(t, a) {
				var s = this,
					i = s.render.bidAnimation(a.num, a.side),
					n = e(i),
					r = t.find(".item-" + a.side),
					o = "left" === a.side ? "right" : "left",
					d = t.find(".item-" + o);
				t.append(n), n.animate({
					top: 27
				}, {
					duration: 1e3,
					easing: "easeOutCirc",
					complete: function() {
						n.fadeOut("slow", function() {
							n.remove()
						})
					}
				});
				var c = r.parents(".guess-game-box"),
					l = c.find(".footer-" + a.side).find(".bidNum"),
					g = +l.attr("data-bidNum"),
					u = g + a.num;
				l.text(m.formatTotalBidNum(u)), l.attr("data-bidNum", u);
				var p = c.find(".footer-" + o).find(".bidNum").attr("data-bidNum"),
					f = s.getPercent(u, p, 1),
					h = s.getPercent(u, p, 0);
				r.find(".progress").css({
					width: f
				}), d.find(".progress").css({
					width: h
				})
			},
			updateGuessList: function() {
				var e = this,
					t = e.doms,
					a = this.guessData.guessList,
					s = a.length;
				if (s > 0 && t.$manPanel) for (var i = 0; s > i; i++) {
					var n = t.$manPanel.find('.guess-game-box[data-qid="' + a[i].qid + '"]');
					n.length > 0 && this.updateTheme(a[i], i, n.find(".guess-game-update-box"))
				}
			},
			showNewGuideGuess201808: function() {
				var t = JSON.parse(n.get(h.NEWGUIDEGUESS));
				if (!t) {
					var a = this.render.newGuide2018();
					this.doms.$manPanel.append(e(a)), n.set(h.NEWGUIDEGUESS, JSON.stringify(!0)), e(".J-guide-201808-closeBtn").on("click", function() {
						e(".newMask-201808").remove()
					})
				}
			},
			newMallGoods: function() {
				var t = this;
				m.sendAjax({
					url: t.url.showMallTip,
					data: {},
					type: "GET",
					success: function(t) {
						var a = n.get("MallTipType");
						0 === t.error && 1 == t.data.is_new && t.data.type != a && (n.set("MallTipType", t.data.type), e(".fishball-mall-tip").show(), setTimeout(function() {
							e(".fishball-mall-tip").hide()
						}, 5e3))
					}
				}, !0)
			},
			reqDescAdvance: function() {
				var t = this,
					a = t.actGuessConfig,
					s = e.Deferred();
				return c.check() ? r.get("sys.uid") == r.get("room.owner_uid") ? s.resolve([]) : a.descAdvanceConfig && a.descAdvanceConfig.length ? s.resolve(a.descAdvanceConfig) : a.reqDescAdvanceing ? s : (a.reqDescAdvanceing = 1, m.sendAjax({
					url: "/japi/sign/web/getinfo",
					type: "POST",
					data: {
						posid: [411101].join(","),
						roomid: r.get("room.room_id"),
						uid: $SYS.uid || 0,
						cate1: r.get("room.cate_id") || 0,
						cate2: r.get("room.child_id") || 0,
						ver: "180606"
					},
					success: function(e) {
						return a.reqDescAdvanceing = 0, e && 0 === e.error && e.data ? (a.descAdvanceConfig = e.data || [], s.resolve(a.descAdvanceConfig)) : void s.resolve(a.descAdvanceConfig)
					},
					error: function(e) {
						return a.reqDescAdvanceing = 0, s.resolve(a.descAdvanceConfig)
					}
				}, !0), s) : (s.resolve(), s.promise())
			},
			reqShowDescAdvance: function() {
				var e, t = this,
					a = t.actGuessConfig,
					s = g.helper.getAdInfoInData(411101) || {},
					i = [];
				r.get("sys.uid") != r.get("room.owner_uid") && (a.isShowDescDp || a.isShowDescReqing || (a.isShowDescReqing = 1, s && s.posid && (e = {
					rid: r.get("room.room_id"),
					cid: s.cid,
					proid: s.proid,
					oaid: s.oaid,
					mid: s.mid,
					gid: s.gid,
					posid: s.posid,
					isthird: s.isthird,
					taid: s.taid,
					tpid: s.tpid,
					tmid: s.tmid,
					ext: JSON.stringify(s.ext)
				}, s.i_track_url && s.i_track_url.length > 0 && g.helper.exposure(s), i.push(e)), m.sendAjax({
					url: "/lapi/sign/web/rtpv",
					type: "POST",
					data: {
						ver: "180606",
						data: JSON.stringify(i)
					},
					success: function(e) {
						a.isShowDescDp = 1, a.isShowDescReqing = 0
					},
					error: function(e) {
						a.isShowDescReqing = 0
					}
				}, !0)))
			},
			returnAdConfig: function(e) {
				for (var t = this.actGuessConfig.advanceConfig || [], a = 0; a < t.length; a++) if (t[a].posid == e) return t[a];
				return null
			},
			initMainPanel: function() {
				var t = this,
					a = t.doms;
				a.container = e(v.roomType ? "#js-room-guess-panel" : "#js-room-video"), t.isPanelShow() || e.when(t.getAuthority(), t.reqDescAdvance()).then(function(s, i) {
					i && i.length && (g.helper.pushPageAdvar(i), t.reqShowDescAdvance()), 1 == b.getRoomType() && (e("#js-room-guess-panel").addClass("js-room-guess-panel"), e("#js-room-guess-panel").addClass("show"));
					var n = t.render.mainPanel(t.guessData);
					if (a.$manPanel = e(n), a.container.append(a.$manPanel), a.$guessBoxHeader = e(".guess-main-panel-header"), a.$guessBoxBody = e(".guess-game-box-body"), b.guessData.sendGiftGuideCountDown > 0 && 1 == v.roomType && (u.guessEntryAPP.showSendGiftGuide(b.guessData.sendGiftGuideCountDown), b.guessData.sendGiftGuideCountDown = 0), t.showNewGuideGuess201808(), t.guessData.guessList.length > 0) t.mainPanelToBegin(!1);
					else if (m.isAnchor()) {
						var r = t.render.selfNoSetGuessGame();
						a.$noGuessBox = e(r), a.$guessBoxBody.html(a.$noGuessBox)
					} else t.getAnchorRecommend(function(s) {
						if (!(a.$guessBoxBody.find(".hasGuessBox").length > 0)) {
							var i = t.render.anchorNoSetGuessGame(s);
							a.$noGuessBox = e(i), a.$guessBoxBody.html(a.$noGuessBox);
							var n = setTimeout(function() {
								a.$noGuessBox.addClass("show"), clearTimeout(n)
							}, 10)
						}
					});
					t.updateFishBall(), t.guessMainPanelShowAnimation(function() {
						t.ifShowSliderBar(), t.bindMainPanelEvent()
					})
				})
			},
			bindMainPanelEvent: function() {
				var a = this,
					s = a.doms;
				s.$manPanel.on("mouseover", function() {
					var t = e(this);
					"yes" === t.attr("data-slidecanshow") && t.find(".slide-bar").show()
				}).on("mouseout", function() {
					var t = e(this);
					t.find(".slide-bar").hide()
				}), s.$manPanel.on("click", ".left-bar", function() {
					var e = a.sliderData.currentRight - a.sliderData.step;
					if (0 > e) {
						var t = a.sliderData.currentRight;
						if (!(t > 0 && t < a.sliderData.step)) return;
						e = 0
					}
					a.sliderData.currentRight = e, s.$guessBoxBody.animate({
						right: a.sliderData.currentRight
					})
				}), s.$manPanel.on("click", ".right-bar", function() {
					var e = a.sliderData.currentRight + a.sliderData.step;
					if (e > a.sliderData.maxRight) {
						var t = a.sliderData.maxRight - a.sliderData.currentRight;
						if (!(t > 0 && t < a.sliderData.step)) return;
						e = a.sliderData.maxRight
					}
					a.sliderData.currentRight = e, s.$guessBoxBody.animate({
						right: a.sliderData.currentRight
					})
				}), s.$manPanel.on("click", ".J-fansHappy", function() {
					u.guessActive.showActiveDialog()
				}), s.$manPanel.on("click", ".item", function() {
					if (!c.check()) return void c.show("login");
					if (a.data.hasGetCorner) {
						var t = e(this),
							s = +t.parents(".guess-game-box-theme").attr("data-qs"),
							i = t.hasClass("waitGuess"),
							n = +t.attr("data-balance");
						if (!m.isAnchor() && i) {
							var r = t.parents(".guess-game-box");
							a.waitGuessAnimation(r)
						}
						if (!(s >= 2 || m.isAnchor() || i || 0 === n)) {
							a.removeAllWaitguess();
							var o = null;
							t.hasClass("item-left") ? o = "left" : t.hasClass("item-right") && (o = "right");
							var d = t.parents(".guess-game-box"),
								l = {
									guessType: "",
									leftOrRight: o,
									odds: t.attr("data-loss"),
									sbid: t.attr("data-bankerid"),
									qid: d.attr("data-qid"),
									leaves: t.attr("data-balance"),
									joinnum: 0
								};
							u.guessPopup.showBetting(d, l, function(e) {
								a.bidAnimation(d, {
									num: e,
									side: o
								})
							}), m.dys({
								key: "dys.room.guess-game.item.click",
								type: 1
							})
						}
					}
				}), s.$manPanel.on("click", ".icon-hasBid", function(e) {
					e.stopPropagation()
				}).on("mousedown", ".icon-hasBid", function(e) {
					e.stopPropagation()
				}).on("mouseup", ".icon-hasBid", function(e) {
					e.stopPropagation()
				}), s.$manPanel.on("mouseover", ".icon-hasBid", function(t) {
					var s = e(this),
						i = e(this).data("option"),
						n = s.parents(".guess-game-box"),
						o = n.find(".guessRecordBox"),
						d = n.find('.guessRecordBox[data-option="' + i + '"]'),
						c = n.data("qid"),
						l = c + "-" + i;
					a.clearCornerTimer(l);
					var g = (new Date).getTime();
					if ("end" !== a.data.activityStatus) {
						var u = d.find(".guessRecord").data("time");
						u = u ? +u : 0;
						var m = g - u;
						if (d.length > 0 && 5e3 >= m) o.hide(), a.delayShowCorner(l, function() {
							d.show()
						});
						else {
							var p = {
								room_id: +r.get("room.room_id"),
								user_id: +r.get("sys.uid"),
								quiz_id: c,
								quiz_option: i
							};
							a.delayShowCorner(l, function() {
								a.showHasBidList(n, p)
							})
						}
					} else if (d.length > 0 && a.data.hasGetEndData[l]) o.hide(), a.delayShowCorner(l, function() {
						d.show()
					});
					else {
						var p = {
							room_id: +r.get("room.room_id"),
							user_id: +r.get("sys.uid"),
							quiz_id: c,
							quiz_option: i
						};
						a.delayShowCorner(l, function() {
							a.showHasBidList(n, p, !0)
						})
					}
				}).on("mouseout", ".icon-hasBid", function(t) {
					var s = e(this),
						i = e(this).data("option"),
						n = s.parents(".guess-game-box"),
						r = n.find('.guessRecordBox[data-option="' + i + '"]'),
						o = n.data("qid"),
						d = o + "-" + i;
					a.clearCornerTimer(d), r.hide()
				}), s.$manPanel.on("mouseover", ".guessRecordBox", function(t) {
					var a = e(this);
					a.show()
				}).on("mouseout", ".guessRecordBox", function(t) {
					var a = e(this);
					a.hide()
				}), s.$manPanel.on("click", ".J-simple-item", function() {
					if (!c.check()) return void c.show("login");
					if (a.data.hasGetCorner) {
						var t = e(this),
							s = +t.parents(".guess-game-box-theme").attr("data-qs"); + t.attr("data-balance");
						if (!(s >= 2 || m.isAnchor())) {
							var i = null;
							t.hasClass("item-left") ? i = "left" : t.hasClass("item-right") && (i = "right");
							var n = t.parents(".guess-game-box"),
								r = {
									guessType: "easy",
									leftOrRight: i,
									odds: t.attr("data-loss"),
									sbid: t.attr("data-bankerid"),
									qid: n.attr("data-qid"),
									leaves: t.attr("data-balance"),
									joinnum: t.attr("data-joinnum")
								};
							u.guessPopup.showBetting(n, r, function(e) {
								a.bidAnimation(n, {
									num: e,
									side: i
								})
							}), m.dys({
								key: "dys.room.guess-game.item.click",
								type: 2
							})
						}
					}
				}), s.$manPanel.on("click", ".beginGuess", function() {
					if (!c.check()) return void c.show("login");
					if (a.data.hasGetCorner) {
						var t = e(this).parents(".guess-game-box"),
							s = {
								title: t.attr("data-qt"),
								chooseOne: t.attr("data-fon"),
								chooseTwo: t.attr("data-son"),
								fishBall: e(".fishBall_NUM").html(),
								qid: t.attr("data-qid")
							};
						a.removeAllWaitguess(), u.guessPopup.showDealer(s), m.dys({
							key: "dys.room.guess-game.user.beginguess"
						})
					}
				}), s.$manPanel.on("click", ".endBtn", function() {
					if (!e(this).hasClass("disable")) {
						var t = e(this).parents(".guess-game-box"),
							a = [{
								title: t.attr("data-qt"),
								chooseOne: t.attr("data-fon"),
								chooseTwo: t.attr("data-son"),
								endTime: e(this).parents(".guess-game-box").find(".et").text(),
								qid: t.attr("data-qid")
							}];
						u.guessPopup.showAncherResult(a, v.guessType), m.dys({
							key: "dys.room.guess-game.anchor.batchend",
							is_anch: m.isAnchor() ? 1 : 0,
							type: 1
						})
					}
				}), s.$manPanel.on("click", ".J-batchSubmit", function() {
					u.guessPopup.showAncherResult(u.guessPopup.submitResultNum(), v.guessType), m.dys({
						key: "dys.room.guess-game.anchor.batchend",
						is_anch: m.isAnchor() ? 1 : 0,
						type: 2
					})
				}), s.$manPanel.on("click", ".stopBidBtn", function() {
					if (!e(this).hasClass("disable")) {
						a.removeAllStopBid();
						var t = e(this).parents(".guess-game-box");
						if (!(t.find(".ensureOutBox").length > 0)) {
							var i = t.attr("data-qid"),
								n = a.render.ensureStopBid({
									qid: i
								});
							s.$ensureOutBox = e(n), t.append(s.$ensureOutBox)
						}
					}
				}), s.$manPanel.on("click", ".comfirmStopBid", function() {
					var t = e(this),
						s = t.data("qid"),
						i = t.parents(".ensureOutBox");
					t.parents(".guess-game-box");
					m.sendAjax({
						url: a.url.closeQuiz,
						type: "POST",
						data: {
							room_id: +r.get("room.room_id"),
							quiz_id: s,
							play_type: v.guessType
						},
						success: function(t) {
							i.remove();
							var a = +t.error;
							0 === a ? e.dialog.tips_black("封盘成功") : 514028 !== a && 514026 !== a && 514027 !== a || e.dialog.tips_black(t.msg)
						},
						error: function() {
							i.remove()
						}
					})
				}), s.$manPanel.on("click", ".cancelStopBid", function() {
					var t = e(this).parents(".ensureOutBox");
					t.remove()
				}), s.$manPanel.on("click", ".J-guessMode-simpleTips-closeBtn", function() {
					e(".J-guessMode-simpleTips-notip.active") && e(".J-guessMode-simpleTips-notip.active").length > 0 && n.set(h.SIMPLETIPS, !0), e(".JS-guessMode-simpleTips").remove()
				}), s.$manPanel.on("click", ".J-guessMode-simpleTips-notip", function(t) {
					var a = e(t.target);
					a.hasClass("active") ? a.removeClass("active") : a.addClass("active")
				}), s.$manPanel.on("click", ".J-guessGameStartBtn", function() {
					return $ROOM.try_show ? (e.dialog({
						content: "未实名认证，该功能暂不可用",
						lock: !0,
						button: [{
							name: "前往实名认证",
							callback: function() {
								window.open("/member/cp/changeIdent")
							}
						}, {
							name: "我知道了"
						}]
					}), !1) : void u.guessPopup.showSetting()
				}), s.$manPanel.on("click", ".J-resetGuessGame", function() {
					u.guessPopup.showSetting()
				}), s.$manPanel.on("click", ".guessGuideBox", function() {
					var t = e(this).attr("data-rid");
					m.dys({
						key: "dys.room.guess-game.user.recommend.click",
						rid: t
					})
				}), s.$manPanel.on("click", ".feedback", function() {
					var t, s = e(this),
						i = s.parents(".guess-game-box"),
						n = i.attr("data-fon"),
						r = i.attr("data-son"),
						o = i.find(".win");
					if (o.length > 0) {
						var d = o.hasClass("item-left");
						t = {
							wo: d ? 1 : 2,
							wo_name: d ? n : r
						}
					} else t = {
						wo: 3,
						wo_name: "流局"
					};
					var c = {
						title: i.attr("data-qt"),
						chooseOne: n,
						chooseTwo: r,
						qid: i.attr("data-qid"),
						oldWinOption: t
					};
					p.init(c, a)
				}), s.$manPanel.on("click", ".JS-fishball-rank", function() {
					f.showRank()
				}), s.$manPanel.on("click", ".JS-fishball-mall", function() {
					var e = JSON.stringify({
						room_id: $ROOM.room_id
					});
					m.dys({
						key: "dys.room.guess-game.mall-ennter.click"
					}), window.open(u.Model.vars.mainMsg.shop.mallurl + "?share_token=" + m.base64_encode(e))
				}), s.$manPanel.on("click", ".J-myGuess", function() {
					m.dys({
						key: "dys.room.guess-game.user.record.click"
					})
				}), s.$manPanel.on("click", ".J-helpBtn", function() {
					m.dys({
						key: "dys.room.guess-game.user.help.click"
					})
				}), s.$manPanel.on("click", ".J-setAuthority", function() {
					m.dys({
						key: "dys.room.guess-game.anchor.quizset.click"
					}), u.guessPopup.showPowerSet()
				}), s.$manPanel.on("click", ".J-myMore", function() {
					var e = s.$manPanel.find(".mask");
					m.isAnchor() && e.length > 0 && e.remove()
				}), s.$manPanel.on("click", ".guess-main-panel-close", function() {
					u.guessPopup.removeSome(), m.isAnchor() && p.removeFeedbackPopup(), a.closeMainPanel()
				}), s.$manPanel.on("click", ".AnchorGuess-descAdvance", function() {
					t.trigger("mod.sign.dot", 411101)
				}), e(window).on("resize", function() {
					var e = setTimeout(function() {
						a.ifShowSliderBar(), a.screenAdaption(), a.anchorRecommendAdaption(), clearTimeout(e)
					}, 20)
				}), e(document).on("click", ".left-btn", function() {
					var e = setTimeout(function() {
						a.ifShowSliderBar(), a.screenAdaption(), a.anchorRecommendAdaption(), clearTimeout(e)
					}, 20)
				}), t.on("mod.userinfo.updateSilverGold", function(t) {
					a.isPanelShow() && !isNaN(t.silver) && (s.$manPanel.find('[data-login-user="silver"]').text(t.silver), e(".guess-tip-dealer").length > 0 && e(".guess-tip-dealer").find('[data-login-user="silver"]').text(t.silver))
				})
			},
			mainPanelToBegin: function(t) {
				var a = this,
					s = a.doms;
				if (s.$manPanel) {
					var i = a.render.guessGameBox(a.guessData, t);
					s.$hasGuessBox = e(i), s.$guessBoxBody.html(s.$hasGuessBox), a.changeHeader(), a.ifShowSliderBar(), a.countDownLoop(), v.setGuessType(), t && setTimeout(function() {
						s.$hasGuessBox.removeClass("hasAnimate")
					}, 20), a.updateGuessList()
				}
			},
			cPlusDataDistribution: function(e, t) {
				var a = s.isArray(e) ? s.decode(e) : [{
					value: e
				}],
					i = null;
				switch (t) {
				case 1:
					break;
				case 2:
					i = b.guessData.guessStatusPool, b.guessData.guessStatusPool.length = 0;
					break;
				case 3:
					i = b.guessData.guessEndPool, b.guessData.guessEndPool.length = 0;
					break;
				case 4:
					i = b.guessData.guessSingleEndPool, b.guessData.guessSingleEndPool.length = 0
				}
				for (var n = 0, r = a.length; r > n; n++) {
					var o = a[n].value && s.decode(a[n].value).too();
					o && i.push(o)
				}
			},
			addHot: function(t, a) {
				var s = this,
					i = t.find(".hotTip");
				if (i && 0 === i.length) {
					var n = s.render.hotTip(a),
						r = e(n);
					t.append(r), r.fadeIn(1e3);
					var o = setTimeout(function() {
						r.fadeOut(1e3), clearTimeout(o)
					}, 5e3)
				}
			},
			updateTheme: function(e, t, a) {
				var s = this,
					i = s.doms;
				if (i.$manPanel) {
					var n = s.render.reRenderTheme(e, t);
					a.html(n)
				}
			},
			handleSingleEndPool: function(t, a) {
				var s = this,
					i = s.doms,
					n = +r.get("sys.uid"),
					o = s.guessData.guessList,
					d = o.length;
				if (d > 0) {
					for (var c = 0, l = t.length; l > c; c++) for (var g = t[c], u = 0; d > u; u++) {
						var m = o[u];
						if (m.qid === g.qid && (e.extend(m, {
							ec: g.ec
						}), !a && i.$manPanel)) {
							var p = i.$manPanel.find('.guess-game-box[data-qid="' + m.qid + '"]');
							if (p.length > 0) {
								s.updateTheme(m, u, p.find(".guess-game-update-box"));
								var f = s.getIdenty(); + m.aktp > 0 && (1 === f || 2 === f && n != m.suid) && 0 !== +m.ec && s.addHot(p, "已为主播增加热度值")
							}
						}
					}
					t.length = 0
				}
			},
			handleStatusPool: function() {
				for (var t = this, a = t.doms, s = +r.get("sys.uid"), i = !1, n = !1, o = !1, d = t.guessData.guessList, c = t.guessData.guessStatusPool, l = 0, g = c.length; g > l; l++) for (var u = c[l], m = 0, p = d.length; p > m; m++) {
					var f = d[m];
					if (f.qid == u.qid) {
						if (t.hasDiffProperty(u, f)) {
							if (+u.qs !== +f.qs && (i = !0, 2 === +f.qs && 1 === +u.qs && (n = !0, t.guessData.restartPool.push({
								qid: u.qid
							})), 3 === +u.qs && (o = !0)), e.extend(f, u), t.isPanelShow()) {
								var h = a.$manPanel.find('.guess-game-box[data-qid="' + f.qid + '"]');
								if (h.length > 0) {
									t.updateTheme(f, m, h.find(".guess-game-update-box"));
									var v = t.getIdenty();
									if (o && +f.aktp > 0 && (3 === v || 2 === v && s == f.suid) && (+f.fobc > 0 || +f.sobc > 0)) {
										var y = 3 === v ? "已为您增加热度值" : "已为主播增加热度值";
										t.addHot(h, y)
									}
								}
							}
						} else e.extend(f, u);
						if (t.isPanelShow()) {
							var h = a.$manPanel.find('.guess-game-box[data-qid="' + f.qid + '"]'),
								k = h.find(".guess-game-box-theme").attr("data-qs"),
								_ = f.qs;
							k != _ && t.updateTheme(f, m, h.find(".guess-game-update-box"))
						}
					}
				}
				if (i) {
					var w = t.guessIsEnd();
					if (w.isEndFlag && (t.data.activityStatus = "end", b.data.hasGetEndData ? (delete b.data.hasGetEndData, b.data.hasGetEndData = {}) : b.data.hasGetEndData = {}), t.isPanelShow()) var T = setTimeout(function() {
						t.changeHeader(), n && t.restartCountDown(t.guessData.restartPool), clearTimeout(T)
					}, 50)
				}
			},
			regInit: function() {
				o.reg("room_guess_handler", function(t) {
					var a = s.decode(t).too();
					switch (a.type) {
					case "rquiziln":
					case "erquiziln":
						var i = a.qril,
							n = 0,
							r = !1,
							o = !1,
							d = "rquiziln" == a.type ? 1 : 2;
						if ("" === i && (o = !0), !o) {
							v.setGuessType(d), m.dys({
								key: "dys.room.guess-game.panel.show",
								type: d
							}), i = s.isArray(i) ? s.decode(i) : [{
								value: i
							}];
							var c = b.guessData.guessList.length;
							0 != c && (n = b.guessData.guessList[0].qbid, b.guessData.guessList.length = 0);
							for (var l = 0, g = i.length; g > l; l++) {
								var p = i[l].value,
									f = p && s.decode(p).too();
								if (f) {
									if (n === f.qbid && (r = !0), 4 === +f.qs && 3 === +f.ft) continue;
									var h = e.extend({}, b.defaultObj, f);
									b.guessData.guessList.push(h)
								}
							}
							b.guessData.guessSingleEndPool.length > 0 && b.handleSingleEndPool(b.guessData.guessSingleEndPool, !0);
							var y = b.guessData.guessList.length > 0 ? "api" : "push";
							u.guessEntryAPP.showMsgCenter(y)
						}
						r || o || (b.mainPanelToBegin(!0), m.isAnchor() || (b.data.activityStatus = "begin", b.data.hasGetEndData ? (delete b.data.hasGetEndData, b.data.hasGetEndData = {}) : b.data.hasGetEndData = {}, 1 == d ? b.initUserCornerByLua() : b.initUserEasyCornerByLua()));
						break;
					case "rquizisn":
					case "erquizisn":
						var i = a.qril;
						if ("" === i) return;
						b.cPlusDataDistribution(i, 2), b.handleStatusPool();
						break;
					case "quizprn":
					case "equizprn":
						var i = a.qprl;
						if ("" === i) return;
						a.bl && a.bl > 0 && m.triggerSilverChange(a.bl), b.cPlusDataDistribution(i, 3), !m.isAnchor() && b.guessData.guessEndPool.length > 0 && (u.guessPopup.showUserResult(b.guessData.guessEndPool), b.handleSingleEndPool(b.guessData.guessEndPool, !1));
						break;
					case "quen":
					case "equen":
						var i = a.quel;
						if ("" === i) return;
						b.cPlusDataDistribution(i, 4), m.isAnchor() || b.handleSingleEndPool(b.guessData.guessSingleEndPool, !1);
						break;
					case "quizeefbs":
						var k = a.cd;
						k > 0 ? b.isPanelShow() && u.guessSendGiftGuide.showSendGiftGuide(k) : b.guessData.sendGiftGuideCountDown = k
					}
				}), o.reg("room_shopBroadCast_click", function(e) {
					window.open(u.Model.vars.mainMsg.shop.mallurl + "?share_token=" + e)
				})
			},
			init: function() {
				var e = this;
				u.Model.init(), u.guessEntryAPP.init(e), f.init(e), b.regInit()
			}
		};
	return {
		init: function() {
			v.init(), b.init()
		}
	}
}), define("douyu/page/room/normal/mod/task-addon", ["jquery", "shark/observer", "shark/util/cookie/1.0", "shark/util/storage/1.0", "douyu/context", "douyu/com/user"], function(e, t, a, s, i, n) {
	var r = {
		storageName: "paytask",
		taskTimeout: !1,
		taskReady: !1
	},
		o = {
			init: function(e) {
				this.getDoms(), this.render()
			},
			getDoms: function() {
				this.doms = {
					$target: e("#js-room-video"),
					$taskPanel: e("#js-room-task-panel")
				}
			},
			render: function() {
				var e = this;
				t.on("pay.task.ready", function() {
					r.taskReady = !0, e.check()
				}), t.on("pay.task.timeout", function() {
					r.taskTimeout = !0, e.check()
				})
			},
			check: function() {
				return r.taskReady && r.taskTimeout ? void this.makeHtml() : !1
			},
			getRestTime: function(e) {
				var t, a;
				return e = parseInt(e, 10), e = e ? e : 0, t = new Date, t.setDate(t.getDate() + e), t.setHours(24), t.setMinutes(0), t.setSeconds(0), a = t.getTime() - (new Date).getTime()
			},
			makeHtml: function() {
				var a = this,
					s = ['<div class="pay-task">', '<a href="javascript:;" class="pay-task-btn pay-task-open">&nbsp</a>', '<a href="javascript:;" class="pay-task-btn pay-task-notip">&nbsp</a>', '<a href="javascript:;" class="pay-task-btn pay-task-close">&nbsp</a>', "</div>"].join(""),
					i = e(s);
				t.trigger("mod.layer.tips.render", {
					storagename: r.storageName,
					$tip: i,
					$el: a.doms.$target,
					closeEleClassName: "",
					handleFn: function() {
						i.animate({
							bottom: 45
						}, 1e3), i.find(".pay-task-open").on("click", function(e) {
							t.trigger("mod.task.tid64.undo.showpanel"), i.hide(), t.trigger("dys", {
								key: "dys.room.task.new.get"
							})
						}), i.find(".pay-task-notip").on("click", function(e) {
							i.hide(), t.trigger("dys", {
								key: "dys.room.task.new.nomore"
							})
						}), i.find(".pay-task-close").on("click", function(e) {
							i.hide(), t.trigger("dys", {
								key: "dys.room.task.new.close"
							})
						})
					}
				}), t.trigger("dys", {
					key: "dys.room.task.guide.show"
				})
			}
		};
	return {
		init: function() {
			o.init()
		}
	}
}), define("douyu/com/vcode-v3", ["jquery", "shark/class", "shark/observer"], function(e, t, a) {
	var s = {
		type: null,
		fast: {
			idpre: "gt-captcha-",
			count: 0
		}
	},
		i = t({
			init: function(t) {
				this.config = e.extend(!0, {}, {
					target: null
				}, t), this.render()
			},
			nextId: function() {
				var e = this.config.idpre || s.fast.idpre;
				return e + ++s.fast.count
			},
			getResult: function() {
				return this.config.result
			},
			check: function(t) {
				var a = e.isFunction(t.error) ? t.error : function() {},
					s = function(t) {
						0 === t.error && e.isPlainObject(t.data) ? this.buildAsync(t.data) : a()
					},
					i = function() {
						a()
					};
				t.checkOptions ? this.buildAsync(t.checkOptions) : e.ajax("/member/cpSecurity/check_geetest_status", {
					type: "post",
					data: {
						op_type: t.op_type || ""
					},
					dataType: "json",
					timeout: 5e3,
					success: e.proxy(s, this),
					error: e.proxy(i, this)
				})
			},
			render: function() {
				this.config.$el = this.config.target
			},
			build: function(t) {
				var a = this.nextId(),
					s = this,
					i = e.isFunction(s.config.success) ? s.config.success : function() {},
					n = e.isFunction(s.config.error) ? s.config.error : function() {},
					r = "zh-cn";
				"en" === $SYS.lang && (r = $SYS.lang), this.config.$el.html('<div id="' + a + '"></div>'), this.config.result = null;
				var o = {
					gt: t.gt,
					challenge: t.challenge,
					offline: !t.success,
					new_captcha: !0,
					product: "float",
					lang: r
				};
				return window.initGeetest ? (this.config.gtObj && this.config.gtObj.product && (o = e.extend(!0, o, this.config.gtObj)), void window.initGeetest(o, function(e) {
					e.appendTo("#" + a), e.onSuccess(function() {
						s.config.result = s.plugin.getValidate(), i(s.config.result)
					}), e.onError(function() {
						s.config.result = null
					}), s.plugin = e
				})) : (n(), !1)
			},
			buildAsync: function(e) {
				var t = this,
					a = location.protocol;
				require.use([a + "//static.geetest.com/static/tools/gt.js"], function() {
					t.build(e)
				})
			},
			refresh: function() {
				this.plugin && this.plugin.reset(), this.config.result = null
			},
			show: function() {
				this.config.$el.show()
			},
			hide: function() {
				this.config.$el.hide()
			},
			destroy: function() {
				this.plugin && this.plugin.destroy()
			}
		}),
		n = {
			init: function(t, a, n) {
				var r = e.extend(!0, {
					product: "custom",
					width: "100%",
					area: ".v3-area",
					next_width: "260px",
					bg_color: "transparent"
				}, n || {}),
					o = {
						target: t,
						gtObj: r,
						idpre: a.idpre || "",
						success: a.success ||
						function() {},
						error: a.error ||
						function() {}
					},
					d = new i(o);
				return d.check(a), {
					refresh: function() {
						d.refresh()
					},
					isFast: function() {
						return "fast" === s.type
					},
					getFastResult: function() {
						return d.getResult()
					},
					destroy: function() {
						return d.destroy()
					}
				}
			}
		};
	return n
}), define("douyu/page/room/normal/mod/task", ["jquery", "shark/observer", "shark/util/flash/data/1.0", "shark/util/lang/1.0", "shark/util/template/2.0", "shark/util/storage/1.0", "douyu/context", "douyu/com/user", "douyu/com/vcode-v3", "douyu/page/room/base/api"], function(e, t, a, s, i, n, r, o, d, c) {
	Date.prototype.Format = function(e) {
		var t = e,
			a = {
				"M+": this.getMonth() + 1,
				"d+": this.getDate(),
				"h+": this.getHours(),
				"m+": this.getMinutes(),
				"s+": this.getSeconds(),
				"q+": Math.floor((this.getMonth() + 3) / 3),
				S: this.getMilliseconds()
			};
		/(y+)/.test(t) && (t = t.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
		for (var s in a) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 === RegExp.$1.length ? a[s] : ("00" + a[s]).substr(("" + a[s]).length)));
		return t
	};
	var l = {
		init: function() {
			this.config = {
				isFlashReady: !1,
				roomId: r.get("room.room_id"),
				hasGetTaskList: !1,
				panelOpen: !1,
				taskData: [],
				urls: {
					noviceList: "/task_new/dailyTask",
					webGameList: "/task_new/pageTasks",
					webGameTask: "/task_new/pageDetail/",
					iosList: "/task_new/iosTasks",
					iosTask: "/task_new/iosDetail",
					androidList: "/task_new/androidTasks",
					androidTask: "/task_new/androidDetail",
					recommendList: "/task_new/recomTasks",
					recordList: "/member/task/getRewardHistory",
					getReward: "/member/task/reward_new",
					getCaptcha: "/member/task/captcha2",
					getRemindPrice: "/member/task/getTaskPrizeBalance",
					getDoneTask: "/member/task/receive_tasks"
				},
				reward: {
					silver: 0,
					coupon: 0,
					caviar: 0,
					prop: 0,
					game: 0,
					lottery: 0
				},
				recommendOffset: 0,
				webOffset: 0,
				iosOffset: 0,
				androidOffset: 0,
				recordLast_jid: 0,
				recordLast_rtime: 0,
				loadLock: {},
				geetest: {}
			}, this.getDoms(), this.generateRenders(), this.renderMain(), this.switchTab("recommend"), this.addEvent()
		},
		getDate: function() {
			var e = new Date;
			return e.getFullYear() + e.getMonth() + e.getDate()
		},
		getDoms: function() {
			var t = e('<div class="task-case"></div>');
			e("body").append(t), this.doms = {
				taskPanel: t,
				taskBtn: e("#js-room-task-trigger"),
				awardNum: e("#js-room-task-trigger .js-awardnum"),
				statusNActions: e("#js-stats-and-actions"),
				header: e("#header")
			}
		},
		generateRenders: function() {
			this.renders = {};
			var e = this.renders;
			e.mainRender = i.compile(this.getTemplate("main")), e.recommendRender = i.compile(this.getTemplate("recommend")), e.gameListRender = i.compile(this.getTemplate("gameList")), e.noviceRender = i.compile(this.getTemplate("novice")), e.noviceTaskRender = i.compile(this.getTemplate("noviceTask")), e.gameSideCardRender = i.compile(this.getTemplate("gameSideCard")), e.recordRender = i.compile(this.getTemplate("recordCard")), e.pagerRender = i.compile(this.getTemplate("pager")), e.gameAllTaskRender = i.compile(this.getTemplate("gameAllTask")), e.webGameTaskRender = i.compile(this.getTemplate("webGameTask")), e.doneListRender = i.compile(this.getTemplate("taskDoneCard"))
		},
		encodeHTML: function(t) {
			var a = e("<p></p>");
			return a.html(t), a.text()
		},
		dataProcessor: function(e, t, a) {
			var s, i, n, r, o, d = t,
				c = $ROOM.nowtime;
			switch (e) {
			case "recommend":
				n = t.list;
				for (s in n) {
					r = n[s], r.totalSilver = 0, 1 === r.gtt ? (r.platform = "页游", r.gameType = "web") : 2 === r.gtt || 7 === r.gtt ? (r.platform = "苹果", r.gameType = "ios") : 4 !== r.gtt && 3 !== r.gtt || (r.platform = "安卓", r.gameType = "android");
					for (s in r.ts) r.totalSilver += r.ts[s].silver, this.taskTypeFormat(r.ts[s], r.gtt)
				}
				return d.recommend = !0, d;
			case "web":
				n = d.list;
				for (s in n) {
					r = n[s], r.platform = "页游", r.gameType = "web", r.gtt = 1, r.totalSilver = 0;
					for (i in r.ts) r.totalSilver += r.ts[i].silver, this.taskTypeFormat(r.ts[i], r.gtt)
				}
				return d;
			case "webAll":
				r = d, r.platform = "页游", r.gameType = "web", r.gtt = 1;
				for (i in r.ts) o = r.ts[i], o.task_desc = this.encodeHTML(o.task_desc), this.taskTypeFormat(o, r.gtt);
				return d;
			case "ios":
				n = d.list;
				for (s in n) {
					r = n[s], r.platform = "苹果", r.gameType = "ios", r.url = encodeURI(r.detail_url + "&source_type=iosGame"), r.totalSilver = 0, 2 === r.gtt ? r.is_new = 1 : r.is_new = 0;
					for (i in r.ts) o = r.ts[i], r.totalSilver += o.silver, o.status = "activing", this.taskTypeFormat(o, r.gtt)
				}
				return d;
			case "iosAll":
				r = d, r.platform = "苹果", r.gameType = "ios", r.url = encodeURI(r.detail_url + "&source_type=iosGame"), r.size = r.size + "MB", 2 === r.gtt ? r.is_new = 1 : r.is_new = 0;
				for (i in r.ts) o = r.ts[i], o.task_desc = this.encodeHTML(o.task_desc), o.status = "activing", o.startTime = new Date(1e3 * o.e_s_t).Format("yyyy/MM/dd"), o.endTime = new Date(1e3 * o.e_e_t).Format("yyyy/MM/dd"), this.taskTypeFormat(o, r.gtt);
				return d;
			case "android":
				n = d.list;
				for (s in n) {
					r = n[s], r.platform = "安卓", r.gameType = "android", r.gtt = r.game_type, r.totalSilver = 0, r.down_url && (r.url = encodeURI(r.down_url + "?appId=" + r.app_id));
					for (i in r.ts) o = r.ts[i], r.totalSilver += o.silver, r.is_new ? c < o.e_s_t ? o.status = "nostart" : o.e_e_t && c > o.e_e_t ? o.status = "ended" : o.status = "activing" : o.status = "activing", this.taskTypeFormat(o, r.gtt)
				}
				return d;
			case "androidAll":
				r = d, r.platform = "安卓", r.gameType = "android", r.gtt = r.game_type, r.down_url && (r.url = encodeURI(r.down_url + "?appId=" + r.app_id)), isNaN(1 * r.size) || (r.size = r.size + "MB");
				for (i in r.ts) o = r.ts[i], o.task_desc = this.encodeHTML(o.task_desc), r.is_new ? (c < o.e_s_t ? o.status = "nostart" : o.e_e_t && c > o.e_e_t ? o.status = "ended" : o.status = "activing", o.startTime = new Date(1e3 * o.e_s_t).Format("yyyy/MM/dd"), o.endTime = new Date(1e3 * o.e_e_t).Format("yyyy/MM/dd")) : (o.status = "activing", o.startTime = new Date(1e3 * o.start_time).Format("yyyy/MM/dd"), o.endTime = new Date(1e3 * o.stop_time).Format("yyyy/MM/dd")), this.taskTypeFormat(o, r.gtt);
				return d;
			default:
				return t
			}
		},
		taskTypeFormat: function(e, t) {
			1 === t || 3 === t ? 3 === Number(e.task_type) ? e.task_type_class = "charge" : e.task_type_class = "ingame" : 2 !== t && 7 !== t && 4 !== t || (e.tt_type <= 3 ? e.task_type_class = "charge" : 4 === e.tt_type ? e.task_type_class = "ingame" : 5 === e.tt_type ? e.task_type_class = "live" : 6 === e.tt_type && (e.task_type_class = "login"))
		},
		renderMain: function() {
			var e = {};
			this.doms.taskPanel.html(this.renders.mainRender(e))
		},
		renderWebGameTask: function(t, a) {
			var s = this;
			this.request(this.config.urls.webGameTask + "/" + t, function(t) {
				var i;
				return t.app_id ? (i = s.dataProcessor("webAll", t), a.html(s.renders.webGameTaskRender(i)), s.waitScrolling ? setTimeout(function() {
					s.scrollToTask(s.waitScrolling.tid, s.waitScrolling.list), s.waitScrolling = null
				}, 200) : a.parents(".mCustomScrollbar").mCustomScrollbar("scrollTo", 0), a.parents(".task-content").find(".play-btn-bottom").attr("href", i.click_url), void s.updateTask("webAll")) : void e.dialog.tips_black("该游戏已下架")
			}, "allTaskLock")
		},
		renderRecommend: function() {
			var e = this,
				t = this.config.urls.recommendList; - 1 !== e.config.recommendOffset && this.request(t, {
				offset: e.config.recommendOffset,
				limit: 10
			}, function(t) {
				var a = e.dataProcessor("recommend", t);
				if (0 === t.total) return void e.doms.taskPanel.find(".recommend").addClass("task-empty");
				if (e.config.recommendOffset += t.list.length, e.config.recommendOffset >= t.total && (e.config.recommendOffset = -1), e.doms.taskPanel.find(".recommend").hasClass("task-loading")) {
					e.doms.taskPanel.find(".recommend").html(e.renders.recommendRender(a)).removeClass("task-loading");
					var s = a.list[0],
						i = e.doms.taskPanel.find(".recommend .recommend-game-list");
					1 === s.gtt ? (e.renderWebGameTask(s.app_id, i), e.doms.taskPanel.find(".recommend .footer-fix").show()) : (e.renderAllTask(s.app_id, s.is_new, s.gameType, i), e.doms.taskPanel.find(".recommend .footer-fix").hide()), setTimeout(function() {
						e.doms.taskPanel.find(".recommend .task-status-list").eq(0).addClass("open"), e.doms.taskPanel.find(".recommend .trigger-icon").eq(0).addClass("open"), e.doms.taskPanel.find(".recommend .task-game-list-bar .task-status").eq(0).addClass("active")
					}, 100), e.doms.taskPanel.find(".recommend .recommend-task-main").mCustomScrollbar({
						mouseWheel: {
							scrollAmount: 100
						},
						scrollInertia: 0,
						callbacks: {
							onScroll: function() {
								var t = this.mcs.draggerTop;
								e.doms.taskPanel.find(".recommend .game-info .qr-code").length ? t > 20 ? (e.doms.taskPanel.find(".recommend .game-top-info").show(), e.doms.taskPanel.find(".recommend .game-info .qr-code").hide()) : (e.doms.taskPanel.find(".recommend .game-top-info").hide(), e.doms.taskPanel.find(".recommend .game-info .qr-code").show()) : e.doms.taskPanel.find(".recommend .game-info .qr-code").hide()
							}
						}
					}), e.doms.taskPanel.find(".recommend .task-game-list-bar").mCustomScrollbar({
						mouseWheel: {
							scrollAmount: 100
						},
						scrollInertia: 0,
						callbacks: {
							onTotalScrollOffset: 300,
							onTotalScroll: function() {
								e.renderRecommend()
							}
						}
					})
				}
				e.doms.taskPanel.find(".recommend .task-game-list-bar .mCSB_container").append(e.renders.gameSideCardRender(a)), e.taskStatus && (e.updateTask(), e.renderDoneList())
			}, "recommendListLock")
		},
		renderWebGame: function() {
			var e = this,
				t = this.config.urls.webGameList; - 1 !== e.config.webOffset && this.request(t, {
				offset: e.config.webOffset,
				limit: 10
			}, function(t) {
				var a = e.dataProcessor("web", t);
				return 0 === e.config.webOffset && 0 === t.list.length ? void e.doms.taskPanel.find(".web-game").addClass("task-empty") : (e.config.webOffset += t.list.length, e.config.webOffset >= t.total && (e.config.webOffset = -1), e.config.taskData = e.config.taskData.concat(a.list), e.doms.taskPanel.find(".web-game").hasClass("task-loading") && (e.doms.taskPanel.find(".web-game").html(e.renders.recommendRender(a)).removeClass("task-loading"), e.renderWebGameTask(a.list[0].app_id, e.doms.taskPanel.find(".web-game .recommend-game-list")), setTimeout(function() {
					e.doms.taskPanel.find(".web-game .task-status-list").eq(0).addClass("open"), e.doms.taskPanel.find(".web-game .trigger-icon").eq(0).addClass("open"), e.doms.taskPanel.find(".web-game .task-game-list-bar .task-status").eq(0).addClass("active")
				}, 100), e.doms.taskPanel.find(".web-game .recommend-task-main").mCustomScrollbar({
					mouseWheel: {
						scrollAmount: 100
					},
					scrollInertia: 0
				}), e.doms.taskPanel.find(".web-game .task-game-list-bar").mCustomScrollbar({
					mouseWheel: {
						scrollAmount: 100
					},
					scrollInertia: 0,
					callbacks: {
						onTotalScrollOffset: 300,
						onTotalScroll: function() {
							e.renderWebGame()
						}
					}
				})), 0 !== t.list.length && e.doms.taskPanel.find(".web-game .task-game-list-bar .mCSB_container").append(e.renders.gameSideCardRender(a)), void(e.taskStatus && e.updateTask("web")))
			}, "webgameListLock")
		},
		renderIOS: function() {
			var e = this,
				t = this.config.urls.iosList; - 1 !== e.config.iosOffset && this.request(t, {
				offset: e.config.iosOffset,
				limit: 10
			}, function(t) {
				var a = e.dataProcessor("ios", t);
				if (0 === e.config.iosOffset && 0 === t.list.length) return void e.doms.taskPanel.find(".ios-game").addClass("task-empty");
				if (e.config.iosOffset += t.list.length, e.config.iosOffset >= t.total && (e.config.iosOffset = -1), e.config.taskData = e.config.taskData.concat(a.list), e.doms.taskPanel.find(".ios-game").hasClass("task-loading")) {
					e.doms.taskPanel.find(".ios-game").html(e.renders.gameListRender(a)).removeClass("task-loading"), e.doms.taskPanel.find(".ios-game .game-main").mCustomScrollbar({
						mouseWheel: {
							scrollAmount: 100
						},
						scrollInertia: 0,
						callbacks: {
							onScroll: function() {
								var t = this.mcs.draggerTop;
								t > 20 ? (e.doms.taskPanel.find(".ios-game .game-top-info").show(), e.doms.taskPanel.find(".ios-game .game-info .qr-code").hide()) : (e.doms.taskPanel.find(".ios-game .game-top-info").hide(), e.doms.taskPanel.find(".ios-game .game-info .qr-code").show())
							}
						}
					});
					var s = a.list[0];
					e.renderAllTask(s.app_id, s.is_new, "ios", e.doms.taskPanel.find(".ios-game .game-main .mCSB_container")), setTimeout(function() {
						e.doms.taskPanel.find(".ios-game .task-status-list").eq(0).addClass("open"), e.doms.taskPanel.find(".ios-game .trigger-icon").eq(0).addClass("open"), e.doms.taskPanel.find(".ios-game .task-game-list-bar .task-status").eq(0).addClass("active")
					}, 100), e.doms.taskPanel.find(".ios-game .task-game-list-bar").mCustomScrollbar({
						mouseWheel: {
							scrollAmount: 100
						},
						scrollInertia: 0,
						callbacks: {
							onTotalScrollOffset: 300,
							onTotalScroll: function() {
								e.renderIOS()
							}
						}
					})
				}
				e.doms.taskPanel.find(".ios-game .task-game-list-bar .mCSB_container").append(e.renders.gameSideCardRender(a)), e.taskStatus && e.updateTask("ios")
			}, "iosListLock")
		},
		renderAndroid: function() {
			var e = this,
				t = this.config.urls.androidList; - 1 !== e.config.androidOffset && this.request(t, {
				offset: e.config.androidOffset,
				limit: 10
			}, function(t) {
				var a = e.dataProcessor("android", t);
				if (0 === e.config.androidOffset && 0 === t.list.length) return void e.doms.taskPanel.find(".android-game").addClass("task-empty");
				if (e.config.androidOffset += t.list.length, e.config.androidOffset >= t.total && (e.config.androidOffset = -1), e.config.taskData = e.config.taskData.concat(a.list), e.doms.taskPanel.find(".android-game").hasClass("task-loading")) {
					e.doms.taskPanel.find(".android-game").html(e.renders.gameListRender(a)).removeClass("task-loading"), e.doms.taskPanel.find(".android-game .game-main").mCustomScrollbar({
						mouseWheel: {
							scrollAmount: 100
						},
						scrollInertia: 0,
						callbacks: {
							onScroll: function() {
								var t = this.mcs.draggerTop;
								t > 20 ? (e.doms.taskPanel.find(".android-game .game-top-info").show(), e.doms.taskPanel.find(".android-game .game-info .qr-code").hide()) : (e.doms.taskPanel.find(".android-game .game-top-info").hide(), e.doms.taskPanel.find(".android-game .game-info .qr-code").show())
							}
						}
					});
					var s = a.list[0];
					e.renderAllTask(s.app_id, s.is_new, "android", e.doms.taskPanel.find(".android-game .game-main .mCSB_container")), setTimeout(function() {
						e.doms.taskPanel.find(".android-game .task-status-list").eq(0).addClass("open"), e.doms.taskPanel.find(".android-game .trigger-icon").eq(0).addClass("open"), e.doms.taskPanel.find(".android-game .task-game-list-bar .task-status").eq(0).addClass("active")
					}, 100), e.doms.taskPanel.find(".android-game .task-game-list-bar").mCustomScrollbar({
						mouseWheel: {
							scrollAmount: 100
						},
						scrollInertia: 0,
						callbacks: {
							onTotalScrollOffset: 300,
							onTotalScroll: function() {
								e.renderAndroid()
							}
						}
					})
				}
				e.doms.taskPanel.find(".android-game .task-game-list-bar .mCSB_container").append(e.renders.gameSideCardRender(a)), e.updateRemind(a.list), e.taskStatus && e.updateTask("android")
			}, "androidListLock")
		},
		renderNovice: function() {
			var e = this,
				t = this.config.urls.noviceList;
			this.request(t, function(t) {
				var a = t[0];
				e.doms.taskPanel.find(".novice").html(e.renders.noviceRender(a)).removeClass("task-loading"), e.taskStatus && e.updateTask("novice")
			}, "noviceListLock")
		},
		renderRecord: function() {
			var e = this,
				t = this.config.urls.recordList; - 1 !== this.config.recordLast_jid && this.request(t, {
				last_jid: e.config.recordLast_jid,
				last_rtime: e.config.recordLast_rtime,
				limit: 10
			}, function(t) {
				var a = t.list;
				return e.doms.taskPanel.find(".record").hasClass("task-loading") && e.doms.taskPanel.find(".record").removeClass("task-loading"), 0 === e.config.recordLast_jid && 0 === a.length ? void e.doms.taskPanel.find(".record").addClass("no-record") : (1 === t.pager.ov && (e.config.recordLast_jid = -1), void(a.length && (e.config.recordLast_jid = a[a.length - 1].jid, e.config.recordLast_rtime = a[a.length - 1].dl, e.doms.taskPanel.find(".record").hasClass("mCustomScrollbar") ? e.doms.taskPanel.find(".record .mCSB_container").append(e.renders.recordRender({
					list: a
				})) : (e.doms.taskPanel.find(".record").append(e.renders.recordRender({
					list: a
				})), e.doms.taskPanel.find(".record").mCustomScrollbar({
					mouseWheel: {
						scrollAmount: 100
					},
					scrollInertia: 0,
					callbacks: {
						onTotalScrollOffset: 100,
						onTotalScroll: function() {
							e.renderRecord()
						}
					}
				})), e.renderQRcode(e.doms.taskPanel.find(".record .qr-img")))))
			}, "recordListLock")
		},
		renderDoneList: function() {
			var e, t, a, s, i = this,
				n = [];
			if (this.taskStatus) for (e in this.taskStatus) s = this.taskStatus[e], s.a > 0 && (Number(0 !== s.tn) || s.tid > 14) && n.push(s.tn + "_" + s.tid + "_" + s.adid);
			n.length && (i.config.cardData && i.config.doneData ? (i.doms.taskPanel.find(".recommend .recommend-task-main .mCSB_container").html(i.renders.doneListRender({
				list: i.config.doneData
			})), i.renderQRcode(i.doms.taskPanel.find(".task-done-card .qr-img")), i.doms.taskPanel.find(".recommend .footer-fix").hide()) : this.request(i.config.urls.getDoneTask, "POST", {
				str_key: n
			}, function(r) {
				if (r.length) {
					n = [], i.config.cardData = r;
					for (e in r) {
						var o, d;
						if (s = r[e], s.silver = 0, s.prop = [], s.coupon = 0, s.caviar = 0, s.gold = 0, o = 4 === s.g_t ? 1 : 2 === s.g_t ? 2 : 0, d = 7 === s.g_t ? i.taskStatus["15-0-" + s.app_id] : i.taskStatus[s.task_id + "-" + o + "--1"], d && d.ps > 0) {
							for (t in s.levels) if (t >= d.a - d.ps && t < d.a) if (4 === s.g_t || 2 === s.g_t || 7 === s.g_t) {
								var c = s.levels[t].reward;
								if (c.silver && c.silver.num && (s.silver += Number(c.silver.num)), c.gold && (s.gold += Number(c.gold)), c.coupon && c.coupon.length) for (a in c.coupon) s.coupon += Number(c.coupon[a].money);
								c.caviar && (s.caviar += Number(c.caviar)), c.prop && "object" == typeof c.prop && s.prop.push(c.prop), c.props && c.props.length && (s.prop ? s.prop = s.prop.concat(c.props) : s.prop = c.props), c.lottery && c.lottery.length && (s.lottery ? s.lottery = s.lottery.concat(c.lottery) : s.lottery = c.lottery), c.gift && c.gift.length && (s.gift ? s.gift = s.gift.concat(c.gift) : s.gift = c.gift)
							} else 1 !== s.g_t && 3 !== s.g_t || (s.levels[t].silver && (s.silver += Number(s.levels[t].silver)), s.levels[t].prop && (s.prop = s.prop.concat(s.levels[t].props)));
							n.push(s)
						}
					}
					i.config.doneData = n, n.length && (i.doms.taskPanel.find(".recommend").removeClass("task-loading task-empty"), i.doms.taskPanel.find(".recommend .task-game-list-bar .mCSB_container").prepend('<div class="get-reward-list active"><span>' + n.length + "</span>个可领取奖励</div>"), i.doms.taskPanel.find(".recommend .recommend-task-main .mCSB_container").show().html(i.renders.doneListRender({
						list: n
					})), i.renderQRcode(i.doms.taskPanel.find(".task-done-card .qr-img")), i.doms.taskPanel.find(".recommend .footer-fix").hide(), i.doms.taskPanel.find(".recommend .task-game-list-bar .task-status").removeClass("active"))
				}
			}, "doneListLock"))
		},
		renderAllTask: function(t, a, s, i) {
			var n, r = this;
			"android" === s ? n = this.config.urls.androidTask + "?app_id=" + t + "&is_new=" + a : "ios" === s && (n = this.config.urls.iosTask + "?app_id=" + t), this.request(n, function(t) {
				var a;
				return t.app_id ? ("android" === s ? a = r.dataProcessor("androidAll", t) : "ios" === s && (a = r.dataProcessor("iosAll", t)), i.html(r.renders.gameAllTaskRender(a)), r.waitScrolling ? setTimeout(function() {
					r.scrollToTask(r.waitScrolling.tid, r.waitScrolling.list), r.waitScrolling = null
				}, 200) : i.parents(".mCustomScrollbar").mCustomScrollbar("scrollTo", 0), r.renderQRcode(r.doms.taskPanel.find(".game-task-panel .qr-img")), r.updateTask("all"), void("android" === s && r.updateRemind([a]))) : void e.dialog.tips_black("该游戏已下架")
			}, "allTaskLock")
		},
		renderQRcode: function(t) {
			var a = "Microsoft Internet Explorer" === navigator.appName && parseInt(navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/)[1], 10) < 9 ? "table" : "canvas";
			e(t).each(function() {
				var t = e(this);
				if (!t.data("render")) {
					var s, i = t.data("dltask") || 0;
					if (s = i ? t.data("midurl") : t.data("url"), t.qrcode({
						render: a,
						width: t.width(),
						height: t.height(),
						text: s,
						correctLevel: 1
					}), t.parents(".game-info").length) {
						var n = t.parents(".task-content.active").find(".game-top-info .qr-img");
						n.find("canvas").remove(), n.qrcode({
							render: a,
							width: n.width(),
							height: n.height(),
							text: s,
							correctLevel: 1
						})
					}
					t.data("render", !0)
				}
			})
		},
		getPropInfo: function(e) {
			var t = this.doms.taskPanel.find('.task-reward.gift[data-pid="' + e + '"]');
			this.request("/ztCache/mobilegame/getPropPacks", {
				propid: e
			}, function(e) {
				var a = e.gift_data,
					s = '<div class="gift-info"><div class="arrow"></div>';
				for (var i in a) s += '<div class="prop">', s += '<img src="' + a[i].icon + '"/>', s += '<div class="name">' + a[i].prop_name + "×" + a[i].prop_cnt + "</div>", s += "</div>";
				s += "</div>", t.append(s)
			}, "propInfo" + e)
		},
		getGameGiftInfo: function(e) {
			var t = this.doms.taskPanel.find('.task-reward.game[data-gid="' + e + '"]');
			this.request("/ztCache/mobilegame/getGiftLite", {
				gid: e
			}, function(e) {
				var a = e,
					s = '<div class="game-info"><div class="arrow"></div><p>礼包码内容</p><div class="content">' + a.content.replace(/\n/g, "<br>") + "</div>";
				a.useMethod && (s += '<p>使用方法</p><div class="method">' + a.useMethod.replace(/\n/g, "<br>") + "</div>"), s += '<div class="method">领取的礼包请在安卓斗鱼App“游戏中心-礼包-已领取”中查看</div>', s += "</div>", t.append(s)
			}, "giftInfo" + e)
		},
		addEvent: function() {
			var t = this;
			this.doms.taskBtn.on("click", function() {
				t.openTaskPanel(), DYS.sub({
					action_code: "click_task"
				})
			}), this.doms.taskPanel.on("click", ".task-close", function() {
				t.toggleTaskPanel()
			}), this.doms.taskPanel.on("click", ".back", function() {
				t.doms.taskPanel.find(".game-task-panel").remove()
			}), this.doms.taskPanel.on("click", ".task-tabs-item", function() {
				var a = e(this).data("tab");
				t.switchTab(a)
			}), this.doms.taskPanel.on("click", ".get-reward-list", function() {
				e(this).addClass("active"), t.renderDoneList(), t.doms.taskPanel.find(".recommend .game-top-info").hide()
			}), this.doms.taskPanel.on("click", ".game-side-card .task-status", function() {
				var a = e(this).data("tid"),
					s = e(this).parents(".task-game-list-bar").next();
				return e(".get-reward-list").removeClass("active"), e(this).parents(".task-game-list-bar").find(".task-status").removeClass("active"), e(this).addClass("active"), s.find('.game-task-all[data-tid="' + a + '"]').length ? (t.scrollToTask(a, s), !1) : (t.waitScrolling = {
					tid: a,
					list: s
				}, void DYS.sub({
					action_code: "click_task_ltask",
					ext: {
						task_id: a
					}
				}))
			}), this.doms.taskPanel.on("click", ".game-side-card", function() {
				var a = e(this),
					s = Number(a.data("gtt")),
					i = a.data("id"),
					n = a.data("isnew"),
					r = a.parents(".task-game-list-bar").next().find(".mCSB_container");
				t.waitScrolling || (a.find(".task-status-list").slideToggle(), a.find(".trigger-icon").hasClass("open") ? a.find(".trigger-icon").removeClass("open") : a.find(".trigger-icon").addClass("open"), e(".get-reward-list").removeClass("active"), e(this).parents(".task-game-list-bar").find(".task-status").removeClass("active"), e(this).find(".task-status").eq(0).addClass("active")), r.find('.game-task-panel[data-id="' + i + '"]').length || r.find('.web-game-task[data-id="' + i + '"]').length || (1 === s ? (t.renderWebGameTask(i, r), t.doms.taskPanel.find(".recommend .game-top-info").hide(), t.doms.taskPanel.find(".recommend .footer-fix").show()) : 3 === s || 4 === s ? (t.renderAllTask(i, n, "android", r), t.doms.taskPanel.find(".recommend .footer-fix").hide()) : 2 !== s && 7 !== s || (t.renderAllTask(i, n, "ios", r), t.doms.taskPanel.find(".recommend .footer-fix").hide()), DYS.sub({
					action_code: "click_task_lgame",
					ext: {
						game_id: i,
						game_name: e(this).find(".name").attr("title")
					}
				}))
			}), this.doms.taskPanel.on("click", ".play-btn-bottom", function(e) {
				DYS.sub({
					action_code: "click_task_detail_pgame"
				})
			}), this.doms.taskPanel.on("click", ".action-btn.done, .get-reward-btn.done", function() {
				var a = e(this).parents(".game-task-all, .novice-task, .task-item"),
					s = e(this).parents(".task-game-card, .game-task-panel, .web-game-task"),
					i = Number(s.data("id")),
					n = Number(a.data("tid")),
					r = Number(a.data("gtt"));
				return 7 === r ? t.getAward(i, r) : t.getAward(n, r), e(this).hasClass("action-btn") ? 1 === e(this).parent().data("tid") ? DYS.sub({
					action_code: "click_task_get_mail"
				}) : 2 === e(this).parent().data("tid") ? DYS.sub({
					action_code: "click_task_get_chaphoto"
				}) : 14 === e(this).parent().data("tid") && DYS.sub({
					action_code: "click_task_get_phone"
				}) : DYS.sub({
					action_code: "click_task_detail_get"
				}), !1
			}), this.doms.taskPanel.on("click", ".one-key", function() {
				var a = e(this).parents(".task-done-card"),
					s = Number(a.data("id")),
					i = Number(a.data("tid")),
					n = Number(a.data("gtt")),
					r = 0,
					o = 0,
					d = 0;
				a.find(".gift").each(function() {
					r += e(this).data("num")
				}), a.find(".game").each(function() {
					o += e(this).data("num")
				}), a.find(".lottery").each(function() {
					d += e(this).data("num")
				});
				var c = {
					caviar: a.find(".platform-coin").data("num") || 0,
					coupon: a.find(".coupon").data("num") || 0,
					silver: a.find(".silver").data("num") || 0,
					prop: r,
					game: o,
					lottery: d,
					gold: a.find(".gold").data("num") || 0
				};
				7 === n ? t.getAward(s, n, c) : t.getAward(i, n, c)
			}), this.doms.taskPanel.on("click", ".action-btn.disabled, .action-btn.done, .get-reward-btn.disabled", function(e) {
				return e.preventDefault(), !1
			}), this.doms.taskPanel.on("click", ".show-more", function() {
				e(this).parent().hasClass("open") ? e(this).parent().removeClass("open") : e(this).parent().addClass("open")
			}), e("body").on("click", ".v3-sign-close", function() {
				e(".v3-sign-wrap").remove(), t.gee && t.gee.destroy()
			}), this.doms.taskPanel.on("mouseenter", ".task-reward.gift", function() {
				e(this).find(".gift-info").length || t.getPropInfo(e(this).data("pid"))
			}), this.doms.taskPanel.on("mouseenter", ".task-reward.game", function() {
				e(this).find(".game-info").length || t.getGameGiftInfo(e(this).data("gid"))
			}), c.reg("room_data_login", function() {
				t.config.isFlashReady = !0
			}), c.reg("room_data_tasklis", function(e) {
				var s, i, n, r = 0,
					o = a.decode(e).too();
				if (o && o.list) {
					for (s = a.isArray(o.list) ? a.decode(o.list) : [{
						value: o.list
					}], o = {}; r < s.length; r++) {
						i = a.decode(s[r].value).too();
						for (n in i) i[n] = +i[n] || 0;
						o[i.tid + "-" + i.tn + "-" + i.adid] = i
					}
					t.taskStatus = o, t.config.hasGetTaskList = !0, 0 !== t.doms.taskPanel.find(".recommend-task-main").length && (t.updateTask(), t.renderDoneList())
				}
			}), c.reg("room_data_taskcou", function(e) {
				t.config.isFlashReady = !0;
				var s = a.decode(e).too();
				s && s.ps > 0 && t.doms.awardNum.text(s.ps).show()
			})
		},
		openTaskPanel: function() {
			var e = this;
			return o.check() ? void(e.config.isFlashReady && (e.config.hasGetTaskList || c.exe("js_queryTask"), 0 === e.doms.taskPanel.find(".recommend-task-main").length && e.renderRecommend(), e.toggleTaskPanel(), e.doms.awardNum.text("").hide())) : void o.show("login")
		},
		toggleTaskPanel: function() {
			this.config.panelOpen ? (this.doms.taskPanel.hide(), this.config.panelOpen = !1) : (this.doms.taskPanel.show(), this.config.panelOpen = !0)
		},
		switchTab: function(t) {
			var a;
			switch (e(".task-tabs-item, .task-content").removeClass("active"), e('.task-tabs-item[data-tab="' + t + '"]').addClass("active"), e(".task-content." + t).addClass("active"), e(".task-content." + t).find(".recommend-task-main, .record").mCustomScrollbar("scrollTo", 0), t) {
			case "recommend":
				a = 1;
				break;
			case "web-game":
				a = 2, e(".task-content." + t).hasClass("task-loading") && this.renderWebGame();
				break;
			case "android-game":
				a = 3, e(".task-content." + t).hasClass("task-loading") && this.renderAndroid();
				break;
			case "ios-game":
				a = 4, e(".task-content." + t).hasClass("task-loading") && this.renderIOS();
				break;
			case "novice":
				e(".task-content." + t).hasClass("task-loading") && this.renderNovice(), a = 5;
				break;
			case "record":
				a = 6, e(".task-content." + t).hasClass("task-loading") && this.renderRecord()
			}
			DYS.sub({
				action_code: "click_task_type",
				ext: {
					type: a
				}
			})
		},
		scrollToTask: function(e, t) {
			t.mCustomScrollbar("scrollTo", t.find('.game-task-all[data-tid="' + e + '"]'), {
				scrollInertia: 300
			})
		},
		updateTask: function(t) {
			var a, s, i, n, r, o, d, c, l, g = this.taskStatus;
			for (var u in g) {
				if (n = !0, d = g[u], l = d.tn, r = d.adid, o = d.tid, 0 === Number(d.tn) && (n = !1), t || (i = this.doms.taskPanel), "ios" === t && (i = this.doms.taskPanel.find(".task-content.ios-game")), "android" === t && (i = this.doms.taskPanel.find(".task-content.android-game")), "web" === t && (i = this.doms.taskPanel.find(".task-content.web-game")), "ios" !== t && "android" !== t && "web" !== t && t || (s = -1 === r ? 1 === l ? i.find('.game-side-card[data-gtt="4"] .task-status[data-tid="' + o + '"]') : 2 === l ? i.find('.game-side-card[data-gtt="2"] .task-status[data-tid="' + o + '"]') : i.find('.game-side-card .task-status[data-tid="' + o + '"]') : i.find('.game-side-card[data-id="' + r + '"] .task-status'), s.find(".done-num").text(d.a), s.each(function() {
					if (Number(d.a) >= Number(e(this).data("all"))) {
						e(this).find(".done-num").attr("done", 1);
						var t = e(this).parents(".game-side-card").find(".done-num[done=1]").length;
						e(this).parents(".game-side-card").find(".complete-status").text(t)
					}
				})), "all" === t || !t) {
					var m;
					m = -1 === r ? 1 === l ? this.doms.taskPanel.find('.game-task-panel .game-task-all[data-tid="' + o + '"][data-gtt="4"]') : 2 === l ? this.doms.taskPanel.find('.game-task-panel .game-task-all[data-tid="' + o + '"][data-gtt="2"]') : this.doms.taskPanel.find('.game-task-panel .game-task-all[data-tid="' + o + '"]') : this.doms.taskPanel.find('.game-task-panel[data-id="' + r + '"]'), c = Number(m.data("gtt")), (4 !== c && 2 !== c || !n) && (1 !== c && 3 !== c && 5 !== c || n) && -1 === r || m.length && (m.find(".complete-status").each(function(t) {
						t < d.a && e(this).addClass("done").text("已完成")
					}), m.find(".task-status i").text(d.a), d.ps > 0 && m.find(".get-reward-btn").addClass("done").removeClass("disabled"), 0 === d.ps && d.a > 0 && m.find(".get-reward-btn").addClass("disabled").removeClass("done"))
				}
				if ("webAll" !== t && t || (a = this.doms.taskPanel.find('.web-game-task .game-task-all[data-tid="' + o + '"]'), a.length && (a.find(".complete-status span").text(d.a), d.ps > 0 ? a.find(".get-reward-btn").addClass("done").removeClass("disabled") : a.find(".get-reward-btn").addClass("disabled").removeClass("done"))), !("novice" !== t && t || n)) {
					var p = this.doms.taskPanel.find('.novice-task[data-tid="' + o + '"]');
					p.length && (d.ps > 0 && p.find(".action-btn").removeClass("todo").addClass("done").text("领取"), 0 === d.ps && d.a > 0 && p.find(".action-btn").removeClass("todo").addClass("disabled").text("已领取"))
				}
			}
		},
		updateRemind: function(e) {
			var t, a, s = this,
				i = [];
			for (t in e) if (1 === e[t].is_new) for (a in e[t].ts) i.push(e[t].ts[a].task_id);
			i = i.join(","), i && this.request(this.config.urls.getRemindPrice, {
				task_ids: i
			}, function(e) {
				for (t in e)"-1" !== e[t].tpb && (e[t].tpb > 0 ? s.doms.taskPanel.find('[data-tid="' + e[t].tid + '"] .remain-num').text("剩余" + e[t].tpb + "份").show() : s.doms.taskPanel.find('[data-tid="' + e[t].tid + '"] .remain-num').text("抢光了").show())
			})
		},
		getAward: function(t, a, s) {
			var i = this,
				n = {
					idpre: "task_reward",
					op_type: 29,
					success: function(n) {
						i.gee.destroy(), e(".v3-sign-wrap").remove();
						var o = {
							geetest_challenge: n.geetest_challenge,
							geetest_validate: n.geetest_validate,
							geetest_seccode: n.geetest_seccode,
							room_id: r.get("room.room_id"),
							task_id: t,
							game_type: a
						};
						e.ajax("/member/task/reward_new", {
							type: "POST",
							data: o,
							dataType: "json",
							success: function(n) {
								0 === n.error ? (i.gee && (i.gee.destroy(), e(".v3-sign-wrap").remove()), i.handleReward(n, t, a, s)) : e.dialog.tips_black(n.msg, 2)
							},
							error: function() {
								e.dialog.tips_black("领取失败！", 2)
							}
						})
					},
					error: function() {
						e.ajax("/member/task/reward_new", {
							type: "POST",
							data: data,
							dataType: "json",
							success: function(n) {
								0 === n.error ? (i.gee && (i.gee.destroy(), e(".v3-sign-wrap").remove()), i.handleReward(n, t, a, s)) : e.dialog.tips_black(n.msg, 2)
							},
							error: function() {
								e.dialog.tips_black("领取失败！", 2)
							}
						})
					}
				};
			e("body").append('<div class="v3-sign-wrap"><div class="v3-sign-close">×</div><span class="v3-sign-lsq"></span><div class="v3-sign-header"><span>验证通过</span>后可以领取对应奖励</div><div class="v3-sign-area"></div><div class="captcha-gt" id="v3-sign-captcha-gt"></div><div class="v3-sign"></div></div>'), i.gee = d.init(e("#v3-sign-captcha-gt"), n, {
				product: "custom",
				width: "100%",
				area: ".v3-sign-area",
				next_width: "260px",
				bg_color: "transparent"
			})
		},
		handleReward: function(t, a, s, i) {
			var n, r, o, d = this,
				c = d.doms.statusNActions,
				l = d.doms.header;
			if (t) if (n = t.error, 0 === n) {
				if (r = t.data) {
					var g = 0;
					if (7 === s ? o = d.taskStatus["15-0-" + a] : (4 === s ? g = 1 : 2 === s && (g = 2), o = d.taskStatus[a + "-" + g + "--1"]), o) {
						if ("presult" in r) {
							if (0 !== Number(r.presult) && 0 !== Number(r.result)) return void e.dialog.tips_black("领取失败！", 3)
						} else if (0 !== Number(r.result)) return void e.dialog.tips_black("领取失败！", 3);
						if (0 === Number(r.result) && (+r.sb > 0 && (c.find('[data-login-user="silver"]').text(+r.sb), l.find('[data-login-user="silver"]').text(+r.sb)), +r.gb > 0 && (c.find('[data-login-user="gold"]').text(+r.gb), l.find('[data-login-user="gold"]').text(+r.gb))), e.dialog.tips_black("恭喜您，已成功领取奖励！", 3), o.ps = 0, d.updateTask(), i) {
							var u;
							d.updateReward(i), u = 7 === s ? d.doms.taskPanel.find('.task-done-card[data-id="' + a + '"]') : d.doms.taskPanel.find('.task-done-card[data-tid="' + a + '"]'), u.remove(), 0 === d.doms.taskPanel.find(".task-done-card").length ? d.doms.taskPanel.find(".get-reward-list").remove() : d.doms.taskPanel.find(".get-reward-list span").text(d.doms.taskPanel.find(".task-done-card").length)
						} else 7 === s ? d.doms.taskPanel.find('.task-done-card[data-id="' + a + '"]').remove() : d.doms.taskPanel.find('.task-done-card[data-tid="' + a + '"]').remove(), 0 === d.doms.taskPanel.find(".task-done-card").length ? d.doms.taskPanel.find(".get-reward-list").remove() : d.doms.taskPanel.find(".get-reward-list span").text(d.doms.taskPanel.find(".task-done-card").length);
						if (d.config.doneData && d.config.doneData.length) for (var m = 0; m < d.config.doneData.length; m++) 7 === s && Number(d.config.doneData[m].app_id) === a ? d.config.doneData.splice(m, 1) : Number(d.config.doneData[m].task_id) === a && d.config.doneData[m].g_t === s && d.config.doneData.splice(m, 1)
					}
				}
			} else t.msg ? e.dialog.tips_black(t.msg, 1) : e.dialog.tips_black("领取失败", 1)
		},
		updateReward: function(e) {
			var t = [];
			e.caviar && (this.config.reward.caviar += e.caviar), this.config.reward.caviar > 0 && t.push("<span>" + this.config.reward.caviar + "</span>鱼籽"), e.coupon && (this.config.reward.coupon += e.coupon), this.config.reward.coupon > 0 && t.push("<span>" + this.config.reward.coupon + "</span>元代金券"), e.silver && (this.config.reward.silver += e.silver), this.config.reward.silver > 0 && t.push("<span>" + this.config.reward.silver + "</span>鱼丸"), e.gold && (this.config.reward.gold += e.gold), this.config.reward.gold > 0 && t.push("<span>" + this.config.reward.gold + "</span>鱼翅"), e.prop && (this.config.reward.prop += e.prop), this.config.reward.prop > 0 && t.push("<span>" + this.config.reward.prop + "</span>个道具礼包"), e.game && (this.config.reward.game += e.game), this.config.reward.game > 0 && t.push("<span>" + this.config.reward.game + "</span>个游戏礼包"), e.lottery && (this.config.reward.lottery += e.lottery), this.config.reward.lottery > 0 && t.push("<span>" + this.config.reward.lottery + "</span>次抽奖机会"), this.doms.taskPanel.find(".gift-list").show(), this.doms.taskPanel.find(".gift-list div").html(t.join("、"))
		},
		getTemplate: function(e) {
			switch (e) {
			case "main":
				return s.string.join('<div class="task-top">', '<div class="task-tabs-item task-tabs-item-first" data-tab="recommend">', "<span>推荐任务</span>", "</div>", '<div class="task-tabs-item" data-tab="web-game">', "<span>页游任务</span>", "</div>", '<div class="task-tabs-item" data-tab="ios-game">', "<span>苹果任务</span>", "</div>", '<div class="task-tabs-item" data-tab="android-game">', "<span>安卓任务</span>", "</div>", '<div class="task-tabs-item" data-tab="novice">', "<span>新手任务</span>", "</div>", '<div class="task-tabs-item" data-tab="record">', "<span>领取记录</span>", "</div>", '<div class="task-close"></div>', "</div>", '<div class="task-content-wrap">', '<div class="task-content task-loading recommend active"></div>', '<div class="task-content task-loading web-game"></div>', '<div class="task-content task-loading ios-game"></div>', '<div class="task-content task-loading android-game"></div>', '<div class="task-content task-loading novice"></div>', '<div class="task-content task-loading record"></div>', "</div>");
			case "gameSideCard":
				return s.string.join("{{ each list as game index }}", '<div class="game-side-card" data-id="{{game.app_id}}"  data-isnew="{{game.is_new}}" data-gtt="{{game.gtt}}">', '<div class="name-info" title="{{game.name}}"><span class="name">{{game.name}}</span>(<span class="complete-status">0</span>/{{game.tt}})</div>', "{{if game.totalSilver > 0}}", '<div class="total-reward {{if !recommend}}no-recommend{{/if}}">最高可得<span>{{game.totalSilver}}</span>鱼丸</div>', "{{/if}}", "{{if recommend}}", '<div class="platform">{{game.platform}}</div>', "{{/if}}", '<div class="trigger-icon"></div>', '<div class="task-status-list">', "{{each game.ts as task }}", '<div class="task-status" data-tid="{{task.task_id}}"  data-all="{{task.levels_cnt}}"><i class="{{task.task_type_class}}"></i><span class="task-name">{{task.name}}</span>(<span class="done-num">0</span>/{{task.levels_cnt}})</div>', "{{/each}}", "</div>", "</div>", "{{/each}}");
			case "recommend":
				return s.string.join('<div class="task-game-list-bar">', "</div>", '<div class="recommend-task-main">', '<div class="recommend-game-list">', "</div>", "</div>", '<div class="game-top-info">', "<p>使用斗鱼APP扫码下载</p>", '<div class="qr-img"></div>', "</div>", '<div class="footer-fix"><a class="play-btn-bottom" target="_blank"></a>');
			case "gameList":
				return s.string.join('<div class="task-game-list-bar">', "</div>", '<div class="game-main">', "</div>", '<div class="game-top-info">', "<p>使用斗鱼APP扫码下载</p>", '<div class="qr-img"></div>', "</div>");
			case "novice":
				return s.string.join('<div class="novice-title">任务说明：完成任务后，返回任务大厅领取鱼丸</div>', '<div class="novice-task-main">', "<p>{{ts.length}}个任务</p>", '<div class="novice-game-list">', "{{ each ts as task index}}", this.getTemplate("noviceTask"), "{{/each}}", "</div>", "</div>");
			case "noviceTask":
				return s.string.join('<div class="novice-task" data-tid="{{task.tId}}" data-gtt="5">', '<div class="task-icon task-{{task.tId}}"></div>', '<div class="task-name">{{task.tName}}</div>', "{{ if task.award.caviar}}", '<div class="task-reward platform-coin">', "<i></i>{{task.award.caviar}}鱼籽</div>", "{{/if}}", "{{ if task.award.coupon}}", '<div class="task-reward coupon">', "<i></i>{{task.award.coupon}}元代金券</div>", "{{/if}}", "{{ if task.award.silver}}", '<div class="task-reward silver">', "<i></i>{{ task.award.silver}}鱼丸</div>", "{{/if}}", "{{ if task.award.prop}}", '<div class="task-reward gift">', "<i></i><span>{{task.award.prop}}</span>个道具</div>", "{{/if}}", '<div class="task-description">打开斗鱼个人中心，在基本资料中完成{{task.tName}}</div>', '<a class="action-btn todo" href="{{task.cUrl}}" target="_blank">{{task.cName}}</a>', "</div>");
			case "taskDoneCard":
				return s.string.join('<div class="gift-list">您已成功领取到：<div></div></div>', "{{each list as task index}}", '<div class="task-done-card" data-id="{{task.app_id}}" data-tid="{{task.task_id}}" {{if (task.g_t === 3 && task.sst !== "old_android")}}data-gtt="1"{{else}}data-gtt="{{task.g_t}}"{{/if}}>', '<div class="task-title">', '<div class="task-name">{{task.name}}</div>', '<div class="game-name">{{task.app_name}}</div>', '<div class="platform {{if task.g_t === 2 || task.g_t === 7}}ios{{else if (task.g_t === 3 && task.sst === "old_android") || task.g_t === 4}}android{{else}}web{{/if}}"></div>', "</div>", '<div class="reward-list">', "{{ if task.caviar > 0}}", '<div class="task-reward platform-coin" data-num="{{task.caviar}}"><i></i>{{task.caviar}}鱼籽</div>', "{{/if}}", "{{ if task.coupon > 0}}", '<div class="task-reward coupon" data-num="{{task.coupon}}"><i></i>{{task.coupon}}元代金券</div>', "{{/if}}", "{{ if task.silver > 0}}", '<div class="task-reward silver" data-num="{{task.silver}}"><i></i>{{task.silver}}鱼丸</div>', "{{/if}}", "{{ if task.gold > 0}}", '<div class="task-reward gold" data-num="{{task.gold}}"><i></i>{{task.gold}}鱼翅</div>', "{{/if}}", "{{ if task.prop && task.prop.length}}", "{{each task.prop as prop}}", '<div class="task-reward gift" data-pid="{{prop.prop_id}}" data-num="{{prop.prop_num}}">', "<i></i>{{if prop.prop_num > 1}}{{prop.prop_num}}个{{/if}}<span>{{prop.prop_name}}</span>", "</div>", "{{/each}}", "{{/if}}", "{{ if task.gift && task.gift.length}}", "{{each task.gift as gift}}", '<div class="task-reward game" data-gid="{{gift.id}}" data-num="{{gift.num}}">', "<i></i>{{if gift.num > 1}}{{gift.num}}个{{/if}}<span>{{gift.name}}</span>", "</div>", "{{/each}}", "{{/if}}", "{{ if task.lottery && task.lottery.length}}", "{{each task.lottery as lottery}}", '<div class="task-reward lottery" data-url="{{lottery.id}}" data-num="{{lottery.num}}">', "<i></i>{{lottery.num}}次<span>抽奖机会</span>", '<div class="lottery-info">', '<div class="arrow"></div>', "<p>{{lottery.name}}</p>", '<div class="lottery-url qr-img" data-url="{{lottery.mg_act_url}}"></div>', "<span>斗鱼APP扫码参与抽奖</span>", "</div>", "</div>", "{{/each}}", "{{/if}}", '<div class="get-reward-btn active one-key">领取</div>', "</div>", "</div>", "{{/each}}");
			case "recordCard":
				return s.string.join("{{ each list as record}}", '<div class="record-card">', '<div class="task-title">', '<span class="task-name" title="{{record.name}}">{{record.name}}</span>', '<span class="time">{{record.receive_time}}</span>', '<span class="game-name" title="{{record.app_name}}">{{record.app_name}}</span>', "</div>", '<div class="reward-list">', "{{ each record.level as level}}", '<div class="reward-detail">', '<span class="task-description" title="{{level.condition}}">{{level.condition}}</span>', "{{if level.reward}}", '<div class="rewards">', "{{if level.reward.caviar}}", '<span class="task-reward platform-coin"><i></i>{{level.reward.caviar}}鱼籽</span>', "{{/if}}", "{{if level.reward.coupon && level.reward.coupon.length}}", "{{each level.reward.coupon as coupon}}", '<span class="task-reward coupon"><i></i>{{coupon.name}}</span>', "{{/each}}", "{{/if}}", "{{if level.reward.silver}}", '<span class="task-reward silver"><i></i>{{level.reward.silver}}鱼丸</span>', "{{/if}}", "{{if level.reward.gold}}", '<span class="task-reward gold"><i></i>{{level.reward.gold}}鱼翅</span>', "{{/if}}", "{{if level.reward.prop && level.reward.prop.length}}", "{{each level.reward.prop as prop}}", '<span class="task-reward gift" data-pid={{prop.prop_id}}><i></i>{{if prop.prop_num > 1}}{{prop.prop_num}}个{{/if}}<span>{{prop.prop_name}}</span></span>', "{{/each}}", "{{/if}}", "{{ if level.reward.gift && level.reward.gift.length}}", "{{each level.reward.gift as gift}}", '<div class="task-reward game" data-gid="{{gift.id}}">', "<i></i>{{if gift.num > 1}}{{gift.num}}个{{/if}}<span>{{gift.name}}</span>", "</div>", "{{/each}}", "{{/if}}", "{{ if level.reward.lottery && level.reward.lottery.length}}", "{{each level.reward.lottery as lottery}}", '<div class="task-reward lottery" data-url="{{lottery.id}}">', "<i></i>{{lottery.num}}次<span>抽奖机会</span>", '<div class="lottery-info">', '<div class="arrow"></div>', "<p>{{lottery.name}}</p>", '<div class="lottery-url qr-img" data-url="{{lottery.mg_act_url}}"></div>', "<span>斗鱼APP扫码参与抽奖</span>", "</div>", "</div>", "{{/each}}", "{{/if}}", "</div>", "{{/if}}", "</div>", "{{/each}}", "</div>", "</div>", "{{/each}}");
			case "gameAllTask":
				return s.string.join('<div class="game-task-panel" data-id="{{app_id}}">', '<div class="game-info">', '<img class="game-icon" src="{{icon}}"/>', '<div class="game-name">{{name}}</div>', '<div class="game-type">{{cid2_name}} | {{size}}</div>', '<div class="game-description">{{desc}}</div>', '<div class="divide-line"></div>', '<div class="qr-code">', '<div class="qr-img" data-url="{{url}}" data-dltask="{{has_dl_task}}" data-midurl="{{mid_url}}"></div>', "<p>斗鱼APP扫码下载</p>", "</div>", "</div>", '{{if gameType === "ios"}}', '<div class="ios-tip"><i></i>任务需知', '<div class="tip-popup">', '<div class="background"></div>', '<div class="arrow-up"></div>', "<p>• 若为充值类任务或其他游戏内任务，则必须先完成激活任务后，才可继续进行其他任务。<br><br>• 必须从最新版斗鱼APP跳转到app store下载游戏才可以完成任务。<br><br>• 如任务无法完成，请检查 设置-隐私-广告 中的限制广告跟踪功能 是否已开启。如已开启，请关闭限制广告跟踪功能后重新从斗鱼APP下载游戏。</p>", "</div>", "</div>", "{{/if}}", '{{if gameType === "android"}}', '<div class="ios-tip"><i></i>任务需知', '<div class="tip-popup">', '<div class="background"></div>', '<div class="arrow-up"></div>', "<p>• 请务必确认您已使用您的斗鱼账号登录游戏。只有使用斗鱼账号登录才可能获得任务奖励。<br><br>• 部分手机厂商会以系统安全为由欺骗您并替换您从斗鱼下载的游戏安装包，请在安装游戏时务必注意系统提示，斗鱼确保您从官方app内下载的任何手游都是安全无毒的。</p>", "</div>", "</div>", "{{/if}}", '<div class="reward-time-rule"><i></i>奖励领取期限', '<div class="rule-popup">', '<div class="background"></div>', '<div class="arrow-up"></div>', "<p>奖励领取期限说明</p>", "<p>1. 每日、每周、每月任务，必须在完成任务的周期内领取奖励，否则将失去领取机会</p>", "<p>2. 短期且仅可完成一次的任务，必须在任务结束后24小时内领取奖励，否则将失去领取机会</p>", "<p>3. 长期在线且仅可完成一次的任务，需要在任务完成后30天内领取奖励，否则将失去领取机会</p>", "</div>", "</div>", '<div class="task-main">', "{{ each ts as task index}}", '<div class="game-task-all" data-tid="{{task.task_id}}" data-gtt="{{gtt}}">', '<div class="task-title">', '<img class="task-icon" src="{{task.icon}}"/>', '<div class="task-name" title="{{task.name}}">', '<span class="name-text">{{task.name}}</span>', '<span class="task-status">(<i>0</i>/{{task.levels.length}})</span>', "{{ if task.is_limit === 1}}", '<span class="remain-num">剩余0份</span>', "{{/if}}", "</div>", '<div class="status {{task.status}}"></div>', '<div class="tag-list">', "{{ if task.tag}}", '<span class="tag">{{task.tag}}</span>', "{{/if}}", "{{ if task.reset_type}}", '<span class="tag">{{ if task.reset_type === 1}}每日任务{{ else if task.reset_type === 2}}每周任务{{ else if task.reset_type === 3}}每月任务{{ else if task.reset_type === 4}}{{if task.t_type === 1}}长期任务{{else}}短期任务{{/if}}{{/if}}<i class="help"></i>', '<div class="help-popup">', '<div class="arrow-up"></div>', '<div class="background"></div>', "<p>1.每日、每周、每月任务，必须在完成任务的周期内领取奖励，否则将失去领取机会</p>", "<p>2.短期且仅可完成一次的任务，必须在任务结束后24小时内领取奖励，否则将失去领取机会</p>", "<p>3.长期在线且仅可完成一次的任务，需要在奖励完成后30天内领取奖励，否则将失去领取机会</p>", "</div>", "</span>", "{{/if}}", "</div>", '<div class="task-description">{{#task.task_desc}}</div>', "</div>", '<div class="task-list">', "{{ each task.levels as level }}", '<div class="task-item">', "{{ if is_new === 1 || task.gtt === 7}}", '<span class="task-detail">{{level.desc}}，获得</span>', '<div class="rewards">', "{{ if level.reward.caviar}}", '<div class="task-reward platform-coin">', "<i></i>{{level.reward.caviar}}鱼籽", "</div>", "{{/if}}", "{{ if level.reward.coupon}}", "{{each level.reward.coupon as coupon}}", '<div class="task-reward coupon">', "<i></i>{{coupon.name}}", "</div>", "{{/each}}", "{{/if}}", "{{ if level.reward.silver && level.reward.silver.num}}", '<div class="task-reward silver">', "<i></i>{{level.reward.silver.num}}鱼丸", "</div>", "{{/if}}", "{{ if level.reward.gold}}", '<div class="task-reward gold">', "<i></i>{{level.reward.gold}}鱼翅", "</div>", "{{/if}}", "{{ if level.reward.prop && level.reward.prop.prop_num}}", '<div class="task-reward gift" data-pid="{{level.reward.prop.prop_id}}">', "<i></i>{{if level.reward.prop.prop_num > 1}}{{level.reward.prop.prop_num}}个{{/if}}<span>{{level.reward.prop.prop_name}}</span>", "</div>", "{{/if}}", "{{ if level.reward.gift && level.reward.gift.length}}", "{{each level.reward.gift as gift}}", '<div class="task-reward game" data-gid="{{gift.id}}">', "<i></i>{{if gift.num > 1}}{{gift.num}}个{{/if}}<span>{{gift.name}}</span>", "</div>", "{{/each}}", "{{/if}}", "{{ if level.reward.lottery && level.reward.lottery.length}}", "{{each level.reward.lottery as lottery}}", '<div class="task-reward lottery" data-url="{{lottery.id}}">', "<i></i>{{lottery.num}}次<span>抽奖机会</span>", '<div class="lottery-info">', '<div class="arrow"></div>', "<p>{{lottery.name}}</p>", '<div class="lottery-url qr-img" data-url="{{lottery.mg_act_url}}"></div>', "<span>斗鱼APP扫码参与抽奖</span>", "</div>", "</div>", "{{/each}}", "{{/if}}", "</div>", "{{else}}", "{{ if task.task_type == 1}}", '<span class="task-detail">', "单天等级提升{{level.up_grade}}级，可获得</span>", "{{ else if task.task_type == 2}}", '<span class="task-detail">', "达到{{level.to_grade}}级，可获得</span>", "{{ else if task.task_type == 3}}", '<span class="task-detail">', "单天充值满{{level.rmb}}RMB，可获得</span>", "{{ else if task.task_type == 5}}", '<span class="task-detail">', "到达{{level.to_grade}}战斗力，可获得</span>", "{{/if}}", '<div class="rewards">', '{{ if level.silver && level.silver !== "0"}}', '<div class="task-reward silver">', "<i></i>{{level.silver}}鱼丸", "</div>", "{{/if}}", "{{ if level.props && level.props.length}}", "{{each level.props as prop}}", '<div class="task-reward gift" data-pid="{{prop.prop_id}}">', "<i></i>{{if prop.prop_num > 1}}{{prop.prop_num}}个{{/if}}<span>{{prop.prop_name}}</span>", "</div>", "{{/each}}", "{{/if}}", "</div>", "{{/if}}", '<span class="complete-status">未完成</span>', '<div class="clearfix"></div>', "</div>", "{{/each}}", '<div class="task-footer">', "{{ if task.t_type !== 1}}", '<span class="time">{{task.startTime}} 至 {{task.endTime}}</span>', "{{/if}}", "{{if task.reward_channel === 2}}", '<div class="channel-tip"><i></i>提示', '<div class="tip-popup">', '<div class="background"></div>', '<div class="arrow-right"></div>', "<p>此任务的奖励会自动发放，无需手动领取。完成任务后请关注站内信通知。</p>", "<p>必须从最新版本斗鱼app跳转至app store下载游戏才可以完成任务。如果任务无法完成，请检查设置-隐私-广告中的限制广告跟踪功能是否已开启。如已开启，请关闭限制广告跟踪功能后重新从斗鱼app下载游戏。</p>", "</div>", "</div>", "{{else}}", '<div class="get-reward-btn disabled">全部领取</div>', "{{/if}}", "</div>", "</div>", "</div>", "{{/each}}", "</div>", "</div>");
			case "webGameTask":
				return s.string.join('<p class="task-num">{{ts.length}}个任务</p>', '<div class="web-game-task" data-id="{{app_id}}">', "{{ each ts as task index}}", '<div class="game-task-all" data-tid="{{task.task_id}}" data-gtt="{{gtt}}">', '<div class="task-title">', '<img class="task-icon" src="{{task.icon}}"/>', '<div class="task-name" title="{{task.name}}">{{task.name}}</div>', '<div class="status"></div>', '<div class="task-description">{{#task.task_desc}}</div>', "</div>", '<div class="task-list">', '<div class="task-footer">', '<div class="complete-status">任务完成进度 <span>0</span>/{{task.levels.length}}</div>', '<div class="get-reward-btn disabled">领取</div>', "</div>", "</div>", "</div>", "{{/each}}", "</div>");
			default:
				return ""
			}
		},
		request: function(t, a, s, i, n) {
			var r = this,
				o = a,
				d = s,
				c = i,
				l = n;
			"string" != typeof o && (l = c, c = d, d = o, o = "GET"), "function" == typeof d && (l = c, c = d), l && r.config.loadLock[l] || (l && (r.config.loadLock[l] = !0), e.ajax({
				url: t,
				type: o,
				data: d,
				dataType: "json",
				success: function(t) {
					l && (r.config.loadLock[l] = !1), 0 === t.error ? c(t.data) : e.dialog.tips_black(t.msg)
				},
				error: function(t) {
					l && (r.config.loadLock[l] = !1), e.dialog.tips_black("请求失败")
				}
			}))
		}
	};
	return {
		init: function() {
			l.init()
		}
	}
}), define("douyu/page/room/normal/mod/account-security-qa", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/template/2.0", "shark/util/cookie/1.0", "douyu/context", "douyu/page/room/base/api"], function(e, t, a, s, i, n, r) {
	var o = {
		notComplete: "请完成所有问题之后再提交",
		netError: "网络故障，请求失败",
		tipsSuccess: "帐号安全验证成功",
		questionLength: 0,
		answers: [],
		quizId: null,
		submitLock: !1,
		submitUrl: "/member/accountVerify/verifyValidate",
		getSecurityQuiz: "/member/accountVerify/securityQuiz",
		csrfUrl: "/curl/csrfApi/getCsrfCookie",
		verifyType: 3
	},
		d = {
			init: function(t) {
				o.resource = t.resource;
				var a = t.data;
				"string" === e.type(a) ? this.renderEmpty(a) : (o.answers = [], o.quizId = a.quizId, o.questionLength = a.quizContent && a.quizContent.length, this.renderList(a.quizContent || [])), this.getDoms(), this.bindEvent()
			},
			getCSRFCookie: function(t) {
				var a = this,
					s = i.get(n.get("sys.tvk")),
					r = n.get("sys.tn");
				return s ? void(t && t({
					name: r,
					value: s
				})) : void e.ajax({
					url: o.csrfUrl,
					type: "GET",
					dataType: "json",
					success: function(e) {
						0 === e.error && a.getCSRFCookie(t)
					}
				})
			},
			sendAjax: function(t) {
				this.getCSRFCookie(function(a) {
					t.data || (t.data = {}), t.data[a.name] = a.value, e.ajax({
						url: t.url,
						type: "POST",
						dataType: "json",
						data: t.data,
						complete: t.complete || e.noop,
						success: t.success || e.noop,
						error: t.error || e.noop
					})
				})
			},
			getDoms: function() {
				var t = e("#account-security-qa-wrap");
				this.doms = {
					wrap: t,
					preWrap: e("#account-security-wrap"),
					cancelBtn: t.find(".js-account-security-qa-cancel"),
					closeBtn: e(".account-security .aui_close")
				}
			},
			renderEmpty: function(t) {
				var a = e("#account-security-qa-wrap"),
					s = ['<div class="account-security-qa-nodata">', "<p>" + t + "</p>", '<a class="account-security-qa-btn js-account-security-qa-cancel">返回</a>', "</div>"].join("");
				a.html(s)
			},
			renderList: function(t) {
				var a = this.tpl(t),
					s = e("#account-security-qa-wrap");
				s.html(a), e(".account-security-qa-question-wrap").mCustomScrollbar()
			},
			tpl: function(e) {
				var t = a.string.join("{{if data.length}}", '<p class="account-security-qa-info">请完成以下安保问题以验证身份，所有选项为单选：</p>', '<div class="account-security-qa-question-wrap">', "{{each data as $qa $i}}", '<p class="account-security-qa-question">{{$i + 1}}.{{$qa.title}}</p>', "<p>", "{{each $qa.answers as $answer $j}}", '<span class="account-security-qa-answer js-account-security-qa-answer" data-account-question-index={{$i}} data-account-question-id={{$qa.id}} data-account-answer-index={{$j}}>{{$answer}}</span>', "{{/each}}", "</p>", "{{/each}}", "</div>", '<div class="account-security-qa-footer">', '<a class="account-security-qa-btn account-security-qa-submit js-account-security-qa-submit">提交验证</a>', '<a class="account-security-qa-btn account-security-qa-cancel js-account-security-qa-cancel">返回</a>', "</div>", "{{ else }}", '<div class="account-security-qa-nodata">', "<p>亲爱的用户，您的行为过少，请联系客服。</p>", '<a class="account-security-qa-btn js-account-security-qa-cancel">返回</a>', "</div>", "{{/if}}"),
					i = s.compile(t);
				return i({
					data: e
				})
			},
			refreshQuiz: function() {
				var t = this;
				this.sendAjax({
					url: o.getSecurityQuiz,
					success: function(a) {
						0 === +a.error ? t.init({
							data: a.data,
							resource: o.resource
						}) : a.msg && e.dialog.tips_black(a.msg)
					},
					error: function() {
						e.dialog.tips_black(o.netError)
					}
				})
			},
			show: function() {
				var e = this.doms.wrap;
				e.show()
			},
			bindEvent: function() {
				var a = this,
					s = a.doms;
				s.wrap.on("click", ".js-account-security-qa-answer", function(t) {
					var a = e(t.target),
						s = a.data("account-question-id"),
						i = a.data("account-question-index"),
						n = a.data("account-answer-index"),
						r = a.siblings();
					r.removeClass("active"), a.addClass("active"), o.answers[i] = {
						id: s,
						answer: n
					}
				}).on("click", ".js-account-security-qa-submit", function() {
					if (!o.submitLock) {
						var i = s.wrap.find(".js-account-security-qa-answer.active").length;
						if (i !== o.questionLength) return void e.dialog.tips_black(o.notComplete);
						var r = {
							rid: n.get("room.room_id"),
							resource: o.resource,
							quizId: o.quizId,
							code: JSON.stringify(o.answers),
							verify: o.verifyType
						};
						o.submitLock = !0, a.sendAjax({
							url: o.submitUrl,
							data: r,
							success: function(i) {
								o.submitLock = !1, 0 === +i.error ? (e.dialog.tips_black(o.tipsSuccess), s.closeBtn.click(), t.trigger("dys", {
									key: "dys.room.account.security.qa.success",
									type: 2
								})) : 50002 === +i.error ? (a.init({
									data: i.msg,
									resource: o.resource
								}), t.trigger("dys", {
									key: "dys.room.account.security.qa.fail",
									type: 2,
									em: i.msg
								})) : (i.msg && e.dialog.tips_black(i.msg), a.refreshQuiz(), t.trigger("dys", {
									key: "dys.room.account.security.qa.fail",
									type: 2,
									em: i.msg
								}))
							},
							error: function() {
								o.submitLock = !1, e.dialog.tips_black(o.netError), t.trigger("dys", {
									key: "dys.room.account.security.qa.fail",
									type: 2,
									em: o.netError
								})
							}
						}), t.trigger("dys", {
							key: "dys.room.account.security.qa.confirm",
							type: 2
						})
					}
				}), s.cancelBtn.on("click", function() {
					s.wrap.hide(), s.preWrap.show(), t.trigger("dys", {
						key: "dys.room.account.security.qa.back",
						type: 2
					})
				})
			}
		};
	return {
		init: function(e) {
			d.init(e)
		},
		show: function() {
			d.show()
		}
	}
}), define("douyu/page/room/normal/mod/gift-queue", ["jquery", "douyu/com/get-gift-configs"], function(e, t) {
	var a = function(a) {
			var s = this;
			t.getGift().done(function(t) {
				s.config = e.extend(!0, {
					giftConfig: t
				}, a || {}), s.init(a)
			})
		};
	e.extend(a.prototype, {
		init: function(e) {
			var t, a = this.config.giftConfig;
			this.queue = {}, this.types = {
				all: [],
				yw: [],
				yc: []
			}, this.locks = {}, this.timers = {};
			for (var s in a) t = a[s], this.queue[s] = [], this.types.all.push(s), 1 === t.type ? this.types.yw.push(s) : 2 === t.type && this.types.yc.push(s), this.locks[s] = !1
		},
		push: function(t, a) {
			if (t = String(t), "undefined" !== t && e.isPlainObject(a) && !e.isEmptyObject(a) && a.count && this.queue[t]) {
				for (var s, i = 0 === this.queue[t].length, n = [], r = 0; r < a.count; r++) s = e.extend(!0, {}, a), i && 0 === r && (s.delay = null), n.push(s);
				this.queue[t] = this.queue[t].concat(n)
			}
		},
		next: function(t, a) {
			if (t = String(t), "undefined" !== t && e.isFunction(a) && !this.islock(t)) {
				var s = this.queue[t].shift();
				s && (s.delay ? (this.lock(t), this.timers[t] = setTimeout(function() {
					a(s)
				}, s.delay)) : a(s))
			}
		},
		hasNext: function(e) {
			if (e = String(e), "undefined" !== e && void 0 !== this.queue[e]) return !!this.queue[e].length;
			for (var t in this.queue) if (this.queue[t].length) return !0;
			return !1
		},
		islock: function(e) {
			return this.locks[String(e)]
		},
		lock: function(e) {
			e = String(e), this.queue[e] && (this.locks[e] = !0)
		},
		unlock: function(e) {
			e = String(e), this.queue[e] && (this.locks[e] = !1)
		},
		clear: function(e) {
			var t = this.types.all;
			"yw" === e ? t = this.types.yw : "yc" === e && (t = this.types.yc);
			for (var a = 0, s = t.length; s > a; a++) this.queue[t[a]] = [], this.unlock(t[a])
		}
	});
	var s = new a;
	return s
}), define("douyu/page/room/normal/mod/account-security", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/template/2.0", "shark/util/cookie/1.0", "douyu/context", "douyu/com/vcode-v3", "douyu/page/room/base/api", "douyu/page/room/normal/mod/account-security-qa"], function(e, t, a, s, i, n, r, o, d) {
	var c = {
		getInfoUrl: "/member/accountVerify/verifyInfo",
		smsUrl: "/member/accountVerify/sendPhoneCaptcha",
		emailUrl: "/member/accountVerify/sendEmail",
		submitUrl: "/member/accountVerify/verifyValidate",
		csrfUrl: "/curl/csrfApi/getCsrfCookie",
		type: 0,
		pre: "account-security",
		v3Instance: null,
		lock: {},
		timer: null,
		time: 60,
		verifyType: 1
	},
		l = {
			success: "帐号安全验证成功",
			error: "网络故障，请求失败",
			v3Error: "极验验证码加载失败，请稍后重试",
			v3Empty: "请点击按钮进行验证",
			codeEmpty: "请输入验证码"
		},
		g = {
			init: function(e) {
				this.option = e || {}, this.resouce = e.dys_type, this.getInfoReq()
			},
			getDoms: function() {
				var t = e("#account-security-wrap");
				this.doms = {
					wrap: t,
					phoneInput: t.find(".js-account-security-input"),
					smsBtn: t.find(".js-account-security-sms"),
					submitBtn: t.find(".js-account-security-button"),
					v3Box: t.find(".account-security-captcha"),
					selectWrap: t.find(".js-account-security-select"),
					selectValue: t.find(".js-account-security-select-value"),
					selectList: t.find(".js-account-security-select-list")
				}
			},
			getCSRFCookie: function(t) {
				var a = this,
					s = i.get(n.get("sys.tvk")),
					r = n.get("sys.tn");
				return s ? void(t && t({
					name: r,
					value: s
				})) : void e.ajax({
					url: c.csrfUrl,
					type: "GET",
					dataType: "json",
					success: function(e) {
						0 === e.error && a.getCSRFCookie(t)
					}
				})
			},
			sendAjax: function(t) {
				this.getCSRFCookie(function(a) {
					t.data || (t.data = {}), t.data[a.name] = a.value, e.ajax({
						url: t.url,
						type: "POST",
						dataType: "json",
						data: t.data,
						complete: t.complete || e.noop,
						success: t.success || e.noop,
						error: t.error || e.noop
					})
				})
			},
			getInfoReq: function() {
				var t = this,
					a = {
						rid: n.get("room.room_id")
					};
				t.sendAjax({
					url: c.getInfoUrl,
					data: a,
					success: function(a) {
						if (0 === +a.error) {
							if (c.type = +a.data.validate_type, 4 === c.type) return;
							t.show(a.data)
						} else a.msg && e.dialog.tips_black(a.msg)
					},
					error: function() {
						e.dialog.tips_black(l.error)
					}
				})
			},
			show: function(a) {
				if (!e("." + c.pre).length) {
					var s = this,
						i = s.tpl(a);
					o.exe("js_exitFullScreen"), e.dialog({
						skin: c.pre,
						content: i,
						title: "",
						close: function() {
							s.v3Destroy()
						}
					}), s.getDoms(), s.v3Init(a.validate_str || {}), a.securityQuiz && 2 === +a.validate_type && d.init({
						resource: s.resouce,
						data: a.securityQuiz || {}
					}), s.bindEvt(), t.trigger("dys", {
						key: "dys.room.account.security.show.type" + c.type,
						resouce: s.resouce
					})
				}
			},
			hide: function() {
				e("." + c.pre).length && (e("." + c.pre).hide().remove(), this.v3Destroy())
			},
			tpl: function(e) {
				var t = +e.validate_type || 1,
					i = 0 === e.is_foreign ? "短信验证" : "语音验证",
					n = "",
					r = "";
				switch (t) {
				case 1:
					n = a.string.join('<div class="account-security-row">', '<div class="account-security-area"></div>', '<div class="account-security-captcha"></div>', "</div>"), r = "极验验证";
					break;
				case 2:
					n = a.string.join('<div class="account-security-row">', '<div class="account-security-area"></div>', '<div class="account-security-captcha type-sms"></div>', "</div>", '<div class="account-security-row">', '<div class="account-security-box clearfix">', '<input type="text" class="account-security-input fl js-account-security-input" maxlength="6" placeholder="请输入验证码"/>', '<button class="account-security-sms button fl js-account-security-sms">' + i + "</button>", "</div>", "</div>", "{{if data.securityQuiz}}", '<p class="account-security-other-wrap"><a class="account-security-other js-account-security-other" href="javascript:;">其他验证方式</a></p>', "{{/if}}", '<button class="account-security-submit button js-account-security-button">提交验证</button>'), r = e.email ? a.string.join('<div class="account-security-select js-account-security-select">', '<span class="account-security-select-arrow"></span>', '<div class="account-security-select-value js-account-security-select-value" title="">手机验证（' + (e.phone || "") + "）</div>", '<ul class="account-security-select-list js-account-security-select-list">', '<li class="account-security-select-item js-account-security-select-item" title="' + e.phone + '" data-verify-type="1" data-select-type=' + i + ">手机验证（" + (e.phone || "") + "）</li>", '<li class="account-security-select-item js-account-security-select-item" title="' + e.email + '" data-verify-type="2" data-select-type="发送验证码">邮箱验证（' + (e.email || "") + "）</li>", "</ul>", "</div>") : "手机验证（" + (e.phone || "") + "）", this.dysIsForeign = 0 === e.is_foreign ? "2" : "1";
					break;
				case 3:
					n = a.string.join('<div class="account-security-row account-security-666">', '请编辑短信： <span class="account-security-f70 account-security-text">{{ data.code }}</span>', '发送到： <span class="account-security-f70">{{ data.douyu_phone }}</span>', "</div>", '<div class="account-security-row">', '<span class="account-security-999 account-security-tip">', "短信费用一般为0.1元/条，全部由运营商收取", "</span>", "</div>", '<button class="account-security-submit account-security-next button js-account-security-button">我已发送短信，下一步</button>'), r = "手机验证（" + (e.phone || "") + "）"
				}
				var o = s.compile(n),
					d = o({
						data: e
					});
				return ['<div class="account-security-wrap" id="account-security-wrap">', '<div class="account-security-content">', '<div class="account-security-main">', '<div class="account-security-row">', '<span class="account-security-type">验证方式：</span>', '<span class="account-security-666">', r, "</span>", "</div>", d, "</div>", "</div>", "</div>", '<div class="account-security-qa-wrap" id="account-security-qa-wrap"></div>'].join("")
			},
			v3Init: function(e) {
				var t = this,
					a = e.success && e || null,
					s = this.doms.v3Box;
				!c.v3Instance && s.length && (c.v3Instance = r.init(s, {
					idpre: c.pre,
					checkOptions: a,
					success: function(e) {
						1 === c.type && t.sendSubmitReq(e)
					},
					error: function() {
						t.v3Error(s)
					}
				}, {
					area: ".account-security-area"
				}))
			},
			v3Error: function(e) {
				e.text(l.v3Error)
			},
			v3refresh: function() {
				c.v3Instance && c.v3Instance.refresh()
			},
			v3getResult: function() {
				return c.v3Instance ? c.v3Instance.getFastResult() : null
			},
			v3Destroy: function() {
				c.v3Instance && c.v3Instance.destroy(), c.v3Instance = null
			},
			countDown: function(e, t, a) {
				var s = this;
				a >= 0 ? (e.attr("disabled", !0).text(t + "(" + a + ")").addClass("gray"), a--, clearTimeout(c.timer), c.timer = setTimeout(function() {
					s.countDown(e, t, a)
				}, 1e3)) : s.clearSmsTimer(e)
			},
			clearSmsTimer: function(e) {
				clearTimeout(c.timer), e.attr("disabled", !1).text("重新获取").removeClass("gray")
			},
			restore: function() {
				var e = this;
				switch (c.type) {
				case 1:
					e.v3refresh();
					break;
				case 2:
					e.v3refresh(), e.clearSmsTimer(e.doms.smsBtn)
				}
			},
			sendSmsReq: function(t, a) {
				var s = this,
					i = t.text(),
					n = 1 === +c.verifyType ? c.smsUrl : c.emailUrl;
				c.lock.smsCode = !0, s.sendAjax({
					url: n,
					data: a,
					complete: function() {
						c.lock.smsCode = !1
					},
					success: function(a) {
						a && 0 === +a.error ? s.countDown(t, i, c.time) : (s.restore(), a.msg && e.dialog.tips_black(a.msg))
					},
					error: function() {
						s.restore(), e.dialog.tips_black(l.error)
					}
				})
			},
			sendSubmitReq: function(a) {
				var s = g;
				a.rid = n.get("room.room_id"), a.resource = s.resouce, c.lock.submit = !0, s.sendAjax({
					url: c.submitUrl,
					data: a,
					complete: function() {
						c.lock.submit = !1
					},
					success: function(a) {
						if (a && 0 === +a.error) {
							e.dialog.tips_black(l.success), s.hide();
							var i = {
								key: "dys.room.account.security.submit" + c.type + ".succ",
								resouce: s.resouce
							};
							2 === c.type && (i.verify_type = s.getVerifyType()), t.trigger("dys", i)
						} else {
							a.msg && e.dialog.tips_black(a.msg), s.restore();
							var i = {
								key: "dys.room.account.security.submit" + c.type + ".fail",
								resouce: s.resouce
							};
							2 === c.type && (i.verify_type = s.getVerifyType(), i.em = a.msg), t.trigger("dys", i)
						}
					},
					error: function() {
						e.dialog.tips_black(l.error), s.restore();
						var a = {
							key: "dys.room.account.security.submit" + c.type + ".fail",
							resouce: s.resouce
						};
						2 === c.type && (a.verify_type = s.getVerifyType(), a.em = l.error), t.trigger("dys", a)
					}
				})
			},
			getVerifyType: function() {
				return 1 === +c.verifyType ? this.dysIsForeign : 3
			},
			bindEvt: function() {
				var a = this,
					s = a.doms;
				s.wrap.on("click.get.sms.code", ".js-account-security-sms", function() {
					var s = a.v3getResult();
					if (!s) return void e.dialog.tips_black(l.v3Empty);
					var i = e(this);
					c.lock.smsCode || i.hasClass("gray") || (a.sendSmsReq(i, s), t.trigger("dys", {
						key: "dys.room.account.security.getsms",
						verify_type: a.getVerifyType(),
						resouce: a.resouce
					}))
				}).on("click.account.security.submit", ".js-account-security-button", function() {
					if (!c.lock.submit) {
						var i = {};
						if (2 === c.type) {
							if (!a.v3getResult()) return void e.dialog.tips_black(l.v3Empty);
							if (i.code = s.phoneInput.val(), !i.code) return void e.dialog.tips_black(l.codeEmpty);
							i.verify = c.verifyType
						}
						a.sendSubmitReq(i);
						var n = {
							key: "dys.room.account.security.submit" + c.type + ".click",
							resouce: a.resouce
						};
						2 === c.type && (n.verify_type = a.getVerifyType()), t.trigger("dys", n)
					}
				}).on("click.account.security.select", ".js-account-security-select", function() {
					s.selectList.toggle(), s.selectWrap.toggleClass("active")
				}).on("click.account.security.select", function(t) {
					e(t.target).closest(".js-account-security-select").length || (s.selectList.hide(), s.selectWrap.removeClass("active"))
				}).on("click.account.security.select", ".js-account-security-select-item", function(t) {
					var a = e(t.target),
						i = a.data("select-type"),
						n = a.data("verify-type");
					s.selectValue.text(a.text()), s.selectValue.attr("title", a.text()), s.smsBtn.text(i), c.verifyType = n
				}).on("click.account.security.select", ".js-account-security-other", function() {
					s.wrap.hide(), d.show(), t.trigger("dys", {
						key: "dys.room.account.security.qa.other",
						resouce: a.resouce
					})
				})
			}
		};
	return {
		init: function(e) {
			g.init(e)
		}
	}
}), define("douyu/page/room/normal/mod/gift", ["jquery", "shark/class", "shark/observer", "shark/util/cookie/1.0", "shark/util/flash/data/1.0", "shark/util/template/1.0", "shark/util/date/1.0/date", "douyu/context", "douyu/com/sign", "douyu/com/user", "douyu/com/exjsonp", "douyu/com/get-gift-configs", "douyu/page/room/base/api", "douyu/page/room/normal/mod/gift-queue", "shark/util/storage/1.0", "douyu/com/room-gift-tmp", "douyu/page/room/normal/mod/account-security"], function(e, t, a, s, i, n, r, o, d, c, l, g, u, m, p, f, h) {
	var v = "",
		y = "",
		b = {};
	a.on("mod.room.spring.activity.stage", function(e) {
		y = e
	}), a.on("mod.room.spring.gift.config", function(e) {
		v = e.giftId
	}), a.on("giftReturnPropBagConfig", function(e) {
		b = e || {}
	});
	var k, _, w = function(e) {
			var t = e || 0,
				a = 1e4,
				s = 1e8,
				i = Math.pow(10, 2);
			return t >= s ? Math.floor(t / s * i) / i + "亿" : t >= a ? Math.floor(t / a * i) / i + "万" : t > 0 ? Math.floor(t * i) / i : t
		},
		T = {
			CGIFT: {},
			SENDDATA: {},
			ERR: {
				207: "参数错误",
				218: "请先绑定手机！",
				284: "请稍后尝试。。",
				357: "没有找到礼物",
				291: "请稍后尝试。"
			},
			batchSwitch: !0,
			timer: null,
			panelWidth: 0,
			delay: 100,
			currentGiftId: null,
			prevGiftId: null,
			currentNumber: 0,
			slider: {
				prevActionWidth: 0,
				padding: 400,
				offset: 0,
				sliderWidth: 0,
				itemLength: 0,
				itemWidth: 0,
				listWidth: 0,
				visibleLength: 0,
				currentIndex: 0,
				delay: 300
			},
			nobleInfo: {
				load: !1,
				nl: 0
			},
			giftBatterData: {},
			giftConfigData: {},
			propConfigData: {},
			ywReturnSwitch: 0,
			lowYcConfig: {
				loadingImg: o.get("sys.web_url") + "app/douyu/res/page/room-normal/gift/qrcode-loading.gif?v=20180723",
				getCodeUrl: o.get("sys.pay_site_host") + "/m/gold/getQrCode",
				isShortGold: !1,
				willSendGift: "",
				willSendGiftNum: 0,
				willSendGiftName: "",
				giftId: "",
				willSendGold: 0,
				sendFlag: !0
			}
		},
		S = null,
		C = null,
		x = {
			data: null,
			promise: e.Deferred(),
			isLoading: 0,
			load: function() {
				var e = this,
					t = e.promise,
					a = o.get("sys.webconfUrl") + "resource/common/return_coin/web_return_switch.json";
				return e.data ? t.resolve(e.data) : e.isLoading ? t : (e.isLoading = 1, l.load(a, "yuwanReturnSwitch", function(a) {
					a ? (e.data = a, t.resolve(e.data)) : t.reject()
				}, function() {
					t.reject()
				}), t.promise())
			}
		};
	x.load().then(function(e) {
		var t = e || {};
		1 === t.show_switch && (T.ywReturnSwitch = 1)
	}), _ = t({
		getDoms: function() {
			var t = e("#gift-content");
			this.doms = {
				body: e("body"),
				giftContent: t,
				actions: e("#js-stats-and-actions"),
				giftSlider: t.find('[data-slider="slider"]'),
				giftSliderPrev: t.find('[data-slider="prev"]'),
				giftSliderNext: t.find('[data-slider="next"]'),
				giftSliderCont: t.find('[data-slider="cont"]'),
				giftSliderList: t.find('[data-slider="list"]'),
				giftInfoPanel: t.find('[data-type="gift-info-panel"]'),
				giftInfoCont: t.find('[data-type="gift-info-panel-cont"]')
			}
		},
		init: function() {
			return this.getDoms(), this.config = {
				giftConfigData: {}
			}, o.get("sys.uid") == o.get("room.owner_uid") ? void this.doms.giftContent.hide() : (this.addEvent(), void this.giftRecharge())
		},
		checkUser: function(e) {
			if (c.check()) return !0;
			switch (e) {
			case "cq":
				c.show("login", {
					source: "click_gift_chouqin"
				});
				break;
			case "gift":
				c.show("login", {
					source: "click_gift_send"
				});
				break;
			case "batch-send":
				c.show("login", {
					source: "click_gift_batch_send"
				});
				break;
			default:
				c.show("login")
			}
			return !1
		},
		CFMGiftcheck: function(t) {
			if ($ROOM.cfmGiftList && !([].concat($ROOM.cfmGiftList).indexOf(t) < 0) && 1 === +$ROOM.show_status) {
				var a = {
					room_id: $ROOM.room_id,
					gift_id: t
				};
				e.ajax("/special/tencentieg/hasCfmGameEffect", {
					type: "post",
					dataType: "json",
					data: a,
					success: function(t) {
						0 === +t.error && t.data.effect_tip && e.dialog.tips_black(t.data.effect_tip, 2)
					},
					error: function() {
						e.dialog.tips_black("查询失败", 1.5)
					}
				})
			}
		},
		addEvent: function() {
			var t = this,
				s = this.doms;
			s.giftContent.on({
				click: function() {
					var s = e(this),
						i = s.data("type"),
						n = s.data("noble") || 0;
					if ("gift" === i && a.trigger("dys", {
						key: "dys.room.gift.click",
						gfid: s.data("giftid")
					}), "cq" === i && a.trigger("dys", {
						key: "dys.room.gift.chouqin.click"
					}), !t.checkUser(e(this).data("type"))) return !1;
					T.nobleInfo.nl;
					return !T.nobleInfo.load || 1 !== n || 0 != T.nobleInfo.nl && 0 != T.nobleInfo.noble_gift ? void("gift" === i && t.giftSend({
						target: s,
						number: 1,
						batch: 0
					})) : void t.showNobleError()
				},
				mouseenter: function() {
					var a = e(this),
						i = (a.data("send"), parseFloat(a.data("name")), e("#gift-content")),
						n = i.find('[data-type="gift-info-panel"]');
					T.panelWidth = n.outerWidth();
					var r = i.find(".firstpay-warp"),
						o = 0;
					clearTimeout(T.timer), T.currentGiftId = a.data("giftid"), n.css("width", "auto"), T.prevGiftId !== T.currentGiftId && g.getGift().done(function(e) {
						T.giftConfigData = e, t.config.giftConfigData = e, t.updateGiftInfo()
					}), r && r.length && !r.is(":hidden") && (o = r.outerWidth(!0)), T.panelWidth = n.outerWidth(), n.find(".icon--conner-mark").length && (T.panelWidth += 12), T.panelWidth < 388 ? T.panelWidth = 388 : "", T.panelWidth > 500 ? T.panelWidth = 500 : "", n.stop(!0, !0).removeClass("out");
					var d = s.giftContent.offset(),
						c = a.offset(),
						l = c.left - (d.left + o) - T.panelWidth / 2 + a.width() / 2 + 4,
						u = c.top - d.top - a.height() - 5;
					return n.css("width", T.panelWidth), n.animate({
						left: l,
						bottom: -u
					}, T.delay, function() {
						n.show()
					}), t.CFMGiftcheck(a.data("giftid")), !1
				},
				mouseleave: function() {
					var t = e("#gift-content"),
						a = t.find('[data-type="gift-info-panel"]');
					return clearTimeout(T.timer), T.timer = setTimeout(function() {
						a.stop(!0, !0).hide().addClass("out")
					}, T.delay), !1
				}
			}, "[data-giftid]"), s.giftContent.on("click", '[data-type="toggle"]', function(t) {
				var s = e("#gift-content"),
					i = s.find('[data-type="gift-info-panel"]');
				i.find('[data-type="gift-info-panel-form"]').stop(!0, !0).slideToggle(200), e(this).toggleClass("slideDown"), a.trigger("dys", {
					key: "dys.room.giftSend.multi.send.show",
					gfid: T.currentGiftId
				}), t.stopPropagation()
			}).on({
				mouseenter: function() {
					clearTimeout(T.timer)
				},
				mouseleave: function() {
					var t = e("#gift-content"),
						a = t.find('[data-type="gift-info-panel"]');
					clearTimeout(T.timer), T.timer = setTimeout(function() {
						a.stop(!0, !0).hide().addClass("out")
					}, T.delay + 400)
				}
			}, '[data-type="gift-info-panel"]'), s.giftContent.on("click", "[data-gift-number]", function(t) {
				t.stopPropagation(), e(this).addClass("cur").siblings().removeClass("cur"), T.currentNumber = e(this).data("gift-number"), T.batchSwitch && e('[data-type="batch-send"]').removeClass("disabled"), e(".JS_batchgiftinput").addClass("hide"), e('.JS_batchgiftinput[data-gift-number="' + T.currentNumber + '"]').removeClass("hide"), e(".gift-form-userdefult input").val(T.currentNumber)
			}).on("focus", ".gift-form-userdefult", function() {
				e(this).addClass("cur").siblings().removeClass("cur");
				var a = e(this).find("input").val() || 0;
				t.checkNum(a) ? (T.currentNumber = a, e('[data-type="batch-send"]').removeClass("disabled")) : (T.currentNumber = 0, e('[data-type="batch-send"]').addClass("disabled")), e(".JS_batchgiftinput").addClass("hide"), e('.JS_batchgiftinput[data-gift-number="' + T.currentNumber + '"]').removeClass("hide")
			}).on("keyup blur", ".gift-form-userdefult", function() {
				e(this).addClass("cur").siblings().removeClass("cur");
				var a = e(this).find("input").val() || 0;
				t.checkNum(a) ? (T.currentNumber = a, e('[data-type="batch-send"]').removeClass("disabled")) : (T.currentNumber = 0, e('[data-type="batch-send"]').addClass("disabled")), e(".JS_batchgiftinput").addClass("hide"), e('.JS_batchgiftinput[data-gift-number="' + T.currentNumber + '"]').removeClass("hide")
			}).on("click", '[data-type="batch-send"]', function() {
				if (e(this).hasClass("disabled") || !T.batchSwitch || !t.checkUser(e(this).data("type"))) return !1;
				var a = s.giftContent.find('[data-giftid="' + T.currentGiftId + '"]'),
					i = a.data("noble") || 0;
				return 1 !== i || T.nobleInfo.nl ? void t.giftSend({
					target: a,
					number: T.currentNumber || 0,
					batch: 1
				}) : (s.giftInfoPanel.stop(!0, !0).hide().addClass("out"), void t.showNobleError())
			});
			var n = T.lowYcConfig;
			u.reg("room_data_handler", function(e) {
				var s = i.decode(e).too(),
					r = 0,
					o = 0,
					d = 0,
					c = 0,
					l = +n.willSendGold;
				"rechargenotify" == s.type && (t.lowYCDialog && (t.lowYCDialog.hide(), t.isNoYCFloatHide = !1), r = s.bl || 0, o = t.formatDecimals(r / 100, 2), d = s.rm || 0, c = t.formatDecimals(d / 100, 2), a.trigger("mod.userinfo.change", {
					current: {
						gold: o
					}
				}), n.isShortGold && l && c >= l ? t.remindYCSuccess(s) : t.remindSimpleSuc(s))
			})
		},
		checkNum: function(e) {
			var t = /^[1-9]\d*$/;
			return t.test(e) ? !(1 > e || e > 9999) : !1
		},
		giftSend: function(t) {
			if (o.get("sys.uid") == o.get("room.owner_uid")) return void e.dialog.tips_black("不能给自己赠送礼物");
			var s = this,
				i = e(t.target),
				n = i.data("giftid"),
				r = i.data("send"),
				d = i.data("exp"),
				c = i.data("face"),
				l = {
					gid: n,
					send: r,
					exp: d,
					count: 1,
					sdn: t.number,
					sid: o.get("sys.uid"),
					did: o.get("room.owner_uid"),
					rid: o.get("room.room_id"),
					batch: t.batch,
					faceEffect: c,
					num: 1
				},
				g = "full" === a.fire("mod.video.state.get") ? 2 : 1,
				u = T.giftConfigData[n];
			T.CGIFT.current = n, (1 === t.batch || m.hasNext(n)) && (l.delay = i.data("bi") || 0), m.push(n, l), 1 == r && m.next(n, function(e) {
				s.sendYW(e)
			}), 2 == r && m.next(n, function(e) {
				s.sendYC(e)
			}), 1 == t.batch && a.trigger("dys", {
				key: "dys.room.giftSend.multi.send",
				gfid: t.gid,
				yc: u && u.pc || "",
				num: t.number,
				name: t.target.data("giftname"),
				src_type: g
			})
		},
		handleFaceEffect: function(t, a) {
			var s = o.get("sys.nickname"),
				i = o.get("sys.uid"),
				n = "faceEffectNoRemind_" + s + "_" + i;
			if (p.get(n)) a(t.gid);
			else {
				var r = ['<div class="face-effect">', '    <div class="face-effect-header"></div>', '    <div class="face-effect-close JS_faceclose"></div>', '    <div class="face-effect-dialog">', '        <div class="face-effect-content">', '            <div class="face-effect-txt1">主播非手机颜值开播，无法匹配礼物脸部特效</div>', '            <div class="face-effect-txt2">特效不重要！我的爱依然浓烈~</div>', '            <div class="face-effect-bottom">', '                <div class="face-effect-remind">', '                    <div class="face-effect-checkbox JS_facenomind"></div>', '                    <div class="face-effect-noremind">不再提示</div>', "                </div>", '                <div class="face-effect-send JS_facesend" data-gid="' + t.gid + '">我要赠送礼物</div>', "            </div>", "        </div>", "    </div>", "</div>"].join("");
				e(".face-effect").remove(), e("body").append(r), e(".JS_facesend").on("click", function(t) {
					var s = e(t.target),
						i = s.data("gid");
					a(i), e(".face-effect").addClass("hide");
					var r = e(".JS_facenomind");
					r.hasClass("face-effect-nochecked") || p.get(n) || p.set(n, 1)
				}), e(".JS_facenomind").on("click", function(t) {
					e(".JS_facenomind").toggleClass("face-effect-nochecked")
				}), e(".JS_faceclose").on("click", function() {
					e(".face-effect").addClass("hide")
				})
			}
		},
		sendYW: function(e) {
			var t = i.encode([{
				name: "type",
				value: "dn_s_gf"
			}, {
				name: "gfid",
				value: e.gid
			}, {
				name: "num",
				value: e.sdn || e.num
			}]);
			T.CGIFT[e.gid] = {
				type: "dn_s_gf",
				gid: e.gid,
				sid: e.sid,
				did: e.did,
				rid: e.rid,
				exp: e.exp,
				dy: o.get("room.device_id"),
				num: e.num,
				sdn: e.sdn
			}, u.exe("js_giveGift", t)
		},
		sendYC: function(t) {
			var i, n, r, d, c = this,
				l = "full" === a.fire("mod.video.state.get") ? 2 : 1,
				g = T.giftConfigData[t.gid];
			n = function() {
				e.dialog.tips_black("赠送礼物失败！", 1.5), m.clear(), a.trigger("mod.gift.batch.switch.open"), a.trigger("dys", {
					key: "dys.room.giftSend.send.fail",
					gfid: t.gid,
					yc: g && g.pc || ""
				})
			}, i = function(s) {
				var i = s.result,
					n = {},
					r = s.data && s.data.ry || 0,
					o = 0;
				if (0 == i) this.fxPopGX({
					gid: s.data.gid || t.gid,
					num: s.data.gx * s.data.num,
					ywnum: r,
					sendNum: s.data.num
				}), 1 === +s.data.relive && (u.exe("js_get_relive_card"), a.trigger("room.activity.get.lifecard"), e.dialog.tips_black("复活卡+1，请等待题目推送")), a.trigger("dys", {
					key: "dys.room.giftSend.send.success",
					gfid: t.gid,
					yc: g && g.pc || "",
					src_type: l
				}), m.unlock(s.data.gid), m.hasNext() ? m.next(s.data.gid, function(e) {
					c.sendYC(e)
				}) : (m.clear(), a.trigger("mod.gift.batch.switch.open")), n = {
					gold: s.data.sb / 100,
					ngold: s.data.noble_gold / 100
				}, r && (n.silver = (parseInt(e("#js-stats-and-actions").find('[data-login-user="silver"]').text(), 10) || 0) + (parseInt(r, 10) || 0)), a.trigger("mod.userinfo.change", {
					current: n
				}), parseInt(s.data.noble_gold_black) && e('[data-login-content="yes"] .y3').hide(), 4 === +y && +t.gid === +v && a.trigger("mod.room.spring.activity.follow"), a.trigger("room.rotaryDraw.listen.getTicket", s.data), a.trigger("room.giftprop.send.success.land", s.data.gid), a.trigger("room.giftprop.send.success.loveheadline", s.data.gid), a.trigger("room.giftprop.send.success.valentine2018", s.data.gid), a.trigger("room.giftprop.send.success.starmagic", s.data.gid), a.trigger("room.giftprop.send.success.foolday2018", s.data.gid), a.trigger("room.giftprop.send.success.drawrebate", s.data.gid);
				else if (3 == i) {
					var d = s.data || {},
						p = d.pc || 0,
						f = {},
						b = T.lowYcConfig;
					o = c.formatDecimals(p / 100, 2), f.relCostGold = o, +o > 2e3 ? b.sendFlag && (b.sendFlag = !1, e.dialog.tips_black("鱼翅余额不足，请充值~"), setTimeout(function() {
						b.sendFlag = !0, a.trigger("room.com.show.iframe.pay")
					}, 1500)) : (10 > +o ? f.rechargeCostGold = 10 : f.rechargeCostGold = Math.ceil(o), c.remindYCLow(f, t, g), c.autoSendOrder(f)), a.trigger("mod.gift.batch.switch.open")
				} else 170001 == i ? h.init({
					dys_type: 2
				}) : (e.dialog.tips_black(s.msg, 1.5), m.clear(), a.trigger("mod.gift.batch.switch.open"))
			}, d = {
				num: t.num,
				sdn: t.sdn,
				sid: t.sid,
				did: t.did,
				rid: t.rid,
				exp: t.exp,
				dy: o.get("room.device_id")
			}, r = e.extend(!0, {
				gid: t.gid
			}, d), r[$SYS.tn] = s.get($SYS.tvk) || "", T.CGIFT[t.gid] = r, T.SENDDATA[t.gid] = d;
			var p = o.get("room.isVertical");
			!t.faceEffect || p ? e.ajax("/member/gift/send/" + t.gid, {
				type: "post",
				dataType: "json",
				data: d,
				success: e.proxy(i, this),
				error: n
			}) : c.handleFaceEffect(t, function(t) {
				var a = T.SENDDATA[t];
				e.ajax("/member/gift/send/" + t, {
					type: "post",
					dataType: "json",
					data: a,
					success: e.proxy(i, c),
					error: n
				})
			})
		},
		showYWLowDlg: function() {
			var t = this,
				s = t.adInfo,
				i = '<div class="aui_content">',
				n = [];
			if (s) {
				var r = s.srcid.replace(/鱼丸/g, '<span class="highlight">鱼丸</span>');
				i += '<i class="ad-img"></i><p>赠送失败，鱼丸不足！</p><div class="ad-content" data-dysign="30013" data-dysign-gid="' + s.gid + '" data-dysign-mid="' + s.mid + '"><p class="ad-title">' + r + "</p></div>", n = [{
					content: "立即前往",
					className: "ok-btn",
					callback: function() {
						t.isNoYCFloatHide = !1, window.open(s.link), this.hide(), a.trigger("mod.sign.dot", "30013")
					}
				}, {
					content: "暂时不了",
					className: "cancel-btn",
					callback: function() {
						t.isNoYCFloatHide = !1, this.hide()
					}
				}]
			} else i += '<i class="ad-img no-btn"></i><p>赠送失败，鱼丸不足！</p><div>';
			e.dy_dialog(i, {
				title: "提示",
				className: "gift-error",
				mask: 1,
				width: "420px",
				height: "283px",
				buttons: n,
				afterHide: function() {
					t.isNoYCFloatHide = !1
				}
			})
		},
		remindYWLow: function() {
			var e = this;
			e.isNoYCFloatHide || (e.isNoYCFloatHide = !0, e.showYWLowDlg = S.showYWLowDlg, e.adInfo ? e.showYWLowDlg() : d.getAdInfo("30013", function(t) {
				if (t[0]) {
					var a = t[0] || {},
						s = d.helper.innerLink(a);
					e.adInfo = {
						srcid: a.srcid,
						gid: a.gid,
						mid: a.mid,
						link: s
					}
				}
				e.showYWLowDlg(), d.exposure()
			}))
		},
		remindYCLow: function(t, s, i) {
			var r = this,
				o = T.lowYcConfig || {};
			r.lowYCDialog && (r.lowYCDialog.hide(), r.isNoYCFloatHide = !1), o.willSendGift = i.gift_pic, o.willSendGiftNum = s.sdn, o.willSendGiftName = i.name, o.isShortGold = !0, o.giftId = s.gid, o.willSendGold = t.relCostGold;
			var d = ['<div class="yc-tips-wraper">', '<div class="yc-tips-txt">', '<div class="yc-tips-title">', "鱼翅不足", "</div>", '<div class="yc-tips-nums">', '扫码快速充值<span class="yc-tips-nums-sp"><span class="js-tips-values"><%= rechargeVal%></span>鱼翅</span>', "</div>", '<a class="yc-open-iframe js-yc-open-iframe" href="javascript:;">其他金额充值&gt;</a>', "</div>", '<div class="yc-tips-code-content">', '<div class="yc-tips-code J_qrcode_content">', '<img src = "<%=defaultLoading%>"/>', "</div>", '<div class="yc-code-txt">微信/支付宝扫码付款</div>', "</div>", "</div>"].join(""),
				c = n.compile(d),
				l = c({
					rechargeVal: t.rechargeCostGold || "--",
					defaultLoading: o.loadingImg
				});
			r.isNoYCFloatHide || (r.isNoYCFloatHide = !0, r.lowYCDialog = e.dy_dialog(l, {
				title: "充值提示",
				className: "JS-yc-tips-wraper",
				width: 380,
				height: 260,
				mask: 1,
				afterHide: function() {
					r.isNoYCFloatHide = !1
				}
			}), m.clear("yc"), a.trigger("dys", {
				key: "dys.room.giftSend.charge.show",
				gfid: T.currentGiftId
			}))
		},
		remindYCSuccess: function(t) {
			var s = this,
				i = t || {},
				r = i.rm || 0,
				o = T.lowYcConfig || {},
				d = ['<div class="main-title">', '恭喜成功充值<span class="yc-tips-nums-sp"><%=rechargeGold%>鱼翅</span>', "</div>", '<div class="main-content">', '<div class="send-gift-icon"><img src="<%=lowYcConfig.willSendGift%>" alt=""></div>', '<div class="send-gift-txt">', '点击按钮消费<span class="yc-tips-nums-sp"><%=lowYcConfig.willSendGold%>鱼翅</span>赠送<span class="yc-tips-nums-sp">“<%=lowYcConfig.willSendGiftName%>”×<%=lowYcConfig.willSendGiftNum%></span>', "</div>", "</div>"].join(""),
				c = n.compile(d),
				l = c({
					rechargeGold: s.formatDecimals(r / 100, 2),
					lowYcConfig: o
				});
			s.isNoYCFloatHide || (s.isNoYCFloatHide = !0, e.dy_dialog(l, {
				title: "充值成功",
				className: "JS-yc-tips-wraper JS-yc-success-wraper",
				mask: 1,
				width: "390px",
				height: "310px",
				buttons: [{
					id: "pay-dialog-btn-confirm",
					content: "立即赠送",
					callback: function() {
						this.hide(), s.isNoYCFloatHide = !1, f.render().done(function() {
							var t = e('#gift-content [data-type=gift][data-giftid="' + o.giftId + '"]');
							t && t.length ? a.trigger("mod.gift.draw.batch.send", {
								target: t,
								number: +o.willSendGiftNum,
								batch: +o.willSendGiftNum > 1 ? 1 : 0
							}) : e.dialog.tips_black("赠送失败")
						})
					}
				}],
				afterHide: function() {
					s.isNoYCFloatHide = !1
				}
			}))
		},
		remindSimpleSuc: function(t) {
			var a = this,
				s = t || {},
				i = s.rm || 0,
				r = ['<div class="main-title">', '恭喜成功充值<span class="yc-tips-nums-sp"><%=rechargeGold%>鱼翅</span>', "</div>"].join(""),
				o = n.compile(r),
				d = o({
					rechargeGold: a.formatDecimals(i / 100, 2)
				});
			a.isNoYCFloatHide || (a.isNoYCFloatHide = !0, e.dy_dialog(d, {
				title: "充值成功",
				className: "JS-yc-tips-wraper JS-yc-success-wraper",
				mask: 1,
				width: "390px",
				height: "250px",
				buttons: [],
				afterHide: function() {
					a.isNoYCFloatHide = !1
				}
			}))
		},
		formatDecimals: function(e, t) {
			var a = new RegExp("(\\.\\d{" + t + "})\\d*$"),
				s = e + "",
				i = s.replace(a, "$1");
			return i = this.formatDotZero(i)
		},
		formatDotZero: function(e) {
			var t = /(\.\d+)0+$/;
			return e = e.replace(t, "$1"), parseInt(e, 10) == e && (e = parseInt(e, 10)), e
		},
		fxPopGX: function(t) {
			var s, i, n, r, o, d = this.doms.giftContent.find("[data-giftid=" + t.gid + "]"),
				c = d.offset(),
				l = t.ywnum > 0;
			a.fire("room.rotaryDraw.return.config").done(function(a) {
				var g = p.get("RotaryDraw_getTicket_tipShow");
				if (1 == a.is_open && t && t.gid == a.gift_id) {
					if (!(g > 0)) return;
					s = e('<span class="gift-success-tip-num">赠送成功，探险券+' + t.sendNum * a.gift_rebate_coupon + "</span>"), e("body").append(s), i = c.top - s.height(), n = c.left + (d.width() - s.width()) / 2, r = "-=10px", o = 500
				} else l ? (s = e('<span class="gift-success-tip-num">+' + t.ywnum + "鱼丸</span>"), e("body").append(s), i = c.top - s.height(), n = c.left + (d.width() - s.width()) / 2, r = "-=10px", o = 500) : (s = e('<span class="gift-success-tip">赠送成功</span>'), e("body").append(s), i = c.top + d.height() - s.height(), n = c.left - s.outerWidth(!0), r = "-=50px", o = "slow");
				s.show(), s.css({
					top: i,
					left: n
				}).animate({
					top: r
				}, o).fadeOut("slow", function() {
					e(this).remove()
				})
			})
		},
		updateGiftInfo: function() {
			var t, a, s, i, r, d, c, l = this,
				g = e("#gift-content"),
				u = g.find('[data-type="gift-info-panel-cont"]'),
				m = T.giftConfigData[T.currentGiftId],
				f = this.doms.giftContent.find('[data-giftid="' + T.currentGiftId + '"]'),
				h = f.data("type") || "",
				v = f.data("explain") || "",
				y = f.data("noble") || 0,
				k = [],
				_ = [],
				S = (C.searchGiftBatter(T.currentGiftId), f.data("devote") || 0),
				x = f.data("price") || 0,
				D = f.data("send") || 0,
				P = f.data("exp") || 0,
				$ = f.data("intimate") || 0,
				R = b.act_gift_id == T.currentGiftId ? 1 : 0,
				B = b.act_gift_name || "",
				I = b.user_return_gold_amount || "",
				q = "",
				A = "",
				G = "",
				j = 0,
				L = {};
			m ? (d = m.batchNum || [], c = m.hit || [], q = m.culture_content, A = m.desc_content_1, G = m.desc_content_2, j = m.isBatchGift, L = m.batchTemp || {}) : (d = "".split(","), c = []);
			for (var E = 0, N = d.length; N > E; E++)"" !== d[E] && k.push(d[E]);
			for (var M = 0, O = c.length; O > M; M++) c[M].is_show && _.push(c[M]);
			t = ["<%if ( isReturnBag ) { %>", '<div class="giftReturn-gift-wrap">', '<div class="giftReturn-gift-txt">', '<p class="giftReturn-gift-yellow">活动期间每日首次赠送<span><%= returnBagGiftName %></span>可额外领取：</p>', "<p><%= returnGoldNum %>鱼丸+海量粉丝道具（最多得100个）</p>", "</div>", "</div>", "<% } %>", "<%if ( batchPreset.length > 0 ) { %>", '<div class="giftReturn-gift-content">', "<% } else { %>", '<div class="gift-not-batch giftReturn-gift-content">', "<% } %>", '<% if ( type === "gift" ) { %>', "<% if (giftFlagData) { %>", '<div class="icon--conner-mark <%= giftFlagData.flagClass %>">', "<span><%= giftFlagData.flagName %></span>", "</div>", "<% } %>", '<div class="gift-info-panel-brief">', '<div class="gift-info-panel-img">', '<img src="<%= gifticon %>"><i></i>', "</div>", "<h4><strong><%= giftname %></strong><em>(<%= name %>", "<% if (returnYw) { %> 可返<%=returnYw  %>鱼丸<% } %>", ")</em>", "<% if (isDoubleIntimacy == 1 && exp > 0 && isDoubleIntimacyShow) { %>", '<span class="intimacy-label intimacy-label-show">(亲密度X2)</span>', "<% } %>", "</h4>", "<% if (!isBatchGift){%>", "<p>", "<% if(devote >0){%>", '<b>贡献 +<span title="<%= devote %>"><%= devote4Short %></span> </b>', "<% } %>", "<% if(exp >0){%>", '<b>经验 +<span title="<%= exp %>"><%= exp4Short %></span> </b>', "<% } %>", "<% if(intimate >0 ){%>", '<b>亲密度 +<span title="<%= intimate %>"><%= intimate4Short %></span> </b>', "<% } %>", "</p>", '<p class="gift-info-intro"><%= explain %></p>', "<p><em><%= intro %></em></p>", "<% } else { %>", '<p class="gift-info-panel-slogan"><em><%= culture_content %></em></p>', "<p><b><%= desc_content_1 %></b></p>", "<p><b><%= desc_content_2 %></b></p>", "<% }%>", "</div>", "<% if ( batchPreset.length <= 0) { %>", '<span class="gift-countdown hide"><em>--:--</em>内可连击</span>', "<% } %>", "<% if ( effect.length > 0 ) { %>", '<div class="gift-info-panel-explain">', "<% for (var i = 0, length = effect.length; i < length; i++) { %>", "<% var item = effect[i]; %>", "<p>连击<b><%= item.count %></b>次将", "<% if ( item.bt == 1 ) { %>", "触发房间广播特效", "<% } else if ( item.bt == 2 ) { %>", "触发网站广播特效", "<% } %>", "<% if ( item.bt > 0 && item.type > 0) { %>", "，并", "<% } %>", "<% if ( item.type > 0 ) { %>", "获得<em><%= item.name %></em><%= item.time_str %>", "<% } %>", "</p>", "<% } %>", "</div>", "<% } %>", "<% if(freeList.length > 0){%>", '<div class="double-hit" data-id="<%= giftid%>">', '<div class="double-hit-info">', "<% for( var j = 0; j< freeList.length&& j< 3; j++){ %>", "<% var giveitem = freeList[j];%>", '<p>连击<span class="double-hit-sign">&times;<%= giveitem.combo_num%></span>可获得<span class="double-hit-sign"><%= giveitem.name %></span>', "</p>", "<%}%>", '<a class="double-hit-more" href="javascript:;">奖品数量有限哦！点击查看活动详情&gt;</a>', "</div>", "</div>", "<%}%>", "<% } else { %>", '<div class="gift-info-panel-brief">', '<div class="gift-info-panel-img">', '<img src="<%= gifticon %>"><i></i>', "</div>", "<h4><strong><%= giftname %></strong><em>(<%= name %>)</em></h4>", "<% for (var i = 0, len = explain.length; i < len; i++) { %>", "<p><%= explain[i] %></p>", "<% } %>", "</div>", "<% } %>", "</div>", "<% if ( batchPreset.length > 0 ) { %>", "<% if ( effect.length > 0 ) { %>", '<div class="gift-info-panel-give" data-type="gift-info-give">', "<% } else { %>", '<div class="gift-info-panel-give gift-info-panel-give-not-explain" data-type="gift-info-give">', "<% } %>", '<span class="gift-countdown hide"><em>--:--</em>内可连击</span>', '<div class="gift-info-panel-form" style="display: block;" data-gid="<%=giftid%>" data-type="gift-info-panel-form">', "<% for (var i = 0, length = batchPreset.length; i < length; i++) { %>", "<% if (i < 5) { %>", '<a href="javascript:;" data-gift-number="<%= batchPreset[i] %>"><%= batchPreset[i] %></a>', " \r\n ", "<% } %>", "<% } %>", '<span href="javascript:;" class="gift-form-userdefult">', '<input type="text" placeholder="自定义" maxlength="4" />', "</span>", "<% if ( batchSwitch ) { %>", '<a href="javascript:;" class="gift-info-panel-form-send" data-type="batch-send">赠送</a>', "<% } %>", '<span class="justify-fix"></span>', "</div>", '<div class="gift-info-panel-attention">', "<% for (var i = 0, length = batchPreset.length; i < length; i++) { %>", "<% if (i == 0) {%>", '<span class="JS_batchgiftinput" data-gift-number="<%= batchPreset[i] %>">', "<% } else {%>", '<span class="JS_batchgiftinput hide" data-gift-number="<%= batchPreset[i] %>">', "<% }%>", '<span>"<%=batchTemp[batchPreset[i]].desc%>"：</span>', "<% if (giftType == 2) { %>", '<span class="gift-info-panel-red"><%=formatPrice(devote * batchPreset[i] / 10)%>鱼翅</span>', "<% } else if (giftType == 1) { %>", '<span class="gift-info-panel-red"><%=formatPrice(price * batchPreset[i])%>鱼丸</span>', "<% } %>", "</span>", "<% } %>", "</div>", "</div>", "<% } %>"].join(""), a = n.compile(t);
			var W = [];
			i = this.getGiftFlagData(T.currentGiftId), i ? r = {
				flagClass: i,
				flagName: m.gift_active_text || "礼物"
			} : 1 == y ? r = {
				flagClass: "icon--conner-mark-b1",
				flagName: "贵族"
			} : 2 == y && (r = {
				flagClass: "icon--conner-mark-b3",
				flagName: "周星"
			}), s = a({
				type: h,
				gifticon: f.data("gifticon") || o.get("sys.web_url") + "app/douyu/res/page/room-normal/loading.gif",
				giftname: f.data("giftname") || "",
				giftid: T.currentGiftId,
				name: f.data("name") || "",
				devote: S,
				price: x,
				giftType: D,
				formatPrice: l.formatPrice,
				exp: P,
				intimate: $,
				devote4Short: w(S),
				exp4Short: w(P),
				intimate4Short: w($),
				intro: f.data("intro") || "",
				explain: "gift" != h ? v.split("/") : v,
				effect: _,
				batchPreset: k,
				batchSwitch: T.batchSwitch,
				isNoble: y,
				freeList: W,
				isDoubleIntimacy: p.get("doubleIntimacy"),
				giftFlagData: r,
				returnYw: T.ywReturnSwitch && f.data("returnyw") || "",
				isReturnBag: R,
				returnBagGiftName: B,
				returnGoldNum: I,
				culture_content: q,
				desc_content_1: A,
				desc_content_2: G,
				isBatchGift: j,
				batchTemp: L
			}), u.html(s), T.prevGiftId = T.currentGiftId, u.find("[data-gift-number]").eq(0).click(), e(".gift-form-userdefult input").val(1)
		},
		formatPrice: function(e) {
			return e != parseInt(e) && (e = Number.prototype.toFixed.call(e, 1)), e
		},
		getGiftFlagData: function(e) {
			var t, a = T.giftConfigData[e];
			if (!a) return !1;
			switch (parseInt(a.gift_active_icon_style, 10)) {
			case 1:
				t = "icon--conner-mark-b1";
				break;
			case 2:
				t = "icon--conner-mark-b2";
				break;
			case 3:
				t = "icon--conner-mark-b3";
				break;
			default:
				t = !1
			}
			return t
		},
		showNobleError: function() {
			var t = "开通贵族",
				s = T.nobleInfo;
			0 == s.noble_gift ? t = "升级贵族" : 0 == s.nl && s.npl > 0 && (t = "续费贵族");
			var i = ['<div class="noble--error">', '<a class="noble-error--close" href="javascript:;">×</a>', '<div class="nobel-error--main">', '<i class="nobel-error--icon"></i>', '<div class="error-main--content">', '<h3 class="content--title">', "您还不是贵族用户", "</h3>", "<p>", "贵族礼物-你的贵族专属特权", "</p>", '<a class="btn" href="javascript:;">', t, "</a>", "</div>", "</div>", "</div>"].join("");
			if (!this.nobleErrorPanel) {
				var n = this;
				this.nobleErrorPanel = e(i), this.doms.giftContent.find(".g-list").append(this.nobleErrorPanel), this.nobleErrorPanel.on("click", ".noble-error--close", function() {
					n.hideNobleError()
				}).on("click", ".btn", function() {
					n.hideNobleError(), a.trigger("mod.normal.noble.buy")
				})
			}
			this.nobleErrorPanel.fadeIn(), k.hideExpandGiftPanel()
		},
		hideNobleError: function() {
			this.nobleErrorPanel.fadeOut()
		},
		giftRecharge: function() {
			var t = e("body"),
				s = this;
			t.on("click", ".js-yc-open-iframe", function() {
				a.trigger("room.com.show.iframe.pay"), s.isNoYCFloatHide = !1, s.lowYCDialog && s.lowYCDialog.hide()
			})
		},
		autoSendOrder: function(t) {
			var a = T.lowYcConfig,
				s = a.getCodeUrl,
				i = e(".J_qrcode_content"),
				n = o.get("room.room_id"),
				r = {
					product_id: "DYTV_Product_Gold_1",
					number: t.rechargeCostGold,
					source: "dy_gift",
					room_id: n
				},
				d = "canvas";
			"Microsoft Internet Explorer" === navigator.appName && parseInt(navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/)[1], 10) < 9 && (d = "table"), e.ajax({
				url: s,
				type: "GET",
				dataType: "jsonp",
				data: r
			}).done(function(t) {
				0 === +t.error && t.data && t.data.code_url ? (i.html(""), i.qrcode({
					render: d,
					width: 110,
					height: 110,
					text: t.data.code_url
				})) : e.dialog.tips_black(t.msg)
			}).fail(function() {
				e.dialog.tips_black("网络错误")
			})
		}
	}), k = {
		giftTipsKey: "moreGiftTipsShowed",
		cacheList: [],
		$actions: e("#js-stats-and-actions"),
		$giftContent: e("#gift-content"),
		maxFoldLength: 45,
		actionExpandStatus: !1,
		actionOuterWidth: 70,
		actionLayout: function() {
			if (k.moreActionBtnWrap) {
				var t = k.$actions.find(".action-item");
				if (k.actionList.hide().append(t), k.moreActionBtnWrap.hide(), 0 !== t.length) {
					var s = 0,
						i = 0;
					k.$giftContent.is(":visible") ? (s = k.$giftContent.outerWidth(), i = parseInt(k.$giftContent.css("marginLeft"), 10) || 0) : s = e(".room-waring-close").outerWidth();
					var n = k.$actions.width(),
						r = e(".task-Getyw").width(),
						o = 0;
					"full" === a.fire("mod.video.state.get") && (o = e(".uinfo-ywyc").width() + 10);
					var d = n - s - i - r - o,
						c = e(".action-item[data-fold=0][data-hide!=1]"),
						l = e(".action-item[data-fold=1][data-hide!=1]"),
						g = l.length,
						u = c.length,
						m = Math.floor(d / k.actionOuterWidth);
					m >= u + g ? (l.show(), c.show(), k.actionList.show()) : m > u ? (k.moreActionBtnWrap.show(), k.resizeFoldCont(g), k.foldCont.append(l), l.show(), c.show(), k.actionList.show()) : (c.slice(m).hide(), k.foldCont.append(l), c.slice(0, m).show(), k.actionList.show()), k.collectActionDys(k.$actions.find(".action-list .action-item")), k.packActionGift()
				}
			}
		},
		resizeFoldCont: function(e) {
			var t = e > 9 ? 9 : e,
				a = t * k.actionOuterWidth;
			k.foldCont.width(a), k.foldPanel.width(a - 10)
		},
		render: function() {
			var t = ['<div class="action-list fl">', "</div>", '<div class="more-action-btn-wrap fl">', '   <div class="more-action-btn">', "   </div>", '   <div class="item-expand-panel expand-action-panel">', '       <div class="item-expand-cont clearfix">', "       </div>", '       <div class="expand-arrow">', '           <div class="expand-arrow-bg"></div>', '           <div class="expand-arrow-over"></div>', "       </div>", '       <div class="cover"></div>', "   </div>", "</div>"].join("");
			e(".task-Getyw").after(t), k.renderActionList()
		},
		renderActionList: function() {
			var t = ["<% for ( var i=0; i<list.length ;i++ ){%>", "<% var item = list[i];  %>", "<% if(item){ %>", "<% if (item.activity_link.length > 0){ %>", '<a href="<%= item.activity_link %>" target="_blank"', "<% }else{ %>", "<div", "<% } %>", ' class="action-item" data-fold="<%= item.fold %>" data-flag="<%=item.activity_flag%>" data-hide="<% if(item.activity_flag){ %>1<%} else {%>0<%}%>" data-id="<%=item.id%>">', "<% if( item.icon_default ) {%>", '<img class="action-img" src="<%= item.icon_default %>" width="60" height="40" data-default="<%= item.icon_default %>"  data-hover="<%= item.icon_hover || item.icon_default %>"/>', "<%}%>", "<% if (item.icon_hover_title.length > 0){%>", '<span class="tips"><%= item.icon_hover_title%></span>', "<%}%>", "<% if (item.activity_link.length > 0){ %>", "</a>", "<% }else{ %>", "</div>", "<% } %>", "<% } %>", "<% } %>"].join("");
			k.addActionList(o.get("room.giftActivity.unfold") || [], 0), k.addActionList(o.get("room.giftActivity.fold") || [], 1);
			var a = n.compile(t),
				s = a({
					list: k.cacheList
				});
			e("#js-stats-and-actions .action-list").html(s)
		},
		getDoms: function() {
			k.moreActionBtnWrap = e(".more-action-btn-wrap"), k.moreActionBtn = e(".more-action-btn"), k.foldCont = k.moreActionBtnWrap.find(".item-expand-cont"), k.foldPanel = k.moreActionBtnWrap.find(".expand-action-panel"), k.actionList = k.$actions.find(".action-list")
		},
		init: function() {
			this.render(), this.getDoms(), e("#container").on("click.actionExpand", function(t) {
				var a = e(t.target).closest(".gift-info-panel,.item-expand-panel,.more-gift-btn,.more-action-btn-wrap");
				0 === a.length && k.packActionGift()
			}), e("#room-task-trigger,.get-yw .get-box,.backpack-btn").on("click", k.packActionGift), k.moreActionBtn.on("click", function(e) {
				if (k.moreActionBtnWrap.hasClass("expand")) k.hideActionPanel(), a.trigger("dys", {
					key: "dys.room.normal.action.expand",
					stat: 2
				});
				else {
					var t = k.foldPanel.outerWidth(),
						s = k.moreActionBtn.offset(),
						i = k.$actions.offset(),
						n = s.left - i.left;
					n > t && (n = t - 70), k.foldPanel.css({
						left: -n
					}), k.foldPanel.find(".expand-arrow").css({
						left: n + 30
					}), k.moreActionBtnWrap.addClass("expand"), a.trigger("dys", {
						key: "dys.room.normal.action.expand",
						stat: 1
					}), k.actionExpandStatus !== !0 && (k.collectActionDys(k.moreActionBtnWrap.find(".action-item")), k.actionExpandStatus = !0)
				}
				return k.hideExpandGiftPanel(), !1
			}), e("#gift-content").on("click", ".more-gift-btn", function(e) {
				return k.toggleExpandGiftPanel(), a.trigger("dys", {
					key: "dys.room.gift.more.click"
				}), !1
			}).on("mouseenter", ".more-gift-btn", function() {
				var t = e(this);
				return t.hasClass("expand") ? t.attr("title", "点击收起礼物") : t.attr("title", "点击查看更多礼物"), !1
			}), e("#gift-content").on("click", ".expand-gift-panel-close", function() {
				return k.toggleExpandGiftPanel(), !1
			}), k.$actions.on({
				mouseenter: function() {
					var t = e(this),
						a = t.find(".tips"),
						s = a.outerWidth() / 2,
						i = t.offset().left;
					s = i + 30 > s ? s : 30 + i, a.css({
						left: -s
					}), t.stop().animate({
						top: -4
					}, 200);
					var n = t.find(".action-img");
					n.attr("src", n.data("hover"))
				},
				mouseleave: function() {
					var t = e(this);
					t.stop().animate({
						top: 0
					}, 200);
					var a = t.find(".action-img");
					a.attr("src", a.data("default"))
				},
				click: function() {
					a.trigger("dys", {
						key: "dys.room.normal.action.click",
						active_id: e(this).data("id"),
						is_fold: e(this).data("fold")
					})
				}
			}, ".action-item"), k.actionLayout()
		},
		collectActionDys: function(t) {
			t.each(function() {
				var t = e(this);
				"1" === t.data("dysshow") || t.is(":hidden") || (t.data("dysshow", "1"), a.trigger("dys", {
					key: "dys.room.normal.action.activity",
					active_id: t.data("id")
				}))
			})
		},
		packActionGift: function() {
			k.hideActionPanel(), k.hideExpandGiftPanel()
		},
		hideActionPanel: function() {
			k.moreActionBtnWrap.removeClass("expand")
		},
		hideExpandGiftPanel: function() {
			e(".giftInfoPanel").hide(), e(".more-gift-btn").removeClass("expand"), k.foldPanel.removeClass("expand")
		},
		toggleExpandGiftPanel: function() {
			e(".more-gift-btn").toggleClass("expand"), e('[data-type="gift-info-panel"]').hide(), e(".expand-gift-panel").toggleClass("expand"), k.hideActionPanel()
		},
		showExpandGiftPanel: function() {
			e(".more-gift-btn").addClass("expand"), e('[data-type="gift-info-panel"]').hide(), e(".expand-gift-panel").addClass("expand"), k.hideActionPanel()
		},
		addActionList: function(e, t) {
			for (var a = 0; a < e.length; a++) {
				var s = e[a];
				s.fold = t, k.cacheList.push(s)
			}
		},
		addAction: function(t) {
			var a = e(".action-item[data-flag=" + t.flag + "]");
			if (0 === a.length) e(t.dom).hide();
			else {
				var s = a.find(".tips");
				a.html(t.dom), t.tips && t.tips.length > 0 ? a.append('<span class="tips">' + t.tips + "</span>") : a.append(s), a.attr("data-hide", "0")
			}
			k.actionLayout()
		},
		hideAction: function(t) {
			e(".action-item[data-flag=" + t.flag + "]").hide().attr("data-hide", "1"), k.actionLayout()
		}
	}, C = {
		hoverPropStatus: !1,
		doms: {
			giftBox: e("#gift-content"),
			propBox: e(".backpack")
		},
		config: {
			hoverIndex: "",
			giftBattertimer: "",
			roundBatterTimer: "",
			cssTimer: "",
			giftBatterData: {},
			propConfigData: {}
		},
		init: function() {
			this.bindEvent()
		},
		getRestTime: function(e) {
			var t, a;
			return e = e ? parseInt(e, 10) : 0, t = new Date, t.setDate(t.getDate() + e), t.setHours(24), t.setMinutes(0), t.setSeconds(0), a = t.getTime() - (new Date).getTime()
		},
		formatTime: function(e) {
			return 0 == e ? "00" : 10 > e ? "0" + e : e
		},
		refrushPropPos: function(e) {
			var t = this.doms;
			t.$panel = t.propBox.find(".prop-info-panel");
			var a, s, i, n, r = (t.$panel.find(".gift-countdown"), t.$panel.find(".prop-info-panel-cont")),
				o = this.doms.propBox.find(".prop-page .prop").eq(this.config.hoverIndex),
				d = o.index();
			r && r.length && (clearTimeout(this.cssTimer), this.cssTimer = setTimeout(function() {
				a = t.$panel.outerWidth() < 280 ? 280 : t.$panel.outerWidth(), s = t.$panel.outerHeight(), i = (a - 280) / 2, n = s - 132, t.$panel.css({
					left: -47 - i + d % 5 * 68,
					top: -62 - n + 68 * Math.floor(d / 5)
				}).fadeIn("fast")
			}, 10))
		},
		hidePropInfoBatter: function() {
			this.doms.propBox.find(".gift-countdown").addClass("hide")
		},
		addGiftBatter: function(e) {
			var t = this.doms.giftBox.find('.gift-item[data-giftid="' + e + '"]'),
				a = this.doms.propBox.find('.prop-page .prop[data-giftid="' + e + '"]'),
				s = t.find(".gift-mask"),
				i = a.find(".gift-mask");
			T.currentGiftId == e, a && a.length && (this.doms.propBox.find(".gift-countdown").removeClass("hide"), this.refrushPropPos(e)), s && s.length ? s.fadeIn() : t.append('<em class="gift-mask"></em>'), i && i.length ? i.fadeIn() : a.prepend('<em class="gift-mask"></em>')
		},
		removeGiftBatter: function(e) {
			var t = this.doms.giftBox.find('.gift-item[data-giftid="' + e + '"]'),
				a = this.doms.propBox.find('.prop-page .prop[data-giftid="' + e + '"]'),
				s = this.doms.propBox.find(".prop-info-panel .gift-countdown");
			T.currentGiftId == e, s.data("gid") == e && (this.doms.propBox.find('.prop-info-panel .gift-countdown[data-gid="' + e + '"]').addClass("hide"), this.refrushPropPos(e)), t.find(".gift-mask").fadeOut(), a.find(".gift-mask").fadeOut()
		},
		showGiftBatterTime: function(e, t) {
			var a = this.doms.propBox.find(".prop-info-panel .gift-countdown").find("em"),
				s = parseInt(e / 1e3, 10),
				i = parseInt(s / 60, 10),
				n = s - 60 * i;
			i = this.formatTime(i), n = this.formatTime(n), a.text(i + ":" + n).parent().attr("data-gid", t)
		},
		giftBatterTimeRun: function(e, t) {
			var a = this,
				s = +new Date;
			0 >= e - s || (a.showGiftBatterTime(e - s, t), clearTimeout(this.config.giftBattertimer), this.config.giftBattertimer = setTimeout(function() {
				a.giftBatterTimeRun(e, t)
			}, 500))
		},
		searchGiftBatter: function(e) {
			var t, a = this,
				s = a.config.propConfigData || {},
				i = this.config.giftBatterData,
				n = +(new Date).getTime();
			return i ? i[e] ? (t = i[e].giftEndTime - n, 0 >= t ? (delete i[e], !1) : (this.addGiftBatter(e), (T.currentGiftId == e || s[e] || a.hoverPropStatus) && this.giftBatterTimeRun(i[e].giftEndTime, e), i[e].giftEndTime)) : !1 : void 0
		},
		roundStatusGiftBatter: function() {
			var e = this,
				t = this.config.giftBatterData,
				a = +(new Date).getTime(),
				s = !1;
			for (var i in t) t[i] && (s = !0, a = (new Date).getTime(), a >= t[i].giftEndTime && (this.removeGiftBatter(i), delete t[i]));
			s && (clearTimeout(this.config.roundBatterTimer), this.config.roundBatterTimer = setTimeout(function() {
				e.roundStatusGiftBatter()
			}, 1e3))
		},
		roundStatusPropBatter: function() {
			var e = this,
				t = this.config.giftBatterData,
				a = +(new Date).getTime();
			for (var s in t) t[s] && (a = (new Date).getTime(), a < t[s].giftEndTime && e.addGiftBatter(s))
		},
		updateGiftBatterData: function(e) {
			var t = this;
			e && (t.config.giftBatterData[e.giftId] = {
				giftId: e.giftId,
				giftBatterTime: e.giftBatterTime,
				giftEndTime: (new Date).getTime() + parseInt(e.giftBatterTime, 10)
			}, t.roundStatusGiftBatter(), t.searchGiftBatter(e.giftId))
		},
		getGiftBatterData: function(e) {
			for (var t, a = [], s = i.isArray(e.lst) ? i.decode(e.lst) : [{
				value: e.lst
			}], n = 0; n < s.length; n++) t = s[n], t && t.value && (t = i.decode(t.value).too(), a.push(t), this.updateGiftBatterData({
				giftId: t.gid,
				giftBatterTime: 1e3 * t.st
			}));
			return a
		},
		bindEvent: function() {
			var e = this;
			u.reg("room_data_handler", function(t) {
				var a = i.decode(t).too();
				"gst" == a.type && f.render().done(function() {
					g.getProp().done(function(t) {
						e.config.propConfigData = t || {}, e.getGiftBatterData(a)
					})
				})
			}), a.on("mod.gift.send.batter.update", function(t) {
				g.getProp().done(function(a) {
					e.config.propConfigData = a || {}, e.updateGiftBatterData(t)
				})
			}), a.on("mod.prop.hover.batter.search", function(t, a) {
				var s;
				e.config.hoverIndex = a, e.hoverPropStatus = !0, e.hoverPropStatus = !1, g.getProp().done(function(a) {
					e.config.propConfigData = a || {}, s = e.searchGiftBatter(t), s || e.hidePropInfoBatter()
				})
			}), a.on("mod.prop.open.batter.update", function(t) {
				e.roundStatusPropBatter()
			})
		}
	}, a.on("mod.normal.gift.expand", function() {
		k.actionLayout()
	}), a.on("mod.chat.action.view.add", function(e) {
		k.addAction(e)
	}), a.on("mod.chat.action.view.hide", function(e) {
		k.hideAction(e)
	}), a.on("mod.chat.expandGiftPanel.show", function(e) {
		k.showExpandGiftPanel()
	}), a.on("mod.chat.expandGiftPanel.hide", function(e) {
		k.hideExpandGiftPanel()
	}), a.on("mod.gift.batch.switch.open", function() {
		S && (T.batchSwitch = !0, S.doms.giftInfoPanel.find('[data-type="batch-send"]').removeClass("disabled").removeAttr("title"))
	}), a.on("mod.gift.yw.res", function(t) {
		var s = "full" === a.fire("mod.video.state.get") ? 2 : 1,
			n = null,
			r = function() {
				S && (t = i.decode(t).too(), n = T.giftConfigData[t.gfid], "dsgr" === t.type && (0 == t.r ? (a.trigger("dys", {
					key: "dys.room.giftSend.send.success",
					gfid: t.gfid,
					yw: n && n.pc || "",
					src_type: s
				}), S.fxPopGX({
					gid: t.gfid,
					num: t.ms / 100
				}), m.unlock(t.gfid), m.hasNext() ? m.next(t.gfid, function(e) {
					S.sendYW(e)
				}) : (m.clear(), a.trigger("mod.gift.batch.switch.open")), a.trigger("mod.userinfo.update.yw", t.sb)) : 283 == t.r ? S.remindYWLow() : (e.dialog.tips_black(T.ERR[t.r] || "未知错误：" + t.r, 1.5), m.clear(), a.trigger("mod.gift.batch.switch.open"))))
			};
		g.getGift().done(function(e) {
			T.giftConfigData = e, r()
		})
	}), a.on("mod.gift.exp.up", function(e) {
		var t = T.CGIFT[e.gid];
		if (t && t.exp) {
			var s = null;
			e && (s = e.silver), a.trigger("mod.userinfo.change", {
				change: {
					exp: t.exp * t.sdn,
					silver: s,
					type: "yuwan"
				}
			})
		}
	}), a.on("mod.gift.auto.send.set", function(e) {
		e || m.clear()
	}), a.on("mod.room.chat.gift.noble.info", function(e) {
		var t = T.nobleInfo;
		if (t.load = !0, t.nl = e.nl, e.nl > 0) {
			var a = $ROOM.nobleConfig[e.nl] || {};
			t.noble_gift = a.noble_gift, t.npl = e.npl
		}
	}), a.on("mod.gift.draw.batch.send", function(e) {
		g.getGift().done(function(t) {
			T.giftConfigData = t, S.giftSend(e)
		})
	}), a.on("mod.gift.spring.activity.send", function(e) {
		g.getGift().done(function(t) {
			T.giftConfigData = t, S.giftSend(e)
		})
	}), a.on("mod.gift.draw.fish.dialog", function() {
		S.remindYWLow()
	});
	var D = {
		init: function(e) {
			return S = new _(e), k.init(), C.init(), S
		},
		loadYwReturnSwitch: function() {
			return x.load()
		}
	};
	return D
}), define("douyu/page/room/normal/mod/backpack", ["jquery", "shark/observer", "shark/util/lang/1.0", "shark/util/template/1.0", "douyu/context", "douyu/page/room/normal/mod/gift", "douyu/com/user", "shark/util/flash/data/1.0", "douyu/page/room/base/api", "shark/util/cookie/1.0", "shark/util/storage/1.0", "douyu/com/get-gift-configs", "douyu/page/room/normal/mod/account-security"], function(e, t, a, s, i, n, r, o, d, c, l, g, u) {
	var m = {},
		p = function(e) {
			var t = e || 0,
				a = 1e4,
				s = 1e8,
				i = Math.pow(10, 2);
			return t >= s ? Math.floor(t / s * i) / i + "亿" : t >= a ? Math.floor(t / a * i) / i + "万" : t > 0 ? Math.floor(t * i) / i : t
		},
		f = {};
	t.on("room.activity.love520.props", function(e) {
		f = e
	});
	var h, v = {},
		y = {
			area: "#js-stats-and-actions"
		};
	return v.item = ['<li class="', '<% if ( prop.classType == "prop" ){%>', " prop", '<%} else if( prop.classType == "lock" ){%>', " lock", '<%} else if( prop.classType == "blank" ){%>', " blank", "<%}%>", "<% if(prop.is_click === 1 ){%>", " effect", "<%} else{%>", " disabled", '<%}%>" ', "<% if(prop.prop_type == 5){%>", " package", "<%}%>", ' data-proptype="<%= prop.prop_type %>"', ' data-propid="<%= prop.prop_id%>"', ' data-giftid="<%= prop.rel_id%>"', ' data-index="<%= prop.index%>"', ' data-offensive="<%= prop.attack%>"', " >", '   <img src="<%= prop.icon %> ">', '   <span class="prop-count"><%= prop.count %></span>', '   <div class="prop-cover">', '       <div class="bg"></div>', '       <div class="text">点击</div>', '       <div class="text"><% if(prop.prop_type == 5){ %>领取<% }else{ %>使用<% } %></div>', "   </div>", "</li>"].join(""), v.all = ['<div class="btn close" ><span class="icon"></span></div>', '<div class="title">', '    <span class="name">我的背包</span>', '    <span class="space">剩余空间数：<span  data-query="space-num"><%= blankSpace %></span>', "    </span>", "</div>", '<div class="prop-wrap">', '    <div class="prop-cont clearfix">', "        <% for(var m = 0; m<pages.length ; m++) { %>", "        <% var props = pages[m] %>", '        <ul class="prop-page">', "           <% for (var j=0 ;j< props.length ; j++ ) {%>", "               <% var prop = props[j] %>", v.item, "           <% } %>", "        </ul>", "        <% } %>", "    </div>", '<div class="pagination">', "       <% for (var i=0; i<pages.length ; i++ ){ %>", '           <a href="javascript:;" class="btn dot <%= (i == pageIndex ? "current" : "" ) %>" >', '           <span    class="icon"></span></a>', "       <% }%>", "</div>", "</div>", '<div class="clearfix">', "<% if(unlock_num <= 10){%>", '<div class="tips"><span class="yellow">达到10级</span>将开放更多背包空间</div>', "<%}%>", '   <a class="get-tips" target="_blank" href="/cms/gong/201609/26/4203.shtml">如何获得更多道具？</a></div>', '<div class="btn prev"><span class="icon"></span></div>', '<div class="btn next"><span class="icon"></span></div>', '<div class="arrow"></div>', '<div class="arrow2"></div>', '<div class="gift-cover"></div>', '<div class="backpack-tips disabled-tips"></div>', '<div class="prop-info-panel" ></div>'].join(""), v.propInfo = ['<div class="prop-info-panel-cont clearfix" >', '   <div class="prop-not-batch">', '       <div class="prop-info-panel-brief">', '           <div class="prop-info-panel-img">', '              <img src="<%= prop.gif %>">', '              <div class="prop-count"><%= prop.count %></div>', "           </div>", '           <h4 class="name"><%= prop.name %>', "           <% if (isShowYwReturn) { %>", "           <em>(可返<%= prop.rel_giftdata.ry %>鱼丸)</em>", "           <% } %>", "           </h4>", "           <% if(prop.prop_type != 16) { %>", '           <p class="exp">', "               <% if(devote >0){%>", '                   <b>贡献+<span title="<%= devote %>"><%= devote4Short %></span> </b>', "               <% } %>", "               <% if(exp >0){%>", '                   <b>经验+<span title="<%= exp %>"><%= exp4Short %></span> </b>', "               <% } %>", "               <% if(intimate >0 ){%>", '                   <b>亲密度+<span title="<%= intimate %>"><%= intimate4Short %></span> </b>', "               <% } %>", "           </p>", "           <% } %>", '           <p class="desc gift-info-intro"><%= prop.description %></p>', '           <p class="intro" title="<%= prop.intro %>"><%= prop.intro %></p>', '           <p class="expiry">', "               <% if(prop.met == -1) { %>", "                   永久有效", "               <% } else if (prop.met > 0) { %>", "                   过期时间：<%= getExpireDate(prop.met * 1000) %>", "               <% } %>", "           </p>", "           <% if(prop.prop_type == 16) { %>", '               <div class="RocketDraw-superGift-merge" data-propid="<%= prop.prop_id %>" data-giftid="<%= prop.rel_id %>">合成</div>', "           <% } %>", "       </div>", '       <span class="gift-countdown" style="display:block;"><em>--:--</em>内可连击</span>', "    </div>", "</div>", '<i class="prop-info-panel-fill"></i>', '<i class="prop-info-panel-arrow1"></i>', '<i class="prop-info-panel-arrow2"></i>'].join(""), h = {
		props: [],
		pageIndex: 0,
		pageSize: 0,
		maxSpace: 25,
		blankSpace: 0,
		pageLenth: 10,
		timer: 0,
		cssTimer: 0,
		delay: 200,
		duration: 500,
		listWidth: 380,
		doms: {},
		sending: !1,
		lockText: "",
		init: function() {
			var t;
			h.doms = {}, t = h.doms, t.$area = e(y.area), t.$wrap = t.$area.find(".backpack"), h.bindEvent(), g.loadYwReturnSwitch().then(function(e) {
				var t = e || {};
				1 === t.show_switch && (m.ywReturnSwitch = 1)
			})
		},
		getData: function(a) {
			e.ajax({
				type: "post",
				url: "/member/prop/query",
				dataType: "json",
				data: {
					rid: $ROOM.room_id
				},
				success: function(s) {
					0 === s.result ? (t.trigger("backpack.props.check.vote", s.data), a(s.data)) : e.dialog.tips_black(s.msg)
				}
			})
		},
		processData: function(e) {
			var t, a, s, i = [],
				n = [],
				r = 0,
				o = 0;
			for (s = e, h.props = [], h.maxSpace = e.total_num, h.blankSpace = e.unlock_num - e.list.length, t = h.blankSpace || 0; r < h.maxSpace; r++, o++) o % h.pageLenth === 0 && (n = [], i.push(n)), a = e.list[r], a ? a.classType = "prop" : (t > 0 ? (t--, a = {
				classType: "blank"
			}) : a = {
				classType: "lock",
				disabled: !0
			}, s.list[r] = a), a.index = r, h.props.push(a), n.push(a);
			return s.pageIndex = h.pageIndex, s.pages = i, h.pageSize = i.length, s.blankSpace = h.blankSpace, s
		},
		render: function(e, t) {
			var a, i = 0,
				n = s.compile(v.all);
			g.load().done(function(s) {
				var r, o = e.list;
				if (s && o) {
					for (r = o.length; r > i; i++) {
						var d, c, l = o[i];
						d = l.rel_id, d && (c = s[d], c && (l.effect = c.effect, l.rel_giftdata = c))
					}
					a = n(e), h.doms.$wrap.html(a), t && t()
				}
			})
		},
		reload: function(e) {
			h.processData(e), h.render(e, function() {
				h.getDoms(), h.changePage(0)
			})
		},
		getDoms: function() {
			var e = h.doms,
				t = h.doms.$wrap;
			e.$panel = t.find(".prop-info-panel"), e.$dots = t.find(".dot"), e.$propCont = t.find(".prop-cont"), e.$propCont.css({
				width: h.pageSize * h.listWidth
			}), e.$tips = t.find(".disabled-tips"), e.$next = t.find(".next"), e.$prev = t.find(".prev")
		},
		bindEvent: function() {
			var a = h.doms;
			a.$wrap.on("mouseenter", ".prop", function(s) {
				var i, n, r, o, d = e(this).data("index"),
					c = h.props[d],
					l = e(this).data("giftid"),
					g = e(this).index();
				clearTimeout(h.timer), clearTimeout(h.cssTimer), h.updatePanel(c), h.cssTimer = setTimeout(function() {
					i = a.$panel.outerWidth() < 280 ? 280 : a.$panel.outerWidth(), n = a.$panel.outerHeight(), r = (i - 280) / 2, o = n - 132, a.$panel.css({
						left: -47 - r + g % 5 * 68,
						top: -62 - o + 68 * Math.floor(g / 5)
					}).fadeIn("fast")
				}, 10), t.trigger("mod.prop.hover.batter.search", l, d)
			}).on("mouseleave", ".prop", function(e) {
				clearTimeout(h.timer), h.timer = setTimeout(function() {
					a.$panel.fadeOut("fast")
				}, h.delay)
			}).on("click", ".effect", h.useProp).on("mouseenter", ".prop-info-panel", function() {
				clearTimeout(h.timer)
			}).on("mouseleave", ".prop-info-panel", function() {
				e(this).fadeOut("fast")
			}).on("click", ".next", h.next).on("click", ".prev", h.prev).on("click", ".dot", function() {
				h.changePage(e(this).index())
			}).on("click", ".close", h.close).on("click", ".prop.disabled", h.disabledTips).on("click", ".RocketDraw-superGift-merge", function() {
				var t = e(this),
					a = t.attr("data-propid"),
					s = t.attr("data-giftid"),
					i = e('.backpack .prop-page .prop[data-propid="' + a + '"][data-giftid="' + s + '"]');
				return i && i.length && i.eq(0).trigger("click"), !1
			}), h.doms.$area.find(".backpack-btn").on("click", h.show), e("#container").on("click.backpack", function() {
				a.$wrap.is(":visible") && h.close()
			}), a.$wrap.on("click", function(e) {
				e.stopPropagation()
			}).on("click", ".backpack-prompt-btn", function() {
				e(".backpack-prompt-box").remove()
			}), t.on("mod.room.user.fansMedal.setcurrroom", function(e) {
				h.badge_id = e && e.bdg_id
			}), t.on("mod.crazyfansday.state.change", function(e) {
				3 == e ? h.isFansInjulyActive = 1 : h.isFansInjulyActive = 0
			}), t.on("mod.roompoint.low", function(e) {
				e === !0 ? h.lockText = "因主播积分过低，暂时无法使用！" : h.lockText = ""
			}), t.on("mod.center.onekey.closure", function(e) {
				56 != e.code && 57 != e.code || (h.lockText = "你已被封号不能使用道具！")
			}), t.on("mod.backpack.noble.info", function(e) {
				if ("memberinfores" === e.type) {
					var t = {
						nl: parseInt(e.nl, 10) || 0,
						npl: parseInt(e.npl, 10) || 0,
						nets: e.nets || 0,
						trial: parseInt(e["try"], 10) || 0
					};
					m.nobleInfo = t, m.nobleConfig = $ROOM.nobleConfig
				}
			}), d.reg("room_data_handler", function(e) {
				var a = o.decode(e).too();
				"gpbc" === a.type ? t.trigger("mod.chat.msg.peckprop", e) : "cdcp" === a.type || "npwarn" === a.type && a.nc > 0 && h.showNewPropTips()
			})
		},
		searchById: function(e) {
			for (var t = h.props, a = t.length, s = 0; a > s; s++) if (e === t[s].prop_id) return s;
			return -1
		},
		getPropById: function(e) {
			var t = h.searchById(e);
			return -1 !== t ? h.props[t] : null
		},
		removePropById: function(e) {
			var t = h.searchById(e);
			return -1 !== t ? h.props.splice(t, 1) : null
		},
		updatePanel: function(e) {
			var t = h.getPropPanelHTML(e);
			h.doms.$panel.html(t)
		},
		getExpireDate: function(e) {
			var t, a;
			return e > 0 ? (t = new Date(e), a = {
				Y: t.getFullYear(),
				M: t.getMonth() + 1,
				d: t.getDate(),
				h: t.getHours() > 9 ? t.getHours() : "0" + t.getHours(),
				m: t.getMinutes() > 9 ? t.getMinutes() : "0" + t.getMinutes(),
				s: t.getSeconds() > 9 ? t.getSeconds() : "0" + t.getSeconds()
			}, a.Y + "年" + a.M + "月" + a.d + "日 " + a.h + ":" + a.m + ":" + a.s) : ""
		},
		getPropPanelHTML: function(e) {
			var t = s.compile(v.propInfo),
				a = e.rel_giftdata || {};
			e.isDoubleIntimacy = l.get("doubleIntimacy");
			var i = t({
				prop: e,
				getExpireDate: this.getExpireDate,
				devote: e.devote,
				exp: e.exp,
				intimate: e.intimate,
				devote4Short: p(e.devote),
				exp4Short: p(e.exp),
				intimate4Short: p(e.intimate),
				isShowYwReturn: m.ywReturnSwitch && (3 === +e.prop_type || 4 === +e.prop_type) && a.ry > 0
			});
			return i
		},
		disabledTips: function() {
			var t = e(this).data("index"),
				a = h.props[t],
				s = 0,
				i = a.description;
			a.click_hint && (i = a.click_hint), h.doms.$tips.text(i), s = -h.doms.$tips.outerHeight(), h.doms.$tips.stop(!0).css({
				display: "block",
				marginTop: s / 2
			}).delay(1e3).fadeOut(function() {
				e(this).hide()
			})
		},
		updateProp: function(e) {
			var t = h.doms.$wrap.find("[data-index=" + e.index + "]");
			t.find(".prop-count").text(e.count)
		},
		prev: function() {
			h.changePage("prev")
		},
		next: function() {
			h.changePage("next")
		},
		changePage: function(e) {
			var t = h.pageIndex,
				a = h.doms;
			if ("prev" === e) {
				if (0 > t - 1) return;
				t--
			} else if ("next" === e) {
				if (t + 1 >= h.pageSize) return;
				t++
			} else t = e;
			a.$wrap.find(".prop-page").hide(), a.$prev.show(), a.$next.show(), 0 === t && a.$prev.hide(), t >= h.pageSize - 1 && a.$next.hide(), h.pageIndex = t, a.$wrap.find(".prop-page").eq(t).fadeIn(), a.$dots.removeClass("current").eq(t).addClass("current")
		},
		useProp: function(t) {
			if (!h.sending) {
				var a = e(this),
					s = a.data("index"),
					n = h.props[s],
					r = a.data("giftid");
				a.data("offensive");
				if (5 === n.prop_type || !h.showLockTips()) {
					if (14 == n.prop_type) {
						var o = '<div class="path-to-changeName-lineOne">请在个人中心修改昵称时使用</div><div class="path-to-changeName-lineTwo">使用改名卡修改昵称不会扣除鱼翅</div>';
						return void e.dy_dialog(o, {
							className: "path-to-changeName",
							mask: !0,
							zIndex: 502,
							title: "提示",
							buttons: [{
								content: "去修改昵称",
								callback: function() {
									window.open("/member/profile/changeName"), this.hide(), e(".backpack").hide()
								}
							}]
						})
					}
					var d = 1,
						c = [5, 7, 8, 9, 10, 11];
					return n.prop_type = parseInt(n.prop_type, 10), -1 === e.inArray(n.prop_type, c) && i.get("sys.uid") == i.get("room.owner_uid") ? void e.dialog.tips_black("主播不能给自己赠送道具") : 0 === n.count ? void e.dialog.tips_black("道具已使用完") : (h.sendingData = {
						propGiftId: r,
						prop: n,
						num: d,
						index: s
					}, n.count > 0 ? h.sendProp() : e.dialog.tips_black("您还没有该道具！"), !1)
				}
			}
		},
		sendProp: function() {
			for (var a = h.sendingData, s = a.propGiftId, n = a.prop, r = a.num, o = a.index, d = {
				dy: i.get("room.device_id"),
				prop_id: n.prop_id,
				num: r,
				sid: window.$SYS.uid,
				did: window.$ROOM.owner_uid,
				rid: window.$ROOM.room_id
			}, c = {
				prop: n,
				propGiftId: s,
				index: o,
				num: r,
				postData: d
			}, l = 0; l < f.length; l++) if (+f[l].id === +n.prop_id) return t.trigger("room.activity.love520.tips", {
				id: n.prop_id,
				name: n.name
			}), void this.close();
			if (n && m.nobleInfo && 13 === n.prop_type && n.level) {
				var g = m.nobleInfo.nl,
					u = m.nobleInfo.npl,
					p = m.nobleInfo.nets,
					v = m.nobleInfo.trial,
					y = m.nobleConfig,
					b = "",
					k = n.level_time / 3600 / 24,
					_ = ['<em class="noble-rule-em">使用细则 <span class="noble-rule-icon"></span></em>', '<p style="text-align: center;">提示</p>', '<div class="noble-rule-info">', '<span class="noble-rule-arrow"></span>', '<span class="noble-rule-arrow2"></span>', "<p>1、使用贵族体验卡后可享受对应等级的特权，无贵族鱼翅返还；</p>", "<p>2、贵族用户在贵族特权期间及贵族续费保护期时无法使用贵族体验卡；</p>", "<p>3、普通用户使用贵族体验卡后，不能通过续费价格开通贵族；</p>", "<p>4、普通用户使用贵族体验卡期间，可以开通任意等级的贵族；</p>", "<p>5、普通用户使用一张贵族体验卡期间，可以继续使用其他贵族体验卡；</p>", '<p class="txt-ind">5-1：使用同等级的贵族体验卡时，贵族体验期延长；</p>', '<p class="txt-ind">5-2：使用不同等级的贵族体验卡时，当前贵族体验特权立即消失，</p>', '<p class="txt-ind">生效新的贵族体验特权；</p>', "<p>6、体验卡的特权过期时间指北京时间过期日期当天凌晨4点整；</p>", "<p>7、以上规则斗鱼拥有最终解释权；</p>", "</div>"].join("");
				if (g && 1 != v) return void e.dy_dialog('<div class="noble-rule-content">您已经是贵族啦，无法使用体验卡~</div>', {
					mask: !0,
					title: _,
					buttons: [{
						content: "好的",
						callback: function() {
							DYS.sub({
								action_code: "click_bag_nobexp_remd",
								ext: {
									type: 1
								}
							}), this.hide()
						}
					}]
				});
				if (!g && u && 1 != v) return void e.dy_dialog('<div class="noble-rule-content">您正处于贵族续费保护期，无法使用体验卡~</div>', {
					mask: !0,
					title: _,
					buttons: [{
						content: "好的",
						callback: function() {
							DYS.sub({
								action_code: "click_bag_nobexp_remd",
								ext: {
									type: 0
								}
							}), this.hide()
						}
					}]
				});
				if (g && 1 == v) {
					y && y[n.level] && (b = y[n.level].noble_name);
					var w = y[g].noble_name,
						T = Math.ceil((p - (new Date).getTime() / 1e3) / 3600 / 24);
					0 > T && (T = 0);
					var S = parseInt(k) + T,
						C = '<div class="noble-rule-content"><span>是否立即体验<em class="dy-special">' + k + '</em>天的<em class="dy-special">' + b + '贵族</em>？</span><span class="living-backpack-txt">您当前的' + w + '体验贵族<em class="dy-special">（剩' + T + "天）</em>",
						x = 0;
					return n.level == g ? (C = C + '将延长至<em class="dy-special">' + S + "</em>天", x = 1) : (C += "将自动消失", x = 0), C += "</span></div>", void e.dy_dialog(C, {
						mask: !0,
						title: _,
						buttons: [{
							content: "立即体验",
							callback: function() {
								this.hide(), DYS.sub({
									action_code: "click_bag_nobexp_sel_toexp",
									ext: {
										type: 1,
										stat: x
									}
								}), h.sendPropAjax(c)
							}
						}, {
							content: "取消",
							callback: function() {
								DYS.sub({
									action_code: "click_bag_nobexp_sel_canc",
									ext: {
										type: 1,
										stat: x
									}
								}), this.hide()
							}
						}]
					})
				}
				if (!g && !u && 1 != v) return y && y[n.level] && (b = y[n.level].noble_name), void e.dy_dialog('<div class="noble-rule-content">是否立即体验<em class="dy-special">' + k + '</em>天的<em class="dy-special">' + b + "贵族</em>？</div>", {
					mask: !0,
					title: _,
					buttons: [{
						content: "立即体验",
						callback: function() {
							this.hide(), DYS.sub({
								action_code: "click_bag_nobexp_sel_toexp",
								ext: {
									type: 0,
									stat: 0
								}
							}), h.sendPropAjax(c)
						}
					}, {
						content: "取消",
						callback: function() {
							DYS.sub({
								action_code: "click_bag_nobexp_sel_canc",
								ext: {
									type: 0,
									stat: 0
								}
							}), this.hide()
						}
					}]
				})
			}
			h.sendPropAjax(c)
		},
		sendPropAjax: function(a) {
			var s = a.prop,
				i = a.propGiftId,
				n = a.index,
				r = a.num,
				o = a.postData;
			h.sending = !0, e.ajax({
				type: "post",
				url: "/member/prop/send",
				dataType: "json",
				data: o,
				success: function(a) {
					if (0 === a.result) {
						if (5 === s.prop_type) return h.reload(a.data), void h.rendertip(a);
						s.count -= r, h.fxPopExp(s, a), 0 === s.count || 16 == s.prop_type ? h.reload(a.data) : (h.updatePanel(s), h.updateProp(s)), t.trigger("room.rotaryDraw.listen.mergeProp", a.data), t.trigger("room.giftprop.send.success.backland", i), t.trigger("mod.prop.hover.batter.search", i, n), t.trigger("room.giftprop.send.success.valentine2018", i), t.trigger("room.giftprop.send.success.starmagic", i)
					} else 170001 === a.result ? u.init({
						dys_type: 2
					}) : e.dialog.tips_black(a.msg)
				},
				error: function() {
					e.dialog.tips_black("网络错误！")
				},
				complete: function() {
					h.sending = !1
				}
			})
		},
		rendertip: function(t) {
			for (var a = "", s = t.data.used_prop, i = s.child_prop_list, n = 0; n < i.length; n++) a += 0 === n ? "<li>获得了：" + i[n].prop_name + " × " + i[n].prop_count + "</li>" : "<li>" + i[n].prop_name + " × " + i[n].prop_count + "</li>";
			var r = h.doms.$wrap,
				o = e(".backpack-prompt");
			o.length && o.remove(), r.append('<div class="backpack-prompt-box"><span class="backpack-prompt-placeholder"></span><div class="backpack-prompt"><img class="backpack-favicon" src="' + $SYS.web_url + 'app/douyu/res/page/room-normal/backpack/favicon.png" alt=""><ul class="backpack-info"><li class="prompt-title">您打开了' + s.prop_name + "</li>" + a + '</ul><a class="backpack-prompt-btn" href="javascript:void(0)">确定</a></div></div>')
		},
		close: function() {
			h.doms.$wrap.hide(), t.trigger("dys", {
				key: "dys.room.backpack.hide"
			})
		},
		show: function() {
			var a, s = l.get("fansGiftPush_" + i.get("sys.uid"));
			return r.check() ? (h.doms.$wrap.is(":visible") ? h.close() : (h.getData(function(i) {
				if (s && (a = i.list, a && a.length)) for (var n = 0; n < a.length; n++) if (s.gpid == a[n].prop_id) return s.gname = a[n].name, s.gicon = a[n].icon, void t.trigger("fans.gift.backpack.show", s);
				e("#js-stats-and-actions").find(".fans-barrage-gift").remove(), h.openTime = new Date, h.pageIndex = 0, h.reload(i), h.doms.$wrap.fadeIn(), t.trigger("mod.prop.open.batter.update"), t.trigger("dys", {
					key: "dys.room.backpack.show"
				})
			}), h.hideNewPropTips()), !1) : void r.show()
		},
		unlock: function(e) {
			var t = 0,
				a = "";
			for (h.blankSpace += e, a = h.doms.$wrap.find(".lock"); e > t; t++) a.eq(t).removeClass("lock").addClass("blank")
		},
		addProp: function(t) {
			var a, i, n, r = t;
			return r.classType = "prop", h.props.push(r), n = h.doms.$wrap.find(".blank"), 0 === n.length ? void e.dialog.tips_black("没有更多空间！", 1.5) : (i = s.compile(v.item), a = i({
				prop: r
			}), void n.eq(0).after(a).remove())
		},
		fxPopExp: function(a, s) {
			var i, n, r = h.doms.$wrap.find("li[data-index=" + a.index + "]"),
				o = r.offset(),
				d = "",
				c = s.data.used_prop,
				l = c.prop_type,
				g = !1;
			switch (parseInt(l, 10)) {
			case 2:
			case 3:
			case 4:
				g = s.data && s.data.ry > 0 && (3 === +a.prop_type || 4 === +a.prop_type), d = "赠送成功";
				break;
			case 7:
				d = "鱼翅 +" + c.include_yuchi;
				break;
			case 8:
				d = "鱼翅 +" + c.include_yuchi;
				break;
			case 9:
				d = "鱼丸 +" + c.include_yuwan;
				break;
			case 10:
				d = "鱼丸 +" + c.include_yuwan;
				break;
			case 11:
				d = "获得了【" + c.prop_name + "】！";
				break;
			case 13:
				return e.dialog.tips_black("使用成功"), void setTimeout(function() {
					window.location.reload(!0)
				}, 2e3);
			default:
				if (0 == a.exp) return;
				d = "赠送成功"
			}
			var u, m, p, f = {};
			s.data.yuchi && (f.gold = s.data.yuchi), g ? (f.silver = (parseInt(e("#js-stats-and-actions").find('[data-login-user="silver"]').text(), 10) || 0) + (parseInt(s.data.ry, 10) || 0), i = e('<span class="gift-success-tip-num">+' + (s.data.ry || 0) + "鱼丸</span>"), e("body").append(i), n = o.top - i.height(), u = o.left + (r.width() - i.width()) / 2, m = "-=10px", p = 500) : (s.data.yuwan && (f.silver = s.data.yuwan), i = e('<span class="gift-success-tip">' + d + "</span>"), e("body").append(i), n = o.top + r.height() - i.height(), u = o.left - i.outerWidth(!0), m = "-=50px", p = "slow"), t.trigger("mod.userinfo.change", {
				current: f
			}), i.show(), i.css({
				top: n,
				left: u
			}).animate({
				top: m
			}, p).fadeOut("slow", function() {
				e(this).remove()
			})
		},
		getCSRFCookie: function(t) {
			var a = c.get(i.get("sys.tvk")),
				s = i.get("sys.tn"),
				n = e.isFunction(t) ? t : function() {};
			return a ? void n({
				name: s,
				val: a
			}) : void e.ajax({
				url: "/curl/csrfApi/getCsrfCookie",
				type: "GET",
				dataType: "json",
				success: function(e) {
					0 === e.error && h.getCSRFCookie(n)
				}
			})
		},
		showLockTips: function() {
			return "" !== h.lockText ? (e.dialog.tips_black(h.lockText, 3), !0) : !1
		},
		showNewPropTips: function() {
			e(".backpack-btn").append('<i class="icon prop-new"></i>')
		},
		hideNewPropTips: function() {
			e(".backpack-btn .prop-new").remove()
		}
	}
}), define("douyu/page/room/normal/mod/game-tmp2", ["jquery", "shark/util/lang/1.0", "shark/util/template/2.0"], function(e, t, a) {
	var s = {
		enterRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-entry" data-tag="game-enter-btn">', '<div class="third-games-guide" style="display: none;" data-tag="game-enter-tip">', '<i class="third-games-guide-close"></i>', '<div class="third-games-guide-content">', "<h2>直播新花样！</h2>", "<p>水友互动新玩法！互动游戏走一走，粉丝、收益全部有！</p>", '<span class="third-games-guide-join">前往开启></span>', "</div>", '<i class="third-games-trans trans"></i>', '<i class="third-games-trans trans-bg"></i>', "</div>"), s = a.compile(e)
		},
		gameEnterMsgRender: function() {
			var e, s;
			return e = t.string.join("{{ if data.curRoom }}", '<a href="javascript:;" class="third-games-tip clearfix cur-room" data-cid="{{ data.pubData.cateId }}" data-gid="{{ data.gameInfoData.gameid }}" data-rid="{{ data.pubData.roomId }}" data-tag="game-enter-msg">', "{{ /if }}", "<!-- b. 直播间未发起游戏，但当前有其他主播发起游戏 (加上hot图标)-->", "{{ if !data.curRoom }}", '<a target="_blank" href="/{{ data.pubData.roomId }}" class="third-games-tip clearfix" data-cid="{{ data.pubData.cateId }}" data-gid="{{ data.gameInfoData.gameid }}" data-rid="{{ data.pubData.roomId }}" data-tag="game-enter-msg">', '<i class="third-games-tip-hot"></i>', "{{ /if }}", "<!-- b. 直播间未发起游戏，但当前有其他主播发起游戏 end -->", '<i class="third-games-tip-close"></i>', '<img class="third-games-tip-img" src="{{ data.gameInfoData.icon }}" alt="游戏图标">', '<div class="third-games-tip-content">', '<h2 title="{{ data.anchorInfo.name }}发起了{{ data.gameInfoData.name }}"><em>{{ data.anchorInfo.name }}</em>发起了{{ data.gameInfoData.name }}</h2>', "<p>{{ data.pubData.game_desc.remark }}</p>", "</div>", '<span class="third-games-tip-join">点击加入></span>', '<i class="third-games-trans trans"></i>', '<i class="third-games-trans trans-bg"></i>', "</a>"), s = a.compile(e)
		},
		gameFrameRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-container" style="display: none;" data-tag="interact-game-wrap">', '<div class="third-games-header">', "<!-- 返回/选择游戏 -->", '<a href="javascript:;" class="third-games-leftop third-games-back" data-tag="game-back-btn" style="display: none;">', '<i class="third-games-back-icon"></i>', "<span>返回/选择游戏</span>", "</a>", "<!-- 返回/选择游戏 end -->", "<!-- 游戏记录 -->", '<a href="javascript:;" class="third-games-leftop" data-tag="game-record-btn" style="display: none;">', '<i class="third-games-record-icon"></i>', "<span>游戏记录</span>", "</a>", "<!-- 游戏记录 end -->", "<!-- 游戏进行中 -->", '<a class="third-games-leftop" data-tag="game-status-header" style="display: none;">', '<span class="text-bold" data-tag="gameing-stauts" style="display: none;">等待开始游戏</span>', '<span class="third-games-countdown" data-tag="game-wait-status">', '<em data-tag="game-wait-time">--:--</em>', '<span data-tag="header-status-text"> 未开始游戏将自动取消</span>', "</span>", "</a>", "<!-- 游戏进行中 end -->", '<span class="third-games-title" data-tag="game-page-title">互动游戏</span>', '<a href="javascript:;" data-tag="game-view-close" class="third-games-close"></a>', "<!-- 头部右侧 -->", '<div class="third-games-rightops" data-tag="game-right-btn" style="display: none;">', '<a href="javascript:;" class="third-games-bg-btn" style="display: none;" data-tag="game-cancel-btn">取消游戏</a>', "<!-- 收起按钮 -->", '<a href="javascript:;" class="third-games-bg-btn third-games-packup" style="display: none;" data-tag="game-view-close"><i></i>收起</a>', "<!-- 收起按钮 end -->", "</div>", "<!-- 头部右侧 end -->", "</div>", '<div class="third-games-body" data-tag="game-content-warp">', "</div>", "</div>"), s = a.compile(e)
		},
		gameListRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-content">', "{{ if !userIdentity }}", '<div class="third-games-selectgame">', "{{ /if }}", "{{ if userIdentity }}", '<div class="third-games-selectgame third-games-selectgame-user">', "{{ /if }}", "{{ if userIdentity }}", '<div class="third-games-nogame">', "<i></i>", "<span>", "{{ if gamePlayed }}", '<p class="third-games-nogame-title">好遗憾！您与主播暂时错过~</p>', "{{ /if }}", "{{ if !gamePlayed }}", '<p class="third-games-nogame-title">主播暂未发布游戏</p>', "{{ /if }}", "<p>点击下方游戏，可向主播传达游戏请求哦~</p>", "</span>", "</div>", "{{ /if }}", "{{ each gameListData as item index }}", "{{ if userIdentity }}", "{{ if !sendStatusList[item.gameid] }}", '<dl data-gid="{{ item.gameid }}" data-tag="game-list-item">', "{{ /if }}", "{{ if sendStatusList[item.gameid] }}", '<dl data-gid="{{ item.gameid }}" data-tag="game-list-item" class="has-sent">', "{{ /if }}", "{{ /if }}", "{{ if !userIdentity }}", '<dl data-gid="{{ item.gameid }}" data-tag="game-list-item">', "{{ /if }}", "<dt>{{ item.name }}</dt>", '<dd data-gid="{{ item.gameid }}">', '<img src="{{ item.icon }}" alt="游戏图标">', "<p>{{ item.desc }}</p>", "{{ if !userIdentity }}", '<i class="third-games-item-icon"></i>', "{{ /if }}", "{{ if userIdentity }}", "{{ if !sendStatusList[item.gameid] }}", '<a href="javascript:;" data-gid="{{ item.gameid }}" data-tag="send-game-req" class="third-games-item-btn"><i>我要玩</i></a>', "{{ /if }}", "{{ if sendStatusList[item.gameid] }}", '<a href="javascript:;" data-gid="{{ item.gameid }}" data-tag="send-game-req" class="third-games-item-btn"><i>已发送给主播</i></a>', "{{ /if }}", "{{ /if }}", "</dd>", "</dl>", "{{ /each }}", "</div>", "</div>"), s = a.compile(e)
		},
		gameSettingRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-content">', '<div class="third-games-setting">', '<div class="third-games-setting-left">', '<dl class="third-games-price">', "<dt>参与价格</dt>", "<dd>", '<div class="third-games-select-price">', "{{ each priceList as item index }}", "{{ if item.price == gameSetData.setPrice }}", '<a href="javascript:;" data-id="{{item.price}}" data-num="{{item.num}}" data-type="{{item.type}}" data-tag="set-game-price" class="third-games-select-btn active">{{item.show}}</a>', "{{ /if }}", "{{ if item.price != gameSetData.setPrice }}", '<a href="javascript:;" data-id="{{item.price}}" data-num="{{item.num}}" data-type="{{item.type}}" data-tag="set-game-price" class="third-games-select-btn">{{item.show}}</a>', "{{ /if }}", "{{ /each }}", "</div>", "<!-- is-expand 控制列表展开收起 -->", "{{ if data.awards[gameSetData.setPrice].length > 0 }}", '<div class="third-games-reward-wrapper">', '<div class="third-games-reward is-expand" data-tag="game-price-award">', '<ul class="clearfix">', "{{ each data.awards[gameSetData.setPrice] as item index }}", '<li class="clearfix">', "<h4><em>第{{ awardRank[index] }}名</em>奖励</h4>", "{{ each item as itemChild indexChild }}", '<div class="third-games-reward-item">', '<img src="{{ itemChild.icon }}" alt="奖励图片">', '<span class="third-games-reward-detail">', '<span title="{{ itemChild.name }}">{{ itemChild.name }}</span> <em>x{{ itemChild.cnt }}</em>', "</span>", "</div>", "{{ /each }}", "</li>", "{{ /each }}", "</ul>", "<!-- 默认收起 -->", "</div>", '<i class="third-games-expand-icon"></i>', "</div>", "{{ /if }}", "</dd>", "</dl>", "<dl>", "<dt>参与人数</dt>", "<dd>", "{{ each data.limit as item index }}", "{{ if item == gameSetData.setMember }}", '<a href="javascript:;" data-num="{{item}}" data-tag="set-game-member" class="third-games-select-btn active">{{item}}人</a>', "{{ /if }}", "{{ if item != gameSetData.setMember }}", '<a href="javascript:;" data-num="{{item}}" data-tag="set-game-member" class="third-games-select-btn">{{item}}人</a>', "{{ /if }}", "{{ /each }}", "</dd>", "</dl>", "{{ if data.start_trigger == 1 }}", "<dl>", "<dt>自动开始</dt>", "<dd>", '<div class="third-games-select-start">', "{{ if gameSetData.setAutoStart != 0 }}", '<a href="javascript:;" data-tag="game-start-auto" data-switch="1" class="third-games-select-btn active">开</a>', '<a href="javascript:;" data-tag="game-start-auto" data-switch="0" class="third-games-select-btn">关</a>', "{{ /if }}", "{{ if gameSetData.setAutoStart == 0 }}", '<a href="javascript:;" data-tag="game-start-auto" data-switch="1" class="third-games-select-btn">开</a>', '<a href="javascript:;" data-tag="game-start-auto" data-switch="0" class="third-games-select-btn active">关</a>', "{{ /if }}", "<span>（报名满后，游戏自动开始）</span>", "</div>", "</dd>", "</dl>", "{{ /if }}", '<dl class="third-games-explain">', "<dt>参与说明</dt>", "<dd>", '<textarea maxlength="50" data-tag="game-remain-desc" placeholder="试着讲讲游戏规则和奖励来吸引水友吧"  cols="30" rows="10">', "{{ gameSetData.setDesc }}", "</textarea>", '<span class="third-games-explain-count">', "{{ if (50 - gameSetData.setDesc.length) <= 0 }}", '<em class="status-active" data-tag="game-remain-num">{{ gameSetData.setDesc.length }}</em>/50', "{{ /if }}", "{{ if (50 - gameSetData.setDesc.length) > 0 }}", '<em data-tag="game-remain-num">{{ gameSetData.setDesc.length }}</em>/50', "{{ /if }}", "</span>", "</dd>", "</dl>", "</div>", '<div class="third-games-setting-right">', "<h2>主播基本收益</h2>", '<span class="third-games-profile">', '<em data-tag="game-profile-num">{{ winPrice }}</em>', '<span data-tag="game-profile-cell">{{ (+winPrice && gameSetData.setPrice.split("-")[1] == 2) ? "鱼丸" : "鱼翅" }}</span>', "</span>", '<div class="third-games-profile-icon">', '{{ if (priceType === "鱼丸") }}', '<i class="js-game2-1-gift-icon game-fish-ball"></i>', "{{ else }}", '<i class="js-game2-1-gift-icon"></i>', "{{ /if }}", "</div>", '<div class="third-games-profile-desc">', "<p>1. 主播获胜也可以获取道具奖励；</p>", "<p>2. 15分钟内未报满，游戏将自动取消；</p>", "<p>3. 取消游戏后，用户报名的费用将自动退还；</p>", "<p>4. 游戏收益请以实际兑换时为准。</p>", "</div>", '<a href="javascript:;" data-tag="game-publish-btn" class="third-games-publish">发布游戏</a>', "</div>", "</div>", "</div>"), s = a.compile(e)
		},
		gamePriceAwardRender: function() {
			var e, s;
			return e = t.string.join("{{ if data.length > 0 }}", '<div class="third-games-reward is-expand" data-tag="game-price-award">', '<ul class="clearfix">', "{{ each data as item index }}", '<li class="clearfix">', "<h4><em>第{{ awardRank[index] }}名</em>奖励</h4>", "{{ each item as childItem childIndex }}", '<div class="third-games-reward-item">', '<img src="{{ childItem.icon }}" alt="奖励图片">', '<span class="third-games-reward-detail">', '<span title="{{ childItem.name }}">{{ childItem.name }}</span> <em>x{{ childItem.cnt }}</em>', "</span>", "</div>", "{{ /each }}", "</li>", "{{ /each }}", "</ul>", "</div>", '<i class="third-games-expand-icon"></i>', "{{ /if }}"), s = a.compile(e)
		},
		gameRecordRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-content third-games-content-record">', "{{ if data.data.length > 0 }}", "<!-- 有记录 -->", '<div class="third-games-record">', "<table>", "<thead>", "<tr>", '<th class="third-games-record-gamename">游戏名称</th>', "<th>冠军</th>", "<th>报名费用</th>", "<th>人数</th>", "<th>游戏时间</th>", "</tr>", "</thead>", "<tbody>", "{{ each data.data as item index }}", "<tr>", "<th>", '<div class="third-games-record-game">', '<img style="width:28px;height:28px;" src="{{ item.game_info.icon }}" alt="游戏图标">', "<span>{{ item.game_name }}</span>", "</div>", "</th>", '<td class="third-games-record-no1">{{ item.win_result[0] }}</td>', '<td class="third-games-record-price">{{ item.price }}{{ item.currency == 2 ? "鱼丸" : "鱼翅"}}</td>', '<td class="third-games-record-num">{{ item.total }}人</td>', '<td class="third-games-record-time">', "<span>{{ item.commit_time }}</span>", "</td>", "</tr>", "{{ /each }}", "</tbody>", "</table>", "</div>", "<!-- 有记录 end -->", "{{ /if }}", "{{ if data.data.length <= 0 }}", "<!-- 无记录 -->", '<div class="third-games-record is-empty">', '<span>暂无游戏记录，赶快去<a href="javascript:;" data-tag="game-list-goto">发布游戏</a>吧！</span>', "</div>", "<!-- 无记录 end -->", "{{ /if }}", "</div>"), s = a.compile(e)
		},
		gameCancelRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-republish">', '{{ if data.cancelType == "closeUP" }}', '<p class="third-games-notstart">主播已取消游戏！</p>', "<p>参与报名的费用将返还</p>", "{{ /if }}", '{{ if data.cancelType == "gameError" }}', '<p class="third-games-notstart">游戏连接异常，已自动取消</p>', "<p>参与报名的费用将返还</p>", "{{ /if }}", '{{ if data.cancelType == "gamePlayError" }}', '<p class="third-games-notstart">游戏加载失败，已自动取消！</p>', "<p>参与报名的费用将返还</p>", "{{ /if }}", '{{ if data.cancelType == "timeOut" }}', "{{ if data.identity == 1 }}", '<p class="third-games-notstart">15分钟未开始，</p>', "<p>游戏已自动取消！</p>", '<a href="javascript:;" class="third-games-publish" data-tag="game-republish-btn">重新发布</a>', "{{ /if }}", "{{ if data.identity != 1 }}", '<p class="third-games-notstart">主播15分钟内未开始游戏，游戏已自动取消</p>', "<p>您的报名费用将返还！</p>", '<a href="javascript:;" class="third-games-publish" data-tag="game-list-goto">知道了</a>', "{{ /if }}", "{{ /if }}", '{{ if data.cancelType == "gamePlaying" }}', '<p class="third-games-notstart">您发布的游戏正在进行中</p>', "<p>请等待游戏结束后再发起新游戏！</p>", "{{ /if }}", '{{ if data.cancelType == "gameStop" }}', '<p class="third-games-notstart">超管已为您切换分区，您发起的互动游戏已被取消</p>', "{{ /if }}", "</div>"), s = a.compile(e)
		},
		gameCancelPopRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-dialog" data-tag="game-cancel-warp">', '<span class="third-games-dialog-vertical"></span>', '<div class="third-games-dialog-content">', '<p class="third-games-dialog-title">是否取消本次游戏发布？</p>', "<p>取消后，参与人支付的费用将返还</p>", '<div class="third-games-dialog-btns">', '<a href="javascript:;" class="third-games-btn-primary" data-tag="game-cancel-confirm">是</a>', '<a href="javascript:;" class="third-games-btn-default" data-tag="game-cancel-close">否</a>', "</div>", "</div>", "</div>"), s = a.compile(e)
		},
		gameJoinRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-content">', '<div class="third-games-userjoin">', '<div class="third-games-userjoin-left" data-tag="game-join-scroll">', '<div class="third-games-userjoin-anchor">', '<div class="third-games-userjoin-info">', '<img src="{{ anchorInfo.avatar }}" alt="主播头像">', "<span>{{ anchorInfo.name }}</span>", "</div>", '<div class="third-games-userjoin-content">', "<i></i>", '<span class="textVertical"></span>', '<span class="third-games-userjoin-text">{{ pushData.desc }}</span>', "</div>", "</div>", "<h3>参与游戏</h3>", '<div class="third-games-userjoin-game">', "<dl>", "<dd>", '<img src="{{ gameInfoData.icon }}" alt="游戏图标">', "<h4>{{ gameInfoData.name }}</h4>", "<p>{{ gameInfoData.desc }}</p>", "</dd>", "</dl>", "</div>", "<h3>获胜奖励</h3>", '<div class="third-games-reward-user">', "{{ if pushData.newAwards.length > 0 }}", '<ul class="clearfix">', "{{ each pushData.newAwards as item index }}", '<li class="clearfix">', "<h4><em>第{{ awardRand[index] }}名</em>奖励</h4>", "{{ each item as childItem childIndex }}", '<div class="third-games-reward-item">', '<img src="{{ childItem.icon }}" alt="奖励图片">', '<span class="third-games-reward-detail">', '<span title="{{ childItem.name }}">{{ childItem.name }}</span> <em>x{{ childItem.cnt }}</em>', "</span>", "</div>", "{{ /each }}", "</li>", "{{ /each }}", "</ul>", "{{ /if }}", "</div>", "</div>", '<div class="third-games-userjoin-right">', "<h2>报名费用</h2>", '<span class="third-games-profile"><em>{{ joinCost }}</em>{{ joinCell }}</span>', '<div class="third-games-profile-desc">', "<h4>游戏说明</h4>", "<p>1. 游戏获胜后可以获得道具奖励；</p>", "<p>2. 15分钟内未报满，游戏将自动取消；</p>", "<p>3. 取消游戏后，您的报名费用将自动退还；</p>", "<p>4. 报名后请勿关闭、刷新、退出网页。</p>", "</div>", '<a href="javascript:;" class="third-games-publish" data-tag="game-join-btn">立即报名</a>', "</div>", "</div>", "</div>"), s = a.compile(e)
		},
		gameEndResultRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-content">', '<div class="third-games-gameover">', '<div class="third-games-gameover-left" data-tag="game-over-scroll">', '<div class="third-games-gameover-award">', "<!-- third-games-gameover-no1 一二三名 -->", "{{ if gamePubData.newAwards.length > 0 }}", "{{ each gamePubData.newAwards as item index }}", "{{ if index < pushData.winerUser.length }}", '<dl class="third-games-gameover-no{{ index + 1 }}">', "<dt>", '<div class="third-games-gameover-info">', '<img src="{{ pushData.winerUser[index].icon }}" alt="玩家头像">', "<span>{{ pushData.winerUser[index].name }}</span>", "<i></i>", "</div>", "</dt>", "<dd>", "<h4><em>第{{ gameAwardRank[index] }}名</em>获得：</h4>", '<div class="third-games-reward-user clearfix">', "{{ each item as childItem childIndex }}", '<div class="third-games-reward-item">', '<img src="{{ childItem.icon }}" alt="奖励图片">', '<span class="third-games-reward-detail">', '<span title="{{ childItem.name }}">{{ childItem.name }}</span> <em>x{{ childItem.cnt }}</em>', "</span>", "</div>", "{{ /each }}", "</div>", "</dd>", "</dl>", "{{ /if }}", "{{ /each }}", "{{ /if }}", "</div>", "</div>", "<!-- 有名次加上 has-award -->", "{{ if pushData.winIndex > 0 }}", '<div class="third-games-gameover-right has-award">', "{{ /if }}", "{{ if pushData.winIndex <= 0 }}", '<div class="third-games-gameover-right">', "{{ /if }}", "{{ if pushData.winIndex > 0 }}", "<!-- 获得名次 -->", "<h2>恭喜，您获得第{{ gameAwardRank[pushData.winIndex - 1] }}名，</h2>", "<p>奖励已发放到您的背包</p>", "<!-- 获得名次 end -->", "{{ /if }}", "{{ if pushData.winIndex <= 0 }}", "<!-- 未获得名次 -->", "<h2>抱歉，您没有获得名次，</h2>", "<p>下次努力哦！</p>", "<!-- 未获得名次 end -->", "{{ /if }}", '{{ if identity == "DY_anchorTag" }}', '<div class="third-games-gameover-noplay">', '<a href="javascript:;" data-tag="game-not-play">不玩了></a>', "</div>", '<a href="javascript:;" class="third-games-publish" data-tag="game-play-again">再来一局</a>', "{{ /if }}", '{{ if identity != "DY_anchorTag" }}', '<a href="javascript:;" class="third-games-publish" data-tag="game-play-back">返回</a>', "{{ /if }}", "</div>", "</div>", "</div>"), s = a.compile(e)
		},
		gameRemainPopRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-dialog" data-tag="game-remain-warp">', '<span class="third-games-dialog-vertical"></span>', '<div class="third-games-dialog-content">', '{{ if data == "joinError" }}', '<p class="third-games-dialog-title">报名太火爆了！请稍候再试~</p>', "{{ /if }}", '{{ if data == "gameRecharge" }}', '<p class="third-games-dialog-title">您的鱼翅不足，快去充值吧！</p>', "{{ /if }}", '{{ if data == "memberFull" }}', '<p class="third-games-dialog-title">报名已经满了！下次快点哦~</p>', "{{ /if }}", '<div class="third-games-dialog-btns">', '{{ if data != "gameRecharge" }}', '<a href="javascript:;" class="third-games-btn-primary" data-tag="game-remain-btn">知道了</a>', "{{ /if }}", '{{ if data == "gameRecharge" }}', '<a href="/web_game/welcome/18" target="_blank" class="third-games-btn-primary">充值</a>', '<a href="javascript:;" class="third-games-btn-default" data-tag="game-remain-btn">取消</a>', "{{ /if }}", "</div>", "</div>", "</div>"), s = a.compile(e)
		},
		gameLoadingRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-dialog" data-tag="loading-warp">', '<span class="third-games-dialog-vertical"></span>', '<div class="third-games-dialog-content third-games-loading">', '<span class="third-games-loading-icon"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>', "<span>{{ data.title }}</span>", "</div>", "</div>"), s = a.compile(e)
		},
		gameErrorTipRender: function() {
			var e, s;
			return e = t.string.join('<div class="third-games-dialog" data-tag="game-error-dialog">', '<span class="third-games-dialog-vertical"></span>', '<div class="third-games-dialog-content third-games-loading">', '<span>{{ data.title || "请稍后再试" }}</span>', "</div>", "</div>"), s = a.compile(e)
		},
		gamePlayingRender: function() {
			var e, s;
			return e = t.string.join('<div data-tag="game-playing-warp" class="third-games-content third-games-content-iframe">', '<div data-tag="game-view-container" class="third-games-iframe-bg">', "{{ if gameInfoData && gameInfoData.pic }}", '<img class="third-games-iframe-bgimg" src="{{ gameInfoData.pic }}" />', "{{ /if }}", '<iframe scrolling="no" data-tag="game-view-container" src="{{ pushData.gameUrl }}" frameborder="0"></iframe>', "</div>", "</div>"), s = a.compile(e)
		},
		gamePushMsgRender: function() {
			var e, s;
			return e = t.string.join('{{ if type == "sendPlayMsg" }}', '<li class="jschartli chartli normal-notice">', '<i class="icon-heart"></i>', '<p class="text-cont">', '<a class="third-games-request"><em>{{ pushData.userInfo.name }}</em>请求主播发起<span>{{ gameInfoData.name }}</span>互动游戏</a>', "</p>", "</li>", "{{ /if }}", '{{ if type == "joinMsg" }}', '<li class="jschartli chartli normal-notice">', '<i class="icon-heart"></i>', '<p class="text-cont">', '<a data-tag="game-publish-msg" style="cursor: pointer">', '恭喜 <em class="hy-name">{{ userName }}</em>', '成功报名<span class="game-signup-notice">{{ gameName }}</span>', "</a>", "</p>", "</li>", "{{ /if }}", '{{ if type == "winMsg" }}', '<li class="jschartli gamewinner-tipswrap" data-type="list">', '<div class="gamewinner-tipsbox">', '<span class="gamewinner-headimg">', '<img src="{{ winUserInfo.icon }}" alt="">', "</span>", '<div class="gamewinner-info">', "恭喜 ", '<a title="{{ winUserInfo.name }}" data-tag="game-winer">', "{{ winUserInfo.name }}", "</a>", " 在本轮游戏中获胜，获得道具大礼包奖励！", "</div>", "</div>", "</li>", "{{ /if }}"), s = a.compile(e)
		},
		browserWarningRender: function() {
			var e, s;
			return e = t.string.join('<div class="interactgame-updatedialog">', '<div class="update-info">', "<h4>您当前浏览器不支持游戏功能</h4>", "<p>建议您更换以下浏览器使用</p>", "</div>", '<div class="update-browser">', '<a class="chrome" href="https://www.google.cn/intl/zh-CN/chrome/browser/desktop/" target="_blank" title="下载谷歌浏览器">', "<i></i>", "<dl>", "<dt></dt>", "<dd>下载谷歌浏览器</dd>", "</dl>", "</a>", '<a class="firefox" href="https://www.mozilla.org/zh-CN/firefox/new/" target="_blank" title="下载火狐浏览器">', "<i></i>", "<dl>", "<dt></dt>", "<dd>下载火狐浏览器</dd>", "</dl>", "</a>", "</div>", "</div>"), s = a.compile(e)
		},
		gameEndTimer: function() {
			var e, s;
			return e = t.string.join('<div data-tag="game-end-timer-warp" style="z-index: 502" class="interactgame-mask--half">', '<div class="countdown-box" data-tag="game-end-goto" style="cursor: pointer">', '<h2 data-tag="game-end-timer">05</h2>', '<p>游戏结束，<a href="javascript:;">查看奖励及排名&gt;</a></p>', "</div>", "</div>"), s = a.compile(e)
		}
	};
	return {
		enterRender: s.enterRender(),
		gameEnterMsgRender: s.gameEnterMsgRender(),
		gameFrameRender: s.gameFrameRender(),
		gameListRender: s.gameListRender(),
		gameSettingRender: s.gameSettingRender(),
		gamePriceAwardRender: s.gamePriceAwardRender(),
		gameRecordRender: s.gameRecordRender(),
		gameCancelRender: s.gameCancelRender(),
		gameCancelPopRender: s.gameCancelPopRender(),
		gameJoinRender: s.gameJoinRender(),
		gameEndResultRender: s.gameEndResultRender(),
		gameRemainPopRender: s.gameRemainPopRender(),
		gameLoadingRender: s.gameLoadingRender(),
		gameErrorTipRender: s.gameErrorTipRender(),
		gamePlayingRender: s.gamePlayingRender(),
		gamePushMsgRender: s.gamePushMsgRender(),
		browserWarningRender: s.browserWarningRender(),
		gameEndTimer: s.gameEndTimer()
	}
}), define("douyu/page/room/normal/mod/game2", ["jquery", "shark/class", "shark/observer", "shark/util/lang/1.0", "shark/util/cookie/1.0", "shark/util/storage/1.0", "shark/util/flash/data/1.0", "shark/util/template/2.0", "douyu/context", "douyu/com/user", "douyu/com/exjsonp", "douyu/com/config-user-info", "douyu/page/room/base/api", "douyu/page/room/normal/mod/game-tmp2"], function(e, t, a, s, i, n, r, o, d, c, l, g, u, m) {
	var p = {
		webconfUrl: d.get("sys.webconfUrl")
	},
		f = {
			doms: {
				$body: e("body")
			},
			levelExp: g.levelExp,
			urls: {
				enterSwitch: p.webconfUrl + "/resource/common/tongzhuo/tongzhuo.json",
				gameInfo: p.webconfUrl + "resource/common/tongzhuo/game_info.json",
				gameList: "/member/tongzhuo/GameList",
				sendStatus: "/member/tongzhuo/game_list",
				sendPlay: "/member/tongzhuo/anchorNotify",
				gamePublish: "/member/tongzhuo/PubGame",
				gameJoin: "/member/tongzhuo/CheckIn",
				gameStart: "/member/tongzhuo/StartGame",
				gameCancel: "/member/tongzhuo/CancelGame",
				gameResult: "/member/tongzhuo/GetMatchResult",
				gameRecord: "/member/tongzhuo/PubHistory",
				anchorStatus: "/member/tongzhuo/AnchorStatus",
				severTimeTick: "/member/tongzhuo/tick",
				searchGamePub: " /member/tongzhuo/latestGame"
			},
			priceMap: {
				0: "0",
				1: "鱼翅",
				2: "鱼丸"
			},
			gameStep: {
				gameList: {
					title: {
						anchor: "选择需要发布的游戏",
						user: "互动游戏"
					},
					state: "gameSet",
					step: 0,
					backBtn: !1,
					leftBtn: !1,
					recordBtn: !0,
					closeBtn: !0,
					rightBtn: !1
				},
				gameSet: {
					title: {
						anchor: "gameName",
						user: "互动游戏"
					},
					state: "gameWaiting",
					step: 1,
					backBtn: "选择游戏",
					leftBtn: !1,
					closeBtn: !0,
					rightBtn: !1
				},
				gameWaiting: {
					title: !1,
					state: "gamePlaying",
					step: 2,
					headStatus: !0,
					backBtn: !1,
					closeBtn: !1,
					rightBtn: ["game-cancel-btn", "game-view-close"]
				},
				gameRestart: {
					state: "gameRestartPlay",
					step: 2,
					backBtn: "返回",
					closeBtn: !1,
					rightBtn: ["game-view-close"]
				},
				gameRestartPlay: {
					state: "gameWaiting",
					btn: "发布游戏",
					step: 1,
					backBtn: !0,
					closeBtn: !0,
					rightBtn: !1
				},
				gameJoin: {
					title: "互动游戏",
					state: "gameJoinSuccess",
					backBtn: !1,
					rightBtn: !1
				},
				gameJoinSuccess: {
					state: "gameJoinSuccess",
					btn: !1,
					backBtn: !1,
					closeBtn: !0,
					rightBtn: !1,
					cancelBtn: !0
				},
				gamePlaying: {
					title: !1,
					state: "gamePlaying",
					step: 2,
					headStatus: !0,
					backBtn: !1,
					closeBtn: !1,
					rightBtn: ["game-cancel-btn", "game-view-close"]
				},
				gamePlayed: {
					title: !1,
					state: "gamePlayed",
					step: 2,
					headStatus: !0,
					backBtn: !1,
					closeBtn: !1,
					rightBtn: ["game-cancel-btn", "game-view-close"]
				},
				gameEndResultAnchor: {
					title: "游戏结束",
					state: "gameContinue",
					recordBtn: !0,
					backBtn: !1,
					closeBtn: !0
				},
				gameContinue: {
					state: "gameWaiting",
					step: 1,
					backBtn: "返回",
					closeBtn: !0,
					rightBtn: !1
				},
				gameEndResultUser: {
					title: "游戏结束",
					state: "gameClose",
					backBtn: !1,
					closeBtn: !0
				},
				gameCancel: {
					title: "游戏取消",
					state: "gameCancel",
					backBtn: "返回",
					closeBtn: !1,
					rightBtn: ["game-view-close"]
				},
				gameRecord: {
					title: "游戏记录",
					state: "gameRecord",
					backBtn: "返回",
					closeBtn: !0,
					rightBtn: !1
				},
				gameClose: {
					state: "gameClose",
					backBtn: !1,
					closeBtn: !0,
					rightBtn: !1
				}
			},
			instId: "",
			gameId: "",
			defaultData: {
				game2Flag: "interactiveGame",
				game2EnterUserTip: "参与游戏拿大奖，得名次稳赚不赔！",
				game2EnterAnchorTip: "游戏走一走，粉丝、收益全都有~",
				varTag: "DY_" + d.get("room.room_id") + "_",
				userTag: "DY_user",
				anchorTag: "DY_anchorTag",
				noPlayerName: "虚位以待",
				noPlayerAvatar: d.get("sys.web_url") + "/app/douyu/res/page/room-normal/game/noplayer_icon.png?20170224",
				expiredTime: 120,
				gameOverTime: 4800,
				gameJoinPrice: 10,
				gameJoinPlayer: 4,
				gameJoinDesc: "参与游戏拿大奖，得名次稳赚不赔！",
				gameAwardRank: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
			},
			notRecordList: ["backBtn", "enterBtn", "userEnterBtn", "gameCancel"],
			types: {
				userConnected: "loginres",
				gameStart: "3rd_gmrl",
				gameJoin: "3rd_gmrg",
				gameReady: "3rd_gmrdy",
				gamePlay: "3rd_gmst",
				gameEnd: "3rd_gmend",
				gameCancel: "3rd_gmcan",
				gameSend: "3rd_toan"
			},
			gameResultD: "",
			gameCloseSetTime: "",
			game2ListData: "",
			game2ListAll: "",
			otherAnchorGame: "",
			gameInfoData: "",
			lastGameInfoData: "",
			searchGameStatus: "",
			gameSetData: {},
			userConnectStatus: !1,
			game2IDList: [],
			game2WaitTimer: "",
			gameGuideTip: n.get("gameGuideTip") || 0,
			cate_id: d.get("room.cate_id"),
			room_id: d.get("room.room_id"),
			owner_uid: d.get("room.owner_uid"),
			owner_name: d.get("room.owner_name"),
			anchorInfo: {
				name: d.get("room.owner_name"),
				avatar: d.get("room.avatar.middle")
			}
		},
		h = {
			browserCheck: function() {
				function e(e) {
					e = e.toLowerCase();
					var n = t.exec(e) || a.exec(e) || s.exec(e) || e.indexOf("compatible") < 0 && i.exec(e) || [];
					return {
						browser: n[1] || "",
						version: n[2] || "0"
					}
				}
				var t = /(webkit)[ \/]([\w.]+)/,
					a = /(opera)(?:.*version)?[ \/]([\w.]+)/,
					s = /(msie) ([\w.]+)/,
					i = /(mozilla)(?:.*? rv:([\w.]+))?/,
					n = {
						mozilla: !1,
						webkit: !1,
						opera: !1,
						msie: !1
					},
					r = e(navigator.userAgent);
				return n[r.browser] = !0, n.version = r.version, n.safari = !! n.webkit, n
			},
			eventDefault: function(e) {
				return e.stopPropagation(), e.preventDefault(), !1
			},
			returnType: function(e) {
				for (var t = [null, void 0], a = 0; a < t.length; a++) if (e == t[a]) return e;
				return Object.prototype.toString.call(e).slice(8, -1).toLowerCase()
			},
			requestData: function(t, a) {
				var s = {
					url: t.url || "",
					type: t.type || "GET",
					data: t.data || {},
					dataType: t.dataType || "json",
					cache: t.cache || !1,
					success: function(e) {
						a && a(e)
					},
					error: function(e) {
						a && a(e)
					}
				};
				t.jsonp && (s.jsonp = t.jsonp, s.callback = t.jsonCallBack), e.ajax(s)
			},
			localStorageSet: function(e) {
				var t, a = e.name;
				t = "object" === h.returnType(e.params) ? JSON.stringify(e.params) : e.params, "number" === h.returnType(e.expired) ? -1 === e.expired ? n.set(f.defaultData.varTag + a, t, 86400) : n.set(f.defaultData.varTag + a, t, e.expired) : n.set(f.defaultData.varTag + a, t, f.defaultData.gameOverTime)
			},
			localStorageGet: function(e) {
				var t = n.get(f.defaultData.varTag + e);
				return "object" === h.returnType(JSON.parse(t)) ? JSON.parse(t) : t
			},
			localStorageRemove: function(e) {
				n.remove(f.defaultData.varTag + e)
			},
			returnGameInfoData: function() {
				return "object" === h.returnType(h.localStorageGet("gameInfoData")) ? h.localStorageGet("gameInfoData") : f.gameInfoData
			},
			countTimer: function(e) {
				var t, a, s = e.time,
					i = e.ele,
					n = function(e) {
						return 0 == e ? "00" : 10 > e ? "0" + e : e
					};
				if (0 >= s) return void i.text("00 : 00");
				switch (e.type) {
				case "second":
				default:
					a = function(e) {
						i.text(n(e.time))
					};
					break;
				case "minute":
					a = function(e) {
						var t = parseInt(e.time / 60, 10),
							a = e.time % 60;
						i.text(n(t) + " : " + n(a))
					};
					break;
				case "hour":
					a = function(e) {
						var t = parseInt(e.time / 3600, 10),
							a = parseInt(e.time % 3600 / 60, 10),
							s = e.time - 60 * t * 60 - 60 * a;
						i.text(n(t) + " : " + n(a) + " : " + n(s))
					}
				}
				return t = function() {
					s > 0 ? (s--, a({
						time: s
					})) : (clearInterval(f.game2WaitTimer), "function" === h.returnType(e.callback) && e.callback())
				}, clearInterval(f.game2WaitTimer), f.game2WaitTimer = setInterval(t, 1e3), f.game2WaitTimer
			},
			getRestTime: function(e) {
				var t, a;
				return e = e ? parseInt(e, 10) : 0, t = new Date, t.setDate(t.getDate() + e), t.setHours(24), t.setMinutes(0), t.setSeconds(0), a = t.getTime() - (new Date).getTime()
			},
			anchorCheck: function() {
				return parseInt(f.owner_uid, 10) === parseInt(d.get("sys.uid"), 10)
			},
			getCSRFCookie: function(t, a) {
				var s, n = this,
					r = i.get(d.get("sys.tvk"));
				return r ? (s = d.get("sys.tn"), void(a && a({
					name: s,
					val: r
				}))) : void e.ajax({
					url: "/curl/csrfApi/getCsrfCookie",
					type: "GET",
					dataType: "json",
					success: function(e) {
						0 === e.error && n.getCSRFCookie(t, a)
					}
				})
			},
			_giveUpLastZero: function(e) {
				if (-1 === e.indexOf(".")) return e;
				var t = e.split(""),
					a = t.splice(-1, 1)[0];
				return "0" !== a && "." !== a ? e : this._giveUpLastZero(t.join(""))
			},
			formateNumber: function(e, t) {
				var a = +e,
					s = void 0 === t ? 1 : t,
					i = a.toFixed(s);
				return this._giveUpLastZero(i)
			}
		},
		v = {
			init: function() {
				this.doms = {}, this.anchorCheck = h.anchorCheck(), this.flashPushTrigger(), this.enterCheck()
			},
			enterCheck: function(t) {
				var a = this,
					s = function() {
						l.load(f.urls.gameInfo, "getGameInfo", function(e) {
							var s;
							if (f.game2ListAll = e, t && "update" == t.type) {
								s = f.game2IDList, f.game2ListData = [];
								for (var i = 0; i < s.length; i++)"object" === h.returnType(e[s[i]]) && f.game2ListData.push(e[s[i]])
							}
							a.enterAppend()
						}, function() {}, "", !0)
					},
					i = function(t) {
						var a, i = t,
							n = [];
						for (a in i) if (a == f.cate_id) {
							if (n = i[a], !n) return;
							if (e.isArray(n) && n.length > 0) {
								f.game2IDList = n, s();
								break
							}
						}
					};
				l.load(f.urls.enterSwitch, "setTzyxSwitch", function(e) {
					i(e)
				}, function() {}, "", !0)
			},
			gameProgressCheck: function() {
				var e = "",
					t = h.localStorageGet("gameProgress");
				return "object" === h.returnType(t) && (e = "gamePlaying" == t.nowProgress || "gamePlayed" == t.nowProgress || "gameCancel" == t.nowProgress ? "gameList" : ""), e
			},
			game2EnterAgent: function(t) {
				var a = this,
					s = function(s) {
						var i = f.game2IDList;
						if (!f.game2ListData || !e.isArray(f.game2ListData)) {
							f.game2ListData = [];
							for (var n = 0; n < i.length; n++)"object" === h.returnType(s[i[n]]) && f.game2ListData.push(s[i[n]])
						}
						if ("eHover" === t.type) {
							if (f.otherAnchorGame) return;
							if (1 === h.localStorageGet("gameOwnerJoined")) return;
							a.game2SearchPubed()
						} else "eClick" === t.type && a.game2StatusSearch()
					};
				l.load(f.urls.gameInfo, "getGameInfo", function(e) {
					f.game2ListAll = e, s(f.game2ListAll)
				}, function() {}, "", !0)
			},
			game2StatusSearch: function() {
				var t = this,
					a = function(a) {
						if (0 == a.error) {
							var s, i, n, r = a.data;
							if ("object" === h.returnType(r)) {
								if (n = f.game2ListAll[r.game_id], "object" !== h.returnType(n)) return void t.enterGameStatus({
									status: parseInt(r.status, 10),
									data: r
								});
								f.lastGameInfoData = n, s = r.status, i = r.anchor_info, r.gameid = r.flow, f.instId = r.flow, r.desc = r.remark, r.limit = r.total, r.st = r.commit_time, r.timestamp = r.commit_time, r.owner_uid = d.get("sys.uid"), r.gamecfgid = r.game_id, "object" === h.returnType(r.game_info) ? r.autoStart = r.game_info.auto_start : r.autoStart = 1;
								var o = [h.formateNumber(r.price, 1), r.currency].join("-"),
									c = n.awards[o];
								r.newAwards = c || {}, "array" === h.returnType(r.players) && (r.user = r.players, r.user.unshift({
									icon: i.avatar,
									name: i.nick,
									identity: i.role,
									uid: f.owner_uid
								})), f.searchGameStatus = r, t.enterGameStatus({
									status: parseInt(s, 10),
									data: r
								})
							} else t.gameEnterOpen()
						} else e.dialog.tips_black(a.msg || "稍后重试")
					};
				h.requestData({
					url: f.urls.anchorStatus,
					data: {
						roomId: f.room_id,
						type: 2
					}
				}, a)
			},
			enterGameStatus: function(e) {
				var t = this,
					s = this.doms,
					i = e.data,
					n = !1,
					r = 0,
					o = h.localStorageGet("gameProgress"),
					c = function(e, t) {
						var a = 0;
						if ("array" !== h.returnType(e)) return [];
						for (this.newObj = {}; a < e.length; a++) this.newObj[e[a]] = i[e[a]];
						return this.newObj.type = t, this.newObj
					},
					l = function(e) {
						var t;
						return "object" !== h.returnType(e) ? {} : ("object" !== h.returnType(h.localStorageGet(e.name)), t = new c(e.gameStatus, e.type), h.localStorageSet({
							name: e.name,
							params: t
						}), void 0)
					},
					g = function() {
						l({
							type: f.types.gameStart,
							name: "gamePublishPush",
							gameStatus: ["desc", "gameid", "limit", "newAwards", "owner_uid", "price", "st", "gamecfgid", "currency"]
						}), h.localStorageSet({
							name: "gameSetData",
							params: {
								setPrice: i.price,
								setMember: i.limit,
								setAutoStart: i.autoStart,
								setDesc: i.desc
							}
						}), l({
							type: f.types.gameJoin,
							name: "gameJoinListPush",
							gameStatus: ["gameid", "user", "gamecfgid"]
						})
					},
					u = function(e) {
						h.localStorageSet({
							name: "gamePlayingPush",
							params: e
						})
					};
				switch (e.status) {
				case 1:
					if (t.clearGamePush(), f.gameInfoData = f.game2ListAll[i.game_id], g(), t.anchorCheck) h.localStorageSet({
						name: "gameOwnerJoined",
						params: 1
					}), h.localStorageSet({
						name: "gamePublishID",
						params: i.gameid
					}), u({
						gamecfgid: i.gamecfgid,
						gameUrl: i.gameUrl,
						instId: i.flow,
						owner_uid: i.uid,
						timestamp: i.commit_time
					}), s.enterBtn.data({
						triggerType: "enterGoTo",
						state: "gamePlaying"
					});
					else {
						for (; r < i.user.length; r++) if (i.user[r].uid == d.get("sys.uid")) {
							n = !0;
							break
						}
						n ? (h.localStorageSet({
							name: "gameOwnerJoined",
							params: 1
						}), u({
							gamecfgid: i.gamecfgid,
							gameUrl: i.gameUrl,
							instId: i.flow,
							owner_uid: i.uid,
							timestamp: i.commit_time
						}), s.enterBtn.data({
							triggerType: "enterGoTo",
							state: "gamePlaying"
						})) : s.enterBtn.data({
							triggerType: "enterGoTo",
							state: "gameJoin"
						}), a.trigger("dys", {
							key: "dys.room.normal.show.viewer.inavgame"
						})
					}
					break;
				case 2:
					if (t.clearGamePush(), f.gameInfoData = f.game2ListAll[i.game_id], g(), l({
						type: f.types.gameReady,
						name: "gameReadyPush",
						gameStatus: ["gameid"]
					}), t.anchorCheck) h.localStorageSet({
						name: "gameOwnerJoined",
						params: 1
					}), h.localStorageSet({
						name: "gamePublishID",
						params: i.gameid
					}), u({
						gamecfgid: i.gamecfgid,
						gameUrl: i.gameUrl,
						instId: i.flow,
						owner_uid: i.uid,
						timestamp: i.commit_time
					}), s.enterBtn.data({
						triggerType: "enterGoTo",
						state: "gamePlaying"
					});
					else {
						for (; r < i.user.length; r++) if (i.user[r].uid == d.get("sys.uid")) {
							n = !0;
							break
						}
						n ? (h.localStorageSet({
							name: "gameOwnerJoined",
							params: 1
						}), u({
							gamecfgid: i.gamecfgid,
							gameUrl: i.gameUrl,
							instId: i.flow,
							owner_uid: i.uid,
							timestamp: i.commit_time
						}), s.enterBtn.data({
							triggerType: "enterGoTo",
							state: "gamePlaying"
						})) : t.clearGamePush()
					}
					break;
				case 4:
					t.clearGamePush(), s.enterBtn.data({
						triggerType: "enterBtn",
						state: t.gameProgressCheck()
					});
					break;
				case 5:
					t.clearGamePush(), o ? "gameRestart" == o.nowProgress || "gameCancel" == o.nowProgress ? s.enterBtn.data({
						triggerType: "enterGoTo",
						state: "gameRestart"
					}) : s.enterBtn.data({
						triggerType: "enterGoTo",
						state: "gameList"
					}) : s.enterBtn.data({
						triggerType: "enterBtn",
						state: t.gameProgressCheck()
					});
					break;
				case 7:
					"object" === h.returnType(h.localStorageGet("gameEndPush")) ? (t.clearGamePush(), s.gameWarp.find('[data-tag="game-end-timer"]') && s.gameWarp.find('[data-tag="game-end-timer"]').length > 0 && (clearInterval(f.game2WaitTimer), s.gameWarp.find('[data-tag="game-end-timer-warp"]').remove()), s.enterBtn.data({
						triggerType: "enterGoTo",
						state: t.anchorCheck ? "gameEndResultAnchor" : "gameEndResultUser"
					})) : (t.clearGamePush(), s.enterBtn.data({
						triggerType: "enterBtn",
						state: t.gameProgressCheck()
					}));
					break;
				case 3:
				case 6:
					if (t.clearGamePush(), f.gameInfoData = f.game2ListAll[i.game_id], g(), l({
						type: f.types.gameReady,
						name: "gameReadyPush",
						gameStatus: ["gameid", "gamecfgid"]
					}), t.anchorCheck) h.localStorageSet({
						name: "gameOwnerJoined",
						params: 1
					}), h.localStorageSet({
						name: "gamePublishID",
						params: i.gameid
					}), u({
						gamecfgid: i.gamecfgid,
						gameUrl: i.gameUrl,
						instId: i.flow,
						owner_uid: i.uid,
						timestamp: i.commit_time
					}), h.localStorageSet({
						name: "gameStartPush",
						params: {
							type: f.types.gameStart,
							gamecfgid: i.game_id,
							gameid: i.flow,
							rid: f.room_id
						}
					}), s.enterBtn.data({
						triggerType: "enterGoTo",
						state: "gamePlayed"
					});
					else {
						for (; r < i.user.length; r++) if (i.user[r].uid == d.get("sys.uid")) {
							n = !0;
							break
						}
						n ? (h.localStorageSet({
							name: "gameOwnerJoined",
							params: 1
						}), u({
							gamecfgid: i.gamecfgid,
							gameUrl: i.gameUrl,
							instId: i.flow,
							owner_uid: i.uid,
							timestamp: i.commit_time
						}), h.localStorageSet({
							name: "gameStartPush",
							params: {
								type: f.types.gameStart,
								gamecfgid: i.game_id,
								gameid: i.flow,
								rid: f.room_id
							}
						}), s.enterBtn.data({
							triggerType: "enterGoTo",
							state: "gamePlayed"
						})) : (t.clearGamePush(), s.enterBtn.data({
							triggerType: "enterBtn",
							state: "gameList"
						}))
					}
					break;
				case 8:
				case 9:
				case 10:
				case 11:
				default:
					t.clearGamePush(), s.enterBtn.data({
						triggerType: "enterGoTo",
						state: "gameList"
					})
				}
				t.gameEnterOpen()
			},
			enterAppend: function() {
				var t = this,
					s = this.doms;
				a.trigger("mod.chat.action.view.add", {
					tips: t.anchorCheck ? f.defaultData.game2EnterAnchorTip : f.defaultData.game2EnterUserTip,
					flag: f.defaultData.game2Flag,
					dom: m.enterRender({
						gameGuideTip: n.get("gameGuideTip")
					})
				}), h.localStorageRemove("gameEndPush"), "object" === h.returnType(h.localStorageGet("gameEndPush")) ? t.resetGameState({
					type: "gameEnd"
				}) : 1 != h.localStorageGet("gameOwnerJoined") && t.clearGamePush(), s.enterBtnWarp = e('[data-flag="' + f.defaultData.game2Flag + '"]'), s.enterBtn = e('[data-tag="game-enter-btn"]'), t.eventBind(), t.anchorCheck ? s.enterBtn.data({
					Identity: f.defaultData.userTag,
					triggerType: "enterBtn",
					state: ""
				}) : s.enterBtn.data({
					Identity: f.defaultData.anchorTag,
					triggerType: "userEnterBtn",
					state: "gameJoin"
				}), t.anchorCheck && (n.get("gameGuideTip") || (s.enterTip = s.enterBtn.find('[data-tag="game-enter-tip"]'), s.enterTip.show(), n.set("gameGuideTip", 1, 31536e3)))
			},
			game2SearchPubed: function() {
				var e = this,
					t = function(t) {
						if (t && 0 == t.error && t.data && "object" === h.returnType(t.data)) {
							if (f.otherAnchorGame = t, !f.game2ListAll[t.data.gameId]) return;
							e.gameEnterMsgAppend({
								gameInfoData: f.game2ListAll[t.data.gameId],
								pubData: t.data,
								anchorInfo: {
									name: t.data.anchorName
								},
								curRoom: t.data.roomId == f.room_id ? 1 : 0
							}), setTimeout(function() {
								f.otherAnchorGame = null
							}, 1e4)
						}
					};
				h.requestData({
					url: f.urls.searchGamePub,
					data: {
						roomId: f.room_id
					}
				}, t)
			},
			errorDialog: function(t) {
				var a = this.doms,
					s = a.gameWarp.find('[data-tag="game-error-dialog"]');
				s.length > 0 && s.remove(), a.gameWarp.append(m.gameErrorTipRender({
					data: t
				})), setTimeout(function() {
					a.gameWarp.find('[data-tag="game-error-dialog"]').fadeOut(500, function() {
						e(this).remove()
					})
				}, 2e3)
			},
			gameFrameAppend: function() {
				var t, a = this,
					s = this.doms;
				f.doms.$body.find('[data-tag="interact-game-wrap"]').remove(), e("#js-stats-and-actions").append(m.gameFrameRender({})), s.gameWarp = e('[data-tag="interact-game-wrap"]'), t = s.gameWarp, s.gameContent = t.find('[data-tag="game-content-warp"]'), s.gameBoxSwitch = t.find('[data-tag="game-view-close"]'), s.gameBackBtn = t.find('[data-tag="game-back-btn"]'), s.gameRightBtn = t.find('[data-tag="game-right-btn"]'), a.eventBindAfter()
			},
			gameFrameCheck: function() {
				var e = this,
					t = this.doms;
				"object" !== h.returnType(t.gameWarp) && e.gameFrameAppend()
			},
			gameEnterMsgAppend: function(e) {
				var t = this.doms;
				t.gameEnterMsg && t.gameEnterMsg.length > 0 && t.gameEnterMsg.remove(), t.enterBtnWarp.append(m.gameEnterMsgRender({
					data: e
				})), t.gameEnterMsg = t.enterBtnWarp.find('[data-tag="game-enter-msg"]')
			},
			gameListAppend: function(e) {
				var t = this,
					a = this.doms,
					s = 0,
					i = function(i) {
						var n;
						if (!h.anchorCheck()) {
							if (!i || 0 != i.error) return;
							n = i.data
						}
						f.game2ListData && (f.searchGameStatus && (2 != f.searchGameStatus.status && 3 != f.searchGameStatus.status && 6 != f.searchGameStatus.status || (s = 1)), a.gameContent.html(m.gameListRender({
							gameListData: f.game2ListData,
							userIdentity: !t.anchorCheck,
							sendStatusList: n,
							gamePlayed: s
						})), t.gameStepState(e), a.gameListBox = a.gameWarp.find(".third-games-selectgame"), t.gameBoxSwitch({
							state: "open"
						}))
					};
				t.anchorCheck ? i() : h.requestData({
					url: f.urls.sendStatus,
					data: {
						roomId: f.room_id,
						cateId: f.cate_id
					}
				}, i)
			},
			changePriceType: function(e) {
				var t = ("" + e).split("-");
				1 === t.length && (t[1] = "1");
				var a = {
					0: "免费",
					1: "鱼翅",
					2: "鱼丸"
				},
					s = h.formateNumber(t[0], 1),
					i = 0 === +t[0] ? "0" : t[1];
				return [s, a[i] || "", i]
			},
			gameSettingAppend: function(e) {
				var t = this,
					a = this.doms,
					s = h.returnGameInfoData(),
					i = h.localStorageGet("gameSetData"),
					n = {},
					r = function(r) {
						var o, d = r,
							c = [],
							l = 0,
							g = 0,
							u = !1,
							p = !1;
						for (o in d.awards) {
							var v = t.changePriceType(o);
							c.push({
								price: o,
								show: +v[0] ? v[0] + v[1] : v[1],
								num: v[0],
								type: v[2],
								pack: d.awards[o]
							})
						}
						if (c.length < 1 && (c.unshift({
							price: f.defaultData.gameJoinPrice,
							show: "免费",
							num: 0,
							type: 0,
							pack: []
						}), d.awards[f.defaultData.gameJoinPrice] = []), "array" === h.returnType(d.limit) ? d.limit.length < 1 && (d.limit = [], d.limit.push(d.limit[0])) : (d.limit = [], d.limit.push(f.defaultData.gameJoinPlayer)), "object" === h.returnType(i)) {
							for (; l < c.length; l++) if (c[l].price == i.setPrice) {
								u = !0;
								break
							}
							for (; g < d.limit.length; g++) if (d.limit[g] == i.setMember) {
								p = !0;
								break
							}
						} else i = {
							setPrice: c[0].price,
							setMember: d.limit[0],
							setAutoStart: s.start_trigger,
							setDesc: ""
						};
						u || (i.setPrice = c[0].price), p || (i.setMember = d.limit[0]), "object" === h.returnType(i) ? (i.setDesc == f.defaultData.gameJoinDesc && (i.setDesc = ""), n = {
							data: d,
							priceList: c,
							winPrice: h.formateNumber((i.setMember - 1) * i.setPrice.split("-")[0] * .3, 2),
							awardRank: f.defaultData.gameAwardRank,
							gameSetData: {
								setPrice: i.setPrice || c[0].price,
								setMember: i.setMember || d.limit[0],
								setAutoStart: i.setAutoStart,
								setDesc: i.setDesc
							}
						}) : n = {
							data: d,
							priceList: c,
							winPrice: h.formateNumber((i.setMember - 1) * i.setPrice.split("-")[0] * .3, 2),
							priceType: i.priceType || "鱼翅",
							gameSetData: {
								setPrice: c[0].price,
								setMember: d.limit[0],
								setAutoStart: s.start_trigger,
								setDesc: ""
							}
						}, a.gameContent.html(m.gameSettingRender(n)), a.gameWarp.find('[data-tag="game-price-award"]').mCustomScrollbar("destroy").mCustomScrollbar(), t.gameStepState(e), a.gameSetPrice = a.gameWarp.find('[data-tag="set-game-price"]'), a.gameSetMember = a.gameWarp.find('[data-tag="set-game-member"]'), a.gameRemainNum = a.gameWarp.find('[data-tag="remaining-num"]'), a.gamePriceAward = a.gameWarp.find('[data-tag="game-price-award"]')
					};
				"object" === h.returnType(s) && "object" === h.returnType(f.game2ListAll[s.gameid]) ? (t.gameInfoDataInit(f.game2ListAll[s.gameid]), r(h.returnGameInfoData())) : t.gameContentAgent({
					triggerType: "stepBtn",
					gameState: "gameList"
				})
			},
			gamePriceAwardAppend: function(e) {
				var t = this.doms,
					a = h.returnGameInfoData().awards[e];
				"array" !== h.returnType(a) && (a = []), t.gameWarp.find(".third-games-reward-wrapper").html(m.gamePriceAwardRender({
					data: a,
					awardRank: f.defaultData.gameAwardRank
				})), t.gameWarp.find('[data-tag="game-price-award"]').mCustomScrollbar("destroy").mCustomScrollbar()
			},
			gameRecordAppend: function(e) {
				var t = this,
					a = this.doms,
					s = function(s) {
						return a.gameWarp.find('[data-tag="loading-warp"]').remove(), 0 != s.error ? void t.errorDialog({
							title: s.msg
						}) : (s.data.forEach(function(e, t) {
							var a = s.data[t] || {};
							"object" !== h.returnType(e) && (e = {}), "array" !== h.returnType(e.win_result) && (a.win_result = []), "object" !== h.returnType(e.game_info) && (a.game_info = {})
						}), a.gameContent.html(m.gameRecordRender({
							data: s
						})), s.data.length <= 0 && a.gameWarp.find('[data-tag="game-goto-set"]').data({
							state: "gameSet"
						}), t.gameStepState(e), void("object" !== h.returnType(h.localStorageGet("gameRecordList")) && h.localStorageSet({
							name: "gameRecordList",
							params: s,
							expired: f.defaultData.expiredTime
						})))
					};
				a.gameWarp.append(m.gameLoadingRender({
					data: {
						title: "加载中..."
					}
				})), "object" === h.returnType(h.localStorageGet("gameRecordList")) ? s(h.localStorageGet("gameRecordList")) : h.requestData({
					url: f.urls.gameRecord,
					data: {
						uid: d.get("sys.uid")
					}
				}, s)
			},
			gamePublishReq: function() {
				var e, t = this,
					a = this.doms;
				t.localGameSetData({
					type: f.defaultData.anchorTag
				}), e = h.localStorageGet("gameSetData");
				var s = function(e) {
						a.gameWarp.find('[data-tag="loading-warp"]').remove(), 0 == e.error ? (f.instId = e.data.instId, h.localStorageSet({
							name: "gamePublishID",
							params: e.data.instId
						}), t.anchorCheck && (t.game2DpConfig({
							dpType: "dys.room.normal.click.anchor.inavgame.publish"
						}), t.gamePlayingAppend({
							stateData: {
								gameState: "gamePlaying",
								triggerType: "stepBtn"
							},
							pushData: e.data
						}))) : t.errorDialog({
							title: e.msg
						})
					};
				a.gameWarp.append(m.gameLoadingRender({
					data: {
						title: "发布中..."
					}
				})), h.getCSRFCookie(i, function(t) {
					var a = {
						gameId: h.returnGameInfoData().gameid,
						roomId: f.room_id,
						cateId: f.cate_id,
						price: e.setPrice,
						total: e.setMember,
						remark: e.setDesc,
						autoStart: e.setAutoStart
					};
					a[t.name] = t.val, h.requestData({
						url: f.urls.gamePublish,
						type: "POST",
						data: a
					}, s)
				})
			},
			gamePlayingAppend: function(e) {
				var t, a, s = this,
					i = this.doms,
					n = e,
					r = e.stateData,
					o = h.returnGameInfoData(),
					c = h.localStorageGet("gameJoinListPush"),
					l = h.localStorageGet("gameSetData"),
					g = h.localStorageGet("gameStartPush"),
					u = function() {
						i.gameWarp.find('[data-tag="game-wait-time"]').hide(), i.gameWarp.find('[data-tag="header-status-text"]').text("游戏取消中…")
					},
					p = function() {
						var e;
						clearInterval(f.game2WaitTimer), i.gameWarp.find('[data-tag="game-wait-time"]').text("-- : --"), "object" === h.returnType(g) ? s.gameHeadStatus({
							status: "played"
						}) : (e = "object" === h.returnType(c) ? l.setMember - c.user.length : l.setMember - 1, s.gameHeadStatus({
							member: e
						})), a = function(e) {
							0 == e.error && (t = 900 - (e.msg - parseInt(n.timestamp, 10)), t > 900 && (t = 900), i.gameWarp.find('[data-tag="game-wait-time"]').show(), i.gameWarp.find('[data-tag="header-status-text"]').text(" 未开始游戏将自动取消"), h.countTimer({
								type: "minute",
								time: t,
								ele: i.gameWarp.find('[data-tag="game-wait-time"]'),
								callback: u
							}))
						}, h.requestData({
							url: f.urls.severTimeTick
						}, a)
					};
				return e.pushData ? (n = e.pushData, n.owner_uid = d.get("sys.uid"), i.gameContent.html(m.gamePlayingRender({
					pushData: n,
					gameInfoData: o
				})), i.gameWarp.find('[data-tag="loading-warp"]').remove(), i.gameWaitTime = i.gameWarp.find('[data-tag="game-wait-time"]'), i.gameWarp.find('[data-tag="game-view-container"]').css({
					width: o.w,
					height: o.h
				}), h.localStorageSet({
					name: "gamePlayingPush",
					params: n
				}), s.gameStepState(r), "object" === h.returnType(h.localStorageGet("gameReadyPush")) && (i.gameWarp.find('[data-tag="game-step-btn"]').removeClass("status-disable"), i.gameWarp.find('[data-tag="game-user-status"]').addClass("status-active status-long").text("人数已满请开始游戏")), void p()) : (s.clearGamePush(), void s.gameContentAgent({
					triggerType: "stepBtn",
					gameState: "gameList"
				}))
			},
			gameCancelAppend: function(e) {
				var t = this,
					a = this.doms,
					s = e.stateData,
					n = h.localStorageGet("gamePublishPush") || {};
				if (t.anchorCheck) if ("timeOut" == e.cancelType || "gameError" == e.cancelType || "gamePlayError" == e.cancelType || "gameStop" == e.cancelType) e.identity = 1, t.resetGameState({
					type: "cancel"
				}), a.gameWarp.find('[data-tag="game-cancel-warp"]').fadeOut().remove(), a.gameContent.html(m.gameCancelRender({
					data: e
				})), t.gameStepState(s);
				else {
					var r = function(e) {
							a.gameWarp.find('[data-tag="loading-warp"]').remove(), 0 == e.error ? t.anchorCheck && (t.resetGameState({
								type: "cancel"
							}), a.gameWarp.find('[data-tag="game-cancel-warp"]').remove(), t.gameContentAgent({
								triggerType: "stepBtn",
								gameState: "gameSet"
							}), clearInterval(f.game2WaitTimer), a.gameWarp.find('[data-tag="game-wait-time"]').text("-- : --")) : t.errorDialog({
								title: e.msg
							})
						};
					a.gameWarp.append(m.gameLoadingRender({
						data: {
							title: "取消中..."
						}
					})), h.getCSRFCookie(i, function(e) {
						var t = {
							instId: f.instId || h.localStorageGet("gamePublishID")
						};
						t[e.name] = e.val, h.requestData({
							url: f.urls.gameCancel,
							type: "POST",
							data: t
						}, r)
					})
				} else e.identity = 2, e.gameid = n.gameid, t.resetGameState({
					type: "cancel"
				}), a.gameWarp.find('[data-tag="game-cancel-warp"]').fadeOut().remove(), a.gameContent.html(m.gameCancelRender({
					data: e
				})), t.gameStepState(s)
			},
			gameCancelPopAppend: function(e) {
				var t = this.doms;
				t.gameWarp.append(m.gameCancelPopRender({
					data: e
				}))
			},
			gameJoinAppend: function(e) {
				var t = this,
					a = this.doms,
					s = h.localStorageGet("gamePublishPush"),
					i = function() {
						var i = [(+s.price).toFixed(1), s.currency].join("-"),
							n = t.changePriceType(i);
						t.nowGameCostType = n[2];
						var r = 0 === +n[2] ? n[1] : n[0],
							o = {
								0: "",
								1: "鱼翅",
								2: "鱼丸"
							};
						a.gameContent.html(m.gameJoinRender({
							anchorInfo: f.anchorInfo,
							awardRand: f.defaultData.gameAwardRank,
							pushData: s,
							joinCost: r,
							joinCell: o[n[2]],
							gameInfoData: h.returnGameInfoData()
						})), t.gameStepState(e), a.gameWarp.find('[data-tag="game-join-scroll"]').mCustomScrollbar("destroy").mCustomScrollbar()
					};
				l.load(f.urls.gameInfo, "getGameInfo", function(e) {
					f.game2ListAll = e, t.gameInfoDataInit(f.game2ListAll[s.gamecfgid]), i()
				}, function() {}, "", !0)
			},
			gameJoinReq: function() {
				var e = this,
					t = this.doms,
					s = h.localStorageGet("gamePublishPush"),
					n = function(s) {
						var i;
						switch (t.gameWarp.find('[data-tag="loading-warp"]').remove(), parseInt(s.error, 10)) {
						case 0:
							t.gameWarp.find('[data-tag="game-join-btn"]').addClass("third-games-btn-disabled").text("报名成功"), e.gamePlayingAppend({
								stateData: {
									gameState: "gamePlaying",
									triggerType: "stepBtn"
								},
								pushData: s.data
							});
							break;
						case 12:
							i = "人数已满", e.gameRemainPopAppend({
								data: "memberFull"
							}), t.gameWarp.find('[data-tag="game-join-btn"]').addClass("third-games-btn-disabled").text(i);
							break;
						case 207:
						case 211:
						case 13:
							i = "稍后再试", e.gameRemainPopAppend({
								data: "joinError"
							});
							break;
						case 283:
							i = "鱼翅不足";
							var n = e.nowGameCostType;
							2 === +n ? a.trigger("mod.gift.draw.fish.dialog") : e.gameRemainPopAppend({
								data: "gameRecharge"
							});
							break;
						default:
							i = "稍后再试", e.errorDialog({
								title: s.msg
							})
						}
					};
				t.gameWarp.append(m.gameLoadingRender({
					data: {
						title: "努力报名中..."
					}
				})), h.getCSRFCookie(i, function(e) {
					var t = {
						instId: s.gameid,
						roomId: f.room_id
					};
					t[e.name] = e.val, h.requestData({
						url: f.urls.gameJoin,
						type: "POST",
						data: t
					}, n)
				})
			},
			gameEndResultAppend: function(e) {
				var t = this,
					a = this.doms,
					s = e.stateData,
					i = e.pushData;
				return "object" !== h.returnType(i) ? void t.gameContentAgent({
					triggerType: "stepBtn",
					gameState: "gameList"
				}) : (a.gameWarp.find('[data-tag="game-playing-warp"]').remove(), t.anchorCheck && t.game2DpConfig({
					dpType: "dys.room.normal.show.anchor.inavgame.continue"
				}), a.gameContent.html(m.gameEndResultRender(i)), clearInterval(f.game2WaitTimer), a.gameWarp.find('[data-tag="game-wait-time"]').text("-- : --"), t.gameStepState(s), a.gameWarp.find('[data-tag="game-over-scroll"]').mCustomScrollbar("destroy").mCustomScrollbar(), void(t.anchorCheck || h.localStorageRemove("gameProgress")))
			},
			gameRemainPopAppend: function(e) {
				var t = this.doms;
				t.gameWarp.append(m.gameRemainPopRender(e))
			},
			gameHeadStatus: function(e) {
				var t = this.doms,
					a = e;
				return a ? "played" == e.status ? void t.gameWarp.find('[data-tag="game-status-header"]').hide() : void(a.member > 0 ? (t.gameWarp.find('[data-tag="game-wait-status"]').show(), t.gameWarp.find('[data-tag="gameing-stauts"]').hide(), t.gameWarp.find('[data-tag="header-status-text"]').html(" 未开始游戏将自动取消")) : (t.gameWarp.find('[data-tag="game-wait-status"]').hide(), t.gameWarp.find('[data-tag="gameing-stauts"]').show())) : void 0
			},
			sendGameReq: function(e) {
				var t = this,
					s = this.doms,
					n = function(i) {
						s.gameWarp.find('[data-tag="loading-warp"]').remove(), 0 == i.error ? (s.gameWarp.find('[data-tag="game-list-item"][data-gid="' + e.gameId + '"]').addClass("has-sent").find('[data-tag="send-game-req"]').text("已发送给主播"), a.trigger("mod.chat.msg.msg", m.gamePushMsgRender({
							type: "sendPlayMsg",
							pushData: {
								userInfo: {
									name: d.get("sys.nickname")
								}
							},
							gameInfoData: f.game2ListAll[e.gameId]
						}))) : t.errorDialog({
							title: i.msg
						})
					};
				s.gameWarp.append(m.gameLoadingRender({
					data: {
						title: "发送中..."
					}
				})), h.getCSRFCookie(i, function(t) {
					var a = {
						gameId: e.gameId,
						roomId: f.room_id
					};
					a[t.name] = t.val, h.requestData({
						url: f.urls.sendPlay,
						type: "POST",
						data: a
					}, n)
				})
			},
			clearGamePush: function() {
				for (var e = this.doms, t = this, a = ["gamePublishPush", "gamePlayingPush", "gamePublishID", "gameJoinListPush", "gameOwnerJoined", "gameReadyPush", "gameStartPush"], s = 0; s < a.length; s++) h.localStorageRemove(a[s]);
				e.enterBtn && e.enterBtn.data({
					triggerType: "enterBtn",
					state: ""
				}), t.anchorCheck || (h.localStorageRemove("gameInfoData"), h.localStorageRemove("gameProgress"), h.localStorageRemove("gameSetData"))
			},
			resetGameState: function(e) {
				for (var t = this.doms, a = this, s = ["gameProgress", "gamePublishPush", "gamePlayingPush", "gamePublishID", "gameJoinListPush", "gameOwnerJoined", "gameReadyPush", "gameStartPush"], i = 0; i < s.length; i++) h.localStorageRemove(s[i]);
				if (a.anchorCheck || h.localStorageRemove("gameSetData"), t.enterBtn && t.enterBtn.data({
					triggerType: "enterBtn",
					state: ""
				}), "object" === h.returnType(e)) switch (e.type) {
				case "close":
					h.localStorageRemove("gameSetData");
					break;
				case "cancel":
				}
			},
			gameBoxSwitch: function(e) {
				var t = this.doms;
				"open" === e.state ? t.gameWarp.show() : "close" === e.state && (t.gameWarp.hide(), t.gameContent.empty())
			},
			gameFrameState: function(e) {
				var t = this,
					a = this.doms,
					s = e,
					i = h.returnGameInfoData(),
					n = a.gameWarp.find('[data-tag="game-page-title"]');
				if (s.title ? ("object" === h.returnType(s.title) ? t.anchorCheck ? "gameName" === s.title.anchor ? n.text(i.name) : n.text(s.title.anchor) : n.text(s.title.user) : n.text(s.title), a.gameWarp.find('[data-tag="game-page-title"]').show()) : a.gameWarp.find('[data-tag="game-page-title"]').hide(), s.backBtn ? a.gameWarp.find('[data-tag="game-back-btn"]').show().find("span").text(s.backBtn) : a.gameWarp.find('[data-tag="game-back-btn"]').hide(), s.recordBtn && t.anchorCheck ? a.gameWarp.find('[data-tag="game-record-btn"]').show() : a.gameWarp.find('[data-tag="game-record-btn"]').hide(), s.headStatus ? a.gameWarp.find('[data-tag="game-status-header"]').show() : a.gameWarp.find('[data-tag="game-status-header"]').hide(), s.rightBtn) {
					if ("array" === h.returnType(s.rightBtn)) {
						a.gameWarp.find('[data-tag="game-cancel-btn"]').hide(), a.gameWarp.find('[data-tag="game-view-close"]').hide();
						for (var r = 0; r < s.rightBtn.length; r++) {
							if ("game-cancel-btn" === s.rightBtn[r]) {
								if (!t.anchorCheck) continue;
								if ("gamePlayed" == s.state) continue
							}
							a.gameWarp.find('[data-tag="' + s.rightBtn[r] + '"]').show()
						}
					}
					a.gameRightBtn.show()
				} else a.gameRightBtn.hide();
				t.gameBoxSwitch({
					state: "open"
				}), a.gameContent.find(".third-games-content").mCustomScrollbar("destroy").mCustomScrollbar()
			},
			gameInfoDataInit: function(e) {
				f.gameInfoData = e, h.localStorageSet({
					name: "gameInfoData",
					params: e,
					expired: -1
				})
			},
			localGameSetData: function(t) {
				var a = this.doms,
					s = h.returnGameInfoData();
				if ("object" === h.returnType(t.pushGameSetData)) f.gameSetData.setPrice = t.pushGameSetData.price, f.gameSetData.setMember = parseInt(t.pushGameSetData.limit, 10), f.gameSetData.setAutoStart = parseInt(t.pushGameSetData.autoStart, 10), f.gameSetData.setDesc = t.pushGameSetData.desc;
				else {
					var i = a.gameWarp.find('.active[data-tag="set-game-price"]');
					f.gameSetData.setPrice = i.attr("data-id"), f.gameSetData.setMember = parseInt(a.gameWarp.find('.active[data-tag="set-game-member"]').attr("data-num"), 10), "object" === h.returnType(s) && parseInt(s.start_trigger, 10) ? f.gameSetData.setAutoStart = parseInt(a.gameWarp.find('.active[data-tag="game-start-auto"]').attr("data-switch"), 10) : f.gameSetData.setAutoStart = 1, "" != e.trim(a.gameWarp.find('[data-tag="game-remain-desc"]').val()) ? f.gameSetData.setDesc = a.gameWarp.find('[data-tag="game-remain-desc"]').val() : f.gameSetData.setDesc = f.defaultData.gameJoinDesc
				}
				h.localStorageSet({
					name: "gameSetData",
					params: f.gameSetData,
					expired: -1
				})
			},
			gameStepState: function(e) {
				var t, a = this,
					s = e.gameState,
					i = h.localStorageGet("gameProgress"),
					n = [];
				a.gameFrameState(f.gameStep[s]), "object" === h.returnType(i) && (n = i.historyProgress), t = f.notRecordList.some(function(t, a) {
					return t == e.triggerType
				}), t || n.push(s), h.localStorageSet({
					name: "gameProgress",
					params: {
						historyProgress: n,
						nowProgress: s
					}
				})
			},
			gameContentAgent: function(e) {
				var t, a, s = this,
					i = this.doms,
					n = h.localStorageGet("gameProgress");
				switch (s.gameFrameCheck(), e.triggerType) {
				case "stepBtn":
					t = e.gameState;
					break;
				case "enterGoTo":
					t = i.enterBtn.data("state"), i.enterBtn.data({
						triggerType: "enterBtn",
						state: ""
					});
					break;
				case "enterGameEnd":
					t = i.enterBtn.data("state");
					break;
				case "enterBtn":
					t = "object" === h.returnType(n) ? n.nowProgress : "null";
					break;
				case "userEnterBtn":
					t = "object" === h.returnType(n) ? n.nowProgress : "gameList";
					break;
				case "backBtn":
					"object" === h.returnType(n) ? (t = n.historyProgress[n.historyProgress.length - 2], a = n.historyProgress.pop(), h.localStorageSet({
						name: "gameProgress",
						params: {
							historyProgress: n.historyProgress,
							nowProgress: a
						}
					})) : t = "null";
					break;
				case "recordBtn":
				case "cancelBtn":
				default:
					t = e.gameState
				}
				switch (t) {
				case "gameList":
					s.gameListAppend({
						gameState: "gameList",
						triggerType: e.triggerType
					});
					break;
				case "gameSet":
				case "gameContinue":
				case "gameRestartPlay":
					s.gameSettingAppend({
						gameState: "gameSet",
						triggerType: e.triggerType
					});
					break;
				case "gamePlaying":
					s.gamePlayingAppend({
						stateData: {
							gameState: "gamePlaying",
							triggerType: e.triggerType
						},
						pushData: h.localStorageGet("gamePlayingPush")
					});
					break;
				case "gamePlayed":
					s.gamePlayingAppend({
						stateData: {
							gameState: "gamePlayed",
							triggerType: e.triggerType
						},
						pushData: h.localStorageGet("gamePlayingPush")
					});
					break;
				case "gameRestart":
					s.gameCancelAppend({
						cancelType: "timeOut",
						stateData: {
							gameState: "gameRestart",
							triggerType: "cancelBtn"
						}
					});
					break;
				case "gameJoin":
					s.gameJoinAppend({
						gameState: "gameJoin",
						triggerType: e.triggerType
					});
					break;
				case "gameEndResultAnchor":
					s.gameEndResultAppend({
						data: {
							Identity: f.defaultData.anchorTag
						},
						stateData: {
							gameState: "gameEndResultAnchor",
							triggerType: e.triggerType
						},
						pushData: h.localStorageGet("gameEndPush")
					});
					break;
				case "gameEndResultUser":
					s.gameEndResultAppend({
						data: {
							Identity: f.defaultData.userTag
						},
						stateData: {
							gameState: "gameEndResultUser",
							triggerType: e.triggerType
						},
						pushData: h.localStorageGet("gameEndPush") || f.gameResultD
					});
					break;
				case "gameCancel":
					s.gameFrameClose();
					break;
				case "gameRecord":
					s.gameRecordAppend({
						gameState: "gameRecord",
						triggerType: e.triggerType
					});
					break;
				case "gameClose":
					s.gameBoxSwitch({
						state: "close"
					}), "object" === h.returnType(h.localStorageGet("gamePublishPush")) ? h.localStorageGet("gamePublishPush").gameid == f.instId ? s.resetGameState({
						type: "close"
					}) : (i.enterBtn.data({
						triggerType: "enterBtn",
						state: ""
					}), h.localStorageRemove("gameProgress")) : s.resetGameState({
						type: "close"
					});
					break;
				default:
					s.gameListAppend({
						gameState: "gameList",
						triggerType: e.triggerType
					})
				}
			},
			flashGamePublish: function(t) {
				var a, s = this,
					i = this.doms,
					n = t;
				h.localStorageRemove("gameEndPush");
				var r = function() {
						if (f.gameId = n.gamecfgid, f.instId = n.gameid, a = f.game2ListAll[n.gamecfgid]) {
							var t = [n.price, n.currency].join("-");
							if (n.newAwards = a.awards[t], "array" !== h.returnType(n.newAwards) && (n.newAwards = []), n.owner_uid = d.get("sys.uid"), n.autoStart = n.autostart, e('[data-tag="game-publish-msg"]').css("cursor", "pointer"), h.localStorageSet({
								name: "gameInfoData",
								params: a
							}), "object" !== h.returnType(h.localStorageGet("gamePublishPush"))) if (h.localStorageSet({
								name: "gamePublishPush",
								params: n
							}), s.anchorCheck) s.gameFrameCheck(), h.localStorageSet({
								name: "gameOwnerJoined",
								params: 1
							}), s.localGameSetData({
								type: f.defaultData.anchorTag,
								pushGameSetData: n
							}), s.gameHeadStatus({
								member: n.limit - 1
							});
							else {
								if (s.gameEnterMsgAppend({
									gameInfoData: a,
									pubData: {
										roomId: f.room_id,
										game_desc: {
											remark: n.desc
										}
									},
									anchorInfo: f.anchorInfo,
									curRoom: 1
								}), s.localGameSetData({
									type: f.defaultData.userTag,
									pushGameSetData: n
								}), clearTimeout(f.gameCloseSetTime), "object" !== h.returnType(i.gameWarp) || i.gameWarp.is(":hidden")) return;
								if (i.gameWarp.find('[data-tag="game-end-timer"]') && i.gameWarp.find('[data-tag="game-end-timer"]').length > 0) return;
								s.gameJoinAppend({
									gameState: "gameJoin",
									triggerType: "enterStep"
								})
							}
						}
					};
				f.game2ListAll ? r() : l.load(f.urls.gameInfo, "getGameInfo", function(e) {
					f.game2ListAll = e, r()
				}, function() {}, "", !0)
			},
			flashGameJoin: function(e) {
				var t = this,
					s = this.doms,
					i = e,
					n = h.localStorageGet("gamePublishPush"),
					o = 0,
					c = [],
					l = !1,
					g = null;
				if (i.type === f.types.gameJoin) {
					if (i.user = r.decode(i.user), o = i.user.length, i.user.forEach(function(e) {
						var t = r.decode(e.value).too();
						t.uid == d.get("sys.uid") && (l = !0), i["new"] == t.uid && (g = t.name), c.push(t)
					}), a.trigger("mod.chat.msg.msg", m.gamePushMsgRender({
						type: "joinMsg",
						userName: g,
						gameName: "互动游戏"
					})), i.total = o, h.browserCheck().msie) return !1;
					if (l && t.gameHeadStatus({
						member: n.limit - o
					}), h.localStorageSet({
						name: "gameJoinListPush",
						params: i
					}), "object" !== h.returnType(s.gameWarp)) return;
					t.anchorCheck || i["new"] == d.get("sys.uid") && (f.instId = i.gameid, h.localStorageSet({
						name: "gameOwnerJoined",
						params: 1
					}))
				}
			},
			flashGameCancel: function(e) {
				var t, a = this,
					s = this.doms,
					i = e;
				if (a.gameFrameCheck(), s.gameWarp.find('[data-tag="loading-warp"]').remove(), a.anchorCheck) switch (s.gameWarp.find('[data-tag="game-cancel-warp"]').remove(), parseInt(i.cancelType, 10)) {
				case 5:
					a.game2DpConfig({
						dpType: "dys.room.normal.show.anchor.inavgame.overtime"
					}), a.gameCancelAppend({
						cancelType: "timeOut",
						stateData: {
							gameState: "gameRestart",
							triggerType: "cancelBtn"
						}
					}), a.gameEnterOpen(), s.enterBtn.data({
						triggerType: "enterStep",
						state: "",
						cancelType: "timeOut"
					}), a.resetGameState({
						type: "cancel"
					});
					break;
				case 8:
				case 11:
					a.gameCancelAppend({
						cancelType: "gameError",
						stateData: {
							gameState: "gameCancel",
							triggerType: "cancelBtn"
						}
					}), a.gameEnterOpen(), s.enterBtn.data({
						triggerType: "enterBtn",
						state: "gameList"
					});
					break;
				case 9:
					a.gameCancelAppend({
						cancelType: "gamePlayError",
						stateData: {
							gameState: "gameCancel",
							triggerType: "cancelBtn"
						}
					}), a.gameEnterOpen(), s.enterBtn.data({
						triggerType: "enterBtn",
						state: "gameList"
					});
					break;
				case 10:
					a.gameCancelAppend({
						cancelType: "gameStop",
						stateData: {
							gameState: "gameCancel",
							triggerType: "cancelBtn"
						}
					}), a.gameEnterOpen(), s.enterBtn.data({
						triggerType: "enterBtn",
						state: "gameList"
					})
				} else {
					switch (1 == h.localStorageGet("gameOwnerJoined") ? a.gameEnterOpen() : setTimeout(function() {
						"object" !== h.returnType(h.localStorageGet("gamePublishPush")) && a.gameFrameClose()
					}, 6e4), parseInt(i.cancelType, 10)) {
					case 10:
					case 4:
						t = "closeUP";
						break;
					case 5:
						t = "timeOut";
						break;
					case 9:
						t = "gamePlayError";
						break;
					case 8:
					case 11:
					default:
						t = "gameError"
					}
					if (s.enterBtn.data({
						triggerType: "enterStep",
						state: "gameCancel",
						cancelType: t
					}), 1 != h.localStorageGet("gameOwnerJoined") && ("object" !== h.returnType(s.gameWarp) || s.gameWarp.is(":hidden"))) return;
					a.gameCancelAppend({
						cancelType: t,
						stateData: {
							gameState: "gameCancel",
							triggerType: "cancelBtn"
						}
					}), a.resetGameState({
						type: "cancel"
					})
				}
				clearInterval(f.game2WaitTimer), s.gameWarp.find('[data-tag="game-wait-time"]').text("-- : --")
			},
			flashGameReady: function(e) {
				var t = this,
					a = this.doms,
					s = e;
				u.exe("js_gmrdy", r.encode([{
					name: "rid",
					value: d.get("room.room_id")
				}, {
					name: "uid",
					value: d.get("sys.uid")
				}, {
					name: "gameid",
					value: s.gameid
				}])), "object" !== h.returnType(h.localStorageGet("gameReadyPush")) && (t.gameHeadStatus({
					member: 0
				}), h.localStorageSet({
					name: "gameReadyPush",
					params: s
				}), a.gameWarp && !a.gameWarp.is(":hidden") || t.game2EnterAgent({
					type: "eClick"
				}))
			},
			flashGamePlay: function(e) {
				var t = this,
					a = this.doms,
					s = e;
				u.exe("js_gmst", r.encode([{
					name: "rid",
					value: d.get("room.room_id")
				}, {
					name: "uid",
					value: d.get("sys.uid")
				}, {
					name: "gameid",
					value: s.gameid
				}])), "object" !== h.returnType(h.localStorageGet("gameStartPush")) && (h.localStorageSet({
					name: "gameStartPush",
					params: s
				}), a.gameWarp && !a.gameWarp.is(":hidden") ? t.gameStepState({
					gameState: "gamePlayed",
					triggerType: "stepBtn"
				}) : t.game2EnterAgent({
					type: "eClick"
				}), t.gameHeadStatus({
					status: "played"
				}), t.anchorCheck && t.game2DpConfig({
					dpType: "dys.room.normal.show.anchor.inavgame.gamebegin"
				}))
			},
			flashGameEnd: function(t) {
				var s, i, n = this,
					o = this.doms,
					c = t,
					l = [],
					g = [],
					u = [];
				e('[data-tag="game-publish-msg"]').css("cursor", "inherit"), c.user = r.decode(c.user), c.user.forEach(function(e) {
					var t = r.decode(e.value).too();
					d.get("sys.uid") == t.uid && (i = !0), t.uid == c.win ? c.winUser = t : l.push(t)
				}), c.user = l, c.owner_uid = d.get("sys.uid"), c.winIndex = 0, c.wins = r.decode(c.wins), c.wins.forEach(function(e, t) {
					u.push(e.value);
					for (var a = 0; a < c.user.length; a++) e.value == c.user[a].uid && g.push(c.user[a]);
					e.value == d.get("sys.uid") && (c.winIndex = t + 1)
				}), c.wins = u, c.winerUser = g, a.trigger("mod.chat.msg.msg", m.gamePushMsgRender({
					type: "winMsg",
					winUserInfo: c.winerUser[0]
				})), s = {
					identity: n.anchorCheck ? f.defaultData.anchorTag : f.defaultData.userTag,
					pushData: c,
					gameAwardRank: f.defaultData.gameAwardRank,
					gameInfoData: h.returnGameInfoData(),
					gamePubData: h.localStorageGet("gamePublishPush")
				}, h.localStorageSet({
					name: "gameEndPush",
					params: s
				}), f.gameResultD = s, n.gameFrameCheck();
				var p = function() {
						if (o.gameWarp.find('[data-tag="game-end-timer-warp"]').remove(), "object" !== h.returnType(h.localStorageGet("gameEndPush"))) {
							if (n.anchorCheck) return;
							c = f.gameResultD
						}
						n.anchorCheck ? n.gameContentAgent({
							triggerType: "stepBtn",
							gameState: "gameEndResultAnchor"
						}) : i && (n.gameContentAgent({
							triggerType: "stepBtn",
							gameState: "gameEndResultUser"
						}), o.enterBtn.data({
							triggerType: "enterGameEnd",
							state: "gameEndResultUser"
						}), f.gameCloseSetTime = setTimeout(function() {
							if (("object" === h.returnType(h.localStorageGet("gameEndPush")) || "object" === h.returnType(f.gameResultD)) && "object" === h.returnType(h.localStorageGet("gamePublishPush"))) {
								if (f.gameResultD = "", h.localStorageGet("gamePublishPush").gameid != f.instId) return;
								n.gameFrameClose()
							}
							f.gameResultD = ""
						}, 6e4))
					};
				i ? (o.gameWarp.append(m.gameEndTimer()), h.countTimer({
					type: "second",
					time: 5,
					ele: o.gameWarp.find('[data-tag="game-end-timer"]'),
					callback: p
				})) : p()
			},
			flashPushTrigger: function() {
				var t = this;
				u.reg("room_data_login", function(e) {
					var t = r.decode(e).too();
					t.type == f.types.userConnected && (f.userConnectStatus = !0)
				}), u.reg("room_data_handler", function(s) {
					var i = r.decode(s).too(),
						n = h.localStorageGet("gamePublishPush");
					switch (i.type) {
					case f.types.gameStart:
						"object" === h.returnType(n) ? n.instId != i.gameid && ("object" === h.returnType(h.localStorageGet("gameEndPush")) && (f.gameResultD = h.localStorageGet("gameEndPush")), t.resetGameState(), t.flashGamePublish(i)) : t.flashGamePublish(i);
						break;
					case f.types.gameJoin:
						"object" === h.returnType(n) && n.gameid == i.gameid ? t.flashGameJoin(i) : t.resetGameState();
						break;
					case f.types.gameCancel:
						"object" === h.returnType(n) && n.gameid == i.gameid && (e('[data-tag="game-publish-msg"]').css("cursor", "inherit"), t.flashGameCancel(i));
						break;
					case f.types.gameReady:
						"object" === h.returnType(n) && n.gameid == i.gameid && t.flashGameReady(i);
						break;
					case f.types.gamePlay:
						"object" === h.returnType(n) && n.gameid == i.gameid && t.flashGamePlay(i);
						break;
					case f.types.gameEnd:
						"object" === h.returnType(n) && n.gameid == i.gameid && t.flashGameEnd(i), i.gameid == f.instId && h.localStorageRemove("gameProgress");
						break;
					case f.types.gameSend:
						i.userInfo = r.decode(i.user).too(), a.trigger("mod.chat.msg.msg", m.gamePushMsgRender({
							type: "sendPlayMsg",
							pushData: i,
							gameInfoData: f.game2ListAll[i.gamecfgid]
						}))
					}
				})
			},
			game2DpConfig: function(e) {
				var t = h.localStorageGet("gameSetData");
				e && e.dpType && "object" === h.returnType(t) && a.trigger("dys", {
					key: e.dpType,
					prc_type: t.setPrice,
					join_num: t.setMember,
					a_on: t.setAutoStart,
					is_fill: t.setDesc == f.defaultData.gameJoinDesc ? 0 : 1,
					game_id: h.returnGameInfoData().gameid,
					game_name: h.returnGameInfoData().name
				})
			},
			gameEnterOpen: function() {
				var e = this,
					t = this.doms;
				t.gameWarp && !t.gameWarp.is(":hidden") || e.gameContentAgent({
					triggerType: t.enterBtn.data("triggerType"),
					gameState: t.enterBtn.data("state")
				})
			},
			gameFrameClose: function() {
				var e = this,
					t = this.doms;
				t.gameWarp.find('[data-tag="game-end-timer"]') && t.gameWarp.find('[data-tag="game-end-timer"]').length > 0 && (clearInterval(f.game2WaitTimer), t.gameWarp.find('[data-tag="game-end-timer-warp"]').remove()), h.localStorageRemove("gameEndPush"), e.gameBoxSwitch({
					state: "close"
				})
			},
			alertMsg: function(t, a, s, i) {
				var n = this,
					r = "";
				a = e.isFunction(a) ? a : function() {}, s = e.isFunction(s) ? s : function() {};
				try {
					switch (i) {
					case 4:
					case "succeed":
						r = "succeed";
						break;
					case 3:
						r = "error";
						break;
					case 2:
						r = "question";
						break;
					default:
						r = "warning"
					}
					e.dialog({
						lock: !0,
						content: t,
						icon: r,
						ok: function() {
							return a.call(n), !0
						},
						cancel: function() {
							s.call(n)
						}
					})
				} catch (o) {
					e.dialog.tips_black(t)
				}
			},
			eventBind: function() {
				var t = this,
					s = this.doms;
				s.enterBtn.on("click", function(i) {
					return h.eventDefault(i), s.enterTip && s.enterTip.fadeOut().remove(), h.browserCheck().msie ? void e.dy_dialog(m.browserWarningRender(), {
						mask: 1,
						width: "550px",
						className: "interactgame-updatedialog-wrap"
					}) : c.check() ? s.gameWarp && !s.gameWarp.is(":hidden") ? void t.gameBoxSwitch({
						state: "close"
					}) : void(t.anchorCheck ? (a.trigger("dys", {
						key: "dys.room.normal.click.anchor.inavgame",
						rid: f.room_id,
						tid: f.cate_id
					}), t.game2EnterAgent({
						type: "eClick"
					})) : (a.trigger("dys", {
						key: "dys.room.normal.click.viewer.inavgame"
					}), t.game2EnterAgent({
						type: "eClick"
					}))) : void c.show("login")
				}).on("click", ".third-games-guide-close", function() {
					return s.enterBtn.find('[data-tag="game-enter-tip"]').remove(), s.enterBtnWarp.trigger("mouseleave"), !1
				}).on("mouseenter", function() {
					t.anchorCheck || t.game2EnterAgent({
						type: "eHover"
					})
				}), s.enterBtnWarp.on("click", ".third-games-tip-close", function() {
					return s.enterBtnWarp.find('[data-tag="game-enter-msg"]').remove(), s.enterBtnWarp.trigger("mouseleave"), !1
				}).on("click", '[data-tag="game-enter-msg"]', function() {
					var i = e(this),
						n = i.data("rid"),
						r = i.data("gid"),
						o = i.data("cid");
					return i.remove(), h.browserCheck().msie ? void e.dy_dialog(m.browserWarningRender(), {
						mask: 1,
						width: "550px",
						className: "interactgame-updatedialog-wrap"
					}) : c.check() ? n == f.room_id ? (a.trigger("dys", {
						key: "dys.room.normal.click.viewer.remind_game",
						game_id: r,
						game_name: f.game2ListAll[r].name
					}), t.game2EnterAgent({
						type: "eClick"
					}), s.enterBtnWarp.trigger("mouseleave"), !1) : (a.trigger("dys", {
						key: "dys.room.normal.click.viewer.remind_room",
						game_id: r,
						game_name: f.game2ListAll[r].name,
						rid: n,
						tid: o
					}), void s.enterBtnWarp.trigger("mouseleave")) : void c.show("login")
				}), e('[data-type="chat-list"]').on("click", '[data-tag="game-publish-msg"]', function(a) {
					return "object" === h.returnType(h.localStorageGet("gamePublishPush")) && "pointer" == e(this).css("cursor") && t.gameEnterOpen(), !1
				})
			},
			eventBindAfter: function() {
				var t = this,
					s = this.doms;
				s.gameBoxSwitch.off("click"), s.gameBoxSwitch.on("click", function() {
					return a.trigger("dys", {
						key: "dys.room.normal.click.anchor.inavgame.close"
					}), t.gameFrameClose(), !1
				}), s.gameBackBtn.on("click", function(e) {
					h.eventDefault(e), t.gameContentAgent({
						triggerType: "backBtn"
					})
				}), s.gameWarp.off("click").on("click", ".third-games-selectgame dd", function() {
					var s = e(this).data("gid");
					if (t.anchorCheck) {
						if (h.localStorageRemove("gameSetData"), "object" !== h.returnType(f.game2ListAll[s])) return t.errorDialog({
							title: "未查到当前游戏"
						}), void t.enterCheck({
							type: "update"
						});
						t.gameInfoDataInit(f.game2ListAll[s]), a.trigger("dys", {
							key: "dys.room.normal.click.anchor.inavgame.sel",
							pos: e(this).index(),
							game_name: f.game2ListAll[s].name,
							game_id: s
						}), t.gameContentAgent({
							triggerType: "stepBtn",
							gameState: "gameSet"
						})
					}
					return !1
				}).on("click", '[data-tag="send-game-req"]', function(s) {
					h.eventDefault(s);
					var i = e(this).data("gid");
					e(this).closest('[data-tag="game-list-item"]').hasClass("has-sent") || (a.trigger("dys", {
						key: "dys.room.normal.click.viewer.send_play",
						game_name: f.game2ListAll[i].name,
						game_id: i
					}), t.sendGameReq({
						gameId: i
					}))
				}).on("click", '[data-tag="set-game-price"]', function() {
					var a, i;
					if (!e(this).hasClass("active")) {
						s.gameWarp.find('[data-tag="set-game-price"]').removeClass("active"), e(this).addClass("active"), i = s.gameWarp.find('[data-tag="set-game-member"].active').attr("data-num");
						var n = e(this).attr("data-num"),
							r = e(this).attr("data-type"),
							o = f.priceMap[r];
						return +r ? (a = h.formateNumber((i - 1) * n * .3, 2), s.gameWarp.find('[data-tag="game-profile-num"]').text(a), s.gameWarp.find('[data-tag="game-profile-cell"]').text(o)) : (s.gameWarp.find('[data-tag="game-profile-num"]').text(o), s.gameWarp.find('[data-tag="game-profile-cell"]').text("鱼翅")), 2 === +r ? s.gameWarp.find(".js-game2-1-gift-icon").addClass("game-fish-ball") : s.gameWarp.find(".js-game2-1-gift-icon").removeClass("game-fish-ball"), t.gamePriceAwardAppend(e(this).attr("data-id")), !1
					}
				}).on("click", '[data-tag="game-start-auto"]', function() {
					return s.gameWarp.find('[data-tag="game-start-auto"]').removeClass("active"), e(this).addClass("active"), !1
				}).on("click", '[data-tag="set-game-member"]', function(t) {
					var a, i;
					return s.gameWarp.find('[data-tag="set-game-member"]').removeClass("active"), e(this).addClass("active"), i = s.gameWarp.find('[data-tag="set-game-price"].active').attr("data-num"), a = h.formateNumber((e(this).attr("data-num") - 1) * i * .3, 2), s.gameWarp.find('[data-tag="game-profile-num"]').text(a), !1
				}).on("keyup", '[data-tag="game-remain-desc"]', function(t) {
					h.eventDefault(t);
					var a = e(this).val();
					a = a.replace(/(^\s*)/g, ""), a.length < 1 && e(this).val(a), s.gameWarp.find('[data-tag="game-remain-num"]').text(a.length >= 50 ? 50 : a.length), a.length >= 50 ? s.gameWarp.find('[data-tag="game-remain-num"]').addClass("active") : s.gameWarp.find('[data-tag="game-remain-num"]').removeClass("active")
				}).on("click", ".third-games-expand-icon", function() {
					var e = s.gameWarp.find('[data-tag="game-price-award"]');
					return e.hasClass("is-expand") ? e.removeClass("is-expand") : e.addClass("is-expand"), !1
				}).on("click", '[data-tag="game-publish-btn"]', function() {
					return t.gamePublishReq(), !1
				}).on("click", '[data-tag="game-cancel-btn"]', function() {
					return t.gameCancelPopAppend(), !1
				}).on("click", '[data-tag="game-join-btn"]', function() {
					return e(this).hasClass("third-games-btn-disabled") ? void 0 : (t.game2DpConfig({
						dpType: "dys.room.normal.click.viewer.inavgame.join"
					}), t.gameJoinReq(), !1)
				}).on("click", '[data-tag="game-list-goto"]', function() {
					return t.gameContentAgent({
						triggerType: "stepBtn",
						gameState: "gameList"
					}), !1
				}).on("click", '[data-tag="game-play-back"]', function() {
					return t.resetGameState({
						type: "close"
					}), t.gameContentAgent({
						triggerType: "stepBtn",
						gameState: "gameList"
					}), !1
				}).on("click", '[data-tag="game-record-btn"]', function() {
					return a.trigger("dys", {
						key: "dys.room.normal.click.anchor.inavgame.record"
					}), t.gameRecordAppend({
						gameState: "gameRecord",
						triggerType: "recordBtn"
					}), !1
				}).on("click", '[data-tag="game-republish-btn"]', function() {
					return t.gameContentAgent({
						triggerType: "stepBtn",
						gameState: "gameRestartPlay"
					}), a.trigger("dys", {
						key: "dys.room.normal.click.anchor.inavgame.republish"
					}), !1
				}).on("click", '[data-tag="game-cancel-confirm"]', function(e) {
					return t.game2DpConfig({
						dpType: "dys.room.normal.click.anchor.inavgame.cancle"
					}), t.gameCancelAppend({
						cancelType: "closeUP",
						stateData: {
							gameState: "gameCancel",
							triggerType: "cancelBtn"
						}
					}), !1
				}).on("click", '[data-tag="game-cancel-close"]', function() {
					return s.gameWarp.find('[data-tag="game-cancel-warp"]').fadeOut().remove(), !1
				}).on("click", '[data-tag="game-remain-btn"]', function() {
					return s.gameWarp.find('[data-tag="game-remain-warp"]').fadeOut().remove(), !1
				}).on("click", '[data-tag="game-play-again"]', function() {
					return t.resetGameState(), t.gameContentAgent({
						triggerType: "stepBtn",
						gameState: "gameSet"
					}), a.trigger("dys", {
						key: "dys.room.normal.click.anchor.inavgame.continue"
					}), !1
				}).on("click", '[data-tag="game-not-play"]', function() {
					return a.trigger("dys", {
						key: "dys.room.normal.click.anchor.inavgame.quit"
					}), h.localStorageRemove("gameEndPush"), t.resetGameState({
						type: "close"
					}), t.gameBoxSwitch({
						state: "close"
					}), !1
				}).on("click", '[data-tag="game-end-goto"]', function(e) {
					h.eventDefault(e), clearInterval(f.game2WaitTimer), s.gameWarp.find('[data-tag="game-end-timer-warp"]').remove(), t.anchorCheck ? t.gameEndResultAppend({
						data: {
							Identity: f.defaultData.anchorTag
						},
						stateData: {
							triggerType: "stepBtn",
							gameState: "gameEndResultAnchor"
						},
						pushData: h.localStorageGet("gameEndPush")
					}) : (s.enterBtn.data({
						triggerType: "enterBtn",
						state: ""
					}), t.gameEndResultAppend({
						data: {
							Identity: f.defaultData.userTag
						},
						stateData: {
							triggerType: "stepBtn",
							gameState: "gameEndResultUser"
						},
						pushData: h.localStorageGet("gameEndPush") || f.gameResultD
					}), f.gameResultD = "")
				})
			}
		};
	return v
}), define("douyu/page/room/normal/mod/anchor-like", ["jquery", "shark/util/lang/1.0", "shark/util/template/1.0", "douyu/context", "douyu/com/insight", "douyu/com/imgp", "shark/observer"], function(e, t, a, s, i, n, r) {
	var o = {
		url: "/lapi/member/authorAbout/getAuthorLike",
		roomId: s.get("room.room_id"),
		maxItem: 6,
		$anchorLike: e("#js-anchor-like")
	},
		d = function() {
			var n = function(e) {
					return e ? e.indexOf("#") > -1 || e.indexOf("javascript") > -1 ? "" : e.substring(e.lastIndexOf("/") + 1) : ""
				},
				d = function(s) {
					var i, d, c;
					return i = t.string.join("<% var _index = 1; %>", "<% for (var key in list) { %>", "<% if ( _index <= maxLength) { %>", "<% var item = list[key]; %>", '<li class="live" data-point-2="<%= _index %>">', '<a href="/<%= key %>" data-rt="<%= item.ranktype%>" data-sub_rt="<%= item.recomType%>" data-rpos="<%= item.rpos%>" target="_blank" title="<%= item.name %>" >', '<div class="live-preview">', '<img src="<%= item.room_src %>" />', '<b class="border"></b>', "</div>", '<div class="live-details">', '<h3 class="live-title"><%= item.name %></h3>', '<p class="live-category">分类：<%= item.game_name %></p>', '<p class="live-anchor">主播：<%= item.nickname %></p>', "</div>", "</a>", "</li>", "<% _index++; %>", "<% } %>", "<% } %>"), d = a.compile(i), (c = d({
						list: s,
						maxLength: o.maxItem
					})) ? (o.$anchorLike.show().html(c), void o.$anchorLike.on("mousedown", "a", function() {
						var t = e(this),
							a = t.closest("li");
						r.trigger("dys", {
							key: "dys.room.anchorLike.click",
							pos: a.index() + 1,
							rid: n(t.attr("href")),
							tid: 0,
							rt: t.data("rt"),
							sub_rt: t.data("sub_rt"),
							rpos: t.data("rpos")
						})
					})) : void o.$anchorLike.hide()
				},
				c = function(e) {
					var t, a, s = [];
					for (a in e) s.push(a);
					t = s.length;
					for (var i = 0; t > i; i++) r.trigger("dys", {
						key: "dys.room.anchorLike.show",
						pos: i + 1,
						rid: s[i],
						tid: 0,
						rt: e[s[i]].ranktype,
						sub_rt: e[s[i]].recomType,
						rpos: e[s[i]].rpos || 0
					})
				};
			i.build({
				selectors: "#js-anchor-like",
				appear: function() {
					e.ajax({
						url: o.url,
						type: "GET",
						dataType: "json",
						data: {
							userId: s.get("sys.uid") || s.get("room.device_id"),
							roomId: o.roomId
						},
						success: function(e) {
							d(e), c(e)
						},
						error: function() {
							o.$anchorLike.hide()
						}
					})
				}
			})
		};
	e(d)
}), define("douyu/page/room/normal/mod/gift/controller/geetest", ["jquery", "shark/class", "shark/observer"], function(e, t, a) {
	var s = {
		type: null,
		fast: {
			idpre: "gt-captcha-",
			count: 0
		}
	},
		i = t({
			init: function(t) {
				this.config = e.extend(!0, {}, {
					target: null
				}, t), this.render()
			},
			nextId: function() {
				return s.fast.idpre + ++s.fast.count
			},
			getResult: function() {
				return this.config.result
			},
			check: function(e) {
				this.buildAsync(e)
			},
			render: function() {
				this.config.$tar = e(this.config.target), this.config.$el = this.config.$tar.find(".captcha-gt")
			},
			build: function(e) {
				var t = this.nextId(),
					a = this,
					s = "zh-cn",
					i = {},
					n = this.config.success,
					r = this.config.error;
				return "en" === $SYS.lang && (s = $SYS.lang), this.config.$el.html('<div id="' + t + '"></div>'), this.config.result = null, i = {
					gt: e.gt,
					challenge: e.challenge,
					offline: !e.success,
					new_captcha: !0,
					product: "float",
					lang: s
				}, window.initGeetest ? void window.initGeetest(i, function(e) {
					e.appendTo("#" + t), e.onSuccess(function() {
						a.config.result = a.plugin.getValidate(), n(a.config.result)
					}), e.onError(function() {
						a.config.result = null, r()
					}), a.plugin = e
				}) : void r()
			},
			buildAsync: function(e) {
				var t = this,
					a = location.protocol;
				require.use([a + "//static.geetest.com/static/tools/gt.js"], function() {
					t.build(e)
				})
			},
			refresh: function() {
				this.plugin.reset(), this.config.result = null
			},
			show: function() {
				this.config.$el.show()
			},
			hide: function() {
				this.config.$el.hide()
			},
			destroy: function() {
				this.plugin.destroy()
			}
		}),
		n = {
			init: function(e, t, a, n) {
				var r = new i({
					target: e,
					product: "float",
					success: a ||
					function() {},
					error: n ||
					function() {}
				});
				return r.check(t), {
					refresh: function() {
						r.refresh()
					},
					isFast: function() {
						return "fast" === s.type
					},
					getFastResult: function() {
						return r.getResult()
					},
					destroy: function() {
						return r.destroy()
					}
				}
			}
		};
	return n
}), define("douyu/page/room/normal/mod/yz-pk-treasure", ["jquery", "shark/observer", "douyu/context", "douyu/com/user", "douyu/page/room/base/api", "douyu/page/room/normal/mod/gift/controller/geetest"], function(e, t, a, s, i, n) {
	var r = {
		init: function() {
			this.config = {
				treasureId: 1,
				isInitGeeDom: !1,
				geeFn: null,
				timer: null
			}, e("body").append('<div class="pk-treasure-verify" id="pk-treasure-verify"><div class="captcha-gt"></div></div>'), this.doms = {
				$chatContent: e("#js-chat-cont"),
				$geeContent: e(".pk-treasure-verify")
			}, this.initSocket()
		},
		initSocket: function() {
			var e = this;
			i.reg("room_pk_treasure", function(t) {
				var a = +t || 1;
				return e.config.treasureId = a, s.check() ? (i.exe("js_exitFullScreen"), void e.drawTreasure()) : void s.show("login")
			})
		},
		drawTreasure: function(t) {
			var s = this,
				i = e.extend(!0, {
					room_id: a.get("room.room_id"),
					device_id: a.get("room.device_id"),
					packerid: s.config.treasureId || 1,
					version: 1
				}, t);
			e.ajax({
				url: "/member/task/redPacketReceive",
				type: "POST",
				dataType: "json",
				data: i,
				error: function() {
					s.toggleGeeView(0), s.showDrawTips({
						code: 1
					}, "Normal")
				},
				success: function(e) {
					s.response(e)
				}
			})
		},
		response: function(e) {
			var t = e.geetest || {},
				a = this;
			1 === e.validate || -2 === parseInt(e.code, 10) ? 0 === parseInt(t.code, 10) ? (a.config.geeFn ? a.config.geeFn.refresh() : a.config.geeFn = n.init("#pk-treasure-verify", JSON.parse(t.validate_str), function(e) {
				a.drawTreasure(e)
			}, function() {
				a.showDrawTips({
					code: 1
				}, "Normal"), a.toggleGeeView(0), a.config = null
			}), a.toggleGeeView(1), clearTimeout(a.config.timer), a.config.timer = setTimeout(function() {
				a.toggleGeeView(0)
			}, 6e4)) : (a.showDrawTips(e, "Normal"), a.toggleGeeView(0)) : (a.toggleGeeView(0), a.showDrawTips(e, "Normal"))
		},
		showDrawTips: function(a, s) {
			var i = "",
				n = this.doms,
				r = 0,
				o = "",
				d = [];
			switch (e(".peck-back-tip") && e(".peck-back-tip").length ? e(".peck-back-tip").remove() : "", s) {
			case "Normal":
				if (0 !== parseInt(a.code, 10) || 0 === parseInt(a.silver, 10) && 0 === parseInt(a.prop_count, 10)) i = e('<div class="peck-back-tip peck-back-error"><p><span>运气不佳，宝箱已被洗劫一空T_T</span></p></div>'), this.appendTips(i);
				else if (2 === parseInt(a.award_type, 10)) i = e('<div class="peck-back-tip peck-back-success"><p><span>恭喜您，领取了</span></p><p><strong>' + a.prop_count + "个" + a.prop_name + "</strong><span>~</span></p></div>"), this.appendTips(i),insertData(i);
				else if (parseInt(a.lk, 10)) e(".treasure-luckuser-tips") && e(".treasure-luckuser-tips").length ? e(".treasure-luckuser-tips").remove() : "", i = e('<div class="treasure-luckuser-tips"><span class="best"></span></div>'), n.$chatContent.append(i), i.delay(1500).fadeOut(400, function() {
					i.remove()
				});
				else if (parseInt(a.lt, 10) > 0) {
					for (e(".treasure-luckuser-tips") && e(".treasure-luckuser-tips").length ? e(".treasure-luckuser-tips").remove() : "", d = a.lt.toString().split(""), r; r < d.length; r++) o += '<span class="rate' + d[r] + '"></span>';
					i = e('<div class="treasure-luckuser-tips"><span class="bouns"></span><span class="multiply"></span>' + o + "</div>"), n.$chatContent.append(i), i.delay(1500).fadeOut(400, function() {
						i.remove()
					})
				} else i = e('<div class="peck-back-tip peck-back-success"><p><span>恭喜您，领取了</span></p><p><strong>' + a.silver + "个鱼丸</strong><span>~</span></p></div></div>"), this.appendTips(i),insertData(i);
			}
			a.silver_balance && t.trigger("mod.userinfo.change", {
				current: {
					silver: a.silver_balance
				}
			})
		},
		appendTips: function(e) {
			var t = this.doms;
			t.$chatContent.append(e), e.fadeIn(400).delay(3e3).fadeOut(400, function() {
				e.remove()
			}), i.exe("js_pk_treasure_result", this.config.treasureId)
		},
		toggleGeeView: function(e) {
			var t = this.doms;
			e ? t.$geeContent.show() : t.$geeContent.hide()
		}
	};
	return {
		init: function() {
			r.init()
		}
	}
}), define("douyu/com/com-pay", ["jquery", "shark/util/lang/1.0", "shark/util/template/2.0", "shark/util/storage/1.0", "shark/observer", "douyu/context", "douyu/com/user"], function(e, t, a, s, i, n, r) {
	var o = {
		getMaskTpl: function() {
			var e, s;
			return e = t.string.join('<div class="common-pay-mask" style="position: fixed; z-index: 9999; top: 0; left: 0; right: 0; bottom: 0;background: rgba(0, 0 , 0, .6); text-align: center; margin: auto;">', '<div style="position: relative;display: inline-block; width: 712px; height: 542px; border:none; vertical-align: middle; border-radius: 5px;">', '<a class="close J_pay_iframe_close" href="javascript:;" style="position: absolute;right: 10px;top: 2px; padding: 0px 10px;cursor: pointer;z-index: 5;">', '<em style="display: inline-block;font-size: 30px;color: #fff;font-weight: 400;">×</em>', "</a>", '<iframe style="position: relative;display: inline-block; width: 712px; height: 542px; border-radius: 5px; vertical-align: middle;" id="login-passport-frame" scrolling="no" frameborder="0" src="{{ url }}"></iframe>', "</div>", '<div class="common-pay-holder" style="display: inline-block;vertical-align: middle;height: 100%;width: 1px;visibility: hidden;"></div>', "</div>"), s = a.compile(e)
		},
		init: function() {
			var t = n.get("sys.pay_site_host").replace(/^http(s?):/, "").replace(/\/$/g, ""),
				a = this;
			a.regShowPayInfo(), e("body").on("click", '[data-pay="iframe"]', function() {
				return a.showIframePay(), !1
			}), e("body").on("click", ".J_pay_iframe_close", function() {
				e(".common-pay-mask").remove()
			}), window.addEventListener("message", function(e) {
				var a = {};
				e.origin && e.origin.replace(/^http(s?):/, "").replace(/\/$/g, "") === t && (a = JSON.parse(e.data), "iframepay" === a.type.toString() && i.trigger("mod.userinfo.change", {
					current: {
						gold: a.num
					}
				}))
			}, !1)
		},
		regShowPayInfo: function() {
			var e = this;
			i.on("room.com.show.iframe.pay", function() {
				e.showIframePay()
			})
		},
		showIframePay: function() {
			var t = this.getMaskTpl(),
				a = n.get("sys.pay_site_host").replace(/^http(s?):/, "").replace(/\/$/g, ""),
				s = e(".common-pay-mask");
			return r.check() ? (s.length && s.remove(), e("body").append(t({
				url: a + "/item/gold/iframe?pageCode=" + DYS.sub.getPageCode() + "&source=1"
			}))) : r.show("login"), !1
		}
	};
	return {
		init: function() {
			o.init()
		}
	}
}), define("douyu/com/footer", ["jquery"], function(e) {
	function t() {
		return !!(window.ActiveXObject || "ActiveXObject" in window)
	}
	var a = {
		check: function() {
			var t = location.host,
				a = e("#footer-company-info-1"),
				s = e("#footer-company-info-2");
			a.hide(), s.hide(), "www.douyutv.com" === t ? a.show() : "www.douyu.com" === t && s.show()
		}
	},
		s = {
			print: function() {
				try {
					if (window.console && window.console.log) {
						var e = location.protocol;
						console.log("怀才不遇无处倾诉？\n快来斗鱼！JOIN US！\n我们重金悬赏各类有才之士，\n也包括优秀应届生哦！\n"), t() ? console.log("请将简历发送至 jobs@douyu.tv（邮件标题请以“姓名-应聘XX职位-来自console”命名）") : console.log("请将简历发送至 %c jobs@douyu.tv（邮件标题请以“姓名-应聘XX职位-来自console”命名）", "color:red"), console.log("职位介绍：" + e + "//www.douyu.com/cms/about/jobs.html#page3")
					}
				} catch (a) {}
			}
		},
		i = function() {
			a.check(), s.print()
		};
	e(i)
});