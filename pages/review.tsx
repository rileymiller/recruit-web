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
  lastCheckedTime: string
  school: string
  sport: string
  runID: string
  [key: string]: unknown
}
export type ReviewType = {
  coaches: Coach[]
}

export type ProdCoachPreviewProps = {
  scrapeCoach: Coach
}

type CoachMetadata = {
  [key: string]: unknown
}

const diffMetadata = (scrapeMetadata: CoachMetadata, prodMetadata: CoachMetadata) => {
  let modifiedKeys: string[] = []

  Object.keys(scrapeMetadata).forEach(key => {
    if (!prodMetadata.hasOwnProperty(key) || scrapeMetadata[key] !== prodMetadata[key]) {
      modifiedKeys.push(key)
    }
  })

  return modifiedKeys
}

export type ScrapeAdmin = Pick<Coach, 'id' | 'profilePictureURL' | 'runID' | 'lastCheckedTime' | 'needsReview' | 'prodRecordExists'>

const getScrapeMetadata = (coach: Coach) => {
  const {
    id,
    profilePictureURL,
    runID,
    lastCheckedTime,
    needsReview,
    prodRecordExists,
    ...scrapeMetadata } = coach

  const scrapeAdmin: ScrapeAdmin = {
    id,
    profilePictureURL,
    runID,
    lastCheckedTime,
    needsReview,
    prodRecordExists,
  }

  return { scrapeAdmin, scrapeMetadata }
}

export type ProdAdmin = Pick<Coach, 'id' | 'profilePictureURL' | 'runID' | 'lastCheckedTime'> & {
  Twitter: string
}

const getProdMetadata = (coach: Coach) => {
  const {
    id,
    profilePictureURL,
    runID,
    lastCheckedTime,
    ['Twitter']: Twitter,
    ...prodMetadata } = coach

  const prodAdmin = {
    id,
    profilePictureURL,
    runID,
    lastCheckedTime,
    Twitter
  }
  return { prodAdmin, prodMetadata }
}

const CoachReviewPanel = ({ coach }: { coach: Coach }) => {
  const [prodCoach, setProdCoach] = useState<Coach | undefined>(undefined)
  const [diffKeys, setDiffKeys] = useState<string[] | undefined>(undefined)
  const [prodAdminKeys, setProdAdminKeys] = useState<string[] | undefined>(undefined)

  const { scrapeAdmin, scrapeMetadata } = getScrapeMetadata(coach)

  useEffect(() => {
    const fetchCoach = async () => {
      const prodCoachResponse = await recruitApi.getCoach(coach.id)
      setProdCoach(prodCoachResponse)


      const { prodAdmin, prodMetadata } = getProdMetadata(prodCoachResponse)

      const metadataDiffKeys = diffMetadata(scrapeMetadata, prodMetadata)

      setDiffKeys(metadataDiffKeys)
      setProdAdminKeys(Object.keys(prodAdmin))
    }
    if (coach.prodRecordExists) {
      fetchCoach()
    }
  }, [])

  return (
    <div className="flex flex-row w-full p-12">
      <CoachPreview coach={coach} label={`Scrape`} diffKeys={diffKeys} adminKeys={Object.keys(scrapeAdmin)} />
      <CoachPreview coach={prodCoach} label={`Prod`} loading={coach.prodRecordExists && prodCoach === undefined} adminKeys={prodAdminKeys} />
    </div>
  )
}

const ReviewView = ({ coaches }: ReviewType) => {
  const AuthUser = useAuthUser()

  return (
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
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
              <CoachReviewPanel coach={coach} />
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
