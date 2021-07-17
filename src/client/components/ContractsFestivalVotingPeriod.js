import PropTypes from 'prop-types';
import React from 'react';
import { formatDistanceToNow, formatDistance, formatRelative } from 'date-fns';

import { ParagraphStyle } from '~/client/styles/typography';

export const ContractsFestivalVotingPeriod = ({ end, start }) => {
  const now = new Date();

  // Voting is open.
  if (now >= start && now <= end)
    return (
      <ParagraphStyle>
        Voting closes {formatDistance(end, start, { addSuffix: true })} (
        {formatRelative(end, now)}).
      </ParagraphStyle>
    );

  // voting expired.
  if (now > end)
    return (
      <div>
        Voting was closed {formatDistanceToNow(end, { addSuffix: true })} (
        {formatRelative(end, now)}
        ).
      </div>
    );

  // Voting starts in the future.
  if (now < start)
    return (
      <div>
        Voting will open {formatDistanceToNow(start, { addSuffix: true })} (
        {formatRelative(start, now)}).
      </div>
    );

  // Unreachable.
  return <div />;
};

ContractsFestivalVotingPeriod.propTypes = {
  end: PropTypes.instanceOf(Date).isRequired,
  start: PropTypes.instanceOf(Date).isRequired,
};

export default ContractsFestivalVotingPeriod;
