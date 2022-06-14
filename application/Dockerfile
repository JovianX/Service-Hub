FROM python:3.10
ARG HELM_VERSION

# Install project dependencies.
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Install Helm.
ENV HELM_TARBALL helm-$HELM_VERSION-linux-amd64.tar.gz
ADD https://get.helm.sh/${HELM_TARBALL} /tmp
RUN tar -zxvf /tmp/${HELM_TARBALL} -C /tmp \
    && mv /tmp/linux-amd64/helm /bin/helm \
    && rm -rf /tmp/*

COPY . /code

CMD ["uvicorn", "application.instance:instance", "--host", "0.0.0.0", "--port", "8000"]