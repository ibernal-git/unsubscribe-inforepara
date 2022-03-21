import isValidCaptcha from '../../recaptcha'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function unsubscribe (req, res) {
  if (req.headers.host !== process.env.APP_HOST) {
    return res.status(403).json({ success: false, error: 'Forbidden' })
  }
  const { email, captchaToken } = req.body

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
      return res.status(201).json({ success: true, isAlreadyUnsuscribed: false, data: result })
    }
    return res.status(201).json({ success: true, isAlreadyUnsuscribed: true, data: emailInDB })
  } catch (error) {
    return res.status(400).json({ success: false, error: error })
  }
}
