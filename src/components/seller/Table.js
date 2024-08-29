// src/components/Table.js
import React from 'react';
import styled from 'styled-components';

const TableWrapper = styled.div`
  margin-top: 20px;
`;

const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #3e4162;
`;

const TableHeader = styled(TableRow)`
  font-weight: bold;
`;

const TableCell = styled.div`
  flex: 1;
  text-align: left;
`;

const Table = () => (
    <TableWrapper>
        <TableHeader>
            <TableCell>Products</TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Customer name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Action</TableCell>
        </TableHeader>
        <TableRow>
            <TableCell>Iphone 13 Pro</TableCell>
            <TableCell>#11232</TableCell>
            <TableCell>Jun 29, 2022</TableCell>
            <TableCell>Afaq Karim</TableCell>
            <TableCell style={{ color: 'green' }}>Delivered</TableCell>
            <TableCell>$400.00</TableCell>
            <TableCell>...</TableCell>
        </TableRow>
        {/* Add more rows as needed */}
    </TableWrapper>
);

export default Table;
