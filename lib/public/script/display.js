$(function(){

	// create our application object
	var DisplayApp = Module.extend({
		initialize : function(){
			this.sockets = this.createMap('sockets');
			this.views = this.createMap('views');
			this.models = this.createMap('models');
		},
		start : function(){
			// add our default socket connection
			this.sockets.add('default', io.connect('/display'));

			// add our model
			this.models.add('data', new DataModel());

			this.views.add({
				'idle' : new IdleView( {el : this.$('#idle')} ),
				'ongoing' : new OngoingView( {el : this.$('#ongoing')} ),
				'results' : new DisplayResults( {el: this.$('#questionResults')} )
			});

			// hide all of our views.
			this.views.each('hide');
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
				'vote' : function( voteId ){
					this._processVote( voteId );
				}
			}
		},
		_processQuestion : function( responseObject ){
			this.log( 'newQuestion', responseObject );
			this._toggleLoad( false );
			this.views.each('hide');

			if( responseObject === null ){
				this.views.get('idle').show();
				this.views.get('idle').processQuestion( responseObject );
			} else {
				this.views.get('ongoing').show();
				this.views.get('ongoing').processQuestion( responseObject );
			}
		},
		_processQuestionExpired : function( results ){
			this.log( 'questionExpired', results );
			this.views.each('hide');
			this.views.get('results').show();
			this.views.get('results').processQuestion( results.expiredQuestion );
		},
		_processVote : function( vodeId ){
			this.log( 'vote', voteId );
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
	var app = new DisplayApp({scope:'#app-wrapper'}).start();
	
});

if( typeof io === 'undefined' ){
	throw new Error('Socket object not found');
} else if( typeof io.connect !== 'function' ){
	throw new Error('Socket.connect is not a function');
}