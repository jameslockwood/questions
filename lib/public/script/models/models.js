var mockData = {
	"question" : {
		"id" : 1,
		"text" : "Question goes here",
		"timeLeft" : 2000000,
		"answers" : [
			{
				"image" : "http://www.somthing.com/something/s.jpg",
				"text" : "Jimmy Johnson",
				"id" : 1,
				"voteCount" : 0
			},
			{
				"image" : "http://www.something.com/something/another.jpg",
				"text" : "Gary Smith",
				"id" : 2,
				"voteCount" : 5
			}
		]
	},
	"results" : [
	]
};

var AnswersModel = Backbone.Model.extend({
	defaults : {
		image : null,
		text : '',
		id : null,
		voteCount : 0
	}
});

var AnswersCollection = Backbone.Collection.extend({
	model : AnswersModel
});

var QuestionModel = Backbone.Model.extend({

	initialize : function(){
		this.set('answers', new AnswersCollection());
	},

	defaults : {
		id : null,
		text : '',
		timeLeft : null
	},

	reset : function( obj ){
		obj = ( !obj ? this.defaults : obj );
		this.set({
			id : obj.id,
			text : obj.text,
			timeLeft : obj.timeLeft
		});
		var answers = ( obj && obj.answers ? obj.answers : [] );
		this.get('answers').reset( answers );
		this.trigger( 'reset' );
	},

	// override tojson to include our collection
	toJSON : function(){
		var json = Backbone.Model.prototype.toJSON.call( this );
		json.answers = this.get('answers').toJSON();
		return json;
	},

	// states if question is valid or not.  if null vals are present, return false.
	isValid : function(){
		return !!this.get('text');
	}
	
});

var DataModel = Backbone.Model.extend({

	initialize : function(){
		this.set( 'question', new QuestionModel() );
		this.set( 'results', [] );
	},

	processResponse : function( obj ){
		// obj = mockData;
		if( obj && typeof obj.question === 'undefined' ){
			throw new Error('Model object isnt as expected - require "question" object');
		}
		var newQuestion = ( obj ? obj.question : null );
		this.get('question').reset( newQuestion );
	},

	hasQuestion : function(){
		return !!this.get('question').isValid();
	}

});





