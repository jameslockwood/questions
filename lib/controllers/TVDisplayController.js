var sys = require('sys'),
    express = require('express'),
	  questionService = require('../service/QuestionService').INSTANCE;

exports.bind = function(app){
  app.get('/display', function(req, res, next){  
  	var currentQ = questionService.getCurrentQuestion();
    res.render('tvDisplay', {currentQuestion: JSON.stringify(currentQ)});
  });
}



