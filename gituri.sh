#!/bin/bash

# comenti merret si parameter
if [ "$#" -ne 1 ]
then
  echo "Fut me vllai nej argument (me thonjza) "
  exit 1
fi

git checkout turi
git add -A .
git commit -a -m "$1"
git push
git checkout master
git pull
git fetch
git merge turi
git push
git checkout turi
git status
