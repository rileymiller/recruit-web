import React, { useState } from 'react'

import { Coach } from '../pages/review'

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

const isDiffKey = (key: string, diffKeys: string[]) => diffKeys.includes(key)

const MetadataListItem = ({ label, value, checked, isDifferent, onChange }:
  { label: string, value: string | boolean, checked: boolean, isDifferent: boolean, onChange: () => void }) => {

  return (
    <li key={`${label}-${value}`}
      className="list-none py-1.5 text-gray-600 hover:text-gray-700"
    >
      <input key={label} type="checkbox" value={value.toString()} onChange={onChange} checked={checked} />
      <span
        className={`ml-4 font-normal capitalize text-white ${isDifferent ? 'bg-yellow-400' : 'bg-green-400'} px-1 py-0.5 rounded-md`}>
        {label}
      </span> {value.toString()}
    </li>
  )
}

const initMetadataProperties = (props: [string, string | boolean][]) => props.map(att => ({
  key: att[0],
  value: att[1],
  checked: true
}))

const MetadataWizard = ({ properties, diffKeys, onUpdate }: {
  properties: [string, string | boolean][],
  diffKeys?: string[],
  onUpdate?: (keys: string[]) => void
}) => {
  const [selectedProperties, setSelectedProperties] = useState(initMetadataProperties(properties) ?? [])

  const handleClick = (prop: {
    key: string
    value: string | boolean
    checked: boolean
  }) => {
    const modProps = selectedProperties.map(iter => {
      if (iter.key.toString() === prop.key.toString()) {
        return {
          ...prop,
          checked: !prop.checked
        }
      }
      return iter
    })

    setSelectedProperties(modProps)
  }

  return (
    <>
      {selectedProperties.map((prop, i) => {
        return (
          <MetadataListItem
            key={`${i}-${prop.key}`}
            label={prop.key}
            value={prop.value}
            checked={prop.checked}
            isDifferent={(diffKeys && isDiffKey(prop.key, diffKeys)) ?? false}
            onChange={() => handleClick(prop)}
          />
        )
      })}
      <button onClick={() => {
        console.log(`click it ${JSON.stringify(selectedProperties)}`)
        if (onUpdate) {
          onUpdate(selectedProperties.filter(prop => prop.checked).map(prop => prop.key) ?? [])
        }
      }} >
        Submit
      </button>
    </>
  )
}


type BasicMetadataItem = {
  key: string
  value: string
}

type ScrapeMetadataItem = BasicMetadataItem & {
  checked: boolean
  onChange: () => void
}

type CoachPreviewProps = {
  coach?: Coach
  label?: string
  loading?: boolean
  adminKeys?: string[]
  diffKeys?: string[]
  onUpdate?: (keys: string[]) => void
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

    const metadataEntries = Object.entries(prunedMetadata)
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
          {metadataEntries ? <MetadataWizard
            properties={metadataEntries as [string, string | boolean][]}
            diffKeys={props.diffKeys}
            onUpdate={props.onUpdate}
          /> : null
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