import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TodoScreen from './src/TodoScreen'

const App = () => {
  return (
    <View style={{marginTop:30}}>
      <TodoScreen/>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})