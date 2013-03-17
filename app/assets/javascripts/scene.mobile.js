var selectPage = function(ele) {
	$("#lnb a[data-target='" + ele + "']").addClass("selected");
}

var deselectPage = function(ele) {
	$("#lnb a[data-target='" + ele + "']").removeClass("selected");
}


var partialMovement = {
	currentScene: function(last_scene, progress) {
		return parseInt((last_scene * progress) / 100);
	},
	
	move: function(options) {
		var $particle = $(options.particle);
		var last_scene = options.last_scene;
		var progress = options.progress;
		var direction = options.direction;
		var size = options.size || "normal";
		
		if (progress == 0) {
			return;
		}

		var current_scene = partialMovement.currentScene(last_scene, progress);
		
		if (current_scene < 10) {
			if (direction == "top" || direction == "bottom") {
				var type = (size == "normal")? "vertical" : "large_vertical";
			};
			
			$particle.css(direction, partialMovement[type][current_scene]);
			$particle.show();
		}
		else {
			$particle.hide();
		}
	},
	vertical: {
		0: 0,
		1: 48/2,
		2: 88/2,
		3: 128/2,
		4: 168/2,
		5: 208/2,
		6: 248/2,
		7: 288/2,
		8: 328/2,
		9: 358/2
	},
	large_vertical: {
		0: 0,
		1: 82/2,
		2: 120/2,
		3: 168/2,
		4: 224/2,
		5: 288/2,
		6: 370/2,
		7: 466/2
	}
};


