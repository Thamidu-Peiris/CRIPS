import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Careers from "./pages/Careers"; 
import Login from './pages/Login.js';
import CustomerRegister from "./pages/CustomerRegister";
//import Shops from './dashboards/Customer/Shop';// customerdashboard
import Layout from './components/Layout';
import Cart from "./components/Cart";
import OrdersPage from "./pages/OrdersPage"; 
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import CustomerServiceDashboard from "./dashboards/CSM/CustomerServiceDashboard";
import CuttersDashboard from "./dashboards/CuttersDashboard";
import InventoryManagerDashboard from "./components/InventoryM/Dashboard.js";
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
import EmpManage from './pages/SysManager/EmpManagement.js'


import CustomerRequests from './dashboards/CSM/CustomerRequests.js';
import CustomersList from "./dashboards/CSM/CustomersList";

import ReportHub from "./dashboards/SalesReports/ReportHub.js";
import Wishlist from "./components/Wishlist";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import TrackingPage from "./dashboards/Customer/TrackingPage";
import CustomerOrders from "./dashboards/TransportManager/CustomerOrders.js";
import ManageOrders from "./dashboards/CSM/ManageOrders";
import OrderStatusHistory from "./dashboards/Customer/OrderStatusHistory";
import CreateCoupons from './dashboards/CSM/CreateCoupons';

import InvProfile from "../src/components/InventoryM/InvProfile.js";
import InvUpdateProfile from "../src/components/InventoryM/InvUpdateProfile.js";
import InvChangePassword from "../src/components/InventoryM/InvChangePassword.js";
import ReviewManagement from './dashboards/CSM/ReviewManagement';



//Grower  Handler
import CutterDashboard from "./dashboards/Cutter/CutterDashboard.js";//Cutter dash
import PlantFormPage from "./dashboards/GrowerHandler/PlantFormPage";
import AssignTasks from "./dashboards/GrowerHandler/AssignTasks"; 
import ManagePlants from "./dashboards/GrowerHandler/ManagePlants";
import ViewPlants from "./dashboards/GrowerHandler/ViewPlants";
import ManageTasks from './dashboards/GrowerHandler/ManageTasks';//GH Manage Tasks
import AddEnvironmentalData from './dashboards/GrowerHandler/AddEnvironmentalData';//GH add env data
import EnvironmentalMonitoring from './dashboards/GrowerHandler/EnvironmentalMonitoring';//GH env mon
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

import ShipmentStatus from './dashboards/TransportManager/ShipmentStatus.js'
import QualityCheckLog from "./dashboards/TransportManager/QualityCheckLog.js";
import FuelTracker from "./dashboards/TransportManager/FuelTracker.js";
import ShipmentScheduler from "./dashboards/TransportManager/ShipmentScheduler.js";
import RouteOptimizer from "./dashboards/TransportManager/RouteOptimizer.js";
import TransportReports from "./dashboards/TransportManager/TransportReports.js";
import TransportManagerDashboard from "./dashboards/TransportManager/TransportManagerDashboard.js";
import ApproveSuppliers from './pages/SysManager/ApproveSuppliers.js';
import OrderStock from './components/InventoryM/OrderStock.js';

import TMprofile from "./dashboards/TransportManager/TransportManagerProfile.js";
import SysManageCus from './dashboards/SM/ManageCustomers.js';

import CustomerDetails from "./dashboards/CSM/CustomerDetails";

import SupplierDashboard from "./components/SupplierM/SupplierDashboard.js";


import AddVacancies from "./pages/SysManager/AddVacancies.js";
import CheckStatus from "./pages/CheckStatus.js";
import Vehicle from "../src/dashboards/TransportManager/Vehicles.js";
import TrackOrder from "./dashboards/CSM/TrackOrder.js";

import Drivers from "./dashboards/TransportManager/DriversUI.js";

