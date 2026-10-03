const mongoose = require('mongoose');
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

// const mongoURI = `mongodb://${dbUser}:${dbPass}@ac-cqwr0yc-shard-00-00.mtdufyt.mongodb.net:27017,ac-cqwr0yc-shard-00-01.mtdufyt.mongodb.net:27017,ac-cqwr0yc-shard-00-02.mtdufyt.mongodb.net:27017/?ssl=true&replicaSet=atlas-uw7psm-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

const mongoURI = `mongodb://${dbUser}:${dbPass}@ac-pptkfsi-shard-00-00.rfuklas.mongodb.net:27017,ac-pptkfsi-shard-00-01.rfuklas.mongodb.net:27017,ac-pptkfsi-shard-00-02.rfuklas.mongodb.net:27017/?ssl=true&replicaSet=atlas-dhb93b-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

// * database
async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Conectado ao MongoDB com sucesso');
    return true;
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    return false;
  }
}

// * exportando database
module.exports = connectDB;
