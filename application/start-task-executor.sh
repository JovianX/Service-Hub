#!/bin/bash
i=0
while [ $i -le 5 ]; do

procrastinate --app=services.procrastinate.application.procrastinate worker --wait && break

let i=i+1
sleep 2
done
