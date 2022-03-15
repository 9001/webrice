// ==UserScript==
// @name         youtube-unrecommend
// @version      2020.10.4.0
// @description  hide video recommendations from a list of channels without having to log in
// @namespace    https://ocv.me/
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// ==/UserScript==

// tested with https://addons.mozilla.org/en-US/firefox/addon/firemonkey/

setInterval(function () {
    var bad = ['/c/Revsaysdesu', '/c/NuxTaku', '/c/Thoughty2'],
        vids = document.querySelectorAll('yt-formatted-string.ytd-channel-name>a.yt-simple-endpoint'),
        a;

    for (a = 0; a < vids.length; a++)
        if (bad.includes(vids[a].getAttribute('href')))
            vids[a].closest('ytd-rich-grid-media').style.opacity = '0.08';
}, 1000);
