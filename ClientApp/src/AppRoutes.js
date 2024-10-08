import AdminHome from "./components/Admin/Components/Home/AdminHome";
import AuthForm from "./components/Forms/AuthForm/AuthForm";
import Home from "./components/Home/Home";
import Cart from "./components/UI/Cart/Cart";
import ProductDetails from "./components/UI/ProductDetails/ProductDetails";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: "/admin/",
    element: <AdminHome />
  },
  {
    path: "/cart/",
    element: <Cart />
  },
  {
    path: "/admin/auth",
    element: <AuthForm />
  },
  {
    path: "/products/:id",
    element: <ProductDetails />,
  },
];

export default AppRoutes;
