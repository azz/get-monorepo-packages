'use strict';

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const loadJsonFile = require('load-json-file');

const loadPackage = (packagePath) => {
  const pkgJsonPath = path.join(packagePath, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    return loadJsonFile.sync(pkgJsonPath);
  }
};

const findPackages = (packageSpecs, rootDirectory) => {
  return (
    packageSpecs
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce(
        (pkgDirs, pkgGlob) => [
          ...pkgDirs,
          ...(globby.hasMagic(pkgGlob)
            ? globby.sync(path.join(rootDirectory, pkgGlob), {
                onlyFiles: false,
              })
            : [path.join(rootDirectory, pkgGlob)]),
        ],
        []
      )
      .map((location) => ({ location, package: loadPackage(location) }))
      .filter(({ location }) => !location.includes('/node_modules/'))
      .filter(({ package: { name } = {} }) => name)
  );
};

const getPackages = (directory) => {
  const lernaJsonPath = path.join(directory, 'lerna.json');
  if (fs.existsSync(lernaJsonPath)) {
    const lernaJson = loadJsonFile.sync(lernaJsonPath);
    if (!lernaJson.useWorkspaces) {
      return findPackages(lernaJson.packages, directory);
    }
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
      }

      if (Array.isArray(workspaces.packages)) {
        return findPackages(workspaces.packages, directory);
      }
    }
  }

  // Bail if we don't find any packages
  return [];
};

module.exports = getPackages;
exports.default = getPackages;
