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
6. Add the API endpoint to the Slack app `Resquest URL` (I used Slach Commands for this project)
7. Test!

---

## TODO
- [ ] Incorporate Slack webhook URL for longer requests
- [ ] Setup to deploy with CloudFormation 
- [ ] Figure out a way to incorporate API requests to prevent too many lambda requests (?)
---
