<template>
  <div class="dzh-query">
    <el-input :placeholder="placeholder" readonly v-model="value">
      <el-button slot="append" @click="dialogVisible = true" icon="el-icon-search"></el-button>
    </el-input>
    <el-dialog
      :title="title"
      append-to-body
      @open="query"
      :close-on-click-modal="false"
      @closed="reset('queryForm')"
      width="70%"
      top="5vh"
      :visible.sync="dialogVisible">
      <el-form ref="queryForm" :inline="true" :model="queryParam" class="dzh-form_query">
        <el-col :span="6">
          <el-form-item prop="QUES_NO">
            <el-input v-model="queryParam.QUES_NO" placeholder="问卷编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="QUES_TYPE">
            <el-select clearable  v-model="queryParam.QUES_TYPE" placeholder="问卷类型">
              <el-option v-for="(item, index) in QUES_TYPE" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="IS_SCORE">
            <el-select clearable  v-model="queryParam.IS_SCORE" placeholder="问卷是否需要评分">
              <el-option v-for="(item, index) in IS_SCORE" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="CREATED_STAFFNO">
            <query-emp placeholder="创建人编号" v-model="queryParam.CREATED_STAFFNO"></query-emp>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click.native="query">查询</el-button>
            <el-button  @click="reset('queryForm')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-table
        v-loading="loading"
        :data="showTableData"
        :highlight-current-row ="!checkbox"
        @current-change="handleSelect"
        @selection-change="handleSelect"
        border
        align="center"
        style="width: 100%">
        <el-table-column align="center" width="120px" sortable  prop="QUES_NO" label="问卷编号"></el-table-column>
        <el-table-column min-width="150px" sortable   show-overflow-tooltip prop="QUES_NAME" label="问卷名称"></el-table-column>
        <el-table-column width="75px" align="center" prop="VERSION_NO" label="历史版本"></el-table-column>
        <el-table-column width="135px"  align="center" prop="QUES_VALIDDATE"  label="有效期"></el-table-column>
        <el-table-column align="center" prop="QUES_NUM"  label="题目数"></el-table-column>
        <el-table-column align="center" prop="QUES_TYPE" label="问卷类型">
          <template slot-scope="scope">
            <span v-text="fmt_dict(scope.row, 'QUES_TYPE')"></span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="QUES_STATUS" label="问卷状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.QUES_STATUS === '0'" type="danger" size="medium">停用</el-tag>
            <el-tag v-else-if="scope.row.QUES_STATUS === '1'" type="success" size="medium">启用</el-tag>
            <el-tag v-else type="warning" size="medium">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="IS_SCORE" label="是否需要评分">
          <template slot-scope="scope">
            <span v-text="fmt_dict(scope.row, 'IS_SCORE')"></span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="LAST_UPDATED_STAFFNO" label="最后编辑人"></el-table-column>
        <el-table-column width="175px" align="center" prop="LAST_UPDATED_TIME" label="更新日期"></el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="pageCount">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('QUES_NAME')">完成提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDict } from '@/utils/ka.js'
import { KJDPservice } from '@/api/kjdp'
import queryEmp from '@/components/Query/emp'
export default {
  name: 'queryQuestionare',
  components: { queryEmp },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '任务调度信息查询'
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      queryParam: {
        QUES_NO: '',
        QUES_TYPE: '',
        IS_SCORE: '',
        CREATED_STAFFNO: ''
      },
      showTableData: [],
      tableData: [],
      loading: false,
      dialogVisible: false,
      currentPage: 1,
      pageCount: 0,
      pageSize: 10,
      currentRow: null
    }
  },
  computed: {
    QUES_TYPE () {
      return getDict('问卷/题目类型')
    },
    IS_SCORE () {
      return getDict('是否需要评分')
    }
  },
  methods: {
    query () {
      this.loading = true
      let param = {
        bex_codes: 'iobs_qryQuestion',
        USE_FLAG: this.$store.state.user.userFlag,
        QUES_NO: this.queryParam.QUES_NO,
        QUES_TYPE: this.queryParam.QUES_TYPE,
        IS_SCORE: this.queryParam.IS_SCORE,
        CREATED_STAFFNO: this.queryParam.CREATED_STAFFNO
      }
      console.log(param)
      KJDPservice([param]).then(res => {
        this.pageCount = res[0].data.length
        this.tableData = res[0].data
        this.showTableData = this.tableData.slice(0, this.pageSize)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    /** 以下方法为公用部分，不需要修改  */
    submit (field) {
      if (this.checkbox) {
        for (let i = 0, len = this.currentRow.length; i < len; i++) {
          this.value += this.currentRow[i][field] + ','
        }
      } else {
        this.value = this.currentRow[field]
      }
      console.log(this.currentRow)
      this.$emit('handleSubmit', this.currentRow)
      this.$emit('input', this.value)
      this.dialogVisible = false
    },
    reset (formName) {
      this.$refs[formName].resetFields()
    },
    handleSelect (val) {
      this.currentRow = val
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
    },
    fmt_dict (row, field) {
      let obj = {}
      let arr = this[field]
      for (let i = 0, len = arr.length; i < len; i++) {
        obj[arr[i]['ZDQZ']] = arr[i]['QZSM']
      }
      return obj[row[field]]
    }
  }
}
</script>
