const fs = require('fs')
    , historyPath = require('../functions/history');

const Graph = require('../core/models/graph')
    , Config = require('../core/models/config')
    , Template = require('../core/models/template');

module.exports = function ({config: configPath, ...options}) {
    const time = require('../functions/time');

    let customConfig = (configPath !== undefined ? Config.get(configPath) : {});
    customConfig = new Config(customConfig);

    if (customConfig.isValid() === false) {
        console.error('\x1b[33m', 'Warn.', '\x1b[0m', 'Invalid config options :', customConfig.report.join(', ')); }

    options['publish'] = true;
    options['citeproc'] = (!!options['citeproc'] && customConfig.canCiteproc());
    options['css_custom'] = (!!options['customCss'] && customConfig.canCssCustom());

    options = Object.keys(options)
        .map((key) => { return { name: key, value: options[key] } })
        .filter(option => option.value === true)
        .map(option => option.name)

    const graph = new Graph(options, customConfig.opts)
        , template = new Template(graph);

    require('./log')(graph.report);

    if (graph.errors.length > 0) {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', graph.errors.join(', ')); }

    fs.writeFile(customConfig.opts.export_target + 'cosmoscope.html', template.html, (err) => { // Cosmoscope file for export folder
        if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
        console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${graph.files.length} records)`)
    });

    if (customConfig.opts.history === false) { return; }

    historyPath.createFolder();
    fs.writeFile(`history/${time}/cosmoscope.html`, template.html, (err) => { // Cosmoscope file for history
        if (err) { console.error('\x1b[31m', 'Err.', '\x1b[0m', 'can not save Cosmoscope into history : ' + err); }
    });
}