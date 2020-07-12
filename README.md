# Parliamentary Data Scraper

Scrapes MPs details, Constituencies and Parties into useful a json format.

Currently covers:
- House of Commons (United Kingdom Parliament)
- Scottish Parliament

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

scottish-parliament/msps-details.json
scottish-parliament/msps.json
scottish-parliament/parties.json
scottish-parliament/constituencies.json
scottish-parliament/government-roles.json
```

## Todo List

- Add House of Lords
- Add Northern Ireland Assembly
- Add Welsh Assembly
- Extend scope of data
- Add others

## Contributions

- Contributions welcome just follow the general structure of the project and open a pull request
