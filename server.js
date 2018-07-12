const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const jwt = require('jsonwebtoken');
const jswtKey = require('./json-key.js');

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.post('/authentication', (request, response) => {
  const { user } = request.body;

  for(let requiredParameter of ['email', 'username']) {
    if(!user[requiredParameter]) {
      return response.status(422)
        .send({ error: `Expected format: { user: { email: <String>, username: <String>}}. You're missing a ${requiredParam}`})
    }
  }

  const token = jwt.sign(user, jswtKey, {expiresIn: '1 day'})
  response.status(201).json({ token })
});

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
    if(!plant[requiredParameter]){
      return response.status(422)
      .send({ error: `Expected format: { plant: { name: <String>, scientificName: <String>, care: <String>, moisture: <String>, light: <String>, maintenance: <String>, zone_id: <Number>}}. You're missing a "${requiredParameter}" property.`})
    }
  }

  database('zones').where('name', plant.zone_id)
    .then(zone => {
      console.log(zone)
      plant.zone_id = zone[0].id
      database('plants').insert(plant, 'id')
        .then( plant => {
          response.status(201).json({ plant })
        })
        .catch( error => {
          response.status(500).json({ error })
        });
    })

});

app.listen(app.get('port'), () => {
  console.log(`Leafage's Backend is running on ${app.get('port')}.`)
});

module.exports = app;