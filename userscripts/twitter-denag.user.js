// ==UserScript==
// @name         twitter-denag
// @version      2022.2.16.0
// @description  denag twitter
// @namespace    https://ocv.me/
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var funs = [

        // login splash
        function () {
            try {
                var v = document.querySelector('div[role="group"]>div[data-testid="sheetDialog"]').parentNode; v.parentNode.removeChild(v);
                document.documentElement.style.cssText = 'overflow:scroll';
            } catch { }
        },

        // login banner
        function () {
            document.querySelector('a[data-testid="login"]').parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        },

        // yes.png
        function () {
            for (var o of document.querySelectorAll('div[role="button"]'))
                try { if (o.parentNode.previousSibling.querySelector('div[dir="auto"]').textContent.indexOf('The following media includes') + 1) o.click(); } catch { }
        }
    ];

    var ivals = [];

    function apply() {
        console.log('denag:' + document.visibilityState);
        if (document.visibilityState == 'visible' && !ivals.length)
            for (var fun of funs)
                ivals.push(setInterval(fun, 1000));
        else
            while (ivals.length)
                clearInterval(ivals.pop())
    }

    document.addEventListener('visibilitychange', apply);
    apply();

})();
