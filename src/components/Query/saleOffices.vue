<template>
  <div class="dzh-query">
    <div class="el-input el-input--small el-input-group el-input-group--append">
      <input @input="handleInput" :value="currentValue"  type="text" readonly="readonly" autocomplete="off" :placeholder="placeholder" class="el-input__inner">
      <div class="el-input-group__append">
        <el-button slot="append" @click="dialogVisible = true" icon="el-icon-search"></el-button>
      </div>
    </div>
    <el-dialog
      :title="title"
      append-to-body
      @open="query"
      @closed="reset('queryForm')"
      :close-on-click-modal="false"
      width="70%"
       top="5vh"
      :visible.sync="dialogVisible">
      <el-form ref="queryForm" :inline="true" :model="queryParam" class="dzh-form_query">
        <el-col :span="6">
          <el-form-item prop="dwmc">
            <el-input v-model="queryParam.dwmc" placeholder="单位名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="lxdh1">
            <el-input v-model="queryParam.lxdh1" placeholder="联系电话"></el-input>
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
        <el-table-column align="center" width="120px" sortable  prop="DWBH" label="单位编号"></el-table-column>
        <el-table-column min-width="150px" sortable   show-overflow-tooltip prop="DWMC" label="单位名称"></el-table-column>
        <el-table-column width="85px" align="center" prop="LXDH1" label="联系电话"></el-table-column>
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
        <el-button type="primary" @click="submit('DWMC')">完成提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { KJDPservice } from '@/api/kjdp'
export default {
  name: 'querySaleOffices',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '营业部信息查询'
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    value: [String, Number]
  },
  data () {
    return {
      queryParam: {
        dwmc: '',
        lxdh1: ''
      },
      showTableData: [],
      tableData: [],
      loading: false,
      dialogVisible: false,
      currentPage: 1,
      pageCount: 0,
      pageSize: 10,
      currentRow: null,
      currentValue: this.value === undefined || this.value === null
        ? ''
        : this.value
    }
  },
  watch: {
    value (val, oldValue) {
      this.setCurrentValue(val)
    }
  },
  methods: {
    query () {
      this.loading = true
      let param = {
        bex_codes: 'salesOfficeQuery',
        lxdh1: this.queryParam.lxdh1,
        dwmc: this.queryParam.dwmc
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
          this.currentValue += this.currentRow[i][field] + ','
        }
      } else {
        this.currentValue = this.currentRow[field]
      }
      console.log(this.currentRow)
      this.$emit('handleSubmit', this.currentRow)
      this.$emit('input', this.currentValue)
      this.dialogVisible = false
    },
    reset (formName) {
      this.$refs[formName].resetFields()
    },
    setCurrentValue (value) {
      this.currentValue = value
    },
    handleInput (event) {
      const value = event.target.value
      this.$emit('input', value)
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
    }
  }
}
</script>
