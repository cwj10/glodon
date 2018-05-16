import {Toast} from 'antd-mobile'
import * as API from 'app-api'
import * as types from '../constants/ChangeProjectTypes'

// 获取数据
export function fetchData(page, dataArray) {
    return dispatch => {
        __fetchData(page, dataArray, dispatch)
    }
}

// 获取数据
function __fetchData(page, dataArray, dispatch) {

    if (page == 0) {
        dispatch(_loading(page));
    }
    if (page < 0) {
        page = 0;
    }
    API.getProjects(page, 35).then(
        (responseData) => {
            let data = responseData.data.content;
            let last = responseData.data.last;

            let dataBlob = [];
            if (data.length > 0) {
                if (page > 0) {
                    dataBlob = dataArray;
                }
                let i = 0;
                data.forEach(item => {
                    dataBlob.push({
                        key: "P0" + item.id,
                        value: item,
                    })
                    i++;
                });
                Toast.hide()
                let hasMore = last ? false : true;
                dispatch(_loadSuccess(dataBlob, page, hasMore));

            } else {
                Toast.hide()
                dispatch(_loadSuccess(dataBlob, page - 1, false));
            }

            data = null;
            dataBlob = null;
        }
    ).catch(err => {
        Toast.hide()
        dispatch(_loadError(error, page));
    });
    // {
    //     "content": [{
    //         "id": 5212498,
    //         "code": "201801031653",
    //         "name": "201801031653",
    //         "simpleName": null,
    //         "parentDeptId": 800,
    //         "parentDeptName": "广联达科技股份有限公司",
    //         "deptId": 5212498,
    //         "responder": null,
    //         "scale": null,
    //         "projectTypeCode": "Estate_Project_Type_House",
    //         "projectTypeName": "住宅",
    //         "countryCode": null,
    //         "regionCode": "Estate_Project_Region_NortheastChina",
    //         "regionName": "东北",
    //         "address": null,
    //         "plannedDuration": 0,
    //         "plannedStart": null,
    //         "plannedEnd": null,
    //         "actualDuration": 0,
    //         "actualStart": null,
    //         "actualEnd": null,
    //         "projectStatusCode": null,
    //         "projectStatusName": null,
    //         "description": null,
    //         "attachmentInfo": null,
    //         "concerned": false
    //     }],
    //     "totalElements": 385,
    //     "last": false,
    //     "totalPages": 15,
    //     "sort": null,
    //     "first": false,
    //     "numberOfElements": 26,
    //     "size": 26,
    //     "number": 1
    // }


}
export function reset() {
    return dispatch => {
        dispatch(_reset())
    }
}

function _loading(page) {
    return {
        type: types.CHANGE_PROJECT_LIST_DOING,
        page: page,
    }
}

function _loadSuccess(data, page, hasMore) {
    return {
        type: types.CHANGE_PROJECT_LIST_DONE,
        data: data,
        page: page,
        hasMore: hasMore,
    }
}

function _reset() {
    return {
        type: types.CHANGE_PROJECT_LIST_INIT,
    }
}
function _loadError(error, page) {
    return {
        type: types.CHANGE_PROJECT_LIST_ERROR,
        error: error,
        page: page,
    }
}
