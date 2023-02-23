import React, { Fragment } from 'react'
import { Row, Col, Badge, Card, CardBody, CardTitle, CardText, CardImg, CardGroup, CardColumns } from 'reactstrap';

const VariablesTable = (props) => {
    const { variables } = props
    
    const VariableRow = (props) => {
        const { variable } = props

        return (
            <Card>
                <CardTitle>
                    <h4>{variable.name}</h4>
                </CardTitle>
                <CardBody>
                    <CardText>
                        <p>{variable.description}</p>
                    </CardText>
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