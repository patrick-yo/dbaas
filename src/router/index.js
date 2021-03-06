import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    // component: Home,
    component: resolve => require(['@/components/common/home.vue'], resolve),
    children: [{
      path: '/createdb',
      component: resolve => require(['@/components/page/db/create/index.vue'], resolve),
      meta: {
        title: '创建数据库'
      }
    }, {
      path: '/dashboard',
      component: resolve => require(['@/components/page/dashboard/index.vue'], resolve),
      meta: {
        title: 'Dashboard'
      }
    }]
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/demo",
    name: "Demo",
    component: () => import("../views/Demo.vue"),
  },
  {
    path: "/test1",
    name: "Test1",
    component: () => import("../views/Test1.vue"),
  },
  {
    path: "/test2",
    name: "Test2",
    component: () => import("../views/Test2.vue"),
  },
  {
    path: "/test3",
    name: "Test3",
    component: () => import("../views/topo/index.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
