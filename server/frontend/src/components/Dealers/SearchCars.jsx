import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';

const SearchCars = () => {
  const [cars, setCars] = useState([]); // 定义状态 cars 用于存储车辆库存列表
  const [loading, setLoading] = useState(true); // 定义状态 loading 用于指示数据加载状态
  const [error, setError] = useState(null); // 定义状态 error 用于存储错误信息
  const { dealer_id } = useParams(); // 使用 React Router 的 useParams 钩子来获取路由参数

  // 添加状态用于存储过滤条件
  const [model, setModel] = useState("");
  const [make, setMake] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");

  // 定义获取车辆库存的异步函数,添加 filters 参数用于构建 URL
  const fetchCars = async (filters = {}) => {
    const inventory_url = `/djangoapp/inventory/?dealer_id=${dealer_id}`; // 构建 API 请求 URL

    // 根据过滤条件构建 URL--需要解释一下
    if (filters.model) inventory_url += `&model=${filters.model}`;
    if (filters.make) inventory_url += `&make=${filters.make}`;
    if (filters.mileage) inventory_url += `&max_mileage=${filters.mileage}`;
    if (filters.price) inventory_url += `&price=${filters.price}`;
    if (filters.year) inventory_url += `&year=${filters.year}`;

    console.log(`Fetching cars inventory from: ${inventory_url}`);
    try {
      const response = await fetch(inventory_url);
      const result = await response.json();
      if (response.ok && result.status === 200) {
        setCars(result.inventory); // 设置车辆库存状态
        setError(null); // 清除错误信息
      } else {
        setCars([]); // 清空车辆库存状态
        setError(result.message || "Failed to load car inventory"); // 设置错误信息
      }
    } catch (error) {
      setCars([]); // 清空车辆库存状态
      setError("Error fetching car inventory: " + error.message);
    } finally {
      setLoading(false); // 设置加载状态为 false
    }
  };

  // 使用 useEffect 钩子在组件挂载时获取车辆库存数据
  useEffect(() => {
    fetchCars();
  }, [dealer_id]);

  // 处理过滤条件变化的函数，需要了解setLoading和setError的用途
  const handleFilterChange = () => {
    setLoading(true);
    setError(null);
    fetchCars({ model, make, mileage, price, year }); // 根据过滤条件获取数据
  };

  // 获取唯一选项的函数，避免重复
  const getUniqueOptions = (key) => {
    return [...new Set(cars.map(car => car[key]))];
  };

  return (
    <div>
      <Header /> {/* 渲染 Header 组件 */}
      <div style={{ margin: "20px" }}>
        <h1>Dealer Inventory</h1>
        <div className="filters">
          {/* 添加下拉菜单用于过滤 */}
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="">Select Model</option>
            {getUniqueOptions('model').map((model, index) => (
              <option key={index} value={model}>{model}</option>
            ))}
          </select>

          <select value={make} onChange={(e) => setMake(e.target.value)}>
            <option value="">Select Make</option>
            {getUniqueOptions('make').map((make, index) => (
              <option key={index} value={make}>{make}</option>
            ))}
          </select>

          <select value={mileage} onChange={(e) => setMileage(e.target.value)}>
            <option value="">Select Mileage</option>
            <option value="50000">小于50000公里</option>
            <option value="100000">50000-100000公里</option>
            <option value="150000">100000-150000公里</option>
            <option value="200000">150000-200000公里</option>
            <option value="200001">大于200000公里</option>
          </select>

          <select value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="">Select Price</option>
            <option value="20000">低于$20000</option>
            <option value="40000">$20000-$40000</option>
            <option value="60000">$40000-$60000</option>
            <option value="80000">$60000-$80000</option>
            <option value="80001">高于$80000</option>
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select Year</option>
            {getUniqueOptions('year').map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>

          <button onClick={handleFilterChange}>Filter</button>
        </div>

        {loading ? (
          <p>Loading car inventory...</p> // 显示加载状态
        ) : error ? (
          <p>{error}</p> // 显示错误信息
        ) : cars.length === 0 ? (
          <p>No inventory found for the given dealer_id.</p>
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
      </div>
    </div>
  );
};

export default SearchCars; // 导出 SearchCars 组件