import SalesManagerChangePassword from "./dashboards/SalesReports/SrChangePassword";
import SalesManagerUpdateProfile from "./dashboards/SalesReports/SrUpdateProfile";
import SalesManagerProfileSettings from "./dashboards/SalesReports/SrProfileSettings";
import Customize from "./pages/SysManager/customize.js";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import UserFeed from "./pages/userFeed";
import AdminFeed from "./pages/SysManager/adminFeed.js";

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
        <Route path="/dashboard/orders" element={<OrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/dashboard/tracking" element={<TrackingPage />} />
        <Route path="/csm/manage-orders" element={<ManageOrders />} />
        <Route path="/dashboard/customer-orders" element={<CustomerOrders />} />
        <Route path="/customer/:customerId" element={<CustomerDetails />} />
        <Route path="/orders/:orderId/status-history" element={<OrderStatusHistory />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/csm/dashboard" element={<CustomerServiceDashboard />} />
        <Route path="/csm/customer-requests" element={<CustomerRequests />} />
        <Route path="/csm/customers-list" element={<CustomersList />} />
        <Route path="/csm/coupons" element={<CreateCoupons />} />
        <Route path="/grower-handler-dashboard" element={<GrowerHandlerDashboard />} />
        <Route path="/cutters-dashboard" element={<CutterDashboard/>} />
        
        <Route path="/sales-manager-dashboard" element={<SalesManagerDashboard />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/dashboard/support" element={<CustomerSupport />} />
        <Route path="/csm/support-tickets" element={<SupportTickets />} />
        <Route path="/dashboard/create-ticket" element={<CreateTicket />} />
        <Route path="/dashboard/view-ticket/:id" element={<ViewTicket />} />
        <Route path="/csm/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/dashboard/support" element={<ManageSupportTickets />} />
        <Route path="/dashboard/support/:id" element={<ViewTicket />} />
        <Route path="/dashboard/conversation/:id" element={<Conversation />} />
        <Route path="/plant/:id" element={<PlantDetails />} />
        
        //Grower Handler
        <Route path="/dashboard/settings" element={<UserProfileSettings />} />
        <Route path="/customer/change-password" element={<CustomerChangePassword />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/sm-dashboard" element={<SmDashboard />} /> // ✅ Add Route for SmDashb
        <Route path="/SMregister" element={<RegisterSystemManager />} />
        <Route path="/financialreport" element={<FinancialReport />} />
        <Route path="/productreport" element={<ProductReport />} />
        <Route path="/customerreport" element={<CustomerReport />} />
        <Route path="/salarysheet" element={<SalarySheet />} />
        <Route path="/reporthub/" element={<ReportHub/>}/>
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
        <Route path="/inventory-manager-dashboard" element={<InventoryManagerDashboard />} /> 
        <Route path="/dashboards/GrowerHandler" element={<GrowerHandlerDashboard />} />
        <Route path="/dashboards/GrowerHandler/plantFormPage" element={<PlantFormPage />} />
        <Route path="/dashboards/GrowerHandler/assign-tasks" element={<AssignTasks />} /> 
        <Route path="/all-plants" element={<ViewPlants />} />
        <Route path="/manage-plants" element={<ManagePlants />} />
        <Route path="/dashboards/GrowerHandler/manage-tasks" element={<ManageTasks />} />
        <Route path="/dashboards/GrowerHandler/add-environmental-data" element={<AddEnvironmentalData />} />//GH Add env data
        <Route path="/monitor-environment" element={<EnvironmentalMonitoring />} />//GH env mon
        <Route path="/empmanage" element={<EmpManage />} />

        <Route path="/ShipmentStatus" element={<ShipmentStatus />} />
        <Route path="/quality-check-log" element={<QualityCheckLog />} />
        <Route path="/fuel-tracker" element={<FuelTracker />} />
        <Route path="/shipment-scheduler" element={<ShipmentScheduler />} />
        <Route path="/route-optimizer" element={<RouteOptimizer />} />
        <Route path="/transport-reports" element={<TransportReports />} />
        <Route path="/transport-dashboard" element={<TransportManagerDashboard />} />
        <Route path="/approve-suppliers" element={<ApproveSuppliers />} />  
        <Route path="/Order-stock" element={<OrderStock />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        <Route path="/cutter-dashboard" element={<CutterDashboard />} />//Cutter dash

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/add-vacancies" element={<AddVacancies />} />
        <Route path="/check-status" element={<CheckStatus />} />



        <Route path="/transport-manager-profile" element={<TMprofile />} />
        <Route path="/sm-manage-cus" element={<SysManageCus />} />
        <Route path="/vehicles" element={<Vehicle />} />

        <Route path="/inv-profile" element={<InvProfile />} />
        <Route path="/inv-update-profile" element={<InvUpdateProfile />} />
        <Route path="/inv-change-password" element={<InvChangePassword />} />
        <Route path="/csm/track-order" element={<TrackOrder />} />

        <Route path="/drivers" element={<Drivers />} />

        <Route path="/csm/reviews" element={<ReviewManagement />} />

        {/* Sales Manager Routes */}
        <Route path="/sales-manager-profile-settings" element={<SalesManagerProfileSettings />} />
        <Route path="/sales-manager-update-profile" element={<SalesManagerUpdateProfile />} />
        <Route path="/sales-manager-change-password" element={<SalesManagerChangePassword />} />
        
        <Route path="/customize" element={<Customize />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/user-feed" element={<UserFeed />} />
        <Route path="/admin-feed" element={<AdminFeed />} />




      </Routes>
    </Router>
  );
}

export default App;
