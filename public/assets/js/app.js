function moduleLoader(Module, Controller) {
	/* ------- Private attrs -------*/

	/* ------- Private methods -------*/
	var getControllerUrl = function () {
		return window.location.origin + '/app/js/module/' + Module + '/' + Controller + '.js'
	};

	var publishPlugin = function () {
		jQuery.cachedScript = function (url, options) {
			// Allow user to set any option except for dataType, cache, and url
			options = $.extend(options || {}, {
				dataType: "script",
				cache: true,
				url: url
			});

			// Use $.ajax() since it is more flexible than $.getScript
			// Return the jqXHR object so we can chain callbacks
			return jQuery.ajax(options);
		};
	}

	var constructor = function () {
		// publsh plugin
		publishPlugin();

		// Define Module AND Controller
		if (!Module && !Controller) {
			Module = 'alerts';
			Controller = 'community';
		} else if (Module == 'system' && !Controller) {
			Module = 'alerts';
			Controller = 'sytem';
		}
	}

	/* ------- Public methods -------*/
	this.request = function () {
		// // if module and controller were received, let's call the remote controller
		if (Module && Controller) {
			$.cachedScript(getControllerUrl());
		}
	}

	/* ------- Constructor -------*/
	return constructor();
}

// this is to open the current selected element depending on url
// jQuery(function () {
// 	// Collect data from path name
// 	var pathName = window.location.pathname.substring(1).split('/')
// 		, Module = pathName.shift()
// 		, Controller = pathName.shift()
// 		, module = new moduleLoader(Module, Controller);


// 	// run loaded module if sidebar is modularized
// 	module.request();
// });
