// import files and packages up here
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

// create your express server below
const app = express();

// add your routes and middleware below
app.use(morgan('dev')); //morgan is the middleware in this case

//this object called cache will be populated with all the keys and values from the JSON file.
const cache = {}; 

//GET request that responds with movie data. Returns a status code of 200.
axios.get('/', function(req, res){
    //Once the GET request is sent, it queries all of the data and stores it into a variable called movieData
    var movieData = req.query;
    //Then each "key" is extracted from the movieData Object and each key is stored into the variable called 'key'
    var key = Object.keys(movieData);
    //Then each "value" is extracted from the movieData Object and each value is stored into the variable called 'value'
    var value = Object.values(movieData);
    //Once the key and value has been stored, it generates a url by concatenating the original URL of the DB w/API key + the key and value respectively.
    var url = 'http://www.omdbapi.com/?apikey=8730e0e&'  + key + '=' + encodeURI(value);
    //console.log(cache);
    //the if statement checks to see if the value matches the current property/key of the object called cache.
    if (cache.hasOwnProperty(value)){
        //if the value does indeed match up with the property of the object then respond back with a json file by passing in that value;
        res.json(cache[value]);
    } else {
        //if the value needs to be extracted from the OMDB DB then invoke another GET request
        //using the URL that has been created, then once the response has been received with that data then store
        //it as a value of along with its paired property in the object called 'cache'
        axios.get(url)
        .then(response => {  // response => == function response()
        cache[value] =  response.data;
        //the line below will actually send back the response that contains the property : value of the data in the JSON file.
        res.send(cache[value]);
        }).catch(err => res.json(err.message));
    }
});

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter
module.exports = app;