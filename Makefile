COMPOSE = sudo docker compose -f docker/docker-compose.yml --env-file .env

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f api

restart:
	$(COMPOSE) restart

build:
	$(COMPOSE) build api

rebuild:
	$(COMPOSE) build --no-cache api

ps:
	$(COMPOSE) ps

seed:
	$(COMPOSE) exec api npx prisma db seed