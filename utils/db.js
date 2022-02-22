import mongoose from 'mongoose'

export default async function connect () {
  const conn = await mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err))

  console.log('Mongoose connection established')

  const MailingSchema = new mongoose.Schema({
    email: String,
    unsuscribed: Boolean
  })

  const Mailing = mongoose.model('Mailing', MailingSchema)

  return { conn, Mailing }
}
