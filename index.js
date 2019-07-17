const querystring = require('querystring');
const crypto = require ('crypto');

exports.handler = async (event) => {
    
    // Extract some info from the event object
    let payload = querystring.parse(event.postBody);
    let senderTimestamp = event.timeStamp;  // use this to prevent stale / spooffed requests
    let senderSecret = new Buffer.from(event.slackSignature, 'utf-8');
    
    //Calculate the time delta between when the request was sent and when it is processed
    let nowInSeconds = Math.floor(Date.now()/1000);
    let deltaTinMinutes = Math.floor((nowInSeconds - parseInt(senderTimestamp))/60);
    
    let message;
    
    if (deltaTinMinutes > (5)) { // Request timestamp is old or spooffed
    
        console.log("Stale / Spooffed request, Delta T is "+ deltaTinMinutes);
        
    } else { // Request is probably not too old
        
        console.log(`Request was made ${deltaTinMinutes} minutes ago.`);
        
        // Create the hmac stream
        const hmac = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET);
        
        
        
        // Get the payload from slack to compute a hash of information from the slack command
        // replace any spaces encoded as '%20' with '+' to comply with the format Slack expects when computing the Hash
        let senderInfo = `${senderSecret.toString("utf-8").split('=')[0]}:${senderTimestamp}:${event.rawInput.replace(/\%20/gi,"+")}`;
        console.log(senderInfo);
        
        // Make the hash
        let computedHash = hmac.update(senderInfo,'utf8');
        
        //format the hash
        let computedSignature = new Buffer.from("v0="+computedHash.digest('hex'), 'utf-8');
        
        if (crypto.timingSafeEqual(computedSignature, senderSecret)) {
            message = {
            	"text": `Hi I'm slackbot v.*${process.env.LAMBDA_VERSION}*, and here is a summary of your request:`,
                "attachments": [
                    {
                        "title": "The sent HASH",
                        "text": senderSecret.toString('utf-8'),
                        "mrkdwn_in": ["text"],
                        "color" : "#555555"
                    },
                    {
                        "title": "The computed HASH",
                        "text": computedSignature.toString('utf-8'),
                        "mrkdwn_in": ["text"]
                    },
                    {
                        "title": "Your Signed Secret Was Successful",
                        "text": ":)",
                        "mrkdwn_in": ["text"],
                        "color": "#123456"
                    },
                ]
            };
            
        } else {
            message = {
                "text": `Hi I'm slackbot v.*${process.env.LAMBDA_VERSION}*, and here is a summary of your request:`,
                "attachments": [
                    {
                        "title": "The sent HASH",
                        "text": senderSecret.toString('utf-8'),
                        "mrkdwn_in": ["text"],
                        "color" : "#555555"
                    },
                    {
                        "title": "The computed HASH",
                        "text": computedSignature.toString('utf-8'),
                        "mrkdwn_in": ["text"]
                    },
                    {
                        "title": "Your Signed Secret Was Unsuccessful",
                        "text": ":(",
                        "mrkdwn_in": ["text"],
                        "color": "#123456"
                    },
                ]
            }
        }
    }
    
    
    
    
    return message;
};

