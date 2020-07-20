
<!-- -->
<template>
  <div>
    {{_msg}}
    <button @click="handleClick">点击</button>
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      msgMid: ""
    };
  },
  computed: {
    _msg: {
      get: function() {
        return this.msgMid || this.msg;
      },
      set: function(value) {
        console.log(value);
        this.msgMid = value;
      }
    }
  },
  methods: {
    handleClick() {
      this._msg += "1";
    }
  }
};
</script>	