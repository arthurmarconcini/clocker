import * as React from 'react';
import { useState, useEffect, useContext } from 'react'

import { firebaseClient } from '../../config/firebase/client'
import axios from 'axios'

import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword
} from 'firebase/auth'

const AuthContext = React.createContext([{}, () => {}])

export const logout = () => getAuth().signOut()

export const login = ({email, password}) => {
  const auth = getAuth();
  setPersistence(auth, browserSessionPersistence)
  .then(() => {    
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

export const signup = ({email, password, username}) => {
  const auth = getAuth()  

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      login({email, password})
      /* const token = auth.currentUser.getIdToken()

      const { data } = axios ({ 
        method: 'POST', 
        url: '/api/profile', 
        data: { username }, 
        headers: {'Authorization': `Bearer ${token}`}
      }) 
      
      console.log(data) */      
    })    
    .catch(error => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log('SIGNUP ERROR:', error)
    })
}

export const useAuth = () => {
  const [auth] = useContext(AuthContext)
  return [auth, {login, logout, signup}]
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    user: false
  })

  useEffect(() => {    
    const unsubscribe = getAuth().onAuthStateChanged(user => {
      setAuth({
        loading: false,
        user
      })
    })

    return () => unsubscribe()
  }, [])

  return (    
      <AuthContext.Provider value={[auth, setAuth]}>
        {children}
      </AuthContext.Provider>    
  )
}