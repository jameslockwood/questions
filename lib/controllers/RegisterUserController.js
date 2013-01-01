var sys = require('sys'),
    express = require('express'),
	  questionService = require('../service/QuestionService').INSTANCE;

exports.bind = function(app){
  
  app.get('/register', function(req, res){  
    res.render('register');
  });

  app.post('/register', function(req, res){  
    var name = req.body.name
    var image = req.body.image

    questionService.addAnswer(name, image);

    res.redirect('/');
  });
}



