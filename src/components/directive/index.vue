<template>
    <div class="container">
        <el-row :gutter="10">
            <el-col :span="6">
                <!-- <el-input :value="form.age_1" v-formatNumber="{type: 'integer'}"></el-input> -->
                <!-- <el-input v-model="form.age_1" v-formatNumber="{type: 'integer'}"></el-input> -->
                <el-input v-model="form.age_1" v-formatNumber="{type: 'integer'}"></el-input>
            </el-col>
            <el-col :span="6">
                <el-input
                    v-model="form.age_2"
                    v-formatNumber="{type: 'gold', max: 999999, compareLength: true, decimalPlaces: 1}"
                ></el-input>
            </el-col>
            <el-col :span="6">
                <el-input v-model.number="form.age_3" placeholder />
            </el-col>
            <el-col :span="6">
                <el-button type="primary" @click="onClick">TEST</el-button>
            </el-col>
            <el-col :span="6"></el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col>
                <p>{{JSON.stringify(form)}}</p>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="6" v-for="(item, index) of formArr" :key="index">
                <el-input
                    v-model="item.age"
                    v-formatNumber="{type: 'gold', max: 999, compareLength: true, decimalPlaces: 1}"
                ></el-input>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" @click="onClickArr">TEST</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col>
                <p>{{JSON.stringify(formArr)}}</p>
            </el-col>
        </el-row>
    </div>
</template>

<script>

export default {
    data() {
        return {
            form: {
                age_1: 18,
                age_2: 19,
                age_3: 17
            },
            formArr: []
        };
    },
    created() {
    },
    methods: {
        onClick() {
            this.form.age_1 = 1
        },
        onClickArr() {
            this.formArr.push({ age: 1 })
        }
    }
};
</script>
