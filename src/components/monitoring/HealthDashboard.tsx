import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Select,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

interface LogStats {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  errorRates: Record<string, number>;
  requestsByEndpoint: Record<string, number>;
  requestsByMethod: Record<string, number>;
}

const HealthDashboard = () => {
  const [dateRange, setDateRange] = useState([0, 30]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [stats, setStats] = useState<LogStats | null>(null);

  // Color scheme
  const bgColor = useColorModeValue('white', 'gray.800');
  const successColor = 'green.500';
  const errorColor = 'red.500';
  const warningColor = 'orange.500';
  const infoColor = 'blue.500';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = format(subDays(new Date(), dateRange[1]), 'yyyy-MM-dd');
        const endDate = format(subDays(new Date(), dateRange[0]), 'yyyy-MM-dd');

        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch stats
        const statsResponse = await fetch(
          `/api/monitoring/stats?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch logs with filters
        // Fetch logs for future use if needed
        await fetch(
          `/api/monitoring/logs?startDate=${startDate}&endDate=${endDate}${
            filterLevel !== 'all' ? `&level=${filterLevel}` : ''
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error('Error fetching monitoring data:', error);
      }
    };

    fetchData();
  }, [dateRange, filterLevel]);

  interface StatCardProps {
    label: string;
    value: string | number;
    helpText: string;
    color?: string;
  }

  const StatCard = ({ label, value, helpText, color }: StatCardProps) => (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor}>
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber color={color}>{value}</StatNumber>
        <StatHelpText>{helpText}</StatHelpText>
      </Stat>
    </Box>
  );

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">System Health Dashboard</Heading>
          <Select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            width="200px"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </Select>
        </HStack>

        <Box>
          <Text mb={2}>Date Range (Last {dateRange[1]} days)</Text>
          <RangeSlider
            defaultValue={dateRange}
            min={0}
            max={30}
            onChange={(val) => setDateRange(val)}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
        </Box>

        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {stats && (
            <>
              <StatCard
                label="Total Requests"
                value={stats.totalRequests}
                helpText="Last 24 hours"
                color={infoColor}
              />
              <StatCard
                label="Success Rate"
                value={`${((stats.successCount / stats.totalRequests) * 100).toFixed(1)}%`}
                helpText={`${stats.successCount} successful requests`}
                color={successColor}
              />
              <StatCard
                label="Error Rate"
                value={`${((stats.errorCount / stats.totalRequests) * 100).toFixed(1)}%`}
                helpText={`${stats.errorCount} failed requests`}
                color={errorColor}
              />
              <StatCard
                label="Avg Response Time"
                value={`${stats.averageResponseTime.toFixed(2)}ms`}
                helpText="Across all endpoints"
                color={warningColor}
              />
            </>
          )}
        </Grid>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor}>
            <Heading size="md" mb={4}>Request Distribution</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(stats?.requestsByEndpoint || {}).map(([key, value]) => ({
                name: key,
                requests: value
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill={infoColor} />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor}>
            <Heading size="md" mb={4}>Error Distribution</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={Object.entries(stats?.errorRates || {}).map(([key, value]) => ({
                name: key,
                errors: value
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="errors" stroke={errorColor} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </VStack>
    </Box>
  );
};

export default HealthDashboard;
