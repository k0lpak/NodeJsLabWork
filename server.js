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

app.get('/', function(req, res) {
	mongoDb.collection('articles').find().toArray(function(err, articles){
		res.render( 'index',{
			title : 'Trance Music',
			articles : articles,
		});
	});
});

app.get('/article/add', function(req, res) {
	mongoDb.collection('articles').find().toArray(function(err, articles){
		res.render( 'article_add',{
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

app.get('/article/:id', function(req, res) {
	var id = req.params.id;
	
	mongoDb.collection('articles').findById(id, function(err, article){
		mongoDb.collection('articles').find().toArray(function(err, articles){
			res.render( 'article',{
				title : article.title,
				articles : articles,
				article : article,
			});
		});
		
	});
});


app.listen(port);
