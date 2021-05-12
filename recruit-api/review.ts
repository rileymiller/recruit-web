import { Coach } from "../pages/review"

export const REVIEW_URL = `${process.env.RECRUIT_API_BASE_URL}${process.env.RECRUIT_API_REVIEW_ENDPOINT}`

// export const GET_COACH_URL = `${process.env.RECRUIT_API_BASE_URL}/coach/`
export const GET_COACH_URL = ` https://ycp1jo7nx7.execute-api.us-east-1.amazonaws.com/Prod/coach`
export const getCoach = async (coachID: string) => {
  const rawData = await fetch(`${GET_COACH_URL}/${coachID}`)

  const coach: Coach = await rawData.json()
  return coach
}