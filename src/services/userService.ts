import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Initialize user profile in Firestore
export const createUserProfile = async (userId: string, userData: any) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      favorites: [],
      watchlist: [],
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
};

// Get user profile data
export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), data);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Add media to favorites
export const addToFavorites = async (userId: string, mediaItem: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      favorites: arrayUnion(mediaItem)
    });
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

// Remove media from favorites
export const removeFromFavorites = async (userId: string, mediaId: number) => {
  try {
    // First get the user's favorites
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      const itemToRemove = favorites.find((item: any) => item.id === mediaId);
      
      if (itemToRemove) {
        await updateDoc(doc(db, 'users', userId), {
          favorites: arrayRemove(itemToRemove)
        });
      }
    }
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

// Add media to watchlist
export const addToWatchlist = async (userId: string, mediaItem: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      watchlist: arrayUnion(mediaItem)
    });
    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
};

// Remove media from watchlist
export const removeFromWatchlist = async (userId: string, mediaId: number) => {
  try {
    // First get the user's watchlist
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const watchlist = userData.watchlist || [];
      const itemToRemove = watchlist.find((item: any) => item.id === mediaId);
      
      if (itemToRemove) {
        await updateDoc(doc(db, 'users', userId), {
          watchlist: arrayRemove(itemToRemove)
        });
      }
    }
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};