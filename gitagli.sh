#!/bin/bash

# comenti merret si parameter
git add -A .
git commit -a -m "$1"
git push
git checkout master
git pull
git fetch
git merge agli
git push
git checkout agli
git status
