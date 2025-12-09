#!/bin/bash

find ../ -type f -name "package.json" -not -path "*node_modules*" | while read linha; do
    echo $linha | sed 's/.\/workspaces//;s/package.json//'
    echo $linha
    jq '.scripts' $linha | grep 'build"'
done