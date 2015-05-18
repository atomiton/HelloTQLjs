chalk = require('chalk');
parse = require('../lib/tqlParse');
tqlUtil = require('../lib/tqlUtil');
requests = require('./requests').requests;


requests.forEach(function(req) {
    var translation = parse.parse(req);

    console.log(chalk.white(JSON.stringify(req)));
    if (!translation.success) {
        console.log(chalk.red(translation.error));
        return
    }

    console.log(chalk.green(translation.success));
})
