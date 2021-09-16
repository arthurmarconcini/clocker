import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
}

// Initialize Firebase

export const firebaseClient = initializeApp(firebaseConfig)

/* 
export const persistenceMode = (email, password) => {
  const auth = getAuth()
  setPersistence(auth, browserLocalPersistence).then(() => {    
    return signInWithEmailAndPassword(auth, email, password);
    
    
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('Login Error:', error)
  });
}
*/

export const getToken = () => getAuth().currentUser?.getIdToken() 

