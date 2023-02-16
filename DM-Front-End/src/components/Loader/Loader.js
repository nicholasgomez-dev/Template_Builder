import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import s from './Loader.module.scss';
import PuffLoader from 'react-spinners/PuffLoader';
class Loader extends React.Component {
    static propTypes = {
        size: PropTypes.number.isRequired
    };

    static defaultProps = {
        size: 21
    };

    render() {
        return (
            <div className={cx(s.root, this.props.className)}>
                      <PuffLoader color={'#4d8cb9'} size={this.props.size} />

                {/* <i className="la la-spinner la-spin" style={{fontSize: this.props.size}}/> */}
            </div>
        );
    }
}

export default Loader;
