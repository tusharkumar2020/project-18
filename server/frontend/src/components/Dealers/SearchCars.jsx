import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import { useParams, Link } from 'react-router-dom';
import Header from '../Header/Header';

const SearchCars = () => {
  const [cars, setCars] = useState([]); // 定义状态 cars 用于存储车辆库存列表
  const [loading, setLoading] = useState(true); // 定义状态 loading 用于指示数据加载状态
  const [error, setError] = useState(null); // 定义状态 error 用于存储错误信息
  const [filters, setFilters] = useState({ model: "", make: "", mileage: "", price: "", year: "" }); // 定义状态 filters 用于存储过滤条件
  const { dealer_id } = useParams(); // 使用 React Router 的 useParams 钩子来获取路由参数

  // 定义获取车辆库存的异步函数
  const fetchCars = async (filters = {}) => {
    const root_url = window.location.href.substring(0, window.location.href.indexOf("dealer"));
    let inventory_url = `${root_url}djangoapp/inventory/?dealer_id=${dealer_id}`; // 构建 API 请求 URL

    // 添加过滤条件到 URL
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        inventory_url += `&${key}=${filters[key]}`;
      }
    });

    console.log(`Fetching cars inventory from: ${inventory_url}`);
    try {
      const response = await fetch(inventory_url);
      const result = await response.json();
      if (response.ok && result.status === 200) {
        setCars(result.inventory); // 设置车辆库存状态
        if (result.inventory.length === 0) {
          setError("No inventory found for the given dealer_id.");
        } else {
          setError(null); // 如果有数据，则清除错误
        }
      } else {
        setError(result.message || "Failed to load car inventory"); // 设置错误信息
      }
    } catch (error) {
      setError("Error fetching car inventory: " + error.message);
    } finally {
      setLoading(false); // 设置加载状态为 false
    }
  };

  // 使用 useEffect 钩子在组件挂载时获取车辆库存数据
  useEffect(() => {
    fetchCars(filters);
  }, [dealer_id, filters]);

  const uniqueOptions = (key) => {
    return [...new Set(cars.map(car => car[key]))];
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleReset = () => {
    setFilters({ model: "", make: "", mileage: "", price: "", year: "" });
    setLoading(true);
    fetchCars();
  };

  return (
    <div>
      <Header /> {/* 渲染 Header 组件 */}
      <div style={{ margin: "20px" }}>
        <h1>Dealer Inventory</h1>
        <div>
          <select name="model" value={filters.model} onChange={handleFilterChange}>
            <option value="">Select Model</option>
            {uniqueOptions("model").map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <select name="make" value={filters.make} onChange={handleFilterChange}>
            <option value="">Select Make</option>
            {uniqueOptions("make").map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <select name="mileage" value={filters.mileage} onChange={handleFilterChange}>
            <option value="">Select Mileage</option>
            <option value="50000">小于50000公里</option>
            <option value="100000">50000-100000公里</option>
            <option value="150000">100000-150000公里</option>
            <option value="200000">150000-200000公里</option>
            <option value="200001">大于200000公里</option>
          </select>
          <select name="price" value={filters.price} onChange={handleFilterChange}>
            <option value="">Select Price</option>
            <option value="20000">低于$20000</option>
            <option value="40000">$20000-$40000</option>
            <option value="60000">$40000-$60000</option>
            <option value="80000">$60000-$80000</option>
            <option value="80001">高于$80000</option>
          </select>
          <select name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">Select Year</option>
            {uniqueOptions("year").map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <button onClick={() => fetchCars(filters)}>Filter</button>
          <button onClick={handleReset}>Reset</button> {/* 添加重置按钮 */}
        </div>
        {loading ? (
          <p>Loading car inventory...</p> // 显示加载状态
        ) : error ? (
          <p>{error}</p> // 显示错误信息
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>Model</th>
                <th>Make</th>
                <th>Mileage</th>
                <th>Price</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={index}>
                  <td>{car.model}</td>
                  <td>{car.make}</td>
                  <td>{car.mileage}</td>
                  <td>{car.price}</td>
                  <td>{car.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link to={`/dealer/${dealer_id}`} style={{ display: "block", marginTop: "20px", fontSize: "18px", color: "blue" }}>
          Back
        </Link> {/* 添加返回到 Dealer 页面链接 */}
      </div>
    </div>
  );
};

export default SearchCars; // 导出 SearchCars 组件
