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