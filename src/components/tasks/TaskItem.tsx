import {
  Box,
  Checkbox,
  HStack,
  VStack,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useTask } from '../../contexts/useTask';

import type { Task } from '../../contexts/TaskContext.types';

interface TaskItemProps {
  task: Task;
  isAdmin: boolean;
}

const TaskItem = ({ task, isAdmin }: TaskItemProps) => {
  const { updateTask, deleteTask } = useTask();
  const toast = useToast();

  const handleToggleComplete = async () => {
    try {
      await updateTask(task.id, { status: task.status === 'DONE' ? 'TODO' : 'DONE' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius={8} bg={isAdmin ? 'blue.50' : 'white'}>
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <Checkbox
              isChecked={task.status === 'DONE'}
              onChange={handleToggleComplete}
            />
            <Box>
              <Text
                fontSize="lg"
                textDecoration={task.status === 'DONE' ? 'line-through' : 'none'}
              >
                {task.title}
              </Text>
              <Text color="gray.600">{task.description}</Text>
            </Box>
          </HStack>
          <HStack>
            {isAdmin && (
              <IconButton
                aria-label="Edit task"
                icon={<EditIcon />}
                onClick={() => {/* Add edit functionality */}}
                colorScheme="blue"
                variant="ghost"
              />
            )}
            <IconButton
              aria-label="Delete task"
              icon={<DeleteIcon />}
              onClick={handleDelete}
              colorScheme="red"
              variant="ghost"
            />
          </HStack>
        </HStack>
        {isAdmin && (
          <Box borderTopWidth={1} pt={2}>
            <Text fontSize="sm" color="gray.600">
              Task ID: {task.id}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default TaskItem;
