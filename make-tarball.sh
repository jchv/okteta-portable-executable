#!/bin/sh
rm -fr .tmp/portable-executable
mkdir -p .tmp/portable-executable
cp main.js metadata.desktop LICENSE .tmp/portable-executable
(cd .tmp && tar -c -v -f ../portable-executable.tar.gz --owner=0 --group=0 --no-same-owner --no-same-permissions portable-executable)
