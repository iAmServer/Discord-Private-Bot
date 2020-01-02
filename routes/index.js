var express = require("express");
require("dotenv").config();
var router = express.Router();
var http = require("https");
const nodemailer = require("nodemailer");
const nmgt = require("nodemailer-mailgun-transport");
const mailgunAuth = {
  auth: {
    api_key: "e49edebd96e1db8412e882df128eb923-6f4beb0a-87e42fd8",
    domain: "sandbox4bedbc59d3804deeb2fe4b167e1823c7.mailgun.org"
  }
};
const smtpTransport = nodemailer.createTransport(nmgt(mailgunAuth));

/* GET home page. */
router.get("/invitation/:email", function(req, res, next) {
  var email = req.params.email;
  var reu = async q => {
    var r = "";
    const data = JSON.stringify({
      content: "Invitation link sent to " + email
    });
    https: var options = {
      host: "discordapp.com",
      path:
        "/api/webhooks/661510102439821335/I9AdYCGcmMkWOoV4k_MZke3Z0bZeSv8XQ4XOdpwnaQTliEdKbV9GB-wcVop068-QMcmG",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };

    var requ = http.request(options, function(resp) {
      r = resp.statusCode;
    });

    requ.on("error", function(e) {
      console.log("problem with request: " + e.message);
    });

    requ.write(data);
    requ.end();

    return r;
  };

  reu().then(a => {
    res.redirect("/sendmail/" + email);
  });
});

// bot.channels.get("661243918633009213");
router.get("/sendmail/:email", (req, res, next) => {
  var email = req.params.email;
  bot.on("message", msg => {
    if (msg.author == bot.user) {
      return;
    }
    if (msg.content == "Invitation link sent to " + email) {
      msg.channel
        .createInvite({
          maxAge: 10 * 60 * 1,
          temporary: true,
          maxUses: 1,
          inviter: bot.user
        })
        .then(invite => {
          var link = `http://discord.gg/${invite.code}`;
          const mailOptions = {
            from: "ambrownjessica@gmail.com",
            to: email,
            subject: "Invitation Link",
            html:
              '<h3>This is your invite link <a href="' +
              link +
              '">here</a></h3>'
          };
          smtpTransport.sendMail(mailOptions, function(error, response) {
            if (error) {
              res.send("<h3>Mail Not Sent</h3>");
              console.log(error);
            }

            res.send("<h3>Mail Sent</h3>");
          });
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
