<template>
    <div class="stock-order-table">
        <div ref="optBox">
            <div v-if="[0, 1, 2, 3, 4, 5, 6].includes(purchaseOrderStatus)" :class="{'floatOpt': isFloatOpt}">
                <StockOrderButtons :purchaseOrderStatus="purchaseOrderStatus"
                    :purchaseOrderSelection="purchaseOrderSelection"></StockOrderButtons>
            </div>
        </div>
        <div ref="listBox">
            <el-row>
                <el-col :span="11">
                    <el-pagination class="movie-bottom-page m-t10" background
                        layout="total, sizes, prev, pager, next, jumper" :total="total"
                        :current-page="pageQuery.pageIndex" :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageQuery.pageSize" @current-change="currentChange" @size-change="sizeChange">
                    </el-pagination>
                </el-col>
                <el-col :span="13">
                    <div style="margin-top: 20px; text-align: right; font-size: 12px; color: red;">
                        提示：如出现横向滚动条，查看订单更多信息，请选中订单后，通过键盘方向键← →滑动查看
                    </div>
                </el-col>
            </el-row>
            <el-table :data="columns" v-loading="loading" border stripe style="width: 100%"
                @selection-change="handleSelectionChange" :expand-row-keys="expandRowKeys" row-key="id">
                <el-table-column fixed="left" type="selection" width="40">
                </el-table-column>
                <el-table-column label="订单信息" min-width="230">
                    <template slot-scope="scope">
                        <p class="stress">
                            <label>ERP采购单号:</label>
                            <span>{{scope.row.purchaseOrderNumber}}</span>
                        </p>
                        <p>
                            <label>公司主体:</label>
                            <span>{{scope.row.companyMainBody}}</span>
                        </p>
                        <p>
                            <label>仓库:</label>
                            <span>{{scope.row.warehouseName}}</span>
                        </p>
                        <p>
                            <label>下单平台:</label>
                            <span>{{scope.row.supplierOrderPlatform | formatSupplierOrderPlatform}}</span>
                        </p>
                        <p>
                            <label>下单账号:</label>
                            <span>{{scope.row.buyerAccount}}</span>
                        </p>
                        <p>
                            <label>下单方式:</label>
                            <span>{{scope.row.supplierOrderType | formatSupplierOrderType}}</span>
                        </p>
                        <p>
                            <label>平台订单状态:</label>
                            <span>{{scope.row.supplierOrderStatus | formatSupplierOrderStatus}}</span>
                        </p>
                        <p>
                            <label>平台:</label>
                            <span>{{scope.row.supplierPlatformName}}</span>
                        </p>
                        <p>
                            <label>平台订单号:</label>
                            <span>{{scope.row.supplierOrderNumber}}</span>
                            <el-button v-if="[0, 2, 3,].includes(purchaseOrderStatus)" type="text"
                                style="font-size: 14px;" @click="clickUpdatePlatformOrderNum(scope.row)">
                                更改平台订单号
                            </el-button>
                        </p>
                        <p>
                            <label>采购员:</label>
                            <span>{{scope.row.purchaserName}}</span>
                        </p>
                        <p>
                            <label>下单时间:</label>
                            <span>{{scope.row.createdAt}}</span>
                        </p>
                        <p>
                            <span class="table-blue" @click="handleConsignee(scope.row)">收件信息</span>
                        </p>
                        <template v-if="purchaseOrderStatus === 7">
                            <p>
                                <label>审核时间:</label>
                                <span>{{scope.row.auditedAt}}</span>
                            </p>
                            <p>
                                <label>确认时间:</label>
                                <span>{{scope.row.confirmedAt}}</span>
                            </p>
                            <p>
                                <label>发货时间:</label>
                                <span>{{scope.row.shippedAt}}</span>
                            </p>
                            <p>
                                <label>收货时间:</label>
                                <span>{{scope.row.receiptedAt}}</span>
                            </p>
                            <p>
                                <label>完成时间:</label>
                                <span>{{scope.row.completedAt}}</span>
                            </p>
                            <p>
                                <label>核销时间:</label>
                                <span>{{scope.row.consumedAt}}</span>
                            </p>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="供应商" min-width="96">
                    <template slot-scope="scope">
                        <p>
                            <label>供应商编号:</label><br>
                            <span>{{scope.row.currentSupplierId}}</span>
                        </p>
                        <p class="m-t10">
                            <label>供应商名称:</label><br>
                            <span>{{scope.row.currentSupplierName}}</span>
                        </p>
                        <p class="m-t10" v-if="scope.row.aliImLink">
                            <a :href="scope.row.aliImLink" target="_blank" class="table-blue"><img
                                    src="@/assets/images/icon-aliwangwang.png" class="icon-aliwangwang"
                                    title="阿里旺旺"></a>
                        </p>
                        <p class="m-t10">
                            <label>结算方式:</label><br>
                            <span>{{scope.row.clearingForm | formatClearingForm}}</span>
                        </p>
                    </template>
                </el-table-column>
                <!-- start 需求: sku维度的单独放在子table里面展示 -->
                <el-table-column type="expand" label="" width="1" class-name="col-hidden">
                    <template slot-scope="props">
                        <!-- 子table -->
                        <!-- <p>{{JSON.stringify(props.row)}}</p> -->
                        <el-table :data="[props.row]" border stripe style="width: 100%">
                            <template v-for="(sku) in skuFixedColumn">
                                <el-table-column :label="sku.label" min-width="136" :key="sku.value">
                                    <template slot-scope="scope">
                                        <div class="table-td-wrap" v-for="(item, index) in scope.row.purchaseOrderItems"
                                            :key="index">
                                            <div class="table-td-cell">
                                                <!-- 图片名称 -->
                                                <el-popover v-if="sku.value === 'imageUrl'" placement="right"
                                                    trigger="hover">
                                                    <img :src="item.imageUrl"
                                                        style="max-height: 300px; max-width: 300px" />
                                                    <div class="img-wrap" slot="reference">
                                                        <img :src="item.imageUrl" :alt="item.imageUrl" class="sku-img">
                                                    </div>
                                                </el-popover>
                                                <!-- sku -->
                                                <p v-if="sku.value === 'skuCode'">
                                                    <span title="skuCode">{{item.skuCode}}</span>
                                                </p>
                                                <!-- 产品名称 -->
                                                <p v-if="sku.value === 'productName'">
                                                    <span>{{item.productName}}</span>
                                                </p>
                                                <!-- 销售属性 -->
                                                <p
                                                    v-if="sku.value === 'skuAttrs' && item.skuAttrs && item.skuAttrs.length>0">
                                                    <span>{{item.skuAttrs.join('/')}}</span>
                                                </p>
                                                <!-- 采购属性 -->
                                                <p v-if="sku.value === 'supplierSkuAttr' && item.supplierSkuAttr">
                                                    <span>{{item.supplierSkuAttr}}</span>
                                                </p>
                                                <!-- 其他信息 -->
                                                <div v-if="sku.value === 'detail'">
                                                    <p v-if="item.purchaseUrl">
                                                        <a class="table-blue" :href="item.purchaseUrl"
                                                            target="_blank">链接</a>
                                                    </p>
                                                    <p v-if="item.similarMode">
                                                        <span class="table-blue"
                                                            @click="onPurchaseSimilarInfo(scope.row, index, item)">类似款信息</span>
                                                    </p>
                                                    <p
                                                        v-if="item.originSupplierName && item.originSupplierName !== scope.row.currentSupplierName">
                                                        <span class="table-blue"
                                                            @click="onOriginSupplierOpen(item)">原供应商</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                            </template>
                            <el-table-column width="180">
                                <template slot="header">
                                    <span>采购单价</span>
                                    <StarLinkPoper position="top" v-if="[0, 2].includes(purchaseOrderStatus)">
                                        <div slot="pop" class="sl-poper">
                                            <p>说明</p>
                                            <p>&emsp;&emsp;最近一次：取该SKU状态为已完成、时间最近的采购单的采购价。</p>
                                            <p>&emsp;&emsp;最低：取该SKU状态为已完成的所有采购单的最低采购价。</p>
                                        </div>
                                        <i class="el-icon-question"></i>
                                    </StarLinkPoper>
                                </template>
                                <template slot-scope="scope">
                                    <div class="table-td-wrap" v-for="(item, index) in scope.row.purchaseOrderItems"
                                        :key="index">
                                        <div class="table-td-cell">
                                            <p class="real-price">
                                                <label>实际:</label>
                                                <span v-if="[0, 2].includes(purchaseOrderStatus)" class="input-style"
                                                    :class="{'color-red': item.realPrice !== item.systemPrice}"
                                                    @click="handleSkuPrice(scope.row, item)" v-text="item.realPrice">
                                                </span>
                                                <span v-else v-text="item.realPrice"></span>
                                                <span class="real-price-bg"
                                                    :class="{ 'roundness-bg-red': item.priceChangePercent >= 0, 'roundness-bg-green': item.priceChangePercent < 0 }"
                                                    v-if="item.priceChangePercent !== '' && item.priceChangePercent !== 'undefined' && item.priceChangePercent !== null && Math.round(item.priceChangePercent) !== 0">
                                                    {{item.priceChangePercent | formatPriceChangePercent}}
                                                </span>
                                            </p>
                                            <p v-show="[1, 3, 4, 5, 6, 7, 8].includes(purchaseOrderStatus)">
                                                <span class="table-blue"
                                                    @click="onChangeReason(scope.row, index, 1)">更改原因</span>
                                            </p>
                                            <p v-show="showNumItem(item.systemPrice)">
                                                <label>系统:</label>
                                                <span>{{item.systemPrice}}</span>
                                            </p>
                                            <p v-show="showNumItem(item.lastPurchasedPrice)">
                                                <label>最近一次:</label>
                                                <span>{{item.lastPurchasedPrice}}</span>
                                            </p>
                                            <p v-show="showNumItem(item.lowestPrice)">
                                                <label>最低:</label>
                                                <span>{{item.lowestPrice}}</span>
                                            </p>
                                            <p>
                                                <label>平台:</label>
                                                <span>{{item.platformPrice}}</span>
                                            </p>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购量" width="180">
                                <template slot-scope="scope">
                                    <div class="table-td-wrap" v-for="(item, index) in scope.row.purchaseOrderItems"
                                        :key="index">
                                        <div class="table-td-cell">
                                            <p class="real-price">
                                                <label>实际:</label>
                                                <span v-if="[0, 2].includes(purchaseOrderStatus)" class="input-style"
                                                    :class="{'color-red': item.realPurchaseQuantity !== item.advicePurchaseQuantity}"
                                                    @click="handleSkuCount(scope.row, item)"
                                                    v-text="item.realPurchaseQuantity">
                                                </span>
                                                <span v-else v-text="item.realPurchaseQuantity"></span>
                                                <span class="real-price-bg"
                                                    :class="{ 'roundness-bg-red': item.quantityChangePercent >= 0, 'roundness-bg-green': item.quantityChangePercent < 0 }"
                                                    v-if="item.quantityChangePercent !== '' && item.quantityChangePercent !== 'undefined' && item.quantityChangePercent !== null && Math.round(item.quantityChangePercent) !== 0">
                                                    {{item.quantityChangePercent | formatPriceChangePercent}}
                                                </span>
                                            </p>
                                            <p v-if="[1, 3, 4, 5, 6, 7, 8].includes(purchaseOrderStatus)">
                                                <span class="table-blue"
                                                    @click="onChangeReason(scope.row, index, 0)">更改原因</span>
                                            </p>
                                            <p>
                                                <label>建议:</label>
                                                <span>{{item.advicePurchaseQuantity}}</span>
                                            </p>
                                            <p>
                                                <label>采购比例:</label>
                                                <span>{{item.purchaseRatioQtyOwner}}:{{item.purchaseRatioQtySupplier}}</span>
                                            </p>
                                            <p>
                                                <label>平台:</label>
                                                <span>{{item.platformQuantity}}</span>
                                            </p>
                                            <p>
                                                <label>日销量:</label>
                                                <span>{{item.averageQuantity}}</span>
                                            </p>
                                            <p>
                                                <label>购销状态:</label>
                                                <span>{{item.skuStatusName}}</span>
                                            </p>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="小计金额" min-width="78">
                                <template slot-scope="scope">
                                    <div class="table-td-wrap" v-for="(item, index) in scope.row.purchaseOrderItems"
                                        :key="index">
                                        <div class="table-td-cell">
                                            <p title="小计金额">{{item.subtotalPrice}}</p>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="[5, 6, 7].includes(purchaseOrderStatus)" label="仓库收货" width="82">
                                <template slot-scope="scope">
                                    <div class="table-td-wrap" v-for="(item, index) in scope.row.purchaseOrderItems"
                                        :key="index">
                                        <div class="table-td-cell">
                                            <p v-if="item.unpackedQuantity">
                                                <label>已拆包量:</label><br>
                                                <span>{{item.unpackedQuantity}}</span>
                                            </p>
                                            <p v-if="item.receiptedQuantity">
                                                <label>已入库量:</label><br>
                                                <span>{{item.receiptedQuantity}}</span>
                                            </p>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="[5, 6, 7].includes(purchaseOrderStatus)" label="入库少货" width="110">
                                <template slot-scope="scope">
                                    <div class="table-td-wrap" v-for="(item, index) in scope.row.purchaseOrderItems"
                                        :key="index">
                                        <div class="table-td-cell">
                                            <p v-if="item.wastageQuantity">
                                                <label>损耗量:</label><br>
                                                <span>{{item.wastageQuantity}}</span>
                                            </p>
                                            <p v-if="item.supplierRefundQuantity">
                                                <label>供应商退款量:</label><br>
                                                <span>{{item.supplierRefundQuantity}}</span>
                                            </p>
                                            <p v-if="item.supplierReissueQuantity">
                                                <label>供应商补发量:</label><br>
                                                <span>{{item.supplierReissueQuantity}}</span>
                                            </p>
                                            <p v-if="item.reissuePurchaseOrderNumber">
                                                <span class="table-blue" title="补发单号"
                                                    v-for="(reissuePurchaseOrderNumber, i) in item.reissuePurchaseOrderNumber"
                                                    :key="i" @click="openPurchaseOrder(reissuePurchaseOrderNumber)">
                                                    {{reissuePurchaseOrderNumber}}{{ i === item.reissuePurchaseOrderNumber.length-1 ? '' : ','}}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>

                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column label="SKU" align="center" width="80">
                    <template slot-scope="scope">
                        <p>{{scope.row._skusAmount}}</p>
                        <el-button type="text" size="lg" @click="handleExpandBtn(scope.row)">
                            {{returnExpandText(scope.row)}}
                        </el-button>
                    </template>
                </el-table-column>
                <!-- 新增一列 -->
                <el-table-column label="订单总数">
                    <template slot-scope="scope">
                        <p>
                            <label>总采购数:</label>
                            <span>{{scope.row._skuCountsAmount}}</span>
                        </p>
                        <p>
                            <label>总拆包数:</label>
                            <span>{{scope.row._unpackedQuantityAmount}}</span>
                        </p>
                        <p>
                            <label>总入库数:</label>
                            <span>{{scope.row._receiptedQuantityAmount}}</span>
                        </p>
                        <p>
                            <label>总少货数:</label>
                            <span>{{scope.row._lessQuantityAmount}}</span>
                        </p>
                    </template>
                </el-table-column>
                <!-- end -->
                <el-table-column min-width="138">
                    <template slot="header">
                        <span>ERP金额</span>
                        <StarLinkPoper position="top" v-if="[0, 2].includes(purchaseOrderStatus)">
                            <div slot="pop" class="sl-poper">
                                <p>1、下单平台为1688的订单，只有在已下单、审核拒绝状态才允许更改运费、折扣</p>
                                <p>2、下单平台为线下的订单，在待审核、已取消、已完成、已核销以外的订单状态下，均允许修改运费和折扣，但是注意：（运费-折扣）不能小于（已付+待付+待审核）中的（运费-折扣）的和。
                                </p>
                                <p>3、折扣不能大于运费。</p>
                            </div>
                            <i class="el-icon-question"></i>
                        </StarLinkPoper>
                    </template>
                    <template slot-scope="scope">
                        <p>
                            <label>总金额:</label>
                            <span>{{scope.row.totalAmount}}</span>
                        </p>
                        <p>
                            <label>商品金额:</label>
                            <span>{{scope.row.productAmount}}</span>
                        </p>
                        <p class="margin-bottom-6">
                            <label>运费:</label>
                            <span
                                v-if="([0, 2].includes(purchaseOrderStatus) && scope.row.supplierOrderPlatform === 1) || ([0, 2, 3, 4, 5].includes(purchaseOrderStatus) && scope.row.supplierOrderPlatform === 0)"
                                class="input-style" @click="handleOrderFreight(scope.row)">{{scope.row.shipFee}}</span>
                            <span v-else>{{scope.row.shipFee}}</span>
                        </p>
                        <p>
                            <label>折扣:</label>
                            <span
                                v-if="([0, 2, 3, 4, 5].includes(purchaseOrderStatus) && scope.row.supplierOrderPlatform === 0) || ([0, 2].includes(purchaseOrderStatus) && scope.row.supplierOrderPlatform === 1)"
                                class="input-style"
                                @click="handleOrderDiscount(scope.row)">{{scope.row.discountAmount}}</span>
                            <span v-else>{{scope.row.discountAmount}}</span>
                        </p>
                        <p>
                            <label>已入库金额:</label>
                            <span>{{scope.row._packedPriceAmount}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column width="109">
                    <template slot="header">
                        <span>平台金额</span>
                        <StarLinkPoper position="top" v-if="[0, 1, 2, 3, 4, 5, 6, 7].includes(purchaseOrderStatus)">
                            <div slot="pop" class="sl-poper">
                                <p>如果对接了平台，那么是表示从平台同步回来的订单金额，</p>
                                <p>当申请付款时，平台金额必须等于ERP金额。</p>
                            </div>
                            <i class="el-icon-question"></i>
                        </StarLinkPoper>
                    </template>
                    <template slot-scope="scope">
                        <p v-if="scope.row.supplierTotalAmount">
                            <label>总金额:</label><br>
                            <span
                                :class="{'color-red': scope.row.supplierTotalAmount !== scope.row.totalAmount }">{{scope.row.supplierTotalAmount}}</span>
                        </p>
                        <p v-if="scope.row.supplierProductAmount">
                            <label>商品金额:</label><br>
                            <span>{{scope.row.supplierProductAmount}}</span>
                        </p>
                        <p v-if="scope.row.supplierShipFee">
                            <label>运费:</label><br>
                            <span>{{scope.row.supplierShipFee}}</span>
                        </p>
                        <p v-if="scope.row.supplierDiscountAmount">
                            <label>折扣:</label><br>
                            <span>{{scope.row.supplierDiscountAmount}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column v-if="[3, 4, 5, 6, 7, 8].includes(purchaseOrderStatus)" label="付款信息" width="110">
                    <template slot-scope="scope">
                        <p v-if="scope.row.paidTotalAmount">
                            <label>已付总金额:</label><br>
                            <span>{{scope.row.paidTotalAmount}}</span>
                        </p>
                        <p v-if="scope.row.paidProductAmount">
                            <label>商品金额:</label><br>
                            <span>{{scope.row.paidProductAmount}}</span>
                        </p>
                        <p v-if="scope.row.paidFreightDiscountAmount">
                            <label>运费-折扣:</label><br>
                            <span>{{scope.row.paidFreightDiscountAmount}}</span>
                        </p>
                        <p v-if="scope.row.toPayTotalAmount" class="m-t10">
                            <label>待付总金额:</label><br>
                            <span>{{scope.row.toPayTotalAmount}}</span>
                        </p>
                        <p v-if="scope.row.toPayProductAmount">
                            <label>商品金额:</label><br>
                            <span>{{scope.row.toPayProductAmount}}</span>
                        </p>
                        <p v-if="scope.row.toPayFreightDiscountAmount">
                            <label>运费-折扣:</label><br>
                            <span>{{scope.row.toPayFreightDiscountAmount}}</span>
                        </p>
                        <p v-if="scope.row.toAuditTotalAmount" class="m-t10">
                            <label>待审核总金额:</label><br>
                            <span>{{scope.row.toAuditTotalAmount}}</span>
                        </p>
                        <p v-if="scope.row.toAuditProductAmount">
                            <label>商品金额:</label><br>
                            <span>{{scope.row.toAuditProductAmount}}</span>
                        </p>
                        <p v-if="scope.row.toAuditFreightDiscountAmount">
                            <label>运费-折扣:</label><br>
                            <span>{{scope.row.toAuditFreightDiscountAmount}}</span>
                        </p>
                        <p v-if="scope.row.fineAmount" class="m-t10">
                            <label>罚款金额:</label><br>
                            <span>{{scope.row.fineAmount}}</span>
                        </p>
                        <p v-if="scope.row.refundAmount" class="m-t10">
                            <label>已退款金额:</label><br>
                            <span>{{scope.row.refundAmount}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="78">
                    <template slot-scope="scope">
                        {{scope.row.purchaseOrderStatus | formatPurchaseOrderStatus}}
                    </template>
                </el-table-column>
                <el-table-column v-if="purchaseOrderStatus === 2" prop="auditRejectReason" label="拒绝原因" min-width="120">
                </el-table-column>
                <el-table-column v-if="[5, 6, 7].includes(purchaseOrderStatus)" label="仓库收货记录" width="106">
                    <template slot-scope="scope">
                        <div class="table-td-wrap" v-for="(item, index) in scope.row.warehouseReceiptInfos"
                            :key="index">
                            <p class="table-td-cell">
                                <label title="物流公司名称">{{item.logisticsCompanyName}}:</label><br>
                                <span title="物流单号">{{item.logisticsBillNumber}}</span>
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <!--  fixed="right" -->
                <el-table-column width="120">
                    <template slot="header">
                        <span>操作</span>
                        <StarLinkPoper position="top" v-if="[0, 8].includes(purchaseOrderStatus)">
                            <div slot="pop" class="sl-poper">
                                <p>1、重新创建采购计划后，该订单将自动取消，将在采购计划中生成重新下单类型的采购计划。</p>
                            </div>
                            <i class="el-icon-question"></i>
                        </StarLinkPoper>
                    </template>
                    <template slot-scope="scope">
                        <p>
                            <el-button type="text" size="small"
                                v-if="purchaseOrderStatus === 5 && scope.row.disposeLessStockMark"
                                @click="openDisposeLessStock(scope.row)">处理入库少货</el-button>
                        </p>
                        <p>
                            <el-button type="text" size="small" v-if="purchaseOrderStatus === 3"
                                @click="addLogistics(scope.row)">录入物流信息</el-button>
                        </p>
                        <p>
                            <el-button type="text" size="small" v-if="[4, 5, 6, 7, 8].includes(purchaseOrderStatus)"
                                @click="queryLogistics(scope.row)">物流信息</el-button>
                        </p>
                        <!-- <p>
                            <el-button type="text" size="small"
                                v-if="[3, 4, 5, 6].includes(purchaseOrderStatus)"
                                @click="showFineDialog(scope.row)">申请罚款</el-button>
                        </p> -->
                        <p>
                            <el-button type="text" size="small" v-if="[3, 4, 5, 6, 7, 8].includes(purchaseOrderStatus)"
                                @click="openPaymentCenter(scope.row)">付款记录</el-button>
                        </p>
                        <!-- <p>
                            <el-button type="text" size="small"
                                v-if="[3, 4, 5, 6, 7, 8].includes(purchaseOrderStatus)"
                                @click="toFineRecord(scope.row)">罚款记录</el-button>
                        </p> -->
                        <p>
                            <el-button type="text" size="small" @click="handlerLog(scope.row)">日志
                            </el-button>
                        </p>
                        <p>
                            <el-button type="text" size="small" @click="handleNotes(scope.row)">备注
                            </el-button>
                        </p>
                        <p>
                            <el-button type="text" size="small" v-if="purchaseOrderStatus !== 2"
                                @click="exportContract(scope.row)">导出合同</el-button>
                        </p>
                        <p>
                            <el-button type="text" size="small" v-if="purchaseOrderStatus === 0"
                                @click="openRebuildPurchasePlan(scope.row)">重新创建采购计划</el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="movie-bottom-page m-t10" background layout="total, sizes, prev, pager, next, jumper"
                :total="total" :current-page="pageQuery.pageIndex" :page-sizes="[10, 20, 50, 100]"
                :page-size="pageQuery.pageSize" @current-change="currentChange" @size-change="sizeChange">
            </el-pagination>
        </div>
        <div class="backToTop" v-if="isFloatOpt" @click="backToTop" title="回到顶部">
            <i class="el-icon-arrow-up" />
        </div>

        <!-- 操作日志 -->
        <DialogOrderLog ref="dialogOrderLog"></DialogOrderLog>
        <!-- 订单备注 -->
        <DialogOrderNote ref="dialogOrderNote"></DialogOrderNote>
        <!-- 修改采购单sku价格 -->
        <el-dialog title="修改采购单sku价格" :visible.sync="dialog.price.visible" width="400px" :close-on-click-modal="false"
            :lock-scroll="false" :before-close="modifySkuPriceClose">
            <product-profile :data="active.orderSkuItem"></product-profile>
            <el-form ref="skuPriceForm" :model="dialog.price.model" :rules="dialog.price.rules" label-width="110px">
                <el-form-item v-if="!dialog.isBatch" label="系统采购单价">
                    {{active.orderSkuItem.systemPrice}}</el-form-item>
                <el-form-item label="实际采购单价" prop="value">
                    <el-input
                        v-slFormatNumber="{type: 'gold', obj: dialog.price.model, key: 'value', max: 99999, compareLength: true}"
                        v-model="dialog.price.model.value" placeholder="请输入采购价格"></el-input>
                </el-form-item>
                <el-form-item label="更改原因" prop="reason">
                    <el-input type="textarea" v-model="dialog.price.model.reason" placeholder="请输入更改原因"
                        :autosize="{ minRows: 5, maxRows: 5}" maxlength="512" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSkuPriceForm">{{$t('button.modify')}}
                </el-button>
                <el-button @click="submitSkuPriceCancel">{{$t('button.cancel')}}</el-button>
            </span>
        </el-dialog>
        <!-- 修改采购单sku数量 -->
        <el-dialog title="修改采购单sku数量" :visible.sync="dialog.quantity.visible" width="400px"
            :close-on-click-modal="false" :lock-scroll="false" :before-close="modifySkuCountClose">
            <product-profile :data="active.orderSkuItem"></product-profile>
            <el-form ref="skuCountForm" :model="dialog.quantity.model" :rules="dialog.quantity.rules"
                label-width="110px" label-position="left">
                <el-form-item v-if="!dialog.isBatch" label="采购建议量">
                    {{active.orderSkuItem.advicePurchaseQuantity}}</el-form-item>
                <el-form-item label="实际采购量" prop="value">
                    <el-input
                        v-slFormatNumber="{type: 'integer', obj: dialog.quantity.model, key: 'value', max: 999999, compareLength: true}"
                        v-model.number="dialog.quantity.model.value" placeholder="请输入采购数量">
                    </el-input>
                </el-form-item>
                <el-form-item label="更改原因" prop="reason">
                    <el-input type="textarea" v-model="dialog.quantity.model.reason" placeholder="请输入更改原因"
                        :autosize="{ minRows: 5, maxRows: 5}" maxlength="512" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSkuCountForm">{{$t('button.modify')}}
                </el-button>
                <el-button @click="submitSkuCountCancel">{{$t('button.cancel')}}</el-button>
            </span>
        </el-dialog>
        <!-- 修改采购单运费 -->
        <el-dialog title="修改采购单运费" :visible.sync="orderFreightVisible" width="400px" :close-on-click-modal="false"
            :lock-scroll="false" :before-close="orderFreightClose">
            <el-form ref="orderFreightForm" :model="orderFreightModel" :rules="orderFreightRules" label-width="80px"
                label-position="left">
                <el-form-item label="运费" prop="shipFee">
                    <el-input
                        v-slFormatNumber="{type: 'gold', obj: orderFreightModel, key: 'shipFee', max: 99999, compareLength: true}"
                        v-model="orderFreightModel.shipFee" placeholder="请输入运费价格"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitOrderFreight">{{$t('button.modify')}}
                </el-button>
                <el-button @click="orderFreightCancel">{{$t('button.cancel')}}</el-button>
            </span>
        </el-dialog>
        <!-- 修改采购单折扣 -->
        <el-dialog title="修改采购单折扣" :visible.sync="orderDiscountVisible" width="400px" :close-on-click-modal="false"
            :lock-scroll="false" :before-close="orderDiscountClose">
            <el-form ref="orderDiscountForm" :model="orderDiscountModel" :rules="orderDiscountRules" label-width="80px"
                label-position="left">
                <el-form-item label="折扣" prop="discountAmount">
                    <el-input
                        v-slFormatNumber="{type: 'gold', obj: orderDiscountModel, key: 'discountAmount', max: 99999, compareLength: true}"
                        v-model="orderDiscountModel.discountAmount" placeholder="请输入折扣信息">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitOrderDiscount">{{$t('button.modify')}}
                </el-button>
                <el-button @click="orderDiscountCancel">{{$t('button.cancel')}}</el-button>
            </span>
        </el-dialog>

        <!-- 相似款 -->
        <similar-upload ref="similarForm" @confirm="doConfirmSimilar" :source="'PURCHASE-ORDER-SIMILAR'">
        </similar-upload>
        <dialog-logistics-add ref="addLogisticsDialog" :purchaseOrderId="active.row.id" @confirm="initPage">
        </dialog-logistics-add>
        <dialog-logistics-list ref="listLogisticsDialog" :purchaseOrderId="active.row.id"
            :purchaseOrderStatus="purchaseOrderStatus"></dialog-logistics-list>
        <dialog-change-reason ref="changeReasonDialog" :changeType="active.changeType">
        </dialog-change-reason>
        <dialog-consignee-info ref="consigneeInfoDialog"></dialog-consignee-info>
        <dialog-fine-form ref="fineFormDialog" :row="active.row"></dialog-fine-form>

        <!-- 处理入库少货 -->
        <DisposeLessStock ref="disposeLessStock" @update="getData"></DisposeLessStock>

        <!-- 原供应商 -->
        <apply-origin-supplier-info ref="applyOriginSupplierDialog"></apply-origin-supplier-info>

        <!-- 修改平台订单号 -->
        <update-platform-order-num v-if="[0, 2, 3,].includes(purchaseOrderStatus)" ref="updatePlatformOrderNum"
            :purchaseOrderId="active.row.id" @reloadList="getData"></update-platform-order-num>
    </div>
</template>

<script>
import StarLinkPoper from '@/components/StarLinkPoper'
import { PurchaseOrderApi, StockOrderUrls } from '@/api/purchase/stockOrder'
import SimilarUpload from '../../modals/similarUpload'
import StockOrderButtons from './stockOrderButtons'
import { exportExcel } from '@/utils/index'
import DisposeLessStock from './disposeLessStock'
import DialogOrderNote from './dialogOrderNote'
import DialogOrderLog from './dialogOrderLog'

import dialogLogisticsAdd from './dialogLogisticsAdd'
import dialogLogisticsList from './dialogLogisticsList'
import dialogChangeReason from './dialogChangeReason'
import dialogConsigneeInfo from './dialogConsigneeInfo'
import dialogFineForm from './dialogFineForm'

import ProductProfile from '../../modals/productProfile'
import ApplyOriginSupplierInfo from '../../purchaseOrderAbnormal/unsettlePayed/modals/applyOriginSupplierInfo'
import UpdatePlatformOrderNum from './updatePlatformOrderNum'
import math from 'mathjs'
export default {
    name: 'stockOrderTable',
    provide() {
        return {
            stockOrderTable: this
        }
    },
    components: {
        SimilarUpload,
        dialogLogisticsAdd,
        dialogLogisticsList,
        ProductProfile,
        dialogChangeReason,
        dialogConsigneeInfo,
        StockOrderButtons,
        dialogFineForm,
        DisposeLessStock,
        ApplyOriginSupplierInfo,
        StarLinkPoper,
        DialogOrderNote,
        DialogOrderLog,
        UpdatePlatformOrderNum
    },
    props: {
        listQuery: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            timer: null,
            loading: true,
            columns: [],
            purchaseOrderSelection: [],
            total: 0,
            pageQuery: {
                pageIndex: 1,
                pageSize: 20,
                orderBy: '',
                orderDirect: ''
            },
            isFloatOpt: false,
            orderFreightVisible: false,
            orderDiscountVisible: false,
            purchaseOrderId: 0,
            orderInfo: {},
            auditRefuseModel: {
                reason: ''
            },
            auditRefuseModelRules: {
                reason: [
                    {
                        required: true,
                        message: '拒绝原因不能为空',
                        trigger: 'change'
                    }
                ]
            },
            orderFreightModel: {
                id: '',
                shipFee: ''
            },
            orderFreightRules: {
                shipFee: [
                    {
                        required: true,
                        message: '运费为大于或等于0的数字',
                        trigger: 'blur'
                    },
                    {
                        validator(rule, value, cb) {
                            const reg = /^\d+(\.\d+)?$/
                            if (!reg.test(value)) {
                                return cb('运费为大于或等于0的数字')
                            }
                            cb()
                        }
                    }
                ]
            },
            orderDiscountModel: {
                id: '',
                discountAmount: ''
            },
            orderDiscountRules: {
                discountAmount: [
                    {
                        required: true,
                        message: '折扣为大于或等于0的数字',
                        trigger: 'blur'
                    },
                    {
                        validator(rule, value, cb) {
                            const reg = /^\d+(\.\d+)?$/
                            if (!reg.test(value)) {
                                return cb('折扣为大于或等于0的数字')
                            }
                            cb()
                        }
                    }
                ]
            },
            active: {
                orderSkuItem: {},
                row: {
                    id: 0
                },
                itemIndex: 0,
                changeType: 1
            },
            dialog: {
                isBatch: false,
                price: {
                    visible: false,
                    model: {
                        value: '',
                        reason: ''
                    },
                    rules: {
                        value: [
                            {
                                required: true,
                                message: '请输入大于0的正数',
                                trigger: 'blur'
                            },
                            {
                                validator(rule, value, cb) {
                                    const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
                                    if (!reg.exec(value)) {
                                        return cb('请输入大于0的正数')
                                    }
                                    cb()
                                }
                            }
                        ],
                        reason: [
                            {
                                required: true,
                                message: '请输入更改原因',
                                trigger: 'blur'
                            }
                        ]
                    }
                },
                quantity: {
                    visible: false,
                    model: {
                        value: '',
                        reason: ''
                    },
                    rules: {
                        value: [
                            {
                                required: true,
                                type: 'number',
                                min: 1,
                                message: '请输入大于0的正整数',
                                trigger: 'blur'
                            }
                        ],
                        reason: [
                            {
                                required: true,
                                message: '请输入更改原因',
                                trigger: 'blur'
                            }
                        ]
                    }
                }
            },
            skuFixedColumn: [
                {
                    label: 'SKU',
                    value: 'skuCode'
                },
                {
                    label: '产品图片',
                    value: 'imageUrl'
                },
                {
                    label: '产品名称',
                    value: 'productName'
                },
                {
                    label: '销售属性',
                    value: 'skuAttrs'
                },
                {
                    label: '采购属性',
                    value: 'supplierSkuAttr'
                },
                {
                    label: '其他信息',
                    value: 'detail'
                }
            ],
            expandRowKeys: []
        }
    },
    computed: {
        purchaseOrderStatus() {
            return Number(this.listQuery.purchaseOrderStatus)
        },
        listQueryFilter() {
            const { listQuery } = this
            const params = {}
            Object.keys(listQuery).forEach((item) => {
                if (listQuery[item] !== '') {
                    params[item] = listQuery[item]
                }
            })
            return params
        },
        purchaseOrderIdsSelection() {
            const purchaseOrderIds = []
            const purchaseOrderSelection = this.purchaseOrderSelection
            purchaseOrderSelection.forEach((item) => {
                if (item.id) {
                    purchaseOrderIds.push(item.id)
                }
            })
            return purchaseOrderIds
        }
    },
    methods: {
        showNumItem(numVal) {
            return !!numVal || numVal === 0
        },
        addLogistics(row) {
            if (row.id) {
                this.active.row = row
                this.$refs.addLogisticsDialog.show()
            }
        },
        queryLogistics(row) {
            if (row.id) {
                this.active.row = row
                this.$refs.listLogisticsDialog.show()
            }
        },
        fullscreenLoading() {
            const loading = this.$loading({
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            return loading
        },
        clickUpdatePlatformOrderNum(row) {
            this.active.row = row
            this.$refs.updatePlatformOrderNum.dialogFormVisible = true
            this.$refs.updatePlatformOrderNum.clearValidate()
        },
        notifySuccess(message, title = '成功', duration = 0) {
            this.$notify({
                title: title,
                dangerouslyUseHTMLString: true,
                message: message,
                type: 'success',
                duration: duration,
                customClass: 'sl-quick'
            })
        },
        notifySuccessCommon(data, title = '成功') {
            const { failReason = '', successNum = 0, failNum = 0 } = data
            let failHtml = ''
            if (failNum > 0) {
                failHtml += `<p style="margin: 5px 0; color: #f56c6c;">失败详情：</p><p style="margin: 5px 0;">${failReason}</p>`
            }
            const message = `<p style="margin: 5px 0;"> 成功总数：<span style="color: #67C23A;font-weight: 600;">${successNum}</span> 个</p>
                            <p style="margin: 5px 0;">失败总数：<span style="color: #f56c6c;font-weight: 600;">${failNum}</span>个</p>
                            ${failHtml}`
            this.$notify({
                title: title,
                dangerouslyUseHTMLString: true,
                message: message,
                type: 'success',
                duration: 5000,
                customClass: 'sl-quick'
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        loadData() {
            this.$refs.tableList.loadData()
        },
        handlerLog(row) {
            if (!row.id) return
            this.$refs.dialogOrderLog.show(row.id)
        },
        handleNotes(row) {
            if (!row.id) return
            this.$refs.dialogOrderNote.show(row)
        },
        exportContract(row) {
            if (row.id) {
                exportExcel(
                    StockOrderUrls.exportContract + row.id,
                    null,
                    `采购合同-${row.id}.xlsx`
                )
            }
        },
        handleConsignee(row) {
            const data = {
                consigneeName: row.consigneeName,
                consigneePhone: row.consigneePhone,
                shippingAddress: row.shippingAddress,
                purchaseOrderNumber: row.purchaseOrderNumber
            }
            this.$refs.consigneeInfoDialog.show(data)
        },
        initPage() {
            this.pageQuery.pageIndex = 1
            this.getData()
            this.$emit('updatePurchaseGroupCount')
        },
        getData() {
            this.loading = true
            const params = Object.assign(
                {},
                this.listQueryFilter,
                this.pageQuery
            )
            PurchaseOrderApi.getPurchaseList(params)
                .then((res) => {
                    const {
                        data: { total = 0, list = [] }
                    } = res
                    this.total = total
                    this.pickList(list)
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    this.loading = false
                    this.expandRowKeys = []
                })
        },
        pickList(list) {
            if (!list) return
            list.forEach((item) => {
                const extraKeys = {
                    _skusAmount: 0, // sku种类数量
                    _skuCountsAmount: 0, // sku总数
                    _unpackedQuantityAmount: 0, // 总拆包量
                    _receiptedQuantityAmount: 0, // 总入库量
                    _lessQuantityAmount: 0, // 总少货量
                    _packedPriceAmount: 0 // 已入库金额
                }
                // 当实际采购量>已入库+损耗+供应商退款+供应商补发时，才显示。
                const { purchaseOrderItems = [] } = item
                extraKeys._skusAmount = purchaseOrderItems.length
                let realPurchaseQuantitys = 0
                let receiptedQuantitys = 0
                let wastageQuantitys = 0
                let supplierRefundQuantitys = 0
                let supplierReissueQuantitys = 0
                purchaseOrderItems.forEach((skuItem) => {
                    const {
                        realPurchaseQuantity = 0,
                        receiptedQuantity = 0,
                        wastageQuantity = 0,
                        supplierRefundQuantity = 0,
                        supplierReissueQuantity = 0,
                        unpackedQuantity = 0,
                        realPrice = 0
                    } = skuItem
                    realPurchaseQuantitys += realPurchaseQuantity
                    receiptedQuantitys += receiptedQuantity
                    wastageQuantitys += wastageQuantity
                    supplierRefundQuantitys += supplierRefundQuantity
                    supplierReissueQuantitys += supplierReissueQuantity
                    // 值的计算
                    extraKeys._skuCountsAmount += realPurchaseQuantity
                    extraKeys._unpackedQuantityAmount += unpackedQuantity
                    extraKeys._receiptedQuantityAmount += receiptedQuantity
                    extraKeys._lessQuantityAmount +=
                        wastageQuantity +
                        supplierRefundQuantity +
                        supplierReissueQuantity
                    extraKeys._packedPriceAmount = this.formatNumber(
                        math.format(
                            math
                                .chain(extraKeys._packedPriceAmount)
                                .add(
                                    math.multiply(
                                        math.bignumber(receiptedQuantity),
                                        math.bignumber(realPrice)
                                    )
                                )
                                .done()
                        )
                    )
                })
                if (
                    realPurchaseQuantitys >
                    receiptedQuantitys +
                        wastageQuantitys +
                        supplierRefundQuantitys +
                        supplierReissueQuantitys
                ) {
                    item.disposeLessStockMark = true
                }
                // 额外添加到order数据上
                Object.assign(item, extraKeys)
            })
            this.columns = list
        },
        handleSelectionChange(val) {
            this.purchaseOrderSelection = val
        },
        currentChange(index) {
            this.pageQuery.pageIndex = index
            this.getData()
        },
        sizeChange(size) {
            this.pageQuery.pageSize = size
            this.getData()
        },
        onPurchaseSimilarInfo(row, itemIndex, item) {
            this.active.row = row
            this.active.itemIndex = itemIndex

            const purchaseOrderItemId = item.id

            PurchaseOrderApi.getPurchaseOrderSimilarMode(
                purchaseOrderItemId
            ).then((res) => {
                this.$refs.similarForm.show(res.data)
            })
        },
        // 采购相似款/查看相似款信息
        doConfirmSimilar(urls, isEdit, isCancel) {
            const params = {
                purchaseOrderItemId: this.active.row.purchaseOrderItems[
                    this.active.itemIndex
                ].id,
                similarModeUrlList: urls
            }

            PurchaseOrderApi.postPurchaseOrderSimilarMode(params).then(() => {
                this.$message.success(
                    `${isCancel ? '取消' : isEdit ? '修改' : '采购'}类似款成功`
                )
            })
        },
        onChangeReason(row, itemIndex, changeType) {
            this.active.row = row
            this.active.itemIndex = itemIndex
            this.active.changeType = changeType
            this.$refs.changeReasonDialog.show({ row, itemIndex })
        },
        openRebuildPurchasePlan(row) {
            this.$alert('确定重新创建采购计划吗？', '重新创建采购计划', {
                lockScroll: false,
                confirmButtonText: '确定',
                callback: (action) => {
                    if (action === 'confirm') {
                        this.rebuildPurchasePlan(row)
                    }
                }
            })
        },
        rebuildPurchasePlan(row) {
            const loading = this.fullscreenLoading()
            PurchaseOrderApi.rebuildPurchasePlan([row.id])
                .then((res) => {
                    const { success, data = {} } = res
                    if (success) {
                        this.notifySuccessCommon(
                            data,
                            '重新创建采购计划操作成功'
                        )
                        this.initPage()
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(loading.close())
        },
        openCancelPurchaseOrder() {
            this.$alert('确定取消订单吗？', '取消订单', {
                lockScroll: false,
                confirmButtonText: '取消订单',
                callback: (action) => {
                    if (action === 'confirm') {
                        this.cancelPurchaseOrder()
                    }
                }
            })
        },
        handleSkuPrice(order, orderSku) {
            this.dialog.price.model.value = orderSku.realPrice
            this.dialog.price.model.reason = orderSku.priceChangedReason
            this.orderInfo = order
            orderSku.skuImage = orderSku.imageUrl
            this.active.orderSkuItem = orderSku
            this.dialog.price.visible = true
        },
        handleSkuCount(order, orderSku) {
            this.dialog.quantity.model.value = orderSku.realPurchaseQuantity
            this.dialog.quantity.model.reson = orderSku.quantityChangeReason
            this.orderInfo = order
            orderSku.skuImage = orderSku.imageUrl
            this.active.orderSkuItem = orderSku
            this.dialog.quantity.visible = true
        },

        submitSkuPriceForm() {
            this.$refs.skuPriceForm.validate((valid) => {
                if (valid) {
                    this.updateSkuPrice()
                } else {
                    return false
                }
            })
        },
        submitSkuPriceCancel() {
            this.dialog.price.visible = false
            this.resetForm('skuPriceForm')
            this.dialog.price.model.value = ''
            this.dialog.price.model.reason = ''
        },
        modifySkuPriceClose(done) {
            this.resetForm('skuPriceForm')
            this.dialog.price.model.value = ''
            this.dialog.price.model.reason = ''
            done()
        },
        // 修改采购单sku价格
        updateSkuPrice() {
            if (!this.active.orderSkuItem.skuId) return
            const params = {
                changeReason: this.dialog.price.model.reason, // 更改原因
                id: this.orderInfo.id, // 采购单ID
                price: this.dialog.price.model.value, // 实际采购单价
                purchaseOrderItemId: this.active.orderSkuItem.id
            }
            PurchaseOrderApi.updateSkuPrice(params).then((res) => {
                if (res.success) {
                    this.$message.success('操作成功！')
                    this.initPage()
                    this.submitSkuPriceCancel()
                }
            })
        },
        submitSkuCountForm() {
            this.$refs.skuCountForm.validate((valid) => {
                if (valid) {
                    this.updateSkuCount()
                } else {
                    return false
                }
            })
        },
        submitSkuCountCancel() {
            this.dialog.quantity.visible = false
            this.resetForm('skuCountForm')
            this.dialog.quantity.model.value = ''
            this.dialog.quantity.model.reason = ''
        },
        modifySkuCountClose(done) {
            this.resetForm('skuCountForm')
            this.dialog.quantity.model.value = ''
            this.dialog.quantity.model.reason = ''
            done()
        },
        // 修改采购单sku数量
        updateSkuCount() {
            if (!this.active.orderSkuItem.skuId) return
            const params = {
                count: this.dialog.quantity.model.value,
                countChangeReason: this.dialog.quantity.model.reason, // 更改原因
                id: this.orderInfo.id, // 采购单ID
                purchaseOrderItemId: this.active.orderSkuItem.id
            }
            PurchaseOrderApi.updateSkuCount(params).then((res) => {
                if (res.success) {
                    this.$message.success('操作成功！')
                    this.initPage()
                    this.submitSkuCountCancel()
                }
            })
        },

        // 修改修改采购单运费
        handleOrderFreight(row) {
            if (!row.id) return
            this.orderInfo = row
            this.orderFreightModel.shipFee = row.shipFee
            this.orderFreightVisible = true
        },
        submitOrderFreight() {
            this.$refs.orderFreightForm.validate((valid) => {
                if (valid) {
                    this.updateOrderFreight()
                } else {
                    return false
                }
            })
        },
        updateOrderFreight() {
            const params = {
                id: this.orderInfo.id,
                shipFee: this.orderFreightModel.shipFee
            }
            PurchaseOrderApi.updateOrderFreight(params).then((res) => {
                if (res.success) {
                    this.$message.success('操作成功！')
                    this.initPage()
                    this.orderFreightCancel()
                }
            })
        },
        orderFreightCancel() {
            this.orderFreightVisible = false
            this.resetForm('orderFreightForm')
            this.orderFreightModel.shipFee = ''
        },
        orderFreightClose(done) {
            this.resetForm('orderFreightForm')
            this.orderFreightModel.shipFee = ''
            done()
        },
        // 修改采购单折扣
        handleOrderDiscount(row) {
            if (!row.id) return
            this.orderInfo = row
            this.orderDiscountModel.discountAmount = row.discountAmount
            this.orderDiscountVisible = true
        },
        submitOrderDiscount() {
            this.$refs.orderDiscountForm.validate((valid) => {
                if (valid) {
                    this.updateOrderDiscount()
                } else {
                    return false
                }
            })
        },
        updateOrderDiscount() {
            const params = {
                id: this.orderInfo.id,
                discountAmount: this.orderDiscountModel.discountAmount
            }
            PurchaseOrderApi.updateOrderDiscount(params).then((res) => {
                if (res.success) {
                    this.$message.success('操作成功！')
                    this.initPage()
                    this.orderDiscountCancel()
                }
            })
        },
        orderDiscountClose(done) {
            this.resetForm('orderDiscountForm')
            this.orderDiscountModel.discountAmount = ''
            done()
        },
        orderDiscountCancel() {
            this.orderDiscountVisible = false
            this.resetForm('orderDiscountForm')
            this.orderDiscountModel.discountAmount = ''
        },
        showFineDialog(row) {
            if (row.id) {
                this.active.row = row
                this.$refs.fineFormDialog.show()
            }
        },
        // 付款记录
        openPaymentCenter(row) {
            if (row.supplierOrderPlatform === 1 && row.clearingForm === 0) {
                const routeData = this.$router.resolve({
                    path: '/paymentCenter/aliPay',
                    query: {
                        supplierOrderNumber: row.supplierOrderNumber
                    }
                })
                window.open(routeData.href, '_blank')
            } else {
                const routeData = this.$router.resolve({
                    path: '/paymentCenter/offlinePay',
                    query: {
                        purchaseOrderNumber: row.purchaseOrderNumber
                    }
                })
                window.open(routeData.href, '_blank')
            }
        },
        toFineRecord(row) {
            const routeData = this.$router.resolve({
                path: '/purchaseOrderAbnormal/supplierFine',
                query: {
                    supplierName: row.currentSupplierName
                }
            })
            window.open(routeData.href, '_blank')
        },
        openDisposeLessStock(row) {
            if (!row.id) return
            this.$refs.disposeLessStock.show(row.id)
        },
        openPurchaseOrder(purchaseOrderNumber) {
            const routeData = this.$router.resolve({
                path: '/purchase/stock-order',
                query: {
                    purchaseOrderNumber
                }
            })
            window.open(routeData.href, '_blank')
        },
        onOriginSupplierOpen(item) {
            this.$refs.applyOriginSupplierDialog.show(item)
        },
        handleScroll() {
            if (this.$refs.optBox && this.$refs.listBox) {
                const optPanel_top = this.$refs.optBox.getBoundingClientRect()
                    .top
                const listBoxTop = this.$refs.listBox.getBoundingClientRect()
                    .top
                if (optPanel_top <= 10 && this.isFloatOpt === false) {
                    this.isFloatOpt = true
                }
                if (this.isFloatOpt && listBoxTop >= 50) {
                    this.isFloatOpt = false
                }
            }
        },
        backToTop() {
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        },
        // start 需求：sku维度放在子table中独立展示
        // 返回expand状态对应的文本
        returnExpandText(row) {
            return row.expand ? '收起' : '展开'
        },
        // expand的open/close事件
        handleExpandBtn(row) {
            const index = this.expandRowKeys.findIndex((id) => id === row.id)
            if (index === -1) {
                this.expandRowKeys.push(row.id)
                row.expand = true
            } else {
                this.expandRowKeys.splice(index, 1)
                row.expand = false
            }
        },
        formatNumber(number) {
            // 不采用科学计数法
            number = math.format(+number, {
                notation: 'fixed'
            })
            // 保留两位小数，四舍五入
            number = math.round(number, 2)
            return number
        }
        // end
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    created() {
        this.getData()
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('scroll', this.handleScroll)
        })
    },
    filters: {
        formatSupplierOrderStatus(value) {
            const statusObj = {
                1: '等待买家付款',
                2: '等待卖家发货',
                3: '等待买家收货',
                4: '已收货',
                5: '交易成功',
                6: '交易取消',
                7: '交易终止'
            }
            return statusObj[value]
        },
        formatSupplierOrderType: function (value) {
            switch (value) {
                case 'GENERAL_ORDER':
                    value = '普通下单'
                    break
                case 'DISTRIBUTION_ORDER':
                    value = '分销下单'
                    break
                default:
                    value = ''
            }
            return value
        },
        formatPriceChangePercent: function (value) {
            value = Math.round(value)
            if (value >= 0) {
                value = `+${value}%`
            } else if (value < 0) {
                value = `${value}%`
            } else {
                value = ''
            }
            return value
        },
        formatPurchaseOrderStatus: function (value) {
            switch (value) {
                case 0:
                    value = '已下单'
                    break
                case 1:
                    value = '待审核'
                    break
                case 2:
                    value = '审核拒绝'
                    break
                case 3:
                    value = '已确认'
                    break
                case 4:
                    value = '待收货'
                    break
                case 5:
                    value = '已收货'
                    break
                case 6:
                    value = '已完成'
                    break
                case 7:
                    value = '已核销'
                    break
                case 8:
                    value = '已取消'
                    break
                default:
                    value = ''
            }
            return value
        }
    }
}
</script>
<style lang='scss' scoped>
.stock-order-table {
    .color-red {
        color: red;
    }
    .m-t10 {
        margin-top: 10px;
    }
    .table-blue {
        color: #409eff;
        cursor: pointer;
    }
    .input-style {
        display: inline-block;
        width: 60px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #999;
        cursor: text;
        text-indent: 4px;
    }
    .multi-line-text2 {
        width: 100%;
        line-height: 23px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .floatOpt {
        position: fixed;
        top: 40px;
        z-index: 100;
        box-sizing: border-box;
        width: 100%;
        background-color: #e7eaed;
        margin: 10px 0;
        padding: 10px 15px;
        border: solid 1px #dcd7d7;
        border-radius: 4px;
    }
    .backToTop {
        width: 40px;
        height: 40px;
        position: fixed;
        bottom: 15px;
        right: 15px;
        z-index: 101;
        border-radius: 20px;
        background-color: #ef883c;
        font-weight: 800;
        text-align: center;
        vertical-align: middle;
        padding: 4px;
        font-size: 24px;
        color: white;
        cursor: pointer;
    }
    .table-td-wrap {
        display: table;
        width: 100%;
        min-height: 180px;
        padding-top: 6px;
        border-top: 1px solid #ddd;
        &:first-child {
            margin-top: 0;
            border: none;
        }
        .img-wrap {
            width: 54px;
            height: 54px;
            overflow: hidden;
            border-radius: 5px;
            border: 1px solid #cdcdcd;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sku-img {
            display: block;
            max-width: 50px;
            max-height: 50px;
        }
    }
    .table-td-cell {
        width: 100%;
        display: table-cell;
        vertical-align: middle;
        .real-price {
            position: relative;
            .real-price-bg {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                white-space: nowrap;
                font-size: 12px;
                color: #fff;
            }
            .roundness-bg-red {
                background-color: #d9001b;
            }
            .roundness-bg-green {
                background-color: #70b603;
            }
        }
    }
    .icon-aliwangwang {
        max-width: 20px;
        vertical-align: middle;
    }
    .el-icon-question {
        font-size: 20px;
        cursor: pointer;
        vertical-align: middle;
        color: #000;
    }
    .sl-poper {
        width: 320px;
        text-align: left;
        font-size: 12px;
        color: #606266;
        font-weight: normal;
    }
    /deep/ .el-table {
        .col-hidden {
            // display: none;
            visibility: hidden;
        }
        .el-table__expand-column {
            .cell {
                overflow: visible;
            }
            .el-table__expand-icon {
                font-size: 26px;
                height: 26px;
                font-weight: bolder;
                .el-icon {
                    margin-left: 0px;
                    margin-top: 0px;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
}

.margin-bottom-6 {
    margin-bottom: 6px;
}
</style>
