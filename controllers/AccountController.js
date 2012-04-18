var ArticleRepository = require('../Repositories/ArticleRepository').ArticleRepository;
var articleRepository = new ArticleRepository();


exports.get_login = function(req, res){
	articleRepository.getAll(function(err,articles){
		res.render('login', {
			title:'Login',
			articles : articles,
			user : {username : '', password : ''},
		});
	});
}


exports.post_login = function(req, res){
	if (_isAllowAccess(req.body)){
		_registerAuthCookie(req.body, req);
		res.redirect('/');
	}else{
		res.redirect('/login');
	}
}

exports.get_logout = function(req, res){
	if (req.session.items && req.session.items.credentials){
		delete req.session.items.credentials;
	}
	res.redirect('/');
}


