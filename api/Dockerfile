FROM golang:latest

WORKDIR /app

RUN apt-get update && apt-get install sqlite3

RUN go install github.com/air-verse/air@latest \
  && go install -tags 'sqlite' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

CMD ["air"]