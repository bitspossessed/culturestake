import React, { useState, useEffect } from 'react';

import BoxRounded from '~/client/components/BoxRounded';
import Pill from '~/client/components/Pill';
import translate from '~/common/services/i18n';
import web3 from '~/common/services/web3';
import { ParagraphStyle } from '~/client/styles/typography';

const THRESHOLD_WARNING_ETH = 0.02;

const PayerBalance = () => {
  const [balance, setBalance] = useState(0);
  const isCriticalBalance = web3.utils
    .toBN(web3.utils.toWei(THRESHOLD_WARNING_ETH.toString(), 'ether'))
    .gt(web3.utils.toBN(balance));

  useEffect(() => {
    const getBalance = async () => {
      const value = await web3.eth.getBalance(process.env.PAYER_ADDRESS);
      setBalance(value);
    };

    getBalance();
  }, [setBalance]);

  return (
    <BoxRounded
      isDanger={isCriticalBalance}
      title={translate('PayerBalance.title')}
    >
      <ParagraphStyle>
        {translate('PayerBalance.bodyPayerAddress')}{' '}
        <Pill isDanger={isCriticalBalance}>{process.env.PAYER_ADDRESS}</Pill>
      </ParagraphStyle>

      <ParagraphStyle>
        {web3.utils.fromWei(balance.toString(), 'ether')} xDAI
      </ParagraphStyle>
    </BoxRounded>
  );
};

export default PayerBalance;
