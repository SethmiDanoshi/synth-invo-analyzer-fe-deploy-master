import React, { useState, useEffect, useCallback } from "react";
import { Layout, Button, Table, message, Popconfirm } from "antd";
import HTTPService from "../../../Service/HTTPService";
import moment from "moment";

const { Content } = Layout;

const ViewArchivedInvoices = () => {
  const [archivedInvoices, setArchivedInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const organization_id = localStorage.getItem('organization_id')

  // Function to fetch archived invoices
  const fetchArchivedInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await HTTPService.get(`invoice/archived-invoices/${organization_id}/`);
      if (response.status === 200) {
        setArchivedInvoices(response.data);
      } else {
        message.error("Failed to fetch archived invoices. Please try again.");
      }
    } catch (error) {
      message.error("Failed to fetch archived invoices. Please try again.");
      console.error("Error fetching archived invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [organization_id]);

  // Function to restore an archived invoice
  const restoreInvoice = useCallback(async (invoiceId) => {
    setLoading(true);
    try {
      const response = await HTTPService.post(`invoice/restore-invoice/${invoiceId}/${organization_id}/`);
      if (response.status === 200) {
        message.success("Invoice restored successfully.");
        fetchArchivedInvoices();
      } else {
        message.error("Failed to restore invoice. Please try again.");
      }
    } catch (error) {
      message.error("Failed to restore invoice. Please try again.");
      console.error("Error restoring invoice:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchArchivedInvoices, organization_id]);

  
  const deleteInvoice = useCallback(async (invoiceId) => {
    setLoading(true);
    try {
      const response = await HTTPService.delete(`invoice/delete-invoice/${invoiceId}/${organization_id}/`);
      if (response.status === 200) {
        message.success("Invoice deleted successfully.");
        fetchArchivedInvoices();
      } else {
        message.error("Failed to delete invoice. Please try again.");
      }
    } catch (error) {
      message.error("Failed to delete invoice. Please try again.");
      console.error("Error deleting invoice:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchArchivedInvoices, organization_id]);

  // Fetch archived invoices on component mount and when fetchArchivedInvoices changes
  useEffect(() => {
    fetchArchivedInvoices();
  }, [fetchArchivedInvoices]); // Include fetchArchivedInvoices in the dependency array

  // Columns configuration for Ant Design Table component
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
          <Button type="link" onClick={() => restoreInvoice(record.id)}>
            Restore
          </Button>
          <Popconfirm
            title="Are you sure to delete this invoice?"
            onConfirm={() => deleteInvoice(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "20px" }}>
        <h1>Archived Invoices</h1>
        <Table
          columns={columns}
          dataSource={archivedInvoices}
          rowKey="id"
          loading={loading}
        />
      </Content>
    </Layout>
  );
};

export default ViewArchivedInvoices;
