
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
  const [view, setView] = useState("day"); // "day", "month" or "year"

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
      return { salesByDay: {}, salesByMonth: {}, salesByYear: {} };
    }

    const salesByDay = {};
    const salesByMonth = {};
    const salesByYear = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const dayKey = orderDate.toISOString().slice(0, 10);
      const monthKey = `${orderDate.getFullYear()}-${(
        "0" +
        (orderDate.getMonth() + 1)
      ).slice(-2)}`;
      const yearKey = orderDate.getFullYear().toString();

      if (!salesByDay[dayKey]) {
        salesByDay[dayKey] = { count: 0, revenue: 0, orders: {} };
      }
      if (!salesByMonth[monthKey]) {
        salesByMonth[monthKey] = { count: 0, revenue: 0, productSales: {} };
      }
      if (!salesByYear[yearKey]) {
        salesByYear[yearKey] = { count: 0, revenue: 0, productSales: {} };
      }

      const cleanedTotalPrice = parseInt(
        order.totalPrice.replace(/[^\d]/g, "")
      );

      salesByDay[dayKey].count += 1;
      salesByDay[dayKey].revenue += cleanedTotalPrice;

      salesByMonth[monthKey].count += 1;
      salesByMonth[monthKey].revenue += cleanedTotalPrice;

      salesByYear[yearKey].count += 1;
      salesByYear[yearKey].revenue += cleanedTotalPrice;

      order.orderItems.forEach((item) => {
        const productId = item.product;
        const productName = item.name;
        const quantity = item.amount;
        const productPrice = parseInt(item.price.replace(/[^\d]/g, ""));

        if (productName && quantity && productPrice) {
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

          if (!salesByMonth[monthKey].productSales[productId]) {
            salesByMonth[monthKey].productSales[productId] = {
              productName,
              totalQuantity: 0,
              totalRevenue: 0,
            };
          }
          if (!salesByYear[yearKey].productSales[productId]) {
            salesByYear[yearKey].productSales[productId] = {
              productName,
              totalQuantity: 0,
              totalRevenue: 0,
            };
          }

          salesByMonth[monthKey].productSales[productId].totalQuantity +=
            quantity;
          salesByMonth[monthKey].productSales[productId].totalRevenue +=
            productPrice * quantity;

          salesByYear[yearKey].productSales[productId].totalQuantity +=
            quantity;
          salesByYear[yearKey].productSales[productId].totalRevenue +=
            productPrice * quantity;
        }
      });
    });

    Object.keys(salesByDay).forEach((day) => {
      salesByDay[day].orders = Object.values(salesByDay[day].orders);
    });

    return { salesByDay, salesByMonth, salesByYear };
  };

  const { salesByDay, salesByMonth, salesByYear } = calculateSalesByPeriod();

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
    const labels = Object.keys(salesByDay).sort(); // Lấy các ngày và sắp xếp theo thứ tự
    const revenueData = labels.map((day) => salesByDay[day].revenue); // Dữ liệu doanh thu
    const orderCountData = labels.map((day) => salesByDay[day].count); // Dữ liệu số lượng đơn hàng
    const productQuantityData = labels.map((day) =>
      salesByDay[day].orders.reduce((total, order) => {
        return (
          total +
          order.products.reduce((sum, product) => sum + product.quantity, 0)
        );
      }, 0)
    ); // Dữ liệu số lượng sản phẩm bán ra

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu bán ra theo ngày",
          data: revenueData,
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          tension: 0.1,
          yAxisID: "revenue-y-axis",
        },
        {
          label: "Số đơn hàng",
          data: orderCountData,
          fill: false,
          borderColor: "rgba(255,99,132,1)",
          tension: 0.1,
          yAxisID: "order-count-y-axis",
        },
        {
          label: "Số lượng sản phẩm bán ra",
          data: productQuantityData,
          fill: false,
          borderColor: "rgba(54, 162, 235, 1)",
          tension: 0.1,
          yAxisID: "product-quantity-y-axis",
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
        <h5>Thống kê doanh thu</h5>
        <TimeComponent />
      </div>
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
              <div style={{ width: 400, height: 400, margin: "0 auto" }}>
                <Pie data={pieChartData} options={options} />
              </div>
              <h3
                style={{
                  marginTop: 20,
                  width: "100%",
                  fontWeight: "400",
                }}
              >
                Biểu đồ doanh số sản phẩm bán ra
              </h3>
            </div>
          </div>
          <div
            className="line-chart-container d-flex flex-column"
            style={{ marginTop: "40px" }}
          >
            <div style={{ width: "100%", height: "auto", marginTop: 95 }}>
              <Line data={lineChartData} />
            </div>
            <h3
              style={{
                textAlign: "center",
                marginTop: 20,
                width: "100%",
                fontWeight: "400",
              }}
            >
              Biểu đồ đường doanh số bán ra theo ngày
            </h3>
          </div>
        </div>
        <div className="px-3 py-4 d-flex justify-content-center buttonAdmin">
          <button
            style={{ backgroundColor: "rgb(129, 170, 204)", border: "none" }}
            className={`btn btn-primary mx-2 ${view === "day" ? "active" : ""}`}
            onClick={() => setView("day")}
          >
            Thống kê theo ngày
          </button>
          <button
            style={{ backgroundColor: "rgb(129, 170, 204)", border: "none" }}
            className={`btn btn-primary mx-2 ${
              view === "month" ? "active" : ""
            }`}
            onClick={() => setView("month")}
          >
            Thống kê theo tháng
          </button>
          <button
            style={{ backgroundColor: "rgb(129, 170, 204)", border: "none" }}
            className={`btn btn-primary mx-2 ${
              view === "year" ? "active" : ""
            }`}
            onClick={() => setView("year")}
          >
            Thống kê theo năm
          </button>
        </div>
        <div className="px-3 py-3 d-flex">
          {view === "day" && (
            <div style={{ width: "100%" }} className="sales-by-day">
              <h3 style={{ fontWeight: "400", textAlign: "center" }}>
                Số đơn hàng bán ra theo ngày
              </h3>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
              />
              <table
                style={{ marginTop: "20px" }}
                className="table table-bordered"
              >
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Số đơn hàng</th>
                    <th>Doanh thu (đ)</th>
                    <th>Chi tiết đơn hàng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedDate.toISOString().slice(0, 10)}</td>
                    <td>{filteredSalesByDay.count}</td>
                    <td style={{ color: "red", fontWeight: 600 }}>
                      {filteredSalesByDay.revenue.toLocaleString("vi-VN")}
                    </td>
                    <td>
                      <ul>
                        {filteredSalesByDay.orders.map((order, index) => (
                          <li key={order.orderId}>
                            {index + 1}. Đơn hàng {order.orderId}{" "}
                            <strong>
                              ({order.totalPrice.toLocaleString("vi-VN")} đ)
                            </strong>{" "}
                            gồm:
                            <ul>
                              {order.products.map((product) => (
                                <li key={product.productId}>
                                  {product.name}: {product.quantity} sản phẩm,
                                  giá: {product.price.toLocaleString("vi-VN")} đ
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {view === "month" && (
            <div style={{ width: "100%" }} className="sales-by-month">
              <h3 style={{ fontWeight: "400", textAlign: "center" }}>
                Số đơn hàng bán ra theo tháng
              </h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th>Số đơn hàng</th>
                    <th>Doanh thu (đ)</th>
                    <th>Chi tiết sản phẩm</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(salesByMonth).map((month) => (
                    <tr key={month}>
                      <td>{month}</td>
                      <td>{salesByMonth[month].count}</td>
                      <td style={{ color: "red", fontWeight: 600 }}>
                        {salesByMonth[month].revenue.toLocaleString("vi-VN")}
                      </td>
                      <td>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {view === "year" && (
            <div style={{ width: "100%" }} className="sales-by-year">
              <h3 style={{ fontWeight: "400", textAlign: "center" }}>
                Số đơn hàng bán ra theo năm
              </h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Năm</th>
                    <th>Số đơn hàng</th>
                    <th>Doanh thu (đ)</th>
                    <th>Chi tiết sản phẩm</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(salesByYear).map((year) => (
                    <tr key={year}>
                      <td>{year}</td>
                      <td>{salesByYear[year].count}</td>
                      <td style={{ color: "red", fontWeight: 600 }}>
                        {salesByYear[year].revenue.toLocaleString("vi-VN")}
                      </td>
                      <td>
                        {salesByYear[year].productSales && (
                          <ul>
                            {Object.keys(salesByYear[year].productSales).map(
                              (productId) => (
                                <li key={productId}>
                                  {
                                    salesByYear[year].productSales[productId]
                                      .productName
                                  }
                                  :{" "}
                                  {
                                    salesByYear[year].productSales[productId]
                                      .totalQuantity
                                  }{" "}
                                  sản phẩm, doanh thu:{" "}
                                  {salesByYear[year].productSales[
                                    productId
                                  ].totalRevenue.toLocaleString("vi-VN")}{" "}
                                  đ
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStatistical;
