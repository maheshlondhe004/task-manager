import type { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { UserProvider } from '@/contexts/UserContext';
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import TaskList from '@/components/tasks/TaskList';
import UserList from '@/components/admin/UserList';
import HealthDashboard from '@/components/monitoring/HealthDashboard';
import PrivateRoute from '@/components/common/PrivateRoute';
import AdminRoute from '@/components/common/AdminRoute';
import Layout from '@/components/layout/Layout';
import './App.css';

function App(): ReactElement {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <UserProvider>
            <TaskProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/tasks"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <TaskList />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <AdminRoute>
                      <Layout>
                        <UserList />
                      </Layout>
                    </AdminRoute>
                  }
                />
                <Route
                  path="/health"
                  element={
                    <AdminRoute>
                      <Layout>
                        <HealthDashboard />
                      </Layout>
                    </AdminRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/tasks" replace />} />
              </Routes>
            </TaskProvider>
          </UserProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
