import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useFetch } from '@refetty/react'
import { addDays, subDays, format } from 'date-fns'

import { Button, IconButton } from '@chakra-ui/button'
import { Box, Container, Spinner, Text } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

import { useAuth, formatDate } from './../components'
import { getToken } from '../config/firebase/client'

const getAgenda = async when => {
  const token = await getToken()

  return axios({
    method: 'get',
    url: '/api/agenda',
    params: {
      date: format(when, 'yyyy-MM-dd')
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const Header = ({ children }) => {
  return (
    <Box
      p={4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      {children}
    </Box>
  )
}

const AgendaBlock = ({ time, name, phone }) => (
  <Box
    display="flex"
    alignItems="center"
    bg="gray.100"
    borderRadius={6}
    p={4}
    mt={4}
  >
    <Box flex={1} fontSize="3xl">
      {time}
    </Box>
    <Box textAlign="right">
      <Text fontSize="xl">{name}</Text>
      <Text>{phone}</Text>
    </Box>
  </Box>
)

export default function Agenda() {
  const [auth, { logout }] = useAuth()
  const router = useRouter()
  const [when, setWhen] = useState(() => new Date())
  const [data, { loading }, fetch] = useFetch(getAgenda, {
    lazy: true
  })

  const addDay = () => setWhen(prevState => addDays(prevState, 1))
  const removeDay = () => setWhen(prevState => subDays(prevState, 1))

  useEffect(() => {
    !auth.user && router.push('/')
  }, [auth.user])

  useEffect(() => {
    fetch(when)
  }, [when])

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

      {loading && (
        <Spinner
          tickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}
      <Box mt={8}>
        {data?.map(doc => (
          <AgendaBlock
            key={doc.time}
            time={doc.time}
            name={doc.name}
            phone={doc.phone}
          />
        ))}
      </Box>
    </Container>
  )
}
