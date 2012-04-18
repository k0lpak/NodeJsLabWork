var mongo = require('mongoskin');

ArticleRepository = function(){
	this.mongoDb = mongo.db('localhost/trance_music')
}

ArticleRepository.prototype = {
	getAll : function(callback){
		this.mongoDb.collection('articles').find().toArray(callback);	
	},

	add : function(entity, callback){
		this.mongoDb.collection('articles').insert(entity, callback);	
	},

	remove : function(id, callback){
		this.mongoDb.collection('articles').remove({_id : this.mongoDb.bson_serializer.ObjectID.createFromHexString(id)}, callback);	
	},

	findById : function(id, callback){
		this.mongoDb.collection('articles').findById(id, callback);
	},

	update : function(id, article, callback){
		article._id = this.mongoDb.bson_serializer.ObjectID.createFromHexString(id);
		this.mongoDb.collection('articles').update({_id : article._id}, article, false, callback);	
	},
}
exports.ArticleRepository = ArticleRepository;
