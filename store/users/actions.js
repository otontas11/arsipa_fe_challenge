export default {
  async getUsers({ commit }) {
    const users = await this.app.arsipa.users.getUserList()
    console.log("users",users)
    commit('setUserList',users)
  },
  async deleteSelectedUser({ commit }, {userId}) {
    console.log("userId",userId)
    const users = await this.app.arsipa.users.deleteUser(userId)
    console.log("users",users)
  },
  async addNewUser({ commit },{user}) {
    const users = await this.app.arsipa.users.addNewUser(user)
    console.log("users",users)
  },
  async updateSelectedUser({ commit }, {userId, userData}) {
    console.log("userId",userId)
    const users = await this.app.arsipa.users.updateUser({userId, userData})
    console.log("users",users)
  },
};
