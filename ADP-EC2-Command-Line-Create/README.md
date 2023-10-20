# Create and ADP EC2 via Command Line

The following outlines creating an AWS EC2 from the Alfresco Demo Platform (ADP) distribution zipfile from your Macbook.

## Prereq's

These are similar to what's outlined in the ADP documentation, skipping the Docker Desktop install.

1. Install Python 3 - <https://www.python.org/downloads/>

1. Install required packages by running:

    `pip3 install boto3 requests pyyaml httpx`

1. Verify the AWS CLI version is >= 2.0

    `aws --version`

    If not, refer to the [AWS CLI user guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

1. From a command prompt on the Macbook, configure the AWS SSO. Refer to the internal confluence page on ADP's OKTA replacement for complete directions.

    `aws configure sso`

1. You will need the full directory path to the SSL key (.pem) to use for access to the remote EC2, once built.

## Build the EC2

1. Unzip the ADP distribution file to a new directory.

1. Open a terminal window and change directory to the unzipped location.

1. Log into AWS.

    `aws sso login --profile adp`

1. Use the `adp.py` script and follow the prompts. The script will create the required EC2 tags for you!

    `./adp.py aws ec2 create`

    * Select the AWS region.
    * Enter the instance name.
    * Enter the purpose.
    * Provide the path and name for your SSL pem key.
    * Enter the owner, customer, POC flag, and target end date.

1. It will take a few minutes to complete the instance creation.

1. When the script ends, the details for the new EC2 will be in the config.json in the current directory.

    ```json
    "aws": {
        "region": "<region>",
        "email": "your.name@hyland.com",
        "username": "Your Name",
        "se_name": "Your Name",
        "ec2_public_dns": "ec2-<ip-address>.compute-1.amazonaws.com",
        "instance_id": "<your instance id>",
        "pem_key": "<your.key.pem>"
    
    ```

1. Using the same pem key, you can now connect to the instance.

    `ssh -i <my.key.pem> ec2-user@ec2-<ip-address>.compute-1.amazonaws.com`

## After install

1. If you need to change the networking security group for accessing the EC2, make the updates from the AWS EC2 console.

1. If you've configured VS Code for accessing your remote instances ([VS Code with Remote SSH](../VS%20Code%20with%20Remote%20SSH/)), you can add the new stanza to your ssh config file.
