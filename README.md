# Parliamentary Data Scraper

Scrapes MPs details, Constituencies, Parties, Government Roles & Groups into a useful json format.

Currently covers:

- House of Commons (United Kingdom Parliament)
- Scottish Parliament

## Usage

Install the package using `npm install parliament-data-scraper --save` then use it:

### Scrape all parliaments

```js
const scraper = require("parliament-data-scraper");

(async () => {
  await scraper.scrapeAllParliamentData(__dirname + "/data/");
})();
```

### Scrape individual parliaments

```js
const scraper = require("parliament-data-scraper");

// UK Parliament only
(async () => {
  await scraper.scrapeUkParliamentData(__dirname + "/data/");
})();

// Scottish Parliament only
(async () => {
  await scraper.scrapeScottishParliamentData(__dirname + "/data/");
})();
```

Running `scrapeAllParliamentData` will create the following files in the `data/` directory in the project root

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
scottish-parliament/cross-party-groups.json
```

## Todo List

- Add House of Lords
- Add Northern Ireland Assembly
- Add Welsh Assembly
- Extend scope of data
- Add others

## Contributions

- Contributions welcome just follow the general structure of the project and open a pull request
