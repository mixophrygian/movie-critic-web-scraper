#!/bin/bash

#this script must be run with the OMDB apikey as the first argument! Its in my email, somewhere...

while IFS= read -r line; do
     node scrapeRT.js $line
done < movies.txt

node consolidateCritics.js 
node findTopMovies.js
