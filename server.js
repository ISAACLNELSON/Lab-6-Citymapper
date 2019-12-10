'use strict'

const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
const PORT = process.env.PORT || 3001;
app.use(cors());

//Routes
app.get('', (req, res) => {
  res.send('You\'re up!');
})

//location

app.get('/location', (req, res) => {
  let city = req.query.data;

  let locationObj = searchLatToLong(city);

  res.send(locationObj);
})

function searchLatToLong(city) {
  const geoData = require('./data/geo.json');

  const geoDataResults = geoData.results[0];

  const newLocation = new Location(city, geoDataResults);
  return newLocation;
}

function Location(city, data) {
  this.search_query = city;
  this.formatted_query + data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

//weather
app.get('/weather', (req, res) => {
  // let city = req.query.data;

  let weatherObj = searchWeather();

  res.send(weatherObj);
})

function searchWeather() {
  const weatherArr = [];
  const weatherData = require('./data/darksky.json');

  //iterate over the individual day array and put each object into  the constructor
  let today = weatherData.daily.data;
  for(let i = 0; i < today.length; i++){
    console.log(today.summary);
    weatherArr.push(new Weather(today[i].summary, today[i].time));
  }
  return weatherArr;
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
