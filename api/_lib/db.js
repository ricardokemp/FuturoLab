// ==========================================
// CONEXÃO COM MONGODB ATLAS
// ==========================================

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/futurolab';
const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

let db = null;

async function connectDB() {
    if (db) return db;
    
    try {
        await client.connect();
        db = client.db('futurolab');
        console.log('✅ MongoDB conectado com sucesso!');
        return db;
    } catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error);
        throw error;
    }
}

async function getDB() {
    if (!db) {
        await connectDB();
    }
    return db;
}

module.exports = { connectDB, getDB };
