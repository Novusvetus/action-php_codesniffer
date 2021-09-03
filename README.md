# GitHub Action to run PHP_CodeSniffer

This action runs [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer).

## Usage

Add a file like this to `.github/workflows/phpcs.yml`:

```yml
name: "CI"

on:
  pull_request:
    paths:
      - "**.php"
      - "phpcs.xml"
      - ".github/workflows/phpcs.yml"

jobs:
  phpcs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0 # important!

      - name: Install PHP_CodeSniffer
        run: |
          curl -OL https://squizlabs.github.io/PHP_CodeSniffer/phpcs.phar
          php phpcs.phar --version

      - uses: Novusvetus/action-php_codesniffer@v1
        with:
          files: "**.php"
          phpcs_path: php phpcs.phar
          standard: phpcs.xml
```

You also will need either to pick a build code style standard or create `phpcs.xml` file.