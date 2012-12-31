var util = require("util"),
	_ = require("underscore");
	EventEmitter = require('events').EventEmitter;

module.exports = QuestionService;

function QuestionService() {
    EventEmitter.call(this);
    
    this.defaultQuestionDuration = 1000 * 60 * 2; //millis (2 minutes)
	this.defaultAfterQuestionDuration = 1000 * 20; //millis (20 secs - time question answer is left on screen)
	this.currentQuestion = null;
	this.questionQueue = [];
	this.defaultAnswers = [];

	this.addAnswer = function(name, image) {
		var id = this.defaultAnswers.length;
		this.defaultAnswers.push(		
			{
				"id" : id,
				"image" : image,
				"text" : name,
				"voteCount" : 0
			}
		);
	}

	this.addAnswer("Jiwa", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/c27.27.335.335/s160x160/64497_643779635930_1524129930_n.jpg");
	this.addAnswer("Aaron", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/c59.48.603.603/s160x160/34242_558150465198_6238752_n.jpg");
	this.addAnswer("Quyen", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc6/c37.37.463.463/s160x160/196290_551934768780_7568647_n.jpg");
	this.addAnswer("Danny", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc7/c66.66.828.828/s160x160/407298_824833547643_431983150_n.jpg");
	this.addAnswer("Raj", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash4/c23.23.294.294/s160x160/385746_737098962838_2136674772_n.jpg");

	this.addAnswer("Jiwa", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/c27.27.335.335/s160x160/64497_643779635930_1524129930_n.jpg");
	this.addAnswer("Aaron", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/c59.48.603.603/s160x160/34242_558150465198_6238752_n.jpg");
	this.addAnswer("Quyen", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc6/c37.37.463.463/s160x160/196290_551934768780_7568647_n.jpg");
	this.addAnswer("Danny", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc7/c66.66.828.828/s160x160/407298_824833547643_431983150_n.jpg");
	this.addAnswer("Raj", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash4/c23.23.294.294/s160x160/385746_737098962838_2136674772_n.jpg");

	this.addAnswer("Jiwa", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/c27.27.335.335/s160x160/64497_643779635930_1524129930_n.jpg");
	this.addAnswer("Aaron", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/c59.48.603.603/s160x160/34242_558150465198_6238752_n.jpg");
	this.addAnswer("Quyen", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc6/c37.37.463.463/s160x160/196290_551934768780_7568647_n.jpg");
	this.addAnswer("Danny", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc7/c66.66.828.828/s160x160/407298_824833547643_431983150_n.jpg");
	this.addAnswer("Raj", "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash4/c23.23.294.294/s160x160/385746_737098962838_2136674772_n.jpg");

}

QuestionService.prototype.__proto__ = EventEmitter.prototype;

//------------------------
QuestionService.prototype.getCurrentQuestion = function() {
	if(! this.currentQuestion){
		return null;
	}

	//Order Results
	var answers = this.currentQuestion.answers;
	this.currentQuestion.answers = _.sortBy(answers, function(answer){ 
		return -answer.voteCount; 
	});

	this.currentQuestion.timeLeft = this.defaultQuestionDuration - (new Date().getTime() - this.currentQuestion.startTime);
	return this.currentQuestion;
}

QuestionService.prototype.moveToNextQuestion = function() {
	var self = this;
	self.currentQuestion = self.questionQueue.shift();
	if(self.currentQuestion) {
		self.currentQuestion.startTime = new Date();
		setInterval(function(){
			self.questionExpired();
		}, self.defaultQuestionDuration);
	}

    this.emit('newQuestion', self.currentQuestion);	
}

QuestionService.prototype.questionExpired = function() {
	var self = this;
	this.emit('questionExpired', this.getCurrentQuestion());

	setInterval(function(){
		self.moveToNextQuestion();
	}, self.defaultAfterQuestionDuration);
}

QuestionService.prototype.registerVote = function(answerId) {
	var currentQuestion = this.getCurrentQuestion();
	if(currentQuestion && currentQuestion.timeLeft > 0) {
		for(var i in this.currentQuestion.answers) {
			var val = this.currentQuestion.answers[i];
			if( val.id == answerId ){
				val.voteCount++;
				this.emit('vote', this.currentQuestion.answers);
				return {"answerId": answerId, "voteCount": val.voteCount};
			}
		}
	}
}

QuestionService.prototype.addQuestion = function(questionText) {
	this.questionQueue.push({
		"text" : questionText,
		"timeLeft" : this.defaultQuestionDuration,
		"answers" : this.defaultAnswers
	});

	console.log(this.questionQueue);

	if(this.questionQueue.length == 1){
		this.moveToNextQuestion();
	}
}

module.exports.INSTANCE = new QuestionService();

