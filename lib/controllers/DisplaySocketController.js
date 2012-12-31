var questionService = require('../service/QuestionService').INSTANCE;

var displaySockets;

exports.bind = function(io) {
	displaySockets = io
	    .of('/display')
	    .on('connection', function (socket) {
	      socket.emit('newQuestion', questionService.getCurrentQuestion());
	    });
}

questionService.on("newQuestion", function(question){
	displaySockets.emit("newQuestion", question);
});

questionService.on("questionExpired", function(question){
	displaySockets.emit("questionExpired", question);
});

questionService.on("vote", function(answer){ //answerId & voteCount
	displaySockets.emit("vote", answer);
});


