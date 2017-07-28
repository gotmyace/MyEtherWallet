import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper } from 'utils/formatters';
import SimpleDropDown from 'components/ui/SimpleDropdown';
import SimpleButton from 'components/ui/SimpleButton';
import type {
  OriginKindSwapAction,
  DestinationKindSwapAction,
  OriginAmountSwapAction,
  DestinationAmountSwapAction,
  ChangeStepSwapAction
} from 'actions/swap';

export type StateProps = {
  bityRates: {},
  originAmount: ?number,
  destinationAmount: ?number,
  originKind: string,
  destinationKind: string,
  destinationKindOptions: String[],
  originKindOptions: String[]
};

export type ActionProps = {
  originKindSwap: (value: string) => OriginKindSwapAction,
  destinationKindSwap: (value: string) => DestinationKindSwapAction,
  originAmountSwap: (value: ?number) => OriginAmountSwapAction,
  destinationAmountSwap: (value: ?number) => DestinationAmountSwapAction,
  changeStepSwap: () => ChangeStepSwapAction
};

export default class CurrencySwap extends Component {
  props: StateProps & ActionProps;

  state = {
    disabled: true
  };

  componentWillUpdate(nextProps, nextState) {
    const disabled = !(nextProps.originAmount && nextProps.destinationAmount);
    if (nextState.disabled !== disabled) {
      this.setState({
        disabled: disabled
      });
    }
  }

  onClickStartSwap = () => {
    this.props.changeStepSwap(2);
  };

  setOriginAndDestinationToNull = () => {
    this.props.originAmountSwap(null);
    this.props.destinationAmountSwap(null);
  };

  onChangeOriginAmount = (event: SyntheticInputEvent) => {
    const amount = event.target.value;
    let originAmountAsNumber = parseFloat(amount);
    if (originAmountAsNumber || originAmountAsNumber === 0) {
      let pairName = combineAndUpper(
        this.props.originKind,
        this.props.destinationKind
      );
      let bityRate = this.props.bityRates[pairName];
      this.props.originAmountSwap(originAmountAsNumber);
      this.props.destinationAmountSwap(originAmountAsNumber * bityRate);
    } else {
      this.setOriginAndDestinationToNull();
    }
  };

  onChangeDestinationAmount = (event: SyntheticInputEvent) => {
    const amount = event.target.value;
    let destinationAmountAsNumber = parseFloat(amount);
    if (destinationAmountAsNumber || destinationAmountAsNumber === 0) {
      this.props.destinationAmountSwap(destinationAmountAsNumber);
      let pairName = combineAndUpper(
        this.props.destinationKind,
        this.props.originKind
      );
      let bityRate = this.props.bityRates[pairName];
      this.props.originAmountSwap(destinationAmountAsNumber * bityRate);
    } else {
      this.setOriginAndDestinationToNull();
    }
  };

  onChangeDestinationKind = (event: SyntheticInputEvent) => {
    let newDestinationKind = event.target.value;
    this.props.destinationKindSwap(newDestinationKind);
  };

  onChangeOriginKind = (event: SyntheticInputEvent) => {
    let newOriginKind = event.target.value;
    this.props.originKindSwap(newOriginKind);
  };

  render() {
    const {
      originAmount,
      destinationAmount,
      originKind,
      destinationKind,
      destinationKindOptions,
      originKindOptions
    } = this.props;

    return (
      <article className="swap-panel">
        <h1>
          {translate('SWAP_init_1')}
        </h1>
        <input
          className={`form-control ${this.props.originAmount !== '' &&
          this.props.originAmount > 0
            ? 'is-valid'
            : 'is-invalid'}`}
          type="number"
          placeholder="Amount"
          value={
            parseFloat(originAmount) === 0 ? originAmount : originAmount || ''
          }
          onChange={this.onChangeOriginAmount}
        />

        <SimpleDropDown
          value={originKind}
          onChange={this.onChangeOriginKind.bind(this)}
          options={originKindOptions}
        />

        <h1>
          {translate('SWAP_init_2')}
        </h1>

        <input
          className={`form-control ${this.props.destinationAmount !== '' &&
          this.props.destinationAmount > 0
            ? 'is-valid'
            : 'is-invalid'}`}
          type="number"
          placeholder="Amount"
          value={
            parseFloat(destinationAmount) === 0
              ? destinationAmount
              : destinationAmount || ''
          }
          onChange={this.onChangeDestinationAmount}
        />

        <SimpleDropDown
          value={destinationKind}
          onChange={this.onChangeDestinationKind}
          options={destinationKindOptions}
        />

        <div className="col-xs-12 clearfix text-center">
          <SimpleButton
            onClick={this.onClickStartSwap}
            text={translate('SWAP_init_CTA')}
            disabled={this.state.disabled}
          />
        </div>
      </article>
    );
  }
}
