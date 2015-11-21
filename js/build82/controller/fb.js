define(['//connect.facebook.net/en_US/sdk.js'
        ],
    function() {
        FB.init({
            appId: '160889964265948',
            xfbml: true,
			version: 'v2.5'
        });

        console.log('Facebook ready');

        return FB;
    } 
);