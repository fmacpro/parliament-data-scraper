const helpers = require('./helpers.js');
const axios = require('axios');

const getDetail = async function (id) {
    try {
        await helpers.delay();

        let response = await axios.get( 'https://api.parliament.uk/query/person_by_id.rj?person_id='+ id );

        return response.data;

    } catch (error) {
        console.log('Error fetching detail. Retrying...');

        await helpers.delay();

        let response = await axios.get( 'https://api.parliament.uk/query/person_by_id.rj?person_id='+ id );

        return response.data;
    }
};

const scrape = async function (item) {

    let mp = {};

    mp.id = item['@id'];

    item.detail = await getDetail(mp.id);

    mp.givenName = item.personGivenName || '';
    mp.familyName = item.personFamilyName || '';

    mp.fullName = item['http://example.com/F31CBD81AD8343898B49DC65743F0BDF'] || '';

    mp.parlimentaryName = item.detail['https://id.parliament.uk/' + mp.id]['http://example.com/D79B0BAC513C4A9A87C9D5AFF1FC632F'][0].value || '';
    mp.constituency = item.memberHasParliamentaryIncumbency.seatIncumbencyHasHouseSeat.houseSeatHasConstituencyGroup.constituencyGroupName || '';

    if ( item.memberHasMemberImage ) {
        mp.imgID = item.memberHasMemberImage['@id'] || ''; // https://api.parliament.uk/photo/7Ip3z0GX.jpeg?crop=MCU_3:2&width=500&quality=80
    }
    if ( item.detail['https://id.parliament.uk/' + mp.id]['https://id.parliament.uk/schema/personHasPersonalWebLink'] ) {
        mp.website = item.detail['https://id.parliament.uk/' + mp.id]['https://id.parliament.uk/schema/personHasPersonalWebLink'][0].value || '';
    }
    if ( item.detail['https://id.parliament.uk/' + mp.id]['https://id.parliament.uk/schema/personHasTwitterWebLink'] ) {
        mp.twitter = item.detail['https://id.parliament.uk/' + mp.id]['https://id.parliament.uk/schema/personHasTwitterWebLink'][0].value || '';
    }
    if ( item.partyMemberHasPartyMembership && item.partyMemberHasPartyMembership.partyMembershipHasParty ) {
        let partyID = item.partyMemberHasPartyMembership.partyMembershipHasParty['@id'];
        mp.party = item.detail['https://id.parliament.uk/' + partyID]['https://id.parliament.uk/schema/partyName'][0].value || '';
    }

    console.log('Details for ' + mp.givenName + ' ' + mp.familyName + ' scraped');

    return mp;

};

module.exports.scrapeUkParliamentData = async function ( path ) {

    try {

        const response = await axios.get('https://api.parliament.uk/query/house_current_members.json?house_id=1AFu55Hs');
        const list = response.data['@graph'];

        let mps = [];
        let mpsNames = [];
        let parties = [];
        let constituencies = [];

        for (let item of list) {
            if ( item['@type'] === 'Person' ) {

                let mp = await scrape(item);

                mps.push(mp);
                mpsNames.push(mp.fullName);
                constituencies.push(mp.constituency);
                parties.push(mp.party);

            }
        }

        let writes = [];

        writes.push(helpers.write(mps, path + 'uk-parliament/commons/mps-details.json'));
        writes.push(helpers.write(helpers.removeDuplicateStrings(mpsNames), path + 'uk-parliament/commons/mps.json'));
        writes.push(helpers.write(helpers.removeDuplicateStrings(parties), path + 'uk-parliament/commons/parties.json'));
        writes.push(helpers.write(helpers.removeDuplicateStrings(constituencies), path + 'uk-parliament/commons/constituencies.json'));

        await Promise.all(writes);

        return true;

    } catch (error) {

        console.log(error);

        return false;
    }

};