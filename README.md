# Edelia-Portal-Cz-Adapter
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Adapter for GIT Commitizen : http://commitizen.github.io/cz-cli/
This adapter is specific for an intern project and is based on the code of https://www.npmjs.com/package/cz-conventional-changelog project.

## Installing Commitizen and this adapter

Install `commitizen` globally, if you have not already.

```
npm install -g commitizen
```

Install this `commitizen` adapter globally

```
npm install -g edelia-portal-cz-adapter
```

Create a `.czrc` file in your `home` directory, with `path` referring to the preferred, globally installed, `commitizen` adapter

```
echo '{ "path": "edelia-portal-cz-adapter" }' > ~/.czrc
```
