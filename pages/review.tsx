import React from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import * as recruitApi from '../recruit-api'
import Header from '../components/Header'
import Image from 'next/image'
const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
}

type Coach = {
  id: string
  coachName: string
  needsReview: boolean
  prodRecordExists: boolean
  profilePictureURL?: string
  lastCheckedTime: Date
  school: string
  [key: string]: unknown
}
type ReviewType = {
  coaches: Coach[]
}

const ReviewView = ({ coaches }: ReviewType) => {
  const AuthUser = useAuthUser()

  const getPropList = (properties: [string, string | boolean][]) => {
    let liS = []
    let i = 0
    for (const [key, val] of properties) {
      i++
      liS.push(
        <li key={i}
          style={{
            listStyleType: 'none',
            padding: '0.25rem .5rem'
          }}
        >
          <span style={{
            fontWeight: 'bold'
          }}>
            {key}
          </span>: {val.toString()}
        </li>
      )
    }
    return liS
  }
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
        </div>
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {coaches.sort((a, b) => {
            if (a.school < b.school) {
              return -1
            }

            if (a.school > b.school) {
              return 1
            }

            if (a.school === b.school) {
              if (a.coachName < b.coachName) {
                return -1
              }

              if (a.coachName > b.coachName) {
                return 1
              }
            }
            return 0
          }).map(coach => {
            const { coachName, profilePictureURL, ...metadata } = coach

            const met = Object.entries(metadata)

            console.log(`metadata: ${metadata}`)
            return (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                transition: '0.3s',
                borderRadius: '.3rem',
                width: '50vw'
              }} key={coach.id}>
                <h2>{coach.coachName}</h2>
                {profilePictureURL ?
                  (

                    <div
                      style={{
                        height: '250px',
                        width: '200px',
                        position: 'relative'
                      }}
                    >
                      <Image src={profilePictureURL} layout="fill" objectFit="contain" quality={100} />
                    </div>
                  ) : (<div>No Image</div>)
                }
                <ul
                  style={{
                    paddingLeft: '0',
                    alignSelf: 'flex-start'
                  }}
                >
                  {
                    getPropList(met as [string, string | boolean][])
                  }
                </ul>
              </div>
            )
          })}
        </section>
        <p>{JSON.stringify(coaches)}</p>
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

export default withAuthUser<ReviewType>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ReviewView)
