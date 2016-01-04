#!/bin/bash

# comenti merret si parameter
if [ "$#" -ne 1 ]
then
  echo "Fut me vllai nej argument (me thonjza) "
  exit 1
fi



git checkout agli
git add -A .
git commit -a -m "$1"
git push
git checkout master
git pull
git fetch
git merge agli
git push
git checkout agli
git pull -u origin master
git status
