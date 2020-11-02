function extractAll(fileContent) {
    return (fileContent.match(/(?<=\[\[\s*).*?(?=\s*\]\])/gs) || []);
}

exports.extractAll = extractAll;

function getNbLink(linkList, fileId) {
    let i = linkList.reduce(function(n, val) {
        return n + (val === String(fileId));
    }, 0);

    return i;
}

function getRank(linkList, fileId, linkNb) {
    let rank = 1;
    rank += ~~(getNbLink(linkList, fileId) / 3);
    rank += linkNb / 3;
    return rank;
}

exports.getRank = getRank;