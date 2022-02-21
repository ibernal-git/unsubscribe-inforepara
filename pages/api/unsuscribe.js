import { query } from '../../utils/db'

export default async function unsuscribe (req, res) {
  if (req.headers.host !== process.env.APP_HOST) {
    return res.status(403).json({ error: 'Forbidden' })
  } else {
    console.log(req.body)
    const { email } = JSON.parse(req.body)
    try {
      if (!email) {
        return res
          .status(400)
          .json({ message: '`email` are required' })
      }

      const results = await query(
      `
      INSERT INTO mailing (email)
      VALUES (?)
      `,
      [email]
      )

      return res.json(results)
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}
