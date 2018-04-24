import * as API from 'app-api'
import * as types from '../constants/qualityListTypes'

// 获取数据
export function fetchData(qcState, page, dataMapIn) {
  return dispatch => {
    if(page == 0) {
      dispatch(_loading(qcState,page));
    }
    if(page < 0) {
      page = 0;
    }
        API.getQualityInspectionAll(storage.loadProject(), qcState, page, 35).then(
          (responseData) => {
                  let data = responseData.data.content;
                  let hasMore = responseData.data.last == false;
                  let dataBlob = [];
                  let dataMap = new Map();
                  let i = 0, j = 0;
                  let sectionLob = [];
                  if (page > 0) {
                    dataMap = dataMapIn;
                  }
                  data.forEach(item => {
                      item.showTime = "" + API.formatUnixtimestamp(item.updateTime);
                      item.index = i;
                      item.qcStateShow = "" + API.toQcStateShow(item.qcState);
                      if (item.files && item.files.size > 0) {
                          item.url = item.files[0].url;
                          // console.log(item.url);
                      }
                      let groupTime = item.showTime.substring(0, 10);
                      let dataBlob = dataMap.get(groupTime);
                      if (dataBlob == undefined) {
                          dataBlob = [];
                          dataMap.set(groupTime, dataBlob);
                      }
                      dataBlob.push({
                          key: "" + item.id,
                          value: item,
                      });
                      i++;
                  });

                  dataMap.forEach(function (value, key, map) {
                      sectionLob.push({
                          key: key,
                          data: value,
                      });
                  });
                  dispatch(_loadSuccess(sectionLob,dataMap,qcState,page,hasMore));
                  data = null;
                  dataBlob = null;
                  sectionLob = null;
                  dataMap = null;
          }
      ).catch(error => {
      dispatch(_loadError(error,qcState,page));
    });
  }
}
export function reset(qcState) {
  return dispatch => {
    dispatch(_reset(qcState))
  }
}

function _loading(qcState,page) {
  return {
    type: types.QUALITY_LIST_DOING,
    qcState:qcState,
    page:page
  }
}

function _loadSuccess(data,dataMap,qcState,page,hasMore) {
  return {
    type: types.QUALITY_LIST_DONE,
    data:data,
    dataMap:dataMap,
    qcState:qcState,
    page:page,
    hasMore:hasMore
  }
}

function _reset(qcState) {
  return {
    type: types.QUALITY_LIST_INIT,
    qcState:qcState,
  }
}
function _loadError(error,qcState,page) {
  return {
    type: types.QUALITY_LIST_ERROR,
    error:error,
    qcState:qcState,
    page:page
  }
}
