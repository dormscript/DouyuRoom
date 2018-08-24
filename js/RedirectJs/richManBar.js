console.log("I'm form%c richManBar.js","color:green");
function insertData(_data) {
	console.log(_data);
	window.postMessage({"insertSql": _data}, '*');
};
define("douyu-activity/richMan/richManBar", ["jquery", "shark/util/lang/1.0", "shark/util/template/2.0", "shark/util/storage/1.0", "shark/observer", "douyu/com/exjsonp", "douyu/com/user", "douyu/context", "douyu-activity/richMan/richManRank", "douyu/page/room/normal/mod/gift/controller/geetest", "douyu/com/get-gift-configs", "douyu/page/room/base/api", "shark/util/flash/data/1.0"], function(e, a, i, s, n, t, r, o, c, d, l, p, f) {
	var g, u, v, h, M = {
		rid: o.get("room.room_id"),
		avatar: o.get("room.avatar.middle"),
		ztPageUrl: "https://www.douyu.com/t/DouyuKing2018",
		configUrl: o.get("sys.webconfUrl") + "resource/act201807_w.json",
		configKey: "act201807",
		cppRes: "",
		phpConfig: "",
		medalConfig: "",
		isPendantMini: 0,
		isLoadMedalConfig: !1,
		isDistribData: !1,
		isPecking: !1,
		isPassGee: !0,
		isLoadConfig: !1,
		$Deferred: e.Deferred(),
		$medalDefer: e.Deferred(),
		pid: 0
	};
	return g = {
		containerRender: function() {
			var e, s;
			return e = a.string.join('<div class="RichMan">', '<div class="RichMan-switch"></div>', '<div class="RichMan-pendant">', '<div class="rM-slogan">', '<div class="rM-day rM-hide">--</div>', "</div>", '<div class="rM-pendant">', "</div>", '<div class="rM-geeContainer" id="rM-gee">', '<span class="rM-geeCls">×</span>', '<span class="rM-icon"></span>', '<p class="rM-geeTitle"><span class="rM-cff6700">验证通过</span>后可以获得宝箱礼物</p>', '<div class="rM-area">', '<div class="captcha-gt rM-captcha" id="rM-gee-captcha-gt"></div>', "</div>", "</div>", "</div>", '<div class="RichMan-rank">', "</div>", "</div>"), s = i.compile(e)
		},
		reRedner: function() {
			var e, s;
			return e = a.string.join("{{ if (stage == 1) }}", '<div class="rM-normalBg">', '<p class="rM-sTime rM-c6a2e00">{{ beginTime }}</p>', '<div class="rM-preIcon"></div>', '<a class="rM-link" href="' + M.ztPageUrl + '" target="_blank">查看详情</a>', "</div>", "{{ else }}", "{{ if (matchStatus == 2 && (endRanking >= 1 && endRanking <= 3)) }}", "{{ if (diaNum) }}", '<a class="rM-endTopBg" href="' + M.ztPageUrl + '" target="_blank">', "{{ else }}", '<a class="rM-smallBg marPx20" href="' + M.ztPageUrl + '" target="_blank">', "{{ /if }}", '<div class="rM-endRank top{{ endRanking }}">', '<img src="' + M.avatar + '">', "</div>", "{{ if (diaNum) }}", '<div class="rM-hasOccupy rM-c6a2e00">累计获得钻石</div>', '<div class="rM-diamondInfo">', '<i class="rM-diamond"></i>', '<span class="rM-c6a2e00">x{{ diaNum }}</span>', "</div>", "{{ else }}", '<div class="rM-diamondInfo"><span class="rM-empty"></span></div>', "{{ /if }}", "</a>", "{{ else if (matchStatus == 2) }}", "{{ if (diaNum) }}", '<a class="rM-endNormalBg" href="' + M.ztPageUrl + '" target="_blank">', "{{ else }}", '<a class="rM-smallBg" href="' + M.ztPageUrl + '" target="_blank">', "{{ /if }}", '<div class="rM-endRank normal">', '<img src="' + M.avatar + '">', "</div>", "{{ if (diaNum) }}", '<div class="rM-hasOccupy rM-c6a2e00">累计获得钻石</div>', '<div class="rM-diamondInfo">', '<i class="rM-diamond"></i>', '<span class="rM-c6a2e00">x{{ diaNum }}</span>', "</div>", "{{ else }}", '<div class="rM-diamondInfo"><span class="rM-empty"></span></div>', "{{ /if }}", "</a>", "{{ else }}", "{{ if (!isOccupy) }}", '<div class="rM-miniBg">', "{{ if (fansBg && fansName) }}", '<span class="rM-fansMedal" style="background-image:url({{ fansBg }})">', "<i>{{ fansName }}</i>", "</span>", "{{ else if (fansName) }}", '<span class="rM-fansMedal normal">', "<i>{{ fansName }}</i>", "</span>", "{{ /if }}", "{{ if (fansName) }}", '<span class="rM-hasOccupy rM-c6a2e00">本房未被占领</span>', "{{ else }}", '<span class="rM-hasOccupy rM-c6a2e00 marPx16">本房未被占领</span>', "{{ /if }}", "</div>", "{{ else }}", '<div class="rM-normalBg">', '<div class="rM-normalBg-blink"></div>', "{{ if (fansBg) }}", '<a href="{{ roomLink }}" target="_blank" class="rM-fansMedal" style="background-image:url({{ fansBg }})">', "{{ else }}", '<a href="{{ roomLink }}" target="_blank" class="rM-fansMedal normal">', "{{ /if }}", "<i>{{ fansName }}</i>", "</a>", '<div class="rM-vsInfo">', '<div class="rM-c6a2e00">已占领本房</div>', '<strong class="rM-cff5500 J_rM_holdtime">{{ occupyTime }}</strong>', "</div>", '<div class="rM-vsInfo marPx13 J_rM_toggle">', '<div class="rM-c6a2e00">已从本房征税</div>', '<strong class="rM-cff5500">{{ occupyVal }}</strong>', "</div>", '<div class="rM-vsInfo marPx13 J_rM_toggle rM-hide">', '<div class="rM-c6a2e00">当前征税比例</div>', '<strong class="rM-cff5500">{{ occupyRate }}</strong>', "</div>", "</div>", "{{ /if }}", '<div class="rM-taskBg">', "{{ if (isBeforeKing) }}", '<div class="rM-kingAvatar">', '<img src="' + M.avatar + '">', '<i class="rM-kingTitle">鲨鱼王</i>', "</div>", "{{ else }}", '<div class="rM-norAvatar">', '<img src="' + M.avatar + '">', "</div>", "{{ /if }}", '<div class="rM-detial marPx">', '<div class="rM-cfff">{{ nowHour }}点财富值榜</div>', "{{ if (isHotHour) }}", '<div class="rM-cffea00">黄金时段</div>', "{{ else }}", '<div class="rM-cccc">普通时段</div>', "{{ /if }}", "</div>", '<div class="rM-detial J_rM_toggle">', '<div class="rM-cfff">{{ hourRanking }}</div>', '<strong class="rM-cffea00">{{ hourVal }}</strong>', "</div>", '<div class="rM-detial rM-hide J_rM_toggle">', '<div class="rM-cfff">{{ hourDiffInfo[0] }}</div>', '<strong class="rM-cffea00">{{ hourDiffInfo[1] }}</strong>', "</div>", '<div class="rM-taskTitle rM-cfff">{{ nowHour }}~{{ nextHour }}点任务</div>', "{{ if (task1Status) }}", '<div class="rM-detial">', '<div class="rM-cfff">完成占领任务</div>', '<div class="rM-cfff">获得<i class="rM-diamond"></i> x{{ task1Status }}</div>', "</div>", "{{ else }}", '<div class="rM-detial marPx">', '<div class="rM-cfff">输出占领值</div>', '<strong class="rM-cffea00">{{ hourTask1Val }}</strong>', "</div>", "{{ /if }}", "{{ if (task2Status) }}", '<div class="rM-detial marPx">', '<div class="rM-cfff">完成征税任务</div>', '<div class="rM-cfff">获得<i class="rM-diamond"></i> x{{ task2Status }}</div>', "</div>", "{{ else }}", '<div class="rM-detial">', '<div class="rM-cfff">从外部征税</div>', '<strong class="rM-cffea00">{{ hourTask2Val }}</strong>', "</div>", "{{ /if }}", "</div>", "{{ /if }}", "{{ /if }}", "{{ if (treasureId && isShowTreasure) }}", '<div class="rM-treasure" data-pid="{{ treasureId }}">领取</div>', "{{ /if }}"), s = i.compile(e)
		},
		renderNewProp: function() {
			var e, s;
			return e = a.string.join("", '<div class="rM-newProp-wrap">', '<span class="rM-pop-close"></span>', '<img class="rM-prop-icon" src="{{ propIcon }}">', '<a href="' + M.ztPageUrl + '" target="_blank" class="rM-pop-link">活动详情</a>', "</img>"), s = i.compile(e)
		}
	}, v = {
		checkRoomStatus: function() {
			var e = M.phpConfig,
				a = e.blacklist || [],
				i = 0;
			return a.indexOf(M.rid) >= 0 && (i = 1), i
		},
		getBeginTime: function() {
			var e = M.phpConfig,
				a = e.begin_time || 0,
				i = "--月--日--点",
				s = 0;
			return a && (s = new Date(1e3 * a), i = s.getMonth() + 1 + "月" + s.getDate() + "日" + s.getHours() + "点"), i
		},
		getMatchStatus: function(e) {
			var a = +e,
				i = 1;
			return 1 === a && (i = 2), i
		},
		formateTime: function(e) {
			var a, i, s, n = "00:00:00",
				t = +e > 0 ? +e : 0;
			return t >= 3600 ? (a = parseInt(t / 3600, 10).toString(), i = parseInt(t % 3600 / 60, 10).toString(), s = parseInt(t % 3600 % 60, 10).toString()) : t >= 60 ? (a = "00", i = parseInt(t / 60, 10).toString(), s = parseInt(t % 60, 10).toString()) : (a = "00", i = "00", s = parseInt(t, 10).toString()), a = a.length > 1 ? a : "0" + a, i = i.length > 1 ? i : "0" + i, s = s.length > 1 ? s : "0" + s, n = a + ":" + i + ":" + s
		},
		handleRanking: function(e) {
			var a = +e || 0,
				i = "--";
			return i = -99 === a ? "排名：99+" : 0 >= a ? "未上榜" : "排名：" + a
		},
		handleHdiffInfo: function(e, a, i) {
			var s = +a || 0,
				n = +i || 0,
				t = e > 0 ? parseInt(e / 100, 10) : "--",
				r = M.phpConfig.hour_general_time_topn || 0,
				o = M.phpConfig.hour_best_time_topn || 0,
				c = "--",
				d = ["距第--名差", t];
			return c = 1 === s ? o : r, d = 1 === n ? ["领先第2名", t] : n > 1 && c >= n ? ["距上1名差", t] : ["距第" + c + "名差", t]
		},
		handleTaskVal: function(e, a) {
			var i = parseInt(e / 100, 10) || 0,
				s = parseInt(a / 100, 10) || 0;
			return s >= 1e4 && (s = parseInt(s / 1e4, 10) + "万"), i + "/" + s
		},
		getFansBg: function(e, a) {
			var i = +e,
				s = "",
				n = M.rid;
			return i ? s = M.medalConfig[i] && M.medalConfig[i].bg && M.medalConfig[i].bg[30] || "" : M.medalConfig[n] && (s = M.medalConfig[n] && M.medalConfig[n].bg && M.medalConfig[n].bg[30]), s
		},
		getNextHour: function(e) {
			var a = +e,
				i = "--";
			return a >= 0 && (i = a >= 23 ? 0 : a + 1), i
		},
		handleLink: function(e) {
			var a = +e,
				i = "javascript:;";
			return a !== M.rid && (i = "/" + a), i
		},
		checkTreasure: function(e) {
			var a = $SYS.uid || 0,
				e = s.get(a + "@" + e),
				i = 1;
			return e && (i = 0), i
		},
		handleGiftId: function(e) {
			var a, i, s = {},
				n = [],
				t = e.prop_list || [],
				r = 0,
				o = t.length;
			for (r; o > r; r++) a = t[r].gift_id, i = t[r].prop_id, s[a] = 1, n[i] = a;
			return e.giftList = s, e.propList = n, e
		},
		mergeData: function(e) {
			var a = {},
				i = e.type;
			switch (i) {
			case "preRes":
				a = {
					stage: 1,
					isBlackRoom: this.checkRoomStatus(),
					beginTime: this.getBeginTime()
				};
				break;
			case "jskpdt":
				a = {
					stage: 2,
					day: e.day || "--",
					isBlackRoom: this.checkRoomStatus(),
					matchStatus: this.getMatchStatus(e.review),
					endRanking: +e.fnlrank || 0,
					isOccupy: +e.occurid || 0,
					roomLink: this.handleLink(e.occurid),
					fansName: e.occuname || "",
					isShowTreasure: this.checkTreasure(e.tid),
					fansBg: this.getFansBg(e.occurid, e.occuname),
					occupyTime: this.formateTime(e.occuprd),
					occupyVal: +e.occutax >= 0 ? parseInt(e.occutax / 100, 10) : "--",
					occupyRate: +e.occurate >= 0 ? e.occurate + "%" : "--",
					nowHour: e.hour || "--",
					nextHour: this.getNextHour(e.hour),
					isHotHour: +e.tst,
					hourVal: e.sc > 0 ? parseInt(e.sc / 100, 10) : "--",
					hourRanking: this.handleRanking(e.hrank),
					hourDiffInfo: this.handleHdiffInfo(e.dsc, e.tst, e.hrank),
					hourTask1Val: this.handleTaskVal(e.tkoccuacc, e.tkoccureq),
					hourTask2Val: this.handleTaskVal(e.tktaxacc, e.tktaxreq),
					task1Status: +e.tkoccu,
					task2Status: +e.tktax,
					isBeforeKing: +e.king,
					diaNum: +e.diamond || 0,
					treasureId: +e.tid || 0
				}
			}
			return a
		}
	}, u = {
		init: function() {
			var a = e("body");
			this.tpls = {
				conatinerTpl: g.containerRender(),
				pendantTpl: g.reRedner(),
				newPropTpl: g.renderNewProp()
			}, a.append(this.tpls.conatinerTpl), this.doms = {
				$RM: e(".RichMan"),
				$rMpendant: e(".rM-pendant"),
				$rMslogan: e(".rM-slogan"),
				$rMday: e(".rM-day"),
				$geeContent: e(".rM-geeContainer"),
				$chatContent: e("#js-chat-cont")
			}, c.init(), this.bindEvent(), this.dataEntry()
		},
		bindEvent: function() {
			this.changePendant(), this.pendantMove(), this.checkPendantStatus(), this.infoToggle(), this.catchTreasure(), this.sendConfig(), this.hideNewPropTips()
		},
		hideNewPropTips: function() {
			e("body").on("click", ".rM-pop-close", function() {
				e(".rM-newProp-wrap").remove()
			}), e("#js-stats-and-actions").on("click", ".rM-sendGift-close", function() {
				e(".rM-sendGift-tips").remove()
			})
		},
		dataEntry: function() {
			this.regSocket(), this.loadConfig(), this.loadMedalConfig()
		},
		sendConfig: function() {
			var e = this;
			n.on("room.act.data.connect.richman07", function() {
				e.loadConfig().done(function() {
					n.trigger("room.act.data.config.send", {
						type: "richman",
						config: M.phpConfig
					})
				})
			})
		},
		checkPendantStatus: function() {
			var e = this.doms;
			M.isPendantMini = s.get("isRmMini") || 0, M.isPendantMini && (e.$RM.find(".RichMan-switch").addClass("is-close"), e.$rMday.addClass("rM-hide"), e.$rMslogan.addClass("is-close"), e.$rMpendant.addClass("is-close"))
		},
		regSocket: function() {
			var a = this;
			n.on("room.act.data.richman07", function(i) {
				"jskpdt" === i.type && (i.tid || (i.tid = 0), i.king || (i.king = 0), M.cppRes = e.extend(!0, M.cppRes, i), n.trigger("room.act.data.richman.bar07", i), a.readyConfig())
			}), p.reg("room_data_handler", function(i) {
				var n, t = f.decode(i).too(),
					r = s.get("richManProp") || 0,
					o = {},
					c = "";
				"npwarn" !== t.type || r || a.loadConfig().done(function() {
					t.nc > 0 && M.phpConfig.propList[t.pid] && l.getProp().done(function(i) {
						n = M.phpConfig.propList[t.pid], c = i[n].pc_full_icon, c && (o = {
							icon: c
						}, e("body").append(a.tpls.newPropTpl({
							propIcon: o.icon
						})), s.set("richManProp", 1, 864e3))
					})
				})
			})
		},
		loadMedalConfig: function() {
			return n.on("crazy.fans.config.data", function(e) {
				return M.isLoadMedalConfig = !0, M.medalConfig = e, M.$medalDefer.resolve(e)
			}), M.$medalDefer
		},
		loadConfig: function() {
			var a = this;
			return M.isLoadConfig ? M.$Deferred.resolve() : (t.load(M.configUrl, M.configKey, function(i) {
				var s = {},
					t = parseInt((new Date).getTime() / 1e3);
				M.isLoadConfig = !0, s = v.handleGiftId(i), M.phpConfig = s, t >= s.warm_time && t <= s.begin_time && (M.cppRes = e.extend(!0, {}, {
					type: "preRes"
				}), a.dataCenter(M.cppRes)), n.trigger("room.act.data.chatmsg", {
					sharkIcon: M.phpConfig.award_fans_pre_medal_pic.web,
					conquerIcon: M.phpConfig.award_conquer_medal_pic.web
				}), M.$Deferred.resolve(s)
			}), M.$Deferred)
		},
		readyConfig: function() {
			var e = this;
			M.isLoadConfig ? M.isLoadMedalConfig ? e.dataCenter(M.cppRes) : e.loadMedalConfig().done(function(a) {
				e.dataCenter(M.cppRes)
			}) : e.loadConfig().done(function() {
				M.isLoadMedalConfig ? e.dataCenter(M.cppRes) : e.loadMedalConfig().done(function(a) {
					e.dataCenter(M.cppRes)
				})
			})
		},
		dataCenter: function(a) {
			var i = v.mergeData(a),
				s = this.doms;
			i.isBlackRoom || (M.isDistribData || 2 !== i.stage || 1 !== i.matchStatus || (n.trigger("room.activity.richman.stage", {
				stage: 1,
				giftList: M.phpConfig.giftList
			}), e("#js-stats-and-actions").append('<div class="rM-sendGift-tips"><div class="rM-sendGift-close"></div>', "</div>"), M.isDistribData = !0), s.$rMpendant.html(this.tpls.pendantTpl(i)), s.$RM.show(), 1 === i.matchStatus ? (s.$rMslogan.addClass("is-begin"), s.$rMday.text("第" + i.day + "天"), M.isPendantMini ? s.$rMday.addClass("rM-hide") : s.$rMday.removeClass("rM-hide"), this.addOccupyTime()) : (s.$rMslogan.removeClass("is-begin"), s.$rMday.remove()))
		},
		addOccupyTime: function() {
			var a = M.cppRes.occuprd || 0,
				i = "--：--：--",
				s = e(".J_rM_holdtime");
			clearInterval(M.timer), M.timer = setInterval(function() {
				a++, i = v.formateTime(a), s && s.length && s.text(i)
			}, 1e3)
		},
		catchTreasure: function() {
			var a = this.doms,
				i = this;
			a.$RM.on("click", ".rM-treasure", function() {
				var a = e(this).data("pid");
				return r.check() ? (M.pid = a, void i.postRequest()) : void r.show("login")
			}), a.$RM.on("click", ".rM-geeCls", function() {
				i.toggleGeeView(0)
			})
		},
		postRequest: function(e) {
			return M.isPassGee ? void this.sendRequest(e) : (this.toggleGeeView(1), void(M.geeFn && M.geeFn.refresh()))
		},
		sendRequest: function(a) {
			var i = this,
				s = e.extend(!0, {
					room_id: o.get("room.room_id"),
					device_id: o.get("room.device_id"),
					packerid: M.pid || 0,
					version: 1
				}, a);
			M.isPecking || (M.isPecking = !0, e.ajax({
				url: "/member/task/redPacketReceive",
				type: "POST",
				dataType: "json",
				data: s,
				error: function() {
					M.isPecking = !1, e.dialog.tips_black("网络错误")
				},
				success: function(e) {
					M.isPecking = !1, i.response(e)
				}
			}))
		},
		response: function(e) {
			var a = e.geetest || {},
				i = this;
			1 === e.validate || -2 === parseInt(e.code, 10) ? 0 === parseInt(a.code, 10) ? (M.geeFn ? M.geeFn.refresh() : M.geeFn = d.init("#rM-gee", JSON.parse(a.validate_str), function(e) {
				i.sendRequest(e)
			}, function() {
				i.showDrawTips(1, "Normal")
			}), M.isPassGee = !1, i.toggleGeeView(1)) : (M.isPassGee = !0, i.storeGetTreausre(), i.showDrawTips(e, "Normal"), i.toggleGeeView(0)) : (M.isPassGee = !0, i.showDrawTips(e, "Normal"), i.storeGetTreausre(), i.toggleGeeView(0))
		},
		storeGetTreausre: function() {
			var e = $SYS.uid || 0;
			s.set(e + "@" + M.pid, 1, 3600)
		},
		showDrawTips: function(a, i) {
			var s = "",
				n = this.doms,
				t = 0,
				r = "",
				o = [];
			switch (e(".rM-treasure") && e(".rM-treasure").length ? e(".rM-treasure").hide() : "", e(".peck-back-tip") && e(".peck-back-tip").length ? e(".peck-back-tip").remove() : "", M.isPassGee = !0, i) {
			case "Normal":
				if (0 !== parseInt(a.code, 10) || 0 === parseInt(a.silver, 10) && 0 === parseInt(a.prop_count, 10)) s = e('<div class="peck-back-tip peck-back-error"><p><span>运气不佳，宝箱已被洗劫一空T_T</span></p></div>'), this.appendTips(s);
				else if (2 === parseInt(a.award_type, 10)) s = e('<div class="peck-back-tip peck-back-success"><p><span>恭喜您，领取了</span></p><p><strong>' + a.prop_count + "个" + a.prop_name + "</strong><span>~</span></p></div>"), this.appendTips(s),insertData(i);
				else if (parseInt(a.lk, 10)) e(".treasure-luckuser-tips") && e(".treasure-luckuser-tips").length ? e(".treasure-luckuser-tips").remove() : "", s = e('<div class="treasure-luckuser-tips"><span class="best"></span></div>'), n.$chatContent.append(s), s.delay(1500).fadeOut(400, function() {
					s.remove()
				});
				else if (parseInt(a.lt, 10) > 0) {
					for (e(".treasure-luckuser-tips") && e(".treasure-luckuser-tips").length ? e(".treasure-luckuser-tips").remove() : "", o = a.lt.toString().split(""), t; t < o.length; t++) r += '<span class="rate' + o[t] + '"></span>';
					s = e('<div class="treasure-luckuser-tips"><span class="bouns"></span><span class="multiply"></span>' + r + "</div>"), n.$chatContent.append(s), s.delay(1500).fadeOut(400, function() {
						s.remove()
					})
				} else s = e('<div class="peck-back-tip peck-back-success"><p><span>恭喜您，领取了</span></p><p><strong>' + a.silver + "个鱼丸</strong><span>~</span></p></div></div>"), this.appendTips(s),insertData(i);
			}
		},
		appendTips: function(e) {
			var a = this.doms;
			a.$chatContent.append(e), e.fadeIn(400).delay(3e3).fadeOut(400, function() {
				e.remove()
			})
		},
		toggleGeeView: function(e) {
			var a = this.doms;
			e ? (a.$geeContent.show(), a.$RM.find(".RichMan-rank").addClass("hide")) : (a.$geeContent.hide(), a.$RM.find(".RichMan-rank").removeClass("hide"))
		},
		changePendant: function() {
			var a = this.doms;
			a.$RM.on("click", ".RichMan-switch", function() {
				var i = e(this);
				i.toggleClass("is-close"), a.$rMslogan.toggleClass("is-close"), a.$rMpendant.toggleClass("is-close"), M.isPendantMini ? (M.isPendantMini = 0, a.$rMday.removeClass("rM-hide")) : (M.isPendantMini = 1, a.$rMday.addClass("rM-hide")), s.set("isRmMini", M.isPendantMini, 2592e3)
			})
		},
		pendantMove: function() {
			function a(a) {
				return e(document).bind({
					mousemove: i,
					mouseup: s
				}), !1
			}
			function i(e) {
				var a = e.clientY,
					i = n.height(),
					s = window.innerHeight;
				return M.isPendantMini ? (a -= 34, 0 >= a ? a = 0 : a > s - 68 && (a = s - 68)) : (a -= 48, 0 >= a || 0 > s - i ? a = 0 : a > s - i && (a = s - i)), n.css({
					top: a
				}), !1
			}
			function s() {
				e(document).unbind({
					mousemove: i,
					mouseup: s
				})
			}
			var n = e(".RichMan");
			n.on("mousedown", ".rM-slogan", a)
		},
		infoToggle: function() {
			var a = "";
			M.toggleTimer = setInterval(function() {
				a = e(".J_rM_toggle"), a && a.length && a.toggleClass("rM-hide")
			}, 4e3)
		}
	}, h = {
		init: function() {
			u.init()
		}
	}, {
		init: function() {
			h.init()
		}
	}
});