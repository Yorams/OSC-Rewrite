# OSC-Rewrite
Rewrites OSC Cue's from Hog to Qlab

# Install
1. Install node js: [Download Page NodeJS](https://nodejs.org/en/download/)

2. Browse to extracted OSC-Rewrite folder and first run:

   ```install.sh```


# Usage
1. Adjust setting in settings.json

   - **incomingHogPort:** Incoming OSC port from the hog. Default is most times 7002

   - **outgoingQlabPort:** Outgoing port to Qlab, default is 53000

   - **qlabIp:** IP adress of the Qlab server, if the server is this computer use localhost

   - **listenToHogList:** List to listen on of the Hog.

2. Run server

   ```start.sh```

# Notes
- Some cues in the Hog shows 32.6 but trough OSC it sends 32.59998. So the cue number is rounded to 3 decimals places.