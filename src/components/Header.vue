<template>
  <header class="header">
    <h1>CuteMagic</h1>

    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/assets">Assets</router-link>
      <router-link to="/blog">Blog</router-link>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: black;
  color: white;
}

nav a {
  margin-left: 15px;
  color: white;
  text-decoration: none;
}

.router-link-active {
  font-weight: bold;
}
</style>