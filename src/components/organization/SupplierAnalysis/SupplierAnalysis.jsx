import React, { useEffect, useState, useCallback, useMemo } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Card, Typography, message, Row, Col, Select, Table, Switch } from 'antd';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title } = Typography;
const { Option } = Select;

const SupplierAnalysis = () => {
    const [suppliersExpenditures, setSuppliersExpenditures] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('chart');

    const organization_id = localStorage.getItem('organization_id');

    const fetchSupplierExpenditures = useCallback(async () => {
        if (!organization_id) {
            message.error('Organization ID not found. Please log in again.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await HTTPService.get(`analysis/supplier-expenditures/`, {
                params: { organization_id, year: selectedYear }
            });

            const suppliersData = response.data;
            const totalAmountAll = suppliersData.reduce((acc, supplier) => acc + supplier.total_amount, 0);

            const suppliersWithPercentage = suppliersData.map(supplier => ({
                ...supplier,
                percentage: ((supplier.total_amount / totalAmountAll) * 100).toFixed(2)
            }));

            setSuppliersExpenditures(suppliersWithPercentage);
        } catch (error) {
            console.error('Error fetching supplier expenditures:', error.message);
            message.error('Failed to fetch supplier expenditures.');
        } finally {
            setIsLoading(false);
        }
    }, [organization_id, selectedYear]);

    useEffect(() => {
        fetchSupplierExpenditures();
    }, [fetchSupplierExpenditures]);

    const handleYearChange = useCallback((value) => {
        setSelectedYear(value);
    }, []);

    const chartData = useMemo(() => {
        if (!suppliersExpenditures.length) return null;

        const labels = suppliersExpenditures.map(supplier => supplier.supplier_name);
        const data = suppliersExpenditures.map(supplier => supplier.total_amount);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Supplier Expenditures',
                    data: data,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#8E5EA2', '#FF7F50', '#20B2AA', '#87CEEB',
                        // Add more colors if needed
                    ],
                },
            ],
        };
    }, [suppliersExpenditures]);

    const columns = useMemo(() => [
        {
            title: '#',
            key: 'index',
            render: (_, __, index) => index + 1
        },
        {
            title: 'Supplier Name',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount) => `$${amount.toFixed(2)}`,
            sorter: (a, b) => a.total_amount - b.total_amount,
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (percentage) => `${percentage}%`,
            sorter: (a, b) => parseFloat(a.percentage) - parseFloat(b.percentage),
        },
    ], []);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 5 }, (_, i) => currentYear - i);
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '20px', textAlign: 'center' }}>Supplier Expenditures Analysis</Title>
            <Row gutter={[16, 16]} justify="end" align="middle">
                <Col xs={24} md={8}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select a year"
                        onChange={handleYearChange}
                        value={selectedYear}
                    >
                        {years.map(year => (
                            <Option key={year} value={year.toString()}>{year}</Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                    <Switch
                        checkedChildren="Chart"
                        unCheckedChildren="Table"
                        checked={viewMode === 'chart'}
                        onChange={(checked) => setViewMode(checked ? 'chart' : 'table')}
                    />
                </Col>
            </Row>

            <Card 
                title={`Supplier Expenditures ${viewMode === 'chart' ? 'Chart' : 'Table'}`} 
                style={{ marginTop: '20px' }}
                loading={isLoading}
            >
                {viewMode === 'chart' && chartData && (
                    <div style={{ height: '400px' }}>
                        <Pie 
                            data={chartData} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const label = context.label || '';
                                                const value = context.raw || 0;
                                                const percentage = suppliersExpenditures[context.dataIndex].percentage;
                                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                )}

                {viewMode === 'table' && (
                    <Table
                        dataSource={suppliersExpenditures}
                        columns={columns}
                        pagination={false}
                        rowKey="supplier_name"
                    />
                )}
            </Card>
        </div>
    );
};

export default SupplierAnalysis;