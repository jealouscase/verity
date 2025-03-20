// services/userService.js
import { db } from '@/lib/firebase';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from 'firebase/firestore';

// Collection name
const USERS_COLLECTION = 'users';

// Create a new user profile
export async function createUserProfile(uid, profileData) {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userRef, {
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date(),
        onboardingCompleted: true,
    });
    return getUserProfile(uid);
}

// Get user profile
export async function getUserProfile(uid) {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return {
            id: userSnap.id,
            ...userSnap.data()
        };
    }

    return null;
}

// Update user profile
export async function updateUserProfile(uid, profileData) {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date()
    });
    return getUserProfile(uid);
}

// Check if a username is available
export async function isUsernameAvailable(username) {
    if (!username || username.length < 3) return false;

    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("username", "==", username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    return querySnapshot.empty;
}

// Check if onboarding is completed
export async function hasCompletedOnboarding(uid) {
    const profile = await getUserProfile(uid);
    return profile && profile.onboardingCompleted === true;
}