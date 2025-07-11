import HomePage from "../pages/HomePage/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductPage from "../pages/ProductsPage/ProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import OrderDetails from "../pages/OrderDetails/OrderDetails";
import PurchaseRequest from "../pages/PurchaseRequestPage/PurchaseRequestPage";
import ContactPage from "../pages/ContactPage/ContactPage";
export const routes = [
    {
        path: '/',
        page: HomePage,
        IsShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        IsShowHeader: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        IsShowHeader: true
    },
    {
        path: '/product',
        page: ProductPage,
        IsShowHeader: true
    },
    {
        path: '/my-all-order',
        page: MyOrderPage,
        IsShowHeader: true
    },
    {
        path: '/purchase-request',
        page: PurchaseRequest,
        IsShowHeader: true
    },
    {
        path: '/contact',
        page: ContactPage,
        IsShowHeader: true
    },
    {
        path: '/orderDetails/:id',
        page: OrderDetails,
        IsShowHeader: true
    },
    {
        path: '/product-detail/:id',
        page: ProductDetailsPage,
        IsShowHeader: true
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        IsShowHeader: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        IsShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        IsShowHeader: false
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        IsShowHeader: true
    },
    {
        path: '/system/admin',
        page: AdminPage,
        IsShowHeader: false,
        IsPrivate : true
    },
    {
        path: '*',
        page: NotFoundPage,
        IsShowHeader: false
    },
]