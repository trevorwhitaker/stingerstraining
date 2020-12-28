import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { SkeletonPlaceholder } from 'carbon-components-react';

import util from '../../util/utils';
import constants from '../../util/constants';

import './Upload.scss';

const Upload = () => {
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
    <div className='upload-page'>
      {isLoggedin && (
        <>
          <div className='create-category'>
            {categoryUploadSuccess && (
              <div className='upload-success'>
                <div className='upload-success__message'>
                  Successfully added new category
                </div>
                <Button
                  block
                  size='lg'
                  type='reset'
                  onClick={handleResetCategory}
                >
                  Upload another
                </Button>
              </div>
            )}
            {categoryUploadError && (
              <div className='upload-error'>
                <div className='upload-error__message'>
                  Sorry there was an error: {categoryUploadError}
                </div>
                <Button
                  block
                  size='lg'
                  type='reset'
                  onClick={handleResetCategory}
                >
                  Try again
                </Button>
              </div>
            )}
            {categoryUploadWait && (
              <SkeletonPlaceholder className='loading-skeleton-category' />
            )}
            {!categoryUploadSuccess && !categoryUploadError && !categoryUploadWait && (
              <>
                <h3>
                  Create a category
                </h3>
                <div className='create-category__create-section'>
                  <Form onSubmit={(e) => handleCategorySubmit(e)}>
                    <Form.Group controlId='createCategory.categoryName'>
                      <Form.Label>Category label</Form.Label>
                      <Form.Control
                        as='input'
                        value={categoryLabel}
                        onChange={(e) => setCategoryLabel(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId='createCategory.categoryValue'>
                      <Form.Label>Category value</Form.Label>
                      <Form.Control
                        as='input'
                        value={categoryValue}
                        onChange={(e) => setCategoryValue(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId='createCategory.categoryDescription'>
                      <Form.Label>Category description</Form.Label>
                      <Form.Control
                        as='textarea'
                        rows={3}
                        value={categoryDesc}
                        onChange={(e) => setCategoryDesc(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      block
                      size='lg'
                      type='submit'
                      disabled={!validateCategoryForm()}
                    >
                      Create category
                    </Button>
                  </Form>
                </div>
              </>
            )}
          </div>
          <div className='create-drill'>
            {drillUploadSuccess && (
              <div className='upload-success'>
                <div className='upload-success__message'>
                  Successfully added new drill
                </div>
                <Button block size='lg' type='reset' onClick={handleResetDrill}>
                  Upload another
                </Button>
              </div>
            )}
            {drillUploadError && (
              <div className='upload-error'>
                <div className='upload-error__message'>
                  Sorry there was an error: {drillUploadError}
                </div>
                <Button
                  block
                  size='lg'
                  type='reset'
                  onClick={handleResetDrill}
                >
                  Try again
                </Button>
              </div>
            )}
            {drillUploadWait && (
              <SkeletonPlaceholder className='loading-skeleton-drill' />
            )}
            {!drillUploadSuccess && !drillUploadError && !drillUploadWait && (
              <>
                <h3>
                  Create a new drill
                </h3>
                <div className='create-category__create-section'>
                  <Form onSubmit={(e) => handleDrillSubmit(e)}>
                    <Form.Group controlId='createDrill.drillName'>
                      <Form.Label>Drill name</Form.Label>
                      <Form.Control
                        as='input'
                        value={drillName}
                        onChange={(e) => setDrillName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId='createDrill.selectCategory'>
                      <Form.Label>Category</Form.Label>
                      {categories?.map((category, index) => {
                        return (
                          <Form.Check
                            key={index}
                            type={'checkbox'}
                            id={`category-${index}`}
                            label={category.label}
                            onChange={(e) =>
                              handleCheckboxSelect(e, category.label)
                            }
                          />
                        );
                      })}
                    </Form.Group>
                    <Form.Group controlId='createDrill.description'>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as='textarea'
                        rows={3}
                        value={drillDesc}
                        onChange={(e) => setDrillDesc(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.File
                        id='custom-file'
                        label='Upload file'
                        name='video'
                        // custom
                        onChange={(e) => {
                          setDrillVideoFile(e.target.files[0]);
                        }}
                      />
                    </Form.Group>
                    <Button
                      block
                      size='lg'
                      type='submit'
                      disabled={!validateDrillForm()}
                    >
                      Create
                    </Button>
                  </Form>
                </div>
              </>
            )}
          </div>
        </>
      )}
      {isLoggedin === false && (
        <div className='upload-not-loggedin'>You must be logged in </div>
      )}
    </div>
  );
};

export default Upload;
