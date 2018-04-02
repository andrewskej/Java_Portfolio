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

var formidable = require('formidable');


  route.get('/',function(req,res){
        if(req.session.username){
          var user = {username:req.session.username,level:req.session.level};
          var myCart=[];
            pool.getConnection(function(err,connection){
              connection.query('SELECT * FROM myCart WHERE CARTNAME=?',[req.session.username],function(err,results){
                for(var i =0;i<results.length;i++){
                  myCart.push(results[i]);
                }
                for(i=0;i<myCart.length;i++){
                  console.log('n:'+myCart[i].ITEMNAME);
                  console.log('p:'+myCart[i].PRICE);
                }
                res.render('../views/mall/mallMain',{user:user,myCart:myCart});
              });
            });
            }else{
          res.render('../views/mall/mallMain',{user:undefined});
        }
    });


  route.get(['/products/','/products/:page'],function(req,res){
    var page;
    if(req.params.page){
    page = req.params.page;
    }else{
    page=1;
    }
    console.log("loading " + page + " page...");
    pool.getConnection(function(err,connection){
      connection.query("SELECT * from items", function(err,rows){
        if(err) console.log("err : "+err);
        if(req.session.username){
          var user ={username:req.session.username,level:req.session.level};
          var myCart = [];
            pool.getConnection(function(err,connection){
              connection.query('SELECT * FROM myCart WHERE CARTNAME=?',[req.session.username],function(err,results){
                for(var i =0;i<results.length;i++){
                  myCart.push(results[i]);
                }
                console.log(rows);
                res.render('../views/mall/products',{title:'mall', rows:rows, page:page, total:Object.keys(rows).length-1, each_page:9, user:user, myCart:myCart});
              });
            });
        }else{
          res.render('../views/mall/products',{title:'mall', rows:rows, page:page, total:Object.keys(rows).length-1, each_page:9, user:undefined});
        }
        connection.release();
      });
    });
  });


route.get('/myShopping/:username',function(req,res){
    pool.getConnection(function(err,connection){
      var user = {username:req.session.username};
      // var query = 'select * from orderlist where orderlistname =?';
      var query = 'select * from orderlist inner join items on orderlist.ITEMNO = items.ITEMNO '+
      'where orderlist.orderlistname = ?';
      connection.query(query,[user.username],function(err,results){
      console.log(results);
        res.render('../views/mall/myShopping',{user:user,results:results});
        });
        connection.release();
      });
    });


  route.get('/itemDetail/:itemNo',function(req,res){
    pool.getConnection(function(err,connection){
      var itemNo = req.params.itemNo;
      console.log('itemNo: '+itemNo);
      var query = 'SELECT * from items WHERE ITEMNO=?';
      connection.query(query,[itemNo], function(err,rows){
        var query2 = 'SELECT * FROM REVIEW WHERE ITEMNO=?';
        connection.query(query2,[itemNo],function(err,reviews){
        if(err) console.log(err);
        if(req.session.username){
          var user ={username:req.session.username,level:req.session.level};
          var myCart = [];
              pool.getConnection(function(err,connection){
                connection.query('SELECT * FROM myCart WHERE CARTNAME=?',[req.session.username],function(err,results){
                  for(var i =0;i<results.length;i++){
                    myCart.push(results[i]);
                  }
                  return res.render('../views/mall/itemDetail',{rows:rows, row:rows[0],reviews:reviews,user:user,myCart:myCart});
                });
              });
        }else if(!req.session.username){
          return res.render('../views/mall/itemDetail',{rows:rows,row:rows[0],reviews:reviews,user:undefined});
        }
        connection.release();
            });
        });
      });
    });

//addreview - need to add stars
  route.post('/addReview/:itemno', function(req,res){
    pool.getConnection(function(err,connection){
      var itemNo = req.params.itemno;
      var rid = req.session.username;
      var content = req.body.reviewContent;
      var star;
      console.log('itemNo: '+itemNo);
      console.log("reviewer:"+ rid);
      console.log("content: "+content);
      var query = 'insert into review (itemno, rid, content) values(?,?,?)';
      connection.query(query,[itemNo,rid,content], function(err,result){
        console.log('You\'ve left a review!' );
        // res.redirect('/work/mall/itemDetail/'+itemNo);
        res.redirect('back');
        connection.release();
      });
    });
  });
  //addreview under construction

