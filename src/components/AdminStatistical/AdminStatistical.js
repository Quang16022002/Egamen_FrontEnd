import React, { useEffect, useState } from 'react';
import { getAllOrder } from '../../services/OrderService';
import './AdminStatistical.scss';

const AdminStatistical = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrder();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const calculateSalesByPeriod = () => {
    if (!orders || !orders.length) {
      return { salesByDay: {}, salesByMonth: {} }; 
    }
  
    const salesByDay = {};
    const salesByMonth = {};
  
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const dayKey = orderDate.toISOString().slice(0, 10);
      const monthKey = `${orderDate.getFullYear()}-${('0' + (orderDate.getMonth() + 1)).slice(-2)}`; 
  
      if (!salesByDay[dayKey]) {
        salesByDay[dayKey] = { count: 0, revenue: 0, orders: {} }; 
      }
      if (!salesByMonth[monthKey]) {
        salesByMonth[monthKey] = { count: 0, revenue: 0, productSales: {} }; 
      }
  
      const cleanedTotalPrice = parseInt(order.totalPrice.replace(/[^\d]/g, ''));
  
      salesByDay[dayKey].count += 1;
      salesByDay[dayKey].revenue += cleanedTotalPrice;
  
      salesByMonth[monthKey].count += 1;
      salesByMonth[monthKey].revenue += cleanedTotalPrice;
  
      order.orderItems.forEach(item => {
        const productId = item.product;
        const productName = item.name;
        const quantity = item.amount;
        const productPrice = parseInt(item.price.replace(/[^\d]/g, ''));
  
        if (productName && quantity && productPrice) {
         
          if (!salesByDay[dayKey].orders[order._id]) {
            salesByDay[dayKey].orders[order._id] = {
              orderId: order._id,
              products: [],
            };
          }
          salesByDay[dayKey].orders[order._id].products.push({
            productId,
            name: productName,
            quantity,
            price: productPrice,
          });
  
          if (!salesByMonth[monthKey].productSales[productId]) {
            salesByMonth[monthKey].productSales[productId] = {
              productName,
              totalQuantity: 0,
              totalRevenue: 0,
            };
          }
  
          salesByMonth[monthKey].productSales[productId].totalQuantity += quantity;
          salesByMonth[monthKey].productSales[productId].totalRevenue += productPrice * quantity;
        }
      });
    });
  
    Object.keys(salesByDay).forEach(day => {
      salesByDay[day].orders = Object.values(salesByDay[day].orders);
    });
  
    return { salesByDay, salesByMonth };
  };
  
  

  const { salesByDay, salesByMonth } = calculateSalesByPeriod();

  return (
    <div className="sales-report container">
      <h1>Báo cáo doanh số</h1>
      <div className="sales-by-period">
        <div className="sales-by-day">
          <h2>Số đơn hàng bán ra theo ngày</h2>
          <ul>
            {Object.keys(salesByDay).map(day => (
              <li className='my-4' key={day}>
                <strong>{day}</strong>: {salesByDay[day].count} đơn hàng, <span style={{color:'red', fontWeight:600}}>{salesByDay[day].revenue.toLocaleString('vi-VN')}</span> đ
                <ul>
                  {salesByDay[day].orders.map(order => (
                    <li className='my-2' key={order.orderId}>
                      Đơn hàng {order.orderId} gồm:
                      <ul>
                        {order.products.map(product => (
                          <li key={product.productId}>
                            - {product.name}: {product.quantity} sản phẩm, giá: {product.price.toLocaleString('vi-VN')} đ
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className="sales-by-month">
          <h2>Số đơn hàng bán ra theo tháng</h2>
          <ul>
            {Object.keys(salesByMonth).map(month => (
              <li className='my-4' key={month}>
                Tháng <strong>{month}</strong>: {salesByMonth[month].count} đơn hàng, <span style={{color:'red', fontWeight:600}}>{salesByMonth[month].revenue.toLocaleString('vi-VN')}</span> đ
                {salesByMonth[month].productSales && (
                  <ul>
                    {Object.keys(salesByMonth[month].productSales).map(productId => (
                      <li key={productId}>
                        - {salesByMonth[month].productSales[productId].productName}: {salesByMonth[month].productSales[productId].totalQuantity} sản phẩm, doanh thu: {salesByMonth[month].productSales[productId].totalRevenue.toLocaleString('vi-VN')} đ
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistical;
