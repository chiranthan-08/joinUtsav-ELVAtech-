const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async (onConnect) => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/utsavmitra';
  const isRemote = uri.includes('mongodb+srv://') || (!uri.includes('localhost') && !uri.includes('127.0.0.1'));
  const timeoutMs = isRemote ? 10000 : 2500;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeoutMs,
    });
    isMongoConnected = true;
    console.log(`====================================================`);
    console.log(`🍃 [MongoDB Atlas Connected]: ${conn.connection.host}`);
    console.log(`📂 [Database Name]: ${conn.connection.name}`);
    console.log(`====================================================`);

    if (typeof onConnect === 'function') {
      try {
        await onConnect();
      } catch (syncErr) {
        console.error('[MongoDB Startup Sync Error]:', syncErr.message);
      }
    }
    return true;
  } catch (error) {
    isMongoConnected = false;
    if (isRemote) {
      console.error(`❌ [MongoDB Atlas Error]: Unable to connect (${error.message})`);
      console.log(`[Tip]: Please verify your MongoDB Atlas credentials and ensure Network Access has 0.0.0.0/0 (Allow from Anywhere) added.`);
      console.log(`[Notice]: Temporarily running on UtsavMitra local persistent storage engine.`);
    } else {
      console.log(`[Notice]: MongoDB local service not running or unreachable (${error.message}).`);
      console.log(`[Notice]: Activating UtsavMitra high-performance persistent storage engine.`);
    }
    return false;
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, getMongoStatus };
