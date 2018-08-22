require("dotenv").config();
var keys = require("./keys");
var request = require("request");
var fs = require("fs");
var moment = require("moment")
var Spotify = require("node-spotify-api");
var command = process.argv[2]
var args = process.argv.slice(2);
var command = args[0];
var userInput = args.slice(1).join(" ");
var divider =  "\n------------------------------------------------------------\n\n";

if (command === "spotify-this-song") {
	spotifyThis();
} else if (command === "movie-this") {
    movieThis();
} else if (command === "concert-this") {
    concertThis();    
} else if (command === "do-what-it-says") {
	doWhatItSays();
} else {
	console.log("Please enter a valid command. \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says");
}
function spotifyThis() {
    var spotify = new Spotify({
      id: keys.spotify.id,
      secret: keys.spotify.secret,
    });
    if (!userInput) {
        userInput = "The Ace of Base";
        console.log("****Please input a song****")
    }
	spotify.search({
		type: "track",
		query: userInput,
		limit: 1
	}, function(err, data) {
		if (err) {
			return console.log(err);
		} else {
			console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
			console.log("Song name: " + data.tracks.items[0].name)
			console.log("External url: " + data.tracks.items[0].album.external_urls.spotify)
			console.log("Album: " + data.tracks.items[0].album.name)
        }
        
        fs.appendFile("log.txt", ("Artist: " + data.tracks.items[0].album.artists[0].name) + "\n" + ("Song name: " + data.tracks.items[0].name) + "\n" + ("External url: " + data.tracks.items[0].album.external_urls.spotify) + "\n" + ("Album: " + data.tracks.items[0].album.name) + divider);
	});
};

function movieThis() {
    if (!userInput) {
        userInput = "mr+nobody";
        console.log("****Please input a movie title****");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=" + keys.omdb;
    request (queryUrl, function(error, response, body) {
      if (error) return console.log(error);  
      if (!error && response.statusCode === 200) {
        console.log("Movie Title: " + JSON.parse(body).Title);
        console.log("Year of release: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Country produced in: " + JSON.parse(body).Country);
        console.log("Language of the movie: " + JSON.parse(body).Language);
        console.log("Movie Plot: " + JSON.parse(body).Plot);
        console.log("Actors in the movie: " + JSON.parse(body).Actors);
  
      } else {
          console.log(error);
      }

      fs.appendFile("log.txt", ("Movie Title: " + JSON.parse(body).Title) + "\n" + ("Year of release: " + JSON.parse(body).Year) + "\n" + ("IMDB Rating: " + JSON.parse(body).imdbRating) + "\n" + ("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value) + "\n" + ("Country produced in: " + JSON.parse(body).Country) + "\n" + ("Language of the movie: " + JSON.parse(body).Language) + "\n" + ("Movie Plot: " + JSON.parse(body).Plot) + "\n" + ("Actors in the movie: " + JSON.parse(body).Actors) + divider);
    });
  };

  function concertThis () {
    artist = userInput.trim();
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsintown;
    request (queryUrl, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log("Venue Name: " + JSON.parse(body)[0].venue.name);
        console.log("Venue Location: " + JSON.parse(body)[0].venue.city + "," + JSON.parse(body)[0].venue.country);
        console.log("Date: " + moment(JSON.parse(body)[0].datetime, 'YYYY-MM-DD').format('MM/DD/YYYY'));
      } else {
        console.log(error);
      }

      fs.appendFile("log.txt", ("Venue Name: " + JSON.parse(body)[0].venue.name) + "\n" + ("Venue Location: " + JSON.parse(body)[0].venue.city + "," + JSON.parse(body)[0].venue.country) + "\n" + ("Date: " + moment(JSON.parse(body)[0].datetime, 'YYYY-MM-DD').format('MM/DD/YYYY')) + divider);
    });
  };
function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		} else {
			var dataArr = data.split(",");
			userInput = dataArr[1];
			command = dataArr[0];

			if (command === "concert-this") {
				concertThis();
			} else if (command === "spotify-this-song") {
				spotifyThis();
			} else if (command === "movie-this"){
				movieThis();
			}
		}
	});
}
