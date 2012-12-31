var VoteView = View.extend({

	initialize : function(){
		if( !this.$el.length ){
			throw new Error('No DOM element passed through');
		}

		this.model.on('reset', function(){
			this.renderQuestion();
			this.renderAnswers();
		}, this);
	},

	events : {
		'click div.imageWrapper' : function( e ){
			var id = $(e.target).attr('data-id');
			this.trigger( 'vote', id );
		}
	},

	render : function( questionObject ){
		this.show();
	},

	renderQuestion : function(){
		var question = this.model.get('text');
		var timeLeft = this.model.get('timeLeft');
		this.$('#text').text( '"' + question + '?"' );
		this.$('#time').text( timeLeft );
	},

	renderAnswers : function(){
		var html = this.compileTemplate( $('#answerTemplate'), this.model.toJSON() );
		this.$('.answers').html( html );
	},

	voteReceived : function( id ){
		var el = this.$('div[data-id="' + id + '"]');
		el.addClass('voted');

		setTimeout( function(){
			el.removeClass('voted');
		}, 500);
	}

});