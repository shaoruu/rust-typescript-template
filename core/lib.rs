mod utils;

use fixedbitset::FixedBitSet;
use std::fmt;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: FixedBitSet,
    back_cells: FixedBitSet,
}

impl Universe {
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        let cells = &self.cells;

        let north = if row == 0 { self.height - 1 } else { row - 1 };

        let south = if row == self.height - 1 { 0 } else { row + 1 };

        let west = if column == 0 {
            self.width - 1
        } else {
            column - 1
        };

        let east = if column == self.width - 1 {
            0
        } else {
            column + 1
        };

        let nw = self.get_index(north, west);
        count += cells[nw] as u8;

        let n = self.get_index(north, column);
        count += cells[n] as u8;

        let ne = self.get_index(north, east);
        count += cells[ne] as u8;

        let w = self.get_index(row, west);
        count += cells[w] as u8;

        let e = self.get_index(row, east);
        count += cells[e] as u8;

        let sw = self.get_index(south, west);
        count += cells[sw] as u8;

        let s = self.get_index(south, column);
        count += cells[s] as u8;

        let se = self.get_index(south, east);
        count += cells[se] as u8;

        count
    }

    /// Get the dead and alive values of the entire universe.
    pub fn get_cells(&self) -> *const u32 {
        self.cells.as_slice().as_ptr()
    }

    /// Set cells to be alive in a universe by passing the row and column
    /// of each cell as an array.
    pub fn set_cells(&mut self, cells: &[(u32, u32)]) {
        for (row, col) in cells.iter().cloned() {
            let idx = self.get_index(row, col);
            self.cells.set(idx, true);
        }
    }
}

#[wasm_bindgen]
impl Universe {
    pub fn tick(&mut self) {
        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                let next_cell = match (cell, live_neighbors) {
                    // Rule 1: Any live cell with fewer than two live neighbours
                    // dies, as if caused by underpopulation.
                    (true, x) if x < 2 => false,
                    // Rule 2: Any live cell with two or three live neighbours
                    // lives on to the next generation.
                    (true, 2) | (true, 3) => true,
                    // Rule 3: Any live cell with more than three live
                    // neighbours dies, as if by overpopulation.
                    (true, x) if x > 3 => false,
                    // Rule 4: Any dead cell with exactly three live neighbours
                    // becomes a live cell, as if by reproduction.
                    (false, 3) => true,
                    // All other cells remain in the same state.
                    (otherwise, _) => otherwise,
                };

                self.back_cells.set(idx, next_cell);
            }
        }

        std::mem::swap(&mut self.cells, &mut self.back_cells);
    }

    pub fn new() -> Universe {
        utils::set_panic_hook();
        let width = 64;
        let height = 64;

        let size = (width * height) as usize;
        let mut cells = FixedBitSet::with_capacity(size);
        for i in 0..size {
            cells.set(i, i % 2 == 0 || i % 7 == 0);
        }
        let back_cells = cells.clone();

        Universe {
            width,
            height,
            cells,
            back_cells,
        }
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const u32 {
        self.cells.as_slice().as_ptr()
    }

    /// Set the width of the universe.
    ///
    /// Resets all cells to the dead state.
    #[wasm_bindgen(js_name = setWidth)]
    pub fn set_width(&mut self, width: u32) {
        self.width = width;
        self.cells.clear();
    }

    /// Set the height of the universe.
    ///
    /// Resets all cells to the dead state.
    #[wasm_bindgen(js_name = setHeight)]
    pub fn set_height(&mut self, height: u32) {
        self.height = height;
        self.cells.clear();
    }

    #[wasm_bindgen(js_name = toggleCell)]
    pub fn toggle_cell(&mut self, row: u32, column: u32) {
        let idx = self.get_index(row, column);
        self.cells.set(idx, !self.cells[idx]); // toggle the value of the cell
    }
}

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let cells = &self.cells;
        for row in 0..self.height {
            for col in 0..self.width {
                let i = self.get_index(row, col);
                let symbol = if cells[i] { '◻' } else { '◼' };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}
