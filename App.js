import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const INITIAL_TIME = 8 * 60 * 1000; // 8 minutes in milliseconds

const App = () => {
  const [leftTime, setLeftTime] = useState(INITIAL_TIME);
  const [rightTime, setRightTime] = useState(INITIAL_TIME);
  const [leftRunning, setLeftRunning] = useState(false);
  const [rightRunning, setRightRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const lastTimestamp = useRef(Date.now());

  useEffect(() => {
    let interval;

    if ((leftRunning || rightRunning) && !isPaused) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTimestamp.current;

        if (leftRunning && leftTime > 0) {
          setLeftTime((prevTime) => Math.max(prevTime - elapsed, 0));
        }
        if (rightRunning && rightTime > 0) {
          setRightTime((prevTime) => Math.max(prevTime - elapsed, 0));
        }

        lastTimestamp.current = now;
      }, 10);

      // Check for winner
      if (leftTime === 0) {
        endGame('Blue Wins! 🏆');
      } else if (rightTime === 0) {
        endGame('Orange Wins! 🏆');
      }
    }

    return () => clearInterval(interval);
  }, [leftRunning, rightRunning, isPaused, leftTime, rightTime]);

  const endGame = (message) => {
    setLeftRunning(false);
    setRightRunning(false);
    setIsPaused(true);
    Alert.alert('Game Over', message, [{ text: 'OK', onPress: handleReset }]);
  };

  const handleLeftPress = () => {
    if (isPaused) {
      setIsPaused(false);
    }
    if (leftRunning) {
      setLeftRunning(false);
      setRightRunning(true);
    } else {
      setLeftRunning(true);
      setRightRunning(false);
    }
    lastTimestamp.current = Date.now();
  };

  const handleRightPress = () => {
    if (isPaused) {
      setIsPaused(false);
    }
    if (rightRunning) {
      setRightRunning(false);
      setLeftRunning(true);
    } else {
      setRightRunning(true);
      setLeftRunning(false);
    }
    lastTimestamp.current = Date.now();
  };

  const handlePause = () => {
    setIsPaused(true);
    setLeftRunning(false);
    setRightRunning(false);
  };

  const handleReset = () => {
    setLeftTime(INITIAL_TIME);
    setRightTime(INITIAL_TIME);
    setLeftRunning(false);
    setRightRunning(false);
    setIsPaused(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 10 ? '0' : ''}${milliseconds}`;
  };

  return (
    <View style={styles.container}>
      {/* Left Side */}
      <TouchableOpacity style={[styles.half, styles.left]} onPress={handleLeftPress}>
        <Text style={[styles.timerText, styles.flippedText]}>{formatTime(leftTime)}</Text>
      </TouchableOpacity>

      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
      </View>

      {/* Right Side */}
      <TouchableOpacity style={[styles.half, styles.right]} onPress={handleRightPress}>
        <Text style={styles.timerText}>{formatTime(rightTime)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  half: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    backgroundColor: '#FF5733', // Orange color
  },
  right: {
    backgroundColor: '#33A8FF', // Blue color
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  flippedText: {
    transform: [{ rotate: '180deg' }],
  },
  buttonContainer: {
    position: 'absolute',
    top: '50%', // Center vertically
    alignSelf: 'center', // Center horizontally
    zIndex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default App;
