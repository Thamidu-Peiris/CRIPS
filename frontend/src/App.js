import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Careers from "./pages/Careers"; 
import Login from './pages/Login.js';
import CustomerRegister from "./pages/CustomerRegister";
import Shops from './dashboards/Customer/Shop';// customerdashboard
import Layout from './components/Layout';
import Cart from "./components/Cart";
import OrdersPage from "./pages/OrdersPage"; 
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import CustomerServiceDashboard from "./dashboards/CSM/CustomerServiceDashboard";
import CuttersDashboard from "./dashboards/CuttersDashboard";
import InventoryManagerDashboard from "./dashboards/InventoryManagerDashboard";
import SalesManagerDashboard from "./dashboards/SalesManagerDashboard";
import ProfileSettings from "./dashboards/CSM/ProfileSettings";
import ChangePassword from "./dashboards/CSM/ChangePassword"; 
import UpdateProfile from "./dashboards/CSM/UpdateProfile";
import CustomerSupport from "./dashboards/Customer/CustomerSupport";
import SupportTickets from "./dashboards/CSM/ManageSupportTickets";
import CreateTicket from "./dashboards/Customer/CreateTicket";
import ViewTicket from "./dashboards/Customer/ViewTicket"; // ✅ Import ViewTicket Component
import KnowledgeBase from "./dashboards/CSM/KnowledgeBase";
import ManageSupportTickets from "./dashboards/CSM/ManageSupportTickets"; // ✅ Correct path
import Conversation from "./dashboards/CSM/Conversation";
import PlantDetails from "./dashboards/Customer/PlantDetails";
import Shop from "./dashboards/Customer/Shop";
import UserProfileSettings from "./dashboards/Customer/UserProfileSettings";
import CustomerChangePassword from "../../frontend/src/dashboards/Customer/CustomerChangePassword";
import UserProfile from "./dashboards/Customer/UserProfile";
import SmDashboard from './dashboards/SM/dashboard.js';
import RegisterSystemManager from './pages/smRegister.js';
import FinancialReport from './dashboards/SalesReports/FinancialReport.js';
import CustomerReport from './dashboards/SalesReports/CustomerReport.js';
import ProductReport from './dashboards/SalesReports/ProductReport.js';
import SalarySheet from './dashboards/SalesReports/SalarySheet.js';
import GrowerHandlerDashboard from "./dashboards/GrowerHandler/GrowerHandlerDashboard.js";
import GHProfileSettings from "./dashboards/GrowerHandler/GHProfileSettings.js";
import GHUpdateProfile from "./dashboards/GrowerHandler/GHUpdateProfile.js";
import GHChangePassword from "./dashboards/GrowerHandler/GHChangePassword.js";
import AddCategory from "./dashboards/GrowerHandler/AddCategory";
import ManageCategories from "./dashboards/GrowerHandler/ManageCategories";
import AdminApplications from "./pages/SysManager/AdminApplications.js";
import SystemManagerProfile from "./pages/SysManager/profile.js";
import Dashboard from './components/InventoryM/Dashboard.js';
import StockList from './components/InventoryM/StockList.js';
import AddStock from './components/InventoryM/AddStock.js';
import SupplierList from './components/SupplierM/SupplierList.js';
import SupplierForm from './components/SupplierM/SupplierForm.js';
import './components/InventoryM/styles.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/Careers" element={<Careers />} />
        <Route path="/customerregister" element={<CustomerRegister />} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="dashboard/orders" element={<OrdersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/customer-service-dashboard" element={<CustomerServiceDashboard />} />
        <Route path="/cutters-dashboard" element={<CuttersDashboard />} />
        <Route path="/inventory-manager-dashboard" element={<InventoryManagerDashboard />} />
        <Route path="/sales-manager-dashboard" element={<SalesManagerDashboard />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/dashboard/support" element={<CustomerSupport />} />
        <Route path="/dashboard/support-tickets" element={<SupportTickets />} />
        <Route path="/dashboard/create-ticket" element={<CreateTicket />} />
        <Route path="/dashboard/view-ticket/:id" element={<ViewTicket />} />
        <Route path="/dashboard/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/dashboard/support" element={<ManageSupportTickets />} />
        <Route path="/dashboard/support/:id" element={<ViewTicket />} />
        <Route path="/dashboard/conversation/:id" element={<Conversation />} />
        <Route path="/plant/:id" element={<PlantDetails />} />
        <Route path="/dashboard/settings" element={<UserProfileSettings />} />
        <Route path="/customer/change-password" element={<CustomerChangePassword />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/sm-dashboard" element={<SmDashboard />} /> // ✅ Add Route for SmDashb
        <Route path="/SMregister" element={<RegisterSystemManager />} />
        <Route path="/financialreport" element={<FinancialReport />} />
        <Route path="/productreport" element={<ProductReport />} />
        <Route path="/customerreport" element={<CustomerReport />} />
        <Route path="/salarysheet" element={<SalarySheet />} />
        <Route path="/grower-handler-dashboard" element={<GrowerHandlerDashboard />} />
        <Route path="/grower-handler/profile-settings" element={<GHProfileSettings />} />
        <Route path="/grower-handler/update-profile" element={<GHUpdateProfile />} />
        <Route path="/grower-handler/change-password" element={<GHChangePassword />} />
        <Route path="/grower-handler/add-category" element={<AddCategory />} />
        <Route path="/grower-handler/manage-categories" element={<ManageCategories />} />
        <Route path="/admin-applications" element={<AdminApplications />} />
        <Route path="/SMprofile" element={<SystemManagerProfile />} /> // ✅ Add Route for
        <Route path="/inventrymanagerdashboard" element={<Dashboard />} />
        <Route path="/in-stock" element={<StockList />} />
        <Route path="/add-stock" element={<AddStock />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/supplier-form" element={<SupplierForm />} />


      </Routes>
    </Router>
  );
}

export default App;
