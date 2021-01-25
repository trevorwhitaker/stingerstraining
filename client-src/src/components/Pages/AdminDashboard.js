import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { Combobox } from 'react-widgets';
import BootstrapTable from 'react-bootstrap-table-next';

import { SkeletonPlaceholder } from 'carbon-components-react';

import util from '../../util/utils';
import constants from '../../util/constants';

import './AdminDashboard.scss';

const AdminDashboard = () => {
  const [categories, setCategories] = useState(null);

  const [isLoggedin, setIsLoggedin] = useState(null);
  const [categoryLabel, setCategoryLabel] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [drillName, setDrillName] = useState('');
  const [drillDesc, setDrillDesc] = useState('');
  const [drillVideoFile, setDrillVideoFile] = useState(null);

  const [users, setUsers] = useState({});
  const [processedTableData, setProcessedTableData] = useState();

  const [drillUploadSuccess, setDrillUploadSuccess] = useState(null);
  const [drillUploadError, setDrillUploadError] = useState(null);
  const [drillUploadWait, setDrillUploadWait] = useState(false);
  const [categoryUploadSuccess, setCategoryUploadSuccess] = useState(null);
  const [categoryUploadError, setCategoryUploadError] = useState(null);
  const [categoryUploadWait, setCategoryUploadWait] = useState(false);

  useEffect(() => {
    // Check for loggin state, then get category data for checkbox selection
    // TODO: Add admin role check for ui?
    const check = async () => {
      const isLoggedin = await util.checkLogin();
      setIsLoggedin(isLoggedin);

      if (isLoggedin) {
        const navdata = await util.getCategories();
        setCategories(
          navdata.map((category) => {
            return { label: category.label, checked: false };
          })
        );

        const userlist = await util.getUserList();
        setUsers(userlist);
      }
    };
    check();
  }, []);

  // Validate drill data before enabling submit button
  const validateDrillForm = () => {
    return (
      drillName.length > 0 &&
      drillDesc.length > 0 &&
      categories.some((category) => {
        return category.checked;
      }) &&
      drillVideoFile
    );
  };

  // Validate category data before enabling submit button
  const validateCategoryForm = () => {
    return (
      categoryLabel.length > 0 &&
      categoryValue.length > 0 &&
      categoryDesc.length > 0
    );
  };

  // submit data to create a new category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategoryUploadWait(true);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        label: categoryLabel,
        value: categoryValue,
        description: categoryDesc,
      }),
    };

    setTimeout(async () => {
      const response = await fetch(constants.createCategoryEndpoint, options);
      if (response) {
        const resObj = await response.json();
        if (response.ok) {
          setCategoryUploadSuccess(true);
        } else {
          setCategoryUploadSuccess(false);
          setCategoryUploadError(resObj?.msg);
        }
      } else {
        setCategoryUploadError('no response');
        setCategoryUploadSuccess(false);
      }

      setCategoryUploadWait(false);
    }, 1500);
  };

  // submit data to create a new drill
  const handleDrillSubmit = async (e) => {
    e.preventDefault();
    setDrillUploadWait(true);

    const formData = new FormData();

    formData.append('video', drillVideoFile);
    formData.append('name', drillName);
    formData.append('description', drillDesc);
    formData.append(
      'categories',
      categories
        .filter((category) => {
          return category.checked;
        })
        .map((category) => {
          return category.label.toLowerCase();
        })
    );

    const options = {
      method: 'POST',
      headers: {},
      body: formData,
    };

    setTimeout(async () => {
      const response = await fetch(constants.createDrillEndpoint, options);
      if (response) {
        const resObj = await response.json();
        if (response.ok) {
          setDrillUploadSuccess(true);
          setDrillName('');
          setDrillDesc('');
          setDrillVideoFile(null);
          setCategories(
            categories.map((category) => {
              return {
                label: category.label,
                checked: false,
              };
            })
          );
        } else {
          setDrillUploadSuccess(false);
          setDrillUploadError(resObj?.msg);
        }
      } else {
        setDrillUploadError('no response');
        setDrillUploadSuccess(false);
      }

      setDrillUploadWait(false);
    }, 1500);
  };

  // update state tracking which category is selected for new drill creation
  const handleCheckboxSelect = (e, label) => {
    const isChecked = e.target.checked;
    setCategories(
      categories.map((category) => {
        return {
          label: category.label,
          checked: category.label === label ? isChecked : category.checked,
        };
      })
    );
  };

  const handleResetCategory = () => {
    setCategoryUploadError(null);
    setCategoryUploadSuccess(null);
    setCategoryUploadWait(false);
  };

  const handleResetDrill = () => {
    setDrillUploadError(null);
    setDrillUploadSuccess(null);
    setDrillUploadWait(false);
  };

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
      dataField: 'count',
      text: 'Count',
      sort: true,
    },
    {
      dataField: 'description',
      text: 'Type',
      sort: true,
    },
    {
      dataField: 'sets',
      text: 'Sets',
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

            userData.forEach((data) => {
              const { drill, records } = data;
              records.forEach((record) => {
                const dateString = new Date(record.date).toLocaleDateString();

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

            setProcessedTableData(processedRecords);
          }
        }}
      />
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
