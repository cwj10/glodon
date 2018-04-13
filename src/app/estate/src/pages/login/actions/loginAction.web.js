import {authToken,setCurrentTenant,accountInfo,login as userLogin} from 'app-api'

import * as types from '../constants/loginTypes'

export function login(username, pwd) {
  return loginOld(username, pwd);
  // return loginNew(username, pwd);
}
// 访问登录接口 根据返回结果来划分action属于哪个type,然后返回对象,给reducer处理
function loginOld(username, pwd) {
  return dispatch => {
    // dispatch(isLogining())
    dispatch(loginSuccessChoose(true, {}))
    return;
    userLogin(username, pwd).then((response) => {
      accountInfo().then((userInfo) => {
        console.log(userInfo);
        if (userInfo.err) {
          dispatch(loginError(false));
          return;
        }
        let data = userInfo["data"];
        if (!data) {
          dispatch(loginError(false));
          return;
        }
        storage.userInfo = data;
        let ac = data["accountInfo"];
        if (!ac) {
          dispatch(loginError(false));
          return;
        }
        storage.hasChoose((ret) => {
          if (!ret) {
            dispatch(loginSuccessChoose(true, response.data))
            return
          }
          storage.loadTenant((tenant) => {
            setCurrentTenant(tenant).then((responseData) => {
              dispatch(loginSuccess(true, response.data))
            });
          });
        });
      }).catch((e) => {
        dispatch(loginError(false));
      });
    }).catch((e) => {
      dispatch(loginError(false));
    }); 
  }
}

// 访问登录接口 根据返回结果来划分action属于哪个type,然后返回对象,给reducer处理
function loginNew(username, pwd) {
  return dispatch => {
    dispatch(isLogining())

    authToken(username, pwd).then((response) => {
      storage.saveLoginToken(response.data.access_token);
      accountInfo().then((userInfo) => {
        console.log(userInfo);
        if (userInfo.err) {
          dispatch(loginError(false));
          return;
        }
        let data = userInfo["data"];
        if (!data) {
          dispatch(loginError(false));
          return;
        }
        storage.userInfo = data;
        let ac = data["accountInfo"];
        if (!ac) {
          dispatch(loginError(false));
          return;
        }
        storage.hasChoose((ret) => {
          if (!ret) {
            dispatch(loginSuccessChoose(true, response.data))
            return;
          }
          storage.loadTenant((tenant) => {
            setCurrentTenant(tenant).then((responseData) => {
              dispatch(loginSuccess(true, response.data))
            });
          });
        });
      }).catch((e) => {
        dispatch(loginError(false));
      });
    }).catch((e) => {
      dispatch(loginError(false));
    });
  }
}

export function logout() {
  console.log('退出登录方法')
  return dispatch => {
    // 模拟用户登录
    // let result = fetch('https://www.baidu.com/')
    //     .then((res)=>{
    dispatch(logoutSuccess())
    // }).catch((e)=>{
    //   dispatch(loginError(false));
    // })
  }
}

function logoutSuccess() {
  console.log('log success')
  return {
    type: types.LOGIN_IN_INIT,
  }
}

function isLogining() {
  return {
    type: types.LOGIN_IN_DOING,
  }
}

function loginSuccess(isSuccess, user) {
  console.log('success')
  return {
    type: types.LOGIN_IN_DONE,
    user,
  }
}

function loginSuccessChoose(isSuccess, user) {
  console.log('success')
  return {
    type: types.LOGIN_IN_DONE_CHOOSE,
    user,
  }
}

function loginError(isSuccess) {
  console.log('error')
  return {
    type: types.LOGIN_IN_ERROR,
  }
}
