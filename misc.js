// discord: hide list of friends
var spans = document.getElementsByTagName('span'); for (var a = 0; a < spans.length; a++) if (String(spans[a].getAttribute('class')).match(/^name(WithActivity)?-[^-]+$/)) spans[a].textContent = 'memes';
var divs = document.getElementsByTagName('div'); for (var a = 0; a < divs.length; a++) if (String(divs[a].getAttribute('class')).match(/^icon.* guildIcon/)) divs[a].style.background = '#fff';

// get google search results in plaintext
var m = '\n--\n', gs = document.querySelectorAll('div.g'); for (var a = 0, aa = gs.length; a < aa; a++) { var link = gs[a].querySelector('a[onmousedown]'), h3 = gs[a].querySelector('h3'), txt = gs[a].querySelectorAll('div>span'); txt = txt[txt.length - 1].parentNode; m += 'L ' + (link ? link.href : '') + '\nH ' + (h3 ? h3.innerHTML : '') + '\nT ' + (txt ? txt.innerHTML : '') + '\n--\n'; }; console.log(m);

// get all magnets from all blockquotes
var ret = []; for (var bq of document.querySelectorAll('blockquote')) for (var ln of (bq.innerText + '').split(/[\n ]/g)) if (ln.indexOf('magnet:?xt=') === 0) ret.push(ln); console.log(ret.join('\n'));
// convert to torrent files:  grep -E ^magnet: magnets.txt | while IFS= read -r x; do aria2c --bt-metadata-only=true --bt-save-metadata=true "$x"; done
// load folder "t" into rtorrent:  mkdir s; rtorrent -s s -O 'schedule2=watch_directory,1,99,load.start=t/*.torrent'
