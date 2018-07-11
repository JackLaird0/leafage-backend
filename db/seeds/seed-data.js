const zoneData = [
    { name: '1', lowTemp: -60, highTemp: -50 },
    { name: '2', lowTemp: -50, highTemp: -40},
    { name: '3', lowTemp: -40, highTemp: -30 },
    { name: '4', lowTemp: -30, highTemp: -20 },
    { name: '5', lowTemp: -20, highTemp: -10 },
    { name: '6', lowTemp: -10, highTemp: 0 },
    { name: '7', lowTemp: 0, highTemp: 10 },
    { name: '8', lowTemp: 10, highTemp: 20 },
    { name: '9', lowTemp: 20, highTemp: 30 },
    { name: '10', lowTemp: 30, highTemp: 40 },
    { name: '11', lowTemp: 40, highTemp: 50 },
    { name: '12', lowTemp: 50, highTemp: 60 },
    { name: '13', lowTemp: 60, highTemp: 70 }
]

const plantData = [
  {
    name: 'Aloe',
    scientificName: 'sciAloe',
    care: 'dont let it die',
    moisture: 'not dry',
    light: 'bright',
    maintenance: 'often'
  },
  {
    name: 'Cactus',
    scientificName: 'sciCactus',
    care: 'dont put in closet',
    moisture: 'dry',
    light: 'DARK',
    maintenance: 'never'
  }
]

module.exports = {zoneData, plantData };