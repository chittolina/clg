import * as mongoose from 'mongoose'

const DB_URI = process.env.DB_URI

const database = {
  start: async (onError: Function) => {
    if (!DB_URI) {
      throw 'DB_URI was not provided'
    }

    try {
      mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
    } catch (err) {
      onError(err)
    }

    mongoose.connection.on('error', err => onError(err))
  },

  stop: () => {
    mongoose.connection.close()
  },
}

export default database
