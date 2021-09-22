import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useFetch } from '@refetty/react'
import { addDays, subDays, format } from 'date-fns'

import { Button, IconButton} from '@chakra-ui/button'
import { Box, Container, SimpleGrid } from '@chakra-ui/layout'
import { ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import { Spinner } from '@chakra-ui/react'

import { useAuth, formatDate, TimeBlock } from '../components'

const getSchedule = async ({when, username}) => axios({
  method: 'get',  
  url:'/api/schedule',
  params: {
    date: format(when, 'yyyy-MM-dd'),
    username
  }
})

const Header = ({children}) => {
  return (
    <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
      {children}
    </Box>
  )  
}

export default function Schedule() {
  const [auth, { logout }] = useAuth()
  const router = useRouter()
  const [when, setWhen] = useState(() => new Date())
  const [data, { loading, status, error }, fetch] = useFetch(getSchedule, {
    lazy: true
  })

  const addDay = () => setWhen(prevState => addDays(prevState, 1))
  const removeDay = () => setWhen(prevState => subDays(prevState, 1))

  
  useEffect(() => {
    fetch({when, username: router.query.username})
  }, [when, router.query.username])  
  
 

  return (
    <Container>
      <Header>
        <img src="/logo.svg" alt="Logo" style={{ width: '150px' }} />
        <Button onClick={logout}>Sair</Button>
      </Header>
      <Box display="flex" alignItems="center" mt="8">
        <IconButton
          icon={<ChevronLeftIcon />}
          bg="transparent"
          onClick={removeDay}
        />
        <Box flex={1} textAlign="center">
          {formatDate(when, 'PPPP')}
        </Box>
        <IconButton
          icon={<ChevronRightIcon />}
          bg="transparent"
          onClick={addDay}
        />
      </Box>

      <SimpleGrid p={4} columns={2} spacing={4} mt={8}>
        {loading && (
          <Spinner
            tickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        )}
        {data?.map(({time, isBlocked}) => (
          <TimeBlock key={time} time={time} date={when} disabled={isBlocked} />
        ))}
      </SimpleGrid>
    </Container>
  )
}
