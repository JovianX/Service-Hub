FROM python:3.10-slim

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /run/service_hub/build

RUN apt-get update \
    && apt-get install --yes binutils \
    && apt-get clean \
    && pip install --upgrade pip \
    && pip install --no-cache-dir --upgrade pyinstaller

CMD pip install --upgrade pip \
    && pip install --no-cache-dir --upgrade -r requirements.txt \
    && pyinstaller --clean service-hub.spec
