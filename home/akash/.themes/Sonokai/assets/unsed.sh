#!/bin/sh
sed -i \
         -e 's/rgb(0%,0%,0%)/#2c2e34/g' \
         -e 's/rgb(100%,100%,100%)/#e2e2e3/g' \
    -e 's/rgb(50%,0%,0%)/#333333/g' \
     -e 's/rgb(0%,50%,0%)/#76cce0/g' \
 -e 's/rgb(0%,50.196078%,0%)/#76cce0/g' \
     -e 's/rgb(50%,0%,50%)/#444444/g' \
 -e 's/rgb(50.196078%,0%,50.196078%)/#444444/g' \
     -e 's/rgb(0%,0%,50%)/#e2e2e3/g' \
	"$@"
