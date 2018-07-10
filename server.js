const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/zones/', (request, response) => {
  database('zones').select()
    .then( zones => {
      response.status(200).json(zones)
    })
    .catch( error => {
      response.status(500).json({ error })
    })
});

app.get('/api/v1/plants/', (request, response) => {
  database('plants').select()
    .then( plants => {
      response.status(200).json(plants)
    })
    .catch( error => {
      response.status(500).json({ error })
    })
});

app.post('/api/v1/plants/', (request, response) => {
  const { plant } = request.body;

  for(let requiredParameter of ['name', 'scientificName', 'care', 'moisture', 'light', 'maintenance', 'zone_id']) {
    return response.status(422)
      .send({ error: `Expected formmat: { plant: { name: <String>, scientificName: <String>, care: <String>, 
        moisture: <String>, light: <String>, maintenance: <String>, zone_id: <Number>}}. You're missing a "${requiredParameter}" property.`})
  }

  database('plants').insert(plant, 'id')
    .then( plant => {
      response.status(201).json({ id: plant[0] })
    })
    .catch( error => {
      response.status(500).json({ error })
    });
});

app.listen(app.get('port'), () => {
  console.log(`Leafage's Backend is running on ${app.get('port')}.`)
});

module.exports = app;