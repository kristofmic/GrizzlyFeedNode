#!/bin/bash

chmod 600 ./tasks/travis/aws.pem

PACKAGE="GrizzlyFeedNode"

# production hosts for web servers
if [[ $TRAVIS_BRANCH != 'production' ]]
then
  echo "Deployments only applicable for production"
  exit 0
fi

# production hosts for web servers
if [[ $TRAVIS_BRANCH == 'production' ]]
then
  SERVER_HOST="54.68.226.195"
  echo "Pushing changes to $SERVER_HOST"
  rsync -avzhe ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i ./tasks/travis/aws.pem ./ ec2-user@$SERVER_HOST:~/$PACKAGE/
  echo "Restarting server..."
  ssh -ti ./tasks/travis/aws.pem ec2-user@$SERVER_HOST 'sudo touch ~/GrizzlyFeedNode/tmp/restart.txt'
  echo "Complete"
  exit 0
fi
