//var serverIp = "http://123.56.135.227/aeb_project/admin/index.php?route="
var serverIp = "http://123.56.135.227/scc2_project/"

/*获取网络请求基本参数*/
function baseRequestParams() {
	var requestData = {};
	requestData.adminId = $.session.get("adminId");
	requestData.accessToken = $.session.get("accessToken");
	requestData.communityId = $.session.get("communityId");
	return requestData;
}

/*获取网络请求基本参数FormData类型，用于上传图片*/
function baseRequestFormData() {
	var requestData = new FormData();
	requestData.append("adminId",$.session.get("adminId"))
	requestData.append("accessToken",$.session.get("accessToken"))
	requestData.append("communityId",$.session.get("communityId"))
	return requestData;
}


/*推算前七天日期*/
function fun_date(aa) {
	var date1 = new Date();
	var oldYear = date1.getFullYear();
	var oldMonth = date1.getMonth() + 1;
	var oldDate = date1.getDate();
	if(oldMonth >= 1 && oldMonth <= 9) {
		oldMonth = "0" + oldMonth;
	}
	if(oldDate >= 0 && oldDate <= 9) {
		oldDate = "0" + oldDate;
	}
	time1 = oldYear + "-" + oldMonth + "-" + oldDate; //time1表示当前时间
	var date2 = new Date(date1);
	date2.setDate(date1.getDate() + aa);
	var newYear = date2.getFullYear();
	var newMonth = date2.getMonth() + 1;
	var newDate = date2.getDate();
	if(newMonth >= 1 && newMonth <= 9) {
		newMonth = "0" + newMonth;
	}
	if(newDate >= 0 && newDate <= 9) {
		newDate = "0" + newDate;
	}
	var time2 = newYear + "-" + newMonth + "-" + newDate;
	return time2;
}

function getYears() {
	var startYear = 2018;
	var currentYear = new Date().getFullYear();
	var years = [];
	for(var i = 0; i <= currentYear - startYear; i++) {
		var temp = startYear;
		years.push(temp + i)
	}

	return years;
}

function getMonths(year) {
	var months = [];
	var currentYear = new Date().getFullYear();
	if(year < currentYear) {
		for(var i = 1; i <= 12; i++) {
			var num1 = i;
			if(i<10){
				num1 = "0"+i;
			}
			months.push(num1);
		}
	} else {
		var currentMonth = new Date().getMonth() + 1;
		for(var i = 1; i <= currentMonth; i++) {
			var num2 = i;
			if(i<10){
				num2 = "0"+i;
			}
			months.push(num2);
		}
	}
	return months;
}

//设置月份
function setMonth(viewId, year) {
	var months = getMonths(year);
	$("#" + viewId).html('<option value="-1">全部</option>')
	for(var i = 0; i < months.length; i++) {
		var monthItem = '<option value="' + months[i] + '">' + months[i] + '月</option>'
		$("#" + viewId).append(monthItem)
	}
}

/*http请求封装*/
var HttpRequest = {
	post: function(params) {
		initLoading()
		var requestData = {};
		if(params.data != null) {
			requestData = params.data;
			requestData.adminId = baseRequestParams().adminId;
			requestData.accessToken = baseRequestParams().accessToken;
			requestData.communityId = baseRequestParams().communityId;
			console.log("requestData:" + JSON.stringify(requestData))
		}
		console.log("params.data:" + JSON.stringify(baseRequestParams()))
		showLoading();
		$.ajax({
			type: "post",
			dataType: "json",
			url: serverIp + params.apiUrl,
			async: params.async == null ? true : params.async,
			contentType: params.contentType == null ? "application/x-www-form-urlencoded; charset=UTF-8" : params.contentType,
			processData: params.processData == null ? true : params.processData,
			data: params.data == null ? baseRequestParams() : requestData,
			success: function(data) {
				hideLoading()
				if(data.status > 0) {
					alert(data.msg)
					if(data.status == 2) {
						top.location.href = "../index.html"
					}
				} else {
					params.success(data)
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				hideLoading()
				console.log("error:" + errorThrown)
				if(errorThrown == "timeout") {
					alert("请求超时，请检查网络")
					return;
				}
				params.error(errorThrown)
			},
			timeout: 20000
		});
	}
}
//非空判断
function isEmpty(content){
	if(content == "" || content == null){
		return true;
	}
	return false;
}
//网络请求加载效果
function initLoading(){
	if(document.getElementById("http-loading-img")){
		return;
	}
	var loadingDiv = document.createElement("div")
	loadingDiv.id = "http-loading-img"
	loadingDiv.style.cssText = "position:absolute;top:0;left:0;bottom:0;right:0;background:rgba(220,220,220,0.5) url(./images/loading.gif) no-repeat 40% 40%/90px 90px;z-index:999;text-align:center;"
	document.body.appendChild(loadingDiv)
	loadingDiv.style.display = "none"
}
//显示加载动画
function showLoading(){
	document.getElementById("http-loading-img").style.display = "block"
}
//隐藏加载动画
function hideLoading(){
	document.getElementById("http-loading-img").style.display = "none"
}

/*获取url后面参数*/
function getUrlParams(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	var q = decodeURI(window.location.pathname).substr(1).match(reg_rewrite);
	if(r != null) {
		return unescape(r[2]);
	} else if(q != null) {
		return unescape(q[2]);
	} else {
		return null;
	}
}