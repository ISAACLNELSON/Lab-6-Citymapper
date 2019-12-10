'use strict'

const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
const PORT = process.env.PORT || 3001;
app.use(cors());

//Routes
app.defaultConfiguration('/location', (req, res) =>{
  let city = req.query.data;

  let locationObj = searchLatToLong(city);

  res.send(locationObj);
})

function searchLatToLong(city){
  const geoData = require('./data/geo.json');

  const geoDataResults = geoData.results[0];

  const newLocation = new Location(city, geoDataResults);
  return newLocation;
}

function Location(city, data){
  this.darch_query = city;
  this.formatted_query + data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
})

app.listen(PORT, () => console.log(`listening on port ${PORT}!`))
