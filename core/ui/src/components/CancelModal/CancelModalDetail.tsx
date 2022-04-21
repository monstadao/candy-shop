import { CandyShop } from '@liqnft/candy-shop-sdk';
import { BN, web3 } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { ExplorerLink } from 'components/ExplorerLink';
import { TIMEOUT_REFETCH_NFT } from 'constant';
import { TransactionState } from 'model';
import { CandyActionContext } from 'public/Context';
import React, { useContext, useEffect, useMemo } from 'react';
import { Order as OrderSchema } from 'solana-candy-shop-schema/dist';
import { ErrorType, handleError } from 'utils/ErrorHandler';
import { LiqImage } from '../LiqImage';

export interface CancelModalDetailProps {
  onCancel: any;
  candyShop: CandyShop;
  order: OrderSchema;
  onChangeStep: (state: TransactionState) => void;
  wallet: AnchorWallet;
}

let timeout: NodeJS.Timeout;
export const CancelModalDetail = ({
  candyShop,
  order,
  onChangeStep,
  wallet
}: CancelModalDetailProps): JSX.Element => {
  const { setRefetch } = useContext(CandyActionContext);

  const cancel = async () => {
    onChangeStep(TransactionState.PROCESSING);
    candyShop
      .cancel(
        new web3.PublicKey(order.tokenAccount),
        new web3.PublicKey(order.tokenMint),
        new BN(order.price),
        wallet
      )
      .then(() => {
        timeout = setTimeout(() => {
          setRefetch({});
          onChangeStep(TransactionState.CONFIRMED);
        }, TIMEOUT_REFETCH_NFT);
      })
      .catch(() => {
        handleError(ErrorType.TransactionFailed);
        onChangeStep(TransactionState.DISPLAY);
      });
  };

  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  const orderPrice = useMemo(() => {
    try {
      return (
        Number(order?.price) / candyShop.baseUnitsPerCurrency
      ).toLocaleString(undefined, {
        minimumFractionDigits: candyShop.priceDecimals,
        maximumFractionDigits: candyShop.priceDecimals
      });
    } catch (err) {
      return null;
    }
  }, [candyShop.baseUnitsPerCurrency, candyShop.priceDecimals, order?.price]);

  return (
    <div className="candy-cancel-modal">
      <div className="candy-cancel-modal-thumbnail">
        <LiqImage src={order.nftImageLink} alt={order?.name} fit="contain" />
      </div>

      <div className="candy-cancel-modal-container">
        <div className="candy-title">{order.name}</div>
        <div className="candy-cancel-modal-control">
          <div>
            <div className="candy-label">PRICE</div>
            <div className="candy-price">
              {orderPrice ? `${orderPrice} ${candyShop.currencySymbol}` : 'N/A'}
            </div>
          </div>
          <button
            className="candy-button candy-cancel-modal-button"
            onClick={cancel}
          >
            {buttonContent}
          </button>
        </div>
        {order?.nftDescription && (
          <div className="candy-stat">
            <div className="candy-label">DESCRIPTION</div>
            <div className="candy-value">{order.nftDescription}</div>
          </div>
        )}
        <div className="candy-stat-horizontal">
          <div>
            <div className="candy-label">MINT ADDRESS</div>
            <div className="candy-value">
              <ExplorerLink type="address" address={order.tokenMint} />
            </div>
          </div>
          {order?.edition ? (
            <>
              <div className="candy-stat-horizontal-line" />
              <div>
                <div className="candy-label">EDITION</div>
                <div className="candy-value">{order?.edition}</div>
              </div>
            </>
          ) : null}
          <div className="candy-stat-horizontal-line" />
          <div>
            <div className="candy-label">CURRENT OWNER</div>
            <div className="candy-value">
              <ExplorerLink type="address" address={order.walletAddress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const buttonContent = 'Cancel listing';
