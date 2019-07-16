## AWS
### Lambda .env configurations
- LAMBDA_VERSION: Optional, track revision for quick communicaiton through Slack
- SLACK_SIGNING_SECRET: From the Slack app, used to verify the integrity of the request

Note: for Nodejs env, handler assumes information is passed as an object, and all information is expose via the event parameter

### API Gateway settings
- POST method, need to disable API keys for Slack
- Integration request:
  - Select Lambda integration
  - Under Mapping templates, for `Request Body passthrough`, select `When no template matches the request Content-Type header`
  - Add `application/x-www-form-urlencoded` under `Content-Type`
  - My current configuration :
  ```
  {
    "timeStamp" : "$input.params('X-Slack-Request-Timestamp')",
    "slackSignature" : "$input.params('X-Slack-Signature')",
    "postBody" : $input.json("$"),
    "rawInput" : "$input.body"
  }
  ```
    - `$input.params("$input.params('X-Slack-Request-Timestamp')"` gets the timestamp header from the Slack / command request
    - `$input.params("$input.params('X-Slack-Signature')"` gets the Slack-compute hash to use in verification process
    - `$input.json("$")` returns a string with the HTTP body
    - `$rawInput` returns the message body as sent, no processing (important to authenticate requests)
    
## Slack
