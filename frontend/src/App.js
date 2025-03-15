import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Careers from "./pages/Careers"; 
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from "./pages/CustomerRegister";
import CustomerDashboard from './dashboards/Customer/CustomerDashboard';
import Layout from './components/Layout';
import Cart from "./components/Cart";
import OrdersPage from "./pages/OrdersPage"; 
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import EmployeeLogin from "./pages/EmployeeLogin";
import CustomerServiceDashboard from "./dashboards/CSM/CustomerServiceDashboard";
import GrowerHandlerDashboard from "./dashboards/GrowerHandlerDashboard";
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




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/shop" element={<div>Shop Page</div>} />
        <Route path="/Careers" element={<Careers />} />
        <Route path="/customerregister" element={<CustomerRegister />} />
        <Route path="/customerdashboard" element={<CustomerDashboard />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="dashboard/orders" element={<OrdersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/customer-service-dashboard" element={<CustomerServiceDashboard />} />
        <Route path="/grower-handler-dashboard" element={<GrowerHandlerDashboard />} />
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
        

      </Routes>
    </Router>
  );
}

export default App;
