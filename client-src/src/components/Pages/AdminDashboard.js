import React, { useState, useEffect } from 'react';

import { Combobox } from 'react-widgets';
import BootstrapTable from 'react-bootstrap-table-next';

import util from '../../util/utils';

import './AdminDashboard.scss';

const AdminDashboard = () => {
  const [users, setUsers] = useState({});
  const [currUserRecords, setCurrUserRecords] = useState();
  const [currDrillRecords, setCurrDrillRecords] = useState();
  const [processedTableData, setProcessedTableData] = useState();
  const [availableDrills, setAvailableDrills] = useState();
  const [dateFilter, setDateFilter] = useState('All');
  const filterDatesValues = ["All", "Past 30 days", "Past 7 days"];

  useEffect(() => {
    // Check for loggin state, then get category data for checkbox selection
    // TODO: Add admin role check for ui?
    const check = async () => {
      const isLoggedin = await util.checkLogin();
      if (isLoggedin) {
        const userlist = await util.getUserList();
        setUsers(userlist);
      }
    };
    check();
  }, []);

  const columns = [
    {
      dataField: 'date',
      text: 'Date',
      sort: true,
    },
    {
      dataField: 'drill',
      text: 'Drill',
      sort: true,
    },
    {
      dataField: 'sets',
      text: 'Sets',
      sort: true,
    },
    {
      dataField: 'count',
      text: 'Count',
      sort: true,
    },
    {
      dataField: 'description',
      text: 'Type',
      sort: true,
    },
  ];

  const defaultSorted = [{
    dataField: 'date',
    order: 'desc'
  }];
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Combobox
        data={users}
        valueField='_id'
        textField='username'
        onSelect={async (item) => {
          const userData = await util.getRecordsForUser(item._id);
          if (userData) {
            const processedRecords = [];
            let uniqueDrills = [];
            
            userData.forEach((data) => {
              const { drill, records } = data;
              records.forEach((record) => {
                const dateString = new Date(record.date).toISOString().substring(0, 10);

                if (!uniqueDrills.includes(drill.name)) {
                  uniqueDrills.push(drill.name);
                }

                processedRecords.push({
                  date: dateString,
                  sets: record.sets,
                  count: record.count,
                  description: record.description,
                  id: record.id,
                  drill: drill.name,
                  categories: drill.categories,
                });
              });
            });

            setCurrDrillRecords(processedRecords);
            setCurrUserRecords(processedRecords);
            setProcessedTableData(processedRecords);
            setAvailableDrills(uniqueDrills);
          }
        }}
      />
      <h2>Select drill to filter</h2>
      <Combobox
        data={availableDrills}
        valueField='_id'
        textField='drill'
        onSelect={async (item) => {
          let newDrills = [];
          if (currUserRecords) {
            currUserRecords.forEach((record) => {
              if (record.drill === item) {
                newDrills.push(record)
              }
            });
            setCurrDrillRecords(newDrills);
            setProcessedTableData(newDrills);
          }
        }}
      />
      <h2>Select Time Period</h2>
<Combobox
        data={filterDatesValues}
        value={dateFilter}
        onSelect={value => {
          let newRecords = [];
          if (currDrillRecords) {

            currDrillRecords.forEach((record) => {
              if (value === 'All') {
                newRecords.push(record);
              }
              else if (value === 'Past 30 days') {
                const target = new Date();
                target.setDate( target.getDate() - 30 );
                if (record.date > target.toISOString().substring(0, 10)) {
                  newRecords.push(record);
                }
              }
              else if (value === 'Past 7 days') {
                const target = new Date();
                target.setDate( target.getDate() - 7 );
                if (record.date > target.toISOString().substring(0, 10)) {
                  newRecords.push(record);
                }
              }
            });
            setProcessedTableData(newRecords);
          }

          setDateFilter(value);
        }}
      />
      <br></br>
      <div>
        {processedTableData?.length > 0 && <BootstrapTable
          bootstrap4
          keyField='id'
          data={processedTableData}
          columns={columns}
          defaultSorted={ defaultSorted }
        />}
      </div>
    </div>
  );
};

export default AdminDashboard;
