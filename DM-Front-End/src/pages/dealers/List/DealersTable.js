import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { Row, Col, Badge, Card, CardBody, CardTitle, CardText, CardImg, CardGroup, CardColumns } from 'reactstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import style from './ListDealersCard.module.scss'

const DealersTable = (props) => {
    const { dealers } = props
    
    const DealerCard = (props) => {
        const { dealer } = props

        return (
            <Card>
                <CardTitle className={style.header}>
                    <h4>{dealer.name}</h4>
                </CardTitle>
                <CardBody>
                    <ListGroup className={style.list}>
                        <ListGroup.Item className="fw-semi-bold text-muted">
                        <br/><small>OEM: {dealer.oem}</small>
                        <br/><small>Platform: {dealer.platform}</small>
                        </ListGroup.Item>
                    </ListGroup>
                    <Link className={style.right} outline color="success" to={`/app/main/dealers/${dealer._id}/update`}>Update</Link>
                    <Link className={style.right} outline color="success" to={`/app/main/templates/${dealer._id}/build`}>Build</Link>
                </CardBody>
            </Card>
        )
    }

    return (
        <Fragment>
            <CardColumns>
                {dealers.map((dealer, index) => <DealerCard key={index} dealer={dealer}/>)}
            </CardColumns>
        </Fragment>
    )
}

export default DealersTable;