(function($){
	
	var elHead = document.getElementsByTagName('head')[0];
		
	function defer(sGetStr, fCallback, sType) {
		
		var elTag, fCb
		
		if (!sType) {
			sType = sGetStr.match(/\.(js|css)(\&|$)/)[1];
		}
				
		switch(sType.toLowerCase()) {
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
				throw new Error('Invalid type "' + sType + '"');
		}
		
		if ($.support.style) {
			$(elTag).one('load', fCb);
		} else {
			elTag.onreadystatechange = function() {
				var sReadyState = this.readyState;
				if (sReadyState === 'complete' || sReadyState === 'loaded') {
					elTag.onreadystatechange = null;
					fCb();
				}
			}
		}
		
		elHead.appendChild(elTag);
	}
	
	$.extend({
		'defer': defer
	});
})(jQuery);