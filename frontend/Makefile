.PHONY: help install start build test lint format clean update-deps

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies (npm ci)
	npm ci

start: ## Start the dev server
	npm start

build: ## Create a production build
	npm run build

test: ## Run tests (non-interactive)
	npm test -- --watchAll=false --passWithNoTests

lint: ## Run eslint
	npm run lint

format: ## Format files with prettier
	npm run format

clean: ## Remove build artifacts and node_modules
	rm -rf build node_modules

update-deps: ## Update dependencies in a podman node:22 container
	podman run --rm -it -v "$$(pwd)":/app:Z -w /app docker.io/library/node:22-bookworm sh -c "npx --yes npm-check-updates -u --reject eslint,react,react-dom,react-scripts && npm install"
