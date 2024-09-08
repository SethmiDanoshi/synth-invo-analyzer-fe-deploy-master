import React, { useState, useEffect, useCallback } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Card, Typography, message, Row, Col, Select, Table, Switch } from 'antd';
import { Line } from 'react-chartjs-2';

const { Title } = Typography;
const { Option } = Select;

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SupplierCompare = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [selectedProductCurrency, setSelectedProductCurrency] = useState(null);
  const [isChartView, setIsChartView] = useState(true); // true for chart, false for table
  const organization_id = localStorage.getItem('organization_id');

  const fetchProducts = useCallback(async () => {
    try {
      const response = await HTTPService.get('search/get-prod-by-org/', {
        params: { organization_id: organization_id }
      });
      setProducts(response.data);
      if (response.data.length > 0) {
        const defaultProduct = response.data[0];
        setSelectedProduct(defaultProduct.description);
        setSelectedProductCurrency(defaultProduct.currency);
        setSelectedYear(defaultProduct.years[0]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch product list.');
    }
  }, [organization_id]);

  const fetchPriceData = useCallback(async () => {
    try {
      const response = await HTTPService.get('analysis/suppliers-price-by-month/', {
        params: {
          year: selectedYear,
          product_name: selectedProduct,
          organization_id: organization_id,
        }
      });
      setPriceData(response.data);
      message.success('Price data fetched successfully.');
    } catch (error) {
      console.error('Error fetching price data:', error);
      setPriceData([]);
      message.error('Failed to fetch price data.');
    }
  }, [organization_id, selectedProduct, selectedYear]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (selectedProduct && selectedYear) {
      fetchPriceData();
    }
  }, [selectedProduct, selectedYear, fetchPriceData]);

  const handleProductChange = (value) => {
    const product = products.find(p => p.description === value);
    setSelectedProduct(value);
    setSelectedProductCurrency(product.currency);
    setSelectedYear(product.years[0]);
    setPriceData([]);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setPriceData([]);
  };

  const getRandomColor = (index) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8', '#FF8333'];
    return colors[index % colors.length];
  };

  const prepareChartData = () => {
    const labels = months;
    const datasets = priceData.map((supplierData, index) => {
      const data = labels.map((_, i) => supplierData.monthly_prices[i + 1] || 0);
      return {
        label: supplierData.supplier,
        data,
        borderColor: getRandomColor(index),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      };
    });

    return { labels, datasets };
  };

  const lineData = prepareChartData();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '20px', textAlign: 'center' }}>Price Comparison</Title>
      <Row gutter={[16, 16]} justify="end" align="middle">
        <Col xs={24} md={8}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select a product"
            onChange={handleProductChange}
            value={selectedProduct}
          >
            {products.map((product, index) => (
              <Option key={index} value={product.description}>{product.description}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select a year"
            onChange={handleYearChange}
            value={selectedYear}
            disabled={!selectedProduct}
          >
            {selectedProduct && products.find(p => p.description === selectedProduct).years.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={8} style={{ textAlign: 'right' }}>
          <Switch
            checkedChildren="Chart"
            unCheckedChildren="Table"
            checked={isChartView}
            onChange={() => setIsChartView(prev => !prev)}
          />
        </Col>
      </Row>
      {selectedProduct && selectedProductCurrency && (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <strong>Currency:</strong> {selectedProductCurrency}
        </div>
      )}
      {priceData.length > 0 && isChartView && (
        <Card title="Price Data Analysis" style={{ marginTop: '20px' }}>
          <div style={{ height: '400px' }}>
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: {
                    display: true,
                    text: 'Average Price by Month and Supplier'
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Month'
                    }
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: `Price (${selectedProductCurrency})`
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
      )}
      {priceData.length > 0 && !isChartView && (
        <Card title="Price Data Analysis" style={{ marginTop: '20px' }}>
          <Table
            dataSource={priceData.flatMap((supplier, index) => 
              Object.keys(supplier.monthly_prices)
                .filter(month => supplier.monthly_prices[month] !== 0)
                .map((month, rowIndex) => ({
                  key: `${index}-${rowIndex}`,
                  supplier: supplier.supplier,
                  month: months[parseInt(month) - 1],
                  price: supplier.monthly_prices[month]
                }))
            )}
            columns={[
              {
                title: '#',
                key: 'rowNumber',
                render: (text, record, index) => index + 1,
              },
              {
                title: 'Supplier',
                dataIndex: 'supplier',
                key: 'supplier',
              },
              {
                title: 'Month',
                dataIndex: 'month',
                key: 'month',
              },
              {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (price) => price.toFixed(2)
              }
            ]}
            pagination={false}
          />
        </Card>
      )}
    </div>
  );
};

export default SupplierCompare;