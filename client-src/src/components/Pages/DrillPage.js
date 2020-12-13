import React, { useState, useEffect } from 'react';

import constants from '../../util/constants';
import util from '../../util/utils';

import './DrillPage.scss';

const DrillPage = ({ drill }) => {

  const [data, setData] = useState(null);

  useEffect(() => {
    const getContent = async () => {
      const data = await util.getDrillByName(drill);
      setData(data);
    };
    getContent();
  }, [drill])

  return (
    data && <div className='drill-page'>
      <div className='drill-page__title'>
        {drill}
      </div>
      <video className='drill-page__video' controls>
        <source src={`${constants.videoEndpoint}/${data._id}.mp4`} type="video/mp4"/>
      </video>
      <div className='drill-page__description'>{data.description}</div>
    </div>
  );
};

export default DrillPage;
