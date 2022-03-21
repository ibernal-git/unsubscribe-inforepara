import { query, db } from '../../utils/mysql'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function syncbbdd (req, res) {
  try {
    const data = await prisma.mailing.findMany({})

    const inforeparaDb = await query(`
    SELECT *
    FROM mailing
  `)

    const inforeparaDbEmails = inforeparaDb.map((user) => {
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
    console.table(newEmails)

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
