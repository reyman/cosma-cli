function getOutLinks(fileContent) {
    let links = fileContent.match(/(?<=\[\[\s*).*?(?=\s*\]\])/gs);

    if (links === null) { return []; }

    return links.map(function(link) {
        link = link.split(':', 2);
        if (link.length === 2) {
            return {type: link[0], aim: Number(link[1])};
        }
        return {type: 'undefined', aim: Number(link[0])};
    })
}

exports.getOutLinks = getOutLinks;

function getRank(outLink, inLink) {
    let rank = 1;
    rank += ~~(inLink / 3);
    rank += outLink / 3;
    return rank;
}

exports.getRank = getRank;