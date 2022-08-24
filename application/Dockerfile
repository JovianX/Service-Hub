FROM python:3.10-slim
ARG HELM_VERSION
ARG KUBECTL_VERSION

# Install system dependencies.
RUN apt-get update \
    && apt-get install --yes jq \
    && apt-get install --yes git \
    && apt-get install --yes curl \
    && apt-get clean

# Install project dependencies.
WORKDIR /code
COPY requirements.txt /code/requirements.txt
RUN pip install --upgrade pip && pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Install Helm CLI.
ENV HELM_TARBALL helm-$HELM_VERSION-linux-amd64.tar.gz
ADD https://get.helm.sh/${HELM_TARBALL} /tmp
RUN tar -zxvf /tmp/${HELM_TARBALL} -C /tmp \
    && mv /tmp/linux-amd64/helm /bin/helm \
    && rm -rf /tmp/*

RUN helm plugin install https://github.com/JovianX/helm-release-plugin

# Install Kubernetes CLI.
ADD https://storage.googleapis.com/kubernetes-release/release/$KUBECTL_VERSION/bin/linux/amd64/kubectl /usr/local/bin/kubectl
RUN chmod +x /usr/local/bin/kubectl


# Copy the code to the Dockerimage
COPY . /code

CMD ["./start.sh", "--sync-db"]
