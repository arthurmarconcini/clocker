import { Button } from '@chakra-ui/button'
import { getAuth } from '@firebase/auth'

export const Agenda = () => {
  const logout = () => getAuth().signOut()
  return (
    <div>
      <Button onClick={logout}>Sair</Button>
    </div>
  )
}
