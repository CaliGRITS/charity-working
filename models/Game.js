var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var GameSchema = new Schema({
  user: String,
  email: String,
  gameAwayTeam: String,
  gameHomeTeam: String,
  closed: {type: Boolean, default:false}
});

var Game = mongoose.model("Game", GameSchema);

module.exports = Game;
