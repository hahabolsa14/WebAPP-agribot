import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.web';

export interface MapMarker {
  id?: string;
  lat: number;
  lng: number;
  title: string;
}

export const saveMapMarkers = async (userId: string, markers: MapMarker[]) => {
  try {
    console.log('Saving markers for user:', userId);
    console.log('Markers to save:', markers);
    
    const docRef = doc(db, 'mapMarkers', userId);
    const data = {
      markers,
      updatedAt: serverTimestamp(),
    };
    
    console.log('Attempting to save data:', data);
    await setDoc(docRef, data);
    console.log('Data saved successfully');
    
    return true;
  } catch (error) {
    console.error('Error saving markers:', error);
    console.error('Error details:', {
      userId,
      markersCount: markers?.length,
      error: error instanceof Error ? error.message : String(error)
    });
    return false;
  }
};

export const getMapMarkers = async (userId: string): Promise<MapMarker[]> => {
  try {
    const markerDoc = await getDoc(doc(db, 'mapMarkers', userId));
    if (markerDoc.exists()) {
      return markerDoc.data().markers;
    }
    return [];
  } catch (error) {
    console.error('Error getting markers:', error);
    return [];
  }
};