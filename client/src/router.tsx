import { createBrowserRouter } from "react-router";
import CustomerLayout from "./components/layout/CustomerLayout";
import StoreHomePage from "./pages/customer/StoreHomePage";
import { PublicLayout } from "./components/auth/PublicLayout";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { ProtectedLayout } from "./components/auth/ProtectedLayout";

import { RoleGaurdLayout } from "./components/auth/RoleGauredLayout";
import AdminLayout from "./components/layout/AdminLayout";
import CustomrProfilePage from "./pages/customer/ProfilePage";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDashboardPage from "./pages/admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <StoreHomePage />,
      },
      {
        element: <PublicLayout />,
        children: [
          {
            path: "sign-in/*",
            element: <SignInPage />,
          },
          {
            path: "sign-up/*",
            element: <SignUpPage />,
          },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "profile",
            element: <CustomrProfilePage />,
          },
        ],
      },
    ],
  },
  {
    element:<ProtectedLayout/>,
    children:[{
      element:<RoleGaurdLayout allow={["admin"]}/>,
      children:[
        {
          path:"/admin",
          element:<AdminLayout/>,
          children:[
            {
              index:true,
              element:<AdminDashboardPage/>
            },
            {
              path:"product",
              element:<AdminProducts/>
            },
            {
              path:"orders",
              element:<AdminOrders/>
            },
            {
              path:"coupons",
              element:<AdminCoupons/>
            },
            {
              path:"settings",
              element:<AdminSettings/>
            }
          ]
        }
      ]
    }]
  }
]);
