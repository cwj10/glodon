import React from 'react'
import { Provider } from 'react-redux'
import { View, Image, ActivityIndicator, Platform, StyleSheet } from 'react-native'
import { StackNavigator, NavigationActions } from 'app-3rd/react-navigation';

import * as API from 'app-api'
import { LeftBarButtons } from "app-components"
import * as GLD from '../pages'
import BaseStorage from '../../common/store/store+base'
import configureStore, { history } from '../store/ConfigureStore'

const store = configureStore()
const screens = {
    GuidePage: {
        screen: GLD.GuidePage,
    },
    LoginPage: {
        screen: GLD.LoginPage
    },
    ChoosePage: {
        screen: GLD.TenantPage,
    },
    MainPage: {
        screen: GLD.HomePage
    },
    ProjectPage: {
        screen: GLD.ProjectPage
    },
    TenantPage: {
        screen: GLD.TenantPage
    },
    QualityMainPage: {
        screen: GLD.QualityMainPage
    },
    QualityMainPage: {
        screen: GLD.QualityMainPage
    },
    WebPage: {
        screen: GLD.WebPage
    },
    BimFileChooserPage: {
        screen: GLD.BimFileChooserPage
    },
    NewPage: {
        screen: GLD.NewPage
    },
    SettingPage: {
        screen: GLD.SettingPage
    },
    CheckPointPage: {
        screen: GLD.CheckPointPage
    },
    RelevantBlueprintPage: {
        screen: GLD.RelevantBlueprintPage
    },
    RelevantModlePage: {
        screen: GLD.RelevantModlePage
    },
    CheckPointListPage: {
        screen: GLD.CheckPointListPage
    },
    QualityDetailPage: {
        screen: GLD.QualityDetailPage
    },
    BigImageViewPage: {
        screen: GLD.BigImageViewPage
    },
    QualityStatardsPage: {
        screen: GLD.QualityStatardsPage
    },
    NewCheckListPage: {
        screen: GLD.NewCheckListPage
    },
    NewReviewPage: {
        screen: GLD.NewReviewPage
    },
    EquipmentMainPage: {
        screen: GLD.EquipmentMainPage
    },
    EquipmentDetailPage: {
        screen: GLD.EquipmentDetailPage
    },
    EquipmentNewPage: {
        screen: GLD.EquipmentDetailPage
    },
    SearchPage: {
        screen: GLD.SearchPage
    },
    QualitySearchPage: {
        screen: GLD.QualitySearchPage
    },
    EquipmentSearchPage: {
        screen: GLD.EquipmentSearchPage
    },
    BimSearchPage: {
        screen: GLD.BimSearchPage
    },
    AboutPage: {
        screen: GLD.AboutPage
    },
    ForgotPage: {
        screen: GLD.ForgotPage
    },
    FeedbackPage: {
        screen: GLD.FeedbackPage
    },
};

const options = () => {
    return {
        headerStyle: {
            backgroundColor: '#00baf3',
            borderBottomColor: '#00baf3',
            shadowColor: '#00baf3',
            shadowOpacity: 0.1,
            shadowRadius: 0,
            shadowOffset: {
                height: 0,
            },
            elevation: 0,
        },

        headerTintColor: '#fff',
        tabBarVisible: false,
        headerTitleStyle: {
            // fontWeight: 'bold',
            // fontSize:19,
            // width:'auto',
            // backgroundColor: '#FF0000',
            // textAlign: Platform.OS === 'ios' ? 'center' : 'center',
        },
        headerLeft: () => {
            return (
                <LeftBarButtons top={false} currentItem={""} />
            )
        },
        headerRight:()=>{
            return <View></View>
        }
    }
}
// LoginPage,MainPage,BaseStorage,ChoosePage,TenantPage,ProjectPage,GuidePage,QualityMainPage
const RootGuideStack = StackNavigator(
    screens,
    {
        initialRouteName: 'GuidePage',
        navigationOptions: options,
    }
);
const RootLoginStack = StackNavigator(
    screens,
    {
        initialRouteName: 'LoginPage',
        navigationOptions: options,
    }
);
const RootMainStack = StackNavigator(
    screens,
    {
        initialRouteName: 'MainPage',
        navigationOptions: options,
    }
);
const RootChooseStack = StackNavigator(
    screens,
    {
        initialRouteName: 'ChoosePage',
        navigationOptions: options,
    }
);

function resetGetStateForAction(RootStack) {
    const defaultGetStateForAction = RootStack.router.getStateForAction;
    // console.log("defaultGetStateForAction:"+defaultGetStateForAction+"\n");

    RootStack.router.getStateForAction = (action, state) => {
        // console.log("action info -- type:"+action.type+",key:"+action.key+",params:"+action.params+",path:"+action.path+",routeName:"+action.routeName+",n:"+action.n+"\n");
        const { n } = action;
        if (action.type === NavigationActions.POP && typeof n === 'string') {
            let backRouteIndex = state.index;
            let findN = n;
            // 支持按照routeName进行回退，如果存在重名了，那么就回到
            const backRoute = state.routes.find(route => route.routeName === findN);
            findN = Math.max(0, backRouteIndex - state.routes.indexOf(backRoute));
            if (findN > 0) {
                action.n = findN;
            } else {
                action.n = null;
            }
        }
        return defaultGetStateForAction(action, state);
    };
}
resetGetStateForAction(RootMainStack);
resetGetStateForAction(RootLoginStack);
resetGetStateForAction(RootGuideStack);
resetGetStateForAction(RootChooseStack);

export default class extends React.Component {

    constructor() {
        super();
        this.state = {
            hasLoad: false,
        }
    }
    componentDidMount() {
        if (storage.hasChoose()) {
            let tenant = storage.loadLastTenant();
            API.setCurrentTenant(tenant).then((responseData) => {
            }).catch((e) => {
                console.log(e);
            });
        }
    }
    renderPage() {
        if (storage.isLogin()) {
            if (storage.hasChoose()) {
                return (<Provider store={store}><RootMainStack /></Provider>)
            }
            return (<Provider store={store}><RootChooseStack /></Provider>)
        }
        if (storage.isGuide()) {
            return (<Provider store={store}><RootLoginStack /></Provider>)
        }
        return (<Provider store={store}><RootGuideStack /></Provider>)
    }
    render() {
        return this.renderPage();
    }
}

let platformContainerStyles;
if (Platform.OS === 'ios') {
    platformContainerStyles = {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#A7A7AA',
    };
} else {
    platformContainerStyles = {
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
            height: StyleSheet.hairlineWidth,
        },
        elevation: 4,
    };
}
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 56;
const styles = StyleSheet.create({
    container: {
        backgroundColor: Platform.OS === 'ios' ? '#F7F7F7' : '#FFF',
        ...platformContainerStyles,
    },
    transparentContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        ...platformContainerStyles,
    },
    header: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
    },
    item: {
        backgroundColor: 'transparent',
    },
    iconMaskContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    iconMaskFillerRect: {
        flex: 1,
        backgroundColor: '#d8d8d8',
        marginLeft: -3,
    },
    iconMask: {
        // These are mostly the same as the icon in ModularHeaderBackButton
        height: 21,
        width: 12,
        marginLeft: 9,
        marginTop: -0.5, // resizes down to 20.5
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    title: {
        bottom: 0,
        top: 0,
        left: TITLE_OFFSET,
        right: TITLE_OFFSET,
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-start',
    },
    left: {
        left: 0,
        bottom: 0,
        top: 0,
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
    },
    right: {
        right: 0,
        bottom: 0,
        top: 0,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
