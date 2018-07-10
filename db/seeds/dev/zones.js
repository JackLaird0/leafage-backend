exports.seed = function (knex, Promise) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('plants').del()
    .then(() => knex('zones').del())

    // Now that we have a clean slate, we can re-insert our paper data
    .then(() => {
      return Promise.all([

        // Insert a single paper, return the paper ID, insert 2 footnotes
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
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};