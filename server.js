/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////
//require express in our app
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  request = require("request");
// connect to db models
var db = require("./models"),
  Game = db.Game,
  User = db.User,
  Bet = db.Bet;


// generate a new express app and call it 'app'
var app = express();
// serve static files in public
app.use(express.static(__dirname + "/public"));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));
// set view engine to ejs (like ERB in rails)
app.set("view engine", "ejs");

/*******************
** Auth Middleware**/

app.use(cookieParser());
app.use(session(  {
  secret: 'betoncharity',
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride("_method"));

////////////////////
//  ROUTES
///////////////////
app.get("/", function(req, res) {
  // res.sendFile('views/index', { root : __dirname});
  // res.render("index", { games: allGames});
  Game.find(function(err, allGames) {
    if (err) { res.status(500).json({ error: err.message });}

      //show games of logged in user
      Bet.find({}, function(err, foundBets){
      //console.log("foundBets", foundBets[0].amount);
        var totalBetsAmounts = 0;
        foundBets.forEach(function(bet){
          console.log(bet.amount);
          if(bet.amount){
            totalBetsAmounts += bet.amount
          }

        })
        // foundBets.map(bet => totalBetsAmounts += bet.amount);
        console.log(totalBetsAmounts);

        res.render("index", { games: allGames, user: req.user, bets: foundBets, totalBetsAmounts: totalBetsAmounts});
      })

  });;
});

app.get("/showGames", function(req, res) {
  // res.sendFile('views/index', { root : __dirname});
  // res.render("index", { games: allGames});
  Game.find(function(err, allGames) {
    if (err) { res.status(500).json({ error: err.message });}

      //show games of logged in user
      Bet.find({}, function(err, foundBets){
      //console.log("foundBets", foundBets[0].amount);
        var totalBetsAmounts = 0;
        foundBets.forEach(function(bet){
          console.log(bet.amount);
          if(bet.amount){
            totalBetsAmounts += bet.amount
          }

        })
        // foundBets.map(bet => totalBetsAmounts += bet.amount);
        console.log(totalBetsAmounts);

        res.render("showGames", { games: allGames, user: req.user, bets: foundBets, totalBetsAmounts: totalBetsAmounts});
      })

  });;
});
//create new user bet and redirect to confirmation page
app.post("/", function(req, res) {
  // res.sendFile('views/index', { root : __dirname});
  // res.render("index", { games: allGames});
  console.log("req.body", req.body);
  // var newBet = new Bet({
  //   team: req.body.team,
  //   charity: req.body.charity,
  //   amount: req.body.amount
  //   // ,
  //   // gameId: req.params.id
  // });
  // console.log("newBet",newBet);
  return res.render("confirmBet", { bet: req.body });
  // saveBet(newBet, res);
});

app.post("/confirmBet", function(req, res) {
  // function saveBet(newBet, res){
  console.log(req.body);
  var newBet = new Bet({
    team: req.body.team,
    charity: req.body.charity,
    amount: req.body.amount,
    username: req.body.username,
    gameId: req.body.gameId
  });

  // Bet.findOne(req.body.id, function(err, bet){
  //   console.log(bet);
  newBet.save(function(err, bet) {
    if (err) {
      return console.log("save error: " + err);
    }
    console.log("saved ", bet);
    // send back the bet!
    // res.json(bet);
    // res.render({bet: newBet});
    // res.render("confirmBet", { bet: bet });
    res.redirect("/showGames");
  });
});

// app.get("/games", function(req, res) {
//   Game.findById(req.params.id, function(err, foundGame) {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else {
//       res.render("games/show", { game: foundGame });
//     }
//   });
// });

app.get("/games/:id", function(req, res) {
  Game.findById(req.params.id, function(err, foundGame) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.render("games/show", { game: foundGame });
    }
  });
});
//
// app.get("/allGames", function(req, res) {
//   var params = {
//            format: JSON,
//            date: "2018-FEB-27"
//        };
// $.ajax({
//     url: "https://api.fantasydata.net/v3/cbb/scores/JSON/TeamGameStatsByDate/2018-FEB-27",
//     beforeSend: function(xhrObj){
//         // Request headers
//         xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","e415ccd5602b4e06870ba5c497510cbd");
//     },
//     type: "GET",
//     // Request body
//     data: "{body}",
// })
// .done(function(data) {
//   console.log(data);
//     alert("success");
// })
// .fail(function() {
//     alert("error");
// });
// });


app.get("/allGames", function(req, res) {


const url =
  "https://api.fantasydata.net/v3/cbb/scores/JSON/Tournament/sim?key=e415ccd5602b4e06870ba5c497510cbd";
fetch(url)
  .then(response => {
    response.json().then(json => {
      res.json(
        createGamesFromData(json)
      );
    });
  })
  .catch(error => {
    console.log(error);
  });


  function createGamesFromData(json){
    json.Games.forEach(function (game){

      var newGame = new Game({
        user: null,
        email: null,
        gameDay: game.Day,
        gameAwayTeam: game.AwayTeam,
        awayTeamScore: game.AwayTeamScore,
        gameHomeTeam: game.HomeTeam,
        homeTeamScore: game.HomeTeamScore
      });
      newGame.save(function(err, game) {
        if (err) {
          return console.log("save error: " + err);
        }
        console.log("Game saved:", game);

      });

    }) //end forEach
  } //end createGamesFromData
});
//////////////////////
//// Auth Routes ////

// show signup view
app.get('/signup', function (req, res) {
 res.render('signup');
});

// Signing up new user, log them in
// hash and salts password, saves new user to db
app.post('/signup', function (req, res) {
  User.register(new User({

          firstname: req.body.firstname,

          lastname: req.body.lastname,

          email: req.body.email ,

          username: req.body.username}),
    req.body.password,
    function (err, newUser) {
      passport.authenticate('local')(req, res, function() {
        res.redirect("/showGames");
      });
    }
  );
});

// log in user
app.get('/login', function (req, res) {
 res.render('login');
});

app.post('/login', passport.authenticate('local'), function (req, res) {
  console.log(req.user);
  //res.send('logged in!!!'); // sanity check
  res.redirect("/showGames"); // preferred!
});


// log out user
app.get("/logout", function(req, res) {
  console.log("BEFORE logout", JSON.stringify(req.user));
  //req.user is true of logged in, and false of logged out
  req.logout();
  console.log("AFTER logout", JSON.stringify(req.user));
  res.redirect("/");
});

////////////////////
//  SERVER
///////////////////
// Server is listenning on
app.listen(process.env.PORT || 3000, function() {
  console.log("www.betoncharity.org is listening at: http://localhost:3000/");
});
