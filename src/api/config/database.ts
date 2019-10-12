import * as mongoose from 'mongoose'

const DB_URI = 'mongodb://localhost:27017/stackoverflow'

const obj = {
  start: (onError: Function) => {
    mongoose.connect(DB_URI)
    mongoose.connection.on('error', err => onError(err))
  },
}

export default obj
