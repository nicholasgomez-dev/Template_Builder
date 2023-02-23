import React, { Fragment } from 'react'
import { Row, Col, Badge, Card, CardBody, CardTitle, CardText, CardImg, CardGroup, CardColumns } from 'reactstrap';

const DealersTable = (props) => {
    const { dealers } = props
    
    const DealerCard = (props) => {
        const { dealer } = props

        return (
            <Card>
                <CardTitle>
                    <h4>{dealer.name}</h4>
                </CardTitle>
                <CardBody>
                    <CardText>
                        <p>{dealer.description}</p>
                    </CardText>
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