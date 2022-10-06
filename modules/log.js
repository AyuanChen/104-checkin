const time = require('./time.js')
const fs = require('fs');
const util = require('util');
const logFile = fs.createWriteStream('log.txt', { flags: 'a' });
// Or 'w' to truncate the file every time the process starts.
const logStdout = process.stdout;

normal = function () {
    logFile.write('[' + time.current_time() + '] ' + util.format.apply(null, arguments) + '\n');
    logStdout.write('[' + time.current_time() + '] ' + util.format.apply(null, arguments) + '\n');
}
error = normal;

module.exports = {
    normal,
    error
}