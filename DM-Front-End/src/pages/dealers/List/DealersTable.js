import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
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
                        {dealer.description}
                    </CardText>
                    <CardText>
                        {dealer.oem}
                    </CardText>
                    <CardText>
                        {dealer.platform}
                    </CardText>
                    <Link to={`/app/main/dealers/${dealer._id}/update`}>Update</Link>
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