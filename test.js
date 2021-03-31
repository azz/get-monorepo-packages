const path = require('path');
const getPackages = require('.');

const LERNA_DIR = path.join(__dirname, 'fixture/lerna');
const YARN_DIR_1 = path.join(__dirname, 'fixture/yarn');
const YARN_DIR_2 = path.join(__dirname, 'fixture/yarn-2');
const BOLT_DIR = path.join(__dirname, 'fixture/bolt');

expect.addSnapshotSerializer({
  test: (value) =>
    typeof value === 'string' &&
    (value.includes('\\') || value.includes(process.cwd())),
  print: (value, serializer) =>
    serializer(value.replace(process.cwd(), '<cwd>').replace(/\\/g, '/')),
});

describe('getPackages()', () => {
  test('lerna matches snapshot', () => {
    expect(getPackages(LERNA_DIR)).toMatchSnapshot();
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
