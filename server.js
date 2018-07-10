const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.get('api/v1/zones/', (request, response) => {
  database('zones').select()
    .then( zones => {
      response.status(200).json(zones)
    })
    .catch( error => {
      response.status(500).json({ error })
    })
});

app.listen(router.get('port'), () => {
  console.log(`Leafage's Backend is running on ${router.get('port')}.`)
});