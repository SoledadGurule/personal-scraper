const express = require('express');
const app = express();
const cors = require('cors');
const Nightmare = require('nightmare');

const port = 3000;

app.use(cors());

// first endpoint - already built
app.get('/', (req, res) => {
  res.send("This is my personal web scraper!");
});

app.get('/husky', (req, res) => {
  res.send("This is my personal web scraper!");
});
// scraper endpoint

app.get('/husky/:keyword', (req, res) => {
  var keyword = req.params.keyword;
//we are telling this function to find this keyword
  function findHuskyImage(keyword) {
    var nightmare = Nightmare({ show: true });
//we are starting to tell it to give back.
    return nightmare
    //nightmare is a library for the scraper
      .goto('https://www.google.com')
      //bot goes to website
      .insert('input[title="Search"]', `husky ${keyword}`)
      //what bot needs to search for + keyword
      .click('input[value="Google Search"]')
      //bot clicks google search button
      .wait('a.q.qs')
      //wait for the link to show up
      .click('a.q.qs')
      //bot clicks on link (after it shows up)
      .wait('div#res.med')
      //wait for div to appear (container for images)
      .evaluate(function() {
        var photoDivs = document.querySelectorAll('img.rg_ic');
        var list = [].slice.call(photoDivs); //bot puts all photo container into one collection

        return list.map(function(div) {
          return div.src;
        }); //bot gives us a collection of image links
      })
      .end()
      .then(function (result) {
        return result.slice(1, 5); //bot takes first four photo
      })
      .then(function (images) {
        res.json(images); //bot gives back images to the user
      })
      .catch(function (error) {
        console.error('Search failed:', error);
      });
  }

  findHuskyImage(keyword);

});


app.listen(port, () => {
  console.log(`app running on ${port}`);
});
