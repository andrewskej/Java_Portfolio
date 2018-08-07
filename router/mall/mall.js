module.exports = function(app,session,fs,path,multer,upload,bodyParser){
  var router = require('express').Router();
  var mysql = require('mysql');
  var pool = mysql.createPool({
      connectionLimit: 10,
      host :'us-cdbr-iron-east-05.cleardb.net',
      user:'b1152505429577',
      password:'f0c243ea',
      database:'heroku_f42423e25f73df6'
  });

var formidable = require('formidable');

var myCart=[],items=[];

router.get('/',mallSet);
router.get(['/products/','/products/:page'], showProducts);
router.get('/limited/', limitedOffer);
router.get('/myShopping/:username', myShopping);
router.get('/itemDetail/:itemNo', itemDetail)
router.post('/addReview/:itemno', addReview)




  function mallSet(req,res){
    if(req.session.username){
      var user = {username:req.session.username,level:req.session.level};
        pool.getConnection(function(err,connection){
          connection.query('SELECT * FROM myCart WHERE CARTNAME=?',[req.session.username],function(err,results){
            results.forEach(function(item,i){
              myCart.push(item);
            })
            var query = 'select * from items order by ITEMDATE desc';
            connection.query(query,function(err,items){
            res.render('../views/mall/mallMain',{user:user,myCart:myCart,items:items});
            });
          });
        });
    }else{
      res.render('../views/mall/mallMain',{user:'guest',myCart:[],items:items||[]});
    }
  };



  function showProducts(req,res){
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
    };


  function myShopping(req,res){
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
    };


  function itemDetail(req,res){
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
          return res.render('../views/mall/itemDetail',{rows:rows,row:rows[0],reviews:reviews,user:'guest'});
        }
        connection.release();
            });
        });
      });
    };

//addreview - need to add stars
  function addReview(req,res){
    pool.getConnection(function(err,connection){
      var itemNo = req.params.itemno;
      var rid = req.session.username;
      var content = req.body.reviewContent;
      var star;
      var query = 'insert into review (itemno, rid, content) values(?,?,?)';
      connection.query(query,[itemNo,rid,content], function(err,result){
        console.log('You\'ve left a review!' );
        // res.redirect('/work/mall/itemDetail/'+itemNo);
        res.redirect('back');
        connection.release();
      });
    });
  };
  //addreview under construction

router.post('/itemPurchase/:itemno',function(req,res){
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


router.get('/reviewDel/:REVIEWNO',function(req,res){
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
  router.get('/mallAdmin',function(req,res){
    pool.getConnection(function(err,connection){
      var query = 'select * from orderlist order by orderdate desc';
      connection.query(query,function(err,result){
        if(err)console.log(err);
        var query2 = 'select * from member order by username';
          connection.query(query2,function(err,rows){
            res.render('../views/mall/mallAdmin',{result:result,rows:rows});
          });
      });
      connection.release();
    });
  });


  router.post('/itemUp',function(req,res){
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

   router.get('/itemDel/:ITEMNO',function(req,res){
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
   router.get('/toCart/:ITEMNO',function(req,res){
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


   router.get('/delCart/:ITEMNO',function(req,res){
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


   router.get('/cartPurchase',function(req,res){
       var items = [];
       items = req.body.checked;
       console.log(items);

      //  for(var i=0; i<items.size; i++){
      //  console.log(items[i])
      // }
  });



  function limitedOffer(req,res){
    res.render('../views/mall/limitedOffer')
  }

return router;

};
