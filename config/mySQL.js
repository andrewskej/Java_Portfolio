module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host :'us-cdbr-iron-east-05.cleardb.net',
    user:'b1152505429577',
    password:'f0c243ea',
    database:'heroku_f42423e25f73df6'
  });
  conn.connect();
  return conn;
}

// host :'localhost',
// user:'root',
// password:'1234',
// database:'o2'
