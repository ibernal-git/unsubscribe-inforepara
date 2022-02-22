import isValidCaptcha from '../../recaptcha'
import { query } from '../../utils/db'

export default async function unsuscribe (req, res) {
  if (req.headers.host !== process.env.APP_HOST) {
    return res.status(403).json({ error: 'Forbidden' })
  } else {
    const { email, captchaToken } = JSON.parse(req.body)
    try {
      let validCaptcha = await isValidCaptcha(captchaToken)
      validCaptcha = true

      if (!email) {
        return res
          .status(400)
          .json({ error: '`email` are required' })
      }

      if (!validCaptcha) {
        return res
          .status(400)
          .json({ error: 'You are a robot' })
      }

      const results = await query(
      `
      INSERT INTO mailing (email)
      VALUES (?)
      `,
      [email]
      )
      console.log(results)

      return res.json({ results: 'ok' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ error: e })
    }
  }
}
