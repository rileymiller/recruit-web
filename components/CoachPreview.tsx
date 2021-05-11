import React from 'react'

import { Coach } from '../pages/review'

type CoachPreviewProps = {
  coach: Coach
}
import Image from 'next/image'

export const CoachPreview = (props: CoachPreviewProps) => {
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
    <div className={`flex flex-col items-center p-6 shadow-lg transition-shadow rounded-md w-full md:w-1/2 lg:w-1/3`} key={props.coach.id}>
      <h2 className="text-xl font-semibold text-gray-700">{props.coach.coachName}</h2>
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
}