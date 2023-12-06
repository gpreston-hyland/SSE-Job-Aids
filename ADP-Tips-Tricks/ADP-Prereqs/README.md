# ADP Prerequisites and SSO Configuration

These are similar to what's outlined in the ADP documentation, skipping the Docker Desktop install.

1. Install Python 3 - <https://www.python.org/downloads/>

1. Install required packages by running:

    `pip3 install boto3 requests pyyaml httpx`

1. Verify the AWS CLI version is >= 2.0

    `aws --version`

    If not, refer to the [AWS CLI user guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

1. From a command prompt on the Macbook, configure the AWS SSO. Refer to the internal confluence page on ADP's OKTA replacement for complete directions.

    `aws configure sso`

    > [!TIP]   
    > If you have already configured SSO on a machine, you may copy the file `~/.aws/config` to the corresponding location on the new machine and set the permissions with `chmod 600 ~/.aws/config`.

1. If you are only using a single AWS SSO profile (most SSE's are), you may set an environment variable with the profile name to avoid typing `--profile <name>` on every `aws` commandline. Add the following to your default shell configuration file. On Mac's it could be `~/.zshrc` or `~/.bashrc`. On the EC2's it will be `~/.bashrc`.

    `export AWS_DEFAULT_PROFILE=<profile name>`

1. You will need to know the full directory path to the SSL key (.pem) to use for access to a remote EC2, once built.
