import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Component } from "react";

import { Audio } from "expo-av";

const demoAudio = require("./assets/demo.mp3");

export default class App extends Component {
  state = {
    sounds: []
  };

  load = async () => {
    await Audio.setIsEnabledAsync(true);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentLockedModeIOS: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const soundObj = await Audio.Sound.createAsync(
      demoAudio,
      { shouldPlay: false },
      (ps) => {
        // TODO
      }
    );
    this.setState({ soundObj });
  };

  play = async () => {
    await this.state.soundObj.sound.playAsync();
  };

  pause = async () => {
    await this.state.soundObj.sound.pauseAsync();
  };

  unload = async () => {
    await this.state.soundObj.sound.unloadAsync();
    this.setState({ soundObj: null });
  };
  
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.load}>
            <Text style={styles.buttonText}>Load</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.play}>
            <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.pause}>
            <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.unload}>
            <Text style={styles.buttonText}>Unload</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  buttonText: {
    padding: 10,
    textAlign: "center",
    fontSize: 20,
  },
});
