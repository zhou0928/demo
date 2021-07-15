<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图区域-->
    <el-card>
      <!--      添加分类按钮-->
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <!--表格-->
      <tree-table
        :data="CateList"
        :columns="columns"
        border
        :selection-type="false"
        :show-row-hover="false"
        :expand-type="false"
        show-index
        index-text="#">
        <!--        是否有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>

        </template>
        <!--        操作-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small"
                     @click="editDialog(scope.row.cat_id)">编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteDialog(scope.row.cat_id)">删除
          </el-button>
        </template>
      </tree-table>
      <!--      分页功能-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--    添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <div>
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input placeholder="请输入分类名称" v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
            <!--  options 用来指定数据源  -->
            <!-- props 用来指定配置对象-->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
              change-on-select>
            </el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
    <!--    点击编辑按钮 提示修改分类对话框-->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="xiugaifenlei">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Cate',
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      CateList: [],
      total: 0,
      // 为table指定列的定义
      columns: [
        {label: '分类名称', prop: 'cat_name',},

        {
          label: '是否有效',
          // 将当前设置为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {label: '排序', prop: 'cat_level', type: 'template', template: 'order'},
        {label: '操作', type: 'template', template: 'opt', width: '200px'},
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是一级分类
        cat_level: 0
      },
      // 添加分类表单的验证
      addCateFormRules: {
        cat_name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'

      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      // 点击编辑按钮，显示与隐藏对话框
      editDialogVisible: false,
      // 编辑的表单
      editForm: {},
      editFormRules: {
        cat_name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ]
      },

    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const {data: res} = await axios.get('categories', {params: this.queryInfo})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      console.log(res)
      // 把数据列表，赋值给 catelist
      this.CateList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
      console.log(`每页 ${newSize} 条`);
    },
    // 监听 pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
      console.log(`当前页: ${newPage}`);
    },
    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 在展示出对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const {data: res} = await axios.get('categories', {params: {type: 2}})
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.parentCateList = res.data
      console.log(this.parentCateList)
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0， 证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await axios.post('categories', this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        await this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 添加对话框关闭事件  重置表单
    addDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0

    },
    // 点击编辑按钮
    async editDialog(id) {
      const {data: res} = await axios.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    // 点击确定按钮
    async xiugaifenlei() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await axios.put(`categories/${this.editForm.cat_id}`, {cat_name: this.editForm.cat_name})
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        await this.getCateList()
        this.$message.success('修改成功')
        this.editDialogVisible = false
      })

    },
    // 点击删除按钮，根据当前id删除
    async deleteDialog(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      /*如果用户确认打印confirm,如果用户取消显示cancel*/
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      const {data: res} = await axios.delete(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      await this.getCateList()
      this.$message.success('删除成功')
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}

.el-col {
  font-size: 16px;
  line-height: 35px;
  margin-bottom: 30px;

}

.el-cascader {
  width: 100%;
}
</style>
