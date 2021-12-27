use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    return format!("Hey {}, wasm says hello!", name);
}
