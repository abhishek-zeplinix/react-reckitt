import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/(full-page)/login/page";
import ProtectedRoute from "./layout/ProtectedRoute";
import Dashboard from "./pages/(main)/page";
import ManageSupplierPage from "./pages/(main)/manage-supplier/page";
import CreateSupplierPage from "./pages/(main)/create-supplier/page";
import FaqsPage from "./pages/(main)/faq/page";
import SupplyGlossaryPage from "./pages/(main)/supply-glossary/page";
import ManageSupplierScorePage from "./pages/(main)/manage-supplier-score/page";
import ManageRulesPage from "./pages/(main)/manage-rules/page";
import ManageCapaRulesPage from "./pages/(main)/manage-capa-rules/page";
import ManageUsersPage from "./pages/(main)/manage-users/page";
import ManageApiPage from "./pages/(main)/manage-api/page";
import UserPage from "./pages/(main)/user/page";
import ManageRequestsPage from "./pages/(main)/manage-requests/page";
import ManageFeedbackPage from "./pages/(main)/manage-feedback/page";
import AddFeedbackPage from "./pages/(main)/add-feedback/page";
import ControlTowerPage from "./pages/(main)/control-tower/page";
import SupplierScoreboardSummaryPage from "./pages/(main)/supplier-scoreboard-summary/page";
// import ProductsMappingPage from "./pages/(main)/product-mapping/page";
// import ProductsPage from "./pages/(main)/products/page";
// import UserProfilePage from "./pages/(main)/profile/page";
// import PurchaseOrderPage from "./pages/(main)/purchase-order/page";
// import RackPage from "./pages/(main)/racks/page";
// import ReceivePurchaseOrderPage from "./pages/(main)/receive-purchase-order/page";
// import RolePage from "./pages/(main)/roles/page";
// import RoutesPage from "./pages/(main)/routes/page";
// import SalesOrderPage from "./pages/(main)/sales-orders/page";
// import SKUPage from "./pages/(main)/sku/page";
// import SkuListPage from "./pages/(main)/sku-list/page";
// import SubLocationPage from "./pages/(main)/sub-location/page";
// import UserPage from "./pages/(main)/users/page";
// import Vendorss from "./pages/(main)/vendors/page";
// import LocationPage from "./pages/(main)/warehouses/page";
import { AppLayout } from "./pages/(main)/layout";
import ErrorPage from "./pages/(full-page)/error/page";
import ForgotPasswordPage from "./pages/(full-page)/forgot-password/page";
import ResetPasswordPage from "./pages/(full-page)/reset-password/page";
import NotFoundPage from "./pages/(full-page)/notfound/page";
// import PackagesPage from "./pages/(main)/packages/page";
// import ShipmentsPage from "./pages/(main)/shipments/page";
// import ReceiveNewPOPage from "./pages/(main)/receive-new-po/page";

const AppNavigator = () => {
    return <Routes>
        {/* Protected Routes */}
        <Route
            path="/"
            element={
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            }
        >
            <Route path="/" element={<Dashboard />} />
            <Route path="/manage-supplier" element={<ManageSupplierPage />} />
            <Route path="/create-supplier" element={<CreateSupplierPage />} />
             <Route path="/faq" element={<FaqsPage />} />
            <Route path="/supply-glossary" element={<SupplyGlossaryPage />} />
            <Route path="/manage-supplier-score" element={<ManageSupplierScorePage />} />
            <Route path="/manage-rules" element={<ManageRulesPage />} />
            <Route path="/manage-capa-rules" element={<ManageCapaRulesPage />} />
            <Route path="/manage-users" element={<ManageUsersPage />} />
            <Route path="/manage-api" element={<ManageApiPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/manage-requests" element={<ManageRequestsPage />} />
            <Route path="/manage-feedback" element={<ManageFeedbackPage />} />
            <Route path="/add-feedback" element={<AddFeedbackPage />} />
            <Route path="/control-tower" element={<ControlTowerPage />} />
            <Route path="/supplier-scoreboard-summary" element={<SupplierScoreboardSummaryPage />} />
            {/*<Route path="/product-mapping" element={<ProductsMappingPage />} />
            <Route path="/products" element={<ProductsPage />} /> */}
            {/* <Route path="/profile" element={<UserProfilePage />} /> */}
            {/* <Route path="/purchase-order" element={<PurchaseOrderPage />} />
            <Route path="/racks" element={<RackPage />} />
            <Route path="/receive-purchase-order" element={<ReceivePurchaseOrderPage />} />
            <Route path="/receive-purchase-order/:poId" element={<ReceiveNewPOPage />} />
            <Route path="/roles" element={<RolePage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/sales-orders" element={<SalesOrderPage />} />
            <Route path="/sku" element={<SKUPage />} />
            <Route path="/sku-list" element={<SkuListPage />} />
            <Route path="/sub-location" element={<SubLocationPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/vendors" element={<Vendorss />} />
            <Route path="/warehouses" element={<LocationPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/shipments" element={<ShipmentsPage />} /> */}
        </Route>

        {/* Public Route: Login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
};
export default AppNavigator;