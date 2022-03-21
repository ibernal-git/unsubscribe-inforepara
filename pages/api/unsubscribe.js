import isValidCaptcha from '../../recaptcha'
// import dbConnect, { Unsubscribed } from '../../utils/db'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function unsubscribe (req, res) {
  console.log(process.env.DATABASE_URL)
  if (req.headers.host !== process.env.APP_HOST) {
    return res.status(403).json({ success: false, error: 'Forbidden' })
  }
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
    const emailInDB = await prisma.mailing.findFirst({
      where: {
        email: email
      }
    })
    if (!emailInDB) {
      const result = await prisma.mailing.create({
        data: {
          email: email,
          unsubscribed: true
        }
      })
      console.log(result)
      return res.status(201).json({ success: true, isAlreadyUnsuscribed: false, data: result })
    }
    return res.status(201).json({ success: true, isAlreadyUnsuscribed: true, data: emailInDB })
  } catch (error) {
    console.log(error)
    console.log(process.env.DATABASE_URL)
    return res.status(400).json({ success: false, error: error, ip: req.headers['x-forwarded-for'] })
  }
}
