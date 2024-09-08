import React, { useState, useEffect, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Input, Button, Avatar, Typography, message, Layout, Badge } from 'antd';
import { SendOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Element, animateScroll as scroll } from 'react-scroll';

const { Text } = Typography;
const { Content } = Layout;

// Styled Components
const ChatLayout = styled(Layout)`
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const ChatContent = styled(Content)`
  padding: 24px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  height: 80vh;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ChatSidebar = styled.div`
  width: 250px;
  background-color: ${props => props.theme.colors.sidebarBackground};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
`;

const SidebarTitle = styled.h2`
  padding: 20px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const AdminList = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`;

const AdminItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }

  &.selected {
    background-color: ${props => props.theme.colors.selected};
  }
`;

const AdminInfo = styled.div`
  margin-left: 12px;
  flex-grow: 1;
`;

const ChatMain = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: ${props => props.theme.colors.headerBackground};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  .ant-avatar {
    margin-right: 12px;
  }
`;

const MessagesContainer = styled(Element)`
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px;
`;

const Message = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.sent ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  background-color: ${props => props.sent ? props.theme.colors.primary : props.theme.colors.messageBackground};
  color: ${props => props.sent ? '#fff' : props.theme.colors.text};
  border-bottom-right-radius: ${props => props.sent ? '4px' : '18px'};
  border-bottom-left-radius: ${props => props.sent ? '18px' : '4px'};
`;

const Timestamp = styled.span`
  font-size: 11px;
  color: ${props => props.theme.colors.timestampText};
  margin-top: 4px;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background-color: ${props => props.theme.colors.inputBackground};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ChatInput = styled(Input)`
  flex-grow: 1;
  margin-right: 16px;
  border-radius: 20px;
`;

const SendButton = styled(Button)`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  .anticon {
    font-size: 18px;
  }
`;

// Define a theme with nice colors
const theme = {
  colors: {
    primary: '#4a90e2',
    background: '#f4f7f9',
    text: '#2c3e50',
    sidebarBackground: '#ffffff',
    headerBackground: '#ffffff',
    inputBackground: '#ffffff',
    border: '#e1e8ed',
    hover: '#f5f8fa',
    selected: '#e6f7ff',
    messageBackground: '#f1f0f0',
    timestampText: '#7f8c8d',
  },
};

const UserChat = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [ws, setWs] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [newMessageNotification, setNewMessageNotification] = useState({});
    const messagesEndRef = useRef(null);

    const organizationId = localStorage.getItem('organization_id');

    useEffect(() => {
        fetchAdmins();
    }, []);

    useEffect(() => {
        const fetchChatHistory = async (adminId) => {
            try {
                const response = await axios.get(`https://synthinvoice.azurewebsites.net/chat/history/${adminId}/${organizationId}/organization/`);
                setMessages(response.data);
                const newWs = new WebSocket(`ws://synthinvoice.azurewebsites.net//ws/chat/admin/${adminId}/organization/${organizationId}/`);
                setWs(newWs);
            } catch (error) {
                console.error('Error fetching chat history:', error);
                message.error('Failed to fetch chat history.');
            }
        };

        if (selectedAdmin) {
            fetchChatHistory(selectedAdmin.id);
            setNewMessageNotification(prev => ({ ...prev, [selectedAdmin.id]: false }));
        }
    }, [selectedAdmin, organizationId]);

    useEffect(() => {
        if (ws) {
            ws.onopen = () => {
                console.log('WebSocket Connected');
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages(prevMessages => [...prevMessages, data]);
                if (data.user_role !== 'organization') {
                    setNewMessageNotification(prev => ({ ...prev, [selectedAdmin.id]: true }));
                }
                scrollToBottom();
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                message.error('Failed to connect to chat server.');
            };

            return () => {
                if (ws) ws.close();
            };
        }
    }, [ws, selectedAdmin]);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get('https://synthinvoice.azurewebsites.net/chat/admin-list/');
            const sortedAdmins = response.data.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
            setAdmins(sortedAdmins);
        } catch (error) {
            console.error('Error fetching admins:', error);
            message.error('Failed to fetch admins.');
        }
    };

    const sendMessage = () => {
        if (ws && messageInput.trim() !== '' && selectedAdmin) {
            const messageObject = {
                content: messageInput,
                sender_id: organizationId
            };
            ws.send(JSON.stringify(messageObject));
            setMessageInput('');
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        scroll.scrollToBottom({
            containerId: 'messages-container',
            duration: 250,
            delay: 0,
            smooth: 'easeInOutQuint'
        });
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { 
            hour: 'numeric', 
            minute: 'numeric',
            hour12: true,
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <ChatLayout>
                <ChatContent>
                    <ChatContainer>
                        <ChatSidebar>
                            <SidebarTitle>Chat with Admin</SidebarTitle>
                            <AdminList>
                                {admins.map(admin => (
                                    <AdminItem 
                                        key={admin.id} 
                                        onClick={() => setSelectedAdmin(admin)}
                                        className={selectedAdmin && selectedAdmin.id === admin.id ? 'selected' : ''}
                                    >
                                        <Badge dot={newMessageNotification[admin.id]}>
                                            <Avatar icon={<UserOutlined />} />
                                        </Badge>
                                        <AdminInfo>
                                            <Text strong>{admin.user.username}</Text>
                                            <Text type="secondary">{admin.user.email}</Text>
                                        </AdminInfo>
                                    </AdminItem>
                                ))}
                            </AdminList>
                        </ChatSidebar>
                        <ChatMain>
                            <ChatHeader>
                                {selectedAdmin && (
                                    <>
                                        <div>
                                            <Avatar icon={<UserOutlined />} />
                                            <Text strong>{selectedAdmin.user.username}</Text>
                                        </div>
                                        <Badge count={newMessageNotification[selectedAdmin.id] ? 1 : 0}>
                                            <BellOutlined style={{ fontSize: '20px', color: theme.colors.primary }} />
                                        </Badge>
                                    </>
                                )}
                            </ChatHeader>
                            <MessagesContainer id="messages-container">
                                {messages.map((msg, index) => (
                                    <Message key={index} sent={msg.user_role === 'organization'}>
                                        <MessageContent sent={msg.user_role === 'organization'}>
                                            {msg.content}
                                        </MessageContent>
                                        <Timestamp>{formatTimestamp(msg.timestamp)}</Timestamp>
                                    </Message>
                                ))}
                                <div ref={messagesEndRef} />
                            </MessagesContainer>
                            <InputArea>
                                <ChatInput
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onPressEnter={sendMessage}
                                    placeholder="Type a message"
                                    disabled={!selectedAdmin}
                                />
                                <SendButton 
                                    type="primary" 
                                    icon={<SendOutlined />} 
                                    onClick={sendMessage}
                                    disabled={!selectedAdmin}
                                />
                            </InputArea>
                        </ChatMain>
                    </ChatContainer>
                </ChatContent>
            </ChatLayout>
        </ThemeProvider>
    );
};

export default UserChat;
