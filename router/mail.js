module.exports = function(app){
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
  }
});

  var mailOptions = {
    from: 'testAcct@text.works',
    to: 'andrewskej@gmail.com',
    subject:'nodeMailerTest',
    text: '<h1>TestText</h1>'
  };

  smtpTransport.sendMail(mailOptions, function(err,res){
    if(err){
      console.log(err);
    }else{
      console.log("message sent:" +res);
    }
    smtpTransport.close();
  });

};
