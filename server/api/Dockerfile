FROM ubuntu:24.04

WORKDIR /app

RUN apt-get update && apt-get install -y tzdata && rm -rf /var/lib/apt/lists/*

COPY deployments/current /app

RUN chmod +x api

CMD ["./api"]
