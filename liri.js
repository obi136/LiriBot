var keys = require("./keys");
var request = require("request");
var fs = require('fs');

require('dotenv').config();

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var firstAction = process.argv[2];
var secondAction = process.argv[3];

switch (firstAction) {
    case "my-tweets":
        twitter(secondAction);
        break;

    case "spotify-this-song":
        spotify(secondAction);
        break;

    case "movie-this":
        movie(secondAction);
        break;

    case "do-what-it-says":
        doit(secondAction);
        break;
};

function twitter(secondAction) {
    var client = new Twitter(exports.twitter);
    var params = {
        screen_name: 'tttransporter',
        count: 20
    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@tttransporter: " + tweets[i].text + "Tweets Created At: " + date);
            }
        }
        else {
            console.log(error);
        }
    });

}

function spotify(secondAction) {
    var spotify = new Spotify(exports.spotify);
    if (!secondAction) {
        secondAction = "Together We Are";
    }
    spotify.search({
        type: "track",
        query: secondAction

    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        var songData = data.tracks.items;
        console.log("Artist: " + songData[0].artists[0].name);
        console.log("Track Title: " + songData[0].name);
        console.log("Preview Song: " + songData[0].preview_url);
        console.log("Album: " + songData[0].album.name);
    });
}

function movie(secondAction) {
    var movieName = secondAction;

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {

        if (!secondAction){
            movieName = "Mr. Nobody";
        }
        if (!error && response.statusCode === 200) {

            console.log("Title: " + JSON.parse(body).Title);
            console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("Rotten Tomato Score: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors)
        }
    });
};

function doit(secondAction){
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            return console.log(error);
        }

        var txt = data.split(",");

        if(txt[0] === "spotify-this-song"){
            var trackCheck = txt[1].slice(1, -1);
            spotify(trackCheck);
        }
        else if(txt[0] === "my-tweets"){
            var tweetCheck = txt[1].slice(1, -1);
            twitter(tweetCheck);
        }
        else if(txt[0] === "movie-this"){
            var movieCheck = txt[1].slice(1, -1);
            movie(movieCheck);
        }

    });
}
