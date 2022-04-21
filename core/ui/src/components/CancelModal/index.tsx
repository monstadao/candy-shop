import React, { useState } from 'react';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import Modal from 'components/Modal';
import Processing from 'components/Processing';
import { CandyShop } from '@liqnft/candy-shop-sdk';
import { TransactionState } from 'model';
import { Order as OrderSchema } from 'solana-candy-shop-schema/dist';
import { CancelModalConfirm } from './CancelModalConfirm';
import { CancelModalDetail } from './CancelModalDetail';
import './index.less';

export interface CancelModalProps {
  order: OrderSchema;
  onClose: any;
  candyShop: CandyShop;
  wallet: AnchorWallet;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  order,
  onClose: onUnSelectItem,
  candyShop,
  wallet
}) => {
  const [state, setState] = useState<TransactionState>(
    TransactionState.DISPLAY
  );

  // Handle change step
  const onChangeStep = (state: TransactionState) => setState(state);

  return (
    <Modal
      onCancel={onUnSelectItem}
      width={state !== TransactionState.DISPLAY ? 600 : 1000}
    >
      {state === TransactionState.DISPLAY && wallet && (
        <CancelModalDetail
          onCancel={onUnSelectItem}
          candyShop={candyShop}
          order={order}
          onChangeStep={onChangeStep}
          wallet={wallet}
        />
      )}
      {state === TransactionState.PROCESSING && (
        <Processing text="Canceling your sale" />
      )}
      {state === TransactionState.CONFIRMED && (
        <CancelModalConfirm order={order} onCancel={onUnSelectItem} />
      )}
    </Modal>
  );
};
