import { setAuthCookies } from 'next-firebase-auth'
import initAuth from '../../utils/initAuth'
import { NextApiRequest, NextApiResponse } from 'next'


initAuth()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await setAuthCookies(req, res)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return res.status(500).json({ error: `Unexpected error. ${e}` })
  }
  return res.status(200).json({ status: true })
}

export default handler
