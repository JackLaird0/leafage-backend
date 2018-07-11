const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const fs = require('fs')
const plantURLs = require('./planturls');

// let iterable = []
// for (let i = 1; i < 177; i++) {
//   iterable.push(i)
// }
// let allURLs = []

// iterable.reduce(function (accumulator, pageNumber) {
//   return accumulator.then(function (results) {
//     return nightmare.goto(`https://www.finegardening.com/plant-guide?paged=${pageNumber}`)
//       .wait('.content-browser__results')
//       .evaluate(() => {
//         const cells = document.querySelectorAll('.content-browser__linked-image')
//         var list = [].slice.call(cells);
//         const pageResults = list.map(function (node, index) {
//           return `${node}`
//         });
//         return pageResults
//       })
//       .then(function (result) {
//         allURLs.push(...result)
//       })
//   });
// }, Promise.resolve([])).then(function (results) {
//   console.dir(allURLs);
//   let setupFilePath = __dirname + '/./planturls.js'
//   fs.writeFile(setupFilePath, JSON.stringify(allURLs))
// });

// const testURLs = ["https://www.finegardening.com/plant/thailand-giant-elephants-ears-colocasia-esculenta-thailand-giant", "https://www.finegardening.com/plant/hosta-hosta-blue-shadows", "https://www.finegardening.com/plant/karl-foerster-feather-reed-grass", "https://www.finegardening.com/plant/stonecrop-sedum-cauticola", "https://www.finegardening.com/plant/prairie-smoke-geum-triflorum"]

// testURLs.reduce(function (accumulator, url) {
//   return accumulator.then(function (results) {
//     return nightmare.goto(url)
//       .wait('.content-browser__results')
//       .evaluate(() => {
//         const cells = document.querySelectorAll('.content-browser__linked-image')
//         var list = [].slice.call(cells);
//         const pageResults = list.map(function (node, index) {
//           return `${node}`
//         });
//         return pageResults
//       })
//       .then(function (result) {
//         allURLs.push(...result)
//       })
//   });
// }, Promise.resolve([])).then(function (results) {
//   console.dir(allURLs);
//   let setupFilePath = __dirname + '/./planturls.js'
//   fs.writeFile(setupFilePath, JSON.stringify(allURLs))
// });

nightmare
  .goto("https://www.finegardening.com/plant/prairie-smoke-geum-triflorum")
  .wait('.article__top__content--main')
  .evaluate(() => {
    const name = document.querySelector('.article__title').innerText
    const scientificName = document.querySelector('.article__plant-nomenclature').innerText.split('\n')[0]
    const cells = document.querySelectorAll('p')
    var list = [].slice.call(cells);
    const allPTags = list.map(function (node, index) {
      return `${node.innerText}`
    });
    const care = allPTags[3].split('\n')[1]
    return {
      name,
      scientificName,
      care
    }
    })
    .then(function (result) {
      console.log(result)
  })