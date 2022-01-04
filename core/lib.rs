use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i16, b: i16) -> i16 {
    a + b
}
