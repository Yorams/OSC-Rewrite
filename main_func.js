var osc = require('node-osc');
var fs = require('fs');
const path = require('path');
const url = require('url');
var term = require( 'terminal-kit' ).terminal;


var exports = module.exports = {};

exports.handleOSCMsg = function(oscServer, recordedListNr, {onCueIncoming, onPing, onRawPacket}={}){
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
                // Round cue number to 3 decimals. Some hog cue's shows 32.6 but 32.555598 is send. 
                var currCueNumber = Number.parseFloat(recvCueArray["cue"]).toFixed(3)
                currCueNumber = exports.remTrailingZero(currCueNumber);
                resultData = {
                    number: currCueNumber
                }
                onCueIncoming(resultData);
            }
        }else if(msgPayload[0].includes("/hog/status/time")){
            resultData = {
                time: msgPayload[1]
            }
            onPing(resultData);
        }
        
        // Unfiltered data is passed to this function.
        onRawPacket(msgPayload);
        

    });
}

exports.sendOSCMsg = function(host, port, oscMsg){
    var client = new osc.Client(host, port);

    client.send(oscMsg, function (err) {
        if (err) {

            // Print error in term line with color
            term.moveTo( 1 , 5 ).eraseLine();
            term("Info: ");
            term.color(3);
            term(err)

            err = err.toString();
            if(err.indexOf("EHOSTDOWN") > -1){
              // No error is printed, because its messes up the gui
              //term(" (TouchOSC device is probably offline. Don't panic, nothing on the hand.)")
            }

            term.defaultColor()
        }
        client.kill();
    });
}

exports.remTrailingZero = function(value) {
  value = value.toString()

  // if not containing a dot, we do not need to do anything
  if (value.indexOf('.') === -1) {
    return value
  }

  var cutFrom = value.length - 1

  // as long as the last character is a 0, remove it
  do {
    if (value[cutFrom] === '0') {
      cutFrom--
    }

  } while (value[cutFrom] === '0')

  // final check to make sure we end correctly
  if (value[cutFrom] === '.') {
    cutFrom--
  }

  return value.substr(0, cutFrom + 1)
}

