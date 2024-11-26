import { MongoClient } from "mongodb";

const connectionString = "mongodb+srv://ruiandrejesus:ruiandrejesus@clusterproject.xtxqv.mongodb.net/";

const client = new MongoClient(connectionString);

let conn;
try {
    conn = await client.connect();
} catch(e) {
    console.error(e);
}

// Database name
let db = conn.db("ADADProject-backend");

export default db;