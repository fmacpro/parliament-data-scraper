const ukParliament = require('./scrapers/ukParliament.js');

module.exports.scrapeUkParliamentData = ukParliament.scrapeUkParliamentData;

module.exports.scrapeAllParliamentData = async function ( path ) {

    let scrapers = [
        this.scrapeUkParliamentData( path )
    ];

    return await Promise.all(scrapers);

}