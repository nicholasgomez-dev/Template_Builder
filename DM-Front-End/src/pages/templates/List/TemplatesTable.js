import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
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
                        {template.description}
                    </CardText>
                    <CardText>
                        {template.oem}
                    </CardText>
                    <CardText>
                        {template.platform}
                    </CardText>
                    <Link to={`/app/main/templates/${template._id}/update`}>Update</Link>
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