![PowerCms](docs/logo-small.png)

# PowerCMS - User service

[![NPM Version](https://img.shields.io/npm/v/@power-cms/user-service.svg)](https://www.npmjs.com/package/@power-cms/user-service)
[![Build Status](https://travis-ci.com/power-cms/user-service.svg?branch=master)](https://travis-ci.com/power-cms/user-service)
[![Coverage Status](https://coveralls.io/repos/github/power-cms/user-service/badge.svg)](https://coveralls.io/github/power-cms/user-service)

## How to install?

```bash
npm install --save @power-cms/user-service
```

## Actions

| Name       | Public | Authorization |
|------------|:------:|:-------------:|
| collection | Yes    | Admin         |
| create     | Yes    | None          |
| read       | Yes    | Admin or Self |
| update     | Yes    | Admin or Self |
| delete     | Yes    | Admin         |
| getByLogin | No     | None          |
| grantRoles | No     | Admin         |

## Required services

* [Auth service](https://github.com/power-cms/auth-service)

## How to test?

```bash
npm test
```

## License

Copyright &copy; 2018 by Szymon Piecuch under ISC license.
