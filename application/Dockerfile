FROM python:3.10-slim
ARG HELM_VERSION=v3.9.0
ARG KUBECTL_VERSION=v1.24.1

WORKDIR /home/app/hub

# Install system dependencies.
RUN apt-get update \
    && apt-get install --yes jq \
    && apt-get install --yes git \
    && apt-get install --yes curl \
    && apt-get clean
COPY requirements.txt /code/requirements.txt
RUN pip install --upgrade pip && pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Install Helm CLI.
ENV HELM_TARBALL helm-${HELM_VERSION}-linux-amd64.tar.gz
ADD https://get.helm.sh/${HELM_TARBALL} /tmp
RUN tar -zxvf /tmp/${HELM_TARBALL} -C /tmp \
    && mv /tmp/linux-amd64/helm /bin/helm \
    && chmod 777 /bin/helm \
    && rm -rf /tmp/*

# Install Kubernetes CLI.
ADD https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl /usr/local/bin/kubectl
RUN chmod 777 /usr/local/bin/kubectl

RUN groupadd -r app && useradd -m -g app app \
    && chown app:app /home/app

USER app

RUN mkdir -p ~/.local/share/helm
RUN helm plugin install https://github.com/JovianX/helm-release-plugin
# Copy the code to the Dockerimage
COPY . .

CMD ["./start.sh", "--sync-db"]
