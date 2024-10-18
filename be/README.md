## Deployment

To deploy this project, please run with docker compose

```bash
docker compose -f docker-compose.yaml up
```

#### Optional deployment without docker compose
- Run the server, the server will at `:15000`
```bash
make run-api
```

- Build image
```bash
make docker
```

Migrate database
-
```bash
make migrate
```
