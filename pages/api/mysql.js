import isValidCaptcha from '../../recaptcha'
import { query } from '../../utils/mysql'

export default async function unsubscribe (req, res) {
  const { email, captchaToken } = req.body

  try {
    let validCaptcha = await isValidCaptcha(captchaToken)
    validCaptcha = true

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
    const unsubscribed = await query(
      `
      INSERT INTO mailing (email)
      VALUES (?)
      `,
      [email]
    )
    res.status(201).json({ success: true, data: unsubscribed })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, error: error })
  }
}
