var express = require('express');
var mongo = require('mongoskin');

var port = process.env.PORT || 3000;

var app = express.createServer();



app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
	app.use(express.session({ secret: "keyboard cat" }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));


});

app.set('view engine', 'jshtml');
var mongoDb = mongo.db('localhost/trance_music');

//Hardcoded credentials 
function _isAllowAccess(user){
	if (user.username == 'admin' && user.password == '12345'){
		return true;
	}
	return false;
}


function _registerAuthCookie(user, req){
	req.session.items = {credentials : user};
}

function _getCurrentUser(req){
	return req.session.items && req.session.items.credentials ? req.session.items.credentials : undefined;
}

function _isAuthentificated(req){
	return _getCurrentUser(req) ? true : false;
}

function _validatePermissions(req, res, success){
	if (!_isAuthentificated(req)){
		res.redirect('/login');
	}else{
		success(req, res);
	}
}

app.get('/login', function(req, res){
	mongoDb.collection('articles').find().toArray(function(err,articles){
		res.render('login', {
			title:'Login',
			articles : articles,
			user : {username : '', password : ''},
		});
	});
});

app.post('/login', function(req, res){
	if (_isAllowAccess(req.body)){
		_registerAuthCookie(req.body, req);
		res.redirect('/');
	}else{
		res.redirect('/login');
	}
});

app.get('/logout', function(req, res){
	if (req.session.items && req.session.items.credentials){
		delete req.session.items.credentials;
	}
	res.redirect('/');
});



app.get('/', function(req, res) {
	_validatePermissions(req, res, function (req, res){
		mongoDb.collection('articles').find().toArray(function(err, articles){
			res.render( 'index',{
				isAuthentificated : _isAuthentificated(req),
				user : _getCurrentUser(req),
				title : 'Trance Music',
				articles : articles,
			});	
		});
	});
});

app.get('/article/add', function(req, res) {
	_validatePermissions(req, res, function(req, res){
		mongoDb.collection('articles').find().toArray(function(err, articles){
			res.render( 'article_add',{
				isAuthentificated : _isAuthentificated(req),
				user : _getCurrentUser(req),
				title : 'Add article',
				articles : articles,
				article : {headline : '', title : '', body :''},
			});
		});	
	});
});

app.post('/article/add', function(req, res) {
	_validatePermissions(req, res, function(req, res){
		mongoDb.collection('articles').insert(req.body, function (err, result){
			res.redirect('/');
		});	
	});	
});

app.get('/cms', function(req, res){
	_validatePermissions(req, res, function(req, res){
		mongoDb.collection('articles').find().toArray(function(err, articles){
			res.render( 'article_select',{
				isAuthentificated : _getCurrentUser(req),
				user : _getCurrentUser(req),
				title : 'CMS',
				articles : articles,
			});
		});	
	});
});

app.get('/article/delete/:id', function(req, res){
	_validatePermissions(req, res, function(req, res){
		var id = req.params.id;
		mongoDb.collection('articles').remove({_id : mongoDb.bson_serializer.ObjectID.createFromHexString(id)}, function(err,result){
			res.redirect('/cms/');
		});	
	});
});

app.get('/article/:id', function(req, res) {
	_validatePermissions(req, res, function(req, res){
		var id = req.params.id;
		mongoDb.collection('articles').findById(id, function(err, article){
			mongoDb.collection('articles').find().toArray(function(err, articles){
				res.render( 'article',{
					isAuthentificated : _isAuthentificated(req),
					user : _getCurrentUser(req),
					title : article.title,
					articles : articles,
					article : article,
				});
			});
		});	
	});
});

app.get('/article/edit/:id', function(req, res) {
	_validatePermissions(req, res, function(req, res){
		var id = req.params.id;
		mongoDb.collection('articles').findById(id, function(err, article){
			mongoDb.collection('articles').find().toArray(function(err, articles){
				res.render( 'article_edit',{
					isAuthentificated : _isAuthentificated(req),
					user : _getCurrentUser(req),
					title : 'Edit article',
					articles : articles,
					article : article,
				});
			});
		});
	});
});

app.post('/article/edit/:id', function(req, res) {
	_validatePermissions(req, res, function(req, res){
		var id = req.params.id;
		var article = req.body;
		article._id = mongoDb.bson_serializer.ObjectID.createFromHexString(id);
		mongoDb.collection('articles').update({_id : article._id}, article, false, function (err, result){
			res.redirect('/cms');
		});	
	});
});

app.listen(port);
