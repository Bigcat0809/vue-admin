import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main'
Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/surveyManagement/questionMaintain',
      hidden: true
    },
    {
      path: '/taskManagement',
      component: Main,
      meta: {
        title: '智能外呼任务管理',
        icon: 'survey'
      },
      children: [
        {
          path: 'taskMaintain',
          component: () => import('@/views/taskManagement/taskMaintain'),
          meta: { title: '任务维护' }
        },
        {
          path: 'taskReview',
          component: () => import('@/views/taskManagement/taskReview'),
          meta: { title: '任务审核' }
        },
        {
          path: 'policySetting',
          component: () => import('@/views/taskManagement/policySetting'),
          meta: { title: '外呼策略设置' }
        },
        {
          path: 'taskParamDefine',
          component: () => import('@/views/taskManagement/taskParamDefine'),
          meta: { title: '任务参数定义' }
        },
        {
          path: 'taskSchedule',
          component: () => import('@/views/taskManagement/taskSchedule'),
          meta: { title: '任务调度' }
        },
        {
          path: 'taskTransition',
          component: () => import('@/views/taskManagement/taskTransition'),
          meta: { title: '任务过滤管理' }
        }
      ]
    },
    {
      path: '/surveyManagement',
      component: Main,
      meta: {
        title: '问卷管理',
        icon: 'survey'
      },
      children: [
        {
          path: 'questionMaintain',
          component: () => import('@/views/surveyManagement/questionMaintain'),
          meta: { title: '问题库维护' }
        },
        {
          path: 'surveyDesign',
          component: () => import('@/views/surveyManagement/surveyDesign'),
          meta: { title: '问卷设计' }
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/login')
    },
    {
      path: '/homePage',
      component: () => import('@/views/homePage/homePage')
    },
    {
      path: '/canvas',
      component: () => import('@/views/canvas/canvas')
    }
  ]
})
