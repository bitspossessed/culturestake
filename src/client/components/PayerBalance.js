import React, { useState, useEffect } from 'react';

import translate from '~/common/services/i18n';
import web3 from '~/common/services/web3';
import BoxRounded from '~/client/components/BoxRounded';

const PayerBalance = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getBalance = async () => {
      const state = await web3.eth.getBalance(process.env.PAYER_ADDRESS);
      setBalance(state);
    };
    getBalance();
  }, [setBalance]);

  return (
    <BoxRounded title={translate('PayerBalance.title')}>{balance}</BoxRounded>
  );
};

export default PayerBalance;
