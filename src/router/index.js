import {createRouter, createWebHistory} from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layouts/top-menu/Main')
  },
  {
    path: '/workspace',
    name: 'Workspace',
    component: () => import('@/layouts/side-menu/Main'),
    children: [
      {
        path: 'contries',
        name: 'Country',
        permission: ['DICT_READ'],
        component: () => import('@/views/COATE/Country')
      },
      {
        path: 'regions',
        name: 'Region',
        permission: ['DICT_READ'],
        component: () => import('@/views/COATE/Region')
      },
      {
        path: 'areas',
        name: 'Area',
        permission: ['DICT_READ'],
        component: () => import('@/views/COATE/Area')
      },
      {
        path: 'accessControl',
        name: 'AccessControl',
        permission: ['SUPER_ADMIN'],
        component: () => import('@/views/Users/accessControl/Main')
      },
      {
        path: 'userRole',
        name: 'UserRole',
        permission: ['SUPER_ADMIN'],
        component: () => import('@/views/Users/userRole/Main')
      },
    ]
  },

  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('@/views/Auth/SignIn')
  },
  {
    path: '/sign-out',
    name: 'SignOut',
    component: {
      beforeRouteEnter(to, from, next) {
        const destination = {
          path: '/',
          query: from.query,
          params: from.params
        }
        store.dispatch('auth/signOut')
        next(destination)
      }
    }
  },
  {
    path: '/404',
    name: 'ErrorPage',
    component: () => import('@/views/error-page/Main')
  },
  {
    path: '/403',
    name: 'ErrorPage403',
    component: () => import('@/views/error-page/Main403')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error-page/Main')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || {left: 0, top: 0}
  }
})
router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/workspace', '/sign-in', '/404', '/sign-out', '/403', '/sickLeaveCertificate', '/citizen', '/foreigner', '/enlisted-population', '/online-recording', '/check-talon']

  const path = to.path
  let pathNew = to.path
  const authRequired = !publicPages.includes(path)
  const loggedIn = store.state.auth.user
  pathNew = pathNew.substr(1)
  let perm = null

  let tmp = pathNew.split('/')
  tmp.pop()
  let ed = ''
  tmp.forEach(item => {
    ed += item + '/';
  })
  ed += ':id'

  if (ed === 'cetificate/validate/:id') {
    next()
  }

  routes[1].children.forEach(item => {
    if ("workspace/" + item.path === pathNew) {
      perm = item.permission
    } else {
      let tempPath = pathNew.split('/')
      tempPath.pop()
      let edited = ''
      tempPath.forEach(item => {
        edited += item + '/';
      })
      edited += ':id'

      if ("workspace/" + item.path === edited) {
        perm = item.permission
      }
    }
  })
  if (authRequired && !loggedIn) {
    next('/sign-in')
  } else if (publicPages.includes(path)) {
    if (path === '/workspace' && !loggedIn) {
      next('/sign-in')
    } else {
      next()
    }
  } else {
    if (loggedIn && store.state.auth.user.privilege != null) {
      if (path === '/') {
        next('/workspace')
      }
      const userPermissions = JSON.parse(
        JSON.stringify(store.state.auth.user.privilege)
      )
      if (checkArray(userPermissions, perm)) {
        next()
      } else {
        next({
          name: 'ErrorPage403'
        })
      }
    } else {
      next({
        name: 'ErrorPage403'
      })
    }
  }
})
const checkArray = function (userPermissions, permission) {
  let isAccess = false
  if (permission != null || permission != undefined) {
    userPermissions.forEach(item => {
      permission.forEach(item2 => {
        if (item === item2 || item === 'SUPER_ADMIN') {
          isAccess = true
        }
      })
    })
  }
  return isAccess
}


export default router
