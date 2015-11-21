/**
 * Copyright Notice 
 * 
 * COPYRIGHT© 2015 Build 82. All rights reserved. No part of this software
 * and constituent code may be reproduced in any form, including video recording, 
 * photocopying, downloading, broadcasting or transmission electronically, without 
 * prior written consent of Build 82. Copyright protection includes output
 * generated by this software as displayed in print or in digital form, such as 
 * icons, interfaces, and the like.
 * 
 * Content Warranty 
 * 
 * The information in this document is subject to change without notice. THIS 
 * DOCUMENT IS PROVIDED "AS IS" AND BUILD 82 MAKES NO WARRANTY, EXPRESS, 
 * IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO ALL WARRANTIES OF 
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE OR NONINFRINGEMENT. 
 * Build 82 shall not be liable for errors contained herein or for 
 * incidental or consequential damages in connection with the furnishing, 
 * performance or use of this material.
 */

define(['dojo/dom',
		'dojo/dom-construct',
		'dojo/dom-class',
        'dojo/on',
		'dojo/_base/fx',
		'build82/controller/ga',
		'build82/utility/reimg'
        ], 
    function(dom, domConstruct, domClass, on, baseFx, ga, reimg) {
		var config = {
			interface_id: 'hero',						// element to fade in & out with redraw
			canvasContainer_id: 'canvasContainer',		// element to create canvases in
			staticImage_url: 'images/ifoe_white.svg',	// transparent with white graphic
			matte_clr: "#013ba6",						// flag solid color
			defaultSize: {								// default size
				width: 900,
				height: 600
			},
			control: {									
				select_id: 'control_image_selector',	// file select element
				generate_id: 'control_image_generate',	// generate button
				save_id: 'control_image_save'			// save button
			},
			form_id: 'control_form'						// form with "blendmode", "opacity", and "size"
		},
		data = {
			canvas: null,
			canvasListener: null,
			staticImage: null,
			userImage: null,
			changed: false
		},
		
		/**
		 * loads the 'overlay' image (flag, banner, etc.)
		 * @returns void
		 */
		loadStaticImage = function(param_func) {
			data.staticImage = new Image();
			data.staticImage.addEventListener("load", function() {
				data.changed = true;
				param_func();
				data.changed = false;
			}, this);
			
			data.staticImage.src = config.staticImage_url;
		},
		
		/**
		 * loads the user selected image
		 * @param event evt input:chane event
		 * @returns void
		 */
		loadUserImage = function(param_evt) {
			for(var i = 0; i < param_evt.target.files.length; i++) {
				var file = param_evt.target.files[i];

				data.userImage = new Image();
				var reader = new FileReader();
				reader.onloadend = function() {
					data.userImage.src = reader.result;
					setTimeout(function(){
						handleGenerate();
					}, 10);
				}
				
				reader.readAsDataURL(file);
			}
		},
			
		/**
		 * disable inputs while loading/processing (prevents browser crash)
		 * @param param_bool bool true to disable inputs, false to enable
		 * @returns void
		 */
		inputDisable = function(param_disabled_bool) {
			dom.byId(config.control.select_id).disabled = param_disabled_bool;
			dom.byId(config.control.generate_id).disabled = param_disabled_bool;
			dom.byId(config.control.save_id).disabled = param_disabled_bool;
			dom.byId(config.form_id)['blendmode'].disabled = param_disabled_bool;
			dom.byId(config.form_id)['opacity'].disabled = param_disabled_bool;
			dom.byId(config.form_id)['size'].disabled = param_disabled_bool;
			dom.byId(config.form_id)['scale'].disabled = param_disabled_bool;
			dom.byId(config.form_id)['smoothing'].disabled = param_disabled_bool;
			dom.byId(config.form_id)['matte'].disabled = param_disabled_bool;
			
			if(param_disabled_bool) {
				document.body.style.cursor = "wait";
			}
			else {
				document.body.style.cursor = "default";
			}
		},
		
		/**
		 * composites the images together in the configured canvas element (control via html inputs)
		 * @returns void
		 */
		generate = function() {
			inputDisable(true);
			
			// google analytics event
			ga('send', {
				hitType: 'event',
				eventCategory: 'Processing',
				eventAction: 'generate',
				eventLabel: 'blendmode:'+dom.byId(config.form_id)['blendmode'].value+
							' opacity:'+dom.byId(config.form_id)['opacity'].value+
							' smoothing:'+dom.byId(config.form_id)['smoothing'].checked
			});

			// default suggestion
			if(!data.changed) {
				dom.byId(config.form_id)['blendmode'].value = "hard-light";
				dom.byId(config.form_id)['opacity'].value = "40";
				data.changed = true;
			}
			
			// create drawing context & trigger redraw
			destroyOldContext();
			var ctx = createPreviewContext();
			redrawBrowser();
			
			// draw images
			if(data.userImage) {
				centerImage(ctx, data.userImage, null, 100, "source-over", 100);
			}
			
			if(data.staticImage) {
				var matte_str = dom.byId(config.form_id)['matte'].checked ? config.matte_clr : null;
				centerImage(ctx, data.staticImage, matte_str, dom.byId(config.form_id)['scale'].value, dom.byId(config.form_id)['blendmode'].value, dom.byId(config.form_id)['opacity'].value);
			}
			
			inputDisable(false);
			dom.byId(config.control.generate_id).disabled = true;
		},
		
		/**
		 * remove preview canvas
		 * @returns void
		 */
		destroyOldContext = function() {
			if(data.canvas) {
				domConstruct.destroy(data.canvas);
				delete data.canvas;
			}
			
			if(data.canvasListener) {
				data.canvasListener.remove();
				data.canvasListener = null;
			}
			
			dom.byId(config.canvasContainer_id).innerHTML = null;
		},
		
		/**
		 * prepare previw canvas
		 * @returns void
		 */
		createPreviewContext = function() {
			data.canvas = domConstruct.create('canvas');
			data.canvas.className = "responsive";
			domConstruct.place(data.canvas, config.canvasContainer_id, "first");
			data.canvasListener = on(data.canvas, 'click', handleImageClick);
			
			// set size
			if(dom.byId(config.form_id)['size'].value == "user" && data.userImage) {
				var container = {
					width: dom.byId(config.canvasContainer_id).offsetWidth,
					height: config.defaultSize.height
				};
				
				if(data.userImage.height < container.height && data.userImage.width < container.width) {
					// smaller than flag
					data.canvas.className = "";
					data.canvas.height = data.userImage.height;
					data.canvas.width = data.userImage.width;
				}
				else {
					// assume wide image
					data.canvas.width = container.width;
					data.canvas.height = data.userImage.height * (container.width/data.userImage.width);

					if(data.canvas.height > container.height) {
						data.canvas.className = "";
						data.canvas.height = container.height;
						data.canvas.width = data.userImage.width * (container.height/data.userImage.height);
					}
				}
			}
			else {
				data.canvas.width = config.defaultSize.width;
				data.canvas.height = config.defaultSize.height;
			}
			
			// setup context & smoothing
			var ctx = data.canvas.getContext("2d");
			ctx.mozImageSmoothingEnabled = dom.byId(config.form_id)['smoothing'].checked;
			ctx.msImageSmoothingEnabled = dom.byId(config.form_id)['smoothing'].checked;
			ctx.imageSmoothingEnabled = dom.byId(config.form_id)['smoothing'].checked;
			
			return ctx;
		},
			
		/**
		 * prepare final export canvas
		 * @returns void
		 */
		createFinalContext = function() {
			var canvas = domConstruct.create('canvas');
			
			// set size
			if(dom.byId(config.form_id)['size'].value == "user" && data.userImage) {
				canvas.height = data.userImage.height;
				canvas.width = data.userImage.width;
			}
			else {
				canvas.height = config.defaultSize.height;
				canvas.width = config.defaultSize.width;
			}
			
			// setup context & smoothing
			var ctx = canvas.getContext("2d");
			ctx.mozImageSmoothingEnabled = dom.byId(config.form_id)['smoothing'].checked;
			ctx.msImageSmoothingEnabled = dom.byId(config.form_id)['smoothing'].checked;
			ctx.imageSmoothingEnabled = dom.byId(config.form_id)['smoothing'].checked;
			
			return ctx;
		},
			
		/**
		 * force browser refresh to fix Chrome display bug
		 * @returns void
		 */
		redrawBrowser = function() {
			var element = dom.byId(config.interface_id);
			var n = document.createTextNode(' ');
			var disp = element.style.display;  // don't worry about previous display style
			
			// fade out
			element.appendChild(n);
			element.style.display = 'none';

			setTimeout(function(){
				element.style.display = disp;
				n.parentNode.removeChild(n);
				window.scroll(0, 0);
			}, 1); // you can play with this timeout to make it as short as possible
		},
		
		/**
		 * center an image on a canvas (via its drawing context)
		 * @param param_context CanvasRenderingContext2D canvas graphics context to compute center
		 * @param param_image HTMLImageElement image data to draw centered onto context
		 * @param param_matte string hex color to matte param_image on before composite
		 * @param param_scale int integer percent to scale param_image before composite
		 * @param param_blendmode string blendmode to use during composite
		 * @param param_opacity int integer percent to apply opacity
		 * @returns void
		 */
		centerImage = function(param_context, param_image, param_matte, param_scale, param_blendmode, param_opacity) {
			var scaled = {width:null, height:null};
			if(param_context.canvas.height >= param_context.canvas.width) {
				// tall canvas
				scaled.width = param_context.canvas.width;
				scaled.height = param_image.height * scaled.width/param_image.width;
			}
			else {
				// wide canvas
				scaled.height = param_context.canvas.height;
				scaled.width = param_image.width * scaled.height/param_image.height;
			}
			
			// apply user scale
			scaled.height *= param_scale/100;
			scaled.width *= param_scale/100;
			
			var offset = {
				x: param_context.canvas.width/2 - scaled.width/2,
				y: param_context.canvas.height/2 - scaled.height/2
			};
			
			// draw on matte
			var canvas = domConstruct.create('canvas');
			canvas.width = param_context.canvas.width;
			canvas.height = param_context.canvas.height;
			var ctx = canvas.getContext("2d");
			ctx.mozImageSmoothingEnabled = dom.byId(config.form_id)['smoothing'].checked;
			ctx.msImageSmoothingEnabled = dom.byId(config.form_id)['smoothing'].checked;
			ctx.imageSmoothingEnabled = dom.byId(config.form_id)['smoothing'].checked;
			if(param_matte) {
				ctx.fillStyle = param_matte;
				ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			}
			ctx.drawImage(param_image, 0, 0, param_image.width, param_image.height, offset.x, offset.y, scaled.width, scaled.height);
			
			// draw opacity
			param_context.globalAlpha = param_opacity / 100;
			
			// draw on context
			param_context.globalCompositeOperation = param_blendmode;
			param_context.drawImage(canvas, 0, 0);
			
			// cleanup
			domConstruct.destroy(canvas);
			delete ctx;
			delete canvas;
		},
				
		/**
		 * record change & initiate image generation
		 * @params void
		 */
		handleParamChange = function() {
			data.changed = true;
			dom.byId(config.control.generate_id).disabled = false;
		},
		
		/**
		 * open image select dialog when image is clicked/touched
		 * @returns void
		 */
		handleImageClick = function() {
			// google analytics event
			ga('send', {
				hitType: 'event',
				eventCategory: 'Interaction',
				eventAction: 'click/touch',
				eventLabel: 'image'
			});
			
			dom.byId(config.control.select_id).click();
		},
				
		/**
		 * generate the preview canvas
		 * @returns void
		 */
		handleGenerate = function() {
			if(!data.staticImage) {
				loadStaticImage(generate);
				return;
			}
			
			generate();
		},
		
		/**
		 * save a full-resolution png of the configured canvas element
		 * @returns void
		 */		
		handleSave = function() {
			if(!data.staticImage) {
				loadStaticImage(handleSave);
				return;
			}
			
			// google analytics event
			ga('send', {
				hitType: 'event',
				eventCategory: 'Processing',
				eventAction: 'save',
				eventLabel: 'blendmode:'+dom.byId(config.form_id)['blendmode'].value+
							' opacity:'+dom.byId(config.form_id)['opacity'].value+
							' smoothing:'+dom.byId(config.form_id)['smoothing'].checked
			});
			
			inputDisable(true);
			var ctx = createFinalContext();
			
			if(data.userImage) {
				centerImage(ctx, data.userImage, null, 100, "source-over", 100);
			}
			if(data.staticImage) {
				var matte_str = dom.byId(config.form_id)['matte'].checked ? "#013ba6" : null;
				centerImage(ctx, data.staticImage, matte_str, dom.byId(config.form_id)['scale'].value, dom.byId(config.form_id)['blendmode'].value, dom.byId(config.form_id)['opacity'].value);
			}
			reimg.fromCanvas(ctx.canvas).downloadPng('flag_of_earth');
			inputDisable(false);
			
			// cleanup
			domConstruct.destroy(ctx.canvas);
			delete ctx;
		};
			
		return {
			Init: function() {
				loadStaticImage(generate);
				
				on(dom.byId(config.control.select_id), 'change', loadUserImage);
				on(dom.byId(config.form_id)['smoothing'], 'change', handleParamChange);
				on(dom.byId(config.form_id)['blendmode'], 'change', handleParamChange);
				on(dom.byId(config.form_id)['opacity'], 'change', handleParamChange);
				on(dom.byId(config.form_id)['scale'], 'change', handleParamChange);
				on(dom.byId(config.form_id)['size'][0], 'change', handleParamChange);
				on(dom.byId(config.form_id)['size'][1], 'change', handleParamChange);
				on(dom.byId(config.form_id)['matte'], 'change', handleParamChange);
				on(dom.byId(config.control.generate_id), 'click', handleGenerate);
				on(dom.byId(config.control.save_id), 'click', handleSave);
				
				// disable generate / save
				dom.byId(config.control.generate_id).disabled = true;
				dom.byId(config.control.save_id).disabled = true;
				
				console.log('iFoE Generator Init Complete.');
			}
		};
	}
);
