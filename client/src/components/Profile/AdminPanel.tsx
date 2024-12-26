// src/components/AdminPanel.tsx
import React, { useState } from "react";
import { Button, Card, List, Collapse, message, Popconfirm } from "antd";
import UserService from "../../services/UserService";
import { IUser } from "../../models/IUser";

const { Panel } = Collapse;

interface AdminPanelProps {
  users: IUser[];
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, setUsers }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users
  const getUsers = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
      message.success("Users successfully fetched!");
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  };

  // Block user
  const handleBlockUser = async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await UserService.toggleBlock(userId.toString()); // Convert to string
      message.success(`User ${userId} has been blocked`);
      getUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error blocking user:", error);
      message.error("Failed to block user.");
    } finally {
      setIsLoading(false);
    }
  };

  // Unblock user
  const handleUnblockUser = async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await UserService.toggleUnblock(userId.toString()); // Convert to string
      message.success(`User ${userId} has been unblocked`);
      getUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error unblocking user:", error);
      message.error("Failed to unblock user.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card title="Admin Panel" className="mt-4">
      <Collapse defaultActiveKey={['1']}>
        <Panel header="User List" key="1">
          <Button type="primary" onClick={getUsers} className="mb-3" loading={isLoading}>
            Fetch All Users
          </Button>
          {users.length > 0 ? (
            <List
              bordered
              dataSource={users}
              renderItem={(user) => (
                <List.Item key={user.email}>
                  <strong>{user.username}</strong> - {user.email}
                  <div style={{ marginLeft: "auto" }}>
                    {user.isBlocked ? (
                      <Popconfirm
                        title={`Are you sure you want to unblock this user?`}
                        onConfirm={() => handleUnblockUser(user.id)} // Pass userId as number
                      >
                        <Button type="link">Unblock</Button>
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title={`Are you sure you want to block this user?`}
                        onConfirm={() => handleBlockUser(user.id)} // Pass userId as number
                      >
                        <Button type="link">Block</Button>
                      </Popconfirm>
                    )}
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div>No users available</div>
          )}
        </Panel>
      </Collapse>
    </Card>
  );
};

export default AdminPanel;
