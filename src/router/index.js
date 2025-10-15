import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import { isAuthenticated } from "../Authentication/auth";
import NotFoundView from "../views/NotFoundView.vue";
import DashboardView from "../views/DashboardView.vue";
import RegisterView from "../views/RegisterView.vue";
import SupportTicketSystem from "../components/SupportTicketSystem.vue";
import InvestmentView from "../views/InvestmentView.vue";
import TransactionHistory from '../views/TransactionHistory.vue'
import BuyInvestment from '../views/BuyInvestment.vue'
import MyPortfolio from '../views/MyPortfolio.vue'
import SellInvestment from '../views/SellInvestment.vue'
import AllUserView from "../views/AllUserView.vue";
import UserProfileView from "../views/UserProfileView.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/login',
        name: 'loginPage',
        component: LoginView
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/investments',
        name: 'investment',
        component: InvestmentView,
      },
      {
        path: '/support',
        name: 'support',
        component: SupportTicketSystem,
      },
    {
        path: '/getAllUsers',
        name: 'AdminCallForUsers',
        component: AllUserView
    },
    {
        path: '/profile',
        name: 'MyProfile',
        component: UserProfileView
    },

    { path: '/transactions', component: TransactionHistory },
    { path: '/BuyInvestment', component: BuyInvestment },
    { path: '/myportfolio', component: MyPortfolio },
    {
        path: '/investment/:id',
        name: 'SellInvestment',
        component: SellInvestment,
        props: true
    },
    {
        path: '/buy-investment/:id',
        name: 'BuyInvestment',
        component: BuyInvestment,
        props: true
    },

    { path: '/:catchAll(.*)', name: 'NotFound', component: NotFoundView },

    ]
})


router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register','/dashboard']
    const authRequired = !publicPages.includes(to.path);
    const userLogedIn = isAuthenticated();

    if (!userLogedIn && authRequired) {
        return next('/login');
    }

    if (userLogedIn && (to.path === '/login' || to.path === '/register')) {
        return next('/dashboard');
    }
    next();
})


export default router