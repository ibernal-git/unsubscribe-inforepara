import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import validator from 'validator'
import { useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { CAPTCHA_CONFIG } from '../utils/constants'

export default function Home () {
  const recaptchaRef = useRef(null)
  const [notification, setNotification] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const captchaToken = await recaptchaRef.current.executeAsync()
    recaptchaRef.current.reset()

    const email = event.target.email.value

    if (!captchaToken) {
      setNotification('Verifica que no eres un robot 😊')
      return
    }

    if (validator.isEmail(email)) {
      setNotification('')
      try {
        const response = await fetch('/api/unsubscribe', {
          method: 'POST',
          body: JSON.stringify({ email: event.target.email.value, captchaToken: captchaToken }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.status !== 201) {
          console.log(response)
          const { error } = await response.json()
          console.log(error)
          setNotification(error)
          throw new Error(error)
        } else {
          const { isAlreadyUnsuscribed, data } = await response.json()
          console.log({ isAlreadyUnsuscribed, data })
          isAlreadyUnsuscribed
            ? setNotification(`El email ${data?.email} ya está dado de baja de la lista de correo`)
            : setNotification('Suscripción correctamente cancelada')
        }
      } catch (e) {
        console.error(e)
      }
    } else {
      setNotification('Email incorrecto')
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Desuscribete de nuestra mailing list</title>
        <meta name="description" content="Página que permite desuscribirse de nuestra mailing list" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <Image src='https://inforepara.es/wp-content/uploads/2019/07/logo_high_dpi.png' width='298' height='81' alt='InfoRepara'/>
        <h1 className={styles.title}>
          Cancela la suscripción de la lista de correo
        </h1>
        <form onSubmit={handleSubmit}>
          <input name="email" type="text" placeholder="tuemail@email.com"></input>
          <button>Enviar</button>
         <ReCAPTCHA
             ref={recaptchaRef}
            sitekey={CAPTCHA_CONFIG.CAPTCHA_SITE_SECRET}
            size="invisible"
         />
        </form>
        {notification ? <p>{notification}</p> : null}

      </main>

      <footer className={styles.footer}>
      <span>Todos los derechos reservados ©️ 2022 - </span>
        <a
          href="https://inforepara.es"
          target="_blank"
          rel="noopener noreferrer"
        >
         Inforepara Servicios Informáticos Profesionales
        </a>
      </footer>
    </div>
  )
}
