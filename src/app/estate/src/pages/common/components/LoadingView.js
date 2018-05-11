import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
export default class LoadingView extends React.Component {
    render = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ActivityIndicator
                    animating={true}
                    style={[{ height: 80 }]}
                    color='#00baf3'
                    size="large"
                />
            </View>
        )
    }
}