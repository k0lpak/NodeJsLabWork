var express = require('express');

var mongo = require('mongoskin');
var port = parseInt(process.argv.pop());

var app = express.createServer();



app.configure(function() {
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.set('view engine', 'jshtml');
var mongoDb = mongo.db('localhost/trance_music');

//Hardcoded credentials 
function IsAuthentificated(user, password){
	if (user == 'admin' && password == '12345'){
		return true;
	}
	return false;
}

app.get('/', function(req, res) {
	mongoDb.collection('articles').find().toArray(function(err, articles){
		res.render( 'index',{
			isAuthentificated : true,
			user : {username : 'user'},
			title : 'Trance Music',
			articles : articles,
		});
	});
});

app.get('/article/add', function(req, res) {
	mongoDb.collection('articles').find().toArray(function(err, articles){
		res.render( 'article_add',{
			isAuthentificated : true,
			user : {username : 'user'},
			title : 'Add article',
			articles : articles,
			article : {headline : '', title : '', body :''},
		});
	});

});

app.post('/article/add', function(req, res) {
	mongoDb.collection('articles').insert(req.body, function (err, result){
		res.redirect('/');
	});
	
});

app.get('/cms', function(req, res){
	mongoDb.collection('articles').find().toArray(function(err, articles){
		res.render( 'article_select',{
			isAuthentificated : true,
			user : {username:'user'},
			title : 'CMS',
			articles : articles,
		});
	});
});

app.get('/article/delete/:id', function(req, res){
	var id = req.params.id;
	mongoDb.collection('articles').remove({_id : mongoDb.bson_serializer.ObjectID.createFromHexString(id)}, function(err,result){
		res.redirect('/cms/');
	});
});

app.get('/article/:id', function(req, res) {
	var id = req.params.id;
	
	mongoDb.collection('articles').findById(id, function(err, article){
		mongoDb.collection('articles').find().toArray(function(err, articles){
			res.render( 'article',{
				isAuthentificated : true,
				user : {username : 'user'},
				title : article.title,
				articles : articles,
				article : article,
			});
		});
	});
});

app.get('/article/edit/:id', function(req, res) {
	var id = req.params.id;
	mongoDb.collection('articles').findById(id, function(err, article){
		mongoDb.collection('articles').find().toArray(function(err, articles){
			res.render( 'article_edit',{
				isAuthentificated : true,
				user : {username : 'user'},
				title : 'Edit article',
				articles : articles,
				article : article,
			});
		});
	});
});

app.post('/article/edit/:id', function(req, res) {
	var id = req.params.id;
	var article = req.body;
	article._id = mongoDb.bson_serializer.ObjectID.createFromHexString(id);
	mongoDb.collection('articles').update({_id : article._id}, article, false, function (err, result){
		res.redirect('/cms');
	});
});

app.listen(port);
