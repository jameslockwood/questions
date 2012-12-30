View = Backbone.View.extend({

	destroy: function() {
		this.remove();
		this.off();
		if(typeof this.onDestroy == 'function') {
			this.onDestroy();
		}
	},

	log: function(message) {
		if(typeof console == 'object' && typeof console.log == 'function') {
			// console.log( message );
		}
	},

	// template required, compileJSON is optional.
	compileTemplate: function(template, compileJSON) {

		try {
			// render template
			var source = $(template).html();
			var compiled = Handlebars.compile(source);
			var html = compileJSON ? compiled(compileJSON) : compiled();
			return html;
		} catch(e) {
			e.message = 'Failed to compile template.';
			throw e;
		}
	}

});