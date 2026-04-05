<template>
    <!-- <header class="header">
    <h1>CuteMagic</h1>

    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/assets">Assets</router-link>
      <router-link to="/blog">Blog</router-link>
    </nav>
  </header> -->

    <div>
        <div class="navbar bg-base-100 shadow-sm">
            <div class="flex-1">
                <a class="btn btn-ghost text-xl">Cute Magic</a>
            </div>
            <div class="flex-none">
                <ul class="menu menu-horizontal px-1">
                    <li><a>Link</a></li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                            <ul class="bg-base-100 rounded-t-none p-2">
                                <li><a>Link 1</a></li>
                                <li><a>Link 2</a></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    </div>
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