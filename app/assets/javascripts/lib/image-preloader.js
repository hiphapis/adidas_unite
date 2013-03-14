// author: hiphapis@gmail.com
var imageResult = {};
var imagePreloader = function(images, callback, cache) {
	var loadImage = function(url) {
		imageResult[url]["status"] = "start";
		// console.log("start: " + url);
		var img = new Image();
	  img.onload = function() { processLoadResponse(url) }
	  img.onerror = function() { processUnloadResponse(url) }
  	img.src = (cache)? url : url + "?" + new Date().getTime() + Math.random();
	}
	
	var loaded = 0;	
	var processLoadResponse = function(url) {
		imageResult[url]["status"] = "done";

		// console.log("ok: " + url);
		callback(loaded += 1, images.length);
	}

	var retryCount = 3;
	var unloadedImages = {};
	var processUnloadResponse = function(url) {
		unloadedImages[url] = unloadedImages[url] + 1 || 1;
		if (unloadedImages[url] >= retryCount) {
			imageResult[url]["status"] = "failed";
			// console.log("failed-fail: " + url);
			processLoadResponse(url);
			return
		}
		else {
			imageResult[url]["status"] = "retry";
			// console.log("failed-retry(" + unloadedImages[url] + "): " + url);
			loadImage(url);
		}
	}

	$.each(images, function(idx, url) {
		imageResult[url] = {};
		loadImage(url);
	});
	
}
