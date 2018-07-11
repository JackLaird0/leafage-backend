const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

let allPlants = []
for (let i = 1; i < 117; i++) {
  nightmare
    .goto(`https://www.finegardening.com/plant-guide?paged=${i}`)
    .wait('.content-browser__results')
    .evaluate(() => {
      const cells = document.querySelectorAll('.content-browser__linked-image')
      var list = [].slice.call(cells); 
      const pageResults = list.map(function (node, index) {
        return `${node}`
      });
      const newPlants = pageResults.map(result => {
        nightmare
          .goto(result)
          .wait('')
      })
      return allPlants
    })
    .end()
    .then(function (result) {
      allPlants.push(...)
    })
    .catch(function (error) {
      console.error('Search failed:', error);
    });
}