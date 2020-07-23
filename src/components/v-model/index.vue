<template>
    <div>
        <el-input
            type="text"
            v-bind:value="value"
            v-on:input="onInput"
            @compositionstart="onCompositionstart"
            @compositionend="onCompositionend"
        ></el-input>
    </div>
</template>
<script>
export default {
    data() {
        return {
            value: '',
            composing: false
        }; z
    },
    methods: {
        onModelInput(ev) {
            console.log(ev.target.value);
            console.log(this.name);
        },
        onInput(ev) {
            if (this.composing) {
                return;
            }
            const value = ev.target.value;
            this.value = value;
        },
        onCompositionstart() {
            this.composing = true
        },
        onCompositionend(ev) {
            this.composing = false;
            this.onInput(ev);
        }
    }
};
</script>
