var OngoingView = View.extend({

	initialize : function(){
		this.$('#domain').text( document.domain );
	},

	render : function( questionObject ){
		this.show();
	},

	processQuestion : function( question ){
		var q = '"' + question.text + '?"';
		this.$('#currentQuestion').text( q );
	}

});