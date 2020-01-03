var express = require("express");
require("dotenv").config();
var router = express.Router();
var http = require("https");
const nodemailer = require("nodemailer");
var mandrillTransport = require("nodemailer-mandrill-transport");

/* GET home page. */
router.get("/invitation/:email", function (req, res, next) {
  var email = req.params.email;
  var reu = async q => {
    var r = "";
    const data = JSON.stringify({
      content: "Invitation link sent to " + email
    });

    var options = {
      host: "discordapp.com",
      path: "/api/webhooks/662368129141178368/6hpnjR5E2ak2kjx62er7tIXSHpGfbzsREh5hipxLIpHerJdK2E9DoswZBGeeZi4zQlj4",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };

    var requ = http.request(options, function (resp) {
      r = resp.statusCode;
    });

    requ.on("error", function (e) {
      console.log("problem with request: " + e.message);
    });

    requ.write(data);
    requ.end();

    return r;
  };

  reu().then(a => {
    bot.on("message", msg => {
      if (msg.author == bot.user) {
        return;
      }
      if (msg.content == "Invitation link sent to " + email) {
        msg.channel
          .createInvite({
            maxAge: 2 * 60 * 1,
            temporary: true,
            maxUses: 1,
            inviter: bot.user
          })
          .then(invite => {
            var link = `http://discord.gg/${invite.code}`;
            var smtpTransport = nodemailer.createTransport(
              mandrillTransport({
                auth: {
                  apiKey: "zE-obG88RJWpXn5aBB0Ydg"
                }
              })
            );
            let mailOptions = {
              from: "wordpress@velocity-trading.com",
              to: email,
              subject: "Discord Invitation - Velocity Trading",
              html: '<h3>This is your invite link <a href="' +
                link +
                '">here</a></h3>'
            };

            smtpTransport.sendMail(mailOptions, function (error, response) {
              if (error) {
                res.send("<h3>Mail Not Sent</h3>");
                console.log(error);
              }

              res.send("<h3>Mail Sent</h3>" + JSON.stringify(response));
            });
          })
          .catch(console.error);
      }
    });
  });
});

router.get("/expired/:email", (req, res, next) => {
  var email = req.params.email;
  var reu = async q => {
    var r = "";
    const data = JSON.stringify({
      content: email + " package is expired"
    });

    var options = {
      host: "discordapp.com",
      path: "/api/webhooks/662408614132187146/zG3eAWY_Ps2xo6LBEWNwJbt4O30q3fuMAj3jhL-zGuyYAzWj0EEjkzzEYPSbKLh3FZYC",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };

    var requ = http.request(options, function (resp) {
      r = resp.statusCode;
    });

    requ.on("error", function (e) {
      console.log("problem with request: " + e.message);
    });

    requ.write(data);
    requ.end();

    return r;
  };

  reu().then(a => {
    res.send('done');
  });
});

module.exports = router;