var myRefresher = {
	/*
	 * pullUp(myswiper) 上拉加载 同步请求
	 * pullDown(myswiper) 下拉刷新 同步请求
	 * target  容器对象
	 * loadCount 每页加载数量
	 */
	init: function(params) {
		var pullLength = 0;
		var pullOn;
		var isShowPullOn;
		$(params.target).append('<div id="myCon" class="swiper-container" style="height: 100%;"></div>');
		$(params.target).children().append('<div class="swiper-wrapper"></div>');
		$("html").css("height", "100%");
		$("body").css("height", "100%");
		$(params.target).css("height", "92%");
		$(params.target).children().children(".swiper-wrapper").prepend('<div id="pullDown" style="margin-top: -30px;text-align: center;font:14px \'microsoft yahei\';height:30px;line-height:30px">下拉刷新</div>');
		//下拉刷新
		var mySwiper1 = new Swiper("#myCon", {
			mode: "vertical",
			slidesPerView: 'auto',
			watchActiveIndex: true,
			onResistanceBefore: function(s, pos) {
				pullLength = pos;
				$("#pullDown").text("下拉刷新");
				pullOn = false;
			},
			onResistanceAfter: function(s, pos) {
				pullLength = pos;
				pullOn = true;
			},
			onTouchStart: function() {
				pullLength = 0;
			},
			onTouchEnd: function() {
				if(pullLength > 100) {
					if(pullOn){
						//上拉加载
						pullUp(mySwiper1,params);
					}else{
						//下拉刷新
						pullDown(mySwiper1,params);
					}
				}
			}
		});
		params.pullDown(mySwiper1);
		if($(params.target).children().children().children(".swiper-slide").length >= params.loadCount) {
			$(params.target).children().children(".swiper-wrapper").append('<div id="pullOn" style="margin-top: 10px;text-align: center;font:14px \'microsoft yahei\';height: 20px;">上拉加载</div>');
		}
	},
	loadAll:function(){
		$("#pullOn").text("已加载全部数据");
	}
}

function pullDown(view,params) {
	// Hold Swiper in required position
	view.setWrapperTranslate(0, 30, 0)

	//Dissalow futher interactions
	view.params.onlyExternal = true;

	setTimeout(function() {
		$("#pullOn").remove();
		$(params.target).children().children().children(".swiper-slide").remove();
		params.pullDown(view);
		$("#pullDown").text("success");
		$(params.target).children().children(".swiper-wrapper").append('<div id="pullOn" style="margin-top: 10px;text-align: center;font:14px \'microsoft yahei\';height: 20px;">上拉加载</div>');
		view.setWrapperTranslate(0, 0, 0)
		view.params.onlyExternal = false;
	}, 1000);
}

function pullUp(view,params) {
	// Hold Swiper in required position
	//Dissalow futher interactions
	$("#pullOn").text("加载中")
	view.params.onlyExternal = true;
	setTimeout(function() {
		$("#pullOn").remove();
		
		params.pullUp(view);
		$(params.target).children().children(".swiper-wrapper").append('<div id="pullOn" style="margin-top: 10px;text-align: center;font:14px \'microsoft yahei\';height: 20px;">上拉加载</div>');
		view.params.onlyExternal = false;
	}, 1000);
}