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

define(['dojo/_base/declare',
		'dojo/_base/array',
		'dojo/dom-construct',
		'dojo/on',
		'dijit/_Widget', 
		'dijit/_Templated'
		], 
    function(declare, baseArray, domConstruct, on, _Widget, _Templated) {
		return declare('ifoe.controller.menuitem', [_Widget, _Templated], {
			name: '',
			url: '',
			type: '',
			templateString: '<div class="feature ${type}"><span class="name">${name}</span><hr><span class="description">${description}</div>',
			postCreate: function() {
				this.inherited(arguments);
				var self = this;
				
				// click handler
				on(self.domNode, 'click', function(evt) {
					window.location.href = self.url;
				});
			}
		});
	}
);