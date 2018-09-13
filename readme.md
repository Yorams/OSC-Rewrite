# OSC-Rewrite
Rewrites OSC Cue's from Hog to Qlab

# Install
Browse to folder and run:

```npm install```

# Usage
1. Adjust setting in settings.json

**incomingHogPort:**
Incoming OSC port from the hog. Default is most times 7002

**outgoingQlabPort:**
Outgoing port to Qlab, default is 53000


**qlabIp:**
IP adress of the Qlab server, if the server is this computer use localhost

**listenToHogList:**
List to listen on of the Hog.

2. Run server:
```node server```