var $ = require('jquery');
var func = require('./main_func');
var osc = require('node-osc');
var ip = require('ip');
var fs = require("fs");
var term = require( 'terminal-kit' ).terminal;

// Get settings from file
var contents = fs.readFileSync(__dirname+"/settings.json");
var settings = JSON.parse(contents);

var currentHogTime;

// Clear the console
term.clear();

// Print title
term.color(4);
term.bold("OSC Rewrite\n");
term.defaultColor();
term("Local IP: "+ip.address()+", Incoming port: "+settings.incomingHogPort+", Outgoing port: "+ settings.outgoingQlabPort +"\n");
term("Relays OSC data to: "+settings.touchOscHostA+" @ "+settings.touchOscPortA+" and "+settings.touchOscHostB+" @ "+settings.touchOscPortB+"\n")
term("Listning to list nr: "+ settings.listenToHogList);

// Init rest of gui
updateCue("");
updatePing("");

function startServer(properties){
    // Start OSC Server
    try {
        var oscServer = new osc.Server(settings.incomingHogPort, '0.0.0.0');
        updateStatus("Server gestart", 2);
    } catch (e) {
        updateStatus("Error: Kan server niet verbinden (" + e + ")", 1);
    }
      
    // Handle incoming cues
    func.handleOSCMsg(oscServer, settings.listenToHogList, {
        onCueIncoming: function(currentCue){

            updateCue(currentCue.number);

            // Send osc to qlab
            func.sendOSCMsg(settings.qlabHost, settings.outgoingQlabPort, '/cue/'+currentCue.number+'/start');
        },
        onPing: function(hog){
            updatePing(hog.time)
            currentHogTime = hog.time;
            //console.log("Ping");
        },
        onRawPacket: function(data){
            // Relay unfiltered data to touchOsc device #1
            func.sendOSCMsg(settings.touchOscHostA, settings.touchOscPortA, data);
            func.sendOSCMsg(settings.touchOscHostB, settings.touchOscPortB, data);
        }
    });
}

function updateStatus(msg, colorNr){
    //Red: 1, Green: 2, Yellow: 3, Blue: 4
    term.moveTo( 1 , 7 ).eraseLine();
    term("Status: ");
    term.color(colorNr);
    term(msg)
    term.defaultColor()
}

function updateCue(msg){
    term.moveTo( 1 , 10 ).eraseLine();
    term("Latest Cue: ");
    term(msg);
    term(" @ ");
    term(currentHogTime);
}

function updatePing(msg){
    term.moveTo( 1 , 8 , "Time from Hog: ");
    term(msg);
    term.moveTo( 1 , 9 );
    term.gray("If the time is not changing the connection is broken.");
}

startServer();
