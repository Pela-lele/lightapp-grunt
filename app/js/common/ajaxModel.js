(function(){
	$.ajaxSetup({
		// cache: false,
		error:function(jqXHR, textStatus, errorMsg){
			console.log( '发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg ); 
			new Toast("网络或服务器异常！").show();
		},
		data:{
			// "_": new Date().getTime()
			/*sessionId:"mobileark%23829cc4f6-8b16-4bab-8704-ffc49256f49a",
			reqSource:"client"*/
		}
	});
	var sessionId = escape("mobileark#f81da477-d4f8-4c6c-aa36-bd9c7a08ea30");//mobileark#5f0390da-164a-420e-bf87-5fcd4a0eef82
	// sessionId = window.localStorage.getItem("sessionId");
	/*document.addEventListener("plusready",function(){
		sessionId = window.localStorage.getItem("sessionId");
		if(!sessionId){
			var token = NativeObj.getToken();
        	window.localStorage.setItem("sessionId",token);
		}
	});*/
	
	// http://127.0.0.1:91/poll-list2.html??sessionId=mobileark%2387f71d87-cfe0-4216-8073-16a93d0b0e61
	// var sessionId = "mobileark%23829cc4f6-8b16-4bab-8704-ffc49256f49a";
	
	window.defUrl = "?sessionId="+sessionId+"&reqSource=client";
	var hostURL = "http://192.168.4.179:6060/microapp";
	var ajaxModel = {
		/**
		 * [cacheAjaxObject description]
		 * @param  {[type]} ajaxUrl [后端接口地址]
		 * @param  {[type]} params  [参数]
		 * @param  {[type]} type    [GET or POST]
		 * @param  {[type]} custom  [ajax 更多参数配置项]
		 * @return {[type]}         [返回一个ajax对象]]
		 */
		ajaxObject: function(ajaxUrl, params, type, custom) {
			ajaxUrl += defUrl;
			var ajaxParams = {
					url: hostURL+ajaxUrl,
					type: type || 'GET',
					dataType: 'json',
					data: params
				},
				ajaxObject;
			$.extend(ajaxParams,custom);
			ajaxObject = $.ajax(ajaxParams);

			return ajaxObject;
		},
		getData: function(ajaxUrl, params, custom){
			var ajaxObject = this.ajaxObject(ajaxUrl, params, 'GET', custom);
			return ajaxObject.fail(function(res){
				new Toast("请求失败！").show();
			});
		},
		postData: function(ajaxUrl, params, custom){
			var ajaxObject = this.ajaxObject(ajaxUrl, params, 'POST', custom);
			return ajaxObject.fail(function(res){
				new Toast("请求失败！").show();
			});
		}
	};
	// return window.ajaxModel = ajaxModel;
})();