<template>
    <div>
        <p>{{name}}</p>
        <input type="text" v-model="name" @input="onModelInput" />
        <p>{{value}}</p>
        <input
            type="text"
            v-bind:value="value"
            v-on:input="onInput"
            @compositionstart="onCompositionstart"
            @compositionend="onCompositionend"
        />
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: 'lilei',
            value: 'lilei',
            composing: false
        };
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
            this.value = ev.target.value;
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
