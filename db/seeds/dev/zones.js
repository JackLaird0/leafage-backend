const { zoneData } = require('../seed-data'); 
const { allPlants } = require('../../../plantdata');

exports.seed = function (knex, Promise) {
  return knex('plants').del()
    .then(() => knex('zones').del())
    .then(() => {
        return Promise.all(zoneData.map(zone => {
            return knex('zones').insert(zone, ['name', 'id'])
          }))
          .then(zones => {
            allPlants.forEach(plant => {
              // plant.zone_id = zones.find(zone => zone[0].name === plant.zone_id)
              console.log(plant)
            })
            return knex('plants').insert(allPlants)
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};