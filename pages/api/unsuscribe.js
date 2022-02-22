import isValidCaptcha from '../../recaptcha'
import { query } from '../../utils/db'

export default async function unsuscribe (req, res) {
  if (req.headers.host !== process.env.APP_HOST) {
    return res.status(403).json({ error: 'Forbidden' })
  } else {
    console.log(req.body)
    const { email, captchaToken } = JSON.parse(req.body)
    console.log(email, captchaToken)
    try {
      const validCaptcha = await isValidCaptcha(captchaToken)

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

      return res.json({ message: 'Suscripción correctamente cancelada', results: results })
    } catch (e) {
      res.status(500).json({ error: e })
    }
  }
}