route.post('/itemPurchase/:itemno',function(req,res){
  pool.getConnection(function(err,connection){
    var orderlistname = req.session.username;
    var address = req.body.address;
    var cardType = req.body.cardType;
    var cardNo = req.body.cardNo;
    var expDate = req.body.expDate;
    var itemNo = req.params.itemno;
    var itemName = req.body.itemName;
    var quantity = req.body.mQuantity;
    var itemPrice = req.body.itemPrice;
    var total = (itemPrice*quantity);

    var query = 'insert into ' +
               'orderlist (ORDERLISTNAME,ADDRESS,ITEMNO,ITEMNAME,ITEMPRICE,QUANTITY,TOTAL) '+
               'values (?,?,?,?,?,?,?)';

   connection.query(query,[orderlistname,address,itemNo,itemName,itemPrice,quantity,total],function(err,result){
     if(err) console.log(err);
     console.log('=== order placed! ===');

      var query2 = 'update items set ITEMSTOCK = (ITEMSTOCK-?) where itemNo = ?';
      connection.query(query2,[quantity,itemNo],function(err,result){
        if(err) console.log(err);
        console.log(quantity + " item(s) removed from stock");
      });

     res.redirect('back');
     connection.release();
   });
  });
});


route.get('/reviewDel/:REVIEWNO',function(req,res){
  pool.getConnection(function(err,connection){
    var reviewNo = req.params.REVIEWNO;
    console.log('delete: '+reviewNo);
    var query = 'delete from review where REVIEWNO = ?';
    connection.query(query,[reviewNo],function(err,result){
      console.log('review deleted!');
      res.redirect('back');
      connection.release();
    });
  });
});



// Admin Mode
  route.get('/mallAdmin',function(req,res){
    res.render('../views/mall/mallAdmin');
  });


  route.post('/itemUp',function(req,res){
    pool.getConnection(function(err,connection){
      var form = new formidable.IncomingForm();
          form.uploadDir = './uploads/mall';
          form.keepExtensions = true;
          form.maxFieldsSize = 10*1024*1024;
          form.parse(req,function(err,fields,files){
          console.log('fields: '+JSON.stringify(fields));
          console.log('files: '+JSON.stringify(files));
            var itemName = fields.itemName;
            console.log('ITEMNAME: '+itemName);
            var itemPrice = fields.itemPrice;
            var itemStock = fields.itemStock;
            var itemDesc = fields.itemDesc;
            var itemImg = files.itemImg.path;
      var query = "insert into items (ITEMNAME,ITEMPRICE,ITEMSTOCK,ITEMIMG,ITEMDESC) values (?,?,?,?,?)";
      connection.query(query,[itemName,itemPrice,itemStock,itemImg,itemDesc],function(err,result){
        if(err)console.log(err);
        res.redirect('../mall/mallAdmin');
      connection.release();
    });
  });
});
});

   route.get('/itemDel/:ITEMNO',function(req,res){
     var itemNo = req.params.ITEMNO;
     console.log('itemNo: ' + itemNo);
     pool.getConnection(function(err,connection){
     var query = "delete from items where itemno = ?";
     connection.query(query, [itemNo], function(err,result){
     res.redirect('../products');
     connection.release();
   });
 });
});


   //cart
   route.get('/toCart/:ITEMNO',function(req,res){
     var itemNo = req.params.ITEMNO;
     console.log('itemToCart:'+itemNo);
     pool.getConnection(function(err,connection){
       var query = "select * from items where ITEMNO=?";
       connection.query(query,[itemNo],function(err,result){
         if(err)console.log(err);
         console.log('result[0].ITEMNAME: '+result[0].ITEMNAME);
         console.log('result[0].ITEMNO: '+result[0].ITEMNO);
        var query2 = "select * from myCart where ITEMNO =?";
        connection.query(query2, [itemNo], function(err, rows){
          console.log(rows[0]);
          if(rows[0] != undefined){
            var query3 = "update myCart set QUANTITY = QUANTITY+1 WHERE ITEMNO = ?";
            connection.query(query3, [result[0].ITEMNO], function(err,cart){
            console.log('item +1 ed to My Cart');
          });
          }else{
            var query4 = "insert into myCart (CARTNAME,ITEMNO,ITEMNAME,PRICE,QUANTITY,CARTNO) values(?,?,?,?,1,default) ";
            connection.query(query4,[req.session.username,result[0].ITEMNO,result[0].ITEMNAME,result[0].ITEMPRICE],function(err,cart){
            if(err)console.log(err);
            console.log('new item added to My Cart');
          });
          }
        });
       connection.release();
       res.redirect('../products');
     });
   });
 });


   route.get('/delCart/:ITEMNO',function(req,res){
     var itemNo = req.params.ITEMNO;
     console.log("CartItemDel: " +itemNo);
     pool.getConnection(function(err,connection){
       var query = "delete from myCart where ITEMNO = ?";
       connection.query(query, [itemNo], function(err,result){
       });
       console.log('item removed from My Cart');
       connection.release();
       res.redirect('../products');
     });
   });


   route.get('/cartPurchase',function(req,res){
       var items = new Array();
       items = req.body.checked;
       console.log(items);

      //  for(var i=0; i<items.size; i++){
      //  console.log(items[i])
      // }
  });


return route;

};
