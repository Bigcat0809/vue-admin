<template>
  <div class="dzh-container">
    <el-form ref="queryParam"  :inline="true" :model="queryParam" class="dzh-form_query">
      <el-col :span="6">
        <el-form-item prop="TASK_ID">
          <el-input v-model="queryParam.TASK_ID" placeholder="任务编号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="TASK_NAME_LIKE">
          <el-input v-model="queryParam.TASK_NAME_LIKE" placeholder="任务名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="TASK_TYPE">
          <el-select clearable  v-model="queryParam.TASK_TYPE" placeholder="任务类型">
            <el-option v-for="(item, index) in TASK_TYPE" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="TASK_DATE">
          <el-date-picker
            v-model="queryParam.TASK_DATE"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyyMMdd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="TASK_STATUS">
          <el-select clearable  v-model="queryParam.TASK_STATUS" placeholder="任务状态">
            <el-option v-for="(item, index) in TASK_STATUS" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="AUDIT_STATUS">
          <el-select clearable  v-model="queryParam.AUDIT_STATUS" placeholder="审核状态">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="待审核" value="1"></el-option>
            <el-option label="通过" value="2"></el-option>
            <el-option label="否决" value="3"></el-option>
            <el-option label="退回重改" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="TASK_URGENT_LEVEL">
          <el-select clearable  v-model="queryParam.TASK_URGENT_LEVEL" placeholder="任务紧急程度">
            <el-option label="一般" value="0"></el-option>
            <el-option label="紧急" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="QUES_NO">
          <query-questionare placeholder="关联问卷" v-model="queryParam.QUES_NO"></query-questionare>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="AUDIT_STAFFNO">
          <query-emp  placeholder="审核员工" v-model="queryParam.AUDIT_STAFFNO"></query-emp>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="LEDER_STAFFNO">
          <query-emp  placeholder="负责人编号" v-model="queryParam.LEDER_STAFFNO"></query-emp>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="CREATED_STAFFNO">
          <query-emp  placeholder="创建人" v-model="queryParam.CREATED_STAFFNO"></query-emp>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click.native="searchQues">查询</el-button>
          <el-button  @click.native="resetForm('queryParam')">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" @click.native="addTask">新增</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <el-scrollbar class="dzh-scroll" style="height: calc(100vh - 274px);">
      <el-table
        v-loading="loading"
        :data="showTableData"
        @row-dblclick="queryTask"
        border
        style="width: 100%">
        <el-table-column sortable width="100px" align="center"  prop="TASK_ID" label="任务编号"></el-table-column>
        <el-table-column sortable min-width="200px"  show-overflow-tooltip prop="TASK_NAME" label="任务名称"></el-table-column>
        <el-table-column width="70px" align="center" prop="ITEM_NAME" label="任务来源">
          <template slot-scope="scope">
            <span v-text="scope.row.ITEM_NAME === '1' ? '外部' : '自建'"></span>
          </template>
        </el-table-column>
        <el-table-column width="75px"  align="center"  label="紧急程度">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.TASK_URGENT_LEVEL === '1'" type="danger" size="medium">紧急</el-tag>
            <el-tag v-else size="medium">一般</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="80px" align="center" prop="TASK_TYPE" label="任务类型">
          <template slot-scope="scope">
            <span v-text="fmt_dict(scope.row, 'TASK_TYPE')"></span>
          </template>
        </el-table-column>
        <el-table-column width="80px" align="center" prop="TASK_STATUS" label="任务状态">
          <template slot-scope="scope">
            <span v-text="fmt_dict(scope.row, 'TASK_STATUS')"></span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="center" prop="AUDIT_FLAG" label="是否需要审核">
          <template slot-scope="scope">
            <span v-text="scope.row.AUDIT_FLAG === '1' ? '需要' : '不需要'"></span>
          </template>
        </el-table-column>
        <el-table-column width="85px"  align="center"  label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.AUDIT_STATUS === '0'" type="info" size="medium">未审核</el-tag>
            <el-tag v-else-if="scope.row.AUDIT_STATUS === '1'" size="medium">待审核</el-tag>
            <el-tag v-else-if="scope.row.AUDIT_STATUS === '2'" type="success" size="medium">通过</el-tag>
            <el-tag v-else-if="scope.row.AUDIT_STATUS === '3'" type="danger" size="medium">否决</el-tag>
            <el-tag v-else-if="scope.row.AUDIT_STATUS === '4'" type="warning" size="medium">退回重改</el-tag>
            <el-tag v-else size="medium">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" prop="QUES_NAME" label="关联问卷"></el-table-column>
        <el-table-column width="85px" align="center" prop="CUST_COUNT"  label="任务名单数"></el-table-column>
        <el-table-column width="75px" align="center" prop="LAST_UPDATED_STAFFNO_NAME" label="修改人"></el-table-column>
        <!-- <el-table-column width="120px" align="center" label="创建日期">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.CREATED_DATE }}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center" width="250px" fixed="right" label="操作">
          <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                @click="modifyTask(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-dropdown trigger="click" style="marginLeft: 5px;" :hide-on-click="false">
              <el-button type="primary">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleSearch(scope.$index, scope.row)">状态调整</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleSearch(scope.$index, scope.row)">名单导入</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleSearch(scope.$index, scope.row)">名单管理</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleSearch(scope.$index, scope.row)">拨打规则</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleSearch(scope.$index, scope.row)">参数设置</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="pageCount">
    </el-pagination>
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
                <el-option v-for="(item, index) in TASK_TYPE" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
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
                <el-option v-for="(item, index) in TASK_TYPE" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
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
    <el-dialog
      :title="taskDialogTitle"
      top="5vh"
      @closed="afterCloseTask"
      :visible.sync="taskDialogVisible">
      <div class="dzh-taskDialog">
        <div style="height: 300px;width:120px;">
          <el-steps direction="vertical" finish-status="success" process-status="finish" :active="activeIndex">
            <el-step title="基础信息"></el-step>
            <el-step title="执行方式"></el-step>
            <el-step title="客户模型"></el-step>
          </el-steps>
        </div>
        <div>
          <div v-show="activeIndex === 0">
            <el-form ref="basicInfoForm"  style="width:465px;" :rules="basicInfoRules" :disabled="basicInfoFormDisabled"  :model="basicInfoForm" label-width="120px">
              <el-form-item label="任务名称" prop="TASK_NAME" required>
                <el-input v-model="basicInfoForm.TASK_NAME" placeholder="任务名称"></el-input>
              </el-form-item>
              <el-form-item label="任务起止日期" prop="TASK_DATE" >
                <el-date-picker
                  v-model="basicInfoForm.TASK_DATE"
                  type="daterange"
                  align="right"
                  unlink-panels
                  value-format="yyyyMMdd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="任务状态" prop="TASK_STATUS"  required>
                <el-select v-model="basicInfoForm.TASK_STATUS" placeholder="任务状态">
                  <el-option v-for="(item, index) in TASK_STATUS" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务类型" prop="TASK_TYPE" required>
                <el-select v-model="basicInfoForm.TASK_TYPE" placeholder="任务类型">
                  <el-option v-for="(item, index) in TASK_TYPE" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务所属单位" prop="TASK_DEPT_NO">
                <query-sale-offices v-model="basicInfoForm.TASK_DEPT_NO"></query-sale-offices>
              </el-form-item>
              <el-form-item label="是否需要审核" prop="AUDIT_FLAG" required>
                <el-switch active-value="1" inactive-value="0" v-model="basicInfoForm.AUDIT_FLAG"></el-switch>
              </el-form-item>
              <el-form-item label="紧急程度" prop="TASK_URGENT_LEVEL" required>
                <!-- <el-radio v-for="(item, index) in TASK_URGENT_LEVEL" :key="index" v-model="basicInfoForm.TASK_URGENT_LEVEL" label="item.ZDQZ">{{item.QZSM}}</el-radio> -->
                <el-radio v-model="basicInfoForm.TASK_URGENT_LEVEL" label="1">紧急</el-radio>
                <el-radio v-model="basicInfoForm.TASK_URGENT_LEVEL" label="0">一般</el-radio>
              </el-form-item>
              <el-form-item label="任务来源" prop="TASK_SOURCE" required>
                <el-radio  v-model="basicInfoForm.TASK_SOURCE" label="1">外部任务</el-radio>
                <el-radio  v-model="basicInfoForm.TASK_SOURCE" label="0">自建</el-radio>
              </el-form-item>
              <el-form-item v-show="basicInfoForm.TASK_SOURCE === '1'" label="外部接口" prop="wbjk">
                <query-task-schedule v-model="basicInfoForm.wbjk"></query-task-schedule>
              </el-form-item>
              <el-form-item  label="任务说明" prop="TASK_DESC">
                <el-input v-model="basicInfoForm.TASK_DESC" type="textarea" :autosize="{ minRows: 1, maxRows: 7}"></el-input>
              </el-form-item>
            </el-form>
            <div style="marginLeft: 120px;">
              <el-button type="primary" @click="nextStep('basicInfoForm')">下一步</el-button>
            </div>
          </div>
          <div v-show="activeIndex === 1">
            <el-form ref="executeModeForm" :rules="executeModeRules" :disabled="executeModeFormDisabled" :model="executeModeForm" label-width="140px">
              <el-form-item label="回访方式" required>
                <el-select disabled v-model="executeModeForm.BUSI_MODU_CODE" placeholder="回访方式">
                  <el-option v-for="(item, index) in BUSI_MODU_CODE" :key="index" :label="item.QZSM" :value="item.ZDQZ"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="自助外呼内容类型" required>
                <el-select disabled v-model="executeModeForm.TASK_CONT_TYPE" placeholder="自助外呼内容类型">
                  <el-option label="问卷" value="1"></el-option>
                  <el-option label="通知通告" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="自助执行方式" prop="EXEC_CHNL_CODE" required>
                <el-select v-model="executeModeForm.EXEC_CHNL_CODE" placeholder="自助执行方式">
                  <el-option  label="网络" value="0"></el-option>
                  <el-option  label="短信" value="1"></el-option>
                  <el-option  label="微信" value="2"></el-option>
                  <el-option  label="IVR" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="关联问卷" prop="QUES" required>
                <query-questionare @handleSubmit="QUES_Submit" v-model="executeModeForm.QUES"></query-questionare>
              </el-form-item>
              <el-form-item  label="外呼起止时间段1">
                <el-time-select
                  placeholder="起始时间"
                  v-model="executeModeForm.CALLOUT_BEGIN_TIME1"
                  :picker-options="{
                    start: '08:30',
                    step: '00:05',
                    end: '20:30'
                  }">
                </el-time-select>
                <el-time-select
                  style="marginLeft: 10px;"
                  placeholder="结束时间"
                  v-model="executeModeForm.CALLOUT_END_TIME1"
                  :picker-options="{
                    start: '08:30',
                    step: '00:05',
                    end: '20:30',
                    minTime: executeModeForm.CALLOUT_BEGIN_TIME1
                  }">
                </el-time-select>
              </el-form-item>
              <el-form-item  label="外呼起止时间段2">
                <el-time-select
                  placeholder="起始时间"
                  v-model="executeModeForm.CALLOUT_BEGIN_TIME2"
                  :picker-options="{
                    start: '08:30',
                    step: '00:05',
                    end: '20:30'
                  }">
                </el-time-select>
                <el-time-select
                  placeholder="结束时间"
                  style="marginLeft: 10px;"
                  v-model="executeModeForm.CALLOUT_END_TIME2"
                  :picker-options="{
                    start: '08:30',
                    step: '00:05',
                    end: '20:30',
                    minTime: executeModeForm.CALLOUT_BEGIN_TIME2
                  }">
                </el-time-select>
              </el-form-item>
              <el-form-item  label="外呼起止时间段3">
                <el-time-select
                  placeholder="起始时间"
                  v-model="executeModeForm.CALLOUT_BEGIN_TIME3"
                  :picker-options="{
                    start: '08:30',
                    step: '00:05',
                    end: '20:30'
                  }">
                </el-time-select>
                <el-time-select
                  placeholder="结束时间"
                  style="marginLeft: 10px;"
                  v-model="executeModeForm.CALLOUT_END_TIME3"
                  :picker-options="{
                    start: '08:30',
                    step: '00:05',
                    end: '20:30',
                    minTime: executeModeForm.CALLOUT_BEGIN_TIME3
                  }">
                </el-time-select>
              </el-form-item>
            </el-form>
            <div style="marginLeft: 140px;">
              <el-button @click="activeIndex--">上一步</el-button>
              <el-button type="primary" @click="nextStep('executeModeForm')">下一步</el-button>
            </div>
          </div>
          <div v-show="activeIndex === 2">
            <el-form style="width:465px;" ref="customerModelForm"  :disabled="customerModelFormDisabled" :model="customerModelForm" label-width="120px">
              <el-form-item  label="动态展示列">
                <el-input v-model="customerModelForm.DTZSL"></el-input>
              </el-form-item>
              <el-form-item  label="固定展示列">
                <el-select multiple collapse-tags v-model="customerModelForm.GDZSL" placeholder="固定展示列">
                  <el-option  label="客户编号" value="khbh"></el-option>
                  <el-option  label="客户姓名" value="khxm"></el-option>
                  <el-option  label="资金帐号" value="zjzh"></el-option>
                  <el-option  label="营业部" value="jgid"></el-option>
                  <el-option  label="联系号码" value="hcdhhm"></el-option>
                  <el-option  label="备注信息" value="bz"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  label="客户模型">
                <el-input v-model="taskFormParam.KHMXZD"></el-input>
              </el-form-item>
            </el-form>
            <div style="marginLeft: 120px;">
              <el-button @click="activeIndex--">上一步</el-button>
              <el-button v-show="taskFormStatus !== 'qry'" type="primary" @click="submitTask">完成提交</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDict } from '@/utils/ka.js'
import { KJDPservice } from '@/api/kjdp'
import queryTaskSchedule from '@/components/Query/taskSchedule'
import queryQuestionare from '@/components/Query/questionare'
import querySaleOffices from '@/components/Query/saleOffices'
import queryEmp from '@/components/Query/emp'
export default {
  name: 'taskMaintain',
  components: {
    queryTaskSchedule,
    queryQuestionare,
    querySaleOffices,
    queryEmp
  },
  data () {
    // var validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入密码'))
    //   } else {
    //     if (this.ruleForm2.checkPass !== '') {
    //       this.$refs.ruleForm2.validateField('checkPass')
    //     }
    //     callback()
    //   }
    // }
    return {
      queryParam: {
        TASK_ID: '',
        TASK_NAME_LIKE: '',
        TASK_TYPE: '',
        TASK_DATE: [],
        IS_WAIT2_ENTER: '',
        CREATED_STAFFNO: '',
        LAST_UPDATED_STAFFNO: ''
      },
      formParam: {
        ITEM_NO: '',
        ITEM_NAME: '',
        ITEM_TYPE: ''
      },
      taskFormParam: {
        TASK_NAME: '',
        TASK_STATUS: '',
        TASK_TYPE: '',
        TASK_URGENT_LEVEL: '',
        TASK_DATE: '',
        AUDIT_FLAG: '',
        TASK_SOURCE: '',
        wbjk: '',
        TASK_DESC: '',
        BUSI_MODU_CODE: '',
        TASK_CONT_TYPE: '',
        EXEC_CHNL_CODE: '',
        QUES: '',
        CALLOUT_BEGIN_TIME1: '',
        CALLOUT_END_TIME1: '',
        CALLOUT_BEGIN_TIME2: '',
        CALLOUT_END_TIME2: '',
        CALLOUT_BEGIN_TIME3: '',
        CALLOUT_END_TIME3: ''
      },
      // 基础信息form
      basicInfoForm: {
        TASK_NAME: '',
        TASK_TYPE: '',
        TASK_DESC: '',
        TASK_DATE: [],
        TASK_STATUS: '',
        AUDIT_FLAG: false,
        TASK_SOURCE: '',
        TASK_URGENT_LEVEL: '',
        TASK_DEPT_NO: '',
        wbjk: ''
      },
      basicInfoFormDisabled: false,
      basicInfoRules: {
        TASK_NAME: [
          // { validator: validatePass, trigger: 'blur' },
          { required: true, message: '请填写任务名称！', trigger: 'blur' },
          { max: 60, message: '长度不能超过 60 个字符', trigger: 'blur' }
        ],
        TASK_STATUS: [
          { required: true, message: '请选择任务状态', trigger: 'blur' }
        ],
        TASK_TYPE: [
          { required: true, message: '请选择任务类型', trigger: 'blur' }
        ],
        TASK_DESC: [
          { max: 600, message: '长度不能超过 600 个字符', trigger: 'blur' }
        ]
      },
      // 执行方式form
      executeModeForm: {
        BUSI_MODU_CODE: this.$store.state.user.userFlag,
        TASK_CONT_TYPE: '1',
        EXEC_CHNL_CODE: '',
        QUES: '',
        QUES_NO: '',
        QUES_VERSION_NO: '',
        CALLOUT_BEGIN_TIME1: '',
        CALLOUT_END_TIME1: '',
        CALLOUT_BEGIN_TIME2: '',
        CALLOUT_END_TIME2: '',
        CALLOUT_BEGIN_TIME3: '',
        CALLOUT_END_TIME3: ''
      },
      executeModeFormDisabled: false,
      executeModeRules: {
        EXEC_CHNL_CODE: [
          { required: true, message: '请选择自助执行方式', trigger: 'blur' }
        ],
        QUES: [
          { required: true, message: '请选择关联问卷', trigger: 'blur' }
        ]
      },
      customerModelForm: {
        DTZSL: '',
        GDZSL: ['khbh', 'khxm', 'zjzh', 'jgid', 'hcdhhm', 'bz'],
        KHMXZD: ''
      },
      customerModelFormDisabled: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableData: [],
      showTableData: [],
      loading: false,
      dialogVisible: false,
      taskDialogTitle: '',
      taskDialogVisible: false,
      formParamDisabled: false,
      submitLoading: false,
      taskFormStatus: 'add',
      dialogTitle: '',
      currentPage: 1,
      pageCount: 0,
      pageSize: 10,
      activeIndex: 0,
      rowData: null
    }
  },
  computed: {
    TASK_TYPE () {
      return getDict('任务类型')
    },
    TASK_STATUS () {
      return getDict('任务状态')
    },
    BUSI_MODU_CODE () {
      return getDict('业务用途')
    },
    TASK_URGENT_LEVEL () {
      return getDict('任务紧急程度')
    }
  },
  created () {
    this.searchQues()
  },
  mounted () {

  },
  methods: {
    fmt_dict (row, field) {
      let obj = {}
      let arr = this[field]
      for (let i = 0, len = arr.length; i < len; i++) {
        obj[arr[i]['ZDQZ']] = arr[i]['QZSM']
      }
      return obj[row[field]]
    },
    wbjkSubmit (row) {
      console.log(row)
    },
    QUES_Submit (row) {
      console.log(row)
      this.executeModeForm.QUES_NO = row.QUES_NO
      this.executeModeForm.QUES_VERSION_NO = row.VERSION_NO
    },
    nextStep (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.activeIndex++
        } else {
          // console.log('error submit!!');
          // return false;
        }
      })
    },
    // 查看任务
    queryTask (row) {
      this.taskFormStatus = 'qry'
      this.taskDialogTitle = '查看任务'
      this.taskDialogVisible = true
      this.basicInfoFormDisabled = true
      this.executeModeFormDisabled = true
      this.customerModelFormDisabled = true
      this.rowData = row
      this.fillData()
    },
    // 修改任务
    modifyTask (row) {
      this.taskFormStatus = 'upt'
      this.taskDialogTitle = '修改任务'
      this.taskDialogVisible = true
      this.rowData = row
      this.executeModeForm.QUES_NO = this.rowData.QUES_NO
      this.executeModeForm.QUES_VERSION_NO = this.rowData.QUES_VERSION_NO
      this.fillData()
    },
    // 新增任务
    addTask () {
      this.taskFormStatus = 'add'
      this.formParamDisabled = false
      this.taskDialogTitle = '新增任务'
      this.taskDialogVisible = true
    },
    fillData () {
      this.basicInfoForm.TASK_NAME = this.rowData.TASK_NAME
      this.basicInfoForm.TASK_TYPE = this.rowData.TASK_TYPE
      this.basicInfoForm.TASK_DESC = this.rowData.TASK_DESC
      this.basicInfoForm.TASK_DATE.push(this.rowData.TASK_BEGEN_DATE)
      this.basicInfoForm.TASK_DATE.push(this.rowData.TASK_END_DATE)
      this.basicInfoForm.TASK_STATUS = this.rowData.TASK_STATUS
      this.basicInfoForm.AUDIT_FLAG = this.rowData.AUDIT_FLAG
      this.basicInfoForm.TASK_SOURCE = this.rowData.TASK_SOURCE || '1' // todo
      this.basicInfoForm.wbjk = this.rowData.EXTEN_FIELD
      this.basicInfoForm.TASK_DEPT_NO = this.rowData.TASK_DEPT_NO
      this.basicInfoForm.TASK_URGENT_LEVEL = this.rowData.TASK_URGENT_LEVEL
      this.executeModeForm.BUSI_MODU_CODE = this.rowData.BUSI_MODU_CODE
      this.executeModeForm.QUES = this.rowData.QUES_NAME
      let ajaxParam = {
        bex_codes: 'iobs_qryAutoTaskProp',
        TASK_ID: parseInt(this.rowData.TASK_ID)
      }
      KJDPservice([ajaxParam]).then(res => {
        let data = res[0].data[0]
        if (res[0].data.length) {
          this.executeModeForm.TASK_CONT_TYPE = data.TASK_CONT_TYPE
          this.executeModeForm.EXEC_CHNL_CODE = data.EXEC_CHNL_CODE
          this.executeModeForm.CALLOUT_BEGIN_TIME1 = data.CALLOUT_BEGIN_TIME1
          this.executeModeForm.CALLOUT_END_TIME1 = data.CALLOUT_END_TIME1
          this.executeModeForm.CALLOUT_BEGIN_TIME2 = data.CALLOUT_BEGIN_TIME2
          this.executeModeForm.CALLOUT_END_TIME2 = data.CALLOUT_END_TIME2
          this.executeModeForm.CALLOUT_BEGIN_TIME3 = data.CALLOUT_BEGIN_TIME3
          this.executeModeForm.CALLOUT_END_TIME3 = data.CALLOUT_END_TIME3
          this.customerModelForm.CUST_VIEW_ITEMS = data.CUST_VIEW_ITEMS
        }
      })
    },
    submitTask () {
      this.submitLoading = true
      let ajaxParam = {
        TASK_NAME: this.basicInfoForm.TASK_NAME, // 任务名称
        TASK_TYPE: this.basicInfoForm.TASK_TYPE, // 任务类型
        TASK_DESC: this.basicInfoForm.TASK_DESC, // 任务说明
        TASK_BEGEN_DATE: this.basicInfoForm.TASK_DATE[0] || '', // 任务日期起
        TASK_END_DATE: this.basicInfoForm.TASK_DATE[1] || '', // 任务日期止
        TASK_STATUS: this.basicInfoForm.TASK_STATUS, // 任务状态
        BUSI_MODU_CODE: this.executeModeForm.BUSI_MODU_CODE, // 业务用途
        EXEC_CHNL_CODE: this.executeModeForm.EXEC_CHNL_CODE, // 自助执行方式
        TASK_DEPT_NO: this.basicInfoForm.TASK_DEPT_NO, // 任务所属单位
        TASK_URGENT_LEVEL: this.basicInfoForm.TASK_URGENT_LEVEL, // 任务紧急程度
        QUES_NO: this.executeModeForm.QUES_NO, // 关联问卷号
        QUES_VERSION_NO: this.executeModeForm.QUES_VERSION_NO, // 关联问卷版本号
        CUST_VIEW_ITEMS: this.customerModelForm.KHMXZD, // 客户数据模型
        ATTA_FILE_NAME: '', // 附件
        LEDER_STAFFNO: this.basicInfoForm.LEDER_STAFFNO || this.$store.state.user.userFlag, // 负责人编号
        // TASK_SOURCE: this.basicInfoForm.TASK_SOURCE, // 任务来源 暂时无此字段查询
        EXTEN_FIELD: this.basicInfoForm.wbjk, // 扩展标识： 暂时用来存储外部接口
        AUDIT_FLAG: this.basicInfoForm.AUDIT_FLAG// 审核标志
      }
      if (this.taskFormStatus === 'upt') {
        // 修改接口所需字段
        ajaxParam.bex_codes = 'iobs_uptTaskDef'
        ajaxParam.TASK_ID = parseInt(this.rowData.TASK_ID)
        ajaxParam.AUDIT_STATUS = this.rowData.AUDIT_STATUS || '' // 审核状态
        ajaxParam.AUDIT_DATE = this.rowData.AUDIT_DATE || '' // 审核日期
        ajaxParam.AUDIT_TIME = this.rowData.AUDIT_TIME || '' // 审核时间
        ajaxParam.AUDIT_STAFFNO = this.rowData.AUDIT_STAFFNO || '' // 审核员工
        ajaxParam.AUDIT_VIEW_DESC = this.rowData.AUDIT_VIEW_DESC || '' // 审核意见
        ajaxParam.CUST_NUM = this.rowData.CUST_NUM || '' // 名单数量
        ajaxParam.LAST_UPDATED_STAFFNO = this.$store.state.user.userFlag
      } else if (this.taskFormStatus === 'add') {
        // 新增接口所需字段
        ajaxParam.bex_codes = 'iobs_addTaskDef'
        ajaxParam.CREATED_STAFFNO = this.$store.state.user.userFlag
      };
      console.log(ajaxParam)
      KJDPservice([ajaxParam]).then(res => {
        console.log(res)
        let taskId = res[0].data[0].ID
        let ajaxParamExtendIOC = {
          bex_codes: this.taskFormStatus === 'add' ? 'iobs_addAutoTaskProp' : 'iobs_uptAutoTaskProp',
          TASK_ID: this.taskFormStatus === 'add' ? parseInt(taskId) : parseInt(this.rowData.TASK_ID),
          EXEC_CHNL_CODE: this.executeModeForm.EXEC_CHNL_CODE,
          TASK_CONT_TYPE: this.executeModeForm.TASK_CONT_TYPE || '1',
          NOTICE_NO: 0,
          CALLOUT_BEGIN_TIME1: this.executeModeForm.CALLOUT_BEGIN_TIME1,
          CALLOUT_END_TIME1: this.executeModeForm.CALLOUT_END_TIME1,
          CALLOUT_BEGIN_TIME2: this.executeModeForm.CALLOUT_BEGIN_TIME2,
          CALLOUT_END_TIME2: this.executeModeForm.CALLOUT_END_TIME2,
          CALLOUT_BEGIN_TIME3: this.executeModeForm.CALLOUT_BEGIN_TIME3,
          CALLOUT_END_TIME3: this.executeModeForm.CALLOUT_END_TIME3
        }
        console.log(ajaxParamExtendIOC)
        KJDPservice([ajaxParamExtendIOC]).then(res => {
          this.searchQues()
          this.submitLoading = false
          this.taskDialogVisible = false
          this.$notify({
            message: '新增任务成功！',
            type: 'success',
            position: 'bottom-right'
          })
        })
      }).catch((err) => {
        console.log(err)
        this.$message.error('新增任务失败！')
        this.submitLoading = false
      })
    },
    // 任务对话框被关闭后
    afterCloseTask () {
      this.activeIndex = 0
      this.basicInfoFormDisabled = false
      this.executeModeFormDisabled = false
      this.customerModelFormDisabled = false
      this.$refs['basicInfoForm'].resetFields()
      this.$refs['executeModeForm'].resetFields()
      this.$refs['customerModelForm'].resetFields()
    },
    cancelDisabledTask () {

    },
    openTaskDialog (type) {

    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleSearch () {
      this.formParamDisabled = true
      this.dialogTitle = '查看问题'
      this.dialogVisible = true
    },
    searchQues () {
      this.loading = true
      let param = {
        bex_codes: 'iobs_qryTaskDef',
        BUSI_MODU_CODE: this.$store.state.user.userFlag || ''
        // LAST_UPDATED_STAFFNO: this.queryParam.LAST_UPDATED_STAFFNO
      }
      console.log(param)
      KJDPservice([param]).then(res => {
        this.pageCount = res[0].data.length
        this.tableData = res[0].data
        this.showTableData = this.tableData.slice(0, this.pageSize)
        this.loading = false
      }).catch((res) => {
        this.loading = false
        console.log(res)
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
