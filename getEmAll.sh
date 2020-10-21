#!/bin/bash

while IFS= read -r line; do
     node index.js $line
done < movies.txt