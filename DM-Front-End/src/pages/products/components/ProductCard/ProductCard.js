import React, { Component } from 'react';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import s from './ProductCard.module.scss';
import { Button } from 'reactstrap'

class ProductCard extends Component {
	render() {
		const { _id, title, templateThumbnail } = this.props.item
		let ifSelected = this.props.selected === _id ? true : false

		return (
			<div id={_id} className={[s.productCard, 'product-card'].join(' '), s.template}>
				<div onClick={() => { this.props.openModal(this.props.item) }} className={s.productCardPhoto} style={{ backgroundImage: `url(${templateThumbnail})`}}>
					{ifSelected ? <span className={cx(s.label, 'bg-success')}>Selected</span> : null}
				</div>
				<div className={s.productCardDataWrapper}>
					<div className={cx(s.productsCardTitle, 'title')}>{title}</div>
					<div className={s.buttonContainer}>
						<div style={{ cursor: 'pointer' }} className={s.dFlex}></div>
						<Button onClick={() => { this.props.openModal(this.props.item) }} color="success" className="width-120 mb-xs mr-xs">Select</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(ProductCard);