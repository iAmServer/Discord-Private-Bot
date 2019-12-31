var express = require("express");
require("dotenv").config();
var router = express.Router();
var http = require("https");
var from_who = process.env.MAILGUN_WHO;

/* GET home page. */
router.get("/invitation", function(req, res, next) {
  var reu = async q => {
    var r = "";
    const data = JSON.stringify({
      content: "Hi"
    });

    var options = {
      host: "discordapp.com",
      path:
        "/api/webhooks/661361289133555759/8d7ykDIs77h8KR_NpmKug-yTv8f9S00Dd2QYsvA6ca7Quqp6iCtTEKyhwN-1VpryaBiX",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };

    var requ = http.request(options, function(resp) {
      console.log("STATUS: " + resp.statusCode);
      r = resp.statusCode;
      // res.redirect("/sendmail");
    });

    requ.on("error", function(e) {
      console.log("problem with request: " + e.message);
    });

    requ.write(data);
    requ.end();

    return r;
  };

  reu().then(a => {
    res.redirect("/sendmail");
  });
});

router.get("/sendmail", (req, res, next) => {
  // var email = req.params.email;
  bot.on("message", msg => {
    if (msg.author == bot.user) {
      return;
    }
    if (msg.content == "Hi") {
      msg.channel
        .createInvite({
          maxAge: 10 * 60 * 1,
          maxUses: 1,
          inviter: bot.user
        })
        .then(invite => {
          var link = `http://discord.gg/${invite.code}`;
          // msg.reply(link);
          var data = {
            from: from_who,
            to: "dayo7379@gmail.com",
            subject: "Invitation Link",
            html:
              'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="' +
              link +
              '">Click here to add your email address to a mailing list</a>'
          };
          console.log(data);
          mg.messages().send(data, function(err, body) {
            if (err) {
              console.log("got an error: ", err);
              res.send("Can't send mail");
            }
            console.log(link);
            console.log(body);
            res.send("submitted");
          });
          // msg.channel.send(link);
        })
        .catch(console.error);
    }
  });
});

router.get("/delete", (req, res, next) => {
  bot.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      console.log(guildInvites);
    });
  });
});

module.exports = router;
