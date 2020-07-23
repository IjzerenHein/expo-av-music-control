import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Component } from "react";

import { Audio } from "expo-av";
import MusicControl from "react-native-music-control";

const demoAudio = require("./assets/demo.mp3");

export default class App extends Component {
  state = {
    isAudioReady: false,
    isAudioPlaying: false,
    initialisedWith: null,
  };
  soundObj = null;

  setupAudioExpo = async () => {
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
    this.soundObj = await Audio.Sound.createAsync(
      demoAudio,
      { shouldPlay: false },
      (ps) => {
        MusicControl.updatePlayback({
          state: this.state.isAudioPlaying
            ? MusicControl.STATE_PLAYING
            : MusicControl.STATE_PAUSED, // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
          speed: 1, // Playback Rate
          elapsedTime: (ps.positionMillis || 0) * 0.001, // (Seconds)
        });
      }
    );
    console.log("YO: ", this.soundObj.status.durationMillis * 0.001);
    this.setupLockScreenControls(this.soundObj.status.durationMillis * 0.001);
    this.setState({ isAudioReady: true, initialisedWith: "expo-av" });
  };

  setupLockScreenControls = (duration) => {
    MusicControl.enableBackgroundMode(true);
    MusicControl.handleAudioInterruptions(true);

    // Basic Controls
    MusicControl.enableControl("play", true);
    MusicControl.enableControl("pause", true);
    MusicControl.enableControl("stop", false);
    MusicControl.enableControl("nextTrack", false);
    MusicControl.enableControl("previousTrack", false);

    // Changing track position on lockscreen
    MusicControl.enableControl("changePlaybackPosition", true);

    // Seeking
    MusicControl.enableControl("seekForward", false);
    MusicControl.enableControl("seekBackward", false);
    MusicControl.enableControl("skipForward", false);
    MusicControl.enableControl("skipBackward", false);

    // iOS Specific Options
    MusicControl.enableControl("enableLanguageOption", false);
    MusicControl.enableControl("disableLanguageOption", false);

    MusicControl.on("play", this.play);
    MusicControl.on("pause", this.pause);

    MusicControl.setNowPlaying({
      title: "Billie Jean",
      artwork: "https://i.imgur.com/e1cpwdo.png", // URL or RN's image require()
      artist: "Michael Jackson",
      album: "Thriller",
      genre: "Post-disco, Rhythm and Blues, Funk, Dance-pop",
      duration, // (Seconds)
      description: "", // Android Only
      color: 0xffffff, // Notification Color - Android Only
      date: "1983-01-02T00:00:00Z", // Release Date (RFC 3339) - Android Only
      rating: 84, // Android Only (Boolean or Number depending on the type)
      notificationIcon: "my_custom_icon", // Android Only (String), Android Drawable resource name for a custom notification icon
    });
  };

  togglePlayPause = () => {
    const { isAudioPlaying } = this.state;
    if (isAudioPlaying) {
      this.pause();
    } else {
      this.play();
    }
  };

  play = async () => {
    const { initialisedWith } = this.state;
    if (initialisedWith === "expo-av") {
      await this.soundObj.sound.playAsync();
    } else {
      this.soundObj.play();
      this.soundObj.getCurrentTime((seconds) => {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PLAYING,
          elapsedTime: seconds,
        });
      });
    }
    this.setState({ isAudioPlaying: true });
  };

  pause = async () => {
    const { initialisedWith } = this.state;
    if (initialisedWith === "expo-av") {
      await this.soundObj.sound.pauseAsync();
    } else {
      this.soundObj.pause();
      this.soundObj.getCurrentTime((seconds) => {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PAUSED,
          elapsedTime: seconds,
        });
      });
    }
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PAUSED,
    });
    this.setState({ isAudioPlaying: false });
  };

  render() {
    const { isAudioReady, isAudioPlaying } = this.state;
    return (
      <View style={styles.container}>
        {isAudioReady ? (
          <TouchableOpacity onPress={this.togglePlayPause}>
            <Text style={styles.buttonText}>
              {isAudioPlaying ? "PAUSE" : "PLAY"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity onPress={this.setupAudioExpo}>
              <Text style={styles.buttonText}>Initialise with expo-av</Text>
            </TouchableOpacity>
          </View>
        )}
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
