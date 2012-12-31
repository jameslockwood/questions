var QuestionResultsView = View.extend({

	initialize : function(){
		if( !this.$el.length ){
			throw new Error('No DOM element passed through');
		}
	},

	events : {
		'click #submitQuestion' : function( e ){
			var target = $(e.target);
			console.log( target.val() );
		}
	},

	render : function( ){
		this.show();
	}

});