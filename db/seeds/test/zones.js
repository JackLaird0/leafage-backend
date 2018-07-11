const { zoneData, plantData } = require('../seed-data'); 

exports.seed = function (knex, Promise) {
  const zones = zoneData.map(zone => {
    return knex('zones').insert(zone, 'id')
  });
  return knex('plants').del()
    .then(() => knex('zones').del())
    .then(() => {
      return Promise.all([
        
          ...zones
          .then(zones => {
            console.log(zones)
            plantData.forEach(plant => {
              plant.zone_id = zones[0]
            })
            return knex('plants').insert(plantData)
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};