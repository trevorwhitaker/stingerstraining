import React from 'react';

import constants from '../../util/constants';

import './DrillPage.scss';

const DrillPage = ({ match }) => {
  const { category, drill, id } = match.params; //eslint-disable-line no-unused-vars
  const videoSource = `${constants.videoApi}/${id}.mp4`
  return (
    <div className='drill-page'>
      <div className='drill-page__title'>
        {drill}
      </div>
      <video controls>
        <source src={videoSource} type="video/mp4"/>
      </video>
    </div>
  );
};

export default DrillPage;
