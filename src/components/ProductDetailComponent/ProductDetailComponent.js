import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import './ProductDetailComponent.scss';
import FooterComponent from '../FooterComponent/FooterComponent';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addOrderProduct } from '../../redux/counter/orderSlice';
import { Radio, Checkbox } from 'antd';

const ProductDetailComponent = () => {
  const { id } = useParams(); // Lấy tham số id từ URL
  const [product, setProduct] = useState(null);
  const [largeImage, setLargeImage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await ProductService.getDetailsProduct(productId);
      setProduct(response.data);
      setLargeImage(response.data.image[0]);
      setSelectedImage(response.data.image[0]);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      setError('Có lỗi xảy ra khi lấy chi tiết sản phẩm.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + delta;
      return newQuantity < 1 ? 1 : newQuantity;
    });
  };

  const handleAddOrderProduct = () => {
    if (!user) { // Kiểm tra trạng thái đăng nhập
      toast.error('Vui lòng đăng nhập để mua sản phẩm');
      return;
    }

    if (quantity > product.countInStock) {
      toast.error('Số lượng sản phẩm vượt quá số lượng trong kho');
      return;
    }

    if (product.countInStock === 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }
    const orderData = {
      orderItem: {
        name: product?.name,
        amount: quantity,
        image: product?.image,
        price: product?.price,
        product: product?._id,
        original_price: product?.original_price,
        selectedColor,
        selectedSize,
      }
    };
    console.log('Order Data:', orderData);

    // Kiểm tra dữ liệu trước khi dispatch
    if (!selectedColor) {
      toast.error('Vui lòng chọn màu sắc');
      return;
    }

    if (!selectedSize) {
      toast.error('Vui lòng chọn kích thước');
      return;
    }

    dispatch(addOrderProduct(orderData));

    toast.success('Sản phẩm đã được thêm vào giỏ hàng');
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div className="product-detail ">
        <div className="container mb-5">
          <div className="row product_inner">
            <div className="col-lg-6 product_inner-left">
              <img src={largeImage} alt="Large Product Image" />
              <ul className="product_img">
                {product.image.map((imageUrl, index) => (
                  <li key={index}>
                    <img
                      src={imageUrl}
                      alt="Thumbnail Image"
                      onClick={() => {
                        setLargeImage(imageUrl);
                        setSelectedImage(imageUrl);
                      }}
                      className={selectedImage === imageUrl ? 'selected' : ''}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <div className="product_text">
                <h3>{product.name}</h3>
                <div className='d-flex'>
                  <h2>
                    {product.price.toLocaleString()} <span>VND</span>
                  </h2>
                  <del style={{ marginLeft: 10, fontWeight: 600, color: '#707070' }}>
                    {product.original_price.toLocaleString()} <span>VND</span>
                  </del>
                </div>
                <ul className="list">
                  <li>
                    <span style={{ color: '#555555' }}>Danh mục</span>: {product.type}
                  </li>
                  <li>
                    <span>Tình trạng</span>: {product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}
                  </li>
                  <li className='mt-3'>
                    <p style={{ padding: 0 }} className='color'>Màu sắc</p>
                    <Radio.Group
                      onChange={(e) => setSelectedColor(e.target.value)}
                      value={selectedColor}
                    >
                      {product?.color.map((colors, index) => (
                        <Radio key={index} value={colors}>
                          {colors}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </li>
                  <li className='mt-3'>
                    <p style={{ padding: 0 }} className='color'>Kích thước</p>
                    <Radio.Group
                      onChange={(e) => setSelectedSize(e.target.value)}
                      value={selectedSize}
                    >
                      {product?.size.map((sizes, a) => (
                        <Radio key={a} value={sizes}>
                          {sizes}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </li>
                </ul>
                <p>{product.description}</p>
                <div className="product_count">
                  <label className="label" htmlFor="qty">Số lượng:</label>
                  <button onClick={() => handleQuantityChange(1)}>
                    <i className="fa-solid fa-chevron-up"></i>
                  </button>
                  <input
                    type="text"
                    name="qty"
                    id="sst"
                    maxLength="12"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    title="Quantity:"
                    className="input-text qty"
                  />
                  <button onClick={() => handleQuantityChange(-1)}>
                    <i className="fa-solid fa-chevron-down"></i>
                  </button>
                </div>
                <div className="card_area">
                  <a onClick={handleAddOrderProduct} className="main_btn" href="#">Thêm giỏ hàng</a>
                  <a className="icon_btn" href="#"><i className="fa-regular fa-gem"></i></a>
                  <a className="icon_btn" href="#"><i className="fa-regular fa-heart"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default ProductDetailComponent;
