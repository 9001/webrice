// grabs a list of people you know on discord
//  + avatars + linked accounts + common servers
// and also topmost list of people in each server you visit
// so you can still get in touch w/ people when you get bonked
//
// not a full userscript "yet",
// intended for pasting into the browser console
// for quick debugging/adaptation + maybe making discord less suspicious
//
// tested on firefox 98.0.1
//
// usage:
// paste all this into the console then do each of the following steps,
//
//  1. navigate to your friends-list to get a list of people + hashes
//
//  2. optionally click each friend to open their userinfo
//     which lets this script also grab their connected accounts
//
//  3. click on people in your DMs to open their userinfos,
//     cannot grab the userhash otherwise
//
//  4. drop by the servers you care about and open userinfos there too
//
// once youre done rightclick one of the console messages and
// select "export visible messages to" -> "file"
//
// then cleanup / assemble all the textfiles;
//   cat console-export-2022-* | awk '/^-{42}\[\]$/{o=0};o&&$0;/^\[telefonbok\]-{32}$/{o=1}' > telefonbok.txt
//
// and download all the avatars:
//   awk '/^\[(FRIEND|USER)\].* http.*avatars.*size=/{sub(/.*#[0-9]{4} /,"");sub(/[0-9]+$/,"1024");print}' telefonbok.txt | sort | uniq | wget -i-
//


try { clearTimeout(iv); } catch { }
var st = {"friends":{}, "uacc":{}, "usrv":{}, "srv":{}},
	QS = document.querySelector.bind(document),
	QSA = document.querySelectorAll.bind(document);

var fun = function() {
	var log = function(m) {
		console.log(`[telefonbok]--------------------------------\n${m}\n------------------------------------------[]\n`);
	};

	// userinfo modal
	var modal = QS('div[aria-label="User Profile Modal"]');
	if (modal) {
		var uhash = modal.querySelector('span[class^="discriminator-"]');
		if (!uhash) {
			log('ERROR: in modal but could not find username+hash');
			return;
		}
		uhash = uhash.parentNode.textContent;

		// on the userinfo tab?
		if (QS('div[aria-selected="true"][aria-controls="user_info-tab"]')) {
			var accs = [];
			for (var a of modal.querySelectorAll('div[class^="connectedAccount-"] a[role="button"]'))
				accs.push('  [acct] ' + a.getAttribute('href'));
			accs = accs.join('\n');
			
			// assume offsite-accounts is the last to load, use as seen-flag
			if (st.uacc[uhash] == accs || st.view == "ui-" + uhash)
				return;
			
			var about = QS('div[class^="userBio-"]');
			if (about)
				about = about.innerHTML.replace(/\n+/g,"\n").replace(/\n/g,"\n    ");
			
			var note = QS('div[class^="note-"]');
			if (note)
				note = note.textContent.replace(/\n+/g,"\n").replace(/\n/g,"\n    ");
			
			var avi = modal.querySelector('img[class^="avatar-"]');
			avi = avi ? avi.getAttribute('src') : '$';
			
			st.uacc[uhash] = accs;
			st.view = "ui-" + uhash;
			var msg = `[USER] ${uhash} ${avi}\n${accs}`;

			if (about)
				msg += "\n  [about]\n    " + about;

			if (note)
				msg += "\n  [note]\n    " + note;

			log(msg);
		}
		
		// on the mutual servers tab?
		if (QS('div[aria-selected="true"][aria-controls="mutual_guilds-tab"]')) {
			var srvs = [];
			for (var a of modal.querySelectorAll('div[class^="listName-"]'))
				srvs.push(`  [srv] ${a.textContent}`);
			srvs = srvs.join('\n');
			
			if (st.usrv[uhash] == srvs || st.view == "us-" + uhash)
				return;
			
			st.usrv[uhash] = srvs;
			st.view = "us-" + uhash;
			log(srvs);
		}
		
		return;
	}
	
	// friendslist open
	if (QS('div[class*="interactiveSelected-"] a[data-list-item-id$="__friends"]')) {
		var msg = [];
		for (var a of QSA('div[class^="discordTag-"]>span[class^="discriminator-"]')) {
			var avi = a.closest('div[class^="userInfo-"]');
			if (avi)
				avi = avi.querySelector('img[class^="avatar-"]');
			
			avi = avi ? avi.getAttribute('src') : '$';
			a = a.parentNode.textContent;
			if (st.friends[a] == avi)
				continue;
			
			st.friends[a] = avi;
			msg.push(`[FRIEND] ${a} ${avi}`);
		}
		if (msg.length)
			log(msg.join('\n'));
		return;
	}
	
	// DMs open (does this serve a purpose?)
	if (QS('h2[class^="privateChannelsHeaderContainer"]')) {
		if (st.view != 'DMs') {
			st.view = 'DMs';
			console.log('[DMs]');
		}
		return;
	}

	// must be on a server then
	var srv_name = QS('div[class^="sidebar-"] header h1[class^="name-"]'),
		srv_id = QS('li[data-dnd-name] a[href][role="link"]');
	
	if (srv_name && srv_id) {
		srv_name = srv_name.textContent;
		srv_id = srv_id.getAttribute('href').split('/')[2];
		var msg = [`[SERVER] ${srv_id} = ${srv_name}`];
		for (var a of QSA('div[class^="members-"] div[class^="nameAndDecorators-"]')) {
			var avi = a.closest('div[class^="member-"]');
			if (avi)
				avi = avi.querySelector('img[class^="avatar-"]');
			
			avi = avi ? avi.src : '$';
			msg.push(`  [user] ${a.textContent} ${avi}`);
		};
		if ((st.srv[srv_id] || 0) >= msg.length)
			return;
		
		st.srv[srv_id] = msg.length;
		log(msg.join('\n'));
	}
};
iv = setInterval(fun, 50);
fun();
