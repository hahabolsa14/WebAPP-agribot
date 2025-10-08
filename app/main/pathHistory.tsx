import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarMenu from "../../components/AvatarMenu";
import BackgroundWrapper from "../BackgroundWrapper";

export default function PathHistoryPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleDateSelect = () => {
    setShowDatePicker(true);
  };

  // Mock path history data
  const pathHistoryData = [
    { id: 1, date: '2025-10-08', startTime: '08:30', endTime: '12:45', distance: '2.3 km', status: 'Completed' },
    { id: 2, date: '2025-10-07', startTime: '09:15', endTime: '11:30', distance: '1.8 km', status: 'Completed' },
    { id: 3, date: '2025-10-06', startTime: '07:45', endTime: '10:20', distance: '3.1 km', status: 'Completed' },
  ];

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <View style={styles.leftContainer}>
            <Ionicons name="time-outline" size={28} color="black" />
            <Text style={styles.headerTitle}>Path History</Text>
          </View>

          <View style={styles.rightContainer}>
            <AvatarMenu currentPage="PathHistory" />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Date Picker Section */}
          <View style={styles.datePickerContainer}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={handleDateSelect}
            >
              <View style={styles.datePickerContent}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.datePickerText}>
                  {selectedDate ? formatDate(selectedDate) : 'Enter date'}
                </Text>
                <Ionicons name="chevron-down-outline" size={20} color="#666" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Path History Results */}
          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>Recent Paths</Text>
            
            {pathHistoryData.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.dateSection}>
                    <Ionicons name="calendar" size={16} color="#2e7d32" />
                    <Text style={styles.cardDate}>{item.date}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.timeSection}>
                    <View style={styles.timeItem}>
                      <Ionicons name="play-circle-outline" size={16} color="#666" />
                      <Text style={styles.timeLabel}>Start: {item.startTime}</Text>
                    </View>
                    <View style={styles.timeItem}>
                      <Ionicons name="stop-circle-outline" size={16} color="#666" />
                      <Text style={styles.timeLabel}>End: {item.endTime}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.distanceSection}>
                    <Ionicons name="location-outline" size={16} color="#2e7d32" />
                    <Text style={styles.distanceText}>{item.distance}</Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Ionicons name="chevron-forward-outline" size={16} color="#2e7d32" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Empty State */}
          {selectedDate && (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No paths found for selected date</Text>
              <Text style={styles.emptyStateSubtext}>Try selecting a different date</Text>
            </View>
          )}
        </ScrollView>
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
  },
  datePickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#122909",
    marginBottom: 12,
  },
  datePickerButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    padding: 15,
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerText: {
    fontSize: 16,
    color: "#495057",
    flex: 1,
    marginLeft: 10,
  },
  historyContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2e7d32",
  },
  statusBadge: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2e7d32",
  },
  cardContent: {
    gap: 12,
  },
  timeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
  },
  distanceSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 6,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2e7d32",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
