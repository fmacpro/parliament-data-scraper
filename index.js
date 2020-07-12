const ukParliament = require('./scrapers/ukParliament.js');
const sottishParliament = require('./scrapers/scottishParliament.js');

module.exports.scrapeScottishParliamentData = sottishParliament.scrapeScottishParliamentData;
module.exports.scrapeUkParliamentData = ukParliament.scrapeUkParliamentData;

module.exports.scrapeAllParliamentData = async function ( path ) {

    let scrapers = [
        this.scrapeScottishParliamentData( path ),
        this.scrapeUkParliamentData ( path )
    ];

    return await Promise.all(scrapers);

}