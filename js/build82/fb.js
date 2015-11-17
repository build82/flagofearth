define(['dojo/dom-construct', 
        'dojo/_base/window', 
        '//connect.facebook.net/en_US/sdk.js'
        ],
    function(domConstruct, win) {
        // add Facebook div
        domConstruct.create('div', {id:'facebook-jssdk'}, win.body(), 'first');

        // init the Facebook JS SDK
        FB.init({
            appId: '160889964265948',
            xfbml: true,
			version: 'v2.5'
        });

        console.log('Facebook ready');

        return FB;
    } 
);