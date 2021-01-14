import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
        'Content-Type': 'application/json'
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
      headers: {
      },
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
                checked: false
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

  return (
    <div>
      <h1>Coolio</h1>
    </div>
  );
};

export default AdminDashboard;
