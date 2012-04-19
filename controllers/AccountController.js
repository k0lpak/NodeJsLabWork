var ArticleRepository = require('../Repositories/ArticleRepository').ArticleRepository;
var PermissionHelper = require('../helpers/PermissionHelper').PermissionHelper;
var permissionsHelper = new PermissionHelper();
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
	if (permissionsHelper.isAllowAccess(req.body)){
		permissionsHelper.registerAuthCookie(req.body, req);
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


