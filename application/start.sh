#!/bin/bash
if [[ $* == *--sync-db* ]]
then
    i=0
    while [ $i -le 5 ]; do

    alembic upgrade head && break

    let i=i+1
    sleep 2
    done
fi
uvicorn instance:instance --host 0.0.0.0 --port 8000
