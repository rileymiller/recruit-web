import React, { useEffect, useState } from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import * as recruitApi from '../recruit-api'
import Header from '../components/Header'
import { CoachPreview } from '../components/CoachPreview'

export type Coach = {
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
export type ReviewType = {
  coaches: Coach[]
}

export type ProdCoachPreviewProps = {
  scrapeCoach: Coach
}

const ProdCoachPreview = (props: ProdCoachPreviewProps) => {
  const [coach, setCoach] = useState<Coach | undefined>(undefined)
  useEffect(() => {
    const fetchCoach = async () => {
      const coach = await recruitApi.getCoach(props.scrapeCoach.id)
      setCoach(coach)
    }
    if (props.scrapeCoach?.prodRecordExists) {
      fetchCoach()
    }
  }, [])

  return (
    <CoachPreview coach={coach} label={`Prod`} loading={props.scrapeCoach.prodRecordExists && coach === undefined} />
  )
}

const ReviewView = ({ coaches }: ReviewType) => {
  const AuthUser = useAuthUser()

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
            return (
              <div className="flex flex-row w-full p-12">

                <CoachPreview key={`scrape-${coach.id}`} coach={coach} label={`Scrape`} />
                {
                  <ProdCoachPreview key={`prod-preview-${coach.id}`} scrapeCoach={coach} />
                }
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
