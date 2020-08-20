<template>
    <div class="inner-container unpacking-container">
        <div class="search-panel input-wrap">
            <el-form ref="purchaseForm" :model="purchaseForm" size="medium" label-width="142px" @submit.native.prevent>
                <el-form-item label="仓库" class="form-item">
                    <warehouse-select v-model="purchaseForm.warehouseId" @change="onWarehoseChange" type="radio-block"
                        @load-success="onLoadWarehouseSuccess"></warehouse-select>
                </el-form-item>
                <el-form-item label-width="0" class="form-item">
                    <el-dropdown @command="handleCommand" size="medium"
                        style="width:133px;text-align: right;font-size:14px;">
                        <span style="color:#333" class="el-dropdown-link">
                            {{formatNameByType(purchaseForm.searchType)}}
                            <i class="el-icon-arrow-down el-icon--right" style="margin-left:-4px;"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="type in searchTypeOptions" :key="type.value" :command="type.value">
                                {{type.label}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-input ref="searchNumber" v-model.trim="purchaseForm.searchNumber" placeholder="请输入对应的单号或编号"
                        style="width:340px;margin-left:5px" size="medium" class="input" clearable
                        @keyup.enter.native="initTableData"></el-input>
                    <el-button type="primary" size="medium" @click="initTableData">{{$t('button.search')}}</el-button>
                    <span class="count">小计： {{kindQuantity}}种 {{quantity}}个</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="order container word-break" v-show="orderList.length">
            <div class="title md">采购单信息</div>
            <el-tabs v-model="activeOrdePane" type="card" @tab-click="onOrderClick">
                <el-tab-pane :lazy="true" v-for="order in orderList" :key="order.purchaseOrderNumber"
                    :label="order.purchaseOrderNumber" :name="order.purchaseOrderNumber">
                    <!-- 头部信息 -->
                    <div class="order-basic">
                        <el-row class="margin-sm">
                            <el-col :span="4">
                                <span class="item-text">ERP采购单号：</span>
                                {{order.purchaseOrderNumber}}
                            </el-col>
                            <el-col :span="4">
                                <span class="item-text">平台订单号：</span>
                                {{order.supplierOrderNumber}}
                            </el-col>
                            <el-col :span="4">
                                <span class="item-text">供应商编号：</span>
                                {{order.supplierId}}
                            </el-col>
                            <el-col :span="4">
                                <span class="item-text">采购员：</span>
                                {{order.purchaserName}}
                            </el-col>
                            <el-col :span="4">
                                <span class="item-text">下单时间：</span>
                                {{order.orderedAt}}
                            </el-col>
                            <el-col :span="4" style="text-align: right">
                                <el-button type="primary" plain @click="onGoodsRecord(order)">收货记录</el-button>
                            </el-col>
                        </el-row>
                        <el-row class="margin-sm">
                            <el-col>
                                <span class="item-text">物流信息：</span>
                                {{order.logisticsUnpackVOList | switchLogisticsList}}
                            </el-col>
                        </el-row>
                        <el-row class="margin-sm">
                            <el-col>
                                <span class="item-text">备注：</span>
                                {{order.purchaseOrderNotes.join()}}
                            </el-col>
                        </el-row>
                    </div>
                    <!-- sku 列表信息 -->
                    <div class="sku container">
                        <div class="title md">商品信息</div>
                        <div class="sku-list">
                            <el-row v-for="sku in order.itemUnpackVOList" :key="sku.skuId" class="dotted-underline"
                                :gutter="15">
                                <el-col :span="14">
                                    <div class="grid-content">
                                        <el-row :gutter="15">
                                            <el-col :span="4">
                                                <div class="sku-img-bg margin-sm">
                                                    <img :src="sku.imageUrl" />
                                                </div>
                                                <div v-if="sku.similarMode">
                                                    <el-button type="primary" plain @click="onSimilarList(sku)">相似款信息
                                                    </el-button>
                                                </div>
                                            </el-col>
                                            <el-col :span="20">
                                                <el-row class="margin-sm">
                                                    <el-col :span="8">
                                                        <span class="item-text">SKU：</span>
                                                        {{sku.skuCode}}
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span class="item-text">采购属性：</span>
                                                        {{sku.purchaseAttribute}}
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span class="item-text">采购比例：</span>
                                                        {{sku.purchaseRatioQtyOwner + ':' + sku.purchaseRatioQtySupplier}}
                                                        (ERP:供应商)
                                                    </el-col>
                                                </el-row>
                                                <el-row class="margin-sm">
                                                    <el-col>
                                                        <span class="item-text">产品名称：</span>
                                                        {{sku.productName}}
                                                    </el-col>
                                                </el-row>
                                                <el-row class="margin-sm">
                                                    <el-col>
                                                        <span class="item-text">备注：</span>
                                                        {{sku.skuNotes.join()}}
                                                    </el-col>
                                                </el-row>
                                                <el-row class="margin-sm">
                                                    <el-col :span="8">
                                                        <span class="item-text">实际采购量：</span>
                                                        {{sku.realPurchaseQuantity}}
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span class="item-text">已拆包：</span>
                                                        {{sku.unpackedQuantity}}
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span class="item-text">未拆包：</span>
                                                        {{sku.notUnpackQuantity}}
                                                    </el-col>
                                                </el-row>
                                                <el-row class="margin-sm">
                                                    <el-col :span="8">
                                                        <span class="item-text">变参属性：</span>
                                                        {{sku.productVariantAttributes && sku.productVariantAttributes.join('-') || ''}}
                                                    </el-col>
                                                    <el-col :span="8" v-if="sku.locationCode">
                                                        <span class="item-text">货架位：</span>
                                                        {{sku.locationCode}}
                                                    </el-col>
                                                </el-row>
                                                <el-row class="margin-sm">
                                                    <el-col :span="8">
                                                        <span class="item-text">预估重量(g)：</span>
                                                        {{sku.estimatedWeight}}
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span class="item-text">打版重量(g)：</span>
                                                        {{sku.plateWeight}}
                                                    </el-col>
                                                    <el-col :span="8">
                                                        <span class="item-text">入库重量(g)：</span>
                                                        <span>
                                                            <el-input placeholder="正整数" v-model="sku.storageWeight"
                                                                v-slFormatNumber="{type: 'integer', obj: sku, key: 'storageWeight', max: 999999}"
                                                                @keyup.enter.native="onWeightSubmit(sku)"
                                                                class="input short no-wrap"></el-input>
                                                            <el-button type="primary" :disabled="disabledBtn"
                                                                @click="onWeightSubmit(sku)">
                                                                {{$t('button.determine')}}</el-button>
                                                        </span>
                                                    </el-col>
                                                </el-row>
                                                <el-row class="margin-sm">
                                                    <el-col>
                                                        <span class="item-text">到货数量：</span>
                                                        <span>
                                                            <el-input placeholder="正整数" v-model="sku.unpackQuantity"
                                                                v-slFormatNumber="{type: 'integer', obj: sku, key: 'unpackQuantity'}"
                                                                @keyup.enter.native="onGoodsSubmit(sku)"
                                                                class="input short"></el-input>
                                                            <el-button type="primary" :disabled="disabledBtn"
                                                                @click="onGoodsSubmit(sku)">确认收货
                                                            </el-button>
                                                        </span>
                                                    </el-col>
                                                </el-row>
                                                <el-row class="margin-sm">
                                                    <el-col>
                                                        <span class="item-text">打&emsp;&emsp;印：</span>
                                                        <span>
                                                            <el-input placeholder="正整数" v-model="sku.printCounts"
                                                                v-slFormatNumber="{type: 'integer', obj: sku, key: 'printCounts', max: 999}"
                                                                @keyup.enter.native="onPrintSubmit(sku)"
                                                                class="input short"></el-input>
                                                            <el-button type="primary" :disabled="!sku.unpackedQuantity"
                                                                @click="onPrintSubmit(sku)">打印标签</el-button>
                                                        </span>
                                                    </el-col>
                                                </el-row>
                                                <el-row class="margin-sm">
                                                    <el-col>
                                                        <span class="item-text">多&emsp;&emsp;货：</span>
                                                        <span>
                                                            <el-input placeholder="正整数" v-model="sku.moreStockQuantity"
                                                                v-slFormatNumber="{type: 'integer', obj: sku, key: 'moreStockQuantity', max: 99999}"
                                                                @keyup.enter.native="onExceedSubmit(sku)"
                                                                class="input short"></el-input>
                                                            <el-button type="primary" :disabled="disabledBtn"
                                                                @click="onExceedSubmit(sku)">
                                                                {{$t('button.confirm')}}</el-button>
                                                        </span>
                                                    </el-col>
                                                </el-row>
                                                <el-row class="margin-sm">
                                                    <el-col>
                                                        <ul class="remark-text">
                                                            <li>说明：</li>
                                                            <li>1、多到货无法输入到货数量和入库，请记录在多到货中，等待采购处理，你可以在多货管理中查看处理情况；</li>
                                                            <li>2、发现有质量问题请联系采购退货，不要到货、入库。</li>
                                                        </ul>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                                <el-col :span="10">
                                    <div class="grid-content">
                                        <el-row>
                                            <el-col>
                                                <div class="other-orders">
                                                    <other-unpack-orders :sku="sku"></other-unpack-orders>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="no-data--container" v-show="!orderList.length">
            <div class="no-data text-center">
                <span>{{defaultPraceholder}}</span>
            </div>
        </div>

        <!-- 收货记录 -->
        <goods-record ref="goodsRecord"></goods-record>
        <!-- 相似款信息 -->
        <similar-mode ref="similarMode"></similar-mode>
        <!-- 打印批次号 -->
        <print-batch-no ref="printBatchNo"></print-batch-no>
    </div>
</template>

<script>
import Warehouse from '@/api/warehouse'
import OtherUnpackOrders from './modals/otherUnpackOrders'
import GoodsRecord from './modals/goodsRecord'
import SimilarMode from './modals/similarMode'
import PrintBatchNo from './modals/printBatchNo'
import mixin from '@/utils/mixin'
import WarehouseSelect from '../../components/WarehouseSelect'
import { alertDialog, alertDialogAutoClose } from '@/utils/UITools'
export default {
    components: {
        OtherUnpackOrders,
        GoodsRecord,
        SimilarMode,
        PrintBatchNo,
        WarehouseSelect
    },
    mixins: [mixin],
    data() {
        return {
            warehouseList: [],
            purchaseForm: {
                warehouseId: this.getDefaultWarehouseId(),
                searchNumber: '', // 调试代码
                searchType: 'TRACKING_NUMBER' // 默认值
            },
            searchTypeOptions: [
                {
                    label: '物流单号',
                    value: 'TRACKING_NUMBER'
                },
                {
                    label: 'ERP采购单号',
                    value: 'PURCHASE_ORDER_NUMBER'
                },
                {
                    label: '平台订单号',
                    value: 'SUPPLIER_ORDER_NUMBER'
                },
                {
                    label: '供应商编号',
                    value: 'SUPPLIER_ID'
                }
            ],
            orderList: [],
            activeOrdePane: '',
            activeOrder: {}, // 暂时没有使用

            pager: {
                pageSize: 10,
                pageIndex: 1,
                total: 0
            },
            pageSizes: [10, 20, 30],
            kindQuantity: 0,
            quantity: 0,
            defaultPraceholder: '暂无数据！',
            errorSupplierId: '不存在此供应商',
            noDataPraceholder: '无对应的采购单号！',
            warehouseIdBefore: '',
            disabledBtn: false // 禁用按钮
        }
    },
    methods: {
        // 获取仓库列表
        onLoadWarehouseSuccess(data) {
            this.warehouseList = data
            this.warehouseIdBefore = (data[0] && data[0].value) || ''
            this.isLinkFromMoreStock()
        },
        isLinkFromMoreStock() {
            const { purchaseOrderNumber, warehouseId } = this.$route.query
            if (purchaseOrderNumber && warehouseId) {
                this.purchaseForm = {
                    warehouseId: warehouseId,
                    searchNumber: purchaseOrderNumber,
                    searchType: 'PURCHASE_ORDER_NUMBER'
                }
                this.initTableData()
            }
        },
        onWarehoseChange() {
            if (this.purchaseForm.warehouseId === this.warehouseIdBefore) {
                return
            }
            this.warehouseIdBefore = this.purchaseForm.warehouseId
            this.purchaseForm.searchNumber = ''
        },
        // 物流单号下拉事件
        handleCommand(command) {
            this.purchaseForm.searchType = command
        },
        // 格式化类型对应的label
        formatNameByType(searchType) {
            const item = this.searchTypeOptions.find(
                (item) => item.value === searchType
            )
            return (item && item.label) || ''
        },
        // 获取商品信息列表数据
        initTableData() {
            if (!this.purchaseForm.searchNumber) {
                // this.$message.warning('请输入对应的单号或编号！')
                alertDialog(this, 'error', '请输入对应的单号或编号！')
                return
            }
            Warehouse.getUnpackInfo({
                ...this.purchaseForm,
                noPromptError: true
            })
                .then((res) => {
                    if (res.success) {
                        this.kindQuantity =
                            (res.data && res.data.kindQuantity) || 0
                        this.quantity = (res.data && res.data.quantity) || 0
                        this.orderList =
                            (res.data && res.data.purchaseOrderUnpackVos) || []
                        // only init
                        // PS: ：默认情况下为'0'(组件踩坑)
                        this.activeOrdePane =
                            (this.orderList[0] &&
                                this.orderList[0].purchaseOrderNumber) ||
                            ''
                        if (!this.orderList.length) {
                            alertDialogAutoClose(
                                this,
                                'warning',
                                this.noDataPraceholder
                            )
                        }
                    }
                })
                .catch((error) => {
                    this.$refs.searchNumber.blur()
                    alertDialog(
                        this,
                        'error',
                        error.data.error.message,
                        (action, instance) => {
                            this.$refs.searchNumber.focus()
                        }
                    )
                })
        },
        // 采购单tabs切换点击事件
        onOrderClick(tab) {
            this.activeOrder =
                this.orderList.find(
                    (item) => item.purchaseOrderNumber === this.activeOrdePane
                ) || {}
        },

        // 点击收货记录按钮
        onGoodsRecord(order) {
            this.$refs.goodsRecord.show(order)
        },
        // 点击查看相似款
        onSimilarList(item) {
            this.$refs.similarMode.show(item)
        },
        // 点击入库重量按钮
        onWeightSubmit(sku) {
            if (this.setDisable()) {
                const { purchaseOrderItemId, skuId, storageWeight } = sku
                if (storageWeight) {
                    Warehouse.putUnpackSyncWeight({
                        purchaseOrderItemId,
                        skuId,
                        storageWeight,
                        noPromptError: true
                    })
                        .then((res) => {
                            if (res.success) {
                                // this.$message.success('入库重量保存成功！')
                                alertDialogAutoClose(
                                    this,
                                    'success',
                                    '入库重量保存成功！'
                                )
                            }
                        })
                        .catch((error) => {
                            alertDialog(this, 'error', error.data.error.message)
                        })
                        .finally(this.cancelDisable)
                } else {
                    // this.$message.warning('请输入入库重量！')
                    alertDialog(this, 'error', '请输入入库重量！')
                    this.cancelDisable()
                }
            }
        },
        // 点击确认收货按钮
        onGoodsSubmit(sku) {
            if (this.setDisable()) {
                const {
                    purchaseOrderItemId,
                    unpackQuantity,
                    realPurchaseQuantity = 0,
                    unpackedQuantity = 0
                } = sku
                if (unpackQuantity) {
                    if (
                        unpackQuantity >
                        realPurchaseQuantity - unpackedQuantity
                    ) {
                        // this.$message({
                        //     message: '到货数量不能大于未拆包数量！',
                        //     type: 'warning',
                        //     duration: 5000
                        // })
                        alertDialog(
                            this,
                            'warning',
                            '到货数量不能大于未拆包数量！'
                        )
                        this.cancelDisable()
                        return
                    }
                    Warehouse.putUnpack({
                        purchaseOrderItemId,
                        unpackQuantity,
                        noPromptError: true
                    })
                        .then((res) => {
                            if (res.success) {
                                // this.$message.success('到货保存成功！')
                                alertDialogAutoClose(
                                    this,
                                    'success',
                                    '到货保存成功！'
                                )
                                const {
                                    unpackQuantity,
                                    purchaseBatchNo
                                } = res.data
                                // feature update: 拆包成功（入库，处理多到货）后，不刷新页面，只更新数量（规避拆包完成之后，数据消失，没法处理多货，除非type选择供应商编号）
                                this.$set(sku, 'printCounts', unpackQuantity)
                                sku.purchaseBatchNo = purchaseBatchNo // 未拆包状态第一次拆包无批次号
                                sku.unpackedQuantity += +unpackQuantity
                                sku.notUnpackQuantity =
                                    realPurchaseQuantity - sku.unpackedQuantity
                            }
                        })
                        .catch((error) => {
                            alertDialog(this, 'error', error.data.error.message)
                        })
                        .finally(this.cancelDisable)
                } else {
                    // this.$message.warning('请输入到货数量！')
                    alertDialog(this, 'error', '请输入到货数量！')
                    this.cancelDisable()
                }
            }
        },
        // 点击打印按钮
        onPrintSubmit(sku) {
            const skuFormat = Object.assign({}, sku, {
                whereFrom: 'unpacking'
            })
            this.$refs.printBatchNo.show(skuFormat)
        },
        // 点击多货确认按钮
        onExceedSubmit(sku) {
            if (this.setDisable()) {
                const { purchaseOrderItemId, moreStockQuantity } = sku
                if (moreStockQuantity) {
                    Warehouse.postPurchaseMoreStock({
                        purchaseOrderItemId,
                        moreStockQuantity: +moreStockQuantity,
                        noPromptError: true
                    })
                        .then((res) => {
                            if (res.success) {
                                // this.$message.success('多货处理保存成功！')
                                alertDialogAutoClose(
                                    this,
                                    'success',
                                    '多货处理保存成功！'
                                )
                            }
                        })
                        .catch((error) => {
                            alertDialog(this, 'error', error.data.error.message)
                        })
                        .finally(this.cancelDisable)
                } else {
                    // this.$message.warning('请输入多货数量！')
                    alertDialog(this, 'error', '请输入多货数量！')
                    this.cancelDisable()
                }
            }
        },
        // 控制点击频率
        setDisable() {
            if (this.disabledBtn) {
                return false
            }
            this.disabledBtn = true
            return true
        },
        cancelDisable() {
            this.disabledBtn = false
        }
    },
    filters: {
        switchLogisticsList(list) {
            let resultStr = ''
            if (typeof list === 'string') {
                return list
            }
            if (Array.isArray(list)) {
                list.forEach((item) => {
                    resultStr +=
                        item.logisticsCompanyName +
                        ',' +
                        item.trackingNumber +
                        ';'
                })
            }
            return resultStr
        }
    }
}
</script>

<style lang="scss" scoped>
.unpacking-container {
    .search-panel {
        border: solid 1px#dcd7d7;
        border-radius: 4px;
        padding: 15px;
        padding-bottom: 0px;
    }
    .form-item {
        .el-form-item__label {
            height: 42px;
            line-height: 42px;
            font-size: 18px;
        }
        .input {
            .el-input__inner {
                font-weight: 600; // font-weight:bold;
                font-size: 20px;
                height: 42px;
                line-height: 42px;
                color: #3a3d40; //#4e4f72
                font-family: Microsoft YaHei;
            }
        }
    }
    .title {
        font-weight: 600;
        &.md {
            font-size: 22px;
            margin: 10px 0 20px 0;
        }
    }
    .margin-sm {
        margin-bottom: 10px;
    }
    .input {
        &.short {
            width: 100px;
        }
        &.no-wrap {
            width: 70px;
        }
    }
    .container {
        padding: 5px 0 10px 0;
        .grid-content {
            padding: 10px 0;
        }
        &.sku {
            .sku-img-bg {
                width: 100%;
                height: 250px;
                img {
                    width: auto;
                    height: auto;
                    max-width: 100%;
                    max-height: 100%;
                }
            }
            .remark-text {
                color: #ff3a3a;
            }
            .dotted-underline {
                border-bottom: 1px dotted #afafaf;
            }
        }
        .order-basic {
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;
        }
    }
    .count {
        color: #343638;
        margin-left: 20px;
        font-size: 14px;
    }
    .item-text {
        color: #b1b1b1;
    }
}
.no-data--container {
    margin: 20px 0;
    user-select: none;
}
</style>
