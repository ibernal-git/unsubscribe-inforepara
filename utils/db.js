import mongoose from 'mongoose'

const DATABASE_URI = 'mongodb+srv://inforepara:JwYndn4PDHtdEsHQ@cluster0.gtirb.mongodb.net/mailing-list?retryWrites=true&w=majority'
console.log(process.env.MONGODB_URI)

export default async function connect () {
  const conn = await mongoose
    .connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err))

  console.log('Mongoose connection established')

  const MailingSchema = new mongoose.Schema({
    email: String,
    unsuscribed: Boolean
  })

  const Mailing = mongoose.model('Mailing', MailingSchema)

  return { conn, Mailing }
}
