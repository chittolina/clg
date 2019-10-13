import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  displayName: string
  lastAccessDate: string
  location: string
  profileImage?: string
}

const UserSchema: Schema = new Schema({
  displayName: { type: String, required: true },
  lastAccessDate: { type: Date, required: true },
  location: { type: String, required: true },
  profileImage: { type: String, required: false },
})

export default mongoose.model<IUser>('User', UserSchema)
