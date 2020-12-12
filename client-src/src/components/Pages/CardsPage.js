import React, { useState, useEffect } from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import util from '../../util/utils';
import constants from '../../util/constants';

import './CardPage.scss';

const CardsPage = ({ match }) => {
  const category = match.path;
  const [data, setData] = useState(null);
  useEffect(() => {
    const getContent = async () => {
      const data = await util.getCategory(`${constants.drillsByCategory}${category}`);
      setData(data);
    };
    getContent();
  }, [category]);

  return (
    <div className='cards-page'>
      <div className='card-panel'>
        {data &&
          data.map((item, index) => {
            return (
              <Card className='card-panel__card' key={index}>
                <Card.Body>
                  <Card.Img variant="top" src={`${constants.thumbnailApi}/${item._id}.png`} />
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Button as={Link} to={`${category}/${item.name}/${item._id}`} variant='primary'>Go somewhere</Button>
                </Card.Body>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default CardsPage;
