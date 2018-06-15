const request = require('request');
const progress = require('request-progress');
const fs = require('fs');

process.send = process.send || function(msg) {
    console.log(msg)
};

const download = (key, url, filepath, range_start, range_end, throttle) => {
    let d_err;
    let r = request(url, {
        'headers': {
            'Range': 'bytes=' + range_start + '-' + range_end
        }
    });
    progress(r, {
            'throttle': throttle
        })
        .on('response', response => {
            if (response.statusCode < 200 || response.statusCode > 210) {
                r.abort();
                d_err = 'http status code: ' + response.statusCode;
                process.send({
                    'key': key,
                    'err': d_err
                });
            }
        })
        .on('progress', function(state) {
            process.send({
                'key': key,
                'progress': state
            });
        })
        .on('error', function(err) {
            d_err = err;
            process.send({
                'key': key,
                'err': err
            });
        })
        .on('end', function() {
            process.send({
                'key': key,
                'finish': true,
                'err': d_err
            });
        })
        .pipe(fs.createWriteStream(filepath));
}

if (module.parent) {
    exports.download = download;
} else {
    if (process.argv.length < 8) {
        console.error('invalidate process arguments');
    } else {
        let [_1, _2, key, url, filepath, range_start, range_end, throttle] = process.argv;
        range_start = parseInt(range_start);
        range_end = parseInt(range_end);
        throttle = parseInt(throttle);
        download(key, url, filepath, range_start, range_end, throttle);
    }
}