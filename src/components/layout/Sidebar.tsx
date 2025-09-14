import { Box, VStack, Button, Text, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { ReactElement } from 'react';

interface NavItemProps {
  to: string;
  icon?: ReactElement;
  children: React.ReactNode;
}

const NavItem = ({ to, icon, children }: NavItemProps) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Button
      as={RouterLink}
      to={to}
      variant="ghost"
      justifyContent="flex-start"
      width="full"
      p={4}
      borderRadius="md"
      _hover={{ bg: bgColor }}
      leftIcon={icon}
    >
      {children}
    </Button>
  );
};

const Sidebar = () => {
  const { user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      width="250px"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      height="100vh"
      position="fixed"
      left={0}
      top={0}
      p={4}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Task Manager
        </Text>

        <NavItem to="/tasks">
          Tasks
        </NavItem>

        {user?.role === 'ADMIN' && (
          <>
            <NavItem to="/users">
              Users
            </NavItem>

            <NavItem to="/health">
              System Health
            </NavItem>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default Sidebar;
