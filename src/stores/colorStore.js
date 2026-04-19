import { defineStore } from 'pinia';

export const useColorStore = defineStore('color', {
  state: () => ({
    hex: localStorage.getItem('cf_hex') || '#02C69A'
  }),

  actions: {
    setHex(val) {
      this.hex = val;
      localStorage.setItem('cf_hex', val);
    }
  }
});