export const booksApi = (axios, baseURL) => ({
  getBooksList() {
    return axios.get(baseURL);
  },
});
