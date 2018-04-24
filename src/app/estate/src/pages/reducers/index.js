import { combineReducers } from 'redux'
import loginIn from '../login/reducers/loginReducer'
import checkPointList from '../app/reducers/checkPointListReducer' 
import qualityInfo from '../app/reducers/qualityInfoReducer' 
import qualityList from '../app/reducers/qualityListReducer' 
import transformInfo from '../app/reducers/transformInfoReducer' 
import updateData from '../app/reducers/updateDataReducer' 
import reviewRepair from '../app/reducers/reviewRepairReducer' 

const rootReducer = combineReducers({
  loginIn,
  checkPointList,
  qualityInfo,
  qualityList,
  transformInfo,
  updateData,
  transformInfo,
  reviewRepair,
})

export default rootReducer
