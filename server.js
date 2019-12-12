'use strict'

const express = require('express');
const app = express();

const superagent = require('superagent');
require('dotenv').config();

const cors = require('cors');
const PORT = process.env.PORT || 3001;
app.use(cors());

let latitude; 
let longitude;
//Routes
app.get('', (req, res) => {
  res.send('You\'re up!');
})

//location

app.get('/location', (req, res) => {
  let city = req.query.data;

  searchLatToLong(city, res);

})

function searchLatToLong(city, res) {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url)
    .then(results => {
      latitude = results.body.results[0].geometry.location.lat;
      longitude = results.body.results[0].geometry.location.lng;
      const newLocation = new Location(city, results.body.results[0]);
      res.send(newLocation);
    })
  // .catch
}

function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

//weather
app.get('/weather', (req, res) => {
  searchWeather(res);
  // res.send(weatherObj);
})

function searchWeather(res) {
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKYKEY}/${latitude},${longitude}`;
  //add correct lat and long!!!
  superagent.get(url)
    .then(results => {
      results.body.daily.data.time
      const weatherArr = results.body.daily.data.map((value) => {
        
        // console.log(value)
        return new Weather(value.summary, value.time);
      })
      // example time format - Mon Jan 01 2001 - day/mon/date/year
      res.send(weatherArr);
      
    })
}

function Weather(weather, time) {
  this.forecast = weather;
  this.time = time
}

//404
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
})

app.listen(PORT, () => console.log(`listening on port ${PORT}!`))
