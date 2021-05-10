import React from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import * as recruitApi from '../recruit-api'
import Header from '../components/Header'

const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
}

type DemoType = {
  coaches: Record<string, unknown>[]
}

const Demo = ({ coaches }: DemoType) => {
  const AuthUser = useAuthUser()

  return (
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          <h3>Example: SSR + data fetching with ID token</h3>
          <p>
            This page requires authentication. It will do a server-side redirect
            (307) to the login page if the auth cookies are not set.
          </p>
          <p>{JSON.stringify(coaches)}</p>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  const res = await fetch(recruitApi.REVIEW_URL)
  const recruitData = await res.json()

  if (!res.ok) {
    throw new Error(
      `Data fetching failed with status ${res.status}: ${JSON.stringify(
        recruitData
      )}`
    )
  }
  return {
    props: {
      coaches: recruitData.coaches,
    },
  }
})

export default withAuthUser<DemoType>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Demo)
