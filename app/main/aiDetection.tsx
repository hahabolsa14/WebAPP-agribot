import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator,
  Image as RNImage,
  Platform
} from "react-native";

interface Detection {
  bbox: [number, number, number, number];
  confidence: number;
  class_id: number;
  class_name: string;
}

interface DetectionResult {
  detections: Detection[];
  image_size: [number, number];
  processing_time: number;
  model_info: string;
  annotated_image?: string;
  obstruction_analysis: {
    has_obstruction: boolean;
    obstruction_count: number;
    animal_count: number;
    object_count: number;
    person_count: number;
    severity: string;
    confidence: number;
    status_message: string;
  };
  navigation: {
    can_proceed: boolean;
    recommended_action: string;
    path_status: string;
    safety_score: number;
  };
}

export default function AIDetectionPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<DetectionResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        Alert.alert("File Too Large", "Please select an image smaller than 10MB.");
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDetectionResults(null);
      };
      reader.readAsDataURL(file);
    }
  };  const processImage = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Convert image to base64
      setUploadProgress(20);
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data URL prefix
        };
        reader.readAsDataURL(selectedFile!);
      });

      setUploadProgress(40);

      // Call RT-DETR API
      const apiResponse = await fetch('http://192.168.56.1:8000/detect_base64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        }),
      });

      setUploadProgress(80);

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.status}`);
      }

      const results = await apiResponse.json();
      setUploadProgress(100);

      // Process the real API results
      processRealObstructionResults(results);
      console.log("API Results:", results);
      console.log("Annotated image present:", !!results.annotated_image);
      Alert.alert("Success", "Obstruction analysis complete!");

    } catch (error) {
      console.error("Detection error:", error);
      
      // Fallback to mock data if API is unavailable
      if (confirm("API unavailable. Use demo mode?")) {
        await simulateDetection();
        processDemoObstructionResults();
      }
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const simulateDetection = () => {
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const processRealObstructionResults = (apiResults: any) => {
    // Process real RT-DETR model results
    let personCount = 0;
    let animalCount = 0;
    let objectCount = 0;
    const obstructionDetections: Detection[] = [];

    if (apiResults && apiResults.detections) {
      apiResults.detections.forEach((detection: any) => {
        let obstructionType = detection.class_name.toLowerCase();
        
        // Count based on actual model classifications
        if (obstructionType.includes('person') || obstructionType.includes('people')) {
          personCount++;
          obstructionType = 'person';
        } else if (obstructionType.includes('animal') || obstructionType.includes('cattle') || obstructionType.includes('cow') || obstructionType.includes('livestock')) {
          animalCount++;
          obstructionType = 'animal';
        } else {
          objectCount++;
          obstructionType = 'object';
        }

        obstructionDetections.push({
          bbox: detection.bbox,
          confidence: detection.confidence,
          class_id: detection.class_id,
          class_name: obstructionType
        });
      });
    }

    const hasObstruction = obstructionDetections.length > 0;
    const totalObstructions = personCount + animalCount + objectCount;

    const realResults: DetectionResult = {
      detections: obstructionDetections,
      image_size: apiResults?.image_size || [350, 300],
      processing_time: apiResults?.processing_time || 0,
      model_info: apiResults?.model_info || "RT-DETR Obstruction Detection",
      annotated_image: apiResults?.annotated_image,
      obstruction_analysis: {
        has_obstruction: hasObstruction,
        obstruction_count: totalObstructions,
        animal_count: animalCount,
        object_count: objectCount,
        person_count: personCount,
        severity: totalObstructions > 5 ? "HIGH" : totalObstructions > 0 ? "MEDIUM" : "LOW",
        confidence: apiResults?.obstruction_analysis?.confidence || 0.85,
        status_message: hasObstruction ? 
          `${totalObstructions} OBSTRUCTION${totalObstructions > 1 ? 'S' : ''} DETECTED` : 
          "PATH CLEAR"
      },
      navigation: {
        can_proceed: !hasObstruction,
        recommended_action: hasObstruction ? 
          (personCount > 0 ? "STOP_AND_WAIT" : 
           totalObstructions > 3 ? "STOP_AND_WAIT" : "PROCEED_WITH_CAUTION") : 
          "PROCEED",
        path_status: hasObstruction ? 
          (personCount > 0 || totalObstructions > 3 ? "BLOCKED" : "CAUTION") : 
          "CLEAR",
        safety_score: hasObstruction ? Math.max(5, 100 - (totalObstructions * 10)) : 100
      }
    };

    setDetectionResults(realResults);
  };

  const processDemoObstructionResults = () => {
    const obstructionDetections: Detection[] = [];
    let personCount = 1;
    let animalCount = 1; 
    let objectCount = 1;

    obstructionDetections.push(
      {
        bbox: [50, 80, 200, 180],
        confidence: 0.92,
        class_id: 0,
        class_name: "animal"
      },
      {
        bbox: [220, 120, 320, 220],
        confidence: 0.87,
        class_id: 1,
        class_name: "person"
      },
      {
        bbox: [30, 200, 120, 280],
        confidence: 0.75,
        class_id: 2,
        class_name: "object"
      }
    );

    const hasObstruction = obstructionDetections.length > 0;
    const totalObstructions = personCount + animalCount + objectCount;

    const mockResults: DetectionResult = {
      detections: obstructionDetections,
      image_size: [350, 300],
      processing_time: 1.23,
      model_info: "Demo Mode - Obstruction Detection",
      obstruction_analysis: {
        has_obstruction: hasObstruction,
        obstruction_count: totalObstructions,
        animal_count: animalCount,
        object_count: objectCount,
        person_count: personCount,
        severity: totalObstructions > 2 ? "HIGH" : totalObstructions > 0 ? "MEDIUM" : "LOW",
        confidence: 0.87,
        status_message: hasObstruction ? `${totalObstructions} OBSTRUCTION(S) DETECTED` : "PATH CLEAR"
      },
      navigation: {
        can_proceed: !hasObstruction,
        recommended_action: hasObstruction ? (totalObstructions > 1 ? "STOP_AND_WAIT" : "PROCEED_WITH_CAUTION") : "PROCEED",
        path_status: hasObstruction ? (totalObstructions > 1 ? "BLOCKED" : "CAUTION") : "CLEAR",
        safety_score: hasObstruction ? Math.max(10, 100 - (totalObstructions * 30)) : 100
      }
    };

    setDetectionResults(mockResults);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setDetectionResults(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerContent}>
              <Ionicons name="hardware-chip-outline" size={32} color="#2e7d32" />
              <Text style={styles.headerTitle}>Obstruction Detection</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Upload an image to detect and identify obstructions in your path: animals, objects, and people
            </Text>
          </View>

          {/* Upload Section */}
          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>Upload Image</Text>
            
            {!selectedImage ? (
              <View style={styles.uploadArea}>
                <Ionicons name="scan-outline" size={48} color="#666" />
                <Text style={styles.uploadText}>Click to upload an image</Text>
                <Text style={styles.uploadSubtext}>Detect obstructions in your navigation path</Text>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={styles.hiddenInput}
                />
                
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => fileInputRef.current?.click()}
                >
                  <Ionicons name="image-outline" size={20} color="#fff" />
                  <Text style={styles.uploadButtonText}>Select Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePreview}>
                <RNImage 
                  source={{ uri: selectedImage }} 
                  style={styles.previewImage}
                  resizeMode="contain"
                />
                <View style={styles.imageActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.clearButton]}
                    onPress={clearImage}
                  >
                    <Ionicons name="trash-outline" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Clear</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.processButton]}
                    onPress={processImage}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="scan-outline" size={16} color="#fff" />
                    )}
                    <Text style={styles.actionButtonText}>
                      {isProcessing ? 'Processing...' : 'Detect Objects'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Progress Bar */}
            {isProcessing && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Processing image... {uploadProgress}%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>
              </View>
            )}
          </View>

          {/* Results Section */}
          {detectionResults && (
            <View style={styles.resultsSection}>
              <Text style={styles.sectionTitle}>Detection Results</Text>
              
              {/* Annotated Image */}
              {detectionResults.annotated_image ? (
                <View style={styles.annotatedImageSection}>
                  <Text style={styles.annotatedImageTitle}>
                    {detectionResults.obstruction_analysis.obstruction_count} Obstruction{detectionResults.obstruction_analysis.obstruction_count !== 1 ? 's' : ''} Detected
                  </Text>
                  <RNImage 
                    source={{ uri: `data:image/jpeg;base64,${detectionResults.annotated_image}` }} 
                    style={styles.annotatedImage}
                    resizeMode="contain"
                    onError={(error) => console.log("Image load error:", error)}
                    onLoad={() => console.log("Annotated image loaded successfully")}
                  />
                </View>
              ) : (
                <View style={styles.annotatedImageSection}>
                  <Text style={styles.annotatedImageTitle}>No Annotated Image Available</Text>
                  <Text style={styles.uploadSubtext}>
                    {detectionResults.detections.length > 0 
                      ? "Detections found but annotated image not generated" 
                      : "No detections to annotate"}
                  </Text>
                </View>
              )}
              
              {/* Obstruction Status Alert */}
              <View style={[
                styles.obstructionAlert,
                { backgroundColor: detectionResults.obstruction_analysis.has_obstruction 
                  ? (detectionResults.navigation.path_status === "BLOCKED" ? "#ffebee" : "#fff3e0")
                  : "#e8f5e8" 
                }
              ]}>
                <View style={styles.alertHeader}>
                  <Ionicons 
                    name={detectionResults.obstruction_analysis.has_obstruction ? "warning" : "checkmark-circle"} 
                    size={24} 
                    color={detectionResults.obstruction_analysis.has_obstruction 
                      ? (detectionResults.navigation.path_status === "BLOCKED" ? "#d32f2f" : "#f57c00")
                      : "#2e7d32"
                    } 
                  />
                  <Text style={[
                    styles.alertTitle,
                    { color: detectionResults.obstruction_analysis.has_obstruction 
                      ? (detectionResults.navigation.path_status === "BLOCKED" ? "#d32f2f" : "#f57c00")
                      : "#2e7d32"
                    }
                  ]}>
                    {detectionResults.navigation.path_status}
                  </Text>
                </View>
                <Text style={styles.alertMessage}>
                  {detectionResults.obstruction_analysis.status_message}
                </Text>
              </View>


            </View>
          )}

          {/* Model Info */}
          <View style={styles.modelInfoSection}>
            <Text style={styles.sectionTitle}>About Obstruction Detection</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoDescription}>
                Our AI model is designed to detect obstructions that may block navigation paths,
                ensuring safe autonomous movement by identifying people, animals, and objects.
              </Text>
            </View>
          </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#333333",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#B0B0B0",
    lineHeight: 22,
  },
  uploadSection: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#333333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: "#404040",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    backgroundColor: "#2C2C2C",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#B0B0B0",
    marginTop: 10,
  },
  uploadSubtext: {
    fontSize: 14,
    color: "#808080",
    marginTop: 5,
    marginBottom: 20,
  },
  hiddenInput: {
    display: "none",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  imagePreview: {
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 15,
  },
  imageActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  clearButton: {
    backgroundColor: "#f44336",
  },
  processButton: {
    backgroundColor: "#2e7d32",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 15,
  },
  progressText: {
    fontSize: 14,
    color: "#B0B0B0",
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#2C2C2C",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  resultsSection: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#333333",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#2C2C2C",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#404040",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d32",
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#808080",
    marginTop: 4,
    textAlign: "center",
  },
  modelInfoSection: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#333333",
  },
  infoCard: {
    padding: 15,
    backgroundColor: "#2C2C2C",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#404040",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: "#B0B0B0",
    lineHeight: 20,
    marginBottom: 12,
  },
  capabilitiesList: {
    marginBottom: 12,
  },
  capabilityItem: {
    fontSize: 14,
    color: "#B0B0B0",
    marginBottom: 4,
  },
  infoNote: {
    fontSize: 12,
    color: "#808080",
    fontStyle: "italic",
  },
  annotatedImageSection: {
    marginBottom: 20,
  },
  annotatedImageTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  annotatedImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#2C2C2C",
  },
  obstructionAlert: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#404040",
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  alertMessage: {
    fontSize: 14,
    color: "#B0B0B0",
    marginBottom: 12,
  },
});