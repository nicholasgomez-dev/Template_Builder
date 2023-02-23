import React, { Fragment } from 'react'
import { Row, Col, Badge, Card, CardBody, CardTitle, CardText, CardImg, CardGroup, CardColumns } from 'reactstrap';

const TemplatesTable = (props) => {
    const { templates } = props
    
    const TemplateCard = (props) => {
        const { template } = props

        return (
            <Card>
                <CardTitle>
                    <h4>{template.name}</h4>
                </CardTitle>
                <CardBody>
                    <CardText>
                        <p>{template.description}</p>
                    </CardText>
                </CardBody>
            </Card>
        )
    }

    return (
        <Fragment>
            <CardColumns>
                {templates.map((template, index) => <TemplateCard key={index} template={template}/>)}
            </CardColumns>
        </Fragment>
    )
}

export default TemplatesTable;