.PHONY: install start build test lint format clean update-deps

install:
	npm ci

start:
	npm start

build:
	npm run build

test:
	npm test -- --watchAll=false --passWithNoTests

lint:
	npm run lint

format:
	npm run format

clean:
	rm -rf build node_modules

update-deps:
	podman run --rm -it -v "$$(pwd)":/app:Z -w /app docker.io/library/node:22-bookworm sh -c "npx --yes npm-check-updates -u --reject eslint,react,react-dom,react-scripts && npm install"
