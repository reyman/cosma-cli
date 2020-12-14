let openedRecord = undefined;

function openRecord(id) {
    if (openedRecord !== undefined) {
        openedRecord.style.display = 'none'; }

    document.querySelector('#record-container').classList.add('active')

    const elt = document.getElementById(id)
    elt.style.display = 'unset';

    historique.actualiser(id);

    openedRecord = elt
}

function closeRecord() {
    openedRecord.style.display = 'none';
    openedRecord = undefined;
    document.querySelector('#record-container').classList.remove('active')
}

(function () {
    document.querySelector('#index-stick').addEventListener('click', () => {
        document.querySelector('#record-list').classList.toggle('active')
        document.querySelector('#index-stick').classList.toggle('active')
    })
})();