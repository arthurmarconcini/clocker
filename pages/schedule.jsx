import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useFetch } from '@refetty/react'
import { addDays, subDays } from 'date-fns'

import { Button, IconButton} from '@chakra-ui/button'
import { Box, Container, SimpleGrid } from '@chakra-ui/layout'
import { ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'

import { useAuth, formatDate } from './../components'
import { Spinner } from '@chakra-ui/react'

const getSchedule = async (when) => axios({
  method: 'get',  
  url:'/api/schedule',
  params: {
    when,
    username: window.location.pathname
  }
})

const Header = ({children}) => {
  return (
    <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
      {children}
    </Box>
  )  
}

const TimeBlock = ({time}) => {
  return (
    <Button p={8} bg="blue.500" color="white" >{time}</Button>
  )
}

export default function Agenda() {
  const [auth , {logout}] = useAuth()
  const router = useRouter()
  const [when, setWhen] = useState(() => new Date())
  const [data, {loading, status, error}, fetch] = useFetch(getSchedule, {lazy: true})

  const addDay = () => setWhen(prevState => addDays(prevState, 1))
  const removeDay = () => setWhen(prevState => subDays(prevState, 1))  

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

      <SimpleGrid p={4} columns={2} spacing={4} mt={8}>
        {loading && <Spinner tickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />}
        {data?.map(time => <TimeBlock key={time} time={time} />)}
      </SimpleGrid>
      
    </Container>
    
      
  )
}
