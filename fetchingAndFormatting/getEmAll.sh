#!/bin/bash

#this script must be run with the OMDB apikey as the first argument! Its in my email, somewhere...

# to only add a single movie, run `node scrapeRT.js <movie title>`
while IFS= read -r line; do
     node scrapeRT.js $line
done < movies.txt

#if consolidating critics after only adding one movie, run `node consolidateCritics.js <omdb apikey>`
node consolidateCritics.js 
node findTopMovies.js
