import Head from 'next/head'
import Crossword from '../components/crossword'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Crosswordle</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Crosswordle
        </h1>
        <Crossword></Crossword>
      </main>

      <footer className={styles.footer}>
        Nate Miller
      </footer>
    </div>
  )
}
