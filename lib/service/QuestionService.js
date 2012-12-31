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
	this.defaultAnswers = [ //Add people here
		{
			"image" : "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/c27.27.335.335/s160x160/64497_643779635930_1524129930_n.jpg",
			"text" : "Adil Jiwa",
			"id" : 0,
			"voteCount" : 0
		},
		{
			"image" : "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/c59.48.603.603/s160x160/34242_558150465198_6238752_n.jpg",
			"text" : "Aaron Signorelli",
			"id" : 1,
			"voteCount" : 0
		},
		{
			"image" : "http://i.telegraph.co.uk/multimedia/archive/02360/jimmySaville_2360477b.jpg",
			"text" : "Jimmy Savile",
			"id" : 2,
			"voteCount" : 0
		}
	];
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

