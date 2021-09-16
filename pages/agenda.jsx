import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useFetch } from '@refetty/react'
import { addDays, subDays } from 'date-fns'

import { Button, IconButton} from '@chakra-ui/button'
import { Box, Container } from '@chakra-ui/layout'
import { ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'

import { useAuth, formatDate } from './../components'
import { getToken } from '../config/firebase/client'


const getAgenda = async (when) => {
  const token = await getToken()
  
  return axios({
    method: 'get',  
    url:'/api/agenda',
    params: {
      when
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const Header = ({children}) => {
  return (
    <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
      {children}
    </Box>
  )  
}

export default function Agenda() {
  const [auth , {logout}] = useAuth()
  const router = useRouter()
  const [when, setWhen] = useState(() => new Date())
  const [data, {loading, status, error}, fetch] = useFetch(getAgenda, {lazy: true})

  const addDay = () => setWhen(prevState => addDays(prevState, 1))
  const removeDay = () => setWhen(prevState => subDays(prevState, 1))

  useEffect(() => {
    !auth.user && router.push('/')
  }, [auth.user])

  useEffect(() =>{
    fetch(when)
  },[when])

  return (
    <Container>
      <Header>
        <img src="/logo.svg" alt="Logo" style={{width: '150px'}} />
        <Button onClick={logout}>Sair</Button>   
      </Header>
      <Box display="flex" alignItems="center" mt="8">
        <IconButton icon={<ChevronLeftIcon />} bg="transparent" onClick={removeDay} />
        <Box flex={1} textAlign="center" >{formatDate(when, 'PPPP')}</Box>
        <IconButton icon={<ChevronRightIcon />} bg="transparent" onClick={addDay} />
      </Box>
      
    </Container>
    
      
  )
}
