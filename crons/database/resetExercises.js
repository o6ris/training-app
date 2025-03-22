const { ObjectId } = require('mongodb');
const fs = require('fs');
const { MongoClient, BSON, AuthMechanism } = require('mongodb');
require('dotenv').config({ path: './.env.local' }); // Use relative path if necessary


async function main() {
	const { EJSON } = BSON;
	const opts = {
		tls: true,
		family: 4,
		appName: 'training_db',
		auth: {
			username: process.env.USER_NAME,
			password: process.env.PASSWORD,
		},
		authMechanism: AuthMechanism.MONGODB_DEFAULT,
	};
	const uri = process.env.MONGODB_URI

	const client = new MongoClient(uri, opts);
	await client.connect();
	const collectionsToDelete = [
		{ collection: 'exercises', path: './crons/database/jsons/exercises.json' },

	];
	const database = client.db('training_db');
	for (const element of collectionsToDelete) {
		try {
			const collection = database.collection(element.collection);
			await collection.drop();
			const data = fs.readFileSync(element.path, 'utf8');
			const lines = data.split('\n').map((line) => line.trim());
      
			const docs = [];
			for (const line of lines) {
        let doc = EJSON.parse(line);

        // If it's the 'exercises' collection, convert muscle field string IDs to ObjectId
        if (element.collection === 'exercises') {
          doc = doc.map(exercise => {
            // Convert muscle array from strings to ObjectId
            exercise.muscle = exercise.muscle.map(id => new ObjectId(id)); 
            return exercise;
          });
        }
        docs.push(...doc);
      }
			await collection.insertMany(docs);
		} catch (e) {
			console.error(`Error inserting ${element.collection} data:`, e);
		}
	}
	await client.close();
}

main();
