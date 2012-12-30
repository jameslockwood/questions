$(function(){

	// create our application object
	var Application = Module.extend({
		initialize : function(){
			this.sockets = this.createMap('sockets');
			this.views = this.createMap('views');
			this.models = this.createMap('models');
		},
		start : function(){
			// add our default socket connection
			this.sockets.add('default', io.connect('http://localhost'));

			// add our various views
			this.views.add({
				'add' : new AddQuestionView({el: this.$('#add')}),
				'vote' : new VoteView({el: this.$('#vote')}),
				'results' : new QuestionResultsView({el: this.$('#results')})
			});
		},
		events : {
			// events emitted from our default socket connection
			'sockets.default' : {
				'newQuestion' : function( questionObject ){
					this.log( 'new question event - ', questionObject );
				},
				'questionExpired' : function( resultsObject ){
					this.log( 'question expired event - ', resultsObject );
				}
			},
			// events emitted from any of our views
			'views.*' : {
				// when a question has been submitted
				'questionSubmit' : function( viewObj, viewName, questionString ){
					this.sockets.get('default').emit( 'newQuestion', questionString );
				},
				// when an answer has been submitted
				'vote' : function( viewObj, viewName, voteId ){
					this.sockets.get('default').emit( 'vote', voteId );
				}
			}
		}
	});

	// instantiate the application, passing in scope, then start
	var app = new Application({scope:'#app-wrapper'}).start();
	
});

// stub out socket.io stuff
var io = {
	connect : function(){
		return {};
	}
};

