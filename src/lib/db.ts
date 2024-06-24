import { MongoClient, Db } from "mongodb";

const uri: string = process.env.MONGODB_URI!;
const options: object = {};

let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

export async function dbConnect() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local");
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so we can re-use the client across module reloads caused by HMR (Hot Module Replacement).
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(uri, options);
      (global as any)._mongoClientPromise = client
        .connect()
        .then((client) => {
          console.log("Connected to MongoDB in development mode");
          return client;
        })
        .catch((err) => {
          console.error("Failed to connect to MongoDB", err);
          throw err;
        });
    }
    // clientPromise = (global as any)._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    client
      .connect()
      .then((client) => {
        console.log("Connected to MongoDB in production mode");
        return client;
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
        throw err;
      });
  }
}

