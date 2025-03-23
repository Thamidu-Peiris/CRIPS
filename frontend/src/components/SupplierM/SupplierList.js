import axios from 'axios';
import { useEffect, useState } from 'react';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/suppliers')
      .then((res) => setSuppliers(res.data));
  }, []);

  return (
    <div>
      <h2>Supplier List</h2>
      <table border="1">
        <thead>
          <tr><th>Company</th><th>Contact</th><th>Phone</th><th>Email</th></tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s._id}>
              <td>{s.companyName}</td>
              <td>{s.contactPerson}</td>
              <td>{s.phone}</td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
