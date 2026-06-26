const fs = require('fs/promises');

module.exports.delay = function () {
    return new Promise(resolve => setTimeout(resolve, 500));
};

module.exports.sortByKey = function (array, key) {
    return [...array].sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

module.exports.removeDuplicateObjects = function (myArr, prop) {
    const seen = new Set();
    return myArr.filter(obj => {
        const val = obj[prop];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
    });
}

module.exports.removeDuplicateStrings = function ( data ) {

    if ( Array.isArray(data) ) {

        data = [...new Set(data)];
        data = data.filter(function (el) {
            return el != null;
        });

        return data;

    }

    return data;

}

module.exports.write = async function (data, file) {

    try {

        let path = file.split('/');
        path.pop();
        path = path.join('/');

        console.log(path);

        await fs.mkdir(path, { recursive: true });

        data = JSON.stringify(data, null, 4);
        await fs.writeFile(file, data, 'utf8');

        console.log('Data written to ' + file);

        return true;

    } catch (error) {

        console.log(error);

        return false;
    }

}