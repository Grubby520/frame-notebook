<template>
    <div>
        <div style="display: flex">
            <div class="fcnt fcnt1">
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt2">
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt3">
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt4">
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt5">
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt6">
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt7">
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt8">
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt9">
                <div class="cnt"></div>
            </div>
        </div>
        <div style="display: flex;margin-top: 10px;">
            <div class="fcnt fcnt11">
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt12">
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt13">
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt14">
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt15">
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt16">
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt17">
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt18">
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt19">
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
        </div>
        <div style="display: flex;margin-top: 10px;">
            <div class="fcnt fcnt21">
                <div class="cnt"></div>
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt22">
                <div class="cnt"></div>
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt23">
                <div class="cnt"></div>
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
            <div class="fcnt fcnt24">
                <div class="cnt"></div>
                <div class="cnt"></div>
                <div class="cnt"></div>
            </div>
        </div>
        <div style="display: flex;margin-top: 10px;">
            <div class="fcnt fcnt31">
                <div class="rows">
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                </div>
                <div class="rows">
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                </div>
            </div>
            <div class="fcnt fcnt32">
                <div class="rows">
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                </div>
                <div class="rows">
                    <div class="cnt"></div>
                </div>
                <div class="rows">
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                </div>
            </div>
            <div class="fcnt fcnt32">
                <div class="rows">
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                </div>
                <div class="rows">
                    <div class="cnt"></div>
                </div>
                <div class="rows">
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                </div>
            </div>
            <div class="fcnt fcnt31">
                <div class="rows">
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                </div>
                <div class="rows">
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                </div>
            </div>
            <div class="fcnt fcnt33">
                <div class="rows">
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                </div>
                <div class="rows">
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                    <div class="cnt"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
        };
    },
    methods: {
    }
};
</script>
<style scoped>
.fcnt {
    display: flex;
    flex: 0 0 auto;
    width: 100px;
    height: 100px;
    margin-right: 10px;
    background: #777;
    border-radius: 5px;
}

.cnt {
    height: 30px;
    width: 30px;
    background: #fff;
    border-radius: 30px;
}

.fcnt1 {
    justify-content: flex-start;
}

.fcnt2 {
    justify-content: center;
}

.fcnt3 {
    justify-content: flex-end;
}

/* justify-content: flex-start; // 主轴对齐方式
  align-items: center; // 交叉轴单行对齐方式 */
.fcnt4 {
    justify-content: flex-start;
    align-items: center;
}

.fcnt5 {
    justify-content: center;
    align-items: center;
}

.fcnt6 {
    justify-content: flex-end;
    align-items: center;
}

.fcnt7 {
    justify-content: flex-start;
    align-items: flex-end;
}

.fcnt8 {
    justify-content: center;
    align-items: flex-end;
}

.fcnt9 {
    justify-content: flex-end;
    align-items: flex-end;
}

.fcnt11 {
    justify-content: space-between;
    align-items: flex-start;
}

.fcnt12 {
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}

.fcnt13 {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}
.fcnt13 div:nth-child(2) {
    align-self: center;
}

.fcnt14 {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}
.fcnt14 div:nth-child(2) {
    align-self: flex-end;
}

.fcnt15 {
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}
.fcnt15 div:nth-child(2) {
    align-self: center;
}

.fcnt16 {
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}
.fcnt16 div:nth-child(2) {
    align-self: flex-end;
}

.fcnt17 {
    flex-direction: column-reverse;
    justify-content: flex-start;
}
.fcnt17 div:nth-child(2) {
    align-self: flex-end;
}

.fcnt18 {
    justify-content: space-between;
    align-items: flex-end;
}

.fcnt19 {
    justify-content: space-between;
    align-items: flex-end;
}
.fcnt19 div:nth-child(2) {
    align-self: flex-start;
}

.fcnt21 {
    flex-direction: column;
    justify-content: space-between;
}

.fcnt22 {
    flex-direction: column;
    justify-content: space-between;
}
.fcnt22 div:nth-child(2) {
    align-self: center;
}

.fcnt22 div:nth-child(3) {
    align-self: flex-end;
}

.fcnt23 {
    flex-direction: column-reverse;
    justify-content: space-between;

    div:nth-child(2) {
        align-self: center;
    }

    div:nth-child(3) {
        align-self: flex-end;
    }
}

.fcnt24 {
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
}
/* align-content: space-between; // 根据内容，必须与wrap配合同时使用 */
.fcnt31 {
    flex-wrap: wrap;
    align-content: space-between;
    /* 
    .rows {
        flex-basis: 100%;
        display: flex;
        justify-content: space-between;
    } */
}

.fcnt32 {
    flex-wrap: wrap;
    align-content: space-between;

    /* .rows {
        flex-basis: 100%;
        display: flex;
        justify-content: space-between;

        &:nth-child(2) {
        justify-content: center;
        }
    } */
}

.fcnt33 {
    flex-direction: column;
    flex-wrap: wrap;
    align-content: space-between;
}
.fcnt33 .rows {
    flex-direction: column;
    flex-basis: 100%;
    display: flex;
    justify-content: space-between;
}
</style>
