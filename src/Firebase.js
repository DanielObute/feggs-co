import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBLy3b6szMEx3Pa2zknEL3llR-EbMBvLsg',
  authDomain: 'feggs-co.firebaseapp.com',
  projectId: 'feggs-co',
  storageBucket: 'feggs-co.firebasestorage.app',
  messagingSenderId: '510457067623',
  appId: '1:510457067623:web:8ed971bcd47487a3f9fcc2',
  measurementId: 'G-X8Y39H9GGH'
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)