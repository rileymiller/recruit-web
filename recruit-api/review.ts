import { Coach } from "../pages/review"

export const REVIEW_URL = `${process.env.RECRUIT_API_BASE_URL}${process.env.RECRUIT_API_REVIEW_ENDPOINT}`

export const GET_COACH_URL = `${process.env.NEXT_PUBLIC_RECRUIT_API_PROD_URL}${process.env.NEXT_PUBLIC_RECRUIT_API_COACH_ENDPOINT}`
export const getCoach = async (coachID: string) => {
  console.log(`GET_COACH_URL: ${GET_COACH_URL}`)
  const rawData = await fetch(`${GET_COACH_URL}/${coachID}`)

  const coach: Coach = await rawData.json()
  return coach
}
