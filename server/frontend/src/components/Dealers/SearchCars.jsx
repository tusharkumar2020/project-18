import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';

const SearchCars = () => {
  const [cars, setCars] = useState([]); // 定义状态 cars 用于存储车辆库存列表
  const [loading, setLoading] = useState(true); // 定义状态 loading 用于指示数据加载状态
  const [error, setError] = useState(null); // 定义状态 error 用于存储错误信息
  const { dealer_id } = useParams(); // 使用 React Router 的 useParams 钩子来获取路由参数

  // 定义获取车辆库存的异步函数
  const fetchCars = async () => {
    const inventory_url = `${root_url}djangoapp/inventory/?dealer_id=${dealer_id}`; // 构建 API 请求 URL

    console.log(`Fetching cars inventory from: ${inventory_url}`);
    try {
      const response = await fetch(inventory_url);
      const result = await response.json();
      if (response.ok && result.status === 200) {
        setCars(result.inventory); // 设置车辆库存状态
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
    fetchCars();
  }, [dealer_id]);

  return (
    <div>
      <Header /> {/* 渲染 Header 组件 */}
      <div style={{ margin: "20px" }}>
        <h1>Dealer Inventory</h1>
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
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={index}>
                  <td>{car.model}</td>
                  <td>{car.make}</td>
                  <td>{car.mileage}</td>
                  <td>{car.price}</td>
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
