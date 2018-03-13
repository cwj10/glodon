import {
    AsyncStorage,
} from 'react-native';

// 第三方框架
import Storage from 'react-native-storage';


export default class BaseStorage {
    constructor() {
        super.constructor();
        this.storage = new Storage({
            // 最大容量，默认值1000条数据循环存储
            size: 1000,

            // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
            // 如果不指定则数据只会保存在内存中，重启后即丢失
            storageBackend: AsyncStorage,

            // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
            defaultExpires: 1000 * 3600 * 24 * 365, // 有效期一年

            // 读写时在内存中缓存数据。默认启用。
            enableCache: true,

            // 如果storage中没有相应数据，或数据已过期，
            // 则会调用相应的sync方法，无缝返回最新数据。
            // sync方法的具体说明会在后文提到
            // 你可以在构造函数这里就写好sync的方法
            // 或是写到另一个文件里，这里require引入
            // 或是在任何时候，直接对storage.sync进行赋值修改
            // sync: require('./sync')
        });
    }
    setItem =(key,value)=> {
        // this.storage.save({
        //     key: key,  // 注意:请不要在key中使用_下划线符号!
        //     data: {'value':value},
            
        //     // 如果不指定过期时间，则会使用defaultExpires参数
        //     // 如果设为null，则永不过期
        //     expires: null
        //   });
    }
    getItem=(key)=> {
        // // 读取
        // this.storage.load({
        //     key: key,
        // }).then(ret => {
        //     // 如果找到数据，则在then方法中返回
        //     // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
        //     // 你只能在then这个方法内继续处理ret数据
        //     // 而不能在then以外处理
        //     // 也没有办法“变成”同步返回
        //     // 你也可以使用“看似”同步的async/await语法
        //     return ret.value;
        // }).catch(err => {
        //     //如果没有找到数据且没有sync方法，
        //     //或者有其他异常，则在catch中返回
        //     // console.warn(err.message);
        //     switch (err.name) {
        //         case 'NotFoundError':
        //             // TODO;
        //             break;
        //         case 'ExpiredError':
        //             // TODO
        //             break;
        //     }
        //     return null;
        // });
    }
    
    version() {
        console.log('BaseStorage version 1.0.0.0');
    }

    storage() {
        return this.storage;
    }
}

class GLDStorage extends BaseStorage {
    constructor() {
        super();
        this.userInfo = {};
        this.loginToken = '';
        this.guide = '0';
        this.currentTenant = "0";
        this.currentProject = "0";
        this.homeNavigation = null;
        // this.storage.load({
        //     key: 'loginToken',

        //     // autoSync(default true) means if data not found or expired,
        //     // then invoke the corresponding sync method
        //     autoSync: true,

        //     // syncInBackground(default true) means if data expired,
        //     // return the outdated data first while invoke the sync method.
        //     // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
        //     syncInBackground: true,

        //     // you can pass extra params to sync method
        //     // see sync example below for example
        //     syncParams: {
        //         extraFetchOptions: {
        //             // blahblah
        //         },
        //         someFlag: true,
        //     },
        // }).then(ret => {
        //     // found data go to then()
        //     console.log(ret);
        //     this.loginToken = ret;
        // }).catch(err => {
        //     // any exception including data not found 
        //     // goes to catch()
        //     console.warn(err.message);
        //     switch (err.name) {
        //         case 'NotFoundError':
        //             // TODO;
        //             break;
        //         case 'ExpiredError':
        //             // TODO
        //             break;
        //     }
        //     this.loginToken = '';
        // })
    }
    saveLoginToken=(token)=> {
        this.loginToken = token;
        this.setItem('loginToken', this.loginToken);
    }
    loginToken=()=> {
        return this.loginToken;
    }
    isLogin=()=> {
        return this.loginToken != '';
    }
    logout=()=> {
        this.loginToken = '';
        this.currentProject = "0";
        this.currentTenant = "0";
        this.guide = "1";
        this.storage.remove({key:'loginToken'});
        this.storage.remove({key:'currentProject'});
        this.storage.remove({key:'currentTenant'});
        this.storage.remove({key:'guide'});
    }
    saveGuide=()=> {
        this.guide = "1";
        this.setItem('guide', this.guide);
    }
    isGuide=()=> {
        this.guide = this.getItem('guide');
        return this.guide == "1";
    }
    saveTenant=(tenant)=> {
        this.currentTenant = ""+tenant;
        this.setItem('currentTenant', this.currentTenant);
    }
    loadTenant=()=> {
        // this.currentTenant = this.getItem('currentTenant');
        console.log(this.currentTenant);
        return this.currentTenant;
    }
    saveProject=(project)=> {
        console.log(project);
        this.currentProject = ""+project;
        this.setItem('currentProject', ""+project);
    }
    loadProject=()=> {
        // this.currentProject = this.getItem('currentProject');
        console.log(this.currentProject);
        return this.currentProject;
    }
    gotoLogin=()=> {
        this.homeNavigation.replace("Login");
    }
    hasChoose=()=> {
        return this.loadTenant() != "0" && this.loadProject() != "0";
    }
    gotoMain = (navigation) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
       // if (this.hasChoose()) {
            navigator.replace("HomePage");
       // } else {
       //     navigator.replace("ChoosePage");
       // }
    }
    
}
// 全局变量
global.storage = new GLDStorage();