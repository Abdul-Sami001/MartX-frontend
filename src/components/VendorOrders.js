// components/VendorOrders.js
import React, { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Select,
    Button,
    useToast,
} from '@chakra-ui/react';
import useVendorOrderStore from '../stores/vendorOrderStore';

const VendorOrders = () => {
    const { orders, loading, fetchVendorOrders, updateOrderStatus } = useVendorOrderStore();
    const [selectedStatus, setSelectedStatus] = useState({});
    const toast = useToast();
    const token = localStorage.getItem('access_token'); // Assuming you're storing the JWT token in localStorage

    useEffect(() => {
        fetchVendorOrders(token);
    }, [fetchVendorOrders, token]);

    const handleStatusChange = (orderId, value) => {
        setSelectedStatus((prevStatus) => ({ ...prevStatus, [orderId]: value }));
    };

    const handleUpdateStatus = async (orderId) => {
        const status = selectedStatus[orderId];
        if (!status) {
            toast({
                title: 'Error',
                description: 'Please select a status before updating',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        await updateOrderStatus(orderId, status, token);
        toast({
            title: 'Success',
            description: 'Order status updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    if (loading) {
        return <Spinner size="xl" />;
    }

    return (
        <Box maxW="800px" mx="auto" p="6">
            <Heading as="h2" size="lg" textAlign="center" mb="6">
                Vendor Orders
            </Heading>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Order ID</Th>
                        <Th>Customer</Th>
                        <Th>Status</Th>
                        <Th>Update Status</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {orders.map((order) => (
                        <Tr key={order.id}>
                            <Td>{order.id}</Td>
                            <Td>{order.customer}</Td>
                            <Td>{order.payment_status}</Td>
                            <Td>
                                <Select
                                    placeholder="Select status"
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    value={selectedStatus[order.id] || ''}
                                >
                                    <option value="P">Pending</option>
                                    <option value="C">Complete</option>
                                    <option value="F">Failed</option>
                                </Select>
                                <Button
                                    colorScheme="blue"
                                    mt="2"
                                    onClick={() => handleUpdateStatus(order.id)}
                                >
                                    Update
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default VendorOrders;
