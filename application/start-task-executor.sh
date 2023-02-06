#!/bin/bash
i=0
while [ $i -le 5 ]; do

procrastinate --app=services.procrastinate.application.procrastinate worker --concurrency=6 --delete-jobs=successful && break

let i=i+1
sleep 2
done
