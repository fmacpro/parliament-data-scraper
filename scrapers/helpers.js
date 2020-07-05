const fs = require('fs');

module.exports.delay = function () {
    return new Promise(resolve => setTimeout(resolve, 500));
};

module.exports.write = async function (data, file) {

    try {

        if ( Array.isArray(data) ) {

            data = [...new Set(data)];
            data = data.filter(function (el) {
                return el != null;
            });

        }

        let path = file.split('/');
        path.pop();
        path = path.join('/');

        console.log(path);

        fs.mkdir(path, { recursive: true }, function (err) {
            if (err) {
                return console.log('failed to write directory', err);
            }

            data = JSON.stringify(data, null, 4);
            fs.writeFile(file, data, 'utf8', function (err) {
                if (err) throw err
            });

            console.log('Data written to ' + file);

            return true;
        });

    } catch (error) {

        console.log(error);

        return false;
    }

}