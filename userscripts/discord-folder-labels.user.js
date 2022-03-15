// ==UserScript==
// @name         discord-folder-labels
// @version      2019.7.28.0
// @description  add labels to discord server folders
// @namespace    https://ocv.me/
// @match        https://discordapp.com/*
// @icon         https://www.google.com/s2/favicons?domain=discordapp.com
// @grant        none
// ==/UserScript==


// ====================================================================
// modify srvtab below with your own servers and labels;
// include at least one server for each folder
//
// to get a list of all server IDs, first open all server folders and then paste this into the browser console:
// var msg = ''; var srvs = document.querySelectorAll('foreignObject>a[aria-label][href^="/channels/"]'); for (var a = 0; a < srvs.length; a++) { var srv=srvs[a]; var sid = srv.getAttribute('href').split('/')[2]; msg += sid + ' ' + srv.getAttribute('aria-label') + '\n'; } alert(msg);
//
// discord DOM assumptions (maintenance notes):
// -- <foreignObject> contains a single server or a folder; we insert our label overlay immediately inside this
// -- somewhere below foreignObject.parentNode, the following items exist:
//    -- a <div role="button"> which toggles the open/close state
//    -- a <div class="expandedFolderIconWrapper-..."> if the folder is open
//    -- a <div class="closedFolderIconWrapper-..."> with servers as immediate children: <div class="icon-..." style="background:url('/icons/SERVERID/...')>
// ====================================================================


(function () {
    var dbg = false;
    var fgcolor = '#fc0';
    var bgcolor = '#333';
    var srvtab = {
        "244354085254463489": "raves",  // Lucky Lotus
        "383576604124905472": "raves",  // DoKomi
        "163175631562080256": "doujin", // Touhou Project
        "189454393135988736": "chip",   // \m| Chiptunes = WIN |m/
        "508839261924229141": "tech",   // iSH
        "238666723824238602": "tech",   // Programming Discussions
        "386089398975856641": "misc"    // Anime Music Quiz
    };

    function upd() {
        if (document.hidden)
            return;

        /*
        function ev_hide() {
          var that = this;
          that.style.display = 'none';
          setTimeout(function () {
            that.style.display = 'block';
          }, 500);
        };
        */

        function setborder(obj, invert) {
            var is_open = !!obj.parentNode.querySelector(
                'div[class^="expandedFolderIconWrapper-"]');

            if (invert)
                is_open = !is_open;

            obj = obj.firstChild;
            obj.style.fontWeight = (is_open ? 'normal' : 'bold');
            obj.style.color = (is_open ? '#000' : '#fff');
            obj.style.background = (is_open ? fgcolor : bgcolor);
            obj.style.borderBottom = '.4em solid ' + (is_open ? fgcolor : bgcolor);
        };

        function ev_click() {
            setborder(this, true);
            this.parentNode.querySelector('div[role="button"]').click();
        };

        var dirs = document.querySelectorAll('foreignObject');
        for (var nd = 0; nd < dirs.length; nd++) {
            var d = dirs[nd];
            if (d.getAttribute('fgsfds') === '1' && !dbg)
                continue;  // label exists

            var srvs = d.querySelectorAll(
                'div[class^="closedFolderIconWrapper-"]>div[class^="icon-"]');

            if (!srvs || srvs.length == 0)
                continue;  // open folder

            var oldtxt = d.querySelectorAll('div[fgsfds="1"]');
            if (oldtxt && oldtxt.length > 0)
                for (var t = oldtxt.length - 1; t >= 0; t--)
                    oldtxt[t].parentNode.removeChild(oldtxt[t]);

            var name = '';
            for (var ns = 0; ns < srvs.length; ns++) {
                var srv = srvs[ns];
                var sid = srv.getAttribute('style').split('/icons/');
                if (sid.length != 2)
                    continue;

                sid = sid[1].split('/')[0];
                if (sid in srvtab) {
                    name = srvtab[sid];
                    break;
                }
            }

            if (!name)
                continue;

            var txt = document.createElement('div');
            txt.setAttribute('fgsfds', '1');
            txt.setAttribute('class', 'fgsfds');
            txt.setAttribute('style', 'width:0;height:0;position:relative');
            txt.innerHTML = '<div style="padding:.7em 0;width:3em;height:1em;text-align:center;border-top:.3em solid #fb0">' + name + '</div>';
            //txt.onmouseenter = ev_hide;
            txt.onclick = ev_click;
            d.insertBefore(txt, d.firstChild);
            d.setAttribute('fgsfds', '1');
            setborder(txt);
        }
    }
    upd();
    if (!dbg)
        setInterval(upd, 5000);
})();
