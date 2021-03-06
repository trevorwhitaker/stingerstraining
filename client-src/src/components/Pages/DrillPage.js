import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import constants from '../../util/constants';
import util from '../../util/utils';

import './DrillPage.scss';

const DrillPage = ({ drill }) => {
  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);
  const [sets, setSets] = useState(1);
  const [type, setType] = useState('Reps');

  useEffect(() => {
    let mounted = true;
    const getInitialData = async () => {
      const initialData = await util.getDrillByName(drill);
      setData(initialData);
    };

    if (!data && mounted) getInitialData();
  });

    // Validate category data before enabling submit button
    const validateCategoryForm = () => {
      return (
        count.length > 0
      );
    };

    // submit data to create a new category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const record = await util.createNewRecord(data.drill._id, sets, count, type);
    let tempData = data;
    tempData.records = record.records;
    setData(tempData);
    setCount(0);
    setSets(1);
    setType('Reps');
  };

  const recordsList = data && data.records && data.records.records ? data.records.records : data ? data.records : [];

  return (
    data && <div className='drill-page'>
      <div className='drill-page__title'>
        {drill}
      </div>
      <video className='drill-page__video' controls>
        <source src={`${constants.videoEndpoint}/${data.drill._id}.mp4`} type="video/mp4"/>
      </video>
      <div className='drill-page__description'>{data.drill.description}</div>
      <hr></hr>
      <Form onSubmit={(e) => handleCategorySubmit(e)}>
                    <Form.Group controlId='addReps.sets' className="add-reps-count">
                      <Form.Label>Sets</Form.Label>
                      <Form.Control
                        as='input'
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId='addReps.count' className="add-reps-count">
                      <Form.Label>Count Per Set</Form.Label>
                      <Form.Control
                        as='input'
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId='addReps.type' className="add-reps-type">
                      <Form.Label>Type</Form.Label>
                      <Form.Control as="select"
                        value={type}
                        onChange={(e) => setType(e.target.value)} >
                        <option>Reps</option>
                        <option>Seconds</option>
                      </Form.Control>
                    </Form.Group>
                    <div className="add-reps-submit">
                    <Button
                      block
                      size='lg'
                      type='submit'
                      disabled={!validateCategoryForm()}
                      className="add-rep-button"
                    >
                      Add
                    </Button>
                    </div>
                  </Form>
       <Table striped bordered hover className="rep-table">
       <thead>
         <tr>
           <th width='40%'>Date</th>
           <th width='20%'>Sets</th>
           <th width='20%'>Count</th>
           <th width='20%'>Type</th>
         </tr>
       </thead>
       <tbody>
         {data.records && recordsList.map(record => (
            <tr key={record.date}>
              <td>{new Date(record.date).toLocaleString()}</td>
              <td>{record.sets}</td>
              <td>{record.count}</td>
              <td>{record.description}</td>
            </tr>
          ))}
       </tbody>
     </Table>

    </div>
  );
};

export default DrillPage;
