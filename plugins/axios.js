import { booksApi } from "~/services/rest-api/book";
import { usersApi } from "~/services/rest-api/user";

export default async function ({ app, error: nuxtError, redirect }) {
  const bookApiUrl = 'https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=FGGGPhWonS3VfGLliRNlUQgjxwhGuyvH';
  const userApiUrl='http://45.147.47.18:8080/api/v1/person'

  app.arsipa = {
    books: booksApi(app.$axios, bookApiUrl),
    users: usersApi(app.$axios, userApiUrl)
  };


  app.$axios.onRequest(config => {
    if (config.headers.common['Content-Type']) {
      config.headers.common['Content-Type'] = 'application/json multipart/form-data';
    }

  });

  app.$axios.onResponse(response => {
    return response.data;
  });

  app.$axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    console.log('error', error);

    if (code === 404) {
      redirect('/error');
    }

    return Promise.resolve(false);
  });


}
