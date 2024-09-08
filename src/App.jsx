import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//pages
import HomePage from "./pages/HomePage/HomePage";
import AdminLayoutPage from "./pages/AdminLayoutPage/AdminLayoutPage";
import OrganizationLayoutPage from "./pages//OrganizationLayoutPage/OrganizationLayoutPage";
import PricingPage from "./pages/PricingPage/PricingPage";
import SupplierLayoutPage from "./pages/SupplierLayoutPage/SupplierLayoutPage";

//components
import AdminDashboard from "./components/admin/AdminDashboard/AdminDashboard";
import UserDashboard from "./components/organization/UserDashboard/UserDashboard";
import Analytics from "./components/organization/Analytics/Analytics";
import AccountSettings from "./components/organization/AccountSettings/AccountSettings";
import PricingModel from "./components/admin/PricingModel/PricingModel";
import UpdatePricingModels from "./components/admin/UpdatePricingModels/UpdatePricingModels";
import ArchivePricingModel from "./components/admin/ArchivePricingModel/ArchivePricingModel";
import AddSupplier from "./components/organization/AddSupplier/AddSupplier";
import AdminSignUp from "./components/admin/AdminSignUp/AdminSignUp";
import OrganizationSignUp from "./components/organization/OrganizationSignUp/OrganizationSignUp";
import AdminSignIn from "./components/admin/AdminSignIn/AdminSignIn";
import SendInvoice from "./components/supplier/SendInvoice/SendInvoice";
import UploadTemplate from "./components/supplier/UploadTemplate/UploadTemplate";
import OrganizationSignIn from "./components/organization/OrganizationSignIn/OrganizationSignIn";
import Logout from "./components/common/Logout/Logout";
import SelectPlan from "./components/organization/SelectPlan/SelectPlan";
import AddFeatureModel from "./components/admin/AddFeatureModel/AddFeatureModel";
import ModifyModelFeatures from "./components/admin/ModifyModelFeautures/ModifyModelFeatures";
import SupplierSignIn from "./components/supplier/SupplierSignIn/SupplierSignIn";
import ViewTemplate from "./components/supplier/ViewTemplate/ViewTemplate";
import ViewInvoice from "./components/supplier/ViewInvoice/ViewInvoice";
import ViewReceivedInvoices from "./components/organization/ViewReceivedInvoices/ViewReceivedInvoices";
import RequestOtp from "./components/common/RequestOtp/RequestOtp";
import ProductAnalysis from "./components/organization/ProductAnalysis/ProductAnalysis";
import ViewRequests from "./components/supplier/ViewRequests/ViewRequests";
import SearchInvoices from "./components/organization/SearchInvoices/SearchInvoices";
import OutgoingSupplierRequests from "./components/organization/OutgoingSupplierRequests/OutgoingSupplierRequests";
import ForgotPassword from "./components/common/ForgotPassword/ForgotPassword";
import AddEmployee from "./components/organization/AddEmployee/AddEmployee";
import VerifyOtp from "./components/common/VerifyOtp/VerifyOtp";
import ChangePassword from "./components/common/ChangePassword/ChangePassword";
import MapTemplates from "./components/admin/MapTemplates/MapTemplates";
import RevenueAnalysis from "./components/organization/RevenueAnalysis/RevenueAnalysis";
import Chat from "./components/common/Chat/Chat";
import SubscriptionPage from "./pages/SubscriptionPage/SubscriptionPage";
import SupplierAnalysis from "./components/organization/SupplierAnalysis/SupplierAnalysis";
import ForgotPasswordVerifyOTP from "./components/common/ForgotPasswordVerifyOTP/ForgotPasswordVerifyOTP";
import ResetForgotPassword from "./components/common/ResetForgotPassword/ResetForgotPassword";
import SubscriptionManagement from "./components/organization/SubscriptionManagement/SubscriptionManagement";
import AdvancedSearch from "./components/admin/AdvancedSearch/AdvancedSearch";
import SupplierCompare from "./components/organization/SupplierCompare/SupplierCompare";
import OrganizationChat from "./components/organization/OrganizationChat/OrganizationChat";
import ViewArchivedInvoices from "./components/organization/ViewArchivedInvoices/ViewArchiveInvoices";
import BulkInvoiceUpload from "./components/supplier/BulkInvoiceUpload/BulkInvoiceUpload";
import OrganizationAuthorization from './components/AuthProvider/OrganizationAuthorization/OrganizationAuthorization'
import AdminAuthorization from './components/AuthProvider/AdminAuthorization/AdminAuthorization'
import SupplierAuthorization from './components/AuthProvider/SupplierAuthorization/SupplierAuthorization'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/admin/signup" element={<AdminSignUp />} />
          <Route path="/admin/signin" element={<AdminSignIn />} />
          <Route path="/organization/signup" element={<OrganizationSignUp />} />
          <Route path="/organization/signin" element={<OrganizationSignIn />} />
          <Route path="/supplier/signin" element={<SupplierSignIn />} />
          <Route path="/organization/select-plan" element={<SelectPlan />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/verify-email" element={<RequestOtp />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/select-plan" element={<SelectPlan />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/forgot-password-otp-verify"
            element={<ForgotPasswordVerifyOTP />}
          />
          <Route
            path="/forgot-password-reset"
            element={<ResetForgotPassword />}
          />

          <Route path="/subscribe" element={<SubscriptionPage />} />

          <Route
        path="/admin"
        element={
         
            <AdminAuthorization>
              <AdminLayoutPage />
            </AdminAuthorization>
         
        }
      >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="createmodel" element={<PricingModel />} />
            <Route path="updatemodel" element={<UpdatePricingModels />} />
            <Route path="archivemodel" element={<ArchivePricingModel />} />
            <Route path="add-feature" element={<AddFeatureModel />} />
            <Route path="modify-feature" element={<ModifyModelFeatures />} />
            <Route path="upload-mapping" element={<MapTemplates />} />
            <Route path="advanced-search" element={<AdvancedSearch />} />
            <Route path="chat" element={<Chat />} />
          </Route>

          <Route
        path="/organization"
        element={
          <OrganizationAuthorization>
            <OrganizationLayoutPage />
          </OrganizationAuthorization>
        }
      >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="viewinvoices" element={<ViewReceivedInvoices />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="accountsettings" element={<AccountSettings />} />
            <Route path="addsupplier" element={<AddSupplier />} />
            <Route path="productanalysis" element={<ProductAnalysis />} />
            <Route path="suppliercompare" element={<SupplierCompare />} />
            <Route path="revenueanalysis" element={<RevenueAnalysis />} />
            <Route path="supplieranalysis" element={<SupplierAnalysis />} />
            <Route path="search" element={<SearchInvoices />} />
            <Route
              path="supplierrequests"
              element={<OutgoingSupplierRequests />}
            />
            <Route path="addemployee" element={<AddEmployee />} />
            <Route path="changeplan" element={<SubscriptionManagement />} />
            <Route path="chat" element={<OrganizationChat />} />
            <Route
              path="viewarchiveinvoices"
              element={<ViewArchivedInvoices />}
            />
          </Route>

          <Route
        path="/supplier"
        element={
          <SupplierAuthorization>
            <SupplierLayoutPage />
          </SupplierAuthorization>
        }
      >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="uploadtemplate" element={<UploadTemplate />} />
            <Route path="sendinvoice" element={<SendInvoice />} />
            <Route path="bulkupload" element={<BulkInvoiceUpload />} />
            <Route path="viewtemplate" element={<ViewTemplate />} />
            <Route path="viewinvoices" element={<ViewInvoice />} />
            <Route path="viewrequests" element={<ViewRequests />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;