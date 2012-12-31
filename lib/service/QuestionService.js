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
	this.addAnswer("Robbie", "https://www.facebook.com/photo.php?fbid=10151302185397829&set=a.429980787828.199522.504847828&type=1");
	this.addAnswer("Vicky", "https://www.facebook.com/photo.php?fbid=10150255323620128&set=a.10150260342510128.495990.569230127&type=1");
	this.addAnswer("Sadie", "https://www.facebook.com/photo.php?fbid=10100373457281022&set=a.728689578692.2389317.61105778&type=1");
	this.addAnswer("Sporen", "https://www.facebook.com/photo.php?fbid=10151105905856008&set=a.422300101007.200615.500266007&type=1");
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
	self.currentQuestion.startTime = new Date();

    this.emit('newQuestion', self.currentQuestion);

	setInterval(function(){
		self.questionExpired();
	}, self.defaultQuestionDuration);
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
				this.emit('vote', {"answerId": answerId, "voteCount": val.voteCount});
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

