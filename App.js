/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableHighlight,
  Platform
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Roam from 'roam-reactnative';


export default function App(){
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [userId, setUserId] = useState('')
  const [onlineTripId, setOnlineTripId] = useState('')
  const [offlineTripId, setOfflineTripId] = useState('')
  const [response, setResponse] = useState('')
  const [tripStatus, setTripStatus] = useState('')

  useEffect(() => {
    
    if(Platform.OS === 'android'){
      Roam.allowMockLocation(true)
      Roam.disableBatteryOptimization();
    }
    Roam.offlineLocationTracking(true)
    Roam.startListener('trip_status', trip => {
      console.log(JSON.stringify(trip))
      setTripStatus(JSON.stringify(trip))
    })
    
  }, [])

  const locationPermission = () => {
    Roam.requestLocationPermission()
  }

  const backgroundLocationPermission = () => {
    Roam.requestBackgroundLocationPermission()
  }


  // ----- User ----

  const createUser = () => {
    Roam.createUser('test user', success => {
      console.log(JSON.stringify(success));
      setResponse(JSON.stringify(success))
      setUserId(success.userId);
    }, error => {
      console.log(JSON.stringify(error))
      setResponse(JSON.stringify(error))
    })
  }
  
  // ----- Trip ----

  const createTrip = (offline) => {
    Roam.createTrip(offline, success =>{
      console.log(JSON.stringify(success));
      setResponse(JSON.stringify(success));
      if(offline){
        setOfflineTripId(success.id)
      } else {
        setOnlineTripId(success.id)
      }
    }, error => {
      console.log(JSON.stringify(error));
      setResponse(JSON.stringify(error))
    })
  }

  const unsubTrip = (tripId) => {
    Roam.unSubscribeTripStatus(tripId)
  }

  


  const startTrip = (tripId) => {
    Roam.startTrip(tripId, "description", success => {
      console.log(JSON.stringify(success));
      setResponse(JSON.stringify(success));

      Roam.toggleListener(true, true, successL => {
        console.log(JSON.stringify(successL));
      setResponse(JSON.stringify(successL));
      console.log(`online trip: ${onlineTripId}, offline trip: ${offlineTripId}, tripId: ${tripId}`)
        Roam.subscribe(Roam.SubscribeListener.LOCATION, userId)
        Roam.subscribeTripStatus(tripId)
        Roam.setBatchReceiverConfig(Roam.NetworkState.BOTH, 2, 0, s => {
          console.log(JSON.stringify(s));
          setResponse(JSON.stringify(s));
        }, e => {
          console.log(JSON.stringify(e));
          setResponse(JSON.stringify(e));
        })
      }, errorL => {
        console.log(JSON.stringify(errorL));
      setResponse(JSON.stringify(errorL));
      })

    }, error => {
      console.log(JSON.stringify(error));
      setResponse(JSON.stringify(error))
    })
  }

  const pauseTrip = (tripId) => {
    Roam.pauseTrip(tripId, success => {
      console.log(JSON.stringify(success));
      setResponse(JSON.stringify(success));
    }, error => {
      console.log(JSON.stringify(error));
      setResponse(JSON.stringify(error))
    })
  }

  const resumeTrip = (tripId) => {
    Roam.resumeTrip(tripId, success => {
      console.log(JSON.stringify(success));
      setResponse(JSON.stringify(success));
    }, error => {
      console.log(JSON.stringify(error));
      setResponse(JSON.stringify(error))
    })
  }

  const endTrip = (tripId) => {
    Roam.stopTrip(tripId, success => {
      console.log(JSON.stringify(success));
      setResponse(JSON.stringify(success));
    }, error => {
      console.log(JSON.stringify(error));
      setResponse(JSON.stringify(error))
    })
  }

  const tripSummary = (tripId) => {
    Roam.getTripSummary(tripId, success => {
      console.log(JSON.stringify(success));
      setResponse(JSON.stringify(success));
    }, error => {
      console.log(JSON.stringify(error));
      setResponse(JSON.stringify(error))
    })
  }

  const syncTrip = (tripId) => {
    Roam.syncTrip(tripId, success => {
      console.log(JSON.stringify(success));
      setResponse(JSON.stringify(success));
    }, error => {
      console.log(JSON.stringify(error));
      setResponse(JSON.stringify(error))
    })
  }

  // ----- tracking ----

  const startTracking = () => {
    if(Platform.OS === 'android'){
      Roam.setForegroundNotification(true,
        "Sprintcrowd Issue",
        "Testing app",
        "mipmap/ic_launcher",
        "com.sprintcrowdissue.MainActivity",
        "com.sprintcrowdissue.LocationService"
        )
        Roam.startTrackingDistanceInterval(5, 5, Roam.DesiredAccuracy.HIGH);
    } else {
      Roam.startTrackingCustom(true, false, Roam.ActivityType.FITNESS, Roam.DesiredAccuracyIOS.BEST, true, 5, 5, 0);
    }
    Roam.publishAndSave(null)
  }

  const stopTracking = () => {
    if(Platform.OS === 'android'){
      Roam.setForegroundNotification(false,
        "Sprintcrowd Issue",
        "Testing app",
        "mipmap/ic_launcher",
        "com.sprintcrowdissue.MainActivity",
        "com.sprintcrowdissue.LocationService"
        )
    }
    Roam.stopTracking()
  }



  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
          <Text style={styles.sectionTitle}>0.0.33</Text>
        <Text style={styles.text}>UserId: {userId}</Text>
        <Text style={styles.text}>Offline Trip Id: {offlineTripId}</Text>
        <Text style={styles.text}>Online Trip Id: {onlineTripId}</Text>
        <Text style={styles.text}>Response: {response}</Text>
        <Text style={styles.text}>Trip status: {tripStatus}</Text>
        

        <TouchableHighlight style={styles.button}
        onPress={() => locationPermission()}
        >
          <Text style={styles.buttonText}>Location Permission</Text>
        </TouchableHighlight>

        {
          (Platform.OS === 'android')
          ?
          <TouchableHighlight style={styles.button}
        onPress={() => backgroundLocationPermission()}
        >
          <Text style={styles.buttonText}>Background Location</Text>
        </TouchableHighlight>
        : <View />
        }

        <TouchableHighlight style={styles.button}
        onPress={() => createUser()}
        >
          <Text style={styles.buttonText}>Create User</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => startTracking()}
        >
          <Text style={styles.buttonText}>Start Tracking</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => stopTracking()}
        >
          <Text style={styles.buttonText}>Stop Tracking</Text>
        </TouchableHighlight>

        <View style={styles.line}/>

        <Text style={styles.sectionTitle}>Offline Trip</Text>
        
        <TouchableHighlight style={styles.button}
        onPress={() => createTrip(true)}
        >
          <Text style={styles.buttonText}>Create Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => startTrip(offlineTripId)}
        >
          <Text style={styles.buttonText}>Start Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => pauseTrip(offlineTripId)}
        >
          <Text style={styles.buttonText}>Pause Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => resumeTrip(offlineTripId)}
        >
          <Text style={styles.buttonText}>Resume Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => endTrip(offlineTripId)}
        >
          <Text style={styles.buttonText}>End Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => unsubTrip(offlineTripId)}
        >
          <Text style={styles.buttonText}>Unsubscribe Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => syncTrip(offlineTripId)}
        >
          <Text style={styles.buttonText}>Sync Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => tripSummary(offlineTripId)}
        >
          <Text style={styles.buttonText}>Get Trip Summary</Text>
        </TouchableHighlight>
        

        <View style={styles.line}/>

        <Text style={styles.sectionTitle}>Online Trip</Text>
        
        <TouchableHighlight style={styles.button}
        onPress={() => createTrip(false)}
        >
          <Text style={styles.buttonText}>Create Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => startTrip(onlineTripId)}
        >
          <Text style={styles.buttonText}>Start Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => pauseTrip(onlineTripId)}
        >
          <Text style={styles.buttonText}>Pause Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => resumeTrip(onlineTripId)}
        >
          <Text style={styles.buttonText}>Resume Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => endTrip(onlineTripId)}
        >
          <Text style={styles.buttonText}>End Trip</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button}
        onPress={() => unsubTrip(onlineTripId)}
        >
          <Text style={styles.buttonText}>Unsubscribe Trip</Text>
        </TouchableHighlight>
      

        <TouchableHighlight style={styles.button}
        onPress={() => tripSummary(onlineTripId)}
        >
          <Text style={styles.buttonText}>Get Trip Summary</Text>
        </TouchableHighlight>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  text: {
    alignSelf: 'center',
    margin: 20
  },
  line: {
    backgroundColor: 'black',
    margin: 20
  },
  button: {
    alignItems: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: 'blue',
    height: 40
  },
  buttonText: {
    color: 'white',

  }
});

