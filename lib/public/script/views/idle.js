var IdleView = View.extend({

	initialize : function(){
		this.$('#domain').text( document.domain );
	},

	render : function( questionObject ){
		this.show();
	},

	processQuestion : function( payload ){
	}

});