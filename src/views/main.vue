<template>
  <div class="dzh-main">
    <el-menu
      class="aside"
      background-color="#F5F5F5"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      router
      >
      <div v-for="(child, index) in $router.options.routes" :key="index">
        <el-submenu v-if="!child.hidden && child.children"  :index="child.path">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{child.meta.title}}</span>
          </template>
          <div v-for="(cchild, cindex) in child.children" :key="cindex">
            <el-menu-item :index='`${child.path}/${cchild.path}`'>{{cchild.meta.title}}</el-menu-item>
          </div>
        </el-submenu>
      </div>
    </el-menu>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { KJDPservice } from '@/api/kjdp'
export default {
  name: 'dzhMain',
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {

  },
  created () {
    // 自动获取web部署的上下文路径
    var a = document.scripts[document.scripts.length - 1].src
    a = a.substring(a.indexOf('/', 8), a.indexOf('/lib'))
    console.log(this.$router)
    console.log(a)
    let param = [{
      bex_codes: 'iobs_qryScheTask'
    }]
    KJDPservice(param).then(res => {
      console.log(res)
    })
  },
  mounted () {

  },
  destroyed () {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .dzh-main{
    height: 100%;
    .aside{
      width: 250px;
      float: left;
      height: 100%;
    }
    .main{
      margin-left: 250px;
      height: 100%;
      padding: 10px 15px;
    }
  }
</style>