var ss;
function createScrollAnimation() {	
	$("*[data-target]").click(function(e) {
		e.preventDefault();
		ss.scrollToSection($(this).attr("data-target"), $(this).attr("data-target-landing-position"), $(this).attr("data-target-offset"));
		$(this).blur();
	});

	$("#top").click(function(e) {
		e.preventDefault();
		ss.scrollToTop();
	})



	//
	ss = new AnimationPlayer({
		element: '#container',
		scroller: '#scrollbar',
		// debug: true,
		mobileScrollSpeed: 0.3,
		// acceleration: false,
		resizeCallback: function() {
			if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10 && $("body").width() <= 1250) {
				$("#lnb").css({
					top: "165px",
					right: 0
				})
			}
			else if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10 && $("body").width() > 1250) {
				$("#lnb").css({
					top: "63px",
					right: "167px"
				})
			}
		}
	});
	ss.addAnimationHashArray([

		/////////////////////////////////////////
		// LOADING & INTRO
		{
			element: '#loading',
			startPoint: 0,
			endPoint: 100,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 1 },
					onProgress: function(progress, viewport, element) {
						selectPage("#intro .copy1");
					}
				},
				{
					position: 1,
					properties: { opacity: 0 }
				}
			]
		},
		{
			element: '#intro .copy1',
			before_no_hide: true,
			startPoint: "end",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					properties: { opacity: 1, top: "50%" }
				},
				{
					position: 0.5,
					properties: { opacity: 1, top: "50%" }
				},
				{
					position: 1,
					properties: { opacity: 0, top: "-100%" }
				}
			]
		},
		{
			element: '#intro .copy2',
			startPoint: "end",
			duration: "viewport_height",
			offset: -100,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0, top: "100%" }
				},
				{
					position: 0.3,
					properties: { opacity: 1, top: "50%" }
				},
				{
					position: 0.7,
					properties: { opacity: 1, top: "50%" }
				},
				{
					position: 1,
					properties: { opacity: 0, top: "-100%" }
				}
			]
		},
		{
			element: '#intro .copy3',
			startPoint: "end",
			duration: "viewport_height",
			offset: -100,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0, top: "100%" }
				},
				{
					position: 0.30,
					properties: { opacity: 1, top: "50%" }
				},
				{
					position: 0.7,
					properties: { opacity: 1, top: "50%" }
				},
				{
					position: 1,
					properties: { opacity: 0, top: "-100%" }
				}
			]
		},
		/////////////////////////////////////////
		// SECTION 1
		{
			element: '#section1 .wrapper',
			after_no_hide: true,
			startPoint: "end",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0, top: "100%" },
					onProgress: function(progress, viewport, element) {
						if (progress >= 0.7) {
							$("#header h1").addClass("hide_when_smallsize");
							$("#intro").hide();
						}
						else {
							$("#header h1").removeClass("hide_when_smallsize");
							$("#intro").show();
						}
					}
				},
				{
					position: 1,
					properties: { opacity: 1, top: "48%" }
				}
			]
		},
		{
			element: '#section1',
			before_no_hide: true,
			startPoint: "end",
			duration: "viewport_height",
			offset: 400,
			keyframes: [
				{
					position: 0,
					layout: 'top_inside',
					onProgress: function(progress, viewport, element) {
						if (progress <= 0.5) {
							selectPage("#intro .copy1");
						}
						else {
							deselectPage("#intro .copy1");
						}
					}
				},
				{
					position: 1,
					layout: 'top_outside'
				}
			]
		},

		/////////////////////////////////////////
		// SECTION: global
		{
			element: '#section_global',
			after_no_hide: true,
			startPoint: "end",
			offset: "viewport_height",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'bottom_outside',
					onProgress: function(progress, viewport, element) {
						if (progress <= 0.5) {
							deselectPage("#section_global");
						}
						else {
							selectPage("#section_global");
						}
					}
				},
				{
					position: 1,
					layout: 'top_inside'
				}
			]
		},
		{
			element: '#section_global .intro1',
			before_no_hide: true,
			startPoint: "end",
			duration: 800,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 1, top: "50%" }
				},
				{
					position: 0.2,
					properties: { opacity: 1, top: "50%" }
				},
				{
					position: 1,
					properties: { opacity: 0, top: "0%" }
				},
			]
		},
		{
			element: '#section_global .intro2',
			before_no_hide: true,
			startPoint: "end",
			offset: -200,
			duration: 800 * 2,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0, top: "100%" }
				},
				{
					position: 0.30,
					properties: { opacity: 1, top: "50%" }
				},
				{
					position: 0.7,
					properties: { opacity: 1, top: "50%" }
				},
				{
					position: 1,
					properties: { opacity: 0, top: "0%" }
				}
			]
		},
		{
			element: '#section_global .scene1',
			after_no_hide: true,
			startPoint: "end",
			offset: -200,
			duration: 600,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0 }
				},
				{
					position: 1,
					properties: { opacity: 1 }
				},
			]
		},
		{
			element: '#section_global .scene1',
			after_no_hide: true,
			startPoint: "end",
			duration: 2000,
			keyframes: [
				{
					position: 0,
					onProgress: function(progress, viewport, element) {
						var pg = progress * 100;
		
						if (pg <= 0) {
							return;
						}
		
						var last_scene = 31;
						var current_scene = parseInt((last_scene * pg) / 100);
						
						var image_path = imageTable.section10[current_scene];
						var $img = element.find("img");
						if ($img.attr("src") != image_path) {
							$img.attr("src", image_path);
							$("#section_global_map").find("area").attr("coords", imageMapPositions["mobile_global"][current_scene]["site"]);
						}
					}
				},
				{
					position: 1,
					properties: { opacity: 1 }
				}
			]
		},
		{
			element: '#section_global',
			before_no_hide: true,
			startPoint: "end",
			offset: 400,
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'top_inside',
					onProgress: function(progress, viewport, element) {
						if (progress == 0) {}
						else if (progress <= 0.5) {
							selectPage("#section_global");
						}
						else {
							deselectPage("#section_global");
						}
					}
				},
				{
					position: 1,
					layout: 'top_outside'
				}
			]
		},


		/////////////////////////////////////////
		// SECTION 2
		{
			element: '#section2',
			after_no_hide: true,
			startPoint: "end",
			offset: "viewport_height",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'bottom_outside',
					onProgress: function(progress, viewport, element) {
						if (progress <= 0.5) {
							deselectPage("#section2");
						}
						else {
							selectPage("#section2");
						}
					}
				},
				{
					position: 1,
					layout: 'top_inside'
				}
			]
		},
		{
			element: "#section2 .intro",
			before_no_hide: true,
			after_no_hide: true,
			startPoint: "end",
			duration: 800,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 1 }
				},
				{
					position: 0.2,
					properties: { opacity: 1 }
				},
				{
					position: 1,
					properties: { opacity: 0 }
				}
			]
		},
		{
			element: '#section2 .wrapper',
			before_no_hide: true,
			after_no_hide: true,
			startPoint: "end",
			duration: 400,
			offset: -200,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0 }
				},
				{
					position: 1,
					properties: { opacity: 1 }
				}
			]
		},
		{
			element: '#section2 .wrapper',
			before_no_hide: true,
			after_no_hide: true,
			startPoint: "end",
			offset: 400,
			duration: "only_element_height",
			keyframes: [
				{ position: 0 },
				{ position: 1 }
			],
			particles: [
				{
					element: '.top',
					keyframes: [
						{
							position: 0,
							properties: { top: 0 },
							onProgress: function(progress, viewport, element, particle) {
								var last_scene = 23;
								partialMovement.move({
									particle: particle,
									last_scene: last_scene,
									progress: progress * 100,
									direction: "top"
								});
							}
						},
						{
							position: 1
						}
					]
				},
				{
					element: '.bottom',
					keyframes: [
						{
							position: 0,
							properties: { bottom: 0 },
							onProgress: function(progress, viewport, element, particle) {
								var last_scene = 23;
								partialMovement.move({
									particle: particle,
									last_scene: last_scene,
									progress: progress * 100,
									direction: "bottom"
								});
							}
						},
						{
							position: 1
						}
					]
				},
				{
					element: ".left",
					keyframes: [
						{
							position: 0,
							properties: { left: 0, opacity: 1 }
						},
						{
							position: 0.2,
							properties: { left: -40, opacity: 1 },
							onProgress: function(progress, viewport, element, particle) {
								if (progress <= 0.8) {
									particle.show();
								}
								else{
									particle.hide();
								}
							}
						},
						{
							position: 0.35,
							properties: { left: 10, opacity: 0 }
						},
						{
							position: 1,
							properties: { left: 10, opacity: 0 }
						}
					]
				},
				{
					element: ".right",
					keyframes: [
						{
							position: 0,
							properties: { right: 0, opacity: 1 }
						},
						{
							position: 0.2,
							properties: { right: -40, opacity: 1 },
							onProgress: function(progress, viewport, element, particle) {
								if (progress <= 0.5) {
									particle.show();
								}
								else{
									particle.hide();
								}
							}
						},
						{
							position: 0.35,
							properties: { right: 10, opacity: 0 }
						},
						{
							position: 1,
							properties: { right: 10, opacity: 0 }
						}
					]
				},
				{
					element: 'div[data-partial="masking"]',
					keyframes: [
						{
							position: 0,
							onProgress: function(progress, viewport, element, particle) {
								var pg = progress * 100;

								if (pg <= 0) {
									particle.hide();
									return;
								}
								particle.show();

								var last_scene = 23;
								var current_scene = parseInt((last_scene * pg) / 100);
								var image_path = imageTable.section2[current_scene];
								var $img = particle.find("img");
								if ($img.attr("src") != image_path) {
									$img.attr("src", image_path);
								}
								
								// if (current_scene <= 11) {
								// 	$("#section2 .scene1 img").css("zIndex", 1000);
								// }
								// else {
								// 	$("#section2 .scene1 img").css("zIndex", 0);
								// }
							}
						},
						{
							position: 1
						}
					]
				}
			]
		},
		{
			element: '#section2 .wrapper .scene2',
			before_no_hide: true,
			after_no_hide: true,
			startPoint: "end",
			duration: "only_element_height",
			keyframes: [
				{
					position: 0,
					properties: { marginTop: -142 }
				},
				{
					position: 1,
					properties: { marginTop: (-845 / 2) + 80 }
				}
			],
			particles: [
				{
					element: ".movie",
					keyframes: [
						{
							position: 0,
							properties: { opacity: 0 }
						},
						{
							position: 0.5,
							properties: { opacity: 1 }
						},
						{
							position: 1,
							properties: { opacity: 1 }
						}
					]
				},
				{
					element: ".text2",
					keyframes: [
						{
							position: 0,
							properties: { opacity: 0, marginTop: -174 }
						},
						{
							position: 1,
							properties: { opacity: 1, marginTop: 115 }
						}
					]
				}
			]
		},
		{
			element: '#section2',
			before_no_hide: true,
			startPoint: "end",
			offset: 400,
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'top_inside',
					onProgress: function(progress, viewport, element) {
						if (progress == 0) {}
						else if (progress <= 0.5) {
							selectPage("#section2");
						}
						else {
							deselectPage("#section2");
						}
					}
				},
				{
					position: 1,
					layout: 'top_outside'
				}
			],
			particles: [
				{
					element: ".scene2",
					keyframes: [
						{
							position: 0,
							properties: { opacity: 1 }
						},
						{
							position: 0.8,
							properties: { opacity: 1 }
						},
						{
							position: 1,
							properties: { opacity: 0 }
						}
					]
				}
			]
		},

		/////////////////////////////////////////
		// SECTION 3: product
		{
			element: '#section3',
			after_no_hide: true,
			startPoint: "end",
			offset: "viewport_height",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'bottom_outside',
					onProgress: function(progress, viewport, element) {
						if (progress <= 0.5) {
							deselectPage("#section3");
						}
						else {
							selectPage("#section3");
						}
					}
				},
				{
					position: 1,
					layout: 'top_inside'
				}
			]
		},
		{
			element: '#section3',
			before_no_hide: true,
			startPoint: "end",
			offset: 600,
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'top_inside'
				},
				{
					position: 1,
					layout: 'top_outside'
				}
			]
		},
		
		/////////////////////////////////////////
		// SECTION 4
		{
			element: '#section4',
			after_no_hide: true,
			startPoint: "end",
			offset: "viewport_height",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'bottom_outside'
				},
				{
					position: 1,
					layout: 'top_inside'
				}
			]
		},
		{
			element: "#section4 .intro",
			before_no_hide: true,
			after_no_hide: true,
			startPoint: "end",
			duration: 800,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 1 }
				},
				{
					position: 0.2,
					properties: { opacity: 1 }
				},
				{
					position: 1,
					properties: { opacity: 0 }
				}
			]
		},
		{
			element: '#section4 .wrapper',
			after_no_hide: true,
			startPoint: "end",
			duration: 400,
			offset: -200,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0 }
				},
				{
					position: 1,
					properties: { opacity: 1 }
				}
			]
		},
		{
			element: '#section4 .wrapper',
			before_no_hide: true,
			after_no_hide: true,
			startPoint: "end",
			offset: 400,
			duration: "only_element_height",
			keyframes: [
				{
					position: 0
				},
				{
					position: 1
				}
			],
			particles: [
				{
					element: '.top',
					keyframes: [
						{
							position: 0,
							properties: { marginTop: 0, opacity: 1 }
						},
						{
							position: 0.8,
							properties: { marginTop: 155, opacity: 0.2}
						},
						{
							position: 1,
							properties: { marginTop: 155, opacity: 0 }
						}
					]
				},
				{
					element: '.bottom',
					keyframes: [
						{
							position: 0,
							properties: { marginBottom: 0, opacity: 1 }
						},
						{
							position: 0.8,
							properties: { marginBottom: 155, opacity: 0.2}
						},
						{
							position: 1,
							properties: { marginBottom: 155, opacity: 0 }
						}
					]
				},
				{
					element: '.left',
					keyframes: [
						{
							position: 0,
							properties: { marginLeft: 0, opacity: 1 }
						},
						{
							position: 0.8,
							properties: { marginLeft: 155, opacity: 0.2}
						},
						{
							position: 1,
							properties: { marginLeft: 155, opacity: 0 }
						}
					]
				},
				{
					element: '.right',
					keyframes: [
						{
							position: 0,
							properties: { marginRight: 0, opacity: 1 }
						},
						{
							position: 0.8,
							properties: { marginRight: 156, opacity: 0.2}
						},
						{
							position: 1,
							properties: { marginRight: 156, opacity: 0 }
						}
					]
				}
			]
		},
		{
			element: '#section4 div[data-partial="masking"]',
			after_no_hide: true,
			startPoint: "end",
			offset: -100,
			duration: "only_element_height",
			keyframes: [
				{
					position: 0,
					onProgress: function(progress, viewport, element) {
						var pg = progress * 100;
						if (pg <= 0) {
							$("#section4 .scene2").hide();
							return;
						}
						$("#section4 .scene2").show();
		
						var last_scene = 17;
						var current_scene = parseInt((last_scene * pg) / 100);
						var image_path = imageTable.section4[current_scene];
						var $img = element.find("img");
						if ($img.attr("src") != image_path) {
							$img.attr("src", image_path);
						}
					}
				},
				{
					position: 1
				}
			]
		},
		{
			element: "#section4 .movie",
			after_no_hide: true,
			startPoint: "end",
			duration: "only_element_height",
			offset: -100,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0 }
				},
				{
					position: 0.5,
					properties: { opacity: 1 }
				},
				{
					position: 1,
					properties: { opacity: 1 }
				}
			]
		},
		{
			element: '#section4 .texts',
			after_no_hide: true,
			startPoint: "end",
			duration: "only_element_height",
			offset: -300,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0 },
					onProgress: function(progress, viewport, element) {
						if (progress >= 0.18) {
							element.show();
						}
						else {
							element.hide();
						}
					}
				},
				{
					position: 1,
					properties: { opacity: 1 }
				}
			],
			particles: [
				{
					element: ".left2",
					keyframes: [
						{
							position: 0,
							properties: { top: 120 }
						},
						{
							position: 0.5,
							properties: { top: 0 }
						},
						{
							position: 1,
							properties: { top: 0 }
						}
					]
				},
				{
					element: ".right2",
					keyframes: [
						{
							position: 0,
							properties: { bottom: 120 }
						},
						{
							position: 0.5,
							properties: { bottom: 0 }
						},
						{
							position: 1,
							properties: { bottom: 0 }
						}
					]
				}
			]
		},
		{
			element: '#section4',
			before_no_hide: true,
			startPoint: "end",
			offset: 400,
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'top_inside'
				},
				{
					position: 1,
					layout: 'top_outside'
				}
			]
		},

		/////////////////////////////////////////
		// SECTION 5: product
		{
			element: '#section5',
			after_no_hide: true,
			startPoint: "end",
			offset: "viewport_height",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'bottom_outside'
				},
				{
					position: 1,
					layout: 'top_inside'
				}
			]
		},
		{
			element: '#section5',
			before_no_hide: true,
			startPoint: "end",
			offset: 600,
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'top_inside'
				},
				{
					position: 1,
					layout: 'top_outside'
				}
			]
		},

		/////////////////////////////////////////
		// SECTION 6
		{
			element: '#section6',
			after_no_hide: true,
			startPoint: "end",
			offset: "viewport_height",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'bottom_outside'
				},
				{
					position: 1,
					layout: 'top_inside'
				}
			]
		},
		{
			element: "#section6 .intro",
			before_no_hide: true,
			after_no_hide: true,
			startPoint: "end",
			duration: 800,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 1 }
				},
				{
					position: 0.2,
					properties: { opacity: 1 }
				},
				{
					position: 1,
					properties: { opacity: 0 }
				}
			]
		},
		{
			element: '#section6 .wrapper',
			after_no_hide: true,
			startPoint: "end",
			duration: 400,
			offset: -200,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0 }
				},
				{
					position: 1,
					properties: { opacity: 1 }
				},
			]
		},
		{
			element: '#section6 .wrapper',
			before_no_hide: true,
			after_no_hide: true,
			startPoint: "end",
			offset: 400,
			duration: "only_element_height",
			keyframes: [
				{
					position: 0
				},
				{
					position: 1
				}
			],
			particles: [
				{
					element: '.top',
					keyframes: [
						{
							position: 0,
							properties: { top: 0 },
							onProgress: function(progress, viewport, element, particle) {
								var last_scene = 23;
								partialMovement.move({
									particle: particle,
									last_scene: last_scene,
									progress: progress * 100,
									direction: "top"
								});
							}
						},
						{
							position: 1
						}
					]
				},
				{
					element: '.bottom',
					keyframes: [
						{
							position: 0,
							properties: { bottom: 0 },
							onProgress: function(progress, viewport, element, particle) {
								var last_scene = 23;
								partialMovement.move({
									particle: particle,
									last_scene: last_scene,
									progress: progress * 100,
									direction: "bottom"
								});
							}
						},
						{
							position: 1
						}
					]
				},
				{
					element: ".left",
					keyframes: [
						{
							position: 0,
							properties: { left: 0, opacity: 1 }
						},
						{
							position: 0.2,
							properties: { left: -40, opacity: 1 },
							onProgress: function(progress, viewport, element, particle) {
								if (progress <= 0.8) {
									particle.show();
								}
								else{
									particle.hide();
								}
							}
						},
						{
							position: 0.35,
							properties: { left: 10, opacity: 0 }
						},
						{
							position: 1,
							properties: { left: 10, opacity: 0 }
						}
					]
				},
				{
					element: ".right",
					keyframes: [
						{
							position: 0,
							properties: { right: 0, opacity: 1 }
						},
						{
							position: 0.2,
							properties: { right: -40, opacity: 1 },
							onProgress: function(progress, viewport, element, particle) {
								if (progress <= 0.8) {
									particle.show();
								}
								else{
									particle.hide();
								}
							}
						},
						{
							position: 0.35,
							properties: { right: 10, opacity: 0 }
						},
						{
							position: 1,
							properties: { right: 10, opacity: 0 }
						}
					]
				},
				{
					element: 'div[data-partial="masking"]',
					keyframes: [
						{
							position: 0,
							onProgress: function(progress, viewport, element, particle) {
								var pg = progress * 100;

								if (pg <= 0) {
									$("#section6 .wrapper .scene2").hide();
									return;
								}
								$("#section6 .wrapper .scene2").show();

								var last_scene = 23;
								var current_scene = parseInt((last_scene * pg) / 100);
								var image_path = imageTable.section2[current_scene];
								var $img = particle.find("img");
								if ($img.attr("src") != image_path) {
									$img.attr("src", image_path);
								}
							}
						},
						{
							position: 1
						}
					]
				}
			]
		},
		{
			element: '#section6 .wrapper .scene2',
			after_no_hide: true,
			startPoint: "end",
			duration: "only_element_height",
			keyframes: [
				{
					position: 0,
					properties: { marginTop: -142 }
				},
				{
					position: 1,
					properties: { marginTop: (-845 / 2) + 80 }
				}
			],
			particles: [
				{
					element: ".movie",
					keyframes: [
						{
							position: 0,
							properties: { opacity: 0 }
						},
						{
							position: 0.5,
							properties: { opacity: 1 }
						},
						{
							position: 1,
							properties: { opacity: 1 }
						}
					]
				},
				{
					element: ".text2",
					keyframes: [
						{
							position: 0,
							properties: { opacity: 0, marginTop: -174 }
						},
						{
							position: 1,
							properties: { opacity: 1, marginTop: 115 }
						}
					]
				}
			]
		},
		{
			element: '#section6',
			before_no_hide: true,
			startPoint: "end",
			offset: 400,
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'top_inside'
				},
				{
					position: 1,
					layout: 'top_outside'
				}
			],
			particles: [
				{
					element: ".scene2",
					keyframes: [
						{
							position: 0,
							properties: { opacity: 1 }
						},
						{
							position: 0.8,
							properties: { opacity: 1 }
						},
						{
							position: 1,
							properties: { opacity: 0 }
						}
					]
				}
			]
		},

		/////////////////////////////////////////
		// SECTION 7: product
		{
			element: '#section7',
			after_no_hide: true,
			startPoint: "end",
			offset: "viewport_height",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'bottom_outside'
				},
				{
					position: 1,
					layout: 'top_inside'
				}
			]
		},
		{
			element: '#section7',
			before_no_hide: true,
			startPoint: "end",
			offset: 600,
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'top_inside'
				},
				{
					position: 1,
					layout: 'top_outside'
				}
			]
		},

		/////////////////////////////////////////
		// SECTION 8
		{
			element: '#section8',
			after_no_hide: true,
			startPoint: "end",
			offset: "viewport_height",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'bottom_outside'
				},
				{
					position: 1,
					layout: 'top_inside'
				}
			]
		},
		{
			element: "#section8 .intro",
			before_no_hide: true,
			after_no_hide: true,
			startPoint: "end",
			duration: 800,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 1 }
				},
				{
					position: 0.2,
					properties: { opacity: 1 }
				},
				{
					position: 1,
					properties: { opacity: 0 }
				}
			]
		},
		{
			element: '#section8 .wrapper',
			after_no_hide: true,
			startPoint: "end",
			duration: 400,
			offset: -200,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0 }
				},
				{
					position: 1,
					properties: { opacity: 1 }
				}
			]
		},
		{
			element: '#section8 .wrapper',
			before_no_hide: true,
			after_no_hide: true,
			startPoint: "end",
			offset: 400,
			duration: "only_element_height",
			keyframes: [
				{
					position: 0
				},
				{
					position: 1
				}
			],
			particles: [
				{
					element: '.top',
					keyframes: [
						{
							position: 0,
							properties: { marginTop: 0, opacity: 1 }
						},
						{
							position: 0.8,
							properties: { marginTop: 155, opacity: 0.2}
						},
						{
							position: 1,
							properties: { marginTop: 155, opacity: 0 }
						}
					]
				},
				{
					element: '.bottom',
					keyframes: [
						{
							position: 0,
							properties: { marginBottom: 0, opacity: 1 }
						},
						{
							position: 0.8,
							properties: { marginBottom: 155, opacity: 0.2}
						},
						{
							position: 1,
							properties: { marginBottom: 155, opacity: 0 }
						}
					]
				},
				{
					element: '.left',
					keyframes: [
						{
							position: 0,
							properties: { marginLeft: 0, opacity: 1 }
						},
						{
							position: 0.8,
							properties: { marginLeft: 155, opacity: 0.2}
						},
						{
							position: 1,
							properties: { marginLeft: 155, opacity: 0 }
						}
					]
				},
				{
					element: '.right',
					keyframes: [
						{
							position: 0,
							properties: { marginRight: 0, opacity: 1 }
						},
						{
							position: 0.8,
							properties: { marginRight: 156, opacity: 0.2}
						},
						{
							position: 1,
							properties: { marginRight: 156, opacity: 0 }
						}
					]
				}
			]
		},
		{
			element: '#section8 div[data-partial="masking"]',
			after_no_hide: true,
			startPoint: "end",
			offset: -100,
			duration: "only_element_height",
			keyframes: [
				{
					position: 0,
					onProgress: function(progress, viewport, element) {
						var pg = progress * 100;
						if (pg <= 0) {
							$("#section8 .scene2").hide();
							return;
						}
						$("#section8 .scene2").show();
		
						var last_scene = 17;
						var current_scene = parseInt((last_scene * pg) / 100);
						var image_path = imageTable.section4[current_scene];
						var $img = element.find("img");
						if ($img.attr("src") != image_path) {
							$img.attr("src", image_path);
						}
					}
				},
				{
					position: 1
				}
			]
		},
		{
			element: "#section8 .movie",
			after_no_hide: true,
			startPoint: "end",
			duration: "only_element_height",
			offset: -100,
			keyframes: [
				{
					position: 0,
					properties: { opacity: 0 }
				},
				{
					position: 0.5,
					properties: { opacity: 1 }
				},
				{
					position: 1,
					properties: { opacity: 1 }
				}
			]
		},
		{
			element: '#section8 .texts',
			after_no_hide: true,
			startPoint: "end",
			duration: "only_element_height",
			offset: -300,
			keyframes: [
				{ position: 0 },
				{ position: 1 }
			],
			particles: [
				{
					element: ".left2",
					keyframes: [
						{
							position: 0,
							properties: { top: 120 }
						},
						{
							position: 0.5,
							properties: { top: 0 }
						},
						{
							position: 1,
							properties: { top: 0 }
						}
					]
				},
				{
					element: ".right2",
					keyframes: [
						{
							position: 0,
							properties: { bottom: 120 }
						},
						{
							position: 0.5,
							properties: { bottom: 0 }
						},
						{
							position: 1,
							properties: { bottom: 0 }
						}
					]
				}
			]
		},
		{
			element: '#section8',
			before_no_hide: true,
			startPoint: "end",
			offset: 400,
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'top_inside'
				},
				{
					position: 1,
					layout: 'top_outside'
				}
			]
		},


		/////////////////////////////////////////
		// SECTION 9: product
		{
			element: '#section9',
			after_no_hide: true,
			startPoint: "end",
			offset: "viewport_height",
			duration: "viewport_height",
			keyframes: [
				{
					position: 0,
					layout: 'bottom_outside'
				},
				{
					position: 1,
					layout: 'top_inside'
				}
			]
		},
	]);
	
	ss.start();
}