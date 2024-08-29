// src/App.js
import React from 'react';
import styled from 'styled-components';
import Sidebar from '../components/seller/Sidebar';
import Card from '../components/seller/Card';
import Chart from '../components/seller/Chart';
import Table from '../components/seller/Table';

const DashboardWrapper = styled.div`
  display: flex;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #24263b;
`;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Dashboard = () => (
    <DashboardWrapper>
        <Sidebar />
        <ContentWrapper>
            <CardsWrapper>
                <Card title="Today's Sales">$20.4K</Card>
                <Card title="Today's Revenue">$8.2K</Card>
                <Card title="In Escrow">$18.2K</Card>
            </CardsWrapper>
            <Card title="Total Revenue">
                <Chart />
            </Card>
            <Card title="Latest Orders">
                <Table />
            </Card>
        </ContentWrapper>
    </DashboardWrapper>
);

export default Dashboard;
