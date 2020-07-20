<template>
    <div class="hello">
        <p>{{msg}}</p>
        <PropsChild :msg="msg"></PropsChild>
        <VModel></VModel>
        <p>-----------------------</p>
        <!-- <Flex></Flex> -->
        <input type="text" v-model="numA" />
        <span>+</span>
        <input type="text" v-model="numB" />
        <span>=</span>
        <input type="text" v-model="numC" />
        <button @click="handleClick">BTN</button>
    </div>
</template>

<script>
import PropsChild from "@/components/props/index";
import VModel from "@/components/v-model/index";
// import Flex from '@/components/flex/index';
import * as math from 'mathjs'

// import { create, all } from 'mathjs'

export default {
    // props: {
    //   msg: String
    // }
    data() {
        return {
            msg: "parent",
            numA: '',
            numB: '',
            numC: ''
        };
    },
    components: {
        PropsChild,
        VModel,
        // Flex
    },
    created() {
        const consol = function () {
            for (let i = 0; i < arguments.length; i++) {
                console.log(arguments[i])
            }
        }
        // const a = math.chain(3)
        //   .add(4)
        //   .subtract(2)
        //   .done() // 5
        // consol(a)
        // consol(math.chain(0.1))
        // consol(math.chain(0.1).add(0.2))
        // consol(math.chain(0.1).add(0.2).done())
        // consol(math.format(math.chain(0.1).add(0.2).done()))
        // consol(math.chain(math.bignumber(12.11)).add(math.bignumber(12.2)).done())
        // consol(math.format(math.chain(math.bignumber(12.11)).add(math.bignumber(12.2)).done()))
        // consol(math.format(math.chain(math.bignumber('12.11')).add(math.bignumber('12.2')).done()))
        // consol(math.chain(math.bignumber(12.11)).multiply(math.bignumber(12.2)).done())

        // consol(math.chain(0.1).add(0.2))
        // consol(math.chain(0.1).add(0.2).done())
        // consol(math.format(math.chain(0.1).add(0.2).done()))
        // consol(math.format(math.chain(math.bignumber(0.1)).add(math.bignumber(0.2)).done()))
        // const addMumber = math.format(
        //   math.chain(math.bignumber(0.1))
        //     .add(math.bignumber(0.2))
        //     .done()
        // )
        // consol(addMumber)

        // 拆解
        // consol(math.chain(0.1))
        // consol(math.chain(0.1).add(0.2))
        // consol(math.chain(0.1).add(0.2).done())
        // consol(math.chain(0.1).add(0.2).valueOf())
        // consol(math.chain(0.1).add(0.2).toString())
        // consol(typeof math.chain(0.1).add(0.2).done())
        // consol(typeof math.chain(0.1).add(0.2).valueOf())
        // consol(typeof math.chain(0.1).add(0.2).toString())

        // consol(math.format(math.chain(0.1).add(0.2).done())) // 0.30000000000000004
        // consol(typeof math.format(math.chain(0.1).add(0.2).done())) // string

        // const addNumber = math.format(
        //   math.chain(math.bignumber(0.1))
        //     .add(math.bignumber(0.2))
        //     .done()
        // )
        // consol(addNumber) // 0.3

        // const _a = math.bignumber(0.1)
        // consol(_a)
        // const _b = math.add(math.bignumber(0.1), math.bignumber(0.2))
        // consol(_b)
        // consol(math.format(_b))

        // const a = math.format(
        //     math.add(math.bignumber(0.1), math.bignumber(0.2))
        // )

        // Subtract
        // const a = math.chain(1)
        //   .subtract(0.9)
        //   .done()
        // consol(a)

        // const subtractNumber = math.format(
        //   math.chain(1)
        //     .subtract(math.bignumber(0.9))
        //     .done()
        // )
        // consol(subtractNumber)

        // const subtractNumber_1 = math.format(
        //   math.subtract(math.bignumber(1), math.bignumber(0.9))
        // )
        // consol(subtractNumber_1)

        // Multiply
        // consol(11 * 1.2 * 3) // 39.599999999999994

        // const a = math.multiply(11, 1.2, 3)
        // consol(a)

        // const multiplyMumber = math.format(
        //   math.multiply(math.bignumber(11), math.bignumber(1.2), math.bignumber(3))
        // )
        // consol(multiplyMumber)

        // Divide
        // consol(1.2 / 3)

        // const divideNumber = math.format(
        //   math.divide(math.bignumber(1.2), math.bignumber(3))
        // )
        // consol(divideNumber)

        // const divideNumber_1 = math.format(
        //   math.chain(math.bignumber(1.2)).divide(math.bignumber(3)).done()
        // )
        // consol(divideNumber_1)

        // 综合实例
        // consol(
        //     +math.format(
        //         math.round(
        //             math.chain(0.1).add(2, 1).subtract(0.1).multiply(1.2, 33).divide(10000).done(),
        //             3
        //         )
        //     )
        // )

        // 注意，数字变大之后，默认会以科学计数法标识


        // Round
        // consol(math.round(12.0355, 3)) // 12.036
        // consol(math.round(12.0354, 3)) // 12.035
        // consol(math.round(12.0354, 2)) // 12.04
        consol(math.round(12.100, 2)) // 12.1

        // 手动实现一个Round
        // toFixed 即使位数不够，也会用0补充
        // consol(Number(12.035).toFixed(2)) // 12.04
        // consol(Number(12.1).toFixed(2)) // 12.10
        // consol(Number(12).toFixed(2)) // 12.00
        // 结合toFixed，再加上正则匹配
        // function formatNumber(number, len = 2) {
        //     // 四舍五入
        //     number = Number(number).toFixed(len)
        //     // 去尾部的0，注意正则中拼了一个变量len
        //     //   const regStr = `^\\d+(?:\\.\\d{0,${len}})?`
        //     //   const reg = new RegExp(regStr)
        //     //   return Number(number.toString().match(reg))
        //     return Number(number)
        // }
        // consol(formatNumber(12.0355, 3)) // 12.036
        // consol(formatNumber(12.0354, 3)) // 12.035
        // consol(formatNumber(12.0354, 2)) // 12.04
        // consol(formatNumber(12.100, 2)) // 12.1
        // consol(formatNumber(12.1))

        // 手动实现Add
        function add(...numList) {
            const base = 10
            const maxPrecision = numList.reduce((curMaxPrecision, num) => {
                const curPrecision = getNumPrecision(num)
                return curMaxPrecision > curPrecision ? curMaxPrecision : curPrecision
            })
            const enlargeScale = Math.pow(base, maxPrecision)
            const startNum = 0
            const counts = numList.reduce((total, num) => {
                return total + num * enlargeScale
            }, startNum)
            return counts / enlargeScale
        }
        function getNumPrecision(num) {
            return (num.toString().split('.')[1] || '').length
        }
        consol(add(0.12, 0.23, 0.13))
    },
    methods: {
        handleClick() {
            // const consol = function () {
            //     for (let i = 0; i < arguments.length; i++) {
            //         console.log(arguments[i])
            //     }
            // }

        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
