import React, {Link, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import { Table, Button } from 'reactstrap';
import {
  Row,
  Col,
  Badge,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  CardGroup,
  CardColumns,
} from 'reactstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import API from 'actions/portalAPI';
import s from './TableContainer.module.scss';
import style from './TableCard.module.scss'
const states = {
  sent: 'info',
  online: 'success',
  offline: 'danger',
};

class TableContainer extends PureComponent {
  constructor(props) {
     super(props);

     this.state = {
	 filtered: [], filteredText: "", sites: []
     }
     this.handleChange = this.handleChange.bind(this);           
  }      
      
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        url: PropTypes.string,
      }),
    ).isRequired,
  }

    componentDidMount() {
      this.setState({
	filtered: this.props.sites.sort(function(a,b){
	        return a.sitename.toLowerCase() > b.sitename.toLowerCase();
        })
      });
    }
    componentWillReceiveProps(nextProps) {
      this.setState({
          filtered: nextProps.sites.sort(function(a,b){
              return a.sitename.toLowerCase() > b.sitename.toLowerCase();
          })
      });
    }

    handleChange(e) {
      this.setState({filteredText: e.target.value.toLowerCase() });
  }

  checkContains(text, checkText){
      let lowerText = text.toLowerCase();
      let splitText = lowerText.split(" ")
      let matches = false;
      splitText.forEach(txt => {
          if (txt.startsWith(checkText.toLowerCase())){
              matches = true;
          }
      })

      return matches;
  }

  render() {
    const { data } = this.props;
    const keys = Object.keys(data[0]).map(i => i.toUpperCase());
    const save = (value) => {console.log(value)}
    const cancel = () => {console.log("Cancelled")}
    keys.shift(); // delete "id" key
      return (
	    <div>
	    <input type="text" className={["form-control", s.search].join(' ') } onChange={this.handleChange}  placeholder="Search..." />
            <CardColumns>
            {
              this.state.filtered.map((site) => (
                <Card className={this.checkContains(site.sitename, this.state.filteredText)? style.card: style.hidden} border="dark" key={site._id}>
                  <CardTitle className={style.header}><h4 className="fw-semi-bold">{site.sitename} </h4></CardTitle>
                  <CardBody>

                  <ListGroup className={style.list}>
                    <ListGroup.Item className="fw-semi-bold text-muted"><strong>Development Site: </strong>
                      <br/><small>{ site.siteDevUrl && site.siteDevUrl != '' ? <a href={site.siteDevUrl}>{site.siteDevUrl}</a> : "Not Provided" }</small>
                      </ListGroup.Item> 
                    <ListGroup.Item className="fw-semi-bold text-muted"><strong>Production Site: </strong>
                      <br/><small>{site.siteProdUrl && site.siteProdUrl != '' ? <a href={site.siteProdUrl}>{site.siteProdUrl}</a> : "Not Provided"}</small>
                      </ListGroup.Item> 
                  </ListGroup>
                      <Button className={style.right} outline color="success" onClick={() => this.props.history.push(site.templatePageID ? `/app/main/sites/${site._id}/landing` : '/app/main/sites/' + site._id + '/selectTemplate')}>Manage</Button>
                  </CardBody>
                </Card>
              ))
            }
	  </CardColumns>
	  </div>
    );
  }
}

export default withRouter(TableContainer);
