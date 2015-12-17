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
		{name:'build82', location:'build82'},
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
					   "build82/controller/twitter",
					   "build82/controller/dropbox",
					   "build82/utility/reimg",
					   "build82/utility/xhr",
					   "ifoe/controller/config",
					   "ifoe/controller/generator",
					   "ifoe/controller/menu",
					   "ifoe/controller/menuitem",
					   "ifoe/controller/menuseparator",
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