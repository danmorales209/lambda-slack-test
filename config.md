## TODO
- [ ] Incorporate Slack webhook URL for longer requests
- [ ] Setup to deploy with CloudFormation 
- [ ] Figure out a way to incorporate API requests to prevent too many lambda requests (?)
---
## Lambda .env configurations
- LAMBDA_VERSION: Optional, track revision for quick communicaiton through Slack
- SLACK_SIGNING_SECRET: From the Slack app, used to verify the integrity of the request
- Future

Note: for Nodejs env, handler assumes information is passed as an object, and all information is expose via the event parameter

---
## API Gateway settings
- POST method, need to disable API keys for Slack
- Integration request:
  - Select Lambda integration
  - Under Mapping templates, for `Request Body passthrough`, select `When no template matches the request Content-Type header`
