var os = (function() {
	var ua = navigator.userAgent.toLowerCase();
	return {
		isWin: /windows/.test(ua),
		isWin2K: /windows nt 5.0/.test(ua),
		isXP: /windows nt 5.1/.test(ua),
		isVista: /windows nt 6.0/.test(ua),
		isWin7: /windows nt 6.1/.test(ua),
		isMac: /macintosh/.test(ua),
		isLinux: /linux/.test(ua),
		isUnix: /x11/.test(ua)
	};
}());