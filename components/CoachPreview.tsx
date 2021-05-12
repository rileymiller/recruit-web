import React from 'react'

import { Coach } from '../pages/review'

type CoachPreviewProps = {
  coach?: Coach
  label?: string
  loading?: boolean
  adminKeys?: string[]
  diffKeys?: string[]
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

const FieldHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="text-gray-700 self-start font-semibold pl-2 pb-2 pt-2 underline text-xl">
    {children}
  </div>
)

const getAdminList = (properties: [string, string | boolean][]) => {
  let liS = []
  let i = 0

  for (const [key, val] of properties) {
    i++
    liS.push(
      <li key={`${i}-${key}-${val}`}
        className="list-none text-gray-600 hover:text-gray-700"
      >
        <span
          className={`font-normal capitalize px-1 py-0.5`}>
          {key}:
        </span> {val.toString()}
      </li>
    )
  }
  return liS
}

const getPropList = (properties: [string, string | boolean][], diffKeys?: string[]) => {
  let liS = []
  let i = 0

  const isDiffKey = (key: string) => diffKeys?.includes(key)

  for (const [key, val] of properties) {
    i++
    liS.push(
      <li key={`${i}-${key}-${val}`}
        className="list-none py-1.5 text-gray-600 hover:text-gray-700"
      >
        <span
          className={`font-normal capitalize text-white ${isDiffKey(key) ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-green-400 hover:bg-green-500'} px-1 py-0.5 rounded-md`}>
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

    const admin = Object.keys(metadata).reduce((acc, key) => {
      return props.adminKeys?.includes(key) ? {
        ...acc, [key]: metadata[key]
      } : acc
    }, {})

    const prunedMetadata = Object.keys(metadata).reduce((acc, key) => {
      return !props.adminKeys?.includes(key) ? {
        ...acc, [key]: metadata[key]
      } : acc
    }, {})

    const met = Object.entries(prunedMetadata)
    const adminEntries = Object.entries(admin)

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
        <FieldHeading>
          Admin
        </FieldHeading>
        <ul
          className="pl-0 self-start"
        >
          {getAdminList(adminEntries as [string, string | boolean][])}
        </ul>
        <FieldHeading>
          Metadata
        </FieldHeading>
        <ul
          className="pl-0 self-start"
        >
          {
            getPropList(met as [string, string | boolean][], props.diffKeys)
          }
        </ul>
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