// import React, { useEffect, useState } from 'react';
// import './AdminStatistical.scss';
// import { getAllOrder } from '../../services/OrderService';
// import { Line } from 'react-chartjs-2';

// const AdminStatistical = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await getAllOrder();
//       setOrders(response.data);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     }
//   };

//   const calculateSalesData = () => {
//     const salesData = {
//       labels: [], // Dates
//       datasets: [
//         {
//           label: 'Number of Products Sold',
//           fill: false,
//           borderColor: '#007bff',
//           data: [], // Number of products sold
//         },
//         {
//           label: 'Revenue',
//           fill: false,
//           borderColor: '#28a745',
//           data: [], // Revenue
//         },
//       ],
//     };

//     // Group orders by date
//     const groupedOrders = groupOrdersByDate(orders);

//     // Calculate number of products and revenue for each date
//     Object.keys(groupedOrders).forEach(date => {
//       salesData.labels.push(date);

//       let totalProducts = 0;
//       let totalRevenue = 0;

//       groupedOrders[date].forEach(order => {
//         order.orderItems.forEach(item => {
//           totalProducts += item.amount;
//           totalRevenue += parseFloat(item.price.replace('.', '').replace(',', '.'));
//         });
//       });

//       salesData.datasets[0].data.push(totalProducts);
//       salesData.datasets[1].data.push(totalRevenue);
//     });

//     return salesData;
//   };

//   // Group orders by date
//   const groupOrdersByDate = (orders) => {
//     return orders.reduce((grouped, order) => {
//       const date = new Date(order.createdAt).toLocaleDateString();
//       if (!grouped[date]) {
//         grouped[date] = [];
//       }
//       grouped[date].push(order);
//       return grouped;
//     }, {});
//   };

//   const salesDataByDate = calculateSalesData();

//   return (
//     <div className="admin-statistical container">
//       <h1>Sales and Revenue by Date</h1>
//       <div className="statistical-chart">
//         <Line
//           data={salesDataByDate}
//           options={{
//             responsive: true,
//             plugins: {
//               legend: {
//                 position: 'top',
//               },
//             },
//             scales: {
//               x: {
//                 type: 'time',
//                 time: {
//                   unit: 'day', // Display by day
//                   displayFormats: {
//                     day: 'DD/MM/YYYY', // Format for displaying days
//                   },
//                 },
//                 title: {
//                   display: true,
//                   text: 'Date',
//                 },
//               },
//               y: {
//                 beginAtZero: true,
//                 title: {
//                   display: true,
//                   text: 'Amount',
//                 },
//               },
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default AdminStatistical;
