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
    await setDoc(doc(db, 'mapMarkers', userId), {
      markers,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error saving markers:', error);
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