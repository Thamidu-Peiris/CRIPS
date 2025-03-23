import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../InventoryM/Navbar';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/suppliers').then((res) => setSuppliers(res.data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <h2>Supplier List</h2>
      <table border="1">
        <thead>
          <tr><th>Supplier ID</th><th>Supplier Name</th><th>Plant ID</th><th>Plant Name</th><th>Quantity</th><th>Location</th><th>Payment</th></tr>
        </thead>
        <tbody>
          {suppliers.map((s, index) => (
            <tr key={s._id}>
              <td>{index + 1}</td>
              <td>{s.companyName}</td>
              <td>{s.plantId}</td>
              <td>{s.plantName}</td>
              <td>{s.quantity}</td>
              <td>{s.location}</td>
              <td>{s.payment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
