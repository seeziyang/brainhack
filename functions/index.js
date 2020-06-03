const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendLetInNotif = functions.database
  .ref('/stores/{storeId}/queue/inQueue/{queueNo}/status')
  .onWrite((change, context) => {
    // Exit when the data is deleted.
    if (!change.after.exists()) {
      return null;
    }

    let status = change.after.val();
    if (status !== 'letIn') {
      return null;
    }

    return change.after.ref.parent.parent.parent.parent
      .once('value')
      .then(snapshot => {
        let store = snapshot.val();
        console.log(store);
        let storeName = store.storeInfo.locName;
        let fcmToken = store.queue.inQueue[context.params.queueNo].fcmToken;

        let payload = {
          notification: {
            title: `It is your turn at ${storeName}`,
            body: 'Please head there now!',
          },
          data: {
            storeName: storeName,
            storeId: context.params.storeId,
            msg: `It is your turn at ${storeName}, please head there now!`,
          },
        };

        let options = {
          priority: 'high',
        };

        return admin.messaging().sendToDevice(fcmToken, payload, options);
      });
  });
