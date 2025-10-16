FROM golang:latest AS base

WORKDIR /app

# Run download separately to leverage docker cache
COPY go.mod go.sum ./
RUN go mod download


FROM base AS dev

RUN apt-get update && apt-get install sqlite3

RUN go install github.com/air-verse/air@latest

CMD ["air"]


FROM base AS prod_builder

COPY . .

CMD ["sh", "-c", "go build -o ./build/api ./cmd/api && go build -o ./build/migrate ./cmd/migrate && go build -o ./build/backupdb ./cmd/backupdb"]

