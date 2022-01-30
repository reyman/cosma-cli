/**
 * @file Get and verif a config YAML file to include in repositories
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , yml = require('js-yaml')
    , columnify = require('columnify');

const Config = require('../core/models/config')
    , Repositories = require('../core/models/repositories');

module.exports = function (action, { name, path }) {
    switch (action) {
        case 'list':
            list();
            break;

        case 'read':
            read(name);
            break;

        case 'add':
            add(name, path);
            break;
    }
}

function list () {
    const list = new Repositories().list.map((record) => {
        delete record.opts
        return record;
    })
    const columns = columnify(list, { showHeaders: false, columnSplitter: '\t' })
    console.log(`\n${columns}\n`);
}

function read (name) {
    const repo = new Repositories().get(name);
    if (repo === undefined) {
        return; }
    
    const tab = [];

    for (const optName in repo.opts) {
        optValue = repo.opts[optName];

        if (typeof optValue === 'object') {
            optValue = JSON.stringify(optValue)
        }

        tab.push({
            name: optName,
            value: optValue
        })
    }

    const columns = columnify(tab, { columnSplitter: '\t' });
    console.log(
`---
PATH
---
${repo.path}

---
OPTIONS
---
${columns}
`);
}

function add (name, filePath) {
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