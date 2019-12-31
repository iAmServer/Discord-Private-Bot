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
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
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
  } else if (msg.content.startsWith("!")) {
    processCommand(msg);
  }
});

function processCommand(msg) {
  let fullCommand = msg.content.substr(1);
  let splitCommand = fullCommand.split(" ");
  let primaryCommand = splitCommand[0];
  let arguments = splitCommand.slice(1);

  if (primaryCommand == "kick") {
    kickCommand(arguments, msg);
  } else if (primaryCommand == "ban") {
    banCommand(arguments, msg);
  } else {
    msg.channel.send("I don't understand the command. Try `!kick` or `!ban`");
  }
}

function kickCommand(arguments, msg) {
  if (arguments.length > 0) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`${taggedUser.username} kicked out`);
    } else {
      msg.reply("Please tag a valid user!");
    }
  }
}

function banCommand(arguments, msg) {
  if (arguments.length > 0) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`${taggedUser.username} banned`);
    } else {
      msg.reply("Please tag a valid user!");
    }
  }
}

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
