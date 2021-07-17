import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { formatDistanceToNow, formatDistance, formatRelative } from 'date-fns';

import ButtonOutline from '~/client/components/ButtonOutline';
import ContractsFestivalVotingPeriod from '~/client/components/ContractsFestivalVotingPeriod';
import DateTimePicker from '~/client/components/DateTimePicker';
import EthereumContainer from '~/client/components/EthereumContainer';
import translate from '~/common/services/i18n';
import { ParagraphStyle } from '~/client/styles/typography';
import {
  TX_DEACTIVATE_FESTIVAL,
  TX_INITIALIZE_FESTIVAL,
  deactivateFestival,
  getFestival,
  initializeFestival,
  isFestivalDeactivated,
} from '~/common/services/contracts/festivals';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import {
  usePendingTransaction,
  useOwnerAddress,
} from '~/client/hooks/ethereum';
import { epochToDate } from '~/common/utils/time';

const ContractsFestivals = ({ chainId }) => {
  const initializeTx = usePendingTransaction({
    txMethod: TX_INITIALIZE_FESTIVAL,
    params: { chainId },
  });
  const deactivateTx = usePendingTransaction({
    txMethod: TX_DEACTIVATE_FESTIVAL,
    params: { chainId },
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [festivalStart, setFestivalStart] = useState();
  const [festivalEnd, setFestivalEnd] = useState();

  useEffect(() => {
    const getInitializedStatus = async () => {
      const {
        initialized: isInitialized,
        startTime,
        endTime,
      } = await getFestival(chainId);
      setIsInitialized(isInitialized);
      setFestivalStart(epochToDate(startTime));
      setFestivalEnd(epochToDate(endTime));
    };

    getInitializedStatus();
  }, [chainId, initializeTx.isPending]);

  useEffect(() => {
    const getDeactivatedStatus = async () => {
      const state = await isFestivalDeactivated(chainId);
      setIsDeactivated(state);
    };

    getDeactivatedStatus();
  }, [chainId, deactivateTx.isPending]);

  return (
    <EthereumContainer>
      {isDeactivated ? (
        <ParagraphStyle>
          {translate('ContractsFestivals.bodyAlreadyDeactivated')}
        </ParagraphStyle>
      ) : !isInitialized ? (
        <ContractsFestivalsInitialize chainId={chainId} />
      ) : (
        <>
          {festivalEnd && festivalStart && (
            <ContractsFestivalVotingPeriod
              end={festivalEnd}
              start={festivalStart}
            />
          )}
          <ContractsFestivalsDeactivate
            chainId={chainId}
            festivalEnd={festivalEnd}
            festivalStart={festivalStart}
          />
        </>
      )}
    </EthereumContainer>
  );
};

const ContractsFestivalsInitialize = ({ chainId }) => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();

  const [festivalStartTime, setFestivalStartTime] = useState(new Date());
  const [festivalEndTime, setFestivalEndTime] = useState(new Date());

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await initializeFestival(
      owner,
      chainId,
      festivalStartTime,
      festivalEndTime,
    );

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { chainId },
      }),
    );
  };

  return (
    <Fragment>
      <ParagraphStyle>
        {translate('ContractsFestivals.bodyFestivalStartTime')}
      </ParagraphStyle>

      <DateTimePicker
        value={festivalStartTime}
        onChange={setFestivalStartTime}
      />

      <ParagraphStyle>
        {translate('ContractsFestivals.bodyFestivalEndTime')}
      </ParagraphStyle>

      <DateTimePicker value={festivalEndTime} onChange={setFestivalEndTime} />

      <ButtonOutline onClick={onClick}>
        {translate('ContractsFestivals.buttonInitializeFestival')}
      </ButtonOutline>
    </Fragment>
  );
};

// export const ContractsFestivalVotingPeriod = ({ end, start }) => {
//   const now = new Date();

//   // Voting is open.
//   if (now >= start && now <= end)
//     return (
//       <div>
//         Voting closes {formatDistance(end, start, { addSuffix: true })} (
//         {formatRelative(end, now)}).
//       </div>
//     );

//   // voting expired.
//   if (now > end)
//     return (
//       <div>
//         Voting was closed {formatDistanceToNow(end, { addSuffix: true })} (
//         {formatRelative(end, now)}
//         ).
//       </div>
//     );

//   // Voting starts in the future.
//   if (now < start)
//     return (
//       <div>
//         Voting will open {formatDistanceToNow(start, { addSuffix: true })} (
//         {formatRelative(start, now)}).
//       </div>
//     );

//   // Unreachable.
//   return <div />;
// };

const ContractsFestivalsDeactivate = ({ chainId }) => {
  const dispatch = useDispatch();
  const owner = useOwnerAddress();

  const onClick = async (event) => {
    event.preventDefault();

    const { txHash, txMethod } = await deactivateFestival(owner, chainId);

    dispatch(
      addPendingTransaction({
        txHash,
        txMethod,
        params: { chainId },
      }),
    );
  };

  return (
    <ButtonOutline isDanger={true} onClick={onClick}>
      {translate('ContractsFestivals.buttonDeactivateFestival')}
    </ButtonOutline>
  );
};

// ContractsFestivalVotingPeriod.propTypes = {
//   end: PropTypes.instanceOf(Date).isRequired,
//   start: PropTypes.instanceOf(Date).isRequired,
// };

ContractsFestivalsDeactivate.propTypes = {
  chainId: PropTypes.string.isRequired,
};

ContractsFestivalsInitialize.propTypes = {
  chainId: PropTypes.string.isRequired,
};

ContractsFestivals.propTypes = {
  chainId: PropTypes.string.isRequired,
};

export default ContractsFestivals;
