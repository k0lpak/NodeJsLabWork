var ArticleRepository = require('../Repositories/ArticleRepository').ArticleRepository;
var PermissionHelper = require('../helpers/PermissionHelper').PermissionHelper;
var permissionsHelper = new PermissionHelper();
var articleRepository = new ArticleRepository();


exports.get_index = function (req, res){
	permissionsHelper.validatePermissions(res, req, function(res, req){
		articleRepository.getAll(function(err, articles){
			res.render( 'index',{
				isAuthentificated : permissionsHelper.isAuthentificated(req),
				user : permissionsHelper.getCurrentUser(req),
				title : 'Trance Music',
				articles : articles,
			});	
		});
	});
}

exports.get_add = function(req, res){
	permissionsHelper.validatePermissions(res, req, function(res, req){
		articleRepository.getAll(function(err, articles){
			res.render( 'article_add',{
				isAuthentificated : permissionsHelper.isAuthentificated(req),
				user : permissionsHelper.getCurrentUser(req),
				title : 'Add article',
				articles : articles,
				article : {headline : '', title : '', body :''},
			});
		});	
	});
}

exports.post_add = function(req, res){
	permissionsHelper.validatePermissions(res, req, function(res, req){
		articleRepository.add(req.body, function (err, result){
			res.redirect('/');
		});	
	});
}


exports.get_list = function(req, res){
	permissionsHelper.validatePermissions(res, req, function(res, req){
		articleRepository.getAll(function(err, articles){
			res.render( 'article_select',{
				isAuthentificated : permissionsHelper.isAuthentificated(req),
				user : permissionsHelper.getCurrentUser(req),
				title : 'CMS',
				articles : articles,
			});
		});	
	});
}

exports.get_delete = function(req, res){
	permissionsHelper.validatePermissions(res, req, function(res, req){
		var id = req.params.id;
		articleRepository.remove(id, function(err,result){
			res.redirect('/cms/');
		});
	});	
}

exports.get_article = function(req, res){
	permissionsHelper.validatePermissions(res, req, function(res, req){
		var id = req.params.id;
		articleRepository.findById(id, function(err, article){
			articleRepository.getAll(function(err, articles){
				res.render( 'article',{
					isAuthentificated : permissionsHelper.isAuthentificated(req),
					user : permissionsHelper.getCurrentUser(req),
					title : article.title,
					articles : articles,
					article : article,
				});
			});
		});	
	});
}


exports.get_edit = function(req, res){
	permissionsHelper.validatePermissions(res, req, function(res, req){
		var id = req.params.id;
		articleRepository.findById(id, function(err, article){
			articleRepository.getAll(function(err, articles){
				res.render( 'article_edit',{
					isAuthentificated : permissionsHelper.isAuthentificated(req),
					user : permissionsHelper.getCurrentUser(req),
					title : 'Edit article',
					articles : articles,
					article : article,
				});
			});
		});
	});
}
	
exports.post_edit = function(req, res){
	permissionsHelper.validatePermissions(res, req, function(res, req){
		var id = req.params.id;
		var article = req.body;
		articleRepository.update(id, article, function (err, result){
			res.redirect('/cms');
		});	
	});
}	
	
