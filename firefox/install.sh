#!/bin/bash
set -e

absreal() { realpath "$1" || readlink -f "$1"; }

binst() {
    printf '\n\033[36minstall: bindir %s\033[0m\n' "$1"
    tar -ch chrome defaults distribution custom.cfg | tar -xvC "$1/"
    chown -R "$(stat -c%U "$1")." "$1"
}

# locate system-provided
binp="$(find /usr -name firefox-bin)"
[ -z "$binp" ] || binst "$(dirname "$binp")"

# locate portable
binp=$(command -v firefox) && {
    binp="$(absreal "$binp")"
    printf '%s\n' "$binp" | grep -qE ^/usr/ || 
        binst "$(dirname "$binp")"
}

# discover existing profiles and emplace userChrome
awk -F: '{print$6}' /etc/passwd |
while IFS=" " read -r h; do
    find $h/.mozilla/firefox/ -maxdepth 1 -iname '*.default*' 2>/dev/null |
    while IFS= read -r p; do
        printf '\n\033[36minstall: profile %s\033[0m\n' "$p"
        cp -pvR chrome "$p/"
        chown -R "$(stat -c%U "$p")." "$p/chrome"
    done
done
