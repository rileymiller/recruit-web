import React from 'react'

import { Coach } from '../pages/review'

type CoachPreviewProps = {
  coach?: Coach
  label?: string
  loading?: boolean
}
import Image from 'next/image'

const CoachCard = ({ children }: { children: React.ReactNode }) => (
  <div className={`flex flex-col flex-1 items-center p-6 shadow-lg transition-shadow rounded-md`}>
    {children}
  </div>
)

const CoachLabel = ({ children, disabled }: { children: React.ReactNode, disabled?: boolean }) => (
  <h2 className={`text-3xl font-semibold ${disabled ? 'text-gray-400' : 'text-green-400'}`}>
    {children}
  </h2>
)

const CoachName = ({ children, disabled }: { children: React.ReactNode, disabled?: boolean }) => (
  <h2 className={`text-2xl font-semibold ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
    {children}
  </h2>
)

const CoachImage = ({ profilePictureURL }: { profilePictureURL?: string }) => (
  <div
    className={`h-60 w-52 relative m-4`}
  >
    {profilePictureURL ?
      <Image className={`rounded-lg`} src={profilePictureURL} layout="fill" objectFit="cover" quality={100} />
      : <Image className={`rounded-lg`} src={'/unknown-profile.png'} layout="fill" objectFit="cover" quality={100} />
    }
  </div>
)
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

export const CoachPreview = (props: CoachPreviewProps) => {
  if (props.coach) {

    const { coachName, profilePictureURL, ...metadata } = props.coach
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
      <CoachCard>
        {props.label ?
          <CoachLabel>
            {props.label}
          </CoachLabel> : null}
        <CoachName>
          {props.coach.coachName}
        </CoachName>
        <CoachImage profilePictureURL={props.coach.profilePictureURL} />
        <ul
          className="pl-0 self-start"
        >
          {
            getPropList(met as [string, string | boolean][])
          }
        </ul>
        {/* </div> */}
      </CoachCard>
    )
  } else if (props.loading) {
    return (
      <CoachCard>
        <CoachLabel>
          Loading Label
        </CoachLabel>
        <CoachName>
          Loading
        </CoachName>
        <CoachImage />
        <ul
          className="pl-0 self-start"
        >
          <li>loading</li>
          <li>loading</li>
          <li>loading</li>
        </ul>
      </CoachCard>
    )
  } else {
    return (
      <CoachCard>
        <CoachLabel disabled>
          Does Not Exist
        </CoachLabel>
        <CoachName disabled>
          Does Not Exist
        </CoachName>
        <CoachImage />
      </CoachCard>
    )
  }
}