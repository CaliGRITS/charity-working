var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/bet-on-charity");

module.exports.Game = require("./Game");
module.exports.User = require("./User");
module.exports.Bet = require("./Bet");
