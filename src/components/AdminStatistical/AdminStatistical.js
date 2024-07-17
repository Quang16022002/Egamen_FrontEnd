import React, { useEffect, useState } from "react";
import { getAllOrder } from "../../services/OrderService";
import "./AdminStatistical.scss";
import TimeComponent from "../TimeCompnent/TimeComponent";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const AdminStatistical = () => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrder();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const calculateSalesByPeriod = () => {
    if (!orders || !orders.length) {
      return { salesByDay: {}, salesByMonth: {} }; // Return empty objects if orders is null, undefined, or empty
    }

    const salesByDay = {};
    const salesByMonth = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const dayKey = orderDate.toISOString().slice(0, 10); // Key format: YYYY-MM-DD
      const monthKey = `${orderDate.getFullYear()}-${(
        "0" +
        (orderDate.getMonth() + 1)
      ).slice(-2)}`; // Key format: YYYY-MM

      if (!salesByDay[dayKey]) {
        salesByDay[dayKey] = { count: 0, revenue: 0, orders: {} }; // Use an object to store orders
      }
      if (!salesByMonth[monthKey]) {
        salesByMonth[monthKey] = { count: 0, revenue: 0, productSales: {} }; // Initialize productSales as an object
      }

      const cleanedTotalPrice = parseInt(
        order.totalPrice.replace(/[^\d]/g, "")
      );

      salesByDay[dayKey].count += 1;
      salesByDay[dayKey].revenue += cleanedTotalPrice;

      salesByMonth[monthKey].count += 1;
      salesByMonth[monthKey].revenue += cleanedTotalPrice;

      order.orderItems.forEach((item) => {
        const productId = item.product;
        const productName = item.name;
        const quantity = item.amount;
        const productPrice = parseInt(item.price.replace(/[^\d]/g, ""));

        // Ensure order has products and each product has valid data
        if (productName && quantity && productPrice) {
          // Add product details to salesByDay
          if (!salesByDay[dayKey].orders[order._id]) {
            salesByDay[dayKey].orders[order._id] = {
              orderId: order._id,
              totalPrice: cleanedTotalPrice,
              products: [],
            };
          }
          salesByDay[dayKey].orders[order._id].products.push({
            productId,
            name: productName,
            quantity,
            price: productPrice,
          });

          // Add product details to salesByMonth
          if (!salesByMonth[monthKey].productSales[productId]) {
            salesByMonth[monthKey].productSales[productId] = {
              productName,
              totalQuantity: 0,
              totalRevenue: 0,
            };
          }

          salesByMonth[monthKey].productSales[productId].totalQuantity +=
            quantity;
          salesByMonth[monthKey].productSales[productId].totalRevenue +=
            productPrice * quantity;
        }
      });
    });

    // Convert orders object to array for easier rendering
    Object.keys(salesByDay).forEach((day) => {
      salesByDay[day].orders = Object.values(salesByDay[day].orders);
    });

    return { salesByDay, salesByMonth };
  };

  const { salesByDay, salesByMonth } = calculateSalesByPeriod();

  const generatePieChartData = (salesByDay) => {
    const labels = [];
    const data = [];
    const revenues = [];

    Object.keys(salesByDay).forEach((day) => {
      salesByDay[day].orders.forEach((order) => {
        order.products.forEach((product) => {
          const productName = product.name;
          const productQuantity = product.quantity;
          const productRevenue = product.price * product.quantity;

          const existingIndex = labels.indexOf(productName);
          if (existingIndex !== -1) {
            data[existingIndex] += productQuantity;
            revenues[existingIndex] += productRevenue;
          } else {
            labels.push(productName);
            data.push(productQuantity);
            revenues.push(productRevenue);
          }
        });
      });
    });

    return {
      labels,
      datasets: [
        {
          label: "Product Sales",
          data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
      revenues,
    };
  };

  const generateLineChartData = (salesByDay) => {
    const labels = Object.keys(salesByDay).sort(); // Sort the dates
    const data = labels.map((day) => salesByDay[day].revenue);

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu bán ra theo ngày",
          data,
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          tension: 0.1,
        },
      ],
    };
  };

  const pieChartData = generatePieChartData(salesByDay);
  const lineChartData = generateLineChartData(salesByDay);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = pieChartData.labels[tooltipItem.dataIndex] || "";
            const quantity =
              pieChartData.datasets[0].data[tooltipItem.dataIndex] || 0;
            const revenue = pieChartData.revenues[tooltipItem.dataIndex] || 0;
            return `${label}: ${quantity} sản phẩm, doanh thu: ${revenue.toLocaleString(
              "vi-VN"
            )} đ`;
          },
        },
      },
    },
  };

  const filterSalesByDay = (selectedDay) => {
    const dayKey = selectedDay.toISOString().slice(0, 10);
    return salesByDay[dayKey] || { count: 0, revenue: 0, orders: [] };
  };

  const filteredSalesByDay = filterSalesByDay(selectedDate);

  return (
    <div className="sales-report container">
      <div className="Admin_user-title d-flex justify-content-between my-3">
        <h5>Thống kê</h5>
        <TimeComponent />
      </div>
      <h1>Báo cáo doanh số</h1>
      <div className="sales-by-period">
        <div className="px-3 py-3 d-flex">
          <div
            style={{ width: "50%" }}
            className="d-flex flex-column justify-content-center"
          >
            <div
              style={{ width: "100%", textAlign: "center", margin: "0 auto" }}
              className="pie-chart-container d-flex flex-column"
            >
              <h3 style={{ marginBottom: 20, width: "100%" }}>
                Biểu đồ doanh số sản phẩm bán ra
              </h3>
              <div style={{ width: 400, height: 400, margin: "0 auto" }}>
                <Pie data={pieChartData} options={options} />
              </div>
            </div>
         
          </div>
          <div
              className="line-chart-container d-flex flex-column"
              style={{ marginTop: "40px" }}
            >
              <h3
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                Biểu đồ đường doanh số bán ra theo ngày
              </h3>
              <div style={{ width: "100%", height: "auto", margin: "0 auto" }}>
                <Line data={lineChartData} />
              </div>
            </div>
        </div>
        <div className=" px-3 py-3 d-flex ">
          <div style={{ width: "50%" }} className="sales-by-day d-flex">
            <div>
              <h3>Số đơn hàng bán ra theo ngày</h3>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
              />
              <ul>
                <li className="my-4">
                  <strong>{selectedDate.toISOString().slice(0, 10)}</strong>:{" "}
                  {filteredSalesByDay.count} đơn hàng,{" "}
                  <span style={{ color: "red", fontWeight: 600 }}>
                    {filteredSalesByDay.revenue.toLocaleString("vi-VN")}
                  </span>{" "}
                  đ
                  <ul>
                    {filteredSalesByDay.orders.map((order) => (
                      <li className="my-2" key={order.orderId}>
                        Đơn hàng {order.orderId}{" "}
                        <strong>
                          ({order.totalPrice.toLocaleString("vi-VN")} đ)
                        </strong>{" "}
                        gồm:
                        <ul>
                          {order.products.map((product) => (
                            <li key={product.productId}>
                              {product.name}: {product.quantity} sản phẩm, giá:{" "}
                              {product.price.toLocaleString("vi-VN")} đ
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div style={{ width: "50%" }} className="sales-by-month">
            <h3>Số đơn hàng bán ra theo tháng</h3>
            <ul>
              {Object.keys(salesByMonth).map((month) => (
                <li className="my-4" key={month}>
                  Tháng <strong>{month}</strong>: {salesByMonth[month].count}{" "}
                  đơn hàng,{" "}
                  <span style={{ color: "red", fontWeight: 600 }}>
                    {salesByMonth[month].revenue.toLocaleString("vi-VN")}
                  </span>{" "}
                  đ
                  {salesByMonth[month].productSales && (
                    <ul>
                      {Object.keys(salesByMonth[month].productSales).map(
                        (productId) => (
                          <li key={productId}>
                            {
                              salesByMonth[month].productSales[productId]
                                .productName
                            }
                            :{" "}
                            {
                              salesByMonth[month].productSales[productId]
                                .totalQuantity
                            }{" "}
                            sản phẩm, doanh thu:{" "}
                            {salesByMonth[month].productSales[
                              productId
                            ].totalRevenue.toLocaleString("vi-VN")}{" "}
                            đ
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistical;
