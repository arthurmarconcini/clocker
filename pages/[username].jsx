import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useFetch } from '@refetty/react'
import { addDays, subDays, format } from 'date-fns'

import { IconButton } from '@chakra-ui/button'
import { Box, Container, SimpleGrid } from '@chakra-ui/layout'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Spinner } from '@chakra-ui/react'

import { formatDate, TimeBlock } from '../components'

const getSchedule = async ({ when, username }) =>
  axios({
    method: 'get',
    url: '/api/schedule',
    params: {
      date: format(when, 'yyyy-MM-dd'),
      username
    }
  })

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

export default function Schedule() {
  const router = useRouter()
  const [when, setWhen] = useState(() => new Date())
  const [data, { loading }, fetch] = useFetch(getSchedule, {
    lazy: true
  })

  const addDay = () => setWhen(prevState => addDays(prevState, 1))
  const removeDay = () => setWhen(prevState => subDays(prevState, 1))

  const refresh = () => fetch({ when, username: router.query.username })

  useEffect(() => {
    refresh()
  }, [when, router.query.username])

  return (
    <Container>
      <Header>
        <img src="/logo.svg" alt="Logo" style={{ width: '150px' }} />
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
        {data?.map(({ time, isBlocked }) => (
          <TimeBlock
            key={time}
            time={time}
            date={when}
            disabled={isBlocked}
            onSuccess={refresh}
          />
        ))}
      </SimpleGrid>
    </Container>
  )
}
