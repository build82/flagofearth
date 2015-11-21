var profile = {
    basePath: "../../../",
 
    action: "release",
 
    cssOptimize: "comments",
 
    mini: true,
 
    optimize: "shrinksafe",
 
    layerOptimize: "shrinksafe",
 
    stripConsole: "all",
 
    selectorEngine: "acme",
	
	releaseDir:"../ifoe-release",
	
	releaseName:"ifoe-dojo-1.10.4",
	
	packages: [
		{name:'ifoe', location:'ifoe'},
		{name:'buil82', location:'build82'},
		{name:'dojo', location:'dojo'},
		{name:'dijit', location:'dijit'},
		{name:'dojox', location:'dojox'}
	],
	
	layers: {
		'dojo/dojo' : {
			customBase: true,
			boot: true,
			include: [ "build82/controller/fb",
					   "build82/controller/ga",
					   "build82/controller/fb",
					   "build82/controller/twitter",
					   "build82/utility/reimg",
					   "ifoe/controller/config",
					   "ifoe/controller/generator",
					   "ifoe/controller/menu",
					   "ifoe/controller/menuitem",
					   "ifoe/view/interface"
			]
		}
	},
	
	resourceTags: {
		amd: function(filename, mid) {
			return  /\.js$/.test(filename);
		}
	}
};  