const scraper = require('./index.js');

(async () => {
    try {
        await scraper.scrapeAllParliamentData('./data/');
        console.log('Scraping completed successfully');
    } catch (error) {
        console.error('Scraping failed:', error.message);
        process.exit(1);
    }
})();