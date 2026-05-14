import MainLayout from "@/layouts/MainLayout";
import { Navigate } from "react-router-dom";
import PATH from "./paths/PATH";
import Account from "@/pages/Administration/Account";
import Associate from "@/pages/Administration/Associate";
import Service from "@/pages/Administration/Service";
import Zone from "@/pages/Administration/Zone";
import DataSourceAssociate from "@/pages/DataSourceAssociate";
import DataSourceNatcom from "@/pages/DataSourceNatcom";
import PriceAssociate from "@/pages/Administration/PriceAssociate";
import DataAssociate from "@/pages/DataAssociate";
import DataNatcom from "@/pages/DataNatcom";
import FileReconciliation from "@/pages/Administration/FileReconciliation";
import FileService from "@/pages/Administration/FileService";
import ScheduleReconciliation from "@/pages/ScheduleReconciliation";
import ResultReconciliation from "@/pages/ResultReconciliation";
import ReportDaily from "@/pages/Report/ReportDaily";
import ReportMonthly from "@/pages/Report/ReportMonthly";
import Dashboard from "@/pages/Dashboard";
import ProtectedLogin from "@/features/Auth/ProtectedLogin";
import RequestReconciliation from "@/pages/RequestReconciliation";
import Book from "@/pages/Book";
import Category from "@/pages/Category";

const routes = [
  {
    path: PATH.HOME,
    element: (
      // <ProtectedRoute>
      <MainLayout />
      // </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: PATH.CONFIGURATION.ROOT,
        element: <Navigate to={PATH.CONFIGURATION.ACCOUNT} replace />,
      },
      {
        path: PATH.CONFIGURATION.ACCOUNT,
        element: <Account />,
      },
      {
        path: PATH.CONFIGURATION.ZONE,
        element: <Zone />,
      },
      {
        path: PATH.CONFIGURATION.SERVICE,
        element: <Service />,
      },
      {
        path: PATH.CONFIGURATION.ASSOCIATE,
        element: <Associate />,
      },
      {
        path: PATH.CONFIGURATION.PRICE,
        element: <PriceAssociate />,
      },
      {
        path: PATH.CONFIGURATION.FILE_RECONCILIATION,
        element: <FileReconciliation />,
      },
      {
        path: PATH.CONFIGURATION.FILE_SERVICE,
        element: <FileService />,
      },
      {
        path: PATH.DATA_SOURCE.ROOT,
        element: (
          <Navigate to={PATH.DATA_SOURCE.DATA_SOURCE_ASSOCIATE} replace />
        ),
      },
      {
        path: PATH.DATA_SOURCE.DATA_SOURCE_ASSOCIATE,
        element: <DataSourceAssociate />,
      },
      {
        path: PATH.DATA_SOURCE.DATA_SOURCE_NATCOM,
        element: <DataSourceNatcom />,
      },
      {
        path: PATH.DATA.ROOT,
        element: <Navigate to={PATH.DATA.DATA_ASSOCIATE} replace />,
      },
      {
        path: PATH.DATA.DATA_ASSOCIATE,
        element: <DataAssociate />,
      },
      {
        path: PATH.DATA.DATA_NATCOM,
        element: <DataNatcom />,
      },
      {
        path: PATH.REQUEST_RECONCILIATION,
        element: <RequestReconciliation />,
      },
      {
        path: PATH.SCHEDULE_RECONCILIATION,
        element: <ScheduleReconciliation />,
      },
      {
        path: PATH.RESULT_RECONCILIATION,
        element: <ResultReconciliation />,
      },
      {
        path: PATH.REPORT.ROOT,
        element: <Navigate to={PATH.REPORT.DAILY} replace />,
      },
      {
        path: PATH.REPORT.DAILY,
        element: <ReportDaily />,
      },
      {
        path: PATH.REPORT.MONTHLY,
        element: <ReportMonthly />,
      },
      {
        path: PATH.BOOK,
        element: <Book />,
      },
      {
        path: PATH.CATEGORY,
        element: <Category />,
      },
    ],
  },
  {
    path: PATH.LOGIN,
    element: <ProtectedLogin />,
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
];

export default routes;
