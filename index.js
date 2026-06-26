const ukParliament = require('./scrapers/ukParliament.js');
const scottishParliament = require('./scrapers/scottishParliament.js');

module.exports.scrapeScottishParliamentData = scottishParliament.scrapeScottishParliamentData;
module.exports.scrapeUkParliamentData = ukParliament.scrapeUkParliamentData;

module.exports.scrapeAllParliamentData = async function ( path ) {

    let scrapers = [
        this.scrapeScottishParliamentData( path ),
        this.scrapeUkParliamentData ( path )
    ];

    return await Promise.all(scrapers);

}