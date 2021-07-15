<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图区域-->
    <el-card>
      <!--      搜索区域-->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    class="input-with-select"
                    clearable
                    v-model="queryInfo.query"
                    @clear="getGoodsList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getGoodsList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--      表格区域-->
      <el-table
        :data="goodsList"
        style="width: 100%"
        border
        stripe>
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
        >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="120">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="200">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>

        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small"
                       @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页功能-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Goods',
  data() {
    return {
      // 商品列表
      goodsList: [],
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const {data: res} = await axios.get('goods', {params: this.queryInfo})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
      console.log(`每页 ${newSize} 条`);
    },
    // 监听 pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
      console.log(`当前页: ${newPage}`);
    },
    // 点击删除按钮，弹窗提示是否删除
    async removeById(id) {
      console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      const {data: res} = await axios.delete(`goods/${id}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      await this.getGoodsList()
    },
    // 添加商品
    goAddPage() {
      this.$router.push('goods/add')
    }
  }
}
</script>

<style scoped>

</style>
