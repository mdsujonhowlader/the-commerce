import { createBrowserRouter } from "react-router";
import { ProtectedLayout } from "./components/auth/ProtectedLayout";
import { PublicLayout } from "./components/auth/PublicLayout";
import CustomerLayout from "./components/layout/CustomerLayout";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import StoreHomePage from "./pages/customer/StoreHomePage";

import { RoleGaurdLayout } from "./components/auth/RoleGauredLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminPromos from "./pages/admin/AdminPromos";
import AdminSettings from "./pages/admin/AdminSettings";
import CustomrProfilePage from "./pages/customer/ProfilePage";

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
              element:<AdminPromos/>
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
