const resetHighlightBtn = document.getElementById('reset-highlight'); // anti highlightNodes() function btn

/**
 * Apply highlightColor (from config) to somes nodes and their links
 * @param {array} nodeIds - List of nodes ids
 */

function highlightNodes(nodeIds) {

    const elts = getNodeNetwork(nodeIds);

    for (const elt of elts) {
        elt.style.stroke = 'var(--highlight)';
        elt.style.fill = 'var(--highlight)';
    }

    view.highlightedNodes = view.highlightedNodes.concat(nodeIds);
    resetHighlightBtn.style.display = 'block';
}

/**
 * remove highlightColor (from config) from all highlighted nodes and their links
 */

function unlightNodes() {
    if (view.highlightedNodes.length === 0) { return; }

    const elts = getNodeNetwork(view.highlightedNodes);

    for (const elt of elts) {
        elt.style.stroke = null;
        elt.style.fill = null;
    }

    view.highlightedNodes = [];
    resetHighlightBtn.style = null;
}

/**
 * Get nodes
 * Get links of nodes if their source and their target are not hidden
 * @param {array} nodeIds - List of nodes ids
 * @returns {array} - DOM elts : nodes and their links
 */

function getNodeNetwork(nodeIds) {
    let nodes = [], links = [];

    const diplayedNodes = index.filter(function(item) {
        if (item.hidden === true) {
            return false; }

        return item;
    }).map(item => item.id);

    for (const nodeId of nodeIds) {
        // get nodes DOM element
        var node = document.querySelector('[data-node="' + nodeId + '"]');
        if (!node) { continue; }

        nodes.push(node);

        // get links DOM element from nodes, if their target is not hidden
        let sources = document.querySelectorAll('[data-source="' + nodeId + '"]');
        sources = Array.from(sources);
        sources = sources.filter(function(source) {
            if (diplayedNodes.indexOf(Number(source.dataset.target)) !== -1) {
                return true;
            }
        })

        // get links DOM element to nodes, if their source is not hidden
        let targets = document.querySelectorAll('[data-target="' + nodeId + '"]');
        targets = Array.from(targets);
        targets = targets.filter(function(source) {
            if (diplayedNodes.indexOf(Number(source.dataset.source)) !== -1) {
                return true;
            }
        })

        links = links.concat(sources, targets);
    }

    // delete duplicated links DOM element
    links = links.filter((item, index) => {
        return links.indexOf(item) === index
    });

    return nodes.concat(links);
}

/**
 * Hide some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function hideNodes(nodeIds) {
    let nodesToHide = index.filter(function(item) {
        if (nodeIds.indexOf(item.id) !== -1 && item.hidden === false) {
            // return nodes are not yet hidden…
            if (view.isolateMode) {
                if (item.isolated === true) { return true; } // … and part of the isolated ones
            } else {
                return true;
            }
        }
        return false;
    }).map(item => item.id);

    hideFromIndex(nodesToHide);
    const elts = getNodeNetwork(nodesToHide);

    for (const elt of elts) {
        elt.style.display = 'none';
    }

    index = index.map(function(item) {
        if (nodesToHide.indexOf(item.id) !== -1) {
            item.hidden = true; // for each nodesToHide
        }
        return item;
    });
}

/**
 * Display some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function displayNodes(nodeIds) {
    let nodesToDisplay = [];

    index = index.map(function(item) {
        if (nodeIds.indexOf(item.id) !== -1 && item.hidden === true) {
            // push on nodesToDisplay nodes are not yet displayed…
            if (view.isolateMode) {
                if (item.isolated === true) { // … and part of the isolated ones
                    item.hidden = false;
                    nodesToDisplay.push(item.id);
                }
            } else {
                item.hidden = false;
                nodesToDisplay.push(item.id);
            }
        }
        return item;
    });

    displayFromIndex(nodesToDisplay);
    const elts = getNodeNetwork(nodesToDisplay);

    for (const elt of elts) {
        elt.style.display = null;
    }
}