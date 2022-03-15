// ==UserScript==
// @name         finn-seen
// @description  hide ads you've already seen
// @version      2022.3.14.0
// @namespace    https://ocv.me/
// @match        https://www.finn.no/*
// @icon         https://www.google.com/s2/favicons?domain=finn.no
// @grant        none
// ==/UserScript==

function persist(fid) {
    var reg = localStorage.getItem('fseen');
    reg = reg ? reg.split(' ') : [];

    if (!fid)
        return reg;

    if (reg)
        for (var a = 0; a < reg.length; a++)
            if (reg[a] == fid)
                return reg;

    reg.push(fid);
    localStorage.setItem('fseen', reg.join(' '));
    return reg;
}


function on_search() {
    var reg = persist();
    var hits = document.querySelectorAll('#page-results>.ads h2>a.sf-ad-link');
    for (var a = 0; a < hits.length; a++) {
        var fid = hits[a].getAttribute('id');
        for (var b = 0; b < reg.length; b++)
            if (reg[b] == fid)
                hits[a].closest('article').style.opacity = '.2';
    }
}


function on_ad(fid) {
    persist(fid);
    console.log('finn-seen: persist(' + fid + ')');
}


(function () {
    window.onerror = function (msg, url, lineNo, columnNo, error) {
        window.onerror = undefined;
        console.log(msg + ' @L' + lineNo + ', ' + error);
    };

    var m, url = window.location.href + '';
    console.log('finn-seen: (' + url + ')');

    m = /.*finnkode=([0-9]+)$/.exec(url);
    if (m)
        return on_ad(m[1]);

    if (url.indexOf('/search.html') !== -1) {
        setInterval(on_search, 2000);
        return on_search();
    }

    console.log('finn-seen: unknown(' + url + ')');
})();

