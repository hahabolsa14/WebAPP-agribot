import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarMenu from "../../components/AvatarMenu";
import BackgroundWrapper from "../BackgroundWrapper";
import WebView from "react-native-webview";
import { useAuth } from "../../utils/authHelpers";
import { saveMapMarkers, getMapMarkers } from "../../utils/mapHelpers";

interface Marker {
  lat: number;
  lng: number;
  title: string;
}

export default function MappingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const webViewRef = useRef<WebView>(null);
  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        handleMapPress(lat, lng);
        setInputLat('');
        setInputLng('');
      } else {
        Alert.alert('Invalid Coordinates', 'Latitude must be between -90 and 90, and longitude between -180 and 180');
      }
    } else {
      Alert.alert('Invalid Input', 'Please enter valid numbers for latitude and longitude');
    }
  };

  const loadMarkersFromFirebase = async () => {
    if (!user?.uid) return;
    const loadedMarkers = await getMapMarkers(user.uid);
    if (loadedMarkers) {  // Remove length check to handle empty arrays too
      setMarkers(loadedMarkers);
      // Ensure map updates with loaded markers
      webViewRef.current?.injectJavaScript(`
        if (mapReady) {
          window.markers = ${JSON.stringify(loadedMarkers)};
          window.updateMarkers();
          map.invalidateSize();
        }
      ` + '; true;');
    }
  };

  const saveMarkersToFirebase = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to save markers');
      return;
    }
    
    const success = await saveMapMarkers(user.uid, markers);
    if (success) {
      Alert.alert('Success', 'Markers saved successfully');
    } else {
      Alert.alert('Error', 'Failed to save markers');
    }
  };

  const removeAllMarkers = () => {
    Alert.alert(
      'Remove All Markers',
      'Are you sure you want to remove all markers?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove All', 
          style: 'destructive',
          onPress: async () => {
            setMarkers([]);
            if (user?.uid) {
              await saveMapMarkers(user.uid, []);
            }
          }
        }
      ]
    );
  };

  const handleMapPress = async (lat: number, lng: number) => {
    const newMarker = {
      lat,
      lng,
      title: `Obstacle ${markers.length + 1}`
    };
    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
  };

  const injectMarkersToMap = () => {
    const markersScript = `
      window.markers = ${JSON.stringify(markers)};
      if (window.updateMarkers) {
        window.updateMarkers();
      }
    `;
    webViewRef.current?.injectJavaScript(markersScript + '; true;');
  };

  useEffect(() => {
    injectMarkersToMap();
  }, [markers]);

  useEffect(() => {
    if (user?.uid) {
      loadMarkersFromFirebase();
    }
  }, [user]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          #map {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var mapReady = false;
          var map = L.map('map', {
            zoomControl: true,
            attributionControl: true,
            maxZoom: 19,
            minZoom: 3
          }).setView([14.5995, 120.9842], 15);

          map.whenReady(function() {
            mapReady = true;
            if (window.markers && window.markers.length > 0) {
              window.updateMarkers();
            }
          });
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          window.markers = [];
          var markersLayer = L.layerGroup().addTo(map);

          let markersMap = new Map();
          
          // Ensure markers stay visible during zoom/pan
          map.on('zoomend moveend', function() {
            if (window.updateMarkers) {
              window.updateMarkers();
            }
          });

          window.updateMarkers = function() {
            if (!mapReady) return;

            // Clear all existing markers if there are no markers in the data
            if (!window.markers || window.markers.length === 0) {
              markersMap.forEach((existingMarker) => {
                markersLayer.removeLayer(existingMarker);
              });
              markersMap.clear();
              return;
            }

            // Remove markers that no longer exist
            markersMap.forEach((existingMarker, id) => {
              if (!window.markers.find(m => m.title === id)) {
                markersLayer.removeLayer(existingMarker);
                markersMap.delete(id);
              }
            });

            // Update or add new markers
            window.markers.forEach(function(marker) {
              if (!markersMap.has(marker.title)) {
                const newMarker = L.marker([marker.lat, marker.lng], {
                  autoPan: false,
                  riseOnHover: true
                }).bindPopup(
                  '<b>' + marker.title + '</b><br>' +
                  'Lat: ' + marker.lat.toFixed(6) + '<br>' +
                  'Lng: ' + marker.lng.toFixed(6)
                );
                markersLayer.addLayer(newMarker);
                markersMap.set(marker.title, newMarker);
              }
            });
            
            // Force a map update to ensure markers are visible
            map.invalidateSize();
          };

          map.on('click', function(e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapClick',
              lat: e.latlng.lat,
              lng: e.latlng.lng
            }));
          });
        </script>
      </body>
    </html>
  `;

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <Ionicons name="car-sport-outline" size={28} color="black" />
          <View style={styles.rightContainer}>
            <AvatarMenu currentPage="Mapping" />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Field Mapping</Text>
          <View style={styles.inputContainer}>
            <View style={styles.coordinateInputs}>
              <View style={styles.inputWrapper}>
                <Text>Latitude:</Text>
                <TextInput
                  style={styles.input}
                  value={inputLat}
                  onChangeText={setInputLat}
                  placeholder="Enter latitude"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text>Longitude:</Text>
                <TextInput
                  style={styles.input}
                  value={inputLng}
                  onChangeText={setInputLng}
                  placeholder="Enter longitude"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.addButton} onPress={handleCoordinateSubmit}>
                <Text style={styles.buttonText}>Add Marker</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveMarkersToFirebase}>
                <Text style={styles.buttonText}>Save All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton} onPress={removeAllMarkers}>
                <Text style={styles.buttonText}>Remove All</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <WebView
              ref={webViewRef}
              source={{ html: htmlContent }}
              style={{ flex: 1, backgroundColor: 'transparent' }}
              onLayout={() => {
                webViewRef.current?.injectJavaScript('if (mapReady) { map.invalidateSize(); window.updateMarkers(); }; true;');
              }}
              scrollEnabled={false}
              bounces={false}
              onLoadEnd={() => {
                if (markers.length > 0) {
                  injectMarkersToMap();
                }
              }}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'mapClick') {
                    handleMapPress(data.lat, data.lng);
                  }
                } catch (error) {
                  console.error('Error parsing message:', error);
                }
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  removeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  coordinateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mapContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});
