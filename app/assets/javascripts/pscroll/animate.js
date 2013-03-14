/**
 * Copyright 2013
 */

// Author: @9ruvie
// Editor: @hiphapis
//    - assignCanvasPosition
//    - scrollToSection
//    - no_hide => after_no_hide
//    - before_no_hide
//    - only_element_height
//    - resizeCallback
//    - for Fucking IE

function PRINT(key, value) {
	key = key.replace(/[#\W\.]/g, 'X');
	var ee = $("#stats_console").find('.' + key);
	if (ee && ee.length > 0) {
		ee.html(value);
	} else {
		$("#stats_console").append('<p class="' + key + '">' + value + '</p>');
	}
}


////////////////////////////////////////////////////////
// PLAYER

var AnimationPlayer = function(options) {
	if (options.element) {
		var $page = $(options.element);
	}
	else {
		console.error("Required element!");
	}
	
	if (options.scroller) {
		var $scroller = $(options.scroller);
	}
	else {
		console.error("Required scroller!");
	}
	
	var _setting = _.defaults(options, {
		triggerAtCenter: false,
		debug: false,
		scrollSpeed: 20
	});
	var _viewport = {};
	var _position = 0;
	var _positionTweened = 0;
	var _maxPosition = 0;
	var _status = false;
	var _animations = [];
	var _scrollCallbacks = [];

	var _resizeCallback = options.resizeCallback || null;
	
	if (options.onScroll) {
		_scrollCallbacks.push(options.onScroll);
	}

	function CONSOLE_DEBUG() {
		if (_setting.debug) console.log.apply(console, arguments);
	}

	CONSOLE_DEBUG('== DEBUG MODE : enabled');



	////////////////////////////////////////////

	function init() {
		// calculate canvas initially
		resizePage();
		// bind events
		$(window).bind('resize', function() {
			resizePage();
			// _position을 확인하고. 1 frame을 랜더링한다.
			if (_position > _maxPosition) {
				_position = _maxPosition;
			}
			updateTimeline();
		});
	}
	
	function updateTimeline() {
		var c = _position;
		
		if (Math.ceil(_position) !== Math.ceil(_positionTweened)) {
			var d = _position - _positionTweened;
			c = _positionTweened + d * 0.12;
			_positionTweened = c;
		}

		_.each(_animations, function(ani) {
			var start = ani.startPoint;
			var end = ani.endPoint;
			
			// status: RUNNING
			if (start <= c && c <= end) {
				var progress = (c - start) / (end - start);
		
				if (ani.status != 'running') {
					ani.status = 'running';
					if (ani.onStart) {
						ani.onStart();
					}
				}
				
				ani.updateAnimation(progress, c, _viewport);
				
				if (ani.onProgress) {
					ani.onProgress(progress, c, _viewport);
				}
			}
			// status: BEFORE
			else if (c < start) {
				if (ani.status != 'before') {
					ani.status = 'before';
					if (ani.onInit) {
						ani.onInit();
					}
					// progress = 0
					ani.updateAnimation(0, c, _viewport);
				}
			}
			// status: AFTER
			else if (end < c) {
				if (ani.status != 'after') {
					ani.status = 'after';
					if (ani.onEnd) {
						ani.onEnd();
					}
					
					// progress = 1.0
					ani.updateAnimation(1, c, _viewport);
				}
			}
		});
	}
	
	function setTimelinePosition(pos) {
		if (pos < 0) {
			pos = 0;
		} else if (pos > _maxPosition) {
			pos = _maxPosition;
		}
		_position = pos;

		//
		_.each(_scrollCallbacks, function(cb) {
			cb(_position, _maxPosition);
		});
	}

	function resizePage() {
		// page size
		_viewport.width = $page.width();
		_viewport.height = $page.height();

		// reset every animation
		var maxPosition = 0;
		
		PRINT('viewport', _viewport.width + 'x' + _viewport.height + '  ' + _viewport.height/2);
		_.each(_animations, function(animation) {
			if (animation.resizeCanvas) {
				animation.resizeCanvas(_viewport, maxPosition);
				if (animation._startPointType == 'end' || animation._startPointType == 'show') {
					PRINT(animation.id, animation.id + ' : ' + animation.startPoint + ' ~ ' + animation.endPoint + ' ' + maxPosition)
				}
			}
			// timeline update
			maxPosition = Math.max(maxPosition, animation.endPoint);
		});

		_maxPosition = maxPosition;
		
		if (_resizeCallback) {
			_resizeCallback();
		};
	}
	
	var requestAnimFrame = (function() {
		if (_setting.debug) {
			return function(callback, element) { window.setTimeout(callback, 2000) }
		}
		else {
			return  window.requestAnimationFrame       || 
					window.webkitRequestAnimationFrame || 
					window.mozRequestAnimationFrame    || 
					window.oRequestAnimationFrame      || 
					window.msRequestAnimationFrame     || 
					function(callback, element) { window.setTimeout(callback, 1000/60) }
		}
	})();

	var startAnimationTicker = function() {
		if (_status == 'running') {
			requestAnimFrame(startAnimationTicker);
			updateTimeline();
		}
	}
	
	
	
	////////////////////////////////////////////
	// SCROLL ANIMATION

	if ($scroller && $scroller.length > 0) {
		CONSOLE_DEBUG('= scroller found : ' + $scroller.length);

		var $thumb = $scroller.find('.thumb');
		var dragging = false;
		var scrollStart;

		// 터치 스크롤
		if ('ontouchstart' in window) {
			var touchStart = { x: 0, y: 0 };

			function touchStartHandler(e) {
				if (_preventScrollEvent) return;
				
				var ev = e.originalEvent;
				// touchStart할때 좌표값 기억
				touchStart.x = ev.touches[0].pageX;
				touchStart.y = ev.touches[0].pageY;
			}

			function touchEndHandler(e) {
			}

			function touchMoveHandler(e) {
				e.preventDefault();
				if (_preventScrollEvent) return;

				var ev = e.originalEvent;
				// touchStart 이후에 움직인 거리 계산
				var offsetX = touchStart.x - ev.touches[0].pageX;
				var offsetY = touchStart.y - ev.touches[0].pageY;	

				var newPos = _position + offsetY * 0.1;
				setTimelinePosition(newPos);
			}


			$page.bind('touchstart', touchStartHandler);
			$page.bind('touchmove', touchMoveHandler);
			$page.bind('touchend', touchEndHandler);
		}
		// 마우스 스크롤 & 마우스 휠
		else {
			function startDragging(ev) {
				if (!dragging) {
					dragging = true;
					scrollStart = ev.pageY;
					$scroller.addClass('hover');
					//
					$(document).bind('mouseup', stopDragging);
					$(document).bind('mousemove', onDragging);
				}
			}
			function stopDragging(ev) {
				dragging = false;
				scrollStart = undefined;
				$scroller.removeClass('hover');
				//
				$(document).unbind('mouseup', stopDragging);
				$(document).unbind('mousemove', onDragging);
			}
			function onDragging(ev) {
				if (dragging) {
					var pageY = ev.pageY;
					var maxY = $scroller.height() - (options.scroll_offset || 0) - $thumb.height();
					if (pageY < 0) pageY = 0;
					else if (pageY > maxY) pageY = maxY;

					// update thumb position
					$thumb.css('margin-top', pageY);

					var ratio = pageY / maxY;
					var pos = _maxPosition * ratio;
				
					setTimelinePosition(pos);
				}
			}
		
			$thumb.bind('mousedown', startDragging);
		}


		//
		_scrollCallbacks.push(function(pos, max) { // thumb movement rendering
			if (!dragging) {
				var ratio = pos / max;
				var marginTop = ($scroller.height() - (options.scroll_offset || 0) - $thumb.height()) * ratio;
				
				$thumb.css('margin-top', marginTop);

				// var num = parseInt(pos);
				// if (num > 1000) {
				// 	num = Math.floor(num / 1000) + '\n' + (num % 1000);
				// 			  	}
				// $thumb.text(num);
			}
		});

		//
		$page.bind('mousewheel', function(event, delta, deltaX, deltaY) {
			if (_preventScrollEvent) return;
			
			var newPos = _position - delta * _setting.scrollSpeed;
			setTimelinePosition(newPos);
		});

		// keyboard
		$(window).keydown(function(e) {
			if (_preventScrollEvent) return;

			if (e.keyCode == 40 || e.keyCode == 39) {
				var newPos = _position - delta * _setting.scrollSpeed;
				setTimelinePosition(newPos);
			}
			if (e.keyCode == 38 || e.keyCode == 37) {
				var newPos = _position - delta * _setting.scrollSpeed;
				setTimelinePosition(newPos);
			}
		});
	}

	var _preventScrollEvent;

	this.enableWindowScrollEvents = function(bEnable) {
		_preventScrollEvent = !bEnable;
	}



	////////////////////////////////////////////

	this.isRunning = function() {
		return _status;
	}
	this.start = function() {
		_status = 'running';
		init();
		startAnimationTicker();
		this.enableWindowScrollEvents(true);
	}
	this.stop = function() {
		_status = undefined;
		this.enableWindowScrollEvents(false);
	}
	this.addAnimation = function(ani) {
		ani.setDebugMode(_setting.debug);
		_animations.push(ani);
		// timeline position 업데이트
		resizePage();
	}
	this.addAnimationHashArray = function(params) {
		_.each(params, function(ani_param) {
			//
			if (ani_param.startPoint == 'end') {
				ani_param.startPoint = _maxPosition;
				ani_param.startPointType = 'end';
			}
			//
			var ani = new Animation(ani_param);
			ani.setDebugMode(_setting.debug);
			ani._startPointType = ani_param.startPointType;
			_animations.push(ani);

			// timeline position 업데이트
			resizePage();
		});
	}
	
	this.scrollToSection = function(section, landing_position, offset) {
		var animation = _.find(_animations, function(e) { return e.id == section });
		if (animation) {
			var landing_position = landing_position || "end";
			var offset = parseInt(offset) || 0;
			var tickInterval = 1000/60;
			var duration = 700;
			var startTime = new Date();
			var r0 = _position;
			var r1 = (landing_position == "end")? animation.startPoint + _viewport.height : animation.startPoint;
			r1 = r1 + offset;
			
			// set current position
			setTimelinePosition(r0);
			
			
			function scrollToSectionIncrement() {
				var progress = (new Date() - startTime) / duration;
				if (progress > 1) progress = 1;
				
				var value = CALC_TWEENING_VALUE(progress, 0, 1, r0, r1, TWEEN.Easing.Quadratic.Out);
				setTimelinePosition(value);
				
				if (progress < 1) {
					setTimeout(scrollToSectionIncrement, tickInterval);
				} else {
					// complete
				}
			}
			
			setTimeout(scrollToSectionIncrement, tickInterval);
		}
	}

	this.scrollToTop = function() {
		var tickInterval = 1000/60;
		var duration = 2000;
		var startTime = new Date();
		
		function scrollToTopIncrement() {
			var progress = (new Date() - startTime) / duration;
			if (progress > 1) progress = 1;
			
			var value = CALC_TWEENING_VALUE(progress, 0, 1, _position, 0, TWEEN.Easing.Quadratic.Out);
			setTimelinePosition(value);
			
			if (progress < 1) {
				setTimeout(scrollToTopIncrement, tickInterval);
			} else {
				// complete
			}
		}
		
		setTimeout(scrollToTopIncrement, tickInterval);
	}

	
	
	var timerID;
	var timerSpeed = _setting.debug ? 100 : 5;
	function timerTick() {
		_position = _position + timerTick;
		if (_position > _maxPosition) {
			clearTimerTick();
		}
	}
	function clearTimerTick() {
		if (timerID) {
			clearInterval(timerID);
			timerID = undefined;
		}
	}
	
	this.playTimerAnimation = function(speed) {
		if (speed) {
			timerSpeed = speed;
		}
		timerID = setInterval(timerTick, 20);
	}
	this.pauseTimerAnimation = function() {
		clearTimerTick();
	}
	
	
	
	
	////////////////////////////////////////////
	
	return this;
}



////////////////////////////////////////////////////////
// ANIMATION

var Animation = function(options) {
	var $element = $(options.element); // canvas
	this.id = (options.id || options.element);

	var canvas = {
		height: options.height || $element.height(),
		width: options.width || $element.width()
	}

	// canvas keyframes
	this.keyframes = options.keyframes;

	// timeline에 들어갈때의 범위
	this.startPoint = options.startPoint;
	// resizeCanvas에서 재계산함 - endPoint, duration

	this.particles = [];

	//
	this.status; // before, running, after

	var _setting = {};
	this.setDebugMode = function(b) {
		_setting.debug = b;
	}
	function CONSOLE_DEBUG() {
		if (_setting.debug) console.log.apply(console, arguments);
	}


	/////////////////////////////////////////////////

	function getFrameSet(frames, progress) {
		var current, next;
		for (var i=0; i<frames.length-1; i++) {
			current = frames[i];
			next = frames[i+1];
			if (current.position <= progress && progress <= next.position) {
				break;
			}
		}
		return { current: current, next: next }
	}
	
	function calculateCanvasPosition(frame, viewport, element) {
		if (!frame.properties) frame.properties = {}

		canvas = {
			height: options.height || element.height(),
			width: options.width || element.width()
		}

		if (_.isArray(frame.layout)) {
			_.each(frame.layout, function(v) {
				var type = v.type;
				var offset = v.offset || 0;

				assignCanvasPosition(frame, viewport, canvas, type, offset);
			});
		}
		else {
			var type = frame.layout
			var offset = frame.offset || 0;
			
			assignCanvasPosition(frame, viewport, canvas, type, offset);
		}
	}
	
	function assignCanvasPosition(frame, viewport, canvas, type, offset) {
		switch (type) {
			case 'bottom_outside':
				frame.properties[frame.layout_property || 'top'] = viewport.height + offset;
				break;
			case 'bottom_inside':
				frame.properties[frame.layout_property || 'top'] = viewport.height -1*canvas.height + offset;
				break;
			case 'top_outside':
				frame.properties[frame.layout_property || 'top'] = -1*canvas.height + offset;
				break;
			case 'top_inside':
				frame.properties[frame.layout_property || 'top'] = 0 + offset;
				break;
			case 'left_outside':
				frame.properties[frame.layout_property || 'left'] = -1*canvas.width + offset;
				break;
			case 'right_outside':
				frame.properties[frame.layout_property || 'left'] = viewport.width + offset;
				break;
			case 'vertical_center':
				frame.properties[frame.layout_property || 'top'] = (viewport.height - canvas.height)/2 + offset;
				break;
			case 'horizontal_center':
				frame.properties[frame.layout_property || 'left'] = (viewport.width - canvas.width)/2 + offset;
				break;
		}
	}
	
	
	
	/////////////////////////////////////////////////

	this.updateAnimation = function(progress, scroll_position, viewport) {
		CONSOLE_DEBUG('[CANVAS] ' + options.element + ' --------- ' + progress);

		// canvas
		var fs = getFrameSet(this.keyframes, progress);
		var currentFrame = fs.current;
		var nextFrame = fs.next;
		
		calculateCanvasPosition(currentFrame, viewport, $element);
		calculateCanvasPosition(nextFrame, viewport, $element);
		
		CONSOLE_DEBUG('current >', currentFrame.position, currentFrame.properties);
		CONSOLE_DEBUG('next    >', nextFrame.position, nextFrame.properties);

		_.each(currentFrame.properties, function(v, k) {
			var nextValue = nextFrame.properties[k];
			var value = CALC_TWEENING_VALUE(progress, currentFrame.position, nextFrame.position, v, nextValue, currentFrame.tween);
			APPLY_DOM_PROPERTY($element, k, value);

			CONSOLE_DEBUG(k, value, '(', v, nextValue, ')');
			
			if (currentFrame.onProgressValue) {
				currentFrame.onProgressValue(progress, k, value, viewport, $element);
			}
		}, this);

		if (currentFrame.onProgress) {
			currentFrame.onProgress(progress, viewport, $element);
		}
		
		// particles에 대해서도
		_.each(this.particles, function(particle) {
			if (particle._element.length == 0) return;
			
			var fs = getFrameSet(particle.keyframes, progress);
			var currentFrame = fs.current;
			var nextFrame = fs.next;

			calculateCanvasPosition(currentFrame, viewport, particle._element);
			calculateCanvasPosition(nextFrame, viewport, particle._element);
			
			_.each(currentFrame.properties, function(v, k) {
				var nextValue = nextFrame.properties[k];
				var value = CALC_TWEENING_VALUE(progress, currentFrame.position, nextFrame.position, v, nextValue, currentFrame.tween);
				APPLY_DOM_PROPERTY(particle._element, k, value);

				if (currentFrame.onProgressValue) {
					currentFrame.onProgressValue(progress, k, value, viewport, $element, particle._element);
				}
			}, this);

			if (currentFrame.onProgress) {
				currentFrame.onProgress(progress, viewport, $element, particle._element);
			}
		}, this);
	}
	
	this.resizeCanvas = function(viewport, startPoint) {
		// canvas width, height는 %단위를 사용할수있음
		if (_.isString(options.width)) {
			var v = parseFloat(options.width);
			canvas.width = viewport.width * v / 100;
		}
		if (_.isString(options.height)) {
			var v = parseFloat(options.height);
			canvas.height = viewport.height * v / 100;
		}

		// duration 재계산
		this.startPoint = options.startPoint;
		if (this._startPointType == 'end') {
			this.startPoint = startPoint;
		}

		if (options.endPoint) {
			this.endPoint = options.endPoint;
			this.duration = options.endPoint - this.startPoint;
		}
		if (_.isNumber(options.duration)) {
			this.duration = options.duration;
			this.endPoint = this.startPoint + options.duration;
		}
		else if (_.isString(options.duration)) {
			var d;
			if (options.duration == 'only_element_height') {
				// 객체 높이에 맞춤.
				d = $element.data('height') || $element.height();
				$element.css('height', d);
			}
			else if (options.duration == 'element_height') {
				// 화면높이보다 작은경우. 최소값은 화면 높이임.
				d = $element.data('height') || $element.height();
				if (d < viewport.height) {
					d = viewport.height;
				}
				$element.css('height', d);
			}
			else if (options.duration == 'viewport_height') {
				// 화면높이에 맞춤.
				d = viewport.height;
				$element.css('height', d);
			}
			else if (options.duration == 'element_viewport_height') {
				// 화면높이보다 작은경우. 최소값은 화면 높이임.
				d = $element.data('height') || $element.height();
				if (d < viewport.height) {
					d = viewport.height;
				}
				// 위아래 viewport height의 25%씩 여백 추가
				d = d + 0.5*viewport.height;
				$element.css('height', d);
				// 총 duration = element + viewport (bottom_outside => top_outside로 스크롤시키는경우)
				d = d + viewport.height;
			}
			this.duration = d;
			this.endPoint = this.startPoint + d;
		}
		
		// duration adjust
		if (options.durationAdjust == 'viewport') {
			this.duration += viewport.height;
			this.endPoint = this.startPoint + this.duration;
		}
		
		
		// offset
		var offset = options.offset;
		if (offset == 'viewport_height') {
			offset = -1*viewport.height;
		}
		
		if (_.isNumber(offset)) {
			this.startPoint += offset;
			this.endPoint += offset;
			this.startPointOffset = offset;
		}
	}

	this.onInit = function() {
		if (options.onInit) {
			options.onInit($element, canvas);
		}

		if (!options.before_no_hide) {
			$element.css('display', 'none'); // hide canvas
		}
	}
	this.onStart = function() {
		if (options.onStart) {
			options.onStart($element, canvas);;
		}
		
		$element.css('display', 'block'); // show canvas
	}
	this.onEnd = function() {
		if (options.onEnd) {
			options.onEnd($element, canvas);;
		}

		if (!options.after_no_hide) {
			$element.css('display', 'none'); // hide canvas
		}
	}
	
	this.addParticle = function(particle) {
		if (particle && particle.element) {
			this.particles.push(particle);
			//
			particle._element = $(options.element + ' ' + particle.element);
		}
	}


	/////////////////////////////////////////////////

	_.each(options.particles, function(ee) {
		this.addParticle(ee);
	}, this);

	return this;
}



////////////////////////////////////////////////////////
// HELPERS

var APPLY_DOM_PROPERTY = function(element, key, value) {
	// CSS values
	if (key.match(/top|left|bottom|right|fontSize|letterSpacing|marginTop|marginLeft|marginBottom|marginRight/)) {
	    if (_.isNumber(value)) {
	  		// element.css(key, Math.round(value)); // rounded value를 사용하면 BG떨림은 사라지나 border가 벌어진다. shit.
	  		element.css(key, value);
	    } else {
	  		element.css(key, value);
	    }
	}
	else if (key.match(/opacity/)) {
		element.css(key, value);
	}
	else if (key.match(/lineHeight/)) {
		value = _.isNumber(value) ? value + "px" : value;
		element.css(key, value);
	}
	else if (key.match(/backgroundPosition/)) {
		element.css(key, value);
	}
	//
	// TODO: background scale; 
	//
	else {
		
	}
}

var CALC_TWEENING_VALUE = function(pos, start, end, startValue, endValue, tween) {
	if (pos <= start) return startValue;
	else if (pos >= end) return endValue;

	function _calculateTweenedValue(start, end, percentComplete, tweener) {
		var delta = end - start;
		if (!tweener) tweener = TWEEN.Easing.Linear.None;
		return tweener(percentComplete) * delta + start;
	}

	var percentComplete = (pos - start) / (end - start);
	// 숫자인 경우
	if (_.isNumber(startValue)) {
		return _calculateTweenedValue(startValue, endValue, percentComplete, tween);
	}
	// '%' 값인 경우
	else if (typeof startValue == 'string' && startValue[startValue.length - 1] == '%') {
		var s = parseFloat(startValue);
		var e = parseFloat(endValue);
		return _calculateTweenedValue(s, e, percentComplete, tween) + '%';
	}
	// 그외 문자인 경우
	return (percentComplete < 1) ? startValue : endValue;
}


////////////////////////////////////////////////////////
// SIMPLE ANIMATION

function SimpleAnimation(options) {
	var element = $(options.element);
	var tickInterval = 1000/60;
	var startTime;
		
	function applyValue() {
		if (!startTime) {
			startTime = new Date();
			// START
			if (options.start) {
				options.start(element);
			}
		}
		var progress = (new Date() - startTime) / options.duration;
		if (progress > 1) progress = 1;
		else if (progress < 0) progress = 0;
		
		_.each(options.properties, function(v, k) {
			var value = CALC_TWEENING_VALUE(progress, 0, 1, v[0], v[1], options.tween);
			APPLY_DOM_PROPERTY(element, k, value);
			
			if (options.debug) console.log(k, value);
		});
		
		if (progress < 1) {
			setTimeout(applyValue, tickInterval);
		} else {
			// COMPLETE
			if (options.complete) {
				options.complete(element);
			}
		}
	}
	
	setTimeout(applyValue, (options.delay || 0) + tickInterval);
}
