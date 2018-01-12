module.exports = function(app,multer,upload,session,route,fs,path,multer,upload,bodyParser){
  var route = require('express').Router();
  var mysql = require('mysql');
  var pool = mysql.createPool({
      connectionLimit: 100,
      host :'us-cdbr-iron-east-05.cleardb.net',
      user:'b1152505429577',
      password:'f0c243ea',
      database:'heroku_f42423e25f73df6'
  });

  route.get('/',function(req,res){
   pool.getConnection(function (err, connection) {
      connection.query('SELECT * FROM board order by idx desc', function (err, rows) {
          if (err) console.error("err : " + err);
          var user = {'username':req.session.username,
                      'level':req.session.level
                    }
          res.render('../views/board/list', {title: 'Free', rows: rows, user:user});
          connection.release();
          });
       });
   });

   route.get('/write', function(req,res){
     res.render('../views/board/write',{username:req.session.username,level:req.session.level});
   });

   route.post('/write',function(req,res){
     if(!req.session.username){
       var writer = req.body.writer;
       var password = req.body.password;
     }else{
       var writer = req.session.username;
     }
     var title = req.body.title;
     var content = req.body.content;
     var password = req.body.password;

     // var user ={writer:writer,password:password}


    // var imgsrc = req.files;

     pool.getConnection(function(err,connection){
       var query='INSERT into board (writer,title,content,password) values(?,?,?,?)';
         connection.query(query,[writer,title,content,password],function(err,rows){
           if(err) console.log(err);
           console.log('uploaded: '+req.file)
           res.redirect('/work/board');
           connection.release();
         })
      });

   });

   route.get('/read/:idx',function(req,res){
     pool.getConnection(function(err,connection){
     var idx = req.params.idx;
     console.log('idx: '+idx);
     var query1 = 'update board set hit=hit+1 where idx=?'
     connection.query(query1,[idx],function(err){
       if(err) console.log(err);
     })
     var query2 = 'SELECT * from board WHERE idx=?'
     connection.query(query2,[idx], function(err,rows){
       if(err) console.log(err);
       console.log('result: ',rows);
       res.render('../views/board/read',{title:rows[0].title,rows:rows});
       connection.release();
         });
       });
    });

   route.get('/edit/:idx', function(req,res){
     pool.getConnection(function(err,connection){
       var idx = req.params.idx;
       var query = 'SELECT * from board WHERE idx=?'
       connection.query(query,[idx],function(err,rows){
         if(err) console.log(err);
         res.render('../views/board/edit',{title:rows[0].title,rows:rows});
         connection.release();
       });
     });
   });

   route.post('/edit/',function(req,res){
     pool.getConnection(function(err,connection){
       var idx = req.body.idx;
       var title = req.body.title;
       var content = req.body.content;
       var query = 'UPDATE board SET title=?, content=? WHERE idx=?'
       connection.query(query,[title,content,idx],function(err,rows){
         if(err) console.log(err);
         console.log(query);
         res.redirect('/work/board');
         connection.release();
       });
     });
   });

   route.post('/del/',function(req,res){
     pool.getConnection(function(err,connection){
       // if(req.session.username){

       var idx = req.body.idx;
       var query = "Delete from board where idx=?"
       connection.query(query,[idx],function(err,rows){
         if(err)console.log(err);
         else{
         console.log('----deleted----');
         res.redirect('/work/board');
         connection.release();
         }
       })
// }


     })
   })

   route.post('/comment', function(req,res){
     pool.getConnection(function(err,connection){
       var commenter = req.body.cmtWriter;
       console.log('cmt:'+req.body.cmtWriter);
     })
   })


return route;
}
