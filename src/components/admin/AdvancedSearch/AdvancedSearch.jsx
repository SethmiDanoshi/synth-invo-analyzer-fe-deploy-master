
import React, { useState, useEffect } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Card, Row, Col, Select, Input, Button, message, DatePicker } from 'antd';


const { Option } = Select;

const AdvancedSearch = () => {
    const [query, setQuery] = useState({});
    const [builtQuery, setBuiltQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await HTTPService.post('search/execute-search/', { query: JSON.parse(builtQuery) });
            setSearchResults(response.data);
            message.success('Search results fetched successfully.');
        } catch (error) {
            console.error('Error fetching search results:', error);
            message.error('Failed to fetch search results.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setQuery(prev => ({ ...prev, [field]: value }));
    };

    const handleBuiltQueryChange = (e) => {
        setBuiltQuery(e.target.value);
    };

    useEffect(() => {
        const buildQuery = async () => {
            try {
                const response = await HTTPService.post('search/build-query/', { params: query });
                setBuiltQuery(JSON.stringify(response.data.query, null, 2));
            } catch (error) {
                console.error('Error building query:', error);
                message.error('Failed to build query.');
            }
        };

        buildQuery();
    }, [query]);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Card title="Advanced Search" style={{ marginBottom: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Enter Supplier Name"
                            onChange={e => handleInputChange('supplier_name', e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Start Date"
                            onChange={(date, dateString) => handleInputChange('start_date', dateString)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="End Date"
                            onChange={(date, dateString) => handleInputChange('end_date', dateString)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Enter Invoice Number"
                            onChange={e => handleInputChange('invoice_number', e.target.value)}
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Currency"
                            onChange={value => handleInputChange('currency', value)}
                        >
                            <Option value="USD">USD</Option>
                            <Option value="EUR">EUR</Option>
                            <Option value="GBP">GBP</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Min Price"
                            type="number"
                            onChange={e => handleInputChange('total_amount_min', e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Max Price"
                            type="number"
                            onChange={e => handleInputChange('total_amount_max', e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Item Description"
                            onChange={e => handleInputChange('item_description', e.target.value)}
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24}>
                        <Card
                            title="Constructed Query"
                            style={{ backgroundColor: '#f0f2f5', marginBottom: '20px' }}
                        >
                            <Input.TextArea
                                value={builtQuery}
                                onChange={handleBuiltQueryChange}
                                rows={12}
                                style={{ fontFamily: 'monospace' }}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24}>
                        <Button type="primary" onClick={handleSearch} loading={loading}>
                            Search
                        </Button>
                    </Col>
                </Row>
            </Card>
            <Card title="Search Results">
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {JSON.stringify(searchResults, null, 2)}
                </pre>
            </Card>
        </div>
    );
};

export default AdvancedSearch;