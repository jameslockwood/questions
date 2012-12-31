var DisplayResults = View.extend({

	initialize : function(){

	},

	render : function( questionObject ){
		this.show();
	},

	processQuestion: function( question ){

		console.log('questionnn' , question );

		var text = question.text;
		var answers = question.answers;
		var highestVote = 0;
		var winner = null;

		var collection = new Backbone.Collection( answers );
		var sorted = collection.sortBy( function( person ){
			return person.get('voteCount');
		});

		console.log( question );
		// get top three

		// put into an array

		// render template

		// inject into html

		// job done.
	}

});