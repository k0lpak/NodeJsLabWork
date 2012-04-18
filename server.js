var express = require('express');
var accountController = require('./controllers/AccountController');
var articleController = require('./controllers/ArticleController');


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


app.get('/login', accountController.get_login);
app.post('/login', accountController.post_login);
app.get('/logout', accountController.get_logout);

app.get('/', articleController.get_index);
app.get('/article/add', articleController.get_add);
app.post('/article/add', articleController.post_add);
app.get('/cms', articleController.get_list);
app.get('/article/delete/:id', articleController.get_delete);
app.get('/article/:id', articleController.get_article);
app.get('/article/edit/:id', articleController.get_edit);
app.post('/article/edit/:id', articleController.post_edit);


app.listen(port);
