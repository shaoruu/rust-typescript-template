# Rust TypeScript Template


## Installation

Before development, make sure you have installed:
- [wasm-pack](https://github.com/rustwasm/wasm-pack)
- [cargo-watch](https://github.com/watchexec/cargo-watch)

```bash
# install dependencies
yarn

# start development
yarn run dev

# run example
yarn run example
```

## Publishing 

```bash
# build the library
yarn build

# push to npm
npm publish --access public
```

## Deployment

```bash
# build the example
yarn deploy

# configure github to deploy branch gh-pages 
```