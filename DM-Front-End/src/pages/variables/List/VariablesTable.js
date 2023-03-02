import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { Row, Col, Badge, Card, CardBody, CardTitle, CardText, CardImg, CardGroup, CardColumns } from 'reactstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import style from './ListVariablesCard.module.scss'

const VariablesTable = (props) => {
    const { variables } = props
    
    const VariableRow = (props) => {
        const { variable } = props

        return (
            <Card>
                <CardTitle className={style.header}>
                    <h4>{variable.name}</h4>
                </CardTitle>
                <CardBody>
                    <CardText>
                        {variable.description}
                    </CardText>
                    <ListGroup className={style.list}>
                        <ListGroup.Item className="fw-semi-bold text-muted">
                        <br/><small>Value: {variable.value}</small>
                        </ListGroup.Item>
                    </ListGroup>
                    <Link className={style.right} outline color="success" to={`/app/main/variables/${variable._id}/update`}>Update</Link>
                </CardBody>
            </Card>
        )
    }

    return (
        <Fragment>
            <CardColumns>
                {variables.map((variable, index) => <VariableRow key={index} variable={variable}/>)}
            </CardColumns>
        </Fragment>
    )
}

export default VariablesTable;