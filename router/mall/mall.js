module.exports = function(app,session,fs,path,multer,upload,bodyParser){
  var route = require('express').Router();
  var mysql = require('mysql');
  var pool = mysql.createPool({
      connectionLimit: 10,
      host :'us-cdbr-iron-east-05.cleardb.net',
      user:'b1152505429577',
      password:'f0c243ea',
      database:'heroku_f42423e25f73df6'
  });




  route.get('/',function(req,res){
        if(req.session.username){
          var user = {username:req.session.username,level:req.session.level}
// ------------Repetitive codes...wanna take out as function but failing..----------------
          var myCart = new Array();
            pool.getConnection(function(err,connection){
              connection.query('SELECT * FROM myCart WHERE CARTNAME=?',[req.session.username],function(err,results){
                for(var i =0;i<results.length;i++){
                  myCart.push(results[i]);
                }
                for(var i=0;i<myCart.length;i++){
                  console.log('n:'+myCart[i].ITEMNAME);
                  console.log('p:'+myCart[i].PRICE);
                }
                res.render('../views/mall/mallMain',{user:user,myCart:myCart})
              })
            })
// ----------------------------
            }else{
          res.render('../views/mall/mallMain',{user:undefined});
        }
    });


  route.get('/products',function(req,res){
    pool.getConnection(function(err,connection){
      connection.query("SELECT * from items", function(err,rows){
        if(err) console.log("err : "+err);
        if(req.session.username){
          var user ={username:req.session.username,level:req.session.level}

        // ------------Repetitive codes...wanna take out as function but failing..----------------
          var myCart = new Array();
            pool.getConnection(function(err,connection){
              connection.query('SELECT * FROM myCart WHERE CARTNAME=?',[req.session.username],function(err,results){
                for(var i =0;i<results.length;i++){
                  myCart.push(results[i]);
                }
                res.render('../views/mall/products',{title:'mall',rows:rows, user:user,myCart:myCart});
              })
            })
        // ----------------------------
        }else{
          res.render('../views/mall/products',{title:'mall',rows:rows, user:undefined});
        }
        connection.release();
      });
    });
  });

  route.get('/itemDetail/:ITEMNO',function(req,res){
    pool.getConnection(function(err,connection){
      var ITEMNO = req.params.ITEMNO;
      console.log('ITEMNO: '+ITEMNO);
      var query = 'SELECT * from items WHERE ITEMNO=?'
      connection.query(query,[ITEMNO], function(err,rows){
        if(err) console.log(err);
        if(req.session.username){
          var user ={username:req.session.username,level:req.session.level}

          // ------------Repetitive codes...wanna take out as function but failing..----------------
            var myCart = new Array();
              pool.getConnection(function(err,connection){
                connection.query('SELECT * FROM myCart WHERE CARTNAME=?',[req.session.username],function(err,results){
                  for(var i =0;i<results.length;i++){
                    myCart.push(results[i]);
                  }
                  return res.render('../views/mall/itemDetail',{rows:rows, row:rows[0],user:user,myCart:myCart});
                })
              })
          // ----------------------------

        }else if(!req.session.username){
          return res.render('../views/mall/itemDetail',{rows:rows, row:rows[0],user:undefined});
        }
        connection.release();
        });
      });
    });

  route.get('/giftGuide',function(req,res){
    if(req.session.username){
      var user = {username:req.session.username,level:req.session.level}
  // ------------Repetitive codes...wanna take out as function but failing..----------------
      var myCart = new Array();
        pool.getConnection(function(err,connection){
          connection.query('SELECT * FROM myCart WHERE CARTNAME=?',[req.session.username],function(err,results){
            for(var i =0;i<results.length;i++){
              myCart.push(results[i]);
            }
            res.render('../views/mall/giftGuide',{user:user,myCart:myCart})
          })
        })
    }else{
        res.render('../views/mall/giftGuide',{user:undefined})
    }
  })


// Admin Mode
  route.get('/mallAdmin',function(req,res){
    res.render('../views/mall/mallAdmin')
  })

  route.post('/itemUp',function(req,res){
    var ITEMNAME = req.body.ITEMNAME;
    var ITEMPRICE = req.body.ITEMPRICE;
    var ITEMSTOCK = req.body.ITEMSTOCK;
    var ITEMDESC = req.body.ITEMDESC;
    console.log(ITEMNAME);
    pool.getConnection(function(err,connection){
      var query = "insert into items (ITEMNAME,ITEMPRICE,ITEMSTOCK,ITEMDESC) values (?,?,?,?)"
      connection.query(query,[ITEMNAME,ITEMPRICE,ITEMSTOCK,ITEMDESC],function(err,result){
        if(err)console.log(err);
        console.log("result:"+result);
        res.redirect('../mall/mallAdmin');
        connection.release();
        })
      })
   })

   //cart
   route.get('/toCart/:ITEMNO',function(req,res){
     var itemNo = req.params.ITEMNO;
     console.log('itemToCart:'+itemNo);
     pool.getConnection(function(err,connection){
       var query = "select * from items where ITEMNO=?"
       connection.query(query,[itemNo],function(err,result){
         if(err)console.log(err);
         console.log('result[0].ITEMNAME: '+result[0].ITEMNAME);
         var query2 = "insert into myCart (CARTNAME,ITEMNO,ITEMNAME,PRICE,QUANTITY,CARTNO) values(?,?,?,?,1,default) "
         connection.query(query2,[req.session.username,result[0].ITEMNO,result[0].ITEMNAME,result[0].ITEMPRICE],function(err,cart){
          if(err)console.log(err);
           console.log('item added to My Cart')
           connection.release();
           res.redirect('../products')
         })
       })
     })
   })



return route;

}
