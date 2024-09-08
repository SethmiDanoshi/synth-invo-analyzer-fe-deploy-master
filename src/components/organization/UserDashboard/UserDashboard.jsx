import React, { useState, useEffect } from "react";
import { Layout, Input, Button, Table, Modal, message, DatePicker } from "antd";
import HTTPService from "../../../Service/HTTPService";
import moment from "moment";

const { Content } = Layout;

const UserDashboard = () => {
  const [query, setQuery] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [invoiceToArchive, setInvoiceToArchive] = useState(null);
  const organization_id = localStorage.getItem("organization_id");


  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const organization_id = localStorage.getItem("organization_id");
      const url = `search/search-invoices?organization_id=${organization_id}`;
      const response = await HTTPService.get(url);
      console.log(response.data);

      if (response.status === 200) {
        const extractedInvoices = response.data.map((item) => item._source);
        setInvoices(extractedInvoices);
      } else {
        message.error("Failed to fetch invoices. Please try again.");
        setInvoices([]);
      }
    } catch (error) {
      message.error("Failed to fetch invoices. Please try again.");
      setInvoices([]);
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = async () => {
    setLoading(true);
    try {
      const startDateString = startDate ? startDate.format("YYYY-MM-DD") : "";
      const endDateString = endDate ? endDate.format("YYYY-MM-DD") : "";

      let url = `search/search-invoices?organization_id=${organization_id}&query=${query}`;
      if (supplierName) url += `&supplier_name=${supplierName}`;
      if (startDateString) url += `&start_date=${startDateString}`;
      if (endDateString) url += `&end_date=${endDateString}`;

      const response = await HTTPService.get(url);

      if (response.status === 200) {
        const extractedInvoices = response.data.map((item) => item._source);
        setInvoices(extractedInvoices);
        console.log(invoices)
      } else {
        message.error("Failed to fetch invoices. Please try again.");
        setInvoices([]);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          message.error(data.error);
        } else if (status === 404) {
          message.error("No invoices found matching the search criteria");
          setInvoices([]);
        } else {
          message.error("Failed to fetch invoices. Please try again.");
          setInvoices([]);
        }
      } else {
        message.error("Network error. Please try again.");
        setInvoices([]);
      }
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchInvoices();
  }, []); 


  const showModal = (invoice) => {
    setSelectedInvoice(invoice);
    setModalVisible(true);
  };

 
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedInvoice(null);
  };


  const handleArchive = async () => {
    setLoading(true);
    try {
      const response = await HTTPService.put(`invoice/archive-invoice/${invoiceToArchive.original_invoice_id}/${organization_id}/`);
      if (response.status === 200) {
        message.success("Invoice archived successfully.");
        fetchInvoices();
      } else {
        message.error("Failed to archive invoice. Please try again.");
      }
    } catch (error) {
      message.error("Failed to archive invoice. Please try again.");
      console.error("Error archiving invoice:", error);
    } finally {
      setLoading(false);
      setArchiveModalVisible(false);
      setInvoiceToArchive(null);
    }
  };


  const columns = [
    {
      title: "#",
      dataIndex: "",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Invoice Number",
      dataIndex: "invoice_number",
      key: "invoice_number",
    },
    {
      title: "Invoice Date",
      dataIndex: "invoice_date",
      key: "invoice_date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Seller",
      dataIndex: ["seller", "company_name"],
      key: "seller",
      render: (text, record) => (
        <>
          <div>{record.seller?.company_name}</div>
          <div>{record.seller?.address?.city}</div>
        </>
      ),
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Total Amount",
      dataIndex: ["summary", "total_amount"],
      key: "total_amount",
      render: (text) => `${text}`,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            View Details
          </Button>
          <Button type="danger" onClick={() => { setArchiveModalVisible(true); setInvoiceToArchive(record); }}>
            Archive
          </Button>
        </>
      ),
    },
  ];

 
  const itemColumns = [
    {
      title: "#",
      dataIndex: "",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "20px" }}>
        <h1>Invoice Search</h1>
        <div style={{ marginBottom: "20px" }}>
          <Input
            placeholder="Enter product name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "200px", marginRight: "10px" }}
          />
          <Input
            placeholder="Enter supplier name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            style={{ width: "200px", marginRight: "10px" }}
          />
          <DatePicker
            placeholder="Start Date"
            style={{ marginRight: "10px" }}
            onChange={(date) => setStartDate(date)}
          />
          <DatePicker
            placeholder="End Date"
            style={{ marginRight: "10px" }}
            onChange={(date) => setEndDate(date)}
          />
          <Button type="primary" onClick={handleSearch} loading={loading}>
            Search
          </Button>
        </div>
        <Table columns={columns} dataSource={invoices} rowKey="_id" loading={loading} />
        <Modal
          title={`Invoice Details - ${selectedInvoice ? selectedInvoice.invoice_number : ""}`}
          visible={modalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
          ]}
        >
          {selectedInvoice && (
            <>
              <p>
                <strong>Invoice Date:</strong>{" "}
                {moment(selectedInvoice.invoice_date).format("YYYY-MM-DD")}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {moment(selectedInvoice.due_date).format("YYYY-MM-DD")}
              </p>
              <p>
                <strong>Currency:</strong> {selectedInvoice.currency}
              </p>
              <p>
                <strong>Seller:</strong> {selectedInvoice.seller?.company_name}
              </p>
              <p>
                <strong>Seller Address:</strong>{" "}
                {selectedInvoice.seller?.address?.street},{" "}
                {selectedInvoice.seller?.address?.city},{" "}
                {selectedInvoice.seller?.address?.country}
              </p>
              <p>
                <strong>Buyer:</strong> {selectedInvoice.buyer?.company_name}
              </p>
              <p>
                <strong>Buyer Address:</strong>{" "}
                {selectedInvoice.buyer?.address?.street},{" "}
                {selectedInvoice.buyer?.address?.city},{" "}
                {selectedInvoice.buyer?.address?.country}
              </p>
              <Table
                columns={itemColumns}
                dataSource={selectedInvoice.items}
                rowKey="_id"
                pagination={false}
              />
              <p>
                <strong>Total Amount:</strong>{" "}
                {selectedInvoice.summary?.total_amount}
              </p>
            </>
          )}
        </Modal>
        <Modal
          title="Confirm Archive"
          visible={archiveModalVisible}
          onCancel={() => setArchiveModalVisible(false)}
          onOk={handleArchive}
          okText="Yes, Archive"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to archive this invoice?</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default UserDashboard;
