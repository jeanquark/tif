//////////////////////////////////
//								//
//		SAFE OPERATION ;-)		//
//								//
//////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//																																		// 																																	
//		Example import templates collection to templates.json file																		//
//		Command to run in cli																											//
//		firestore-export --accountCredentials ./.serviceAccountKey.json --backupFile ./database/templates.json --nodePath templates		//
//																																		//
//		More info																														//
//		https://www.npmjs.com/package/node-firestore-import-export																		//
//																																		//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










// const admin = require('firebase-admin');
// const fs = require('fs');

// const serviceAccount = require('./.serviceAccountKey.json');

// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// const schema = {
// 	menus: {}
// };

// const firestore2json = (db, schema, current) => {
// 	return Promise.all(
// 		Object.keys(schema).map(collection => {
// 			return db
// 				.collection(collection)
// 				.get()
// 				.then(data => {
// 					let promises = [];
// 					data.forEach(doc => {
// 						if (!current[collection]) current[collection] = { __type__: 'collection' };
// 						current[collection][doc.id] = doc.data();
// 						promises.push(
// 							firestore2json(
// 								db.collection(collection).doc(doc.id),
// 								schema[collection],
// 								current[collection][doc.id]
// 							)
// 						);
// 					});
// 					return Promise.all(promises);
// 				});
// 		})
// 	).then(() => current);
// };

// firestore2json(admin.firestore(), { ...schema }, {}).then(res =>
// 	fs.writeFileSync('./database/export.json', JSON.stringify(res, null, 2), 'utf8')
// ).catch((error) => {
// 	console.log('error: ', error)
// });