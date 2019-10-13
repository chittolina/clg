import * as mongoose from 'mongoose'

const DB_URI = process.env.DB_URI

const database = {
  start: (onError: Function) => {
    if (!DB_URI) {
      throw 'DB_URI was not provided'
    }

    mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    mongoose.connection.on('error', err => onError(err))
  },
}

export default database
