// src/components/Sidebar.js
import React from 'react';
import styled from 'styled-components';

const SidebarWrapper = styled.div`
  background-color: #1f2235;
  width: 250px;
  height: 100vh;
  padding: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

const SidebarItem = styled.div`
  margin: 15px 0;
  cursor: pointer;

  &:hover {
    color: #3498db;
  }
`;

const Sidebar = () => (
    <SidebarWrapper>
        <h2>DUKAAN</h2>
        <SidebarItem>Dashboard</SidebarItem>
        <SidebarItem>Statistics</SidebarItem>
        <SidebarItem>Payment</SidebarItem>
        {/* Add more items as needed */}
    </SidebarWrapper>
);

export default Sidebar;
