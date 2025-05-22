FROM golang:1.24.3-alpine

RUN apk add --no-cache git make

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod tidy

RUN go install github.com/pressly/goose/v3/cmd/goose@latest
ENV PATH="/go/bin:${PATH}"

COPY . .

RUN go build -o main ./cmd/main.go

CMD ["sh", "-c", "make up && ./main"]
