define(['//www.google-analytics.com/analytics.js'
        ],
    function() {
		window['GoogleAnalyticsObject'] = 'ga',  
		window['ga'] = window['ga'] || function() {
			(window['ga'].q=window['ga'].q||[]).push(arguments);
		}
		window['ga'].l = 1 * new Date();
        console.log('Google Analytics ready');

		return window['ga'];
    } 
);