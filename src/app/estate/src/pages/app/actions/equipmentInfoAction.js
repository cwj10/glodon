import * as API from 'app-api'
import * as types from '../constants/equipmentInfoTypes'
import { Toast } from 'antd-mobile';

/**
 * 提交材设单 新增时的response {"id": 5200418,"code": "CSYS_20180504_002"}，编辑时response未测试。
 * @param {*} params 
 */
export function submit(params, navigator) {
    params.projectId = storage.loadProject();
    params.projectName = storage.loadCurrentProjectName();
    let fieldId = params.id;//根据单据id区分编辑和新增
    loadingToast();
    return dispatch => {
        uploadFile(params.files, (files) => {
            if (files) {
                params.files = files;
            }
            if (fieldId && fieldId != 0) {
                API.equipmentEditSubmit(storage.loadProject(), fieldId, JSON.stringify(params))
                    .then((responseData) => {
                        Toast.hide();
                        storage.goBack(navigator, null);
                    }).catch(error => {
                        Toast.hide();
                        console.log(error);
                    })
            } else {
                API.equipmentCreateSubmit(storage.loadProject(), JSON.stringify(params))
                    .then((responseData) => {
                        Toast.hide();
                        storage.goBack(navigator, null);
                    }).catch(error => {
                        Toast.hide();
                        console.log(error);
                    })
            }
        });
        
    }
}

/**
 * 保存材设单 新增时的response {"id": 5200418,"code": "CSYS_20180504_002"}，编辑时response未测试。
 * @param {*} params 
 */
export function save(params) {
    params.projectId = storage.loadProject();
    params.projectName = storage.loadCurrentProjectName();
    let fieldId = params.id;//根据单据id区分编辑和新增
    loadingToast();
    return dispatch => {
        uploadFile(params.files, (files) => {
            if (files) {
                params.files = files;
            }
            if (fieldId && fieldId != 0) {
                API.equipmentEditSave(storage.loadProject(), fieldId, JSON.stringify(params))
                    .then((responseData) => {
                        dispatch(_loadSuccess({ ...params }));
                        Toast.hide();
                    }).catch(error => {
                        Toast.hide();
                        console.log(error);
                    })
            } else {
                API.equipmentCreateSave(storage.loadProject(), JSON.stringify(params))
                    .then((responseData) => {
                        params.id = responseData.data.id;
                        params.code = responseData.data.code;
                        dispatch(_loadSuccess({ ...params }));
                        Toast.hide();
                    }).catch(error => {
                        console.log(error);
                        Toast.hide();
                    })
            }
           
        });
    }
}

/**
 * 删除，response no content
 * @param {*} fieldId 单据id 
 */
export function equipmentDelete(fieldId, navigator) {
    return dispatch => {
        API.equipmentDelete(storage.loadProject(), fieldId)
            .then((responseData) => {
                Toast.hide();
                storage.goBack(navigator, null);
            }).catch(error => {
                console.log(error);
                Toast.hide();
            })
    }
}

// 获取数据
export function fetchData(fieldId) {
    return dispatch => {

        equipmentAcceptanceCompanies(dispatch);

        if (!fieldId) {
            dispatch(_loadSuccess({}));
            return;
        }
        // dispatch(_loading());
        API.equipmentDetail(storage.loadProject(), fieldId).then((responseData) => {
            dispatch(_loadSuccess(responseData.data));
        }).catch(error => {
            dispatch(_loadError(error));
        });

    }
}

/**
 * 上传图片
 * @param {*} imageChooserEle 图片组件
 * @param {*} uploadCallback 
 */
function uploadFile(files, uploadCallback) {
    if (files && files.length > 0) {
        API.upLoadFiles(files, (code, result) => {
            if (code === "success") {
                uploadCallback(result);
            } else {
                Toast.hide();
                Toast.info("上传图片失败", 1);
            }
        });
    } else {
        uploadCallback();
    }
}
/**
 * 获取选择模型构件的信息
 */
export function getModelElementProperty(relevantEquipmentModle, equipmentInfo) {
    return dispatch => {
        API.getModelElementProperty(storage.loadProject(), storage.projectIdVersionId, relevantEquipmentModle.gdocFileId, relevantEquipmentModle.elementId)
        .then(responseData => {
            if(!equipmentInfo){
                equipmentInfo = {};
            }
            equipmentInfo.gdocFileId = relevantEquipmentModle.gdocFileId;
            equipmentInfo.buildingId = relevantEquipmentModle.buildingId;
            equipmentInfo.buildingName = relevantEquipmentModle.buildingName;
            equipmentInfo.elementId = relevantEquipmentModle.elementId;
            equipmentInfo.elementName = responseData.data.data.name;
            equipmentInfo.approachDate = new Date().getTime();
            dispatch(_loadSuccess({ ...equipmentInfo }));
        });
    }
}

function loadingToast() {
    Toast.loading('加载中...', 0, null, true);
}

function equipmentAcceptanceCompanies(dispatch) {
    API.equipmentAcceptanceCompanies(storage.loadProject())
        .then(responseData => {
            dispatch(_loadingAcceptanceCompaniesSuccess(responseData.data));
        }).catch(error => { })
}


export function switchPage(data) {
    return dispatch => {
        dispatch(_loadSuccess(data));
    }
}

export function reset() {
    return dispatch => {
        dispatch(_reset())
    }
}

function _loading() {
    return {
        type: types.EQUIPMENT_INFO_DOING,
    }
}

function _loadingAcceptanceCompaniesSuccess(data) {
    return {
        type: types.EQUIPMENT_ACCEPTANCE_COMPANIES,
        acceptanceCompanies: data,
    }
}

function _loadSuccess(data) {
    return {
        type: types.EQUIPMENT_INFO_DONE,
        data: data,
    }
}

function _reset() {
    return {
        type: types.EQUIPMENT_INFO_INIT,
    }
}
function _loadError(error) {
    return {
        type: types.EQUIPMENT_INFO_ERROR,
        error: error,
    }
}
