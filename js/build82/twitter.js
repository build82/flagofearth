define(['https://platform.twitter.com/widgets.js'
        ],
    function() {
		window.twttr = {};
		window.twttr._e = [];
		window.twttr.ready = function(f) {
		  window.twttr._e.push(f);
		};

        console.log('Twitter ready');

		return window.twttr;
    } 
);