import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function dbsleep (req, res) {
  try {
    const result = await prisma.dbsleep.create()
    if (result) {
      return res.status(201).json({ success: true, data: result })
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: error })
  }
}
