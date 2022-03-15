// ==UserScript==
// @name         discord-direct-images
// @version      2020.5.30.0
// @description  open fullsize image when clicked
// @namespace    https://ocv.me/
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        none
// ==/UserScript==


// ====================================================================
// images get a magenta border on the right when it's safe to click
// ====================================================================


(function () {
    var flag = '4px solid #333',
        chat = null,
        nchat = 0;

    function do_it() {
        if (!chat || --nchat < 0) {
            chat = document.querySelector('main[class^="chatContent-"]');
            nchat = 2;
        }
        if (chat) {
            var imgs = chat.querySelectorAll('a[class*="imageWrapper-"]');
            for (var a = 0, aa = imgs.length; a < aa; a++) {
                if (imgs[a].style.borderRight)
                    continue;

                imgs[a].onclick = onclick;
                imgs[a].style.borderRadius = '0';
                imgs[a].style.boxShadow = '3px 0 0 #f09';
                imgs[a].style.borderRight = flag;
            }
        }
        setTimeout(do_it, 1000);
    }
    function onclick(ev) {
        // overrides the click listener
        ev.stopImmediatePropagation();
        return true;
    }
    do_it();
})();
