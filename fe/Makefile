APP_NAME=estrada-frontend

docker:
	@echo ">> Building Docker Image"
	@docker build -t ${APP_NAME}:latest .

run-server:
	@npm start

dep:
	@npm install

compile:
	@npm run build