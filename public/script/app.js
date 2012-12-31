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

			// add our model
			this.models.add('data', new DataModel());

			// add our various views
			this.views.add({
				'add' : new AddQuestionView({el: this.$('#add')}),
				'vote' : new VoteView({
					el : this.$('#vote'),
					model : this.models.get('data').get('question')
				}),
				'results' : new QuestionResultsView({el: this.$('#results')})
			});

			// hide all of our views.
			this.views.each('hide');

			// mock out our default new question
			this.sockets.get('default').emit('newQuestion', { question: null } );
		},
		events : {
			// events emitted from our default socket connection
			'sockets.default' : {
				'newQuestion' : function( questionObject ){
					this._processQuestion( questionObject );
				},
				'questionExpired' : function( resultsObject ){
					this._processQuestionExpired( resultsObject );
				},
				'voteReceived' : function(){
					this._toggleLoad( false );
				}
			},
			// events emitted from any of our views
			'views.*' : {
				// when a question has been submitted
				'questionSubmit' : function( viewObj, viewName, questionString ){
					this._toggleLoad( true );
					this.sockets.get('default').emit( 'questionSubmit', questionString );
				},
				// when an answer has been submitted
				'vote' : function( viewObj, viewName, voteId ){
					this._toggleLoad( true );
					this.sockets.get('default').emit( 'vote', voteId );
				}
			}
		},
		_processQuestion : function( responseObject ){

			this.log( 'new question event - ', responseObject );
			this._toggleLoad( false );
			this.views.each('hide');
			this.models.get('data').processResponse( responseObject );

			if( this.models.get('data').hasQuestion() ){
				this.views.get('vote').render();
			} else {
				this.views.get('add').render();
			}

		},
		_processQuestionExpired : function( results ){
			this.log( 'question expired event - ', resultsObject );
			this.views.each('hide');
			this.views.get('results').render();
		},
		_toggleLoad : function( loading ){
			if( loading ){
				this.$scope.addClass('loading');
			} else {
				this.$scope.removeClass('loading');
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

