<template>
  <div id="app">
     <el-container>
    <el-header class="header">
      <h1>Dailydroid</h1>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
            default-active="2"
            :router="true">
            <el-menu-item index="questions">
              <i class="el-icon-service"></i>
              <span>Questions</span>
            </el-menu-item>
            <el-menu-item index="users">
              <i class="el-icon-star-on"></i>
              <span>Users</span>
            </el-menu-item>
          </el-menu>
      </el-aside>
      <el-main>
         <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.header {
  background-color: #2c3e50;
  color: #eeefff;
}
</style>
