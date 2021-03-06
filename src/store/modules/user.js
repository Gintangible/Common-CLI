import userApi from '@/api/user';

const state = {
  // 用户信息
  user: '',

  // 用户token
  token: '',
};
const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  }
};
const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      userApi.login({ username: username.trim(), password }).then(() => {
        const data = {
          token: 'test_token',
          user: {
            name: 'gintanbile',
          }
        };
        commit('SET_TOKEN', data.token);
        commit('SET_USER', data.user);
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
