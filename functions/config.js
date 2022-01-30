/**
 * @file Get and verif a config YAML file to include in repositories
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , yml = require('js-yaml');

const Config = require('../core/models/config')
    , Repositories = require('../core/models/repositories');

module.exports = function (name, filePath) {
    if (fs.existsSync(filePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Config file do not exist.'); }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Can not read config file.'); }
        
        if (['.yml', '.yaml'].includes(path.extname(filePath)) === false) {
            return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Config file must be YAML.'); }

        const opts = yml.load(data);

        if (new Config(opts).isValid() === false) {
            return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Config file is not valid.'); }

        const repositories = new Repositories();
        repositories.add(name, filePath, opts);

        if (repositories.isValid() === false) {
            return console.error('\x1b[31m', 'Err.', '\x1b[0m', repositories.writeReport());
        }

        repositories.save();
    })
}