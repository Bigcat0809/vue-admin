<template>
  <div class="dzh-query">
    <el-input readonly :value="value">
      <el-button slot="append" @click="dialogVisible = true" icon="el-icon-search"></el-button>
    </el-input>
    <el-dialog
      :title="title"
      append-to-body
      :visible.sync="dialogVisible">
      <el-form ref="queryForm" :inline="true" :model="queryParam" class="dzh-form_query">
        <el-col v-for="(item, index) in querys" :key="index" :span="6">
          <el-form-item>
            <el-input v-if="item.type === 'input'" v-model="queryParam[item.name]" :placeholder="item.title"></el-input>
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
        :highlight-current-row="!checkbox"
        @current-change="handleClick"
        @selection-change="handleSelectionChange"
        border
        align="center"
        style="width: 100%">
        <el-table-column
          type="selection"
          v-if="checkbox"
          width="55">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :align="item.align"
          :width="item.width"
          :sortable="item.sortable"
          :min-width="item.minWidth"
          :show-overflow-tooltip="itme.showOverflowTooltip"
          :prop="item.field"
          :formatter="item.formatter"
          :label="item.title">
          <slot v-if="item.reDraw" :name="item.field"></slot>
        </el-table-column>
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
        <el-button type="primary" @click="submit">完成提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { KJDPservice } from '@/api/kjdp'
export default {
  name: 'queryTaskSchedule',
  props: {
    title: {
      type: String,
      default: '放大镜查询'
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    queryParam: {
      type: Array,
      default: function () {
        return {
          col: '6',
          size: 'small',
          name: '',
          title: ''
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
      type: Array,
      default: function () {
        return {
          align: 'left',
          width: '50px',
          sortable: false,
          minWidth: '',
          showOverflowTooltip: false,
          field: '',
          formatter: null,
          title: '',
          reDraw: false
        }
      }
    }
  },
  data () {
    return {
      showTableData: [],
      tableData: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '任务调度',
      currentPage: 1,
      pageCount: 0,
      pageSize: 10,
      currentRow: null,
      value: ''
    }
  },
  created () {
    this.query()
  },
  methods: {
    query () {
      this.loading = true
      let param = {
        bex_codes: 'iobs_qryScheTask',
        TASK_NO: this.queryParam.TASK_NO
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
    reset (formName) {
      this.$refs[formName].resetFields()
    },
    submit () {
      this.dialogVisible = false
      this.value = this.currentRow.TASK_NO
      this.$emit('input', this.value)
    },
    handleClick (val) {
      this.currentRow = val
    },
    handleSelectionChange () {

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
