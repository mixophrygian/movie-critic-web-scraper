#!/bin/bash

while IFS= read -r line; do
     node scrapeRT.js $line
done < movies.txt

node consolidateCritics.js 
node findTopMovies.js
