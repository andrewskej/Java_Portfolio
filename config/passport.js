
module.exports = function(app){
  var conn = require('./mySQL')();
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var bkdf2Password = require('pbkdf2-password');
  var hasher = bkdf2Password();

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user,done){
    console.log('serializeUser', user);
    done(null,user.authId);
  });

  passport.deserializeUser(function(id,done){
    console.log('deserializeUser', id);
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql,[id],function(err,results){
      if(err){console.log(err);
      done('deserialize:There is no user');
      }else{
        done(null,results[0]);
      }
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done){
      var uname = username;
      var pwd = password;
      var sql = "SELECT * from users WHERE authId=?";
      conn.query(sql,['local'+uname],function(err,results){
        console.log('uname: '+uname);
        for(var i =0;i<results.length;i++){
          console.log('results: '+results[i]);
        }
        if(!results[0]){
          return done("There is no user");
        }
        var user = results[0];
        console.log(user);
        return hasher({password:pwd, salt:user.salt},function(err,pass,salt,hash){
                  if(hash === user.password){
                    console.log('LocalStrategy', user);
                    return done(null, user);
                  }else{
                    return done(null,false);
                  }
            });
          });
        }
  ));

  passport.use(new FacebookStrategy({
      clientID: '262223927641910',
      clientSecret: 'f95d33a6950db89015c3f55eff187e8f',
      callbackURL: "/auth/facebook/callback",
      profileFields: ['id','email','gender','link','locale','name','timezone','updated_time','verified','displayName']
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      var authId = 'facebook:'+profile.id;
      for(var i=0;i<users.length;i++){
        var user = users[i];
        if(user.authId === authId){
          return done(null,user);
        }
      }
      var newuser = {
        'authId': authId,
        'displayName':profile.displayName,
        'email':profile.emails[0].value
      };
      users.push(newuser, function(done){
        done(null, newuser);
      });
    }
  ));

  return passport;
}
