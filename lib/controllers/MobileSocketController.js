var questionService = require('../service/QuestionService').INSTANCE;

var mobileSockets;

exports.bind = function(io) {
	mobileSockets = io
	    .of('/mobile')
	    .on('connection', function (socket) {
	    	socket.emit('newQuestion', questionService.getCurrentQuestion());
    		socket.on("questionSubmit", function(questionStr){
				console.log("Question received");
				questionService.addQuestion(questionStr);
			});

			socket.on("vote", function(voteId){
				console.log("Vote registered");
				var count = questionService.registerVote(voteId);
				socket.emit("voteReceived", count);
			});
	    });
}

questionService.on("newQuestion", function(question){
	mobileSockets.emit("newQuestion", question);
});

questionService.on("questionExpired", function(question){
	var data = {
		"expiredQuestion" : question,
		"previosuQuestions" : questionService.fetchPreviousQuestions()
	}
	mobileSockets.emit("questionExpired", data);
});

