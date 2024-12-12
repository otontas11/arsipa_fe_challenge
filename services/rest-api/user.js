export const usersApi = (axios, baseURL) => ({
  getUserList() {
    return axios.get(baseURL);
  },
  addNewUser(user) {
    return axios.post(baseURL,user);
  },
  deleteUser(userId) {
    return axios.delete(`${baseURL}/${userId}`)
  },

  updateUser({userId, userData}) {
    console.log("updateUser",userData)
    return axios.put(`${baseURL}/${userId}`,userData)
  },

});
