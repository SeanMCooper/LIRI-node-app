var fs = require('fs'); 
var request = require('request');
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');

var command = process.argv[2];
var searchValue = "";


// multi word search
for (var i = 3; i < process.argv.length; i++) {
    searchValue += process.argv[i] + " ";
};

function errorFunction(err) {
    if (err) {
        return console.log(err);
     }
};

//switch case
switch (command) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        searchSong(searchValue);
        break;
    case "movie-this":
        searchMovie(searchValue);
        break;
    case "do-what-it-says":
        randomSearch();
        break;
    default:
        console.log( command + " is an invalid prompt! try out one of these! \n node liri.js movie-this (title) \n node liri.js spotify-this-song (title)\n node liri.js my-tweets\n node liri.js do-what-it-says");
};

// -----------do-what-it-says--------------
function randomSearch() {
    
    fs.readFile('random.txt', 'utf8', function(err, data){

		if (err){ 
			return console.log(err);
		}

        var dataArr = data.split(',');
        var randomTitle = dataArr[1];
        searchSong(randomTitle);
    
});
}



// -------------------- my-tweets ----------------------------
function getTweets() {

    // Accesses Twitter Keys
    var client = new Twitter(keys.twitter); 
    var params = {
        screen_name: 'seanmcooper1',
        count: 20
        };

    client.get('statuses/user_timeline', params, function(err, tweets, response) {

        errorFunction(err);

        console.log("\n------------My Twitter Feed-------------\n");

        for (i = 0; i < tweets.length; i++) {
            console.log(i + 1 + ". Tweet: ", tweets[i].text);

            if (i + 1 > 9) {
                console.log("    Date: ", tweets[i].created_at + "\n");
            } else {
                console.log("   Date: ", tweets[i].created_at + "\n");
            }  
        };
    });
};

// ---------------------spotify-this-song--------------------------
function searchSong(searchValue) {

    if(searchValue == ""){
        searchValue = "The Sign Ace of Base";
    }
   
    var spotify = new Spotify(keys.spotify);
    var searchLimit = "1";
    spotify.search({ type: 'track', query: searchValue, limit: searchLimit }, function(err, response) {

        errorFunction(err);
        var searchSong = response.tracks.items;
        for (var i = 0; i < searchSong.length; i++) {
            console.log("\n=============== Spotify Search Result ===============\n");
            console.log(("Artist: " + searchSong[i].artists[0].name));
            console.log(("Song: " + searchSong[i].name));
            console.log(("Album: " + searchSong[i].album.name));
            console.log(("URL:" + searchSong[i].preview_url));
            console.log("\n=========================================================\n");
        }
    })
};

//---------------------movie-this---------------------------------
function searchMovie(searchValue) {

    if (searchValue == "") {
        searchValue = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(err, response, body) {

        errorFunction(err);
        if (JSON.parse(body).Error == 'Movie not found!' ) {
            console.log("Cannot find a movie under parameter" + searchValue)
        } else {

            movieBody = JSON.parse(body);

            console.log("------Movie Search--------")
            console.log("Movie Title: " + movieBody.Title);
            console.log("Year: " + movieBody.Year);
            console.log("IMDB rating: " + movieBody.imdbRating);

          
            if (movieBody.Ratings.length < 2) {

                console.log("Cannot find Rotten Tomatoes score")
            } else {
                console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);
            }
            console.log("Country: " + movieBody.Country);
            console.log("Language: " + movieBody.Language);
            console.log("Plot: " + movieBody.Plot);
            console.log("Actors: " + movieBody.Actors);
        };      
    });
};


