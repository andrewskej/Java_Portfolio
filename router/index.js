
module.exports = function(app){
var router = require('express').Router();

router.get('/', indexMain)
router.get('/about', about)
router.get('/work', work)



  function indexMain(req,res){
    var username = req.session.username || 'guest';
    var level = req.session.level || 'guest';
    res.render('index',{username:username, level:level});
  };


  function about(req,res){
    var username = req.session.username || 'guest';
    var level = req.session.level || 'guest';
    var user ={username:username,level:level};
    res.render('about',{user:user});
  };


  function work(req,res){
    var username = req.session.username;
    var level = req.session.level;
    console.log('work-username:'+username);
    var user ={username:username,level:level};
    res.render('work',{user:user});
  };

  // app.get('/work/a',function(req,res){
  //   res.render('a');
  // });

  // app.get('/logout', function(req,res){
  //   req.session.destroy();
  //   res.send('<p>Successfully logged out!</p><br><p><a href="/">Back');
  // });

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

  return router;
};
