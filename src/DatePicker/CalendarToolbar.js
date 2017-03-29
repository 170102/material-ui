import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import IconButton from '../IconButton';
import NavigationChevronLeft from '../svg-icons/navigation/chevron-left';
import NavigationChevronRight from '../svg-icons/navigation/chevron-right';
import SlideInTransitionGroup from '../internal/SlideIn';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'inherit',
    height: 48,
  },
  titleDiv: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  titleText: {
    height: 'inherit',
    paddingTop: 12,
  },
};

class CalendarToolbar extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    displayDate: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    nextMonth: PropTypes.bool,
    onMonthChange: PropTypes.func,
    prevMonth: PropTypes.bool,
  };

  static defaultProps = {
    nextMonth: true,
    prevMonth: true,
  };

  state = {
    transitionDirection: 'up',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.displayDate !== this.props.displayDate) {
      const direction = nextProps.displayDate > this.props.displayDate ? 'left' : 'right';
      this.setState({
        transitionDirection: direction,
      });
    }
  }

  handleTouchTapPrevMonth = () => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(-1);
    }
  };

  handleTouchTapNextMonth = () => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(1);
    }
  };

  focus = () => {
    const prevMonth = ReactDOM.findDOMNode(this.prevButton);
    this.prevButton.setKeyboardFocus();
    prevMonth.focus();
  }

  render() {
    const {
      DateTimeFormat,
      locale,
      displayDate,
      tabIndex,
    } = this.props;

    const dateTimeFormatted = new DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format(displayDate);

    return (
      <div style={styles.root}>
        <IconButton
          ref={(el) => this.prevButton = el}
          tabIndex={tabIndex}
          aria-label="Go to previous month"
          disabled={!this.props.prevMonth}
          onTouchTap={this.handleTouchTapPrevMonth}
        >
          <NavigationChevronLeft />
        </IconButton>
        <SlideInTransitionGroup
          direction={this.state.transitionDirection}
          style={styles.titleDiv}
        >
          <div
            key={dateTimeFormatted}
            style={styles.titleText}
            aria-live="assertive"
            aria-atomic="true"
            role="heading"
          >
            {dateTimeFormatted}
          </div>
        </SlideInTransitionGroup>
        <IconButton
          tabIndex={tabIndex}
          ref={(el) => this.nextButton = el}
          aria-label="Go to next month"
          disabled={!this.props.nextMonth}
          onTouchTap={this.handleTouchTapNextMonth}
        >
          <NavigationChevronRight />
        </IconButton>
      </div>
    );
  }
}

export default CalendarToolbar;
