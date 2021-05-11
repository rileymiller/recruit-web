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

type Coach = {
  id: string
  coachName: string
  needsReview: boolean
  prodRecordExists: boolean
  profilePictureURL?: string
  lastCheckedTime: Date
  school: string
  sport: string
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
          className="list-none py-1.5 text-gray-600 hover:text-gray-700"
        >
          <span
            className="font-normal text-white bg-green-400 hover:bg-green-500 px-1 py-0.5 rounded-md">
            {key}
          </span> {val.toString()}
        </li>
      )
    }
    return liS
  }
  return (
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      {/* <div style={styles.content}> */}
      <div className={'p-4'}>
        <div className={'mb-4'}>
          <h3>Example: SSR + data fetching with ID token</h3>
          <p>
            This page requires authentication. It will do a server-side redirect
            (307) to the login page if the auth cookies are not set.
          </p>
        </div>
        <section className={`flex flex-col items-center`}>
          {coaches.sort((a, b) => {
            if (a.school < b.school) {
              return -1
            }

            if (a.school > b.school) {
              return 1
            }

            if (a.school === b.school) {

              if (a.sport < b.sport) {
                return -1
              }

              if (a.sport > b.sport) {
                return 1
              }

              if (a.sport === b.sport) {
                if (a.coachName < b.coachName) {
                  return -1
                }

                if (a.coachName > b.coachName) {
                  return 1
                }
              }

            }
            return 0
          }).map(coach => {
            const { coachName, profilePictureURL, ...metadata } = coach

            const capitalizer: { [key: string]: string } = Object.keys(metadata).reduce((acc, key) => {
              const capKey = key.substr(0, 1).toUpperCase() + key.substr(1)
              return {
                ...acc, [capKey]: metadata[key]
              }
            }, {})
            const sortable = Object.keys(capitalizer)
              .sort().reduce((acc, key) => ({
                ...acc, [key]: capitalizer[key]
              }), {})
            const met = Object.entries(sortable)
            return (
              <div className={`flex flex-col items-center p-6 shadow-lg transition-shadow rounded-md w-full md:w-1/2 lg:1/3`} key={coach.id}>
                <h2 className="text-xl font-semibold text-gray-700">{coach.coachName}</h2>
                {profilePictureURL ?
                  (
                    <div
                      className={`h-60 w-52 relative m-4`}
                    >
                      <Image className={`rounded-lg`} src={profilePictureURL} layout="fill" objectFit="cover" quality={100} />
                    </div>
                  ) : (<div className="text-m font-normal mb-4">No Image</div>)
                }
                <ul
                  className="pl-0 self-start"
                >
                  {
                    getPropList(met as [string, string | boolean][])
                  }
                </ul>
              </div>
            )
          })}
        </section>
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
