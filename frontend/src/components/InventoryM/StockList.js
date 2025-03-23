import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StockList() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stocks').then((res) => setStocks(res.data));
  }, []);

  return (
    <table>
      <thead><tr><th>Plant</th><th>Qty</th><th>Status</th></tr></thead>
      <tbody>
        {stocks.map(stock => (
          <tr key={stock._id}>
            <td>{stock.plantName}</td>
            <td>{stock.quantity}</td>
            <td>{stock.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
