import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Board from '../components/board'

const Home: NextPage = () => {
  return (
    <Board />
  )
}

export default Home
