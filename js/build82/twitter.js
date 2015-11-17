define(['dojo/dom-construct', 
        'dojo/_base/window', 
        'https://platform.twitter.com/widgets.js'
        ],
    function(domConstruct, win) {
        // add Twitter div
        domConstruct.create('div', {id:'twitter-wjs'}, win.body(), 'first');

		// init
		window.twttr = {};
		
		window.twttr._e = [];
		window.twttr.ready = function(f) {
		  window.twttr._e.push(f);
		};

        console.log('Twitter ready');

		return window.twttr;
    } 
);