(function () {

    const zoomInterval = 0.3
        , zoomMax = 3
        , zoomMin = 0.6;
    
    svg.call(d3.zoom().on('zoom', function () {
    
        if (d3.event.sourceEvent.type === 'wheel') {
    
            if (d3.event.sourceEvent.deltaY >= 0) {
                zoomLess();
            } else {
                zoomMore();
            }
        }
    
        if (d3.event.sourceEvent.type === 'mousemove') {
            
            view.position.x += d3.event.sourceEvent.movementX;
            view.position.y += d3.event.sourceEvent.movementY;
    
            translate();
        }
    }));
    
    function zoomMore() {
        view.position.zoom += zoomInterval;
    
        if (view.position.zoom >= zoomMax) {
            view.position.zoom = zoomMax; }
    
        translate();
    }
    
    window.zoomMore = zoomMore;
    
    function zoomLess() {
        view.position.zoom -= zoomInterval;
    
        if (view.position.zoom <= zoomMin) {
            view.position.zoom = zoomMin; }
    
        translate();
    }
    
    window.zoomLess = zoomLess;
    
    function zoomReset() {
        view.position.zoom = 1;
        view.position.x = 0;
        view.position.y = 0;
    
        translate();
    }
    
    window.zoomReset = zoomReset;
    
    })();
    
    function translate() {
        if (view.position.x === undefined ||
            view.position.y === undefined ||
            view.position.zoom === undefined) { return; }
    
        document.querySelector('#graph_canvas')
            .setAttribute('style', `transform:translate(${view.position.x}px, ${view.position.y}px) scale(${view.position.zoom});`);
    }