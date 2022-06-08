.PHONY: help setup up down db_shell run

export

VE_DIRECTORY = .venv
PYTHON = python3
DB_NAME = service_hub
DB_USER = postgres_user

help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

setup: ## Setup this project's python dependencies
	test -d $(VE_DIRECTORY) || virtualenv $(VE_DIRECTORY) --python=$(PYTHON)
	. $(VE_DIRECTORY)/bin/activate; pip install --upgrade pip
	. $(VE_DIRECTORY)/bin/activate; pip install --requirement requirements.dev.txt

up: ## Launch dockerized infrastructure
	docker-compose up --detach

down: ## Shut down dockerized infrastructure
	docker-compose down

db_shell: ## PostgreSQL shell
	docker-compose exec postgres psql --user=$(DB_USER) $(DB_NAME)

run: ## Launch local appserver.
	. $(VE_DIRECTORY)/bin/activate; uvicorn application.instance:instance
