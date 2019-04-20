module.exports = function(app,multer,upload,session,route,fs,path,multer,upload,bodyParser){
  var router = require('express').Router();
  var mysql = require('mysql');
  // var googleTranslate = require('google-translate')('AIzaSyCrGa9ekWOTGSlQqtCO9tL_Un_K2N-09Ak');

  var formidable = require('formidable');
  var pool = mysql.createPool({
      connectionLimit: 10,
      host :'us-cdbr-iron-east-05.cleardb.net',
      user:'b1152505429577',
      password:'f0c243ea',
      database:'heroku_f42423e25f73df6',
      migrate:'safe'
  });
  
  //old functions.. most of them will be gone once the API & react is done
  router.get(['/','/page/:page'],boardMain)
  
  // router.get('/write', writePage)
  // router.post('/write',writePost)
  
  // router.get('/read/:idx',read)
  router.post('/search',search)

  router.get('/edit/:idx', editPage)
  router.post('/edit/',editPost)
  router.post('/del/',del)
  
  router.post('/comment/:idx', commentWrite)
  router.get('/commentDel/:cmtNo',commentDel)


  //API
  router.get('/getAllThreads',getAllThreads)
  router.get('/getThread/:idx', getThread)
  router.get('/getComments/:cmtBrd', getComments)
  router.post('/write',write)

  


  function boardMain(req,res,next){
    var page = req.params.page || 1;
    pool.getConnection(function (err, connection) {
      connection.query('SELECT * FROM board order by idx desc', function (err, rows) {
        var username = req.session.username || 'guest';
        var level = req.session.level || 'guest';
        var user = {username:username, level:level};
        res.render('../views/board/list', {title: 'Free', rows: rows, page:page, total:Object.keys(rows).length-1, each_page:10, user:user});
      });
    });
  };


  //readAll API
  function getAllThreads(req,res){
    const query = `SELECT * from board order by idx desc`
    pool.query(query, (err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  }

  //read API
  function getThread(req,res){
    const query = `SELECT * FROM board WHERE idx=?`
    const param = req.params.idx;
    pool.query(query, param, (err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  }

  //comment API
  function getComments(req,res){
    const query = `SELECT * from comments where cmtBrd=? order by cmtDate desc`
    const param = req.params.cmtBrd
    pool.query(query, param, (err, result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  }

  // write API
  function write(req,res){
    const {newThread} = req.body;
    const params = newThread;
    const query='INSERT into board (writer,title,content,contentTR,imgsrc) values(?,?,?,?,?)';

  }


//  function writePage(req,res){
//     var username = req.session.username || 'guest';
//     var level = req.session.level || 'guest';
//     res.render('../views/board/write',{username:username,level:level});
//   };


 function writePost(req,res){
   pool.getConnection(function(err,connection){
     var form = new formidable.IncomingForm();
         form.uploadDir = './uploads/board';
         form.keepExtensions = true;
         form.maxFieldsSize = 10*1024*1024;
         form.parse(req, function(err, fields, files){
            console.log('fields: ' + JSON.stringify(fields));
            console.log('files: ' + JSON.stringify(files));
         var title = fields.title;
         var imgsrc,writer, level;
          if(req.session.username){
            writer = req.session.username;
            level = req.session.level;
          }else{  //can't write without login now.. need improvement on this
            writer = "guest";
            level = "guest";
          }
          if(files.imgsrc.name){
            imgsrc = files.imgsrc.path;  //or name//
          }else{
            imgsrc = "";
         }
         var content = fields.content;
        //  var lang = fields.lang;
         //zh-CN, zh-TW, en, ja, ko
        //  googleTranslate.translate(content,lang,function(err,translation){
          // console.log('tr:::', translation)
          // var contentTR = translation.translatedText;
          var contentTR = ''
          var query='INSERT into board (writer,title,content,contentTR,imgsrc) values(?,?,?,?,?)';

            connection.query(query,[writer,title,content,contentTR,imgsrc],function(err,rows){
            if(err)console.log(err);
            res.redirect('/work/board/');
            connection.release();
          });
        });
      // });
   });
  };



// function read(req,res){
//   pool.getConnection(function(err,connection){
//   var idx = req.params.idx;
//   hitUp(idx);
//   if(req.session.username){
//     var user = {username: req.session.username, level:req.session.level}
//   }else{
//     user = {username: null,level:null}
//   }

//   var query1 = 'SELECT * from comments where cmtBrd=? order by cmtDate desc'
//   connection.query(query1,[idx],function(err,results){
//     var query2 = 'SELECT * from board WHERE idx=?'
//     connection.query(query2,[idx], function(err,rows){
//       res.render('../views/board/read',{image:rows[0].imgsrc,rows:rows,user:user,results:results});
//         });
//       });
//       connection.release();
//     });
//  };

  function hitUp(idx){
      pool.getConnection(function(err,connection){
      console.log('hitup idx: '+idx);
       var query2 = 'update board set hit=hit+1 where idx=?'
       connection.query(query2,[idx],function(err,connection){});
       connection.release();
        });
  };


  function search(req,res){
      var keyword = req.body.search;
      if(req.session.username){
        var user = {username: req.session.username, level:req.session.level}
      }else{
        user = {username: null,level:null}
      }
      console.log('Search by: '+ keyword)
      pool.getConnection(function(err,connection){
       var query = "select * from board where title Like "+ connection.escape('%'+keyword+'%')
        connection.query(query,[keyword],function(err,rows){
          if(err) console.log(query)
          var page = Math.ceil(rows.length/10);
          console.log('search query: '+query);
          console.log('search results: '+ JSON.stringify(rows));
          if(JSON.stringify(rows)=="[]"){
           console.log('No results found. redirecting to Board')
           res.redirect('/work/board/');
         }else{
          res.render('../views/board/list', {title: 'Free', rows: rows, page:page, total:Object.keys(rows).length-1, each_page:10, user:user});
        }
      })
    })
  }



  function editPage(req,res){
     pool.getConnection(function(err,connection){
       var idx = req.params.idx;
       var query = 'SELECT * from board WHERE idx=?'
       connection.query(query,[idx],function(err,rows){
         if(err) console.log(err);
         res.render('../views/board/edit',{title:rows[0].title,rows:rows});
         connection.release();
       });
     });
   };

   function editPost(req,res){
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
   };

   function del(req,res){
     pool.getConnection(function(err,connection){
       var idx = req.body.idx;
       var query = "Delete from board where idx=?"
       connection.query(query,[idx],function(err,rows){
       console.log('----deleted----');
       res.redirect('/work/board');
       connection.release();
       })
     })
   }

   function commentWrite(req,res){
     pool.getConnection(function(err,connection){
       var idx = req.params.idx;
       var cmtBrd = idx;
       var cmtWriter = req.session.username;
       var cmt = req.body.cmt;
       var cmtlang = req.body.cmtlang;

      //  googleTranslate.translate(cmt,cmtlang,function(err,translation){
      //  var cmtTR = translation.translatedText;

       var query = 'insert into comments (cmtBrd,cmtWriter,cmt,cmtTR) values(?,?,?,?)';
       connection.query(query,[cmtBrd,cmtWriter,cmt,''],function(err,result){
         console.log('You\'ve left a comment!');
         res.redirect('/work/board/read/'+idx);
         connection.release();
       })
     })

    //  })
   }

   function commentDel(req,res){
     pool.getConnection(function(err,connection){
       var cmtNo =req.params.cmtNo;
       connection.query('select * from comments where cmtNo = ?',[cmtNo],function(err,result){
       var idx = result[0].cmtBrd;
       var query ='delete from comments where cmtNo=?';
       connection.query(query,[cmtNo],function(err,results){
         console.log(cmtNo+ ' deleted');
         res.redirect('/work/board/read/'+idx);
         connection.release();
       })
     })
   })
 }

return router;
}
