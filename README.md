# Parliamentary Data Scraper

Scrapes MPs details, Constituencies and Parties of the House of Commons (United Kingdom Parliament) into a useful json format.

## Usage Example

Install the package using `npm install parliament-data-scraper --save`  then use it:

```
const scraper = require('parliament-data-scraper');

(async () => {
    await scraper.scrapeAllParliamentData(__dirname + '/data/');
})();
```

this will create the following files in the `data/` directory in the project root

```
uk-parliament/commons/mps-details.json
uk-parliament/commons/mps.json
uk-parliament/commons/parties.json
uk-parliament/commons/constituencies.json
```

## Todo List

- Extend UK Parliament House of Commons data scraping
- Add House of Lords data to UK Parliament scraper `scrapers/ukParliament.js`
- Add Scottish Parliament scraper
- Add Northern Ireland Assembly scraper
- Add Welsh Assembly scraper
- Add other scrapers

## Contributions

- Contributions welcome just follow the general structure of the project and open a pull request
