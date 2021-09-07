import { Container } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { getAuth } from '@firebase/auth'
import { useEffect, useState } from 'react'
import { Login, Agenda } from '../components'

import { firebaseClient } from '../config/firebase'

export default function Home() {
  const [auth, setAuth] = useState({
    loading: true,
    user: false
  })

  useEffect(() => {
    getAuth().onAuthStateChanged(user => {
      setAuth({
        loading: false,
        user
      })
    })
  }, [])

  if (auth.loading) {
    return (
      <Container p={4} centerContent>
        <Spinner />
      </Container>
    )
  }

  return auth.user ? <Agenda /> : <Login />
}
