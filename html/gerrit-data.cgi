#!/bin/bash

if ifconfig -a | grep "inet 13[05]" > /dev/null
then . ~tonyhansen/bin/set_proxies
fi
echo "Content-Type: appliation/javascript"
echo

exec 2> /tmp/g.err.$$
set -x

URL="https://gerrit.onap.org/r/projects/?d"
echo "URL='$URL'" 1>&2
# curl -v -H "accept:application/json" "$URL"
# curl -s -S -H "accept:application/json" "$URL"
curl -L -s -S "$URL" | tee /tmp/g.out.$$
