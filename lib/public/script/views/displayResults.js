var DisplayResults = View.extend({

	initialize : function(){

	},

	render : function( questionObject ){
		this.show();
	},

	processQuestion: function( question ){

		var text = question.text;
		var answers = question.answers;
		var highestVote = 0;
		var winner = null;

		var collection = new Backbone.Collection( answers );

		var sorted = collection.sortBy( function( person ){
			return -person.get('voteCount');
		});

		var ordered = [];
		ordered.push( sorted[0].toJSON() );
		ordered.push( sorted[1].toJSON() );
		ordered.push( sorted[2].toJSON() );

		var json = {
			answers : ordered
		};

		// render template
		var html = this.compileTemplate( $('#resultTemplate') , json );

		// inject into html
		this.$('#previousWinner').html( html );
		this.$('#preQuestion span').text( text );

	}

});