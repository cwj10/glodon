/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component, PureComponent } from "react";
import {
    ActivityIndicator, Animated, SectionList, FlatList,
    ScrollView, StyleSheet, Text, View, StatusBar, Image,
    RefreshControl, Button, Dimensions, TouchableHighlight, TouchableOpacity
} from "react-native";
import * as API from "app-api";
import QualityListCell from "./qualityListCell";
import QualityListView from "./qualityListView";
import { SegmentedBar, SegmentedView, Drawer, Label } from 'app-3rd/teaset';

var { width, height } = Dimensions.get("window");
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

//   drawer.close(); //如需要可代码手动关上抽屉
export default class qualityList extends PureComponent {
    static navigationOptions = {
        title: '质检清单',
        tabBarVisible: false,
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        gesturesEnabled: false,
    };


    constructor(props) {
        super(props);

        this.state = {
            //网络请求状态
            error: false,
            errorInfo: "",
            qcState: '',
            isLoading: true,
            activeIndex: 0,
            qualityView: [{}, {}, {}, {}, {}, {}, {}, {}],
            qualityBadge:{
                item:[0,0,0,0,0,0,0,0,0,0]
            },
            qualityBadge0:0
        }
    }
    _keyExtractor = (item, index) => index;
    _loadInspectionSummary = () =>{
        API.getQualityInspectionSummary(storage.loadProject()).then(
            (responseData) => {
                // console.log('getQualityInspectionSummary' + JSON.stringify(responseData.data))
                let items = responseData.data;
                let qualityBadgeItem = this.state.qualityBadge.item;
                items.map((item, index) => {
                    let find = API.CLASSIFY_STATES_SUMMARY.indexOf(item.qcState);
                    if (find > 0) {
                        qualityBadgeItem[find] = item.count;
                    }
                });
                console.log(JSON.stringify(qualityBadgeItem));
                 this.setState({
                        qualityBadge:{item:qualityBadgeItem},
                    })
                // 获取数量数据
            }
        );
    }
    componentDidMount = () => {
        //请求数据
        // this._onRefresh();
        storage.qualityNavigation = this.props.navigation;
        this._loadInspectionSummary();
        // this.refs.sectionList.fetchData(API.CLASSIFY_STATES[0]);
        // this._onSegmentedBarChange(0);
    }

    _onSegmentedBarChange = (index) => {
        this.setState({ activeIndex: index });
        this.state.qualityView[index].fetchData(API.CLASSIFY_STATES[index]);
        this._loadInspectionSummary();
    }
    _toTop = () => {
        let index = this.state.activeIndex;
        let qualityView = this.state.qualityView[index];
        if(qualityView.scrollToOffset) {
            qualityView.scrollToOffset();
        }
    }
    renderData() {

        return (
            <View style={[styles.contentList]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <SegmentedView style={{ flex: 1 }} justifyItem={'scrollable'} type={'carousel'} onChange={(index) => this._onSegmentedBarChange(index)} activeIndex={this.state.activeIndex}>
                    {
                       API.CLASSIFY_STATUS_LIST.map((item,index)=>{
                           return (
                               <SegmentedView.Sheet key={item.name} title={item.name} badge={this.state.qualityBadge.item[index]}>
                                <QualityListView 
                                onRef={ (ref) => {this.state.qualityView[index] = ref}} 
                                style={{flex:1}} 
                                qcState={''+item.state} 
                                loadData={index ==0 ? true: false} /> 
                            </SegmentedView.Sheet>
                           );
                       })
                   }
                </SegmentedView>
                {/* <TouchableOpacity style={styles.topBtn} onPress={()=>this._toTop()}>
            <Text style={styles.topBtnText}>置顶</Text>
      </TouchableOpacity> */}
            </View>
        );
    }

    render() {
        console.log('render:' + JSON.stringify(this.state.qualityBadge))
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    contentList: {
        flex: 1,
        backgroundColor: '#fafafa',
        //  height:120,
    },
    dataList: {
        // flex: 1,
        top: 0,
        height: height,
        backgroundColor: 'green',
    },
    gray: {
        top: 100,
        left: width / 2 - 30,
        position: 'absolute',
    },
    topBtn: {
        width: 50,
        height: 25,
        backgroundColor: '#0007',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        top: height - 100,
        left: width - 60,
        position: 'absolute',
    },
    topBtnText: {
        fontSize: 12,
        color: '#fff'
    },
    headerButton: {
        color: '#333333',
        fontSize: 14,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        // height:180
    },
    containerView: {
        flex: 1,
        borderRadius: 8,
        // borderWidth:1,
        // borderColor:"#0F0",
        // height:119,
        marginTop: 5,

        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        elevation: 100, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 3, height: 7 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
});