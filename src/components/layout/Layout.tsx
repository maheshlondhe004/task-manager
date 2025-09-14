import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Flex height="100vh">
      <Sidebar />
      <Box flex={1} ml="250px" p={8}>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
