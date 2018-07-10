exports.seed = function (knex, Promise) {
  return knex('plants').del()
    .then(() => knex('zones').del())
    .then(() => {
      return Promise.all([
        knex('zones').insert({ name: '1', lowTemp: -60, highTemp: -50 }, 'id'),
        knex('zones').insert({ name: '2', lowTemp: -50, highTemp: -40}, 'id'),
        knex('zones').insert({ name: '3', lowTemp: -40, highTemp: -30 }, 'id'),
        knex('zones').insert({ name: '4', lowTemp: -30, highTemp: -20 }, 'id'),
        knex('zones').insert({ name: '5', lowTemp: -20, highTemp: -10 }, 'id'),
        knex('zones').insert({ name: '6', lowTemp: -10, highTemp: 0 }, 'id'),
        knex('zones').insert({ name: '7', lowTemp: 0, highTemp: 10 }, 'id'),
        knex('zones').insert({ name: '8', lowTemp: 10, highTemp: 20 }, 'id'),
        knex('zones').insert({ name: '9', lowTemp: 20, highTemp: 30 }, 'id'),
        knex('zones').insert({ name: '10', lowTemp: 30, highTemp: 40 }, 'id'),
        knex('zones').insert({ name: '11', lowTemp: 40, highTemp: 50 }, 'id'),
        knex('zones').insert({ name: '12', lowTemp: 50, highTemp: 60 }, 'id'),
        knex('zones').insert({ name: '13', lowTemp: 60, highTemp: 70 }, 'id')
          .then(zones => {
            return knex('plants').insert([
              {
                name: 'Aloe',
                scientificName: 'sciAloe',
                care: 'dont let it die',
                moisture: 'not dry',
                light: 'bright',
                maintenance: 'often',
                zone_id: zones[0]
              },
              {
                name: 'Cactus',
                scientificName: 'sciCactus',
                care: 'dont put in closet',
                moisture: 'dry',
                light: 'DARK',
                maintenance: 'never',
                zone_id: zones[0]
              }
            ])
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};