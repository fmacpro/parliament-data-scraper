const scraper = require('./index.js');

(async () => {
    await scraper.scrapeAllParliamentData(__dirname + '/data/');
})();