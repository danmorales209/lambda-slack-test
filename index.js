const querystring = require('querystring');
const crypto = require ('crypto');

exports.handler = async (event) => {

    const hmac = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET);
    
    let payload = querystring.parse(event.postBody);
    let senderTimestamp = event.timeStamp;
    let senderSecret = event.slackSignature;
    
    let senderInfo = `${senderSecret.split('=')[0]}:${senderTimestamp}:${event.rawInput.replace(/\%20/gi,"+")}`;
    console.log(senderInfo);
    
    let computedHash = hmac.update(senderInfo,'utf8');
    
    let computedSignature = "v0="+computedHash.digest('hex');
    
    
    let nowInSeconds = Math.floor(Date.now()/1000);
    let deltaTinMinutes = Math.floor((nowInSeconds - parseInt(senderTimestamp))/60);
    
    if (deltaTinMinutes > (5)) {
        console.log("Stale request, Delta T is "+ deltaTinMinutes);
    } else {
        console.log(`Request was made ${deltaTinMinutes} minutes ago.`);
    }
    
    
    
    let message = {
	"text": `Hi I'm slackbot v.*${process.env.LAMBDA_VERSION}*, and here is a summary of your request:`,
    "attachments": [
        {
            "title": "The sent HASH",
            "text": senderSecret,
            "mrkdwn_in": ["text"],
            "color" : "#555555"
        },
        {
            "title": "The computed HASH",
            "text": computedSignature,
            "mrkdwn_in": ["text"]
        },
        {
            "title": "What I saw as a the raw body",
            "text": event.rawInput,
            "mrkdwn_in": ["text"],
            "color": "#123456"
        },
    ]
}
    
    return message;
};
