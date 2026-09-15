IMAGE := docker.io/library/node:22-bookworm
APP_DIR := $(CURDIR)/frontend

.PHONY: install start build test lint format clean update-deps

install:
	podman run --rm -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) npm ci

start:
	podman run --rm -it -v "$(APP_DIR)":/app:Z -w /app -p 3000:3000 $(IMAGE) npm start

build:
	podman run --rm -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) npm run build

test:
	podman run --rm -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) npm test -- --watchAll=false --passWithNoTests

lint:
	podman run --rm -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) npm run lint

format:
	podman run --rm -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) npm run format

clean:
	rm -rf $(APP_DIR)/build $(APP_DIR)/node_modules

update-deps:
	podman run --rm -it -v "$(APP_DIR)":/app:Z -w /app $(IMAGE) sh -c "npx --yes npm-check-updates -u --reject eslint,react,react-dom,react-scripts && npm install"
