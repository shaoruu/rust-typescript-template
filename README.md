![](https://i.imgur.com/lzXkRrw.jpg)

<p style="text-align: center">Create Rust + TypeScript libraries with ease! PR'S WELCOMED!</p>

## :sparkles: Inspiration

I wanted to create a WebAssembly/Rust library with additional JS features, but I couldn't find any resources on how to integrate the npm-ready library built by `wasm-pack` with TypeScript. All the examples online either seemed to use the output of `wasm-pack` using `npm link`, or didn't have TypeScript support. So, I created this, a template that allows you to embed `wasm-pack` all within one single TypeScript-based library. Enjoy!

## :building_construction: Install

Before development, make sure you have installed:
- [wasm-pack](https://github.com/rustwasm/wasm-pack)
- [cargo-watch](https://github.com/watchexec/cargo-watch)

```bash
# clone the repo
git clone --depth 1 --branch master https://github.com/iantheearl/rust-typescript-template.git your-project-name
cd your-project-name

# install dependencies
yarn

# start development
yarn run dev

# run example
yarn run example

# visit http://localhost:8080
```

After installation, start developing here:
- `./pkg`: Rust source files
- `./src`: TypeScript source files

## :printer: Publish 

```bash
# build the library to ./dist, including .wasm
yarn build

# push to npm
npm publish --access public
```

## :tv: Deployment

```bash
# build the example to `./example/build`, and push that folder to the gh-pages branch
yarn deploy
```

Configure github to deploy branch gh-pages.


## :open_file_folder: Structure

- `./core`: Rust code, the core of your library
- `./pkg`: `wasm-pack` built npm-ready library
- `./src`: TypeScript source code, where u can import from `wasm-pack`
- `./example`: A web app that uses your library directly from `./dist`
- `./tests`: To test your library

## License

MIT © [Rust TypeScript Template](https://github.com/iantheearl/rust-typescript-template)
