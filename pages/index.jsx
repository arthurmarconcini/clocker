import Link from 'next/link'

import {
  Box,
  Input,
  Button,
  Container,
  Text,
  FormControl,
  FormLabel,
  FormHelperText
} from '@chakra-ui/react'

import { useFormik } from 'formik'
import * as yup from 'yup'

import { Logo } from '../components/Logo'
import firebase from '../config/firebase'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório')
})

export default function Home() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = useFormik({
    onSubmit: async (values, form) => {
      const auth = await getAuth()

      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(userCredential => {
          const user = userCredential.user
          console.log(user)
        })
        .catch(error => {
          const errorCode = error.code
          const errorMessage = error.message
        })
    },
    validationSchema,
    initialValues: {
      email: '',
      username: '',
      password: ''
    }
  })

  return (
    <div>
      <Container p={4} centerContent>
        <Logo />
        <Box p={4} mt={8}>
          <Text>Crie sua agenda compartilhada</Text>
        </Box>

        <Box>
          <FormControl id="email" p={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              size="lg"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && (
              <FormHelperText textColor="#e74c3c">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl id="password" p={4} isRequired>
            <FormLabel>Senha</FormLabel>
            <Input
              size="lg"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && (
              <FormHelperText textColor="#e74c3c">
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>

          <Box p={4}>
            <Button
              colorScheme="blue"
              width="100%"
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              Entrar
            </Button>
          </Box>
        </Box>
        <Link href="/signup">Ainda não tem uma conta? Cadastre-se</Link>
      </Container>
    </div>
  )
}