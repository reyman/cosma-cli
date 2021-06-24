/**
 * @file Replace quote markups and generate bibliography.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const fs = require('fs')
    , CSL = require('citeproc')
    , Citr = require('@zettlr/citr')
    , config = require('./verifconfig').config;

let library = false // if no path to JSON library file
    , citeproc
    , xmlLocal = './template/citeproc/locales.xml';

const flag = process.argv[3]; // terminal request argument

if (flag === '--citeproc' || flag === '-c') {
    if (config.bibliography && config.csl
        && fs.existsSync(config.bibliography) && fs.existsSync(config.csl)
        && fs.existsSync(xmlLocal))
    {
        library = {};
    
        let library_array = fs.readFileSync(config.bibliography, 'utf-8');
        library_array = JSON.parse(library_array);
    
        for (const item of library_array) {
            library[item.id] = item; }
    
        citeproc = getCSL();
    } else {
        console.error('\x1b[33m', 'Citeproc off : no library and/or CSL file from config.', '\x1b[0m');
    }
}

/**
 * Check the 'citeproc' mode can be on
 * @return {bool}
 */

function citeprocModeIsActive() {
    if (library === false) {
        return false;
    }

    return true;
}

exports.citeprocModeIsActive = citeprocModeIsActive;

/**
 * Get all quoting keys from a file
 * @param {string} fileContent - Markdown content
 * @return {object} - All quoting keys and for each the linked ids & attributes
 */

function catchQuoteKeys(fileContent) {
    let extractions = Citr.util.extractCitations(fileContent)
        , quoteKeys = {}
        , libraryIds = Object.keys(library)
        , undefinedLibraryIds = [];

    quoteExtraction:
    for (let i = 0; i < extractions.length; i++) {
        const extraction = extractions[i];

        const quotes = Citr.parseSingle(extraction);
        // there could be several quotes from one key
        for (const q of quotes) {
            library[q.id].used = true;

            if (libraryIds.includes(q.id) === false) {
                // if the quote id is not defined from library
                undefinedLibraryIds.push(q.id)
                continue quoteExtraction;
            }
        }

        quoteKeys[extraction] = quotes;
    }

    return {
        quoteKeys: quoteKeys,
        undefinedLibraryIds: undefinedLibraryIds
    };
}

exports.catchQuoteKeys = catchQuoteKeys;

/**
 * Replace each quoting key from the file content by a short quote from library
 * @param {string} fileContent - Markdown content
 * @param {object} fileQuoteKeys - All quoting keys and for each the linked ids & attributes
 * @return {string} - File content with the short quotes
 */

function convertQuoteKeys(fileContent, fileQuoteKeys) {
    const quoteIds = getCitationsFromKey(fileQuoteKeys);

    if (citeproc === false) { return fileContent; }
    citeproc.updateItems(quoteIds);

    const citations = Object.values(fileQuoteKeys).map(function(key, i) {
        return [{
            citationItems: key,
            properties: { noteIndex: i + 1 }
        }];
    });

    for (let i = 0; i < citations.length; i++) {
        const cit = citations[i];
        const key = Object.keys(fileQuoteKeys)[i]

        const citMark = citeproc.processCitationCluster(cit[0], [], [])[1][0][1];

        fileContent = fileContent.replace(key, citMark);
    }

    return fileContent;
}

exports.convertQuoteKeys = convertQuoteKeys;

/**
 * Get the bibliography for a file for each contained quote & from the library
 * @param {object} fileQuoteKeys - All quoting keys and for each the linked ids & attributes
 * @return {string} - Bibliography HTML
 */

function genBibliography(fileQuoteKeys) {
    const quoteIds = getCitationsFromKey(fileQuoteKeys);

    if (citeproc === false) { return false; }
    citeproc.updateItems(quoteIds);

    return citeproc.makeBibliography()[1].join('\n');
}

exports.genBibliography = genBibliography;

/**
 * Get 'citeproc' engine, from library and config files (XML, CSL)
 * @return {string} - Bibliography HTML
 */

function getCSL() {

    if (library === false) { return false; }

    xmlLocal = fs.readFileSync(xmlLocal, 'utf-8')
        , cslStyle = fs.readFileSync(config.csl, 'utf-8');

    return new CSL.Engine({
        retrieveLocale: () => {
            return xmlLocal;
        },
        retrieveItem: (id) => {
            // find the quote item : CSL-JSON object
            return library[id];
        }
    }, cslStyle);
}

/**
 * From all quoting keys get linked ids & attributes 
 * @param {object} quoteKeys - All quoting keys and for each the linked ids & attributes
 * @return {string} - List of keys linked ids & attributes
 */

function getCitationsFromKey(quoteKeys) {
    return Object.values(quoteKeys)
        .map(function(key) {
            let ids = [];

            for (const cit of key) {
                ids.push(cit.id);
            }

            return ids;
        })
        .flat();
}

/**
 * Get all metas for each quoted reference from all records
 * @return {array} - Array of objects (references)
 */

function getUsedCitationReferences() {
    if (citeprocModeIsActive() === false) { return false; }

    const refs = Object.values(library).filter(item => item.used === true);

    if (refs.length === 0) { return false; }

    return refs;
}

exports.getUsedCitationReferences = getUsedCitationReferences;