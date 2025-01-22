const path = require('path');
const getPackages = require('.');

const LERNA_DIR = path.join(__dirname, 'fixture/lerna'); // workspaces directly specified
const LERNA_6_DIR = path.join(__dirname, 'fixture/lerna6'); // useWorkspaces from package.json
const LERNA_7_DIR = path.join(__dirname, 'fixture/lerna7'); // useWorkspaces property omitted
const YARN_DIR_1 = path.join(__dirname, 'fixture/yarn');
const YARN_DIR_2 = path.join(__dirname, 'fixture/yarn-2');
const BOLT_DIR = path.join(__dirname, 'fixture/bolt');

expect.addSnapshotSerializer({
  test: value =>
    typeof value === 'string' &&
    (value.indexOf('\\') > -1 || value.indexOf(process.cwd()) > -1),
  print: (value, serializer) =>
    serializer(value.replace(process.cwd(), '<cwd>').replace(/\\/g, '/')),
});

describe('getPackages()', () => {
  test('lerna matches snapshot', () => {
    expect(getPackages(LERNA_DIR)).toMatchSnapshot();
  });

  test('lerna6 matches snapshot', () => {
    expect(getPackages(LERNA_6_DIR)).toMatchSnapshot();
  });

    test('lerna7 matches snapshot', () => {
    expect(getPackages(LERNA_7_DIR)).toMatchSnapshot();
  });

  test('yarn matches snapshot', () => {
    expect(getPackages(YARN_DIR_1)).toMatchSnapshot();
  });

  test('yarn 1.4.2+ matches snapshot', () => {
    expect(getPackages(YARN_DIR_2)).toMatchSnapshot();
  });

  test('bolt matches snapshot', () => {
    expect(getPackages(BOLT_DIR)).toMatchSnapshot();
  });

  test('returns empty array when no packages', () => {
    expect(getPackages(__dirname)).toEqual([]);
  });
});
