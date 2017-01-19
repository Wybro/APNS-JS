//  App.js
//  APNS-Firebase node.js server starter project
//
//  Created by Connor Wybranowski on 1/18/17.
//  Copyright © 2017 com.Wybro. All rights reserved.

// Insert specific info in areas indicated with SETUP to configure your project.

var firebase = require('firebase');
var apn = require('apn');

// SETUP -- Initialize Firebase with info from your specific project
var config = {
  apiKey: "INSERT",
  authDomain: "INSERT",
  databaseURL: "INSERT",
  storageBucket: "INSERT",
  messagingSenderId: "INSERT"
};
firebase.initializeApp(config);

// SETUP -- Set up apn with the APNs Auth Key
var apnProvider = new apn.Provider({
  token: {
    key: 'INSERT', // Path to the key p8 file
    keyId: 'INSERT', // The Key ID of the p8 file (available at https://developer.apple.com/account/ios/certificate/key)
    teamId: 'INSERT', // The Team ID of your Apple Developer Account (available at https://developer.apple.com/account/#/membership/)
  },
  production: true // Set to true if sending a notification to a production iOS app
});

// Get a reference to the database service
var database = firebase.database();

// SETUP -- Configure listeners for specific path / action
function startListeners() {
  console.log('Starting listeners');

  database.ref('/notifications').on('child_added', function(snapshot) {
    // console.log('postSnap:' + snapshot.key + ' fromId:' + snapshot.val().fromId + ' toId:' + snapshot.val().toId + ' deviceToken:' + snapshot.val().deviceToken + ' message:' + snapshot.val().message)
    // Send notification
    sendNotification(snapshot.val().deviceToken, snapshot.val().message, snapshot.key)
  });
}

// SETUP -- Configure notification details
function sendNotification(deviceToken, message, notificationId) {
  var notification = new apn.Notification();

  // Specify your iOS app's Bundle ID (accessible within the project editor)
  notification.topic = 'INSERT';
  // Set expiration to 1 hour from now (in case device is offline)
  notification.expiry = Math.floor(Date.now() / 1000) + 3600;
  // Play ping.aiff sound when the notification is received
  notification.sound = 'ping.aiff';
  // Display the following message (the actual notification text, supports emoji)
  notification.alert = message;

  apnProvider.send(notification, deviceToken).then(function(result) {
    // Check the result for any failed devices
    // console.log(result);

    if (result.failed.length == 0) {
      console.log('Sent notification');
    } else {
      console.log(result.failed)
      console.log('Resetting APN provider & trying again')
      // Reset APN provider
      apnProvider = new apn.Provider({
        token: {
          key: 'INSERT', // Path to the key p8 file
          keyId: 'INSERT', // The Key ID of the p8 file (available at https://developer.apple.com/account/ios/certificate/key)
          teamId: 'INSERT', // The Team ID of your Apple Developer Account (available at https://developer.apple.com/account/#/membership/)
        },
        production: true // Set to true if sending a notification to a production iOS app
      });

      apnProvider.send(notification, deviceToken).then(function(result) {
        if (result.failed.length == 0) {
          console.log('Sent notification');
        } else {
          console.log(result.failed)
          console.log('Second attempt')
        }
      });
    }
    // Delete notification from database
    database.ref('/notifications/' + notificationId).remove()
  });
}

// Start the server
startListeners();
