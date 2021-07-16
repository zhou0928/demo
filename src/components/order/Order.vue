<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图区域-->
    <el-card class="box-card">
      <!--      搜索框区域-->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--表格区域-->
      <el-table
        :data="orderlist"
        style="width: 100%"
        border
        stripe
        text-align="center">
        <el-table-column
          type="index"
          label="#"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
        >
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="150">
        </el-table-column>
        <el-table-column
          label="是否付款"
          width="150">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="150">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间"
          width="200">
          <template slot-scope="scope">
            {{ scope.row.create_time|dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="small" @click="orderDialogVisible=true"></el-button>
            <el-button type="success" icon="el-icon-location" size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        :current-page="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--    编辑对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="orderDialogVisible"
      width="50%">
      <el-form :model="orderForm"
               :rules="orderFormRules"
               ref="orderFormRef"
               label-width="100px"
               class="demo-ruleForm"
               @close="orderDialog">
        <el-form-item label="省市区/县" prop="address1">
          <v-region></v-region>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="orderForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="orderDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="orderDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import cityOptions from '../../assets/js/city_data2017_element'

export default {
  name: 'Order',
  data() {
    return {
      orderlist: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderDialogVisible: false,
      orderForm: [],
      orderFormRules: {
        address1: [
          {required: true, message: '请选择省市区/县', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        address2: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ]
      },
      cityOptions: cityOptions,

    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      console.log(123123)
      const {data: res} = await axios.get(`orders`, {params: this.queryInfo})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
      console.log(`每页 ${newSize} 条`);
    },
    // 监听 pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
      console.log(`当前页: ${newPage}`);
    },
    // 点击编辑按钮，取消对话框的验证
    orderDialog() {
      this.$refs.orderFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
