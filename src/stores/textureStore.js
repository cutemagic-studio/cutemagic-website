import { defineStore } from 'pinia';

export const useTextureStore = defineStore('texture', {
  state: () => ({
    grid: JSON.parse(localStorage.getItem('texture_grid') || 'null') || Array(160).fill(null)
  }),

  actions: {
    setCell(index, color) {
      this.grid[index] = color;
      this.save();
    },

    clearGrid() {
      this.grid = Array(160).fill(null);
      this.save();
    },

    save() {
      localStorage.setItem('texture_grid', JSON.stringify(this.grid));
    }
  }
});