export default {

  async getBooksList({ commit }) {
    const {results} =  await this.app.arsipa.books.getBooksList()
    console.log("results",results)
    commit('setBookList',results?.books)
  },
};
