/** @namespace */
const view = {
        /**
         * List of ids from highlighted nodes
         * @type {array}
         * @default
         */
        highlightedNodes: [],
        /**
         * If the focus mode is activated
         * @type {boolean}
         * @default
         */
        isolateMode: false,
        /**
         * List of name from active filters
         * @type {array}
         * @default
         */
        activeFilters: [],
        /**
         * Id from the current isolated node
         * @type {array}
         * @default
         */
        isolateId: undefined, 
        /**
         * Id from the current diplayed record
         * @type {array}
         * @default
         */
        openedRecord: undefined,
        /**
         * Name 'data-tag' from the activated tag
         * @type {string}
         * @default
         */
        activeTag: undefined,
        /**
         * Zoom and position on the graph
         * @type {object}
         * @default
         */
        position: {x: 0, y: 0, zoom: 1}
    }
    , svg = d3.select("#graph_canvas");

/**
 * Navigation history entries managment
 * @namespace
*/
const historique = {
    /**
     * Add a new entry into history and change page title
     * @param {number} recordId - 
     * @param {string} recordTitle - 
     */
    actualiser: function(recordId, recordTitle) {
        // url as <filePath>/cosmoscope.html#<recordId>
        const url = new URL('#' + recordId, window.location);

        // add record to history
        if (history.state == null) {
            // if it is the first entry, we must init history
            this.init(recordId, recordTitle, url);
        }
        else {
            const timeline = history.state.hist; // past history
            timeline.push(recordId);
            history.pushState({hist : timeline}, recordTitle, url);
        }

        // change page title
        document.title = recordTitle + ' - Cosma';
    },
    /**
     * Add first entry into history
     * @param {number} recordId - 
     * @param {string} recordTitle - 
     * @param {string} url - File URL + #hash
     */
    init: function(recordId, recordTitle, url) {
        history.pushState({hist : [recordId]}, recordTitle, url);
    }
}

// At navigation travel, with forward/backward webbrowser's buttons
window.onpopstate = function(e) {
    if (e.state === null) { return; }
    // open record from a history entry
    const timeline = e.state.hist
        , recordId = timeline[timeline.length - 1];

    openRecord(recordId, false);
};

// keyboard shortcuts
document.onkeydown = (e) => {
    if (e.altKey === true) {
        // shortcuts with 'Alt' key
        e.preventDefault();

        switch (e.code) {
            case 'KeyS':
                searchInput.focus();
                return;

            case 'KeyR':
                zoomReset();
                return;

            case 'KeyW':
                document.querySelector('.head-load-bar').click();
                return;
        }

        return;
    }

    switch (e.key) {
        case 'Escape':
            closeRecord();
            return;
    }
};

(function (){
const roll = document.getElementById('cosma-roll');
roll.parentElement.addEventListener('click', () => {
    roll.classList.toggle('anim');
});
})();