<template>
  <div id="app">
    <div class="container">
      <img alt="img algo" width="200" src="https://vuejs.org/images/logo.png">
      <h1>Sudoku.js Vue</h1>
      <sudoku></sudoku>
    </div>
  </div>
</template>

<script>
import Sudoku from './components/Sudoku'

export default {
  name: 'app',
  components: {
    Sudoku
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
