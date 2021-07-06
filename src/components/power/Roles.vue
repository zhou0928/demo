<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table
        :data="rolesList"
        style="width: 100%"
        border>
        <!-- 展开列-->

        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :gutter="10" :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
                    v-for="(item1,i1) in scope.row.children"
                    :key="item1.id">
              <!-- 渲染一级全选-->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <el-row :gutter="10" :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightsById(scope.row,item2.id)">{{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" :class="[i3===0?'':'bdtop']" v-for="(item3,i3) in item2.children"
                            :key="item3.id" closable @close="removeRightsById(scope.row,item3.id)">{{
                        item3.authName
                      }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index" label="#">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述">
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeRolesById(scope.row.id)">删除
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="small" @click="showSetRightsDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
    <!--      分配权限对话框-->
    <el-dialog
      title="分配权限提示框"
      :visible.sync="setRightsdialogVisible"
      width="50%"

    >
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        :props="TreeProps"
        ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'roles',
  data() {
    return {
      rolesList: [],
      setRightsdialogVisible: false,
      rightsList: [],
      // 树形控件的属性绑定对象
      TreeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点Id值得数组
      defKeys: [],
      // 当前即将分配权限的角色的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const {data: res} = await axios.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.rolesList = res.data
      console.log(this.rolesList)

    },
    // 点击删除按钮移除当前的角色
    removeRolesById(id) {
      console.log(id)
    },
    // 点击tag关闭标签
    async removeRightsById(role, rightsId) {
      const confirmresult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmresult !== 'confirm') return this.$message.info('已取消删除')
      // console.log(id)
      const {data: res} = await axios.delete(`roles/${role.id}/rights/${rightsId}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('取消权限失败')
      }
      role.children = res.data
    },
    // 分配角色对话框
    async showSetRightsDialog(role) {
      this.roleId = role.id
      const {data: res} = await axios.get(`rights/tree`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
      this.getLeafKeys(role, this.defKeys)
      console.log(this.defKeys)
      this.setRightsdialogVisible = true

    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包括 children属性 ，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      // console.log(idStr)
      const {data: res} = await axios.post(`roles/${this.roleId}/rights`, {rids: idStr})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('更新权限成功')
      await this.getRolesList()
      this.setRightsdialogVisible = false
    },


  }
}
</script>

<style scoped>
.el-tag {
  margin: 10px 0 10px 10px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}

.el-icon-caret-right {
  margin-left: 5px;
}
</style>
