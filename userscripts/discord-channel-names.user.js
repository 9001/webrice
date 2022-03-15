// ==UserScript==
// @name         discord-channel-names
// @version      2021.12.0.0
// @description  custom names for channels
// @namespace    https://ocv.me/
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        GM_addStyle
// ==/UserScript==

function grunnur() {
    'use strict';

    // var t=[]; for (var ch of document.querySelectorAll('a[data-list-item-id^="channels___"]')) { var ci=ch.href.split('/').slice(-2).join('/'), a=ch.querySelector('div[class^="channelName-"]'); t.push(`"${ci}": "${a.textContent}"`); } console.log(t.join(',\n'))
    var tab = {
        "6472317206/647231721": "/a/",
        "6472317206/647458752": "/c/",
        "6472317206/757973631": "/vt/",
        "6472317206/796786634": "/mu/",
    };

    var last_msg = null;
    function log(txt) {
        if (last_msg != txt)
            console.log(`[dcn] ${new Date().toISOString().split('T')[1]} ${txt}`);

        last_msg = txt;
    }

    var known = {};
    for (var [k, v] of Object.entries(tab))
        known[k.split('/')[0]] = 1;

    setInterval(function () {
        var renames = 0;
        for (var ch of document.querySelectorAll('a[data-list-item-id^="channels___"]')) {
            var ci = ch.href.split('/').slice(-2).join('/'),
                srv = ci.split('/')[0],
                a = ch.querySelector('div[class^="channelName-"]');

            if (!known[srv])
                return log(`unknown server ${srv}`);

            if (a.textContent == tab[ci])
                return log(`already renamed`);

            if (tab[ci]) {
                renames++;
                a.textContent = tab[ci];
                a.style.fontFamily = 'monospace, monospace';
            }
        }
        log(`renamed ${renames} channels`);
    }, 1000);

    log('inner');
}

(function () {
    var scr = document.createElement('script');
    scr.textContent = '(' + grunnur.toString() + ')();';
    (document.head || document.getElementsByTagName('head')[0]).appendChild(scr);
})();

console.log(`[dcn] ${new Date().toISOString().split('T')[1]} outer`);
