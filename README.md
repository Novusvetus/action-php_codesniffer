# GitHub Action to run PHP_CodeSniffer


## Overview

This action runs [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer).


## Usage

Add a file like this to `.github/workflows/phpcs.yml`:

```yml
name: "CI"

on:
  push:
    paths:
      - "**.php"
      - "phpcs.xml"
      - ".github/workflows/phpcs.yml"
  pull_request:
    paths:
      - "**.php"
      - "phpcs.xml"
      - ".github/workflows/phpcs.yml"

jobs:
  phpcs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # important!

      - name: Install PHP_CodeSniffer
        run: |
          curl -OL https://squizlabs.github.io/PHP_CodeSniffer/phpcs.phar
          php phpcs.phar --version

      - uses: Novusvetus/action-php_codesniffer@1.2.10
        with:
          files: "**.php"
          scan_all: true
          phpcs_path: php phpcs.phar
          standard: phpcs.xml
```

You also will need either to pick a build code style standard or create `phpcs.xml` file.


## License ##
3-clause BSD license
See [License](LICENSE)


## Bugtracker ##
Bugs are tracked in the issues section of this repository on GitHub.
Please read over existing issues before submitting an issue to ensure yours is unique.

[Create a new issue](../../issues/new)
 - Describe the steps to reproduce your issue.
 - Describe the expected and the actual outcome.
 - Describe your environment as detailed as possible.


## Development and contribution ##
Feature requests can also be made by [creating a new issue](../../issues/new).
If you would like to make contributions to this repository, feel free to [create a fork](../../fork) and submit a pull request.


## Links ##
* [ReindeerWeb](https://www.reindeer-web.de)
* [Novusvetus](https://www.novusvetus.de)
* [License](./LICENSE)
* [Contributing](./CONTRIBUTING.md)
