const helpers = require('./helpers.js');
const axios = require('axios');
const cache = require('memory-cache');

let _parties = [];
let _constituencies = [];
let _roles = [];
let _groups = [];

const getGovRoleDetail = async function (id) {

    try {

        let roles = cache.get('membergovernmentroles');

        if ( !roles ) {
            let response = await axios.get( 'https://data.parliament.scot/api/membergovernmentroles' );
            roles = response.data;
            await cache.put('membergovernmentroles', roles);
        }

        let memberRoles = [];

        for ( let i = 0; i < roles.length; i++ ) {

            if ( id === roles[i].PersonID ) {

                let role = {};

                role.id = roles[i]['GovernmentRoleID'];
                let govRoleDetail = await axios.get( 'https://data.parliament.scot/api/governmentroles/' + role.id );
                role.name = govRoleDetail.data['Name'];

                role.ValidFromDate = roles[i]['ValidFromDate'];
                role.ValidUntilDate = roles[i]['ValidUntilDate'];

                memberRoles.push(role);
            }

        }

        memberRoles = helpers.sortByKey(memberRoles, 'ValidFromDate');

        return memberRoles.reverse();

    } catch (e) {

        return null;

    }
};

const getGroupDetail = async function (id) {

    try {

        let groups = cache.get('membercrosspartyroles');

        if ( !groups ) {
            let response = await axios.get( 'https://data.parliament.scot/api/membercrosspartyroles' );
            groups = response.data;
            await cache.put('membercrosspartyroles', groups);
        }

        let memberGroups = [];

        for ( let i = 0; i < groups.length; i++ ) {

            if ( id === groups[i].PersonID ) {

                let group = {};

                group.id = groups[i]['CrossPartyGroupID'];
                let groupDetail = await axios.get( 'https://data.parliament.scot/api/crosspartygroups/' + group.id );
                group.name = groupDetail.data['Name'];

                group.ValidFromDate = groups[i]['ValidFromDate'];
                group.ValidUntilDate = groups[i]['ValidUntilDate'];

                memberGroups.push(group);
            }

        }

        memberGroups = helpers.sortByKey(memberGroups, 'ValidFromDate');

        return memberGroups.reverse();

    } catch (e) {

        return null;

    }
};

const getPartyDetail = async function (id) {

    try {

        let parties = cache.get('memberparties');

        if ( !parties ) {
            let response = await axios.get( 'https://data.parliament.scot/api/memberparties' );
            parties = response.data;
            await cache.put('memberparties', parties);
        }

        let memberParties = [];

        for ( let i = 0; i < parties.length; i++ ) {

            if ( id === parties[i]['PersonID'] ) {

                let party = {};

                party.id = parties[i]['PartyID'];
                let partyDetail = await axios.get( 'https://data.parliament.scot/api/parties/' + party.id );
                partyDetail = partyDetail.data;

                party.name = partyDetail['ActualName'];
                party.preferredName = partyDetail['PreferredName'];
                party.validFromDate = partyDetail['ValidFromDate'];

                memberParties.push(party);
            }

        }

        memberParties = helpers.sortByKey(memberParties, 'ValidFromDate');

        return memberParties.reverse();

    } catch (e) {

        return null;

    }
};

const getConstituencyDetail = async function (id) {

    try {

        let constituencies = cache.get('MemberElectionConstituencyStatuses');

        if ( !constituencies ) {
            let response = await axios.get( 'https://data.parliament.scot/api/MemberElectionConstituencyStatuses' );
            constituencies = response.data;
            await cache.put('MemberElectionConstituencyStatuses', constituencies);
        }

        let memberConstituencies = [];

        for ( let i = 0; i < constituencies.length; i++ ) {

            if ( id === constituencies[i]['PersonID'] ) {

                let constituency = {};

                constituency.id = constituencies[i]['ConstituencyID'];

                let constituencyDetail = await axios.get( 'https://data.parliament.scot/api/constituencies/' + constituency.id );
                constituencyDetail = constituencyDetail.data;

                constituency.code = constituencyDetail['ConstituencyCode'];
                constituency.ShortName = constituencyDetail['ShortName'];
                constituency.name = constituencyDetail['Name'];

                constituency.ValidFromDate = constituencies[i]['ValidFromDate'];

                if ( constituencies[i]['ElectionStatusID'] === 1 ) {
                    constituency.ElectionStatus = 'Current';
                } else {
                    constituency.ElectionStatus = 'Not Current';
                }

                let regionID = constituencyDetail['RegionID'];

                let regionDetail = await axios.get( 'https://data.parliament.scot/api/regions/' + regionID );
                regionDetail = regionDetail.data;

                constituency.region = {};
                constituency.region.id = regionDetail['ID'];
                constituency.region.name = regionDetail['Name'];
                constituency.region.RegionCode = regionDetail['RegionCode'];
                constituency.region.StartDate = regionDetail['StartDate'];
                constituency.region.EndDate = regionDetail['EndDate'];
                constituency.region.ValidFromDate = constituencyDetail['ValidFromDate'];

                memberConstituencies.push(constituency);
            }

        }

        memberConstituencies = helpers.sortByKey(memberConstituencies, 'ValidFromDate');

        return memberConstituencies.reverse();

    } catch (e) {

        return null;

    }
};

const scrape = async function (item) {

    let mp = {};

    mp.id = item['PersonID'];
    mp.photo = item['PhotoURL'];

    let nameParts = item['ParliamentaryName'].split(',');
    let name = nameParts[1] + ' ' + nameParts[0];
    mp.parlimentaryName = name.trim();

    mp.PreferredName = item['PreferredName'];
    mp.BirthDate = item['BirthDate'];

    mp.role = {};

    let role = await getGovRoleDetail(mp.id);

    if ( role ) {
        mp.role.government = role;

        for ( let i = 0; i < role.length; i++ ) {

            _roles.push( {
                id: role[i].id,
                name: role[i].name
            } );

            helpers.sortByKey(_roles, 'id');

        }
    }

    let group = await getGroupDetail(mp.id);

    if ( group ) {
        mp.group = group;

        for ( let i = 0; i < group.length; i++ ) {

            _groups.push( {
                id: group[i].id,
                name: group[i].name
            } );

            helpers.sortByKey(_groups, 'id');

        }
    }

    let party = await getPartyDetail(mp.id);

    if ( party ) {
        mp.party = party;

        for ( let i = 0; i < party.length; i++ ) {

            _parties.push( {
                id: party[i].id,
                name: party[i].name,
                preferredName: party.preferredName
            } );

            helpers.sortByKey(_parties, 'id');

        }

    }

    let constituency = await getConstituencyDetail(mp.id);

    if ( constituency ) {
        mp.constituency = constituency;

        for ( let i = 0; i < constituency.length; i++ ) {

            _constituencies.push( {
                id: constituency[i].id,
                code: constituency[i].code,
                ShortName: constituency[i].ShortName,
                name: constituency[i].name,
                region : {
                    id: constituency[i].region.id,
                    name: constituency[i].region.name,
                    RegionCode: constituency[i].region.RegionCode
                }
            } );

            helpers.sortByKey(_constituencies, 'id');

        }

    }

    console.log('Details for ' + mp.parlimentaryName + ' scraped');

    return mp;

};

module.exports.scrapeScottishParliamentData = async function ( path ) {

    try {

        const response = await axios.get('https://data.parliament.scot/api/members');

        const list = response.data

        let mps = [];
        let mpsNames = [];

        for (let item of list) {
            if ( item['IsCurrent'] === true ) {

                let mp = await scrape(item);

                mps.push(mp);
                mpsNames.push(mp.parlimentaryName);

                await helpers.delay();

            }
        }

        let writes = [];

        writes.push(helpers.write(mps, path + 'scottish-parliament/msps-details.json'));
        writes.push(helpers.write(helpers.removeDuplicateStrings(mpsNames), path + 'scottish-parliament/msps.json'));
        writes.push(helpers.write(helpers.removeDuplicateObjects(_parties, 'id'), path + 'scottish-parliament/parties.json'));
        writes.push(helpers.write(helpers.removeDuplicateObjects(_constituencies, 'id'), path + 'scottish-parliament/constituencies.json'));
        writes.push(helpers.write(helpers.removeDuplicateObjects(_roles, 'id'), path + 'scottish-parliament/government-roles.json'));
        writes.push(helpers.write(helpers.removeDuplicateObjects(_groups, 'id'), path + 'scottish-parliament/cross-party-groups.json'));

        await Promise.all(writes);

        return true;

    } catch (error) {

        console.log(error);

        return false;
    }

};