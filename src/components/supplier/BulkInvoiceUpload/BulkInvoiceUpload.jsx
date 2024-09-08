import React, { useState, useRef, useEffect } from "react";
import HTTPService from '../../../Service/HTTPService';
import { Button, Upload as AntUpload, notification, Select, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "./BulkInvoiceUpload.css"; 

const { Dragger } = AntUpload;
const { Option } = Select;

function BulkInvoiceUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [recipient, setRecipient] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);


  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("supplier_id");
      try {
        const response = await HTTPService.get(`auth/get-org-by-sup/`,{
          params :{
            supplier_id : userId
          }
      });
        setOrganizations(response.data.organizations);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
    setUploadDisabled(files.length === 0);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("source_invoice", file);
    });
    formData.append("supplier_id", localStorage.getItem("supplier_id"));
    formData.append("organization_id", recipient);

    try {
      const token = localStorage.getItem("token");
      const response = await HTTPService.post("invoice/bulk-upload-invoices/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        notification.success({
          message: "Upload Successful",
          duration: 3,
        });
        setSelectedFiles([]);
        setUploadDisabled(true);
      } else {
        notification.error({
          message: "Upload Failed",
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: "Your invoice is not acceptable. Please contact admin.",
        duration: 3,
      });
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setUploadDisabled(false);
  };

  const handleRecipientChange = (value) => {
    setRecipient(value);
  };

  const downloadTemplate = () => {
    // Logic to download the template
    window.open("/path/to/template", "_blank");
  };

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  return (
    <div className="bulk-invoice-upload-container">
      <Button type="primary" className="download-template-button" onClick={downloadTemplate}>
        Download Template
      </Button>
      <div className="bulk-invoice-upload-content">
        <h1 className="bulk-invoice-upload-title">Upload Your Bulk Invoices</h1>
        <div
          className="upload-area"
          onClick={handleAreaClick}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={handleFileDrop}
        >
          <Dragger
            fileList={selectedFiles}
            onChange={(info) => {
              const { status } = info.file;
              if (status !== "uploading") {
                setSelectedFiles(info.fileList.map((file) => file.originFileObj));
                setUploadDisabled(false);
              }
            }}
          >
            <p className="ant-upload-drag-icon larger-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text larger-text">Drop files here or click to select</p>
          </Dragger>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=""
            onChange={handleFileInputChange}
            ref={fileInputRef}
          />
        </div>
        <div className="recipient-select larger-select">
          <Select
            placeholder="Select Recipient"
            style={{ width: 300 }}
            onChange={handleRecipientChange}
            value={recipient}
          >
            {organizations.map((org) => (
              <Option key={org.organization_id} value={org.organization_id}>
                {org.organization_name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="action-buttons">
          <Button type="primary" size="large" onClick={() => fileInputRef.current.click()}>
            Select Files
          </Button>
          <Button type="primary" size="large" onClick={handleUpload} disabled={uploadDisabled}>
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BulkInvoiceUpload;
