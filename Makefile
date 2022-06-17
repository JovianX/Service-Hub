.PHONY: help setup setup_helm migrate up down logs db_shell run format tests

export

VE_DIRECTORY = .venv
PYTHON = python3.10
DB_NAME = service_hub
DB_USER = postgres_user

help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

setup: ## Setup this project's python dependencies.
	@test -d $(VE_DIRECTORY) || virtualenv $(VE_DIRECTORY) --python=$(PYTHON)
	@. $(VE_DIRECTORY)/bin/activate; pip install --upgrade pip
	@. $(VE_DIRECTORY)/bin/activate; pip install --upgrade --requirement requirements.dev.txt
	@mkdir -p $(VE_DIRECTORY)/tmp/storage

setup_helm: ## Install Helm CLI.
	@test -d $(VE_DIRECTORY) || (echo 'Setup virtual environment first. You can do this by running `make setup`.' && exit 1)

	@mkdir -p $(VE_DIRECTORY)/tmp/helm
	@wget --output-document=$(VE_DIRECTORY)/tmp/helm.tar.gz https://get.helm.sh/helm-v3.9.0-linux-amd64.tar.gz
	@tar --extract --gzip --directory=$(VE_DIRECTORY)/tmp/helm --file=$(VE_DIRECTORY)/tmp/helm.tar.gz
	@mv $(VE_DIRECTORY)/tmp/helm/linux-amd64/helm $(VE_DIRECTORY)/bin/helm

	@rm $(VE_DIRECTORY)/tmp/helm.tar.gz
	@rm -rf $(VE_DIRECTORY)/tmp/helm

migrate: ## Apply all unapplied migrations.
	. $(VE_DIRECTORY)/bin/activate; alembic upgrade head

up: ## Launch dockerized infrastructure.
	docker-compose up --detach

down: ## Shut down dockerized infrastructure.
	docker-compose down

logs: ## Show contaiters logs.
	@docker-compose logs --follow || true

db_shell: ## PostgreSQL shell
	docker-compose exec postgres psql --user=$(DB_USER) --dbname=$(DB_NAME)

run: ## Launch local appserver.
	. $(VE_DIRECTORY)/bin/activate; uvicorn --reload --reload-exclude=docker-data/* application.instance:instance

format: ## Format source code.
	@. $(VE_DIRECTORY)/bin/activate; autopep8 --in-place --recursive .
	@. $(VE_DIRECTORY)/bin/activate; docformatter \
		--wrap-summaries=80 \
		--wrap-descriptions=80 \
		--pre-summary-newline \
		--make-summary-multi-line \
		--in-place --recursive .
	@. $(VE_DIRECTORY)/bin/activate; isort --force-single-line-imports .

tests: ## Run all test.
	@. $(VE_DIRECTORY)/bin/activate; pytest ./application/tests
