up:
	sudo docker compose up

down:
	sudo docker compose down -v

logs:
	sudo docker compose logs -f

ps:
	sudo docker compose ps

migrations:
	sudo docker compose run --rm app npx sequelize-cli db:migrate
