var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/bet-on-charity");

module.exports.Game = require("./Game");
module.exports.User = require("./User");
module.exports.Bet = require("./Bet");
