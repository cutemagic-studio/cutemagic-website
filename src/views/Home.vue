<template>
  
  <div>
    <AssetSpecification/>
  </div>

</template>

<script setup>
import AssetSpecification from '../views/home/AssetSpecification.vue'
</script>

<style lang="scss">
$primary: #333;

.card {
  background: $primary;
  color: white;

  h3 {
    font-size: 20px;
  }
}
</style>