import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Mocked behavior: if MONGODB_URI is missing, don't crash, just log warning
if (!MONGODB_URI) {
  console.warn("MONGODB_URI not defined, using mock connection");
}

// Caching connection globally to avoid creating multiple connections on dev recompilations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    return null;
  }
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch(err => {
      console.warn('MongoDB not connected — some features may not work');
      cached.promise = null;
      throw err;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
export { dbConnect };
