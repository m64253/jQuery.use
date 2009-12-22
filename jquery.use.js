jQuery.extend({
	use: (function() {
			var $ = jQuery,
				bDOMReady = false,
				bWorking = false,
				aLoad = [],
				aLoaded = [];
	
			function getBaseUrl() {
				if (!jQuery.use.base) {
					jQuery.use.base = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
				}
				return jQuery.use.base;
			}
	
			function getModules() {
				return jQuery.use.modules || [];
			}
			
			function getCombine() {
				return jQuery.use.combine || false;
			}
	
			function build(aParams, aOld) {
				var oModules = getModules(),
					oModule,
					aModules = aOld || [],
					sParam,
					path,
					i,
					iLen;
		
				if ($.isArray(aParams[0])) {
					aParams = aParams[0];
				} else if (!$.isArray(aParams)) {
					aParams = [aParams];
				}
		
				for (i=0, iLen = aParams.length; i < iLen; i++) {
					sParam = aParams[i];
					if (oModules.hasOwnProperty(sParam)) {
						oModule = oModules[sParam];
						path = oModule.path;
												
						if (oModule.require) {
							aModules = build([oModule.require], aModules);
						}
				
						if ($.inArray(path, aModules) === -1 && $.inArray(path, aLoaded) === -1) {
							aModules.push(path);
						}
					}
				}
		
				return aModules;
			}
	
			function loader(aParams, fCallback) {
		
				var aModules = build(aParams);
		
				if (aModules.length === 0) {
					$(fCallback);
					next();
					return;
				}
		
				setTimeout(function(){
					var base = getBaseUrl(),
						sModule,
						iFiles = ((getCombine()) ? 1 : aModules.length),
						aGetStr,
						fCb;
					
					if (iFiles === 1) {
						sModule = aModules;
						aGetStr = base + '?' + aModules.join('&');
						
						fCb = function(){
							$(fCallback);
							next();
						};
					} else {
						
						sModule = [aModules.shift()];
						aGetStr = base + '?' + sModule[0];
						
						fCb = function(){
							if (aModules.length === 0) {
								$(fCallback);
								next();
							} else {
								var sModule = [aModules.shift()],
									aGetStr = base + '?' + sModule[0];
								
								defer(aGetStr, fCb, sModule);
							}
						};
					}
					
					defer(aGetStr, fCb, sModule);
				}, 0);
			}
			
			function defer(aGetStr, callback, aAddToLoaded) {
				var elScript = document.createElement('script');

				elScript.type = 'text/javascript';
				elScript.src = aGetStr;
				
				$(elScript).one('load', function(){
					aLoaded = aLoaded.concat(aAddToLoaded);
					elScript.parentNode.removeChild(elScript);
					callback();
				});

				document.body.appendChild(elScript);
			}
			
			function next() {
				bWorking = false;
				var oNext = aLoad.shift();
				if (oNext) {
					setTimeout(function(){
						get.apply(window, [oNext.params, oNext.callback]);
					}, 0);
				}
			}
	
			function get(aParams, fCallback) {
				if (bWorking) {
					aLoad.push({ 'params': aParams, 'callback': fCallback });
				} else {
					bWorking = true;
					loader(aParams, fCallback);
				}
			}
	
			return function () {
				var aParams = $.makeArray(arguments),
					fCallback = aParams.pop();
		
				if (aParams.length === 0) {
					$(fCallback);
					return;
				}
		
				get(aParams, fCallback);
			};
		})()
});