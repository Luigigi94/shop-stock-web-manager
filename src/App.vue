<script setup>
/*import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'*/
</script>

<template>
<!--  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>-->
  <nav>
    <router-link to="/">Inicio</router-link>
    <router-link to="/categories">Categorías</router-link>
    <router-link to="/products">Productos</router-link>
    <router-link to="/clients">Clientes</router-link>
    <router-link to="/suppliers">Proveedores</router-link>
  </nav>
  <main>
    <router-view/>
  </main>

<!--  <main>
    <TheWelcome />
  </main>-->
</template>

<style scoped>
/*header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}*/
nav {
  padding: 20px;
  background: #f4f4f4;
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
}
nav a {
  color: #42b883;
  text-decoration: none;
  font-weight: bold;
}
nav a.router-link-active {
  border-bottom: 2px solid #42b883;
}
main {
  padding: 20px;
}
</style>
