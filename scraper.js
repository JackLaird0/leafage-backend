const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const fs = require('fs');
const plantURLs = require('./planturls');

//The following scraper goes to 176 pages of finegardening.com to gather all applicable URLs and writes them to './planturls.js'

let iterable = [];
for (let i = 1; i < 177; i++) {
  iterable.push(i);
}
let allURLs = [];

iterable.reduce(function (accumulator, pageNumber) {
  return accumulator.then(function () {
    return nightmare.goto(`https://www.finegardening.com/plant-guide?paged=${pageNumber}`)
      .wait('.content-browser__results')
      .evaluate(() => {
        const cells = document.querySelectorAll('.content-browser__linked-image');
        var list = [].slice.call(cells);
        const pageResults = list.map(function (node) {
          return `${node}`;
        });
        return pageResults;
      })
      .then(function (result) {
        allURLs.push(...result);
      });
  });
}, Promise.resolve([])).then(function () {
  let setupFilePath = __dirname + '/./planturls.js';
  fs.writeFile(setupFilePath, JSON.stringify(allURLs));
});

// The following scraper takes all imported plantURLs and goes to each individual plant page
// about 1750 pages of data are scraped.

let plantObjects = [];
plantURLs.reduce(function (accumulator, url) {
  return accumulator.then(function () {
    return nightmare.goto(url)
      .wait('.article__top__content--main')
      .evaluate(() => {
        const name = document.querySelector('.article__title').innerText;
        const scientificName = document.querySelector('.article__plant-nomenclature').innerText.split('\n')[0];
        const cells = document.querySelectorAll('p');
        var list = [].slice.call(cells);
        const allPTags = list.map(function (node) {
          return `${node.innerText}`;
        });
        const allPlantProperties = document.querySelectorAll('.article__plant-guide__properties__list-item');
        const propertyList = [].slice.call(allPlantProperties);
        const allListItems = propertyList.map(function (node) {
          return `${node.innerText}`;
        });
        let zone_id = allListItems[2].split(' ')[2].split('')[0];
        if (zone_id === ':') {
          zone_id = allListItems[2].split(' ')[2].split('')[1];
        }
        const care = allPTags[3].split('\n')[1];
        const light = allListItems[5].split(' ')[2];
        const maintenance = allListItems[6].split(' ')[2];
        const moisture = allListItems[4].split('Moisture : ')[1];
        return {
          name,
          scientificName,
          care,
          zone_id,
          light,
          maintenance,
          moisture
        };
      })
      .then(function (result) {
        plantObjects.push(result);
      })
      .catch(() => plantObjects.push(null));
  });
}, Promise.resolve([])).then(function () {
  let setupFilePath = __dirname + '/./plantdata.js';
  fs.writeFile(setupFilePath, JSON.stringify(plantObjects));
});