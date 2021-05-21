const primTagsContainer = document.querySelector('.menu-tags-container-prim');

function tag(tagElt) {
    const isActive = tagElt.dataset.active
        // tag brothers from sort div's
        , tagBtns = document.querySelectorAll('[data-tag="' + tagElt.dataset.tag + '"]');

    if (isActive === 'true') {
        tagBtns.forEach(tagBtn => { tagBtn.dataset.active = false; });
    } else {
        tagBtns.forEach(tagBtn => { tagBtn.dataset.active = true; });
    }

    // get active tags and the linked nodes id
    const activeTags = Array.from(primTagsContainer.querySelectorAll('[data-tag][data-active="true"]'));
    let nodeIds = activeTags.map(function(activeTagBtn) {
        return tagList[activeTagBtn.dataset.tag - 1].nodes; // 'tagList' is global var, set from template.njk
    }).flat();

    // delete duplicated elements
    nodeIds = nodeIds.filter((item, index) => { return nodeIds.indexOf(item) === index });

    labelUnlightAll();
    if (nodeIds.length !== 0) { hideAllFromIndex(); }
    else { displayAllFromIndex(); }
    labelHighlight(nodeIds); displayFromIndex(nodeIds);
    
    setCounter(counters.tag, activeTags.length);
}