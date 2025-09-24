import { mongoose } from 'mongoose'
import config from './config.js'

const { MONGODB_URI } = config

export class DBConnector {
  connect() {
    console.log('connecting to', MONGODB_URI)
    mongoose.connect(MONGODB_URI, { dbName: "tiendaSol" })
      .then(() => {
        console.log('connected to MongoDB')
      })
      .catch((error) => {
        console.error('error connecting to MongoDB:', error.message)
      })
  }
}