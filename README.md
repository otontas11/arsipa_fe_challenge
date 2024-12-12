# arsipa-fe-challenge

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```


For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## About APIs Changes
Api file is in  = `/plugins/axios.js

Nyt book api = 'https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=FGGGPhWonS3VfGLliRNlUQgjxwhGuyvH' .

Docker user api='http://45.147.47.18:8080/api/v1/person' //this can be changed to http://localhost:8080/swagger-ui after running docker service

```bash
user_list_api='http://45.147.47.18:8080/api/v1/person'
book_list_api= 'https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=FGGGPhWonS3VfGLliRNlUQgjxwhGuyvH'
```