#!/bin/bash
if [[ $* == *--sync-db* ]]
then
    alembic upgrade head
fi
uvicorn instance:instance --host 0.0.0.0 --port 8000
