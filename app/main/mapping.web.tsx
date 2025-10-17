import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View, Text, TextInput, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { useAuth } from "../../utils/authHelpers";
import { saveMapMarkers, getMapMarkers } from "../../utils/mapHelpers.web";

declare global {
  interface Window {
    L: any;
  }
}

interface Marker {
  lat: number;
  lng: number;
  title: string;
}

export default function MappingPage() {
  // Early return if window is not available (SSR protection)
  if (typeof window === 'undefined') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  const router = useRouter();
  const { user } = useAuth();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersLayer = useRef<any>(null);
  const markersMap = useRef<Map<string, any>>(new Map());

  const initializeMap = () => {
    if (typeof window === 'undefined' || !mapRef.current || leafletMap.current || !window.L) return;

    console.log('Initializing map...');
    leafletMap.current = window.L.map(mapRef.current).setView([14.5995, 120.9842], 15);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(leafletMap.current);

    markersLayer.current = window.L.layerGroup().addTo(leafletMap.current);
    
    console.log('Map initialized successfully (click handler will be set up separately)');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Add required Leaflet styles inline
    const leafletStyles = `
      .leaflet-container {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .leaflet-tile-pane {
        filter: brightness(0.9);
      }
    `;
    const styleElement = document.createElement('style');
    styleElement.textContent = leafletStyles;
    document.head.appendChild(styleElement);

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
      }
    };
  }, []);

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        handleMapPress(lat, lng);
        setInputLat('');
        setInputLng('');
      } else {
        if (typeof window !== 'undefined') window.alert('Latitude must be between -90 and 90, and longitude between -180 and 180');
      }
    } else {
      if (typeof window !== 'undefined') window.alert('Please enter valid numbers for latitude and longitude');
    }
  };

  const loadMarkersFromFirebase = async () => {
    if (!user?.uid) return;
    const loadedMarkers = await getMapMarkers(user.uid);
    if (loadedMarkers) {  // Remove length check to handle empty arrays too
      setMarkers(loadedMarkers);
    }
  };

  const saveMarkersToFirebase = async () => {
    if (markers.length === 0) {
      if (typeof window !== 'undefined') window.alert('No markers to save');
      return;
    }

    if (!user?.uid) {
      if (typeof window !== 'undefined') window.alert('You must be logged in to save markers');
      return;
    }
    
    const success = await saveMapMarkers(user.uid, markers);
    if (success) {
      if (typeof window !== 'undefined') window.alert(`Successfully saved ${markers.length} marker(s)`);
    } else {
      if (typeof window !== 'undefined') window.alert('Failed to save markers');
    }
  };

  const removeAllMarkers = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to remove all markers?')) {
      // Clear the markers map
      markersMap.current.forEach((existingMarker) => {
        markersLayer.current.removeLayer(existingMarker);
      });
      markersMap.current.clear();
      
      setMarkers([]);
      if (user?.uid) {
        saveMapMarkers(user.uid, []);
      }
    }
  };

  const handleMapPress = (lat: number, lng: number) => {
    console.log('Map clicked at:', lat, lng);
    console.log('Current markers:', markers);
    
    const newMarker = {
      lat,
      lng,
      title: `Obstacle ${markers.length + 1}`
    };
    console.log('Creating new marker:', newMarker);
    
    const updatedMarkers = [...markers, newMarker];
    console.log('Updated markers array:', updatedMarkers);
    setMarkers(updatedMarkers);
  };

  // Set up click handler that updates when markers change
  useEffect(() => {
    if (!leafletMap.current) return;
    
    console.log('Setting up click handler with current markers:', markers);
    
    // Remove existing click handlers
    leafletMap.current.off('click');
    
    // Add new click handler with current state
    leafletMap.current.on('click', (e: any) => {
      console.log('Map click event triggered with current state');
      handleMapPress(e.latlng.lat, e.latlng.lng);
    });
  }, [markers]);

  const updateMarkersOnMap = () => {
    console.log('updateMarkersOnMap called with markers:', markers);
    if (typeof window === 'undefined' || !markersLayer.current || !window.L) {
      console.log('Early return: window, markersLayer, or Leaflet not available');
      return;
    }

    // Clear all existing markers if there are no markers in the data
    if (!markers || markers.length === 0) {
      markersMap.current.forEach((existingMarker) => {
        markersLayer.current.removeLayer(existingMarker);
      });
      markersMap.current.clear();
      return;
    }

    // Remove markers that no longer exist
    markersMap.current.forEach((existingMarker, id) => {
      if (!markers.find(m => m.title === id)) {
        markersLayer.current.removeLayer(existingMarker);
        markersMap.current.delete(id);
      }
    });

    // Update or add new markers
    markers.forEach((marker) => {
      if (!markersMap.current.has(marker.title)) {
        console.log('Adding new marker to map:', marker.title);
        const newMarker = window.L.marker([marker.lat, marker.lng], {
          autoPan: false,
          riseOnHover: true
        }).bindPopup(`
          <b>${marker.title}</b><br>
          Lat: ${marker.lat.toFixed(6)}<br>
          Lng: ${marker.lng.toFixed(6)}
        `);
        
        newMarker.addTo(markersLayer.current);
        markersMap.current.set(marker.title, newMarker);
        console.log('Marker added successfully:', marker.title);
      }
    });
    
    // Force a map update to ensure markers are visible
    if (leafletMap.current) {
      leafletMap.current.invalidateSize();
    }
    
    console.log('Total markers on map:', markersMap.current.size);
  };

  useEffect(() => {
    console.log('useEffect triggered - markers changed:', markers);
    updateMarkersOnMap();
  }, [markers]);

  useEffect(() => {
    if (user?.uid) {
      loadMarkersFromFirebase();
    }
  }, [user]);

  return (
    <View style={styles.content}>
      <View style={styles.inputContainer}>
            <View style={styles.coordinateInputs}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Latitude:</Text>
                <TextInput
                  style={styles.input}
                  value={inputLat}
                  onChangeText={setInputLat}
                  placeholder="Enter latitude"
                  placeholderTextColor="#808080"
                  inputMode="numeric"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Longitude:</Text>
                <TextInput
                  style={styles.input}
                  value={inputLng}
                  onChangeText={setInputLng}
                  placeholder="Enter longitude"
                  placeholderTextColor="#808080"
                  inputMode="numeric"
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
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  } as ViewStyle,
  inputContainer: {
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#333333',
  } as ViewStyle,
  removeButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  coordinateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  } as ViewStyle,
  inputWrapper: {
    flex: 1,
    marginHorizontal: 5,
  } as ViewStyle,
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 4,
  } as TextStyle,
  input: {
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 14,
    height: 38,
    backgroundColor: '#2C2C2C',
  } as TextStyle,
  addButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  saveButton: {
    backgroundColor: '#2e7d32',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  } as TextStyle,
  mapContainer: {
    width: '100%',
    height: Platform.OS === 'web' ? (typeof window !== 'undefined' ? window.innerHeight - 320 : 400) : 400,
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#404040',
  } as ViewStyle,
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  } as ViewStyle,
});