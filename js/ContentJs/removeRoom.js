//从bg.js获取要过滤的房间数组
var roomObjArr = new Object;
if (roomObjArr.data == undefined) {	//从 localStorage.RoomArr 获取要过滤的房间
	RoomObj.getDataFormBackground({type:"function",functionName:"getRooms"},roomObjArr);
}
// 10秒过滤一次，因为无刷新更新页面，下次刷新会继续过滤
var removeRoomTimer=setInterval(function(){
	if ($("#live-list-contentbox").length >0) {
		if ($(".w1366").length>0) {
			$(".left-btn")[0].click();
		}
		if ($(".left-menu-small").length>0) {
			$("#left").remove();	//左侧快栏
		}
		
		var roomIdArr = $("#live-list-contentbox li a");
		for (var j = 0; j < roomIdArr.length; j++) {
			var dataRid =roomIdArr[j].getAttribute("href").replace("/","")
			var RoomArr =roomObjArr.data;
			for (var k = 0; k < RoomArr.length; k++) {
				if (RoomArr[k].id == dataRid) {
					roomIdArr[j].parentElement.remove()
					break;
				}
			}
		}
	}else{
		window.clearInterval(removeRoomTimer);
	}	
},3000);