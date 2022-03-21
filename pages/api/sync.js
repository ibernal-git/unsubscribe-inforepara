import dbConnect from '../../utils/db'
import { query, db } from '../../utils/mysql'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const inforepara = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_INFOREPARA } } })

export default async function syncbbdd (req, res) {
  await dbConnect()
  try {
    const data = await prisma.mailing.findMany({})
    const lol = await inforepara.mailing.findMany({})
    console.log(lol)

    const inforeparaDb = await query(`
    SELECT *
    FROM mailing
  `)

    const inforeparaDbEmails = lol.map((user) => {
      return user.email
    })
    const newEmails = data
      .map((data) => {
        if (inforeparaDbEmails.includes(data.email)) return false
        return data.email
      })
      .filter(email => {
        return email !== false
      })
    // console.table(newEmails)

    const promises = newEmails.map((email) => {
      return new Promise((resolve, reject) => {
        db
          .query('INSERT INTO mailing (email) VALUES (?)', [email])
          .then(results => {
            return resolve(results)
          }).catch(err => {
            return reject(err)
          })
      })
    })

    return Promise.allSettled(promises).then(() => {
      console.log(promises)
      db.end()
      return res.end(JSON.stringify({ success: true }))
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, error: error })
  }
}
