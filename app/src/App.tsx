import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import ProtectedRoute from "./services/auth.guard";
import { NonProtectedRoute } from "./services/auth.guard";

// Non-auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";

// Auth Pages
import Courses from "./pages/Courses";
import CourseManager from "./pages/CourseManager";

import SectionEdit from "./pages/SectionEdit";
import Profile from "./pages/Profile";

// Educado Admin
import EducadoAdmin from "./pages/EducadoAdmin";
import SingleApplicantView from "./pages/SingleApplicantView";
import Certificates from "./pages/Certificates";

// Delete user request for app
import DataDeletionRequest from "./pages/DataDeletionRequest";
import AccountDeletionRequest from "./pages/AccountDeletionRequest";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  // router
  const router = createBrowserRouter([
    { // Homepage is left unused
      path: "/",
      element: <Navigate to={"/welcome"} />,
      errorElement: <NotFound />
    },
    {
      path: "/courses",
      element: <ProtectedRoute><Courses /></ProtectedRoute>,
      errorElement: <NotFound />,
    },
    {
      path: "/courses/manager/:id/:tick",
      element: <ProtectedRoute><CourseManager /></ProtectedRoute>,
      errorElement: <NotFound />,
    },
		{
			path: "/certificates",
			element: <ProtectedRoute><Certificates /></ProtectedRoute>,
		},
    {
      path: "/sections/:sid",
      element: <ProtectedRoute><SectionEdit /></ProtectedRoute>
    },
    {
      path: "/settings",
      element: <p>settings</p>
    },
    {
      path: "/profile",
      element: <ProtectedRoute><Profile /></ProtectedRoute>
    },
    {
      path: "/login",
      element: <NonProtectedRoute><Login /></NonProtectedRoute>,
      errorElement: <NotFound />
    },
    {
      path: "/signup",
      element: <NonProtectedRoute><Signup /></NonProtectedRoute>,
      errorElement: <NotFound />
    },
    {
      path: "/educado_admin",
      element: <ProtectedRoute><EducadoAdmin /></ProtectedRoute>,
    },
    {
      path: "/educado_admin/applications",
      element: <ProtectedRoute><EducadoAdmin /></ProtectedRoute>
    },
    {
      path: "/educado_admin/applications/:id",
      element: <ProtectedRoute><SingleApplicantView /></ProtectedRoute>,
    },
    {
      path: "/welcome",
      element: <NonProtectedRoute><Welcome /></NonProtectedRoute>,
    },
    {
      path: "/data_deletion_request",
      element: <NonProtectedRoute><DataDeletionRequest /></NonProtectedRoute>,
    },
    {
      path: "/account_deletion_request",
      element: <NonProtectedRoute><AccountDeletionRequest /></NonProtectedRoute>,
    },
    {
      path: "/privacy_policy",
      element: <NonProtectedRoute><PrivacyPolicy /></NonProtectedRoute>,
    }
  ]
)
  return <RouterProvider router={router} />;
}

export default App