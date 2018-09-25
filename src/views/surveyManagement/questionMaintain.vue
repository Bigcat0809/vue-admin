<template>
  <div class="dzh-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form  :inline="true" :model="queryParam" class="dzh-form_query">
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="queryParam.ITEM_NO" placeholder="题目编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="queryParam.ITEM_NAME_LIKE" placeholder="题目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable  v-model="queryParam.ITEM_TYPE" placeholder="题型">
                <el-option v-for="(item, index) in itemType" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable v-model="queryParam.IS_INTERRUPT" placeholder="是否允许打断">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable  v-model="queryParam.IS_WAIT2_ENTER" placeholder="是否需要等待客户输入答案">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input placeholder="创建人编号"  readonly v-model="queryParam.CREATED_STAFFNO" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input placeholder="最后修改人编号"  readonly v-model="queryParam.LAST_UPDATED_STAFFNO" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click.native="searchQues">查询</el-button>
              <el-button  @click.native="searchQues">重置</el-button>
              <el-button type="primary" icon="el-icon-plus" @click.native="addQues">新增</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-col :span="24">
          <el-scrollbar class="dzh-scroll" style="height: calc(100vh - 223px);">
            <el-table
              v-loading="loading"
              :data="showTableData"
              border
              style="width: 100%">
              <el-table-column sortable width="70px" align="center"  prop="ITEM_NO" label="编号"></el-table-column>
              <el-table-column sortable width="95px" align="center" prop="VERSION_NO" label="版本号"></el-table-column>
              <el-table-column sortable min-width="200px"  show-overflow-tooltip prop="ITEM_NAME" label="题目名称"></el-table-column>
              <el-table-column width="80px" align="center" prop="ITEM_TYPE" :formatter="formatterDictObj" label="题型">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.ITEM_TYPE === '1'" type="warning" size="medium">{{ itemTypeTrans[scope.row.ITEM_TYPE] }}</el-tag>
                  <el-tag v-else-if="scope.row.ITEM_TYPE === '2'" type="success" size="medium">{{ itemTypeTrans[scope.row.ITEM_TYPE] }}</el-tag>
                  <el-tag v-else size="medium">{{ itemTypeTrans[scope.row.ITEM_TYPE] }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column width="55px"  align="center" prop="ITEM_SCORE" label="默认分值"></el-table-column>
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
        >
        <el-row>
          <el-col :span="12">
            <el-form style="width:80%;margin:0 auto;maxWidth:1200px;" :disabled="formParamDisabled"  label-position="left" :model="formParam" label-width="160px">
              <el-form-item label="题目名称">
                <el-input v-model="formParam.ITEM_NO" type="textarea" :autosize="{ minRows: 2, maxRows: 7}"></el-input>
              </el-form-item>
              <el-form-item label="题型">
                <el-select v-model="formParam.ITEM_NAME" placeholder="题型">
                  <el-option v-for="(item, index) in itemType" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="允许打断" >
                <el-switch v-model="formParam.IS_INTERRUPT"></el-switch>
              </el-form-item>
              <el-form-item label="需要等待客户输入答案">
                <el-switch v-model="formParam.IS_WAIT2_ENTER"></el-switch>
              </el-form-item>
              <el-form-item label="问题语音文件名">
                <el-input v-model="formParam.ITEM_VOICE"></el-input>
              </el-form-item>
              <el-form-item  label="首次拒识问题内容">
                <el-input v-model="formParam.FST_NO_ANSW_ITEM_NO" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
              </el-form-item>
              <el-form-item  label="二次拒识问题内容">
                <el-input v-model="formParam.SND_NO_ANSW_ITEM_NO" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
              </el-form-item>
              <el-form-item  label="首次未输入问题内容">
                <el-input v-model="formParam.FST_NO_INPUT_ITEM_NO" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
              </el-form-item>
              <el-form-item  label="二次未输入问题内容">
                <el-input v-model="formParam.SND_NO_INPUT_ITEM_NO" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
              </el-form-item>
              <el-form-item  label="引导话术">
                <el-input v-model="formParam.LEADING_WORDS" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
              </el-form-item>
              <el-form-item  label="备注">
                <el-input v-model="formParam.REMARK" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form style="width:100%;margin:0 auto;maxWidth:1200px;"  label-position="left" :disabled="formParamDisabled" :model="formParam" label-width="100px">
              <el-form-item label="选项模式">
                <el-radio v-model="formParam.XXMS" label="1">字母</el-radio>
                <el-radio v-model="formParam.XXMS" label="2">数字</el-radio>
              </el-form-item>
              <el-form-item label="标准答案">
                <el-select v-model="formParam.DEFA_ANSW_NO" placeholder="标准答案">
                  <el-option v-for="(item, index) in itemType" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否需要提醒">
                <el-switch v-model="formParam.IS_WARN"></el-switch>
              </el-form-item>
              <el-form-item label="答案选项">
                <el-row :gutter="10" v-for="(item, index) in 10" :key="index">
                  <el-col :span="12">
                    <el-input placeholder="请输入答案名称">
                      <template slot="prepend">A</template>
                    </el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-input  v-model="formParam.ANSW_SCORE" placeholder="请输入答案分值"></el-input>
                  </el-col>
                  <el-col :span="4">
                    <span><i class="el-icon-minus"></i></span>
                    <span><i class="el-icon-plus"></i></span>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
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
import { KJDPservice } from '@/api/kjdp'
export default {
  name: 'questionMaintain',
  data () {
    return {
      queryParam: {
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
      showTableData: [],
      loading: false,
      dialogVisible: false,
      formParamDisabled: false,
      dialogTitle: '',
      currentPage: 1,
      pageCount: 0,
      pageSize: 10
    }
  },
  computed: {
    itemType () {
      return this.getDict('题型')
    },
    itemTypeTrans () {
      var obj = {}
      for (let i = 0, len = this.itemType.length; i < len; i++) {
        obj[this.itemType[i]['ZDQZ']] = this.itemType[i]['QZSM']
      }
      return obj
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
    handleSearch () {
      this.formParamDisabled = true
      this.dialogTitle = '查看问题'
      this.dialogVisible = true
    },
    searchQues () {
      this.loading = true
      let param = [{
        bex_codes: 'iobs_qryQuestionItem',
        BUSI_MODU_CODE: this.$store.state.user.userFlag,
        ITEM_NO: this.queryParam.ITEM_NO,
        ITEM_NAME_LIKE: this.queryParam.ITEM_NAME_LIKE,
        ITEM_TYPE: this.queryParam.ITEM_TYPE,
        IS_INTERRUPT: this.queryParam.IS_INTERRUPT,
        IS_WAIT2_ENTER: this.queryParam.IS_WAIT2_ENTER,
        CREATED_STAFFNO: this.queryParam.CREATED_STAFFNO,
        LAST_UPDATED_STAFFNO: this.queryParam.LAST_UPDATED_STAFFNO
      }]
      console.log(this)
      KJDPservice(param).then(res => {
        this.pageCount = res[0].data.length
        this.tableData = res[0].data
        this.showTableData = this.tableData.slice(0, this.pageSize)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleEdit () {
      this.formParamDisabled = false
      this.dialogTitle = '修改问题'
      this.dialogVisible = true
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
      this.formParamDisabled = false
      this.dialogTitle = '新增问题'
      this.dialogVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      let begin = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      this.showTableData = this.tableData.slice(begin, end)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      let begin = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      this.showTableData = this.tableData.slice(begin, end)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
