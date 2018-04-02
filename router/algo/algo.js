module.exports = function(app){
var route = require('express').Router();


route.get('/',function(req,res){
  res.render('../views/algo/algo');

});


return route;
};
