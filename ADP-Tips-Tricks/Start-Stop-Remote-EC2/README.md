# Starting and Stopping a Remote EC2 from the Command Line

Even if you are not running and ADP instance locally, you may use the `adp.py` script to manage and access your remote EC2's. For the list run `./adp.py aws ec2 help`.

This page covers:

* List the EC2's you created via email tag - *tags are case sensitive*
* Get the status (ruuning/stoped) of an EC2 instance
* Start or Stop a remote EC2 instance
* Open and ssh connection to the remote EC2 (*with some caveats*)

## Prereq's

Make sure you've installed and configured all the necessary prerequisites from [ADP-Prereqs](../ADP-Prereqs/).

## Install and prepare ADP locally

1. Unzip the ADP distribution file to a new directory.

1. Open a terminal window and change directory to the unzipped location.

1. Log into AWS.

    `aws sso login --profile adp`

    > [!NOTE] If you set the AWS_DEFAULT_PROFILE environment variable simply,  
    > `aws sso login`

1. Like most actions the `adp.py` uses, the `config.json` file plays a key role. For the AWS EC2 related items, the `config.json` requires an `"aws"` section. The simplest way to add it (or create `config.json`) is to let the script do it for you.

    `./adp.py aws ec2 status`

    This will prompt you for which AWS region is used for your EC2's. This will populate certain fields in the `aws` stanza necessary for the remaining commands, if needed.

For reference, the `aws` section of `config.json` looks like:

```json
"aws": {
    "region": "<region>",
    "email": "your.name@hyland.com",
    "username": "Your Name",
    "se_name": "Your Name",
    "ec2_public_dns": "ec2-<ip-address>.compute-1.amazonaws.com",
    "instance_id": "<your instance id>",
    "pem_key": "<your.key.pem>"
}
```

### List your EC2's

The `./adp.py aws ec2 list` command searches for your ECs based on the `Email` tag associated with the instance(s). Please note, AWS tag values are case sensitive where the `aws cli` is concerned.

The results are a table similar to the following.

    Region		 | Instance ID	     	 | Instance Name
    --------------------------------------------------------
    us-east-1	 | i-################	 | INS ADE
    us-east-1	 | i-################	 | GRP_Alfresco_721
    us-east-1	 | i-################	 | GRP Ins 73
    us-east-1	 | i-################	 | GRP - ADP 7.4.1

The `Instance ID` value is used subsequently to tell the `adp.py` script which EC2 is affected by the action.

### Set the Instance to Use

The start, stop, and status directives all affect the `instance_id` value of the `aws` section of the `config.json`. You may add the value manually (not recommended) or issue the following setting `<instance-id>` to one of the values from `list` command.

`./adp.py aws ec2 use <instance id>`

In addition to setting the `instance_id` value, it creates an `ec2_public_dns` key that contains the derived hostname for the EC2 (if it's in a running state). That's the hostname it uses when using the `aws ec2 shell` command.

> [!NOTE] With the changes to keep instance stopped, the derived DNS name changes every time it's restarted. Hopefully later releases will make use of the `dnsName` tag on the instance.

To find the value of the `dnsName` tag for the instance, use the following command and supply the appropriate `instance-ids` value(s). Separate multiple instance ids with a space.

``aws ec2 describe-instances --instance-ids <instanceid> --filters Name=tag-key,Values=Name --query 'Reservations[*].Instances[*].{Name:Tags[?Key==`Name`]|[0].Value,dnsName:Tags[?Key==`dnsName`]|[0].Value}' --output text``

You can use the `dnsName` with the `.alfdemo.com` suffix for the `ec2_public_dns` value if you want (until you issue the next `ec2 use` anyway).

### EC2 Intance Status - running or stopped

To be clear, this is the status of the EC2, not the status of the ADP on the EC2.

To get the current state of the EC2 specified in the `aws` section of the `config.json`.

`./adp.py aws ec2 status`

### Start or Stop the EC2

Like the `ec2 status` these commands affect the `instance_id` in the `config.json`.

`./adp.py aws ec2 start`

or (You guessed it!)

`./adp.py aws ec2 stop`

### Open an ssh session to the EC2

If you haven't configured your local `ssh` to use aliases (see the Configure a Remote Host section of [VS Code with Remote SSH](../../VS%20Code%20with%20Remote%20SSH/)) you can let the `adp.py` script handle things for you. Again, this will affect the current `instance_id` from the `config.json`. If needed, it will prompt you for the location and file name for the SSH key file. (which will populate the `pem_key` value in the `config.json`).

`./adp.py aws ec2 shell`
