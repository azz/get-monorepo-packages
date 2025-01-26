# `get-monorepo-packages`

[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/get-monorepo-packages.svg?style=flat-square)](https://npmjs.org/get-monorepo-packages)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

Get a list of packages from a monorepo. Supports:

* [Lerna](https://github.com/lerna/lerna)
* [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)
* [Bolt](http://boltpkg.com/)

## Install

```bash
npm install --save get-monorepo-packages
```

## Usage

```js
import getPackages from 'get-monorepo-packages';
getPackages('/path/to/root');
```

Returns an array of objects containing:

* `location` - The relative path to the package.
* `package` - The `package.json` file for the package.
