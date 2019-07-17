# AWS Lambda Slack App
---
## Prerequisites
1. AWS Account
2. AWS API Gateway
3. AWS Lambda
4. Slack

---

### Quick (?) Start
1. Sign up for AWS (__warning - this can take up to a day to get full access__)
2. Activate Lambda and API gateway in AWS
3. Create the function in Lambda, and give it the role `AWSLambdaBasicExecutionRole`
4. Create the API, and add it as a trigger for the Lamda function
5. Configure the API gateway and lambda function per [the config](./config.md)
6. Add the API endpoint to the Slack app `Resquest URL` (I used Slash Commands for this project)
7. Test!

---

### Under the hood:
Slack is moving towards [Signed Secrets](https://api.slack.com/docs/verifying-requests-from-slack) for authentication instead of using tokens. The app sends:
- A timestamp (UTC-encoded seconds from 1970)
- A signature ( currently in the form v0= xxxxxx )

To authenticate the slack message, create an [HMAC hash](https://nodejs.org/docs/latest-v8.x/api/crypto.html#crypto_class_hmac) using the Slack App Secret Signature, and hashing `v0:<timestamp>:<post request body>`. Compare this against the `X-Slack-Signature` header parameter passed with the request to determine if the message is valid.

__Fun Fact:__ The lambda integration encodes spaces as `%2F`, and Slack expects spaces to be encoded as `+` in the message body! I used string.replace and some regex to manually convert, since 



## TODO
- [ ] Incorporate Slack webhook URL for longer requests
- [ ] Setup to deploy with CloudFormation 
- [ ] Figure out a way to incorporate API requests to prevent too many lambda requests (?)
---
