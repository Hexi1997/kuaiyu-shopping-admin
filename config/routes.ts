export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/dashboard',
              },
              {
                path: '/dashboard',
                name: 'dashboard',
                icon: 'PieChartOutlined',
                component: './Dashboard',
              },
              {
                path: '/usermanager',
                name: 'usermanager',
                icon: 'UserAddOutlined',
                component: './UserManager',
              },
              {
                path: '/goodsmanager',
                name: 'goodsmanager',
                icon: 'AccountBookOutlined',
                component: './GoodsManager',
              },
              {
                path: '/categorymanager',
                name: 'categorymanager',
                icon: 'ApartmentOutlined',
                component: './CategoryManager',
              },
              {
                path: '/ordermanager',
                name: 'ordermanager',
                icon: 'ProfileOutlined',
                component: './OrderManager',
              },
              {
                path: '/swipermanager',
                name: 'swipermanager',
                icon: 'PictureOutlined',
                component: './SwiperManager',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
