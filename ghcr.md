
## Docker login to GHCR 
docker login --username MarkDM --password <gh_pat> ghcr.io

## Docker build image
docker build <Dockerfile path> -t ghcr.io/markdm/docker_example_web_app:latest

## Push image to GHCR

docker push ghcr.io/markdm/docker_example_web_app:latest

## Pull from GHCR

docker pull ghcr.io/markdm/docker_example_web_app:latest