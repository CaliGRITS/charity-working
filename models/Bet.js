var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var BetSchema = new Schema({
  team: String,
  charity: String,
  amount: Number,
  gameId: String,
  username: String,
  won: {type: Boolean, default:false},
  closed: {type: Boolean, default:false}
});


var Bet = mongoose.model("Bet", BetSchema)

module.exports = Bet;
