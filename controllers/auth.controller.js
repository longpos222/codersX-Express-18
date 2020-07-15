var md = require('md5');
var bcrypt = require('bcrypt');
var saltRounds = 10;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var db = require("../db");

module.exports.login = function(req, res) {
  res.render("auth/login")
};

module.exports.postLogin = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  
  var user = db.get('usersList').find({email: email}).value();
  
  if (!user) {
    res.render("auth/login", {
      errors : [
        "User does not exist !"
      ],
      values : req.body
    })
    return;
  }

  const msg = {
    to: user.email,
    from: 'longnguyen16.ck27@st.ueh.edu.vn',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  
  
  if (user.wrongLoginCount >= 4) {
    sgMail.send(msg);
    res.render("auth/login", {
      errors : [
        "Your account is locked! You have type wrong password 4 times!"
      ],
      values : req.body
    })
    return;
  }
  
  var wrongLoginCount = 0
  
  if (!bcrypt.compareSync(password, user.password)) {
    
    db.get('usersList')
      .find({email: email})
      .assign({wrongLoginCount: ++wrongLoginCount})
      .write();

    res.render("auth/login", {
      errors : [
        "Wrong password !"
      ],
      values : req.body
    })
    return;
  }
  
  res.cookie('userId', user.id, {
    signed: true,
  });
  res.redirect('/transactions')
};