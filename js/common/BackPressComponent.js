import React from 'react'
import { BackHandler } from 'react-native'

export default class BackPressComponent {
    constructor(props) {
        this._hardwareBackPress = this.onHardwareBackPress.bind(this)
        this.props = props
    }
    componentDidMount() {
        this.props.backPress && BackHandler.addEventListener('hardwareBackPress',this._hardwareBackPress)
    }

    componentWillUnmount() {
        this.props.backPress && BackHandler.removeEventListener('hardwareBackPress',this._hardwareBackPress)
    }


    onHardwareBackPress(props) {
        return this.props.backPress(e)
    }
}