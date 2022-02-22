import isValidCaptcha from '../../recaptcha'
import dbConnect, { Unsubscribed } from '../../utils/db'

export default async function unsubscribe (req, res) {
  if (req.headers.host !== process.env.APP_HOST) {
    return res.status(403).json({ success: false, error: 'Forbidden' })
  }
  const { email, captchaToken } = req.body
  await dbConnect()
  try {
    const validCaptcha = await isValidCaptcha(captchaToken)

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: 'email are required' })
    }

    if (!validCaptcha) {
      return res
        .status(400)
        .json({ success: false, error: 'You are a robot' })
    }
    const unsubscribed = await Unsubscribed.create({ ...req.body, unsubscribed: true })
    res.status(201).json({ success: true, data: unsubscribed })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, error: error })
  }
}
