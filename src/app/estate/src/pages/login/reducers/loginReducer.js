import * as types from '../constants/loginTypes' // 导入事件类别,用来做事件类别的判断

// 初始状态

const initialState = {
  status: '点击登录',
  hasChoose: false,
  isSuccess: false,
  user: null,
  retryTimes:3
}
// 不同类别的事件使用switch对应处理过程

export default function loginIn(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_IN_DOING:
      return {
        ...state,
        status: '正在登录',
        hasChoose: false,
        isSuccess: false,
        user: null,
      }
      break
    case types.LOGIN_IN_DONE:
      return {
        ...state,

        status: '登录成功',

        isSuccess: true,

        user: action.user,
        retryTimes:3,
      }
      case types.LOGIN_IN_DONE_CHOOSE:
      return {
        ...state,

        status: '登录成功',

        isSuccess: true,

        user: action.user,
        retryTimes:3,
      }
    // break
    case types.LOGIN_IN_ERROR:
      return {
        ...state,

        status: '登录出错',

        isSuccess: true,

        user: null,
      }

    // break
    case types.LOGIN_IN_INIT:
      return {
        ...state,

        status: '点击重新登录',

        isSuccess: false,

        user: null,
        retryTimes:3,
      }
      case types.LOGIN_IN_RETRY:
      return {
        ...state,

        status: '登录出错',

        isSuccess: false,

        user: null,
        retryTimes:state.retryTimes-1,
      }

    // break
    default:
      return state
  }
}
