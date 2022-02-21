import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import validator from 'validator'
import { useState } from 'react'

export default function Home () {
  const [notification, setNotification] = useState()
  const handleSubmit = (event) => {
    event.preventDefault()
    const email = event.target.email.value
    if (validator.isEmail(email)) {
      setNotification('')
      fetch('http://localhost:3000/api/unsuscribe', {
        method: 'POST',
        body: JSON.stringify({ email: event.target.email.value })
      })
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
        <Image src='https://inforepara.es/email/cctv/logo-email@2x.png' width='298' height='81' alt='InfoRepara'/>
        <h1 className={styles.title}>
          Cancela la suscripción de la lista de correo
        </h1>
        <form onSubmit={handleSubmit}>
          <input name="email" type="text" placeholder="prueba@prueba.com"></input>
          <button>Enviar</button>
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
