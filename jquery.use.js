(function($) {
	
	var elHead,
		bDOMReady = false,
		bWorking = false,
		aLoad = [],
		aLoaded = [];
		
	function defer(sGetStr, fCallback, sType) {
		
		var elTag, 
			fCb;
		
		sType = (sType || sGetStr.match(/\.(js|css)(\&|$)/)[1]).toLowerCase();
		
		switch(sType) {
			case 'css':
				elTag = document.createElement('link');
				elTag.rel = 'stylesheet';
				elTag.type = 'text/css';
				elTag.href = sGetStr;
				fCb = function(){
					fCallback();
				}
				break;
			
			case 'js':
				elTag = document.createElement('script');
				elTag.type = 'text/javascript';
				elTag.src = sGetStr;
				fCb = function(){
					elTag.parentNode.removeChild(elTag);
					fCallback();
				}
				break;
		
			default:
				throw 'Invalid type: "' + sType + '"';
		}
		
		if (elTag.onreadystatechange) {
			elTag.onreadystatechange = function() {
				var sReadyState = this.readyState;
				if (sReadyState === 'complete' || sReadyState === 'loaded') {
					elTag.onreadystatechange = null;
					fCb();
				}
			}
		} else {
			elTag.onload = function() {
				elTag.onload = null;
				fCb();
			}
		}
		
		elHead = elHead || document.getElementsByTagName('head')[0]
		
		elHead.appendChild(elTag);
	}
	
	function build(aParams, aOld) {
		var oModules = $.use.modules || [],
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
			loadNext();
			return;
		}

		setTimeout(function(){
			var base = $.use.base || window.location.protocol + '//' + window.location.hostname + window.location.pathname,
				sModule,
				iFiles = (($.use.combine) ? 1 : aModules.length),
				aGetStr,
				fCb;
			
			if (iFiles === 1) {
				sModule = aModules;
				aGetStr = base + '?' + aModules.join('&');
								
				fCb = function(){
					$(fCallback);
					loadNext();
				};
			} else {

				sModule = [aModules.shift()];
				aGetStr = base + '?' + sModule[0];

				fCb = function(){
					if (aModules.length === 0) {
						$(fCallback);
						loadNext();
					} else {
						var sModule = [aModules.shift()],
							aGetStr = base + '?' + sModule[0];
						
						defer(aGetStr, function(){
							aLoaded = aLoaded.concat(sModule);
							fCb();
						});
					}
				};
			}

			defer(aGetStr, function(){
				aLoaded = aLoaded.concat(sModule);
				fCb();
			});
		}, 0);
	}

	function loadNext() {
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
	
	function use() {
		var aParams = $.makeArray(arguments),
		fCallback = aParams.pop();

		if (aParams.length === 0) {
			$(fCallback);
			return;
		}

		get(aParams, fCallback);
	}
	
	$.extend({
		'use': use
	});
	
})(jQuery);