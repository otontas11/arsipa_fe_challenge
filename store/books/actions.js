export default {
  async getBooksList({ commit }) {
    const {results} =  await this.app.arsipa.books.getBooksList()
    commit('setBookList',results?.books)
  },
};
