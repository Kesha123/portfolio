IMAGE := docker.io/library/node:22-bookworm
APP_DIR := $(CURDIR)/frontend

DOCKER	?= podman

.PHONY: install start build test lint format clean update-deps

install:
	$(DOCKER) run --rm -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) npm ci

start:
	$(DOCKER) run --rm -it -v "$(APP_DIR)":/app:Z -w /app -p 3000:3000 $(IMAGE) npm start

build:
	$(DOCKER) run --rm -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) npm run build

test:
	$(DOCKER) run --rm -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) npm test -- --watchAll=false --passWithNoTests

lint:
	$(DOCKER) run --rm -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) npm run lint

format:
	$(DOCKER) run --rm -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) npm run format

clean:
	rm -rf $(APP_DIR)/build $(APP_DIR)/node_modules

update-deps:
	$(DOCKER) run --rm -it -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) sh -c "npx --yes npm-check-updates -u --reject eslint,react,react-dom,react-scripts && npm install"
