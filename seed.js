var db = require('./models'),
   faker = require('faker');

var games_list = [

  {
    user: faker.random.number(),
    email: faker.internet.email(),
    gameAwayTeam: "Loyola",
    gameHomeTeam: "Nevada"

  },{
    user: faker.random.number(),
    email: faker.internet.email(),
    gameAwayTeam: "Texas A&M",
    gameHomeTeam: "Michigan"

  },{
    user: faker.random.number(),
    email: faker.internet.email(),
    gameAwayTeam: "Kansas State",
    gameHomeTeam: "Kentucky"

  },{
    user: faker.random.number(),
    email: faker.internet.email(),
    gameAwayTeam: "Florida State",
    gameHomeTeam: "Gonzaga"

  },{
    user: faker.random.number(),
    email: faker.internet.email(),
    gameAwayTeam: "Clemson",
    gameHomeTeam: "Kansas"

  },{
    user: faker.random.number(),
    email: faker.internet.email(),
    gameAwayTeam: "West Virginia",
    gameHomeTeam: "Villanova"
  },{
    user: faker.random.number(),
    email: faker.internet.email(),
    gameAwayTeam: "Syracuse",
    gameHomeTeam: "Duke"
  },{
    user: faker.random.number(),
    email: faker.internet.email(),
    gameAwayTeam: "Texas Tech",
    gameHomeTeam: "Purdue"
  }
];
db.User.findByIdAndUpdate("5ab870753d7df34c0353d81b",{"admin": true});

// for (var i= 0; i < 5; i++) {
//     db.Game.create({
//       title: faker.lorem.words(),
//       description: faker.address.state()
//       // user: Math.floor(Math.random() * 5)
//   });
// }

// remove all records that match {} -- which means remove ALL records
db.Game.remove({}, function(err){
  if(err) {
    console.log('Error occurred in remove', err);
  } else {
    console.log('removed all games');

    // create new records based on the array games_list
    db.Game.create(games_list, function(err, games){
      if (err) { return console.log('err', err); }
      console.log("created", games.length, "games");
    });
  }
});
db.Bet.remove({},function(err,removed){
  console.log(removed)
});

// db.Game.create({
// title: faker.lorem.words(),
// description: faker.address.state()
// // user: Math.floor(Math.random() * 5)
// });
