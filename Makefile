PORT=3000
NAME=node/exp-light
#versioning docker images based on current git branch
VERSION ?= $(shell git branch | sed -n -e 's/^\* \(.*\)/\1/p')

DOCKER_ENV = -e "PORT=3000" \
				-e "VARX=VALX"

build:
	docker build -t $(NAME):$(VERSION) .

run:
	docker run  -p $(PORT):$(PORT) $(DOCKER_ENV) $(NAME):$(VERSION)