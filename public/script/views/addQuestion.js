var AddQuestionView = View.extend({

	initialize : function(){
		if( !this.$el.length ){
			throw new Error('No DOM element passed through');
		}
	},

	events : {
		'click button#questionSubmit' : function( e ){
			var question = this.$('#question').val();
			if( question ){
				this.trigger( 'questionSubmit', question );
			}
		}
	},

	render : function( ){
		this.show();
		this.$('input').val('');
	}

});