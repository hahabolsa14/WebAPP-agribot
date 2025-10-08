import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarMenu from "../../components/AvatarMenu";
import BackgroundWrapper from "../BackgroundWrapper";

declare global {
  interface Window {
    L: any;
  }
}

interface BotLocation {
  lat: number;
  lng: number;
  lastUpdate: string;
  status: 'online' | 'offline' | 'working';
}

export default function BotLocationPage() {
  // Early return if window is not available (SSR protection)
  if (typeof window === 'undefined') {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.topBar}>
            <View style={styles.leftContainer}>
              <Ionicons name="location-outline" size={28} color="black" />
              <Text style={styles.headerTitle}>Bot Location</Text>
            </View>
            <View style={styles.rightContainer}>
              <AvatarMenu currentPage="BotLocation" />
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading map...</Text>
          </View>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }

  const router = useRouter();
  const [botLocation, setBotLocation] = useState<BotLocation>({
    lat: 14.5995, // Default location (Philippines)
    lng: 120.9842,
    lastUpdate: new Date().toLocaleTimeString(),
    status: 'online'
  });
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const botMarker = useRef<any>(null);

  const initializeMap = () => {
    if (typeof window === 'undefined' || !mapRef.current || leafletMap.current || !window.L) return;

    console.log('Initializing bot location map...');
    leafletMap.current = window.L.map(mapRef.current).setView([botLocation.lat, botLocation.lng], 16);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(leafletMap.current);

    // Create custom bot icon
    const botIcon = window.L.divIcon({
      html: `<div style="
        background-color: #2e7d32;
        border: 3px solid white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        animation: pulse 2s infinite;
      ">🤖</div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      </style>`,
      className: 'bot-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Add bot marker
    botMarker.current = window.L.marker([botLocation.lat, botLocation.lng], { 
      icon: botIcon 
    }).addTo(leafletMap.current)
    .bindPopup(`
      <div style="text-align: center;">
        <b>🤖 EcoVentureBot</b><br>
        <span style="color: ${botLocation.status === 'online' ? '#2e7d32' : '#f44336'}">
          Status: ${botLocation.status.toUpperCase()}
        </span><br>
        Lat: ${botLocation.lat.toFixed(6)}<br>
        Lng: ${botLocation.lng.toFixed(6)}<br>
        <small>Last Update: ${botLocation.lastUpdate}</small>
      </div>
    `).openPopup();
    
    console.log('Bot location map initialized successfully');
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
      .bot-marker {
        background: transparent !important;
        border: none !important;
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

  // Simulate bot location updates (in real app, this would come from your backend)
  useEffect(() => {
    const interval = setInterval(() => {
      setBotLocation(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString(),
        // Simulate small movement
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Update bot marker when location changes
  useEffect(() => {
    if (botMarker.current && leafletMap.current) {
      botMarker.current.setLatLng([botLocation.lat, botLocation.lng]);
      botMarker.current.getPopup().setContent(`
        <div style="text-align: center;">
          <b>🤖 EcoVentureBot</b><br>
          <span style="color: ${botLocation.status === 'online' ? '#2e7d32' : '#f44336'}">
            Status: ${botLocation.status.toUpperCase()}
          </span><br>
          Lat: ${botLocation.lat.toFixed(6)}<br>
          Lng: ${botLocation.lng.toFixed(6)}<br>
          <small>Last Update: ${botLocation.lastUpdate}</small>
        </div>
      `);
      leafletMap.current.setView([botLocation.lat, botLocation.lng], leafletMap.current.getZoom());
    }
  }, [botLocation]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#2e7d32';
      case 'working': return '#ff9800';
      case 'offline': return '#f44336';
      default: return '#666';
    }
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <View style={styles.leftContainer}>
            <Ionicons name="location-outline" size={28} color="black" />
            <Text style={styles.headerTitle}>Bot Location</Text>
          </View>

          <View style={styles.rightContainer}>
            <AvatarMenu currentPage="BotLocation" />
          </View>
        </View>

        <View style={styles.content}>
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(botLocation.status) }]} />
                <Text style={styles.statusText}>
                  Bot Status: <Text style={[styles.statusValue, { color: getStatusColor(botLocation.status) }]}>
                    {botLocation.status.toUpperCase()}
                  </Text>
                </Text>
              </View>
              <Text style={styles.lastUpdate}>Last Update: {botLocation.lastUpdate}</Text>
            </View>
            
            <View style={styles.coordinatesContainer}>
              <View style={styles.coordinateItem}>
                <Ionicons name="location" size={16} color="#2e7d32" />
                <Text style={styles.coordinateLabel}>Latitude:</Text>
                <Text style={styles.coordinateValue}>{botLocation.lat.toFixed(6)}</Text>
              </View>
              <View style={styles.coordinateItem}>
                <Ionicons name="location" size={16} color="#2e7d32" />
                <Text style={styles.coordinateLabel}>Longitude:</Text>
                <Text style={styles.coordinateValue}>{botLocation.lng.toFixed(6)}</Text>
              </View>
            </View>
          </View>

          {/* Map Container */}
          <View style={styles.mapContainer}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </View>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#122909",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 15,
  },
  statusCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(46, 125, 50, 0.1)",
  } as ViewStyle,
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  } as ViewStyle,
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  } as ViewStyle,
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  } as ViewStyle,
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  } as TextStyle,
  statusValue: {
    fontWeight: "600",
  } as TextStyle,
  lastUpdate: {
    fontSize: 12,
    color: "#666",
  } as TextStyle,
  coordinatesContainer: {
    gap: 10,
  } as ViewStyle,
  coordinateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  } as ViewStyle,
  coordinateLabel: {
    fontSize: 14,
    color: "#666",
    minWidth: 70,
  } as TextStyle,
  coordinateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e7d32",
  } as TextStyle,
  mapContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    overflow: "hidden",
    minHeight: 400,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: "bold",
  } as TextStyle,
});
