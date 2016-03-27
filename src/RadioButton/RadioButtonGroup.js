import React from 'react';
import RadioButton from '../RadioButton';
import getMuiTheme from '../styles/getMuiTheme';
import warning from 'warning';

const RadioButtonGroup = React.createClass({

  propTypes: {
    /**
     * Should be used to pass `RadioButton` components.
     */
    children: React.PropTypes.node,

    /**
     * The CSS class name of the root element.
     */
    className: React.PropTypes.string,

    /**
     * The `value` property (case-sensitive) of the radio button that will be
     * selected by default. This takes precedence over the `checked` property
     * of the `RadioButton` elements.
     */
    defaultSelected: React.PropTypes.string,

    /**
     * Where the label will be placed for all child radio buttons.
     * This takes precedence over the `labelPosition` property of the
     * `RadioButton` elements.
     */
    labelPosition: React.PropTypes.oneOf(['left', 'right']),

    /**
     * The name that will be applied to all child radio buttons.
     */
    name: React.PropTypes.string.isRequired,

    /**
     * Callback function that is fired when a radio button has
     * been checked.
     *
     * @param {object} event `change` event targeting the selected
     * radio button.
     * @param {string} value The `value` of the selected radio button.
     */
    onChange: React.PropTypes.func,

    /**
     * Override the inline-styles of the root element.
     */
    style: React.PropTypes.object,

    /**
     * The `value` of the currently selected radio button.
     */
    valueSelected: React.PropTypes.string,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      style: {},
    };
  },

  getInitialState() {
    return {
      numberCheckedRadioButtons: 0,
      selected: this.props.valueSelected || this.props.defaultSelected || '',
      muiTheme: this.context.muiTheme || getMuiTheme(),
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentWillMount() {
    let cnt = 0;

    React.Children.forEach(this.props.children, (option) => {
      if (this._hasCheckAttribute(option)) cnt++;
    }, this);

    this.setState({numberCheckedRadioButtons: cnt});
  },

  componentWillReceiveProps(nextProps, nextContext) {
    const newState = {muiTheme: nextContext.muiTheme || this.state.muiTheme};

    if (nextProps.hasOwnProperty('valueSelected')) {
      newState.selected = nextProps.valueSelected;
    }

    this.setState(newState);
  },

  _hasCheckAttribute(radioButton) {
    return radioButton.props.hasOwnProperty('checked') &&
      radioButton.props.checked;
  },

  _updateRadioButtons(newSelection) {
    if (this.state.numberCheckedRadioButtons === 0) {
      this.setState({selected: newSelection});
    } else {
      warning(false, `Cannot select a different radio button while another radio button
        has the 'checked' property set to true.`);
    }
  },

  handleChange(event, newSelection) {
    this._updateRadioButtons(newSelection);

    // Successful update
    if (this.state.numberCheckedRadioButtons === 0) {
      if (this.props.onChange) this.props.onChange(event, newSelection);
    }
  },

  getSelectedValue() {
    return this.state.selected;
  },

  setSelectedValue(newSelectionValue) {
    this._updateRadioButtons(newSelectionValue);
  },

  clearValue() {
    this.setSelectedValue('');
  },

  render() {
    const {
      prepareStyles,
    } = this.state.muiTheme;

    const options = React.Children.map(this.props.children, (option) => {
      const {
        name,
        value,
        label,
        onCheck,
        ...other,
      } = option.props;

      return (
        <RadioButton
          {...other}
          ref={option.props.value}
          name={this.props.name}
          key={option.props.value}
          value={option.props.value}
          label={option.props.label}
          labelPosition={this.props.labelPosition}
          onCheck={this.handleChange}
          checked={option.props.value === this.state.selected}
        />
      );
    }, this);

    return (
      <div
        style={prepareStyles(Object.assign({}, this.props.style))}
        className={this.props.className}
      >
        {options}
      </div>
    );
  },

});

export default RadioButtonGroup;
