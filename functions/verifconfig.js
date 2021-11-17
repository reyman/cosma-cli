/**
 * @file Generate or check the config file. Contains function to modif the config file.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , yamlEditor = require('js-yaml');

/**
 * Write config file if not exist
 */

const baseConfig = {
    files_origin: '',
    export_target: '',
    focus_max: 2,
    record_types: { undefined: 'grey' },
    link_types: { undefined: { stroke: 'simple', color: 'rgb(225, 225, 225)' } },
    graph: {
        background_color: 'white',
        highlight_color: 'red',
        highlight_on_hover: true,
        text_size: 10,
        attraction: { force: -50, distance_max: 250, verticale: 0, horizontale: 0 },
        arrows: false
    }
};

if (!fs.existsSync('config.yml')){

    const configYml = yamlEditor.safeDump(baseConfig); // JSON -> YAML

    console.log('\x1b[32m', 'Create config.yml file', '\x1b[0m');

    fs.writeFileSync('config.yml', configYml, (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'write config.yml file : ' + err) }
    });

    process.exit();
}

/**
 * Read config
 */

const config = yamlEditor.safeLoad(fs.readFileSync('config.yml', 'utf8'));

/**
 * Valid config values
 */

let errors = [];

for (const prop in baseConfig) {
    if (config[prop] === undefined || config[prop] === null || config[prop] === '') {
        errors.push(prop);
    }
}

if (errors.length !== 0) {
    // error listing
    console.error('\x1b[31m', 'Err.', '\x1b[0m', 'The config is not complete. Check or delete.');
    console.error('\x1b[37m', 'About props : ' + errors.join(', '), '\x1b[0m');
    process.exit();
}

/**
 * Valid config paths
 */

if (!fs.existsSync(config.files_origin)) {
    console.error('\x1b[31m', 'Err.', '\x1b[0m', 'You must specify a valid folder path to your Markdown files database in config file.');
    process.exit();
}

if (!fs.existsSync(config.export_target)) {
    console.error('\x1b[31m', 'Err.', '\x1b[0m', 'You must specify a valid folder path to export Cosmoscope in the config file.');
    process.exit();
}

exports.config = config;

/**
 * Functions for modify config
 */

/**
 * Change import folder path
 * @param {string} path - Path to import folder.
 */

function modifyImportPath(path) {
    if (!path || !fs.existsSync(path)) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'You must specify a valid file path to your Markdown database file.'); }

    config.files_origin = path;

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'update config.yml file : ' + err); }
        console.log('\x1b[32m', 'config updated', '\x1b[0m', ': import path')
    });
}

exports.modifyImportPath = modifyImportPath;

/**
 * Change Cosmoscope export folder path
 * @param {string} path - Path to export folder.
 */

function modifyExportPath(path) {

    if (!path || !fs.existsSync(path)) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'You must specify a valid target to export in the configuration.'); }

    config.export_target = path;

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'update config.yml file : ' + err); }
        console.log('\x1b[32m', 'config updated', '\x1b[0m', ': export path')
    });
}

exports.modifyExportPath = modifyExportPath;

/**
 * Add a record type to config
 * @param {string} name - Type name.
 * @param {string} color - Type color : hexa, rgb or color name.
 */

function addRecordType(name, color) {

    if (!name) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Enter a type name.'); }
    if (!color) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Enter a type color.'); }

    config.record_types[name] = color;

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'update config.yml file : ' + err); }
        console.log('add "' + name + '" type into config.yml file');
        console.log('\x1b[32m', 'config updated', '\x1b[0m', ': type ' + name)
    });
}

exports.addRecordType = addRecordType;

/**
 * Add a view key to config
 * @param {string} name - View name.
 * @param {string} key - Base64 encoded string.
 */

function addView(name, key) {

    if (!name) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Enter a view name.'); }
    if (!key) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Enter a view key.'); }

    if (config.views === undefined) {
        config.views = {}; }

    config.views[name] = String(key);

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'update config.yml file : ' + err); }
        console.log('add "' + name + '" view into config.yml file');
        console.log('\x1b[32m', 'config updated', '\x1b[0m', ': type ' + name)
    });
}

exports.addView = addView;

/**
 * Create custom.css file & update config about it
 */

function addCustomCSS() {

    if (config.views === undefined) {
        config.custom_css = true; }
    else { config.custom_css = true; }

    let filePath = 'template/custom.css';

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.log('\x1b[31m', 'Err.', '\x1b[0m', 'update config.yml file : ' + err); }
        console.log('\x1b[32m', 'config updated', '\x1b[0m')
    });

    if (fs.existsSync(filePath)) {
        return console.log('\x1b[0m', 'custom.css file already exist', '\x1b[0m');
    }

    fs.writeFile(filePath, '', (err) => {
        if (err) { return console.log('\x1b[31m', 'Err.', '\x1b[0m', 'update config.yml file : ' + err); }
        console.log('\x1b[32m', 'Create custom.css file', '\x1b[0m')
    });
}

exports.addCustomCSS = addCustomCSS;