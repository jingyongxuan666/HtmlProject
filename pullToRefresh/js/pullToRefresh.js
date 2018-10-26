var noData;
//创建上拉加载的div
var pullUp = document.createElement("div");
pullUp.id = "pullUp";
pullUp.style.cssText = "margin-top: 10px;text-align: center;font:14px \'microsoft yahei\';height: 20px;";
var myRefresher = {
	/*
	 * pullUp(myswiper) 上拉加载 同步请求
	 * pullDown(myswiper) 下拉刷新 同步请求
	 * target  容器对象
	 * loadCount 每页加载数量
	 * onItemClick(index) 子项目点击方法，参数为索引
	 * itemSpacing item间隔，单位px
	 */
	init: function(params) {
		var pullLength = 0;
		var pullOn;
		var isShowPullOn;
		var target = document.querySelector(params.target);
		//loadCount默认为-1，无上拉加载
		params.loadCount = params.loadCount == null ? -1 : params.loadCount;

		//设置item间隔
		var itemStyle = document.createElement("style");
		itemStyle.type = "text/css";
		itemStyle.appendChild(document.createTextNode(".swiper-slide {padding-top:" + (params.itemSpacing == null ? 0 : params.itemSpacing) + "px}"));
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(itemStyle);

		//创建下拉刷新容器
		var refreshWrapper = document.createElement("div");
		refreshWrapper.className = "swiper-container";
		refreshWrapper.id = "myCon";
		refreshWrapper.style.height = "100%";
		target.appendChild(refreshWrapper);

		var swiperWrapper = document.createElement("div");
		swiperWrapper.className = "swiper-wrapper";
		refreshWrapper.appendChild(swiperWrapper);
		//指定html和body高度
		document.documentElement.style.height = "100%";
		document.body.style.height = "100%";
		//指定容器高度
		target.style.height = "92%";
		//头部添加下拉刷新
		var pullDown = document.createElement("div");
		pullDown.id = "pullDown";
		pullDown.style.cssText = "margin-top: -30px;text-align: center;font:14px \'microsoft yahei\';height:30px;line-height:30px;"
		swiperWrapper.appendChild(pullDown);
		//下拉刷新
		var mySwiper1 = new Swiper("#myCon", {
			mode: "vertical",
			slidesPerView: 'auto',
			watchActiveIndex: true,
			onResistanceBefore: function(s, pos) {
				pullLength = pos;
				pullDown.innerText = "下拉刷新";
				pullOn = false;
			},
			onResistanceAfter: function(s, pos) {
				pullLength = pos;
				pullOn = true;
			},
			onTouchStart: function() {
				pullLength = 0;
				noData = false;
			},
			onTouchEnd: function() {
				if(pullLength > 100) {
					if(pullOn) {
						//上拉加载
						if(params.loadCount != -1)
							doPullUp(mySwiper1, params);
					} else {
						//下拉刷新
						doPullDown(mySwiper1, params);
					}

				}
			},
			onSlideClick: function() {
				params.onItemClick(mySwiper1.slides[mySwiper1.clickedSlideIndex]);
			}
		});
		params.pullDown(mySwiper1);
		addPullUp(params);
		checkNoData(mySwiper1);
	},
	loadAll: function() {
		noData = true;
	}
}

function doPullDown(view, params) {
	// Hold Swiper in required position
	view.setWrapperTranslate(0, 30, 0)

	//Dissalow futher interactions
	view.params.onlyExternal = true;
	document.getElementById("pullDown").innerText = "正在刷新";
	setTimeout(function() {
		if(params.loadCount != -1)
			document.querySelector(".swiper-container >.swiper-wrapper").removeChild(document.getElementById("pullUp"));
		view.removeAllSlides();

		params.pullDown(view);
		//数据加载完成添加上拉加载的div
		addPullUp(params);
		//判断如果没有数据，则提示
		checkNoData(view);

		document.getElementById("pullDown").innerText = "刷新成功";
		setTimeout(function() {
			view.setWrapperTranslate(0, 0, 0);
			view.params.onlyExternal = false;
		}, 500);
		if(noData) {
			if(params.loadCount != -1)
				document.querySelector(".swiper-container >.swiper-wrapper").removeChild(document.getElementById("pullUp"));
		}
	}, 1000);
}

function doPullUp(view, params) {
	//Dissalow futher interactions
	document.getElementById("pullUp").innerText = "加载中";
	view.params.onlyExternal = true;
	setTimeout(function() {
		document.querySelector(".swiper-container >.swiper-wrapper").removeChild(document.getElementById("pullUp"));
		params.pullUp(view);
		addPullUp(params);
		view.params.onlyExternal = false;
		if(noData) {
			document.getElementById("pullUp").innerText = "已加载全部数据";
		}
	}, 1000);
}

function addPullUp(params) {
	if(document.querySelectorAll(".swiper-wrapper > .swiper-slide").length >= params.loadCount && params.loadCount != -1) {
		document.querySelector(".swiper-container >.swiper-wrapper").appendChild(pullUp);
		document.getElementById("pullUp").innerText = "上拉加载";
	}
}

/**
 * 判断有列表有无item，没有则显示暂无数据，有则移除之
 */
function checkNoData(mySwiper1) {
	//有暂无数据的div则移除
	if(document.getElementById("noDataDiv")) {
		document.querySelector(".swiper-container .swiper-wrapper").removeChild(document.getElementById("noDataDiv"));
	}
	if(document.getElementsByClassName("swiper-slide").length == 0) {
		var noDataDiv = document.createElement("div");
		noDataDiv.id = "noDataDiv";
		noDataDiv.style.cssText = "height:200px;line-height:200px;text-align:center;font-family: microsoft yahei;";
		noDataDiv.innerText = "暂无数据";
		mySwiper1.appendSlide(noDataDiv);
	}
}