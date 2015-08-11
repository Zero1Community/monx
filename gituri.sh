#!/bin/bash

# comenti merret si parameter
git add -A .
git commit -a -m '$1'
git push
git checkout master
git pull
git fetch
git merge turi
git push
git checkout turi
git status
