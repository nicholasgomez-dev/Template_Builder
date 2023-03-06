import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { Row, Col, Badge, Card, CardBody, CardTitle, CardText, CardImg, CardGroup, CardColumns } from 'reactstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import s from './ListTemplatesTable.module.scss';
import style from './ListTemplatesCard.module.scss'

const TemplatesTable = (props) => {
    const { templates } = props
    
    const TemplateCard = (props) => {
        const { template } = props

        return (
            <Card>
                <CardTitle className={style.header}>
                    <h4>{template.name}</h4>
                </CardTitle>
                <CardBody>
                    <CardText className={style.text}>
                        <small>{template.description}</small>
                    </CardText>
                    <ListGroup className={style.list}>
                        <ListGroup.Item className="fw-semi-bold text-muted">
                        <br/><small>OEM: {template.oem}</small>
                        <br/><small>Platform: {template.platform}</small>
                        <br/><small>Version: {template.version}</small>
                        </ListGroup.Item>
                    </ListGroup>
                    <Link className={style.right} outline color="success" to={`/app/main/templates/${template._id}/update`}>Update</Link>
                    <Link className={style.right} outline color="success" to={`/app/main/templates/${template._id}/build`}>Build</Link>
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