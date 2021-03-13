# Pulumi stack name

Github action to determine pulumi stack name. If the action is based on a pull request, the stack name becomes `pr-<Pull request number>` (ie `pr-1234`).
Otherwise, the pulumi stack name becomes the name of the branch.

Notes:

- Slashes in branch names are replaced with `-`. Example `fix/my-Branch` becomes `fix-my-branch`
