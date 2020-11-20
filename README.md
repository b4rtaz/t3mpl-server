# T3MPL Server

[![Build Status](https://travis-ci.com/b4rtaz/t3mpl-server.svg?branch=master)](https://travis-ci.com/b4rtaz/t3mpl-server) [![Coverage Status](https://coveralls.io/repos/github/b4rtaz/t3mpl-server/badge.svg?branch=master)](https://coveralls.io/github/b4rtaz/t3mpl-server?branch=master) [![License: MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](/LICENSE) [![Twitter: b4rtaz](https://img.shields.io/twitter/follow/b4rtaz.svg?style=social)](https://twitter.com/b4rtaz)

This is the server for [T3MPL Editor](https://github.com/b4rtaz/t3mpl-editor). You can forget about .zip/.t3data/.t3mpl files. You may update your site directly from the editor.

## 🔨 How to Build

[Node.js](https://nodejs.org/en/) is required. Clone this repository.

`git clone https://github.com/b4rtaz/t3mpl-server.git`

Run `scripts/install.sh`:

`bash scripts/install.sh`

## ⚡ How to Run

You need to build the server. The instruction is above. To start server, execute:

`npm run serve`

## ⚙️ Configuration

The server uses `configuration.json` file. This file will be created when you run `scripts/install.sh`. The server supports only that method for now.

#### Session

This project uses [cookie session](https://github.com/expressjs/cookie-session#readme). This middleware does not require any database, but it requires secret keys to validate session cookies. **It is very important to set custom keys for each instance of server.** You may random that keys.

```json
"session": {
    "secretKeys": [
        "128c1f2a0dc8b172d1530a4371a36fa2",
        "6f2b624e34f83af2ae36d956ccd6d88b"
    ],
    "maxAge": 43200000
}
```

#### Users

The server support many users. 

* `name` - user name,
* `hashedPassword` - hashed password by SHA256, you may use [this tool](https://emn178.github.io/online-tools/sha256.html) for that.

```json
"users": [
    {
        "name": "<USER_NAME>",
        "hashedPassword": "<SHA_256_HASH>"
    }
]
```

The default configuration contains the `admin` user with the `admin` password.

#### Websites

Each user can have many websites.

* `name` - display name,
* `owner` - user name of owner,
* `templateDirPath` - relative or absolute path to template directory, in this directory should be `template.yaml` file,
* `dataDirPath` - relative or absolute path to data directory, in this directory should be `data.json` file,
* `releaseDirPath` - relative or absolute path to release directory, the generator generates final website here.

The server **must have** access to read/write provides directories.

```json
"websites": [
    {
        "name": "boilerplate",
        "owner": "admin",
        "templateDirPath": "./websites/boilerplate/template",
        "dataDirPath": "./websites/boilerplate/data",
        "releaseDirPath": "./websites/boilerplate/release"
    }
]
```

## 💡 License

This project is released under the MIT license.
