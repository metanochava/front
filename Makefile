pull:
	npm install git+https://github.com/metanochava/quasar_resaas.git
npm:
	npm i quasar_resaas;
push:
	git add .; \
	VERSION=$$(python -c "import tomli; print(tomli.load(open('pyproject.toml','rb'))['project']['version'])"); \
	read -p "Mensagem do release: $$VERSION " m; \
	git commit -m "release: v$$VERSION - $$m"; \
	git push origin main;  
gitback:
	git reset --soft HEAD~1
gitrmc:
	read -p "Digite o caminho do ficheiro ou pasta " m; \
	git rm --cached $$m