SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c


# =========================================================
# DEPENDENCIES
# =========================================================

gitsaas:
	npm install git+https://github.com/metanochava/quasar_resaas.git


npmsaas:
	npm install quasar_resaas


# =========================================================
# GIT
# =========================================================

pull:
	git pull origin main


push:
	VERSION="$$(node -p "require('./package.json').version")"

	read -p "Release message: " message

	npm version patch --no-git-tag-version

	VERSION="$$(node -p "require('./package.json').version")"

	git add .
	git commit -m "release: v$$VERSION - $$message"
	git push origin main

	echo "Release v$$VERSION pushed successfully."


gitback:
	echo "Reverting the last commit while keeping the changes..."
	git reset --soft HEAD~1
	echo "Last commit reverted successfully."


gitrmc:
	read -p "File or directory to remove from Git tracking: " path

	if [[ -z "$$path" ]]; then
		echo "A file or directory path is required."
		exit 1
	fi

	git rm --cached -r -- "$$path"

	echo "$$path removed from Git tracking."


# =========================================================
# DEPLOY
# =========================================================

deploy:
	echo "Installing latest quasar_resaas..."
	npm install git+https://github.com/metanochava/quasar_resaas.git

	echo "Updating repository..."
	git pull origin main

	echo "Building Quasar application..."
	quasar build

	echo "Deployment build completed successfully."


# =========================================================
# PROCESS / PORT MANAGEMENT
# =========================================================

kill:
	read -p "Port: " port

	if [[ -z "$$port" ]]; then
		echo "A port is required."
		exit 1
	fi

	if [[ ! "$$port" =~ ^[0-9]+$$ ]]; then
		echo "Invalid port: $$port"
		exit 1
	fi

	pid="$$(sudo lsof -t -i:$$port || true)"

	if [[ -n "$$pid" ]]; then
		echo "Stopping process $$pid on port $$port..."
		sudo kill "$$pid"
		echo "Process stopped successfully."
	else
		echo "No process found on port $$port."
	fi


# =========================================================
# DEVELOPMENT
# =========================================================

dev:
	quasar dev