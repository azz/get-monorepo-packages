'use strict';

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const loadJsonFile = require('load-json-file');

const loadPackage = packagePath => {
  const pkgJsonPath = path.join(packagePath, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    return loadJsonFile.sync(pkgJsonPath);
  }
};

const findPackages = (packageSpecs, rootDirectory) => {
  return packageSpecs
    .reduce(
      (pkgDirs, pkgGlob) => [
        ...pkgDirs,
        ...(globby.hasMagic(pkgGlob)
          ? globby.sync(path.join(rootDirectory, pkgGlob), {
              nodir: false,
            })
          : [path.join(rootDirectory, pkgGlob)]),
      ],
      []
    )
    .map(location => ({ location, package: loadPackage(location) }))
    .filter(({ package: { name } = {} }) => name);
};

const getPackages = directory => {

  // if lerna (<7.0.0) specifies packages in lerna.json, use it.
  const lernaJsonPath = path.join(directory, 'lerna.json');
  const lernaJson = fs.existsSync(lernaJsonPath) ? loadJsonFile.sync(lernaJsonPath) : null;
  if (lernaJson && lernaJson.packages) {
      return findPackages(lernaJson.packages, directory);
  }

  const pkgJsonPath = path.join(directory, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = loadJsonFile.sync(pkgJsonPath);
    let workspaces = pkgJson.workspaces;

    if (pkgJson.bolt) {
      workspaces = pkgJson.bolt.workspaces;
    }

    if (workspaces) {
      if (Array.isArray(workspaces)) {
        return findPackages(workspaces, directory);
      } else if (Array.isArray(workspaces.packages)) {
        return findPackages(workspaces.packages, directory);
      }
    }
  }

  // Bail if we don't find any packages
  return [];
};

module.exports = getPackages;
exports.default = getPackages;
