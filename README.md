# copy-previous-s3

# Example usage

```yaml
jobs:
  example:
    steps:
      - name: copy s3 from previous commit
        uses: opronto/copy-previous-s3
        id: prime
        with:
          component: foo
          s3Bucket: pronto-build
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
