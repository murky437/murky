FROM golang:latest AS base

WORKDIR /app


FROM base AS dev

RUN apt-get update && apt-get install sqlite3

RUN go install github.com/air-verse/air@latest \
  && go install -tags 'sqlite' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

CMD ["air"]


FROM base AS prod_builder

# Run download separately to leverage docker cache
COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["sh", "-c", "go build -o ./build/api ./cmd/api && go build -o ./build/migrate ./cmd/migrate"]

