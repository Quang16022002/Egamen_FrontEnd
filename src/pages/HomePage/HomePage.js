import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CartComponents from "../../components/CartComponents/CartComponents";
import HomeSlider from "../../components/HomeSlider/HomeSlider";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AoKhoac from "../../assets/images/aokhoac.png";
import AoSoMi from "../../assets/images/aosomi.png";
import AoThun from "../../assets/images/aothun.png";
import QuanDaiNam from "../../assets/images/quandainam.png";
import QuanJeans from "../../assets/images/quanjeans.png";
import QuanShort from "../../assets/images/quanshort.png";
import BlogComponent from "../../components/BlogComponent/BlogComponent";
import FeaturedProductsComponent from "../../components/FeaturedProductsComponent/FeaturedProductsComponent";

const HomePage = () => {
  const navigate = useNavigate();

  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
  });

  const fixedProductTypes = [
    { name: "Áo thun nam", image: AoThun },
    { name: "Áo sơ mi", image: AoSoMi },
    { name: "Áo khoác", image: AoKhoac },
    { name: "Quần dài nam", image: QuanDaiNam },
    { name: "Quần jeans", image: QuanJeans },
    { name: "Quần short", image: QuanShort },
  ];

  const [productTypes, setProductTypes] = useState(fixedProductTypes);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await ProductService.getAllTypeProduct();
        const typesWithCounts =
          fixedProductTypes.map((type) => ({
            ...type,
            count:
              res?.data?.filter((product) => product.type === type.name)
                .length || 0,
          })) || [];
        setProductTypes(typesWithCounts);
        localStorage.setItem("productTypes", JSON.stringify(typesWithCounts));
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };

    const storedProductTypes = localStorage.getItem("productTypes");
    if (storedProductTypes) {
      setProductTypes(JSON.parse(storedProductTypes));
    } else {
      fetchProductTypes();
    }
  }, []);

  useEffect(() => {
    if (products) {
      const updatedProductTypes = fixedProductTypes.map((type) => {
        const count = products.data.filter(
          (product) => product.type === type.name
        ).length;
        return { ...type, count };
      });
      setProductTypes(updatedProductTypes);
      localStorage.setItem("productTypes", JSON.stringify(updatedProductTypes));
    }
  }, [products]);

  const handleProductClick = (type) => {
    navigate(`/products?type=${type}`);
  };

  return (
    <div className="Home">
      <HomeSlider />
      <div className="container py-3">
        <div className="row">
          <div className="col-md-6 col-lg-3 col-6 mb-4 homepage-itroduce">
            <div className="img-homepage-intro">
              <img src="https://theme.hstatic.net/200000696635/1001199686/14/policies_icon_1.png?v=8" />
            </div>
            <div className="text-homepage-intro">
              <p>Miễn phí vận chuyển</p>
              <span>Nhận hàng trong vòng 3 ngày</span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 col-6 mb-4 homepage-itroduce">
            <div className="img-homepage-intro">
              <img src="https://theme.hstatic.net/200000696635/1001199686/14/policies_icon_2.png?v=8" />
            </div>
            <div className="text-homepage-intro">
              <p>Quà tặng hấp dẫn</p>
              <span>Nhiều ưu đãi khuyến mãi hot</span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 col-6 mb-4 homepage-itroduce">
            <div className="img-homepage-intro">
              <img src="https://theme.hstatic.net/200000696635/1001199686/14/policies_icon_3.png?v=8" />
            </div>
            <div className="text-homepage-intro">
              <p>Bảo đảm chất lượng</p>
              <span>Sản phẩm đã được kiểm định</span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 col-6 mb-4 homepage-itroduce">
            <div className="img-homepage-intro">
              <img src="https://theme.hstatic.net/200000696635/1001199686/14/policies_icon_4.png?v=8" />
            </div>
            <div className="text-homepage-intro">
              <p>Hotline: 19001993</p>
              <span>Dịch vụ hỗ trợ bạn 24/7</span>
            </div>
          </div>
        </div>
      </div>

      <section className="container">
        <div className="row justify-content-center text-align-center">
          <section className="feature_product_area">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div class="main_title">
                  <h2>
                    <span>Thời trang EGA</span>
                  </h2>
                  <p>Danh mục sản phẩm dành cho bạn</p>
                </div>
              </div>
            </div>
          </section>

          <div className="container">
            <div className="product-types">
              <div className="row">
                {productTypes.map((type, index) => (
                  <div
                    key={index}
                    className="col-6 col-md-4 col-lg-2 d-flex flex-column align-items-center mb-4 product-type-item"
                    onClick={() => handleProductClick(type.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={type.image}
                      alt={type.name}
                      className="product-type-image"
                    />
                    <div className="product-type-count text-center mt-2">
                      <span style={{ fontSize: "18px" }}>{type.name}</span>
                      <div
                        style={{
                          fontSize: "15px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ marginTop: "-15px", color: "gray" }}>
                          {type.count}
                        </span>
                        <p style={{ marginLeft: "3px", color: "gray" }}>
                          sản phẩm
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature_product_area container">
        <div className="row justify-content-center">
          <div className="col-lg-12 ">
            <div class="main_title">
              <h2>
                <span>Sản phẩm nổi bật</span>
              </h2>
              <p>Cập nhật ngay những mẫu hot nhất hiện nay</p>
              <FeaturedProductsComponent />
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "-30px" }} className="container offer-area">
        <div>
          <img
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/products")}
            className="offer-area-img"
            src="https://theme.hstatic.net/200000690725/1001078549/14/slide_4_img.jpg?v=418"
          />
        </div>
      </section>

      <div className="col-lg-12  container py-3 ">
        <div class="main_title">
          <h2>
            <span>Set đồ dành cho bạn</span>
          </h2>
          <p>Bạn sẽ không thất vọng khi lựa chọn</p>
        </div>
        <div className="products row d-flex flex-wrap">
          {products?.data
            ?.filter((product) => product.type)
            .slice(0, 8)
            .map((product) => {
              return (
                <CartComponents
                  key={product._id}
                  id={product._id}
                  countInStock={product.countInStock}
                  descriptions={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  original_price={product.original_price}
                  size={product.size}
                  color={product.color}
                  isFavorite={product.isFavorite}
                />
              );
            })}
        </div>
      </div>

      <section
        className="all-product"
        onClick={() => navigate("/products")}
        style={{ cursor: "pointer", marginBottom: "30px" }}
      >
        <p>Xem tất cả</p>
        <i class="fa-solid fa-chevron-right"></i>
      </section>

      <section className="container">
        <div className="row new_product_area-left justify-content-center ">
          <div className="col-lg-12">
            <div class="news-header">
              <h2>TIN TỨC</h2>
            </div>
            <BlogComponent />
          </div>
        </div>
      </section>

      <section
        className="all-product"
        onClick={() => navigate("/blog")}
        style={{ cursor: "pointer", marginBottom: "30px" }}
      >
        <p>Xem tất cả</p>
        <i class="fa-solid fa-chevron-right"></i>
      </section>
    </div>
  );
};

export default HomePage;
