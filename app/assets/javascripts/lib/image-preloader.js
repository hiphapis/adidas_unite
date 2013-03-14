// author: hiphapis@gmail.com
var imagePreloader = function(images, callback, cache) {
	var loadImage = function(url) {
		console.log("start: " + url);
		var img = new Image();
	  img.onload = function() { processLoadResponse(url) }
	  img.onerror = function() { processUnloadResponse(url) }
  	img.src = (cache)? url : url + "?" + new Date().getTime() + Math.random();
	}
	
	var loaded = 0;	
	var processLoadResponse = function(url) {
		console.log("ok: " + url);
		callback(loaded += 1, images.length);
	}

	var retryCount = 3;
	var unloadedImages = {};
	var processUnloadResponse = function(url) {
		unloadedImages[url] = unloadedImages[url] + 1 || 1;
		if (unloadedImages[url] >= retryCount) {
			console.log("failed-fail: " + url);
			processLoadResponse(url);
			return
		}
		else {
			console.log("failed-retry(" + unloadedImages[url] + "): " + url);
			loadImage(url);
		}
	}

	$.each(images, function(idx, url) {
		loadImage(url);
	});
	
}
