var createError = require("http-errors");
var express = require("express");
var path = require("path");
var exphbs = require("express-handlebars");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const {
  Client,
  RichEmbed
} = require("discord.js");
const bot = new Client();
global.bot = bot;
const TOKEN = 'NjYxMjQ0MjczNzAxNjgzMjMw.Xg69nw.qotyI2HlyDAejuyhw28irbXuOMo';
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

  if (msg.member !== null) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id !== '662368129141178368' && msg.author.id !== '662408614132187146') {
      return;
    }
  }

  if (msg.channel.type !== "dm") {
    if (msg.content.startsWith("-")) {
      processCommand(msg);
    }
  } else {
    const embed = new RichEmbed()
      .setTitle("Error")
      .setColor(0xff0000)
      .setDescription("Sorry, I am a channel bot");
    msg.channel.send(embed);
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
    const embed = new RichEmbed()
      .setTitle("Error")
      .setColor(0xff0000)
      .setDescription("I don't understand the command. Try `-kick` or `-ban`");
    msg.channel.send(embed);
  }
}

function kickCommand(arguments, msg) {
  if (arguments.length > 0) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      const member = msg.guild.member(taggedUser);
      if (member) {
        member
          .kick("Optional reason that will display in the audit logs")
          .then(() => {
            msg.reply(`${taggedUser.tag} kicked out`);
          })
          .catch(err => {
            msg.reply("I was unable to kick the member");
            console.error(err);
          });
      } else {
        msg.reply("That user isn't in this guild!");
      }
    } else {
      msg.reply("Please tag a valid user!");
    }
  }
}

function banCommand(arguments, msg) {
  if (arguments.length > 0) {
    const user = msg.mentions.users.first();
    if (user) {
      const member = msg.guild.member(user);
      if (member) {
        member
          .ban({
            reason: "Trial user"
          })
          .then(() => {
            msg.reply(`${user.tag} banned`);
          })
          .catch(err => {
            msg.reply("I was unable to ban the member");
            console.error(err);
          });
      } else {
        msg.reply("That user isn't in this guild!");
      }
    } else {
      msg.reply("You didn't mention the user to ban!");
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
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;