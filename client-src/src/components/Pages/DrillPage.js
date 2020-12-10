import React from 'react';

import constants from '../../util/constants';

import './DrillPage.scss';

const DrillPage = ({ match }) => {
  const videoSource = `${constants.videoApi}/${match.params.drill}.mp4`
  return (
    <div className='drill-page'>
      Drill page {match.params.category} {match.params.drill}
      <video controls>
        <source src={videoSource} type="video/mp4"/>
      </video>
    </div>
  );
};

export default DrillPage;
