
module.exports = function(app){

  app.get('/', function(req,res){
    if(req.session){
    res.render('index',{username:req.session.username, level:req.session.level});
    }else{
      res.render('index');
    }
  });


  app.get('/about', function(req,res){
    var username = req.session.username;
    var level = req.session.level;
    console.log('about-username:'+username);
    var user ={username:username,level:level};
    res.render('about',{user:user});
  });

  // app.post('/about/mail',function(req,res){
  //   var contactFrom = req.body.contactFrom;
  //   var contactText = req.body.contactText;
  //   var contactMSG = contactFrom + ": "+contactText;
    // pool.getConnection(function(err,connection){
    //   var query = 'insert into message (message) value(?)'
    //   connection.query(query,[contactMSG],function(err,result){
    //     if(err)console.log(err);
    //     console.log(result);
    //   })
    // })
  // })

  app.get('/work', function(req,res){
    var username = req.session.username;
    var level = req.session.level;
    console.log('work-username:'+username);
    var user ={username:username,level:level};
    res.render('work',{user:user});
  });

  app.get('/work/a',function(req,res){
    res.render('a');
  });

  app.get('/logout', function(req,res){
    req.session.destroy();
    res.send('<p>Successfully logged out!</p><br><p><a href="/">Back');
  });


};
