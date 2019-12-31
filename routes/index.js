var express = require("express");
var router = express.Router();
var http = require("https");

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
      resp.on("data", function(chunk) {
        console.log(chunk);
      });
    });

    requ.on("error", function(e) {
      console.log("problem with request: " + e.message);
    });

    requ.write(data);
    requ.end();

    return r;
  };

  reu().then(a => {
    if (a != "") {
      res.send("Sent");
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
