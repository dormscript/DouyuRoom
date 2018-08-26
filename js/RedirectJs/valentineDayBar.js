console.log("I'm form%c valentineDayBar.js","color:green");
function insertData(_data) {
	console.log(_data);
	window.postMessage({"insertSql": _data}, '*');
};
define("douyu-activity/valentineDay1807/valentineDayBar", ["jquery", "shark/util/lang/1.0", "shark/util/template/2.0", "shark/util/storage/1.0", "shark/observer", "douyu/com/exjsonp", "douyu/com/user", "douyu/context", "douyu/page/room/normal/mod/gift/controller/geetest", "shark/util/flash/data/1.0", "douyu-activity/valentineDay1807/rank"], function(e, s, t, a, i, n, l, r, o, c, d) {
	var v, g, p, f = {
		rid: r.get("room.room_id"),
		avatar: r.get("room.avatar.middle"),
		ztPageUrl: "https://www.douyu.com/t/doubleseven2018",
		configUrl: r.get("sys.webconfUrl") + "resource/common/activity/act201808_w.json",
		configKey: "act201808",
		cppRes: "",
		phpConfig: "",
		isPendantShow: !1,
		isPendantMini: 0,
		isPecking: !1,
		isPassGee: !0,
		isFirstRender: !0,
		$Deferred: e.Deferred(),
		isShowTips: a.get("qixiTips") === (new Date).getDate() ? 1 : 0,
		pid: 0,
		stage: 0,
		timer: null,
		toggleIndx: 0
	};
	return v = {
		containerRender: function() {
			var e, a;
			return e = s.string.join('<div class="valentine1807" data-target="container">', '<div class="valentine1807-switch" data-target="switch"></div>', '<div class="valentine1807-icon" data-target="slogan">', '<span class="valentine1807-logTitle">真情榜</span>', "</div>", '<div class="valentine1807-pendant-wrap" data-target="pendantContent">', '<div class="valentine1807-pendant" data-target="pendant">', "</div>", '<div class="valentine1807-geeContainer" id="valentine1807-gee">', '<span class="valentine1807-geeCls">×</span>', '<span class="valentine1807-geeIcon"></span>', '<p class="valentine1807-geeTitle"><span class="valentine1807-cff6700">验证通过</span>后可以获得宝箱礼物</p>', '<div class="valentine1807-area">', '<div class="captcha-gt valentine1807-captcha" id="valentine1807-gee-captcha-gt"></div>', "</div>", "</div>", "</div>", '<div class="valentine1807-rank">', "</div>", "</div>"), a = t.compile(e)
		},
		prePendantRender: function() {
			var e, a;
			return e = s.string.join("", '<div class="valentine1807-preBg">', '<span class="pre-time">{{ preTime }}</span>', '<strong class="pre-title">爱意闯情关</strong>', '<a class="pre-link" href="' + f.ztPageUrl + '" target="_blank">查看详情</a>', "</div>"), a = t.compile(e)
		},
		stage1PendantRender: function() {
			var e, a;
			return e = s.string.join("", "{{ if ((catchYlStatus == 1 && taskLevel[0] != 5) || (catchYlStatus == 2 && !hasDrawTrasure && pid && taskLevel[0] != 5)) }}", '<div class="valentine1807-levelInfo level-bg{{ level }}">', '<div class="level-title">{{ title }}</div>', '<div class="level-avatar"><img src="{{ anchorAvatar }}"></div>', '<div class="level-desc">当前境界</div>', '<div class="level-desc leve{{ level }}">{{ levelName }}</div>', "</div>", "{{ else }}", '<div class="valentine1807-levelInfo plus level-plus-bg{{ level }}">', '<div class="level-title">{{ title }}</div>', '<div class="level-avatar"><img src="{{ anchorAvatar }}"></div>', '<div class="level-desc">当前境界</div>', '<div class="level-desc leve{{ level }}">{{ levelName }}</div>', '<div class="marquee">', "{{ if (level <= 4) }}", '<span class="marquee-desc">以下四项均达成Lv{{ level + 1 }}可提升主播境界</span>', "{{ else }}", '<span class="marquee-desc min">主播已达成最高境界</span>', "{{ /if }}", "</div>", "</div>", "{{ /if }}", "{{ if (catchYlStatus == 1 && taskLevel[0] != 5) }}", '<div class="stage1-bg">', '<ul class="task1-list">', '<li class="task1-item">', '<div class="pinkColor">召唤月老中</div>', "</li>", '<li class="task1-item">', '<div class="orangeColor">{{ ranking }}</div>', '<div class="task-progress">{{ anchorVal }}</div>', "</li>", '<li class="task1-item">', '<div class="orangeColor">{{ diffInfo[0] }}</div>', '<div class="task-progress">{{ diffInfo[1] }}</div>', "</li>", "</ul>", "</div>", '<div class="footer-bg">', '<div class="footer-title">', "{{ if (isHotHour) }}", '<span class="gold-icon"></span>', "{{ /if }}", '<span class="j-bakctime-timer">{{ catchYlBackTime }}</span></div>', '<div class="footer-desc">召唤月老结束</div>', "</div>", "{{ else if (catchYlStatus == 2 && !hasDrawTrasure && pid) }}", '<div class="treasure-bg">', '<div class="treasure-title">成功召唤月老</div>', '<div class="treasure-btn" id="valentTreasure" data-pid="{{ pid }}">领取</div>', "</div>", "{{ else }}", '<div class="task-bg1">', '<ul class="task1-list">', '<li class="task1-item">', '<div class="pinkColor">召唤月老Lv{{ taskLevel[0] }}</div>', "{{ if (taskLevel[0] == 5) }}", '<div class="task-progress finsh"><极乐净土></div>', "{{ else }}", '<div class="task-progress">{{ taskProgress[0] }}/{{ taskLimit[taskLevel[0]][0] }}<span class="color-gray">(次)</span></div>', "{{ /if }}", "</li>", '<li class="task1-item">', '<div class="orangeColor">七夕火箭Lv{{ taskLevel[1] }}</div>', "{{ if (taskLevel[1] == 5) }}", '<div class="task-progress finsh"><极乐净土></div>', "{{ else }}", '<div class="task-progress">{{ taskProgress[1] }}/{{ taskLimit[taskLevel[1]][1] }}</span></div>', "{{ /if }}", "</li>", '<li class="task1-item">', '<div class="orangeColor">七夕办卡Lv{{ taskLevel[2] }}</div>', "{{ if (taskLevel[2] == 5) }}", '<div class="task-progress finsh"><极乐净土></div>', "{{ else }}", '<div class="task-progress">{{ taskProgress[2] }}/{{ taskLimit[taskLevel[2]][2] }}</span></div>', "{{ /if }}", "</li>", '<li class="task1-item">', '<div class="orangeColor">鹊桥飞星Lv{{ taskLevel[3] }}</div>', "{{ if (taskLevel[3] == 5) }}", '<div class="task-progress finsh"><极乐净土><div class="color-gray">(赠送人数)</div></div>', "{{ else }}", '<div class="task-progress">{{ taskProgress[3] }}/{{ taskLimit[taskLevel[3]][3] }}<div class="color-gray">(赠送人数)</div>', "</div>", "{{ /if }}", "</li>", "</ul>", "</div>", "{{ if (catchYlStatus == 2 && isCurRoomTop) }}", '<div class="footer-bg">', '<div class="footer-title">{{ nowHour }}点月老榜1</div>', '<div class="footer-desc" title="{{ topAnchorName }}">{{ topAnchorName }}</div>', "</div>", "{{ else if (catchYlStatus == 2 && !isCurRoomTop) }}", '<div class="footer-bg">', '<div class="footer-title">{{ nowHour }}点月老榜1</div>', '<a class="footer-desc" target="_blank" href="{{ topAnchorRid }}" title="{{ topAnchorName }}">{{ topAnchorName }}</a>', "</div>", "{{ else if (catchYlStatus == 1) }}", '<div class="footer-bg">', '<div class="footer-title">', "{{ if (isHotHour) }}", '<span class="gold-icon"></span>', "{{ /if }}", '<span class="j-bakctime-timer">{{ catchYlBackTime }}</span></div>', '<div class="footer-desc">召唤月老结束</div>', "</div>", "{{ else }}", '<div class="footer-bg">', '<div class="footer-title">', "{{ catchYlPreTime }}</div>", '<div class="footer-desc">开启月老榜</div>', "</div>", "{{ /if }}", "{{ /if }}"), a = t.compile(e)
		},
		stage2PendantRender: function() {
			var e, a;
			return e = s.string.join("", "{{ if (status == 1) }}", '<div class="valentine1807-preBg">', '<div class="valentine1807-out"></div>', '<a class="out-link" href="' + f.ztPageUrl + '" target="_blank">查看详情</a>', "</div>", "{{ else if (status == 2) }}", '<a class="end-bg" href="' + f.ztPageUrl + '" target="_blank">', '<div class="end-rank"></div>', "</a>", "{{ else if (status == 3) }}", "{{ if (rankIndex > 0 && rankIndex <= upNum) }}", '<a class="end-bg" href="' + f.ztPageUrl + '" target="_blank">', '<div class="end-rank rank{{ rankIndex }}"></div>', '<div class="end-level-desc{{ level }}">{{ levelName }}</div>', "</a>", "{{ else }}", '<a class="end-bg" href="' + f.ztPageUrl + '" target="_blank">', '<div class="end-rank"></div>', "</a>", "{{ /if }}", "{{ else }}", '<div class="valentine1807-levelInfo stage2-level level{{ level }}">', '<div class="level-title">真情榜</div>', '<div class="level-desc leve{{ level }}">{{ levelName }}</div>', '<div class="level-avatar"><img src="' + f.avatar + '"></div>', '<div class="level-desc">{{ ranking }}</div>', "{{ if (toggleIndex) }}", '<div class="detail J_valent_toggle">', "{{ else }}", '<div class="detail J_valent_toggle valentine1807-hide">', "{{ /if }}", '<div class="detail-title">真情值</div>', '<div class="detail-value">{{ anchorVal }}</div>', "</div>", "{{ if (toggleIndex) }}", '<div class="detail J_valent_toggle valentine1807-hide">', "{{ else }}", '<div class="detail J_valent_toggle">', "{{ /if }}", '<div class="detail-title">{{ diffInfo[0] }}</div>', '<div class="detail-value">{{ diffInfo[1] }}</div>', "</div>", "</div>", "{{ if (toggleIndex) }}", '<div class="task-bg2 J_valent_toggle">', "{{ else }}", '<div class="task-bg2 J_valent_toggle valentine1807-hide">', "{{ /if }}", '<div class="task2-title">全站最高纪录</div>', '<ul class="task2-list">', '<li class="task2-item">', '<span class="task2-gitPic">', "{{ if (giftAllRecord[0].isNew) }}", '<span class="new-icon"></span>', "{{ /if }}", '<img src="{{ giftPicList[0] }}">', "</span>", '<div class="task2-info">{{ giftAllRecord[0].count }}个</div>', '<div class="task2-info">', "{{ if (giftAllRecord[0].fansName) }}", '<a class="task2-fansName" href="{{ giftAllRecord[0].rid }}" target="_blank" title="{{ giftAllRecord[0].fansName }}">{{ giftAllRecord[0].fansName }}</a>粉丝团', "{{ else }}", "虚位以待", "{{ /if }}", "</div>", "</li>", '<li class="task2-item">', '<span class="task2-gitPic">', "{{ if (giftAllRecord[1].isNew) }}", '<span class="new-icon"></span>', "{{ /if }}", '<img src="{{ giftPicList[1] }}">', "</span>", '<div class="task2-info">{{ giftAllRecord[1].count }}个</div>', '<div class="task2-info">', "{{ if (giftAllRecord[1].fansName) }}", '<a class="task2-fansName" href="{{ giftAllRecord[1].rid }}" target="_blank" title="{{ giftAllRecord[1].fansName }}">{{ giftAllRecord[1].fansName }}</a>粉丝团', "{{ else }}", "虚位以待", "{{ /if }}", "</div>", "</li>", '<li class="task2-item">', '<span class="task2-gitPic">', "{{ if (giftAllRecord[2].isNew) }}", '<span class="new-icon"></span>', "{{ /if }}", '<img src="{{ giftPicList[2] }}">', "</span>", '<div class="task2-info">{{ giftAllRecord[2].count }}个</div>', '<div class="task2-info">', "{{ if (giftAllRecord[2].fansName) }}", '<a class="task2-fansName" href="{{ giftAllRecord[2].rid }}" target="_blank" title="{{ giftAllRecord[2].fansName }}">{{ giftAllRecord[2].fansName }}</a>粉丝团', "{{ else }}", "虚位以待", "{{ /if }}", "</div>", "</li>", '<li class="task2-item">', '<span class="task2-gitPic">', "{{ if (giftAllRecord[3].isNew) }}", '<span class="new-icon"></span>', "{{ /if }}", '<img src="{{ giftPicList[3] }}">', "</span>", '<div class="task2-info">{{ giftAllRecord[3].count }}个</div>', '<div class="task2-info">', "{{ if (giftAllRecord[3].fansName) }}", '<a class="task2-fansName" href="{{ giftAllRecord[3].rid }}" target="_blank" title="{{ giftAllRecord[3].fansName }}">{{ giftAllRecord[3].fansName }}</a>粉丝团', "{{ else }}", "虚位以待", "{{ /if }}", "</div>", "</li>", "</ul>", "</div>", "{{ if (toggleIndex) }}", '<div class="task-bg2 valentine1807-hide J_valent_toggle">', "{{ else }}", '<div class="task-bg2 J_valent_toggle">', "{{ /if }}", '<div class="task2-title">本房{{ nowHour }}点记录</div>', '<ul class="task2-list">', '<li class="task2-item">', '<span class="task2-gitPic plus">', '<img src="{{ giftPicList[0] }}">', "</span>", '<div class="task2-info">{{ giftHourRecord[0].count }}个</div>', "</li>", '<li class="task2-item">', '<span class="task2-gitPic plus">', '<img src="{{ giftPicList[1] }}">', "</span>", '<div class="task2-info">{{ giftHourRecord[1].count }}个</div>', "</li>", '<li class="task2-item">', '<span class="task2-gitPic plus">', '<img src="{{ giftPicList[2] }}">', "</span>", '<div class="task2-info">{{ giftHourRecord[2].count }}个</div>', "</li>", '<li class="task2-item">', '<span class="task2-gitPic plus">', '<img src="{{ giftPicList[3] }}">', "</span>", '<div class="task2-info">{{ giftHourRecord[3].count }}个</div>', "</li>", "</ul>", "</div>", "{{ /if }}"), a = t.compile(e)
		},
		renderTips: function() {
			var e, a;
			return e = s.string.join("", '<div class="valentine1807-giftBar-tips">', "{{ if (type == 1) }}", '<div class="valentine1807-giftBar-desc">', '<span class="cola44e00">赠送礼物帮主播</span>', '<span class="colfe592c">破纪录</span>', "</div>", "{{ else if (type == 2) }}", '<div class="valentine1807-giftBar-desc">', '<span class="cola44e00">赠送礼物帮主播</span>', '<span class="colfe592c">召唤月老</span>', "</div>", "{{ else }}", '<div class="valentine1807-giftBar-desc">', '<span class="cola44e00">赠送</span>', '<span class="colfe592c">七夕礼物</span>', '<span class="cola44e00">，帮助主播升级，即可获得</span>', '<span class="colfe592c">海量道具回馈</span>', "</div>", "{{ /if }}", '<span class="valentine1807-giftBar-close">×</span>', "</div>"), a = t.compile(e)
		}
	}, p = {
		config: {
			stageTitle: ["闯情关", "真情榜"],
			levelName: ["Lv1萍水相逢", "Lv2一见倾心", "Lv3花前月下", "Lv4海誓山盟", "Lv5极乐净土"],
			taskName: ["召唤月老Lv", "七夕火箭Lv", "七夕办卡Lv", "鹊桥飞星Lv"]
		},
		handleTaskData: function() {
			var e, s = f.phpConfig,
				t = s.task_level_demand || {},
				a = s.gift_list || [],
				i = [],
				n = t[1] || {},
				l = t[2] || {},
				r = t[3] || {},
				o = t[4] || {},
				c = {},
				d = [n, l, r, o],
				v = 0,
				g = 0,
				p = {};
			for (v; 4 > v; v++) for (p = d[v] || [], c[v + 1] = [], e = 0; e < p.length; e++) c[v + 1].push(p[e].num);
			for (g; 4 > g; g++) i.push(a[g].web_pic);
			f.phpConfig.taskLimit = c, f.phpConfig.giftConfig = i
		},
		checkRoomStatus: function() {
			var e = f.phpConfig,
				s = e.blacklist || [],
				t = 0;
			return s.indexOf(f.rid) >= 0 && (t = 1), t
		},
		getBeginTime: function() {
			var e = f.phpConfig || {},
				s = e.task_begin_time,
				t = "--月--日--点";
			if (s) {
				var a = new Date(1e3 * s);
				t = a.getMonth() + 1 + "月" + a.getDate() + "日" + a.getHours() + "点"
			}
			return t
		},
		formatePreTime: function(e) {
			var s = "--:--",
				t = +e || 0,
				a = 0;
			return e && (a = new Date(1e3 * t), s = a.getHours() + ":" + (a.getMinutes() > 9 ? a.getMinutes() : "0" + a.getMinutes())), s
		},
		formateTime: function(e) {
			var s = +e || 0,
				t = "--",
				a = "--";
			return s >= 60 ? (t = parseInt(s / 60, 10).toString(), a = parseInt(s % 60, 10).toString()) : s >= 0 && (t = "00", a = parseInt(s, 10).toString()), t = t.length > 1 ? t : "0" + t, a = a.length > 1 ? a : "0" + a, t + ":" + a
		},
		taskProgress: function(e, s, t, a) {
			var i = +e || 0,
				n = +s || 0,
				l = +t || 0,
				r = +a || 0;
			return [i, n, l, r]
		},
		getCatchSlot: function(e) {
			var s = '--:--~--"--',
				t = +e || 0,
				a = 0,
				i = 0,
				n = 0,
				l = "--:--",
				r = "--:--";
			return t && (a = t + (f.phpConfig.yuelao_summon_duration || 0), i = new Date(1e3 * t), n = new Date(1e3 * a), l = i.getHours() + ":" + (i.getMinutes() > 9 ? i.getMinutes() : "0" + i.getMinutes()), r = n.getHours() + ":" + (n.getMinutes() > 9 ? n.getMinutes() : "0" + n.getMinutes()), s = l + ":" + r), s
		},
		handleRanking: function(e) {
			var s = +e || 0,
				t = "--";
			return t = -99 === s ? "排名：99+" : 0 >= s ? "未上榜" : "排名：" + (s > 99 ? "99+" : s)
		},
		handleDiffInfo: function(e, s, t) {
			var a = +s || 0,
				i = e > 0 ? parseInt(e / 100, 10) : "--";
			return i > 9999999 && (i = "9999999+"), 1 === t ? 1 === a ? backInfo = ["领先第2名", i] : backInfo = ["落后第1名", i] : 1 === a ? backInfo = ["领先第2名", i] : backInfo = ["落后前1名", i], backInfo
		},
		taskLevel: function(e, s, t, a) {
			var i = +e || 1,
				n = +s || 1,
				l = +t || 1,
				r = +a || 1;
			return [i, n, l, r]
		},
		getGiftPic: function() {
			var e = f.phpConfig.giftConfig;
			return e
		},
		checkIsHotHour: function(e) {
			var s = +e,
				t = f.phpConfig.yuelao_hour_best_time,
				a = !1;
			return t.indexOf(s) >= 0 && (a = !0), a
		},
		handleVal: function(e) {
			var s = +e,
				t = "--";
			return t = parseInt(s / 100, 10) > 9999999 ? "9999999+" : s > 0 ? parseInt(s / 100, 10) : "--"
		},
		mergeData: function(e) {
			var s = e.type,
				t = {},
				i = this.config;
			switch (s) {
			case "pre":
				t = {
					stage: 2,
					preTime: this.getBeginTime(),
					isBlackRoom: this.checkRoomStatus()
				};
				break;
			case "qixipdt":
				f.pid = +e.tid || 0, t = {
					stage: 0,
					title: i.stageTitle[0],
					anchorAvatar: f.avatar,
					levelName: i.levelName[e.rl - 1] || "--",
					level: +e.rl >= 1 && +e.rl < 6 ? +e.rl : 1,
					catchYlStatus: +e.ylst || 0,
					catchYlPreTime: this.formatePreTime(e.yltime),
					catchYlBackTime: this.formateTime(e.yllt),
					taskProgress: this.taskProgress(e.yln, e.rktn, e.cardn, e.hrtn),
					taskLevel: this.taskLevel(e.yll, e.rktl, e.cardl, e.hrtl),
					taskLimit: f.phpConfig.taskLimit,
					catchYlTime: this.getCatchSlot(e.yltime),
					ranking: this.handleRanking(e.rank),
					anchorVal: this.handleVal(e.sc),
					hasDrawTrasure: a.get(f.userId + "@" + f.pid) ? 1 : 0,
					diffInfo: this.handleDiffInfo(e.dsc, e.rank, 1),
					pid: +e.tid || 0,
					topAnchorName: e.yf || "虚位以待",
					topAnchorRid: +e.yrid ? "/" + e.yrid : "javascript:;",
					isCurRoomTop: +e.yrid === f.rid ? 1 : 0,
					nowHour: e.hour >= 0 ? +e.hour : "--",
					isHotHour: +e.gold,
					isBlackRoom: this.checkRoomStatus()
				};
				break;
			case "qixidaypdt":
				t = {
					stage: 1,
					status: +e.rvw,
					ranking: this.handleRanking(e.rank),
					anchorVal: this.handleVal(e.sc),
					diffInfo: this.handleDiffInfo(e.dsc, e.rank, 2),
					level: +e.rl >= 1 && +e.rl < 6 ? +e.rl : 1,
					levelName: i.levelName[e.rl - 1] || "--",
					nowHour: e.hour >= 0 ? +e.hour : "--",
					giftAllRecord: e.giftAllRecord,
					giftHourRecord: e.giftHourRecord,
					giftPicList: this.getGiftPic(),
					upNum: f.phpConfig.level_award[e.rl],
					rankIndex: +e.rank,
					toggleIndex: f.toggleIndx,
					isBlackRoom: this.checkRoomStatus()
				}
			}
			return t
		}
	}, g = {
		init: function() {
			var s = e("body"),
				t = null;
			f.userId = +$SYS.uid || 0, f.ownerId = +$ROOM.owner_uid, this.tpls = {
				conatinerTpl: v.containerRender(),
				prePendantTpl: v.prePendantRender(),
				stage1Tpl: v.stage1PendantRender(),
				stage2Tpl: v.stage2PendantRender(),
				tipsTpl: v.renderTips()
			}, s.append(this.tpls.conatinerTpl), t = e('[data-target="container"]'), d.init(), this.doms = {
				$container: t,
				$slogan: t.find('[data-target="slogan"]'),
				$switch: t.find('[ data-target="switch"]'),
				$pendantWrap: t.find('[data-target="pendantContent"]'),
				$pendant: t.find('[data-target="pendant"]'),
				$chatContent: e("#js-chat-cont"),
				$geeContent: e(".valentine1807-geeContainer"),
				$giftContent: e("#js-stats-and-actions")
			}, this.bindEvent(), this.initData()
		},
		bindEvent: function() {
			this.pendantDrag(), this.togglePendantShape(), this.autoChangeInfo(), this.catchTreasure(), this.hideTips()
		},
		initData: function() {
			this.initSocket(), this.getActivityConfig(), this.checkIsPreStage(), this.sendConfig()
		},
		sendConfig: function() {
			var e = this;
			i.on("room.act.data.connect.valentineDay1807", function() {
				e.getActivityConfig().done(function() {
					i.trigger("room.act.data.config.send", {
						type: "valentineDay1807",
						config: f.phpConfig
					})
				})
			})
		},
		getActivityConfig: function() {
			return f.phpConfig ? f.$Deferred.resolve(f.phpConfig) : (n.load(f.configUrl, f.configKey, function(e) {
				return f.phpConfig = e, p.handleTaskData(), f.$Deferred.resolve(f.phpConfig)
			}), f.$Deferred)
		},
		initSocket: function() {
			var s = this;
			i.on("room.act.data.valentine1807", function(t) {
				var a = e.extend(!0, {}, t),
					n = 0,
					l = 0,
					r = [],
					o = [],
					d = [],
					v = [],
					g = {},
					p = {};
				if (i.trigger("room.act.data.valentine1807.bar", t), a.tid || (a.tid = 0), "qixidaypdt" === a.type) {
					for (r = t.record && c.isArray(t.record) ? c.decode(t.record) : [{
						value: t.record
					}], o = t.rgi && c.isArray(t.rgi) ? c.decode(t.rgi) : [{
						value: t.rgi
					}], n; 4 > n; n++) g = r[n], g && g.value ? (p = c.decode(g.value).too(), d.push({
						giftId: p.gid,
						fansName: p.badge,
						rid: +p.rid ? "/" + p.rid : "javascript:;",
						isCurRoom: +p.rid === f.rid ? 1 : 0,
						isNew: 1 === +p["new"] ? 1 : 0,
						count: +p.cnt >= 0 ? +p.cnt : "--"
					})) : d.push({
						giftId: 0,
						fansName: "",
						rid: "javascript:;",
						isCurRoom: 0,
						isNew: 1 === +p["new"] ? 1 : 0,
						count: "--"
					});
					for (l; 4 > l; l++) g = o[l], g && g.value ? (p = c.decode(g.value).too(), v.push({
						giftId: p.gid,
						fansName: p.badge,
						rid: +p.rid ? "/" + p.rid : "javascript:;",
						isCurRoom: +p.rid === f.rid ? 1 : 0,
						isNew: 1 === +p["new"] ? 1 : 0,
						count: +p.cnt >= 0 ? +p.cnt : "--"
					})) : v.push({
						giftId: 0,
						fansName: "",
						rid: "javascript:;",
						isCurRoom: 0,
						isNew: 1 === +p["new"] ? 1 : 0,
						count: "--"
					});
					a.giftAllRecord = d, a.giftHourRecord = v
				}
				"qixidaypdt" === a.type && "qixipdt" === f.cppRes.type ? f.cppRes = a : f.cppRes = e.extend(!0, f.cppRes, a), f.phpConfig ? s.manageData() : s.getActivityConfig().done(function() {
					s.manageData()
				})
			})
		},
		hideTips: function() {
			e("#js-stats-and-actions").on("click", ".valentine1807-giftBar-close", function() {
				e(".valentine1807-giftBar-tips").remove()
			})
		},
		checkIsPreStage: function() {
			var e = this;
			e.getActivityConfig().done(function() {
				var s = parseInt((new Date).getTime() / 1e3, 10),
					t = f.phpConfig.warm_time,
					a = f.phpConfig.task_begin_time;
				s > t && a > s && (f.cppRes = {
					type: "pre"
				}, e.manageData())
			})
		},
		manageData: function() {
			var e = p.mergeData(f.cppRes),
				s = this;
			e.isBlackRoom || (s.updatePendantView(e), f.isPendantShow || (s.doms.$container.show(), f.isPendantShow = !0))
		},
		updatePendantView: function(e) {
			var s = null,
				t = this.tpls,
				i = this.doms;
			switch (e.stage) {
			case 0:
				s = t.stage1Tpl, f.stage = 0, i.$container.find(".valentine1807-logTitle").text("闯情关"), 1 === e.catchYlStatus && this.timerBack(f.cppRes.yllt);
				break;
			case 1:
				s = t.stage2Tpl, f.stage = 1, i.$container.find(".valentine1807-logTitle").text("真情榜");
				break;
			case 2:
				s = t.prePendantTpl, f.stage = 2
			}
			f.isShowTips || f.userId === f.ownerId || (1 == e.stage ? (this.doms.$giftContent.append(this.tpls.tipsTpl({
				type: 1
			})), a.set("qixiTips", (new Date).getDate(), 86400)) : 0 == e.stage && (this.doms.$giftContent.append(this.tpls.tipsTpl({
				type: 3
			})), a.set("qixiTips", (new Date).getDate(), 86400)), f.isShowTips = !0), i.$pendant.html(s(e)), f.isFirstRender && (i.$container.show(), f.isFirstRender = !1)
		},
		timerBack: function(e) {
			var s, t = +e || 0,
				a = 0,
				i = "--：--",
				n = parseInt((new Date).getTime() / 1e3, 10),
				l = n + t,
				r = this;
			clearInterval(f.timer), 0 >= t || (f.timer = setInterval(function() {
				a = l - parseInt((new Date).getTime() / 1e3, 10), f.cppRes.yllt = a, 0 >= a && clearInterval(f.timer), i = p.formateTime(a), s = r.doms.$container.find(".j-bakctime-timer"), s.length && s.html(i)
			}, 1e3))
		},
		togglePendantShape: function() {
			var s = this.doms;
			s.$switch.on("click", function() {
				e(this).toggleClass("is-close"), s.$slogan.toggleClass("is-close"), s.$pendantWrap.toggleClass("is-close"), f.isPendantMini = !f.isPendantMini, f.isPendantMini ? 0 === f.stage ? (s.$slogan.addClass("is-step1"), s.$slogan.removeClass("is-step2")) : 1 === f.stage && (s.$slogan.addClass("is-step2"), s.$slogan.removeClass("is-step1")) : (s.$slogan.removeClass("is-step1"), s.$slogan.removeClass("is-step2"))
			})
		},
		catchTreasure: function() {
			var s = this.doms,
				t = this;
			s.$container.on("click", "#valentTreasure", function() {
				var s = e(this).data("pid");
				return l.check() ? (f.pid = s, void t.postRequest()) : void l.show("login")
			}), s.$container.on("click", ".valentine1807-geeCls", function() {
				t.toggleGeeView(0)
			})
		},
		toggleGeeView: function(e) {
			var s = this.doms;
			e ? (s.$geeContent.show(), s.$container.find(".valentine1807-rank").addClass("valentine1807-hide")) : (s.$geeContent.hide(), s.$container.find(".valentine1807-rank").removeClass("valentine1807-hide"))
		},
		postRequest: function(e) {
			return f.isPassGee ? void this.sendRequest(e) : (this.toggleGeeView(1), void(f.geeFn && f.geeFn.refresh()))
		},
		sendRequest: function(s) {
			var t = this,
				a = e.extend(!0, {
					room_id: r.get("room.room_id"),
					device_id: r.get("room.device_id"),
					packerid: f.pid || 1,
					version: 1
				}, s);
			f.isPecking || (f.isPecking = !0, e.ajax({
				url: "/member/task/redPacketReceive",
				type: "POST",
				dataType: "json",
				data: a,
				error: function() {
					f.isPecking = !1
				},
				success: function(e) {
					f.isPecking = !1, t.response(e)
				}
			}))
		},
		response: function(e) {
			var s = e.geetest || {},
				t = this;
			1 === e.validate || -2 === parseInt(e.code, 10) ? 0 === parseInt(s.code, 10) ? (f.geeFn ? f.geeFn.refresh() : f.geeFn = o.init("#valentine1807-gee", JSON.parse(s.validate_str), function(e) {
				t.sendRequest(e)
			}, function() {
				t.showDrawTips({
					code: 1
				}, "Normal"), t.toggleGeeView(0), f.geeFn = null
			}), f.isPassGee = !1, t.toggleGeeView(1)) : (f.isPassGee = !0, t.storeGetTreausre(), t.showDrawTips(e, "Normal"), t.toggleGeeView(0)) : (f.isPassGee = !0, t.storeGetTreausre(), t.toggleGeeView(0), t.showDrawTips(e, "Normal"))
		},
		storeGetTreausre: function() {
			a.set(f.userId + "@" + f.pid, 1, 3600)
		},
		showDrawTips: function(s, t) {
			var a = "",
				i = this.doms,
				n = 0,
				l = "",
				r = [];
			switch (this.manageData(), e(".peck-back-tip") && e(".peck-back-tip").length ? e(".peck-back-tip").remove() : "", f.isPassGee = !0, t) {
			case "Normal":
				if (0 !== parseInt(s.code, 10) || 0 === parseInt(s.silver, 10) && 0 === parseInt(s.prop_count, 10)) a = e('<div class="peck-back-tip peck-back-error"><p><span>运气不佳，宝箱已被洗劫一空T_T</span></p></div>'), this.appendTips(a);
				else if (2 === parseInt(s.award_type, 10)) a = e('<div class="peck-back-tip peck-back-success"><p><span>恭喜您，领取了</span></p><p><strong>' + s.prop_count + "个" + s.prop_name + "</strong><span>~</span></p></div>"), this.appendTips(a),insertData(i);
				else if (parseInt(s.lk, 10)) e(".treasure-luckuser-tips") && e(".treasure-luckuser-tips").length ? e(".treasure-luckuser-tips").remove() : "", a = e('<div class="treasure-luckuser-tips"><span class="best"></span></div>'), i.$chatContent.append(a), a.delay(1500).fadeOut(400, function() {
					a.remove()
				});
				else if (parseInt(s.lt, 10) > 0) {
					for (e(".treasure-luckuser-tips") && e(".treasure-luckuser-tips").length ? e(".treasure-luckuser-tips").remove() : "", r = s.lt.toString().split(""), n; n < r.length; n++) l += '<span class="rate' + r[n] + '"></span>';
					a = e('<div class="treasure-luckuser-tips"><span class="bouns"></span><span class="multiply"></span>' + l + "</div>"), i.$chatContent.append(a), a.delay(1500).fadeOut(400, function() {
						a.remove()
					})
				} else a = e('<div class="peck-back-tip peck-back-success"><p><span>恭喜您，领取了</span></p><p><strong>' + s.silver + "个鱼丸</strong><span>~</span></p></div></div>"), this.appendTips(a),insertData(i);
			}
		},
		appendTips: function(e) {
			var s = this.doms;
			s.$chatContent.append(e), s.$container.find(".valentine1807-rank").addClass("valentine1807-hide"), e.fadeIn(400).delay(3e3).fadeOut(400, function() {
				e.remove(), s.$container.find(".valentine1807-rank").removeClass("valentine1807-hide")
			})
		},
		pendantDrag: function() {
			function s(s) {
				return e(document).bind({
					mousemove: t,
					mouseup: a
				}), !1
			}
			function t(e) {
				var s = e.clientY,
					t = i.height(),
					a = window.innerHeight;
				return f.isPendantMini ? (s -= 34, 0 >= s ? s = 0 : s > a - 68 && (s = a - 68)) : (s -= 48, 0 >= s || 0 > a - t ? s = 0 : s > a - t && (s = a - t)), i.css({
					top: s
				}), !1
			}
			function a() {
				e(document).unbind({
					mousemove: t,
					mouseup: a
				})
			}
			var i = this.doms.$container;
			i.on("mousedown", '[data-target="slogan"]', s)
		},
		autoChangeInfo: function() {
			var s = "";
			setInterval(function() {
				s = e(".J_valent_toggle"), s && s.length && (s.toggleClass("valentine1807-hide"), 0 === f.toggleIndx ? f.toggleIndx = 1 : f.toggleIndx = 0)
			}, 4e3)
		}
	}, {
		init: function() {
			g.init()
		}
	}
});