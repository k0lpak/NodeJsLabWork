
PermissionHelper = function (){
}

PermissionHelper.prototype = {

	isAllowAccess : function(user){
		if (user.username == 'admin' && user.password == '12345'){
			return true;
		}
		return false;
	},

	registerAuthCookie : function(user, req){
		req.session.items = {credentials : user};
	},

	getCurrentUser : function(req){
		return req.session.items && req.session.items.credentials ? req.session.items.credentials : undefined;
	},

	isAuthentificated : function(req){
		return this.getCurrentUser(req) ? true : false;
	},

	validatePermissions : function(req, res, success){
		if (!this.isAuthentificated(req)){
			res.redirect('/login');
		}else{
			success(req, res);
		}
	},
}

exports.PermissionHelper = PermissionHelper;
