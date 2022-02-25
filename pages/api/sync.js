import dbConnect, { Unsubscribed } from '../../utils/db'
import { query, db } from '../../utils/mysql'

export default async function syncbbdd (req, res) {
  await dbConnect()
  try {
    const mongoData = await Unsubscribed.find({})

    const mysqlData = await query(`
    SELECT *
    FROM mailing
  `)

    const mysqlEmails = mysqlData.map((user) => {
      return user.email
    })
    const newEmails = mongoData
      .map((data) => {
        if (mysqlEmails.includes(data.email)) return false
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
