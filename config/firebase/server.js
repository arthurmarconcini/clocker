import admin from 'firebase-admin'

const app = firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp({
      credential: admin.credential.cert({
        type: 'service_account',
        client_id: '113001540119620318561',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        client_cert: process.env.CLIENT_CERT
      })
    })

export default admin
