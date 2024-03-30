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
if [[ $* == *--reload* ]]
then
    OPTIONAL_ARGS="--reload"
fi
echo "Starting server"
echo "OPTIONAL_ARGS: $OPTIONAL_ARGS"

uvicorn $OPTIONAL_ARGS instance:instance --host 0.0.0.0 --port 8000
