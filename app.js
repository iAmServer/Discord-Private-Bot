var createError = require("http-errors");
var express = require("express");
var path = require("path");
var exphbs = require("express-handlebars");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
var Mailgun = require("mailgun-js");
global.bot = bot;
const TOKEN = process.env.TOKEN;
var api_key = process.env.MAILGUN_API;
var domain = process.env.MAILGUN_DOMAIN;
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const mg = new Mailgun({ apiKey: api_key, domain: domain });
global.mg = mg;
bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", msg => {
  if (msg.author == bot.user) {
    return;
  }
  if (msg.content === "ping") {
    msg.reply("pong");
    msg.channel.send("pong");
  } else if (msg.content.startsWith("!kick")) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    } else {
      msg.reply("Please tag a valid user!");
    }
  }
  // else if (msg.content == "Hi") {
  //   msg.channel
  //     .createInvite({
  //       maxAge: 10 * 60 * 1,
  //       maxUses: 1,
  //       inviter: bot.user
  //     })
  //     .then(invite => {
  //       var link = `http://discord.gg/${invite.code}`;
  //       msg.reply(link);
  //       msg.channel.send(link);
  //       console.log(link);
  //     })
  //     .catch(console.error);
  // }
});

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
