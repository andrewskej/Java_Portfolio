var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('./config/passport')(app);
var fs = require('fs');
var multiparty = require('multiparty');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('./config/mySQL');
var favicon = require('serve-favicon');

app.use(session({
   secret:'laksjdnflkasjdn',
   resave: false,
   saveUninitialized: true,
   store: new MySQLStore({
     host :'us-cdbr-iron-east-05.cleardb.net',
     user:'b1152505429577',
     password:'f0c243ea',
     database:'heroku_f42423e25f73df6'
   })

}));

var multer = require('multer');
var path = require('path');
var upload = multer({
  _storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});


//Use 'ejs' as view engine//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


//Well this displays uploaded images...but do I really have to define every static route? //
app.use("/public", express.static('public'));
app.use("/uploads", express.static(__dirname + '/uploads'));
app.use("/uploads/board", express.static(__dirname + '/uploads/board'));
app.use("/uploads/mall", express.static(__dirname + '/uploads/mall'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var router = require('./router/index')(app,mysql);
var auth = require('./router/auth/auth')(app,session,bodyParser);
var board = require('./router/board/board')(app,multer,upload,session,fs,path,multer,upload,bodyParser);
var mall = require('./router/mall/mall')(app,multer,upload,session,fs,path,multer,upload,bodyParser);
var chat = require('./router/chat/chat')(app,session,io,http,bodyParser);
// var mail = require('./router/mail')(app);

app.use('/auth/',auth);
app.use('/work/board/',board);
app.use('/work/mall',mall);
app.use('/work/chat',chat);

var port = process.env.PORT || 3000;
// var port = process.env.PORT || 80;
var server = http.listen(port, function(){
  console.log('Server connected: ', port);
});
