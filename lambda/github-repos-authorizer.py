def lambda_handler(event, context):
    auth = 'Deny'
    if event['authorizationToken'] == 'secret-token':
        auth = 'Allow'
    else:
        auth = 'Deny'

    authResponse = {
        "principalId": "secret-token",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [{
                "Action": "execute-api:Invoke",
                "Resource": ["arn:aws:execute-api:eu-north-1:975049956323:ekxu5fuoi1/*/GET/github"],
                "Effect": auth,
            }]
        }}
    return authResponse
