#!/bin/bash
i=0
while [ $i -le 5 ]; do

python -m services.procrastinate.run && break

let i=i+1
sleep 2
done
