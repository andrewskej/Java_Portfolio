module.exports = function(app,multer,upload,session,route,fs,path,multer,upload,bodyParser){
  var route = require('express').Router();
  var mysql = require('mysql');
  var pool = mysql.createPool({
      connectionLimit: 10,
      host :'us-cdbr-iron-east-05.cleardb.net',
      user:'b1152505429577',
      password:'f0c243ea',
      database:'heroku_f42423e25f73df6',
      migrate:'safe'
  });

  var formidable = require('formidable');

   route.get('/',function(req,res){
     pool.getConnection(function (err, connection) {
      connection.query('SELECT * FROM board order by idx desc', function (err, rows) {
          if (err) console.error("err : " + err);
          if(req.session.username){
            var user = {username:req.session.username,
                        level:req.session.level }
            }else{
                user={username:null}
            }
          res.render('../views/board/list', {title: 'Free', rows: rows, user:user});
          connection.release();
          });
       });
   });

   route.get('/write', function(req,res){
     if(req.session.username){
       var username = req.session.username;
       var level = req.session.level;
     }else{
       username = null;
       level = null;
     }
     console.log(username,level);
     res.render('../views/board/write',{username:username,level:level});
   });


 route.post('/write',function(req,res){
   pool.getConnection(function(err,connection){
     var form = new formidable.IncomingForm();
         form.uploadDir = './uploads';
         form.keepExtensions = true;
         form.maxFieldsSize = 10*1024*1024;
         form.parse(req, function(err, fields, files){
            console.log('fields: ' + JSON.stringify(fields));
            console.log('files: ' + JSON.stringify(files));
         var title = fields.title;
         var content = fields.content;
         var imgsrc,writer;
          if(req.session.username){
            writer = req.session.username;
            var level = req.session.level;
          }else{
            writer = fields.writer;
            level = "";
          }
          if(files.imgsrc.name){
            imgsrc = files.imgsrc.path;  //or name//
          }else{
            imgsrc = "";
         }
        var query='INSERT into board (writer,title,content,imgsrc) values(?,?,?,?)';
        connection.query(query,[writer,title,content,imgsrc],function(err,rows){
        console.log(title + ":" + writer + ":" + content + ":" + imgsrc);
        if(err)console.log(err);
        res.redirect('/work/board/');
        connection.release();
            });
      });
   });
});



route.get('/read/:idx',function(req,res){
  pool.getConnection(function(err,connection){
  var idx = req.params.idx;
  hitUp(idx);
  if(req.session.username){
    var user = {username: req.session.username, level:req.session.level}
  }else{
    user = {username: null,level:null}
  }

  var query1 = 'SELECT * from comments where cmtBrd=? order by cmtDate desc'
  connection.query(query1,[idx],function(err,results){
    var query2 = 'SELECT * from board WHERE idx=?'
    connection.query(query2,[idx], function(err,rows){
      res.render('../views/board/read',{image:rows[0].imgsrc,rows:rows,user:user,results:results});
        });
      });
      connection.release();
    });
 });

    function hitUp(idx){
      pool.getConnection(function(err,connection){
      console.log('hitup idx: '+idx);
       var query2 = 'update board set hit=hit+1 where idx=?'
       connection.query(query2,[idx],function(err,connection){});
       connection.release();
        });
    };






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
     })
   })

   route.post('/comment/:idx', function(req,res){
     pool.getConnection(function(err,connection){
       var idx = req.params.idx;
       var cmtBrd = idx;
       var cmtWriter = req.body.cmtWriter;
       var cmt = req.body.cmt;
       var cmtPwd = req.body.cmtPwd;

       var query = 'insert into comments (cmtBrd,cmtWriter,cmt,cmtPwd) values(?,?,?,?)';
       connection.query(query,[cmtBrd,cmtWriter,cmt,cmtPwd],function(err,result){
         console.log('You\'ve left a comment!');
         res.redirect('/work/board/read/'+idx);
         connection.release();
       })
     })
   })

   route.get('/commentDel/:cmtNo',function(req,res){
     console.log('commentDel Runs')
     pool.getConnection(function(err,connection){
       var cmtNo =req.params.cmtNo;
       connection.query('select * from comments where cmtNo = ?',[cmtNo],function(err,result){
         console.log('result:'+ JSON.stringify(result));
       var cmtPwd = result[0].cmtPwd;

       var cmtDelPwd = req.params.cmtDelPwd;
       console.log('cmtDelPwd: '+cmtDelPwd);

       var idx = result[0].cmtBrd;
       var query ='delete from comments where cmtNo=?';
       connection.query(query,[cmtNo],function(err,results){
         console.log('cmtPwd:'+cmtPwd);
         console.log(cmtNo+ ' deleted');
         res.redirect('/work/board/read/'+idx);
         connection.release();
       })
     })
   })
 })

return route;
}
