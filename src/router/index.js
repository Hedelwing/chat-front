import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { isLoggedIn } from '../utils'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('../views/SignIn.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/chats',
    name: 'Chats',
    component: () => import('../views/Chats.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import('../views/Friends.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/requests',
    name: 'Requests',
    component: () => import('../views/Requests.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/chats/:id',
    name: 'Chat',
    props: ({ params: { id } }) => ({ id }),
    component: () => import('../views/Chat.vue'),
    meta: {
      auth: true
    }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach(({ matched, fullPath }, _, next) => {
  if (matched.some(({ meta }) => meta.auth)) {
    if (!isLoggedIn()) {
      next({
        path: '/signin',
        params: { nextUrl: fullPath }
      })
    }
  } else if (matched.some(({ meta }) => meta.guest)) {
    !isLoggedIn() ? next() : next({ path: '/chats' })
  }
  next()
})

export default router
