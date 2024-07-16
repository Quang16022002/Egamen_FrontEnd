import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import "./ProductsPage.scss";
import CartComponents from "../../components/CartComponents/CartComponents";

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const [selectedType, setSelectedType] = useState(type || null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: ProductService.getAllProduct,
  });

  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await ProductService.getAllTypeProduct();
        setProductTypes(res?.data || []);
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };

    fetchProductTypes();
  }, []);

  const handleTypeClick = (type) => {
    setSelectedType(type === selectedType ? null : type);
    setCurrentPage(1);
  };

  const handlePriceRangeClick = (priceRange) => {
    setSelectedPriceRange(
      priceRange === selectedPriceRange ? null : priceRange
    );
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const filterProductsByPriceRange = (product) => {
    if (!selectedPriceRange) return true;

    const [minPrice, maxPrice] = selectedPriceRange.split("-");
    const productPrice = parseFloat(product.price.replace(/\D/g, ""));
    return (
      productPrice >= parseFloat(minPrice) &&
      productPrice <= parseFloat(maxPrice)
    );
  };

  const filterProductsBySearchKeyword = (product) => {
    if (!searchKeyword) return true;

    return product.name.toLowerCase().includes(searchKeyword.toLowerCase());
  };

  const productsPerPage = 9;
  const filteredProducts =
    products?.data?.filter(
      (product) =>
        (selectedType === null || product.type === selectedType) &&
        filterProductsByPriceRange(product) &&
        filterProductsBySearchKeyword(product)
    ) || [];

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="container">
        <div className="signup_header px-3">
          <Link className="link-homepage" to="/">
            Trang chủ
          </Link>
          <p>/</p>
          <p style={{ color: "rgb(191, 191, 191)" }}>Sản phẩm</p>
        </div>
        <div className="imageproduct px-3">
          <img src="https://theme.hstatic.net/200000696635/1001199686/14/collection_main_banner.jpg?v=8" />
        </div>
      </div>
      <div className="container py-5 px-4">
        <div className="homepage">
          <div className="row">
            <div className="col-lg-3">
              <div className="category">
                <div className="category_title">
                  <h3>Danh mục sản phẩm</h3>
                </div>
                <div>
                  <ul className="category_list">
                    <li
                      key="All"
                      className={selectedType === null ? "active" : ""}
                      onClick={() => handleTypeClick(null)}
                    >
                      Tất cả{" "}
                      <span className="product-count">
                        ({products?.data?.length || 0})
                      </span>
                    </li>

                    {productTypes
                      .slice()
                      .reverse()
                      .map((type) => (
                        <li
                          key={type}
                          className={selectedType === type ? "active" : ""}
                          onClick={() => handleTypeClick(type)}
                        >
                          {type}
                        </li>
                      ))}
                    <div style={{ marginTop: 10 }}>
                      <input
                        type="search"
                        placeholder="Tìm kiếm sản phẩm"
                        value={searchKeyword}
                        onChange={handleSearchChange}
                        className="search-input-product"
                      />
                    </div>
                  </ul>
                </div>
              </div>

              <div className="category">
                <div className="category_title">
                  <h3>Lọc sản phẩm theo giá</h3>
                </div>
                <div>
                  <ul className="category_list">
                    <li
                      className={
                        selectedPriceRange === "0-200000" ? "active" : ""
                      }
                      onClick={() => handlePriceRangeClick("0-200000")}
                    >
                      Dưới 200.000đ
                    </li>
                    <li
                      className={
                        selectedPriceRange === "200000-400000" ? "active" : ""
                      }
                      onClick={() => handlePriceRangeClick("200000-400000")}
                    >
                      Từ 200.000đ đến 400.000đ
                    </li>
                    <li
                      className={
                        selectedPriceRange === "400000-600000" ? "active" : ""
                      }
                      onClick={() => handlePriceRangeClick("400000-600000")}
                    >
                      Từ 400.000đ đến 600.000đ
                    </li>
                    <li
                      className={
                        selectedPriceRange === "600000-800000" ? "active" : ""
                      }
                      onClick={() => handlePriceRangeClick("600000-800000")}
                    >
                      Từ 600.000đ đến 800.000đ
                    </li>
                    <li
                      className={
                        selectedPriceRange === "800000-1000000" ? "active" : ""
                      }
                      onClick={() => handlePriceRangeClick("800000-1000000")}
                    >
                      Từ 800.000đ đến 1.000.000đ
                    </li>
                    <li
                      className={
                        selectedPriceRange === "1000000-Infinity"
                          ? "active"
                          : ""
                      }
                      onClick={() => handlePriceRangeClick("1000000-Infinity")}
                    >
                      Trên 1.000.000đ
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="products row d-flex flex-wrap">
                {paginatedProducts.map((product) => (
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
                ))}
              </div>
              <div className="pagination">
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page}
                    className={`page-button ${
                      currentPage === page + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
