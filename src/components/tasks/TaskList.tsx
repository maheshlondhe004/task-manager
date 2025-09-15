import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  useDisclosure,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useTask } from '@/contexts/useTask';
import { useAuth } from '@/contexts/useAuth';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

const TaskList = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks } = useTask();
  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const loadTasks = async () => {
      try {
        await fetchTasks();
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch tasks',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    
    loadTasks();
  }, [fetchTasks, toast]);

  const handleLogout = () => {
    logout();
  };

  return (
    <Container maxW="container.md" py={8} minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={0}>
            <Heading>Task Manager</Heading>
            <Text color="gray.600">
              Logged in as {user?.firstName} {user?.lastName} ({user?.role})
            </Text>
          </VStack>
          <Button onClick={handleLogout} colorScheme="red">
            Logout
          </Button>
        </HStack>

        {/* Admin Actions */}
        {isAdmin && (
          <Box bg="blue.50" p={4} borderRadius="md">
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Admin Dashboard</Heading>
              <HStack>
                <Button 
                  colorScheme="purple"
                  onClick={() => navigate('/users')}
                >
                  Manage Users
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Task Management */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Tasks</Heading>
            <Button onClick={onOpen} colorScheme="blue">
              Add New Task
            </Button>
          </HStack>

          <TaskForm isOpen={isOpen} onClose={onClose} />

          <VStack spacing={4} align="stretch">
            {tasks.length === 0 ? (
              <Text>No tasks found</Text>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isAdmin={isAdmin}
                />
              ))
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default TaskList;
