import React, { useEffect, useState, useCallback, useMemo } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Card, Typography, message, Row, Col, Select, Table, Switch } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const { Title } = Typography;
const { Option } = Select;

const ProductAnalysis = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [availableYears, setAvailableYears] = useState([]);
    const [priceDeviationData, setPriceDeviationData] = useState(null);
    const [isChartView, setIsChartView] = useState(true);
    const [selectedProductCurrency, setSelectedProductCurrency] = useState(null);
    const organization_id = localStorage.getItem('organization_id');

    const fetchProducts = useCallback(async () => {
        try {
            const response = await HTTPService.get('search/get-prod-by-org/', {
                params: { organization_id }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Failed to fetch product list.');
        }
    }, [organization_id]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const fetchPriceDeviations = useCallback(async () => {
        if (selectedProduct && selectedYear) {
            try {
                const response = await HTTPService.get('analysis/product_price_deviations/', {
                    params: { year: selectedYear, product_name: selectedProduct, organization_id }
                });
                setPriceDeviationData(response.data);
                message.success('Price deviation data fetched successfully.');
            } catch (error) {
                console.error('Error fetching price deviation data:', error);
                setPriceDeviationData(null);
                message.error('Failed to fetch price deviation data.');
            }
        }
    }, [selectedProduct, selectedYear, organization_id]);

    useEffect(() => {
        fetchPriceDeviations();
    }, [fetchPriceDeviations]);

    const handleProductChange = useCallback((value) => {
        const product = products.find(p => p.description === value);
        setSelectedProduct(value);
        setSelectedProductCurrency(product.currency);
        setAvailableYears(product.years);
        setSelectedYear(null);
        setPriceDeviationData(null);
    }, [products]);

    const handleYearChange = useCallback((value) => {
        setSelectedYear(value);
        setPriceDeviationData(null);
    }, []);

    const monthNames = useMemo(() => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], []);

    const lineData = useMemo(() => ({
        labels: priceDeviationData ? priceDeviationData.map(item => monthNames[item.month - 1]) : [],
        datasets: [
            {
                label: `${selectedProduct} Price`,
                data: priceDeviationData ? priceDeviationData.map(item => item.price) : [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0.1
            },
            {
                label: 'Overall Average Price',
                data: priceDeviationData ? priceDeviationData.map(item => item.overall_avg_price) : [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.1
            }
        ]
    }), [priceDeviationData, selectedProduct, monthNames]);

    const columns = useMemo(() => [
        {
            title: '#',
            key: 'index',
            render: (_, __, index) => index + 1
        },
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            render: (month) => monthNames[month - 1]
        },
        {
            title: `${selectedProduct} Price (${selectedProductCurrency})`,
            dataIndex: 'price',
            key: 'price',
            render: (price) => price.toFixed(2)
        },
        {
            title: `Overall Average Price (${selectedProductCurrency})`,
            dataIndex: 'overall_avg_price',
            key: 'overall_avg_price',
            render: (price) => price.toFixed(2)
        },
    ], [selectedProduct, selectedProductCurrency, monthNames]);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '20px', textAlign: 'center' }}>Product Price Analysis</Title>
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
                        {availableYears.map(year => (
                            <Option key={year} value={year}>{year}</Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} md={8}>
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
                    <strong>Selected Product Currency: {selectedProductCurrency}</strong>
                </div>
            )}
            {priceDeviationData && priceDeviationData.length > 0 && (
                <Card title="Price Deviation Analysis" style={{ marginTop: '20px' }}>
                    {isChartView ? (
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
                                            text: 'Price Deviation Over Time'
                                        }
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <Table
                            dataSource={priceDeviationData}
                            columns={columns}
                            pagination={false}
                            rowKey={(record, index) => `${record.month}-${index}`}
                        />
                    )}
                </Card>
            )}
        </div>
    );
};

export default ProductAnalysis;