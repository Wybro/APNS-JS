# APNS-JS
#### APNS-Firebase node.js server starter project
This serves as a template for adding remote push notifications to iOS apps using Firebase observers

## Instructions: 
* Enable Push Notifications in the Xcode project -- **Capabilities** < **Push Notifications** < Toggle **On**
* Create .p8 apns auth key via Apple Member Center
* Place .p8 file in starter project folder
* Configure project under sections labeled "SETUP"

## Testing:
#### Local
* Navigate to APNS-JS project folder using **Terminal**
* Run ```npm start```

#### Cloud
* Highlight all files in APNS-JS project folder
* **Right-click** and **Compress** files
* Upload **.zip** archive to service such as [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
