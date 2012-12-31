var sys = require('sys'),
    express = require('express'),
	questionService = require('../service/QuestionService').INSTANCE;

exports.bind = function(app){
  app.get('/?', function(req, res, next){  
  	var currentQ = questionService.getCurrentQuestion();
    res.render('index', {currentQuestion: JSON.stringify(currentQ)});
  });
  
  app.get('/index.html', function(req, res, next){  
  	var currentQ = questionService.getCurrentQuestion();
    res.render('index', {currentQuestion: JSON.stringify(currentQ)});
  });
}



