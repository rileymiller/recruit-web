import React from 'react'
import '../styles/globals.css'
import initAuth from '../utils/initAuth'
import { AppProps } from 'next/app'
initAuth()

function MyApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />
}

export default MyApp
