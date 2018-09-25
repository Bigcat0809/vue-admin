<template>
  <div class="dzh-dataTable">
    <el-row :gutter="20">
      <el-col :span="query.col" v-for="(item, index) in query.options" :key="index">
        <el-form-item style="width: 100%;">
          <el-input v-if="item.type === 'input'" :size="query.size" v-model="query.name" :placeholder="query.title"></el-input>
          <el-select clearable  v-model="searchParam.ITEM_TYPE" placeholder="题型">
            <el-option v-for="(item, index) in itemType" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
          </el-select>
          <!-- <dzh-query></dzh-query> -->
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item style="width: 100%;">
          <el-button type="primary" icon="el-icon-search" @click.native="searchQues">查询</el-button>
          <el-button  @click.native="searchQues">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" @click.native="addQues">新增</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-col :span="24">
          <el-scrollbar class="dzhScroll" style="border: 1px solid #f5f5f5;height: calc(100vh - 172px);">
            <el-table
              v-loading="loading"
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column width="50px" align="center"  prop="ITEM_NO" label="编号"></el-table-column>
              <el-table-column width="75px" align="center" prop="VERSION_NO" label="版本号"></el-table-column>
              <el-table-column min-width="200px"  show-overflow-tooltip prop="ITEM_NAME" label="题目名称"></el-table-column>
              <el-table-column width="80px" align="center" prop="ITEM_TYPE" :formatter="formatterDictObj" label="题型">
                <template slot-scope="scope">
                  <el-tag size="medium">{{ scope.row.ITEM_TYPE }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column width="55px" align="center" prop="ITEM_SCORE" label="默认分值"></el-table-column>
              <el-table-column width="75px" align="center" prop="OUTER_ITEM_NO" label="对方题目编号"></el-table-column>
              <el-table-column width="75px" align="center" prop="DEFA_ANSW_NO"  label="默认标准答案"></el-table-column>
              <el-table-column width="75px" align="center" prop="CREATED_STAFFNO" label="创建人编号"></el-table-column>
              <el-table-column width="120px" align="center" label="创建日期">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.CREATED_DATE }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="250px" fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleSearch(scope.$index, scope.row)">查看</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="24">
          <el-pagination
              style="marginTop: 10px;height: 40px;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :total="pageCount">
          </el-pagination>
        </el-col>
      </el-col>
    </el-row>
     <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="80%"
        top="5vh"
        fullscreen
        center
        >
        <el-row>
          <el-col :span="12">
            <el-form style="width:70%;margin:0 auto;maxWidth:1200px;"  label-position="top" :model="formParam" label-width="160px">
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item   label="题目名称">
                  <el-input v-model="formParam.ITEM_NO" type="textarea" :autosize="{ minRows: 3, maxRows: 7}"></el-input>
                </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="题型">
                    <el-select v-model="formParam.ITEM_NAME" placeholder="题型">
                      <el-option v-for="(item, index) in itemType" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="允许打断" >
                    <el-switch v-model="formParam.IS_INTERRUPT"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="需要等待客户输入答案">
                    <el-switch v-model="formParam.IS_WAIT2_ENTER"></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="问题语音文件名">
                    <el-input v-model="formParam.ITEM_VOICE"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item  label="首次拒识问题内容">
                    <el-input v-model="formParam.FST_NO_ANSW_ITEM_NO" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item  label="二次拒识问题内容">
                    <el-input v-model="formParam.SND_NO_ANSW_ITEM_NO" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item  label="首次未输入问题内容">
                    <el-input v-model="formParam.FST_NO_INPUT_ITEM_NO" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item  label="二次未输入问题内容">
                    <el-input v-model="formParam.SND_NO_INPUT_ITEM_NO" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item  label="引导话术">
                    <el-input v-model="formParam.LEADING_WORDS" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item  label="备注">
                    <el-input v-model="formParam.REMARK" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="12">

          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
     </el-dialog>
  </div>
</template>

<script>
import { getDict } from '@/utils/ka.js'
// import KJDPservice from '@/api/kjdp'
export default {
  name: 'dataTable',
  props: {
    query: {
      type: Object,
      default: function () {
        return {
          col: '6',
          size: 'small',
          options: []
        }
      }
    },
    // 分页模式 0：前端分页 1：后台分页
    pageMode: {
      type: Number,
      default: 0
    },
    // 请求参数
    req: {
      type: Object
    },
    columns: {
      type: Array
    },
    toolbar: {
      type: Array
    }
  },
  data () {
    return {
      searchParam: {
        ITEM_NO: '',
        ITEM_NAME_LIKE: '',
        ITEM_TYPE: '',
        IS_INTERRUPT: '',
        IS_WAIT2_ENTER: '',
        CREATED_STAFFNO: '',
        LAST_UPDATED_STAFFNO: ''
      },
      formParam: {
        ITEM_NO: '',
        ITEM_NAME: '',
        ITEM_TYPE: ''
      },
      tableData: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      currentPage: 1,
      pageCount: 0,
      pageSize: 10
    }
  },
  computed: {
    itemType () {
      return this.getDict('题型')
    }
  },
  created () {
    this.searchQues()
  },
  mounted () {

  },
  destroyed () {

  },
  methods: {
    getDict (param) {
      return getDict(param)
      // console.log(a)
    },
    formatterDictObj (row, column) {
      // console.log(row)
      return row.ITEM_TYPE
    },
    searchQues () {
      // this.loading = true
      // Object.assign()
      // let param = {
      //   bex_codes: 'iobs_qryQuestionItem',
      //   ITEM_NO: this.searchParam.ITEM_NO,
      //   ITEM_NAME_LIKE: this.searchParam.ITEM_NAME_LIKE,
      //   ITEM_TYPE: this.searchParam.ITEM_TYPE,
      //   IS_INTERRUPT: this.searchParam.IS_INTERRUPT,
      //   IS_WAIT2_ENTER: this.searchParam.IS_WAIT2_ENTER,
      //   CREATED_STAFFNO: this.searchParam.CREATED_STAFFNO,
      //   LAST_UPDATED_STAFFNO: this.searchParam.LAST_UPDATED_STAFFNO
      // }
      // console.log(param)
      // KJDPservice([param]).then(res => {
      //   console.log(res.data)
      //   this.pageCount = res.data.length
      //   if (res.data.length) {
      //     this.tableData = res.data.slice(0, 10)
      //   } else {
      //     this.tableData = [res.data]
      //   }
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    handleSearch () {

    },
    handleEdit () {

    },
    handleDelete () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addQues () {
      this.dialogTitle = '新增问题'
      this.dialogVisible = true
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss">
.dzh-form-inline{
  .el-form-item__content{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }
  // .el-row{
  //   height: 51px;
  // }
}
.dzh-questionMaintain{
  height: 100%;
}
.el-container.is-vertical{
  height: 100%;
}
</style>
