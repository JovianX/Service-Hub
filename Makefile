.ONESHELL:
.PHONY: help setup setup_helm setup_kubectl setup_fe db_synchronization db_revision up down serve_be serve_fe logs db_shell run format tests

include .env
export

VE_DIRECTORY = .venv
PYTHON = python3.10
DB_NAME = service_hub
DB_USER = postgres_user

help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

setup: ## Setup this project's python dependencies.
	@test -d $(VE_DIRECTORY) || virtualenv $(VE_DIRECTORY) --python=$(PYTHON)
	@. $(VE_DIRECTORY)/bin/activate; pip install --upgrade pip
	@. $(VE_DIRECTORY)/bin/activate; pip install --upgrade --requirement=application/requirements.dev.txt
	@mkdir -p $(VE_DIRECTORY)/tmp/storage

setup_helm: ## Install Helm CLI.
	@test -d $(VE_DIRECTORY) || (echo 'Setup virtual environment first. You can do this by running `make setup`.' && exit 1)

	@mkdir -p $(VE_DIRECTORY)/tmp/helm
	@wget --output-document=$(VE_DIRECTORY)/tmp/helm.tar.gz https://get.helm.sh/helm-${HELM_VERSION}-linux-amd64.tar.gz
	@tar --extract --gzip --directory=$(VE_DIRECTORY)/tmp/helm --file=$(VE_DIRECTORY)/tmp/helm.tar.gz
	@mv $(VE_DIRECTORY)/tmp/helm/linux-amd64/helm $(VE_DIRECTORY)/bin/helm

	@rm $(VE_DIRECTORY)/tmp/helm.tar.gz
	@rm -rf $(VE_DIRECTORY)/tmp/helm

	# Installing release plugin(https://github.com/JovianX/helm-release-plugin).
	@helm plugin uninstall release > /dev/null
	@helm plugin install https://github.com/JovianX/helm-release-plugin
	# Checking that it is working.
	@helm release

setup_kubectl: ## Install Kubernetes CLI.
	@test -d $(VE_DIRECTORY) || (echo 'Setup virtual environment first. You can do this by running `make setup`.' && exit 1)

	@wget --output-document=$(VE_DIRECTORY)/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl
	@chmod +x $(VE_DIRECTORY)/bin/kubectl

setup_fe: ## Setup front-end develop environment.
	cd frontend; npm install

db_synchronization: ## Apply all unapplied migrations.
	@if [ -z `docker ps --quiet --no-trunc | grep --only-matching "$(shell docker-compose ps --quiet application)"` ]; then
		. $(VE_DIRECTORY)/bin/activate; cd application; alembic upgrade head
	else
		docker-compose exec application alembic upgrade head
	fi

db_revision: ## Does revision of database and models and creates migration if needed. Usage example: `make create_migration message="Added ModelName model"`
	@if [ -z "${message}" ]; then echo '`message` attribute is required' && exit 1; fi
	@if [ -z `docker ps --quiet --no-trunc | grep --only-matching "$(shell docker-compose ps --quiet application)"` ]; then
		. $(VE_DIRECTORY)/bin/activate; cd application; alembic revision --autogenerate --message="${message}"
	else
		docker-compose exec application alembic revision --autogenerate --message="${message}"
		# Because of Docker usage, migration will be created with root
		# ownership. Doing sneaky tricky black voodoo magic to change migration
		# files ownership to current user
		cd application; docker-compose exec application chown $(shell id -u):$(shell id -g) migrations/versions/*
	fi

build: ## Build all Docker images.
	docker-compose -f docker-compose-dev.yaml build --no-cache --force-rm

up: ## Launch dockerized infrastructure.
	docker-compose  -f docker-compose-dev.yaml up  --detach

down: ## Shutdown dockerized infrastructure.
	docker-compose down

serve_be: ## Run only infrastructure containers required by back-end.
	docker-compose -f docker-compose-dev.yaml up --no-deps --detach postgres
	docker-compose -f docker-compose-dev.yaml up --no-deps --detach frontend

serve_fe: ## Run only infrastructure containers required by front-end.
	docker-compose -f docker-compose-dev.yaml up --no-deps --detach postgres
	docker-compose -f docker-compose-dev.yaml up --no-deps --detach application
	cd frontend; npm start

logs: ## Show contaiters logs.
	@docker-compose logs --follow || true

db_shell: ## PostgreSQL shell
	@docker-compose exec postgres apt-get update > /dev/null
	@docker-compose exec postgres apt-get install less > /dev/null
	@docker-compose exec --env PAGER="less -S" postgres psql --user=$(DB_USER) --dbname=$(DB_NAME)

run: ## Launch local appserver.
	@. $(VE_DIRECTORY)/bin/activate; uvicorn --reload --reload-exclude=docker-data/* application.instance:instance

format: ## Format source code.
	@. $(VE_DIRECTORY)/bin/activate; autopep8 --in-place --recursive application
	@. $(VE_DIRECTORY)/bin/activate; isort --force-single-line-imports application

tests: ## Run all test.
	@. $(VE_DIRECTORY)/bin/activate; pytest -v ./application/tests
