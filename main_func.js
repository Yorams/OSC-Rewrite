var osc = require('node-osc');
var fs = require('fs');
const path = require('path');
const url = require('url')


var exports = module.exports = {};

exports.handleOSCMsg = function(oscServer, recordedListNr, {onCueIncoming, onPing}={}){
    // Handle OSC Message
    oscServer.on("message", function (msg, rinfo) {

        // Extract payload from msg
        msgPayload = msg[2][2]
        
        // Check is go button is pushed
        if(msgPayload[0].includes("/hog/playback/go/0")){
            var recvCueArray = []

            // Extract cue nr from incoming msg
            cueInfo = msgPayload[0].split("/")[5]
            recvCueArray["list"] = cueInfo.split(".")[0]
            recvCueArray["cue"] = parseFloat(cueInfo.split(".")[1]+"."+cueInfo.split(".")[2])

            // Filter of gekozen cuelijst
            if(recvCueArray["list"] == recordedListNr){
              
                //console.log(timestampFrom + " Cue " + String(recvCueArray["cue"]) + ": " + currentCue.name + " (" + currentCue.comment + ")");

                resultData = {
                    number: recvCueArray["cue"]
                }
                onCueIncoming(resultData);
            }
        }else if(msgPayload[0].includes("/hog/status/time")){
            resultData = {
                time: msgPayload[1]
            }
            onPing(resultData);
        }
    });
}

exports.sendOSCMsg = function(oscMsg){
    var client = new osc.Client('localhost', 53000);

    client.send(oscMsg, function (err) {
        if (err) {
            console.error(new Error(err));
        }
        client.kill();
    });
}

