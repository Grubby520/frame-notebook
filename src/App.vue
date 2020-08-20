<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <HelloWorld></HelloWorld>
  </div>
</template>

<script>
// import HelloWorld from "./components/directive/index.vue";
// import HelloWorld from './components/math/math.vue'
// import HelloWorld from './components/array/upload.vue'
import HelloWorld from './components/array/index.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      progress: {
        count: 3,
        success: 0,
        fail: 0
      }
    }
  },
  mounted() {
    this.asyncFn(this.progress)
  },
  // 测试
  methods: {
    async asyncFn({ count }) {
      //   console.log(count);
      const vm = this
      for (let i = 0; i < count; i++) {
        // console.log(i);
        const result = await vm.apiCreateOrder()
        // console.log(result);
        vm.progress.success += result.success
        vm.progress.fail += result.fail
        // console.log(vm.progress);
      }
      //   console.log('down');
    },
    apiCreateOrder() {
      return new Promise((reslove) => {
        setTimeout(() => {
          reslove({
            total: 1,
            success: 1,
            fail: 0
          })
        })
      }, 2000)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
