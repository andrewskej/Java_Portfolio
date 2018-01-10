module.exports = function(app,session,bodyParser){
  var route = require('express').Router();

  var mysql = require('mysql');
  var pool = mysql.createPool({
      connectionLimit: 10,
      host: 'localhost',
      user: 'root',
      database: 'o2',
      password: '1234'
  });

  route.get('/register',function(req,res){
    console.log('register');
    res.render('auth/register');
  })


  route.post('/register', function(req,res){
    pool.getConnection(function(err,connection){

      var user = {
          username:req.body.username,
          password:req.body.password,
          displayName:req.body.displayName
      };
      console.log(user.username);
      console.log(user.password);
      var query = 'insert into member (username,password) values (?,?)'
      connection.query(query, [user.username,user.password],function(err,result){
        if(err) {console.log(err);}
        else{
        res.redirect('/');
        connection.release();
      }
      })
    })
  })

  route.post('/login',function(req,res){
    pool.getConnection(function(err,connection){
      req.session.username = req.body.username;
      console.log('session...?: '+req.session.username);
      var username = req.body.username;
      var password = req.body.password;
      var query = "select * from member where username = ?"
      connection.query(query,[username], function(err,result){
        if(err) console.log(err);
        console.log(result);
        if(result){
          req.session.level = result[0].level;
          if(password == result[0].password){
              console.log(req.session);
              var user = {
                'username': username,
                'level':req.session.level
              }
              console.log('logged in: '+user.username);
              console.log('level:'+user.level);
              req.session.save(function(){
                res.render('about',{user:user})
            })
          }else{
            console.log('password is wrong')
            res.redirect('/')
          }
        }else{
          console.log('please check your id')
          res.redirect('/')
        }
      })
    })
  })

  return route;
};
