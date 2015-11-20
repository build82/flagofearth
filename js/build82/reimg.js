define('build82/reimg', function() {
	var OutputProcessor = function(encodedData, element) {
		var isPng = function() {
			return encodedData.indexOf('data:image/png') === 0;
		};
		var isJpg = function() {
			return encodedData.indexOf('data:image/jpeg') === 0;
		};

		var downloadImage = function(data, filename) {
			var a = document.createElement('a');
			a.href = data;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			
		};

		return {
			toBase64: function() {
				return encodedData;
			},
			toImg: function() {
				var imgElement = document.createElement('img');
				imgElement.src = encodedData;
				return imgElement;
			},
			toCanvas: function(callback) {
				var canvas = document.createElement('canvas');
				var boundedRect = element.getBoundingClientRect();
				canvas.width = boundedRect.width;
				canvas.height = boundedRect.height;
				var canvasCtx = canvas.getContext('2d');

				var img = this.toImg();
				img.onload = function() {
					canvasCtx.drawImage(img, 0, 0);
					callback(canvas);
				};
			},
			toPng: function() {
				if (isPng()) {
					var img = document.createElement('img');
					img.src = encodedData;
					return img;
				}

				this.toCanvas(function(canvas) {
					var img = document.createElement('img');
					img.src = canvas.toDataURL();
					return img;
				});
			},
			toJpeg: function(quality) { // quality should be between 0-1
				quality = quality || 1.0;
				
				this.toCanvas(function(canvas) {
					var img = document.createElement('img');
					img.src = canvas.toDataURL('image/jpeg', quality);
					return img;
				});
			},
			downloadPng: function(filename) {
				if (isPng()) {
					// it's a data url already
					downloadImage(encodedData, filename+'.png');
					return;
				}

				// convert to data url first
				this.toCanvas(function(canvas) {
					downloadImage(canvas.toDataURL(), filename+'.png');
				});
			},
			downloadJpg: function(filename, quality) {
				quality = quality || 1.0;
				if (isJpg()) {
					// it's a data url already
					downloadImage(encodedData, filename+'.jpg');
					return;
				}

				// convert to data url first
				this.toCanvas(function(canvas) {
					downloadImage(canvas.toDataURL('image/jpeg', quality), filename+'.jpg');
				});
			},
		};
	};

	return {
		fromSvg: function(svgElement) {
			var svgString = new XMLSerializer().serializeToString(svgElement);
			return new OutputProcessor('data:image/svg+xml;base64,' + window.btoa(svgString), svgElement);
		},

		fromCanvas: function(canvasElement) {
			var dataUrl = canvasElement.toDataURL();
			return new OutputProcessor(dataUrl, canvasElement);
		}
	};
});
