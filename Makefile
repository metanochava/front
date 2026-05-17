
gitsaas:
	npm install git+https://github.com/metanochava/quasar_resaas.git
npmsaas:
	npm i quasar_resaas;
pull:
	git pull origin main --force;
push:
	npm version patch --no-git-tag-version; \
	git add .; \
	VERSION=$$(node -p "require('./package.json').version"); \
	read -p "Mensagem do release: " m; \
	git commit -m "release: v$$VERSION - $$m"; \
	git push origin main --force; 
gitback:
	git reset --soft HEAD~1
gitrmc:
	read -p "Digite o caminho do ficheiro ou pasta " m; \
	git rm --cached $$m
	
deploy:
	npm install git+https://github.com/metanochava/quasar_resaas.git; \
	git pull origin main --force; \
	quasar build;