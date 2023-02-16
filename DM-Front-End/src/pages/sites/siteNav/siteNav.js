import React, { Component } from 'react';
// This only needs to be done once; probably during your application's bootstrapping process.
import 'react-sortable-tree/style.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
import { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath, walk } from 'react-sortable-tree';
import axios from 'axios';
import Loader from '../../../components/Loader/Loader';
import { Button, Tooltip, Row, Col } from 'reactstrap';
import { toast } from 'react-toastify';
import NavLink from '../../../form-components/Link/NavLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './siteNav.scss'
import { v4 as uuidv4 } from 'uuid';

const isTouchDevice = !!('ontouchstart' in window || navigator.maxTouchPoints);
const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;

export default class SiteNav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            treeData: [],
            isLoading: true,
            focus: false,
            hasEdits: false,
            isSaving: false,
            addAsFirstChild: true,
            tooltipOpen: false
        };

    }

    async componentDidMount() {
        this.setState({ isLoading: true })
        axios.get(`${process.env.API}/api/sites/${this.props.match.params.site_id}/settings`)
            .then(siteSettings => {

                this.setState({
                    treeData: siteSettings.data.siteNav.menu,
                    maxDepth: siteSettings.data.siteNav.maxDepth,
                    isLoading: false
                })
            })
            .catch(err => {
                console.log(err)
                this.errorHandler()
                this.setState({ isLoading: false })
            })

    }

    toggleTooltip = () => this.setState({ tooltipOpen: !this.state.tooltipOpen })

    updateParent = (node, path, getNodeKey, value) => {
        this.setState(state => ({
            treeData: changeNodeAtPath({
                treeData: state.treeData,
                path,
                getNodeKey,
                newNode: { ...node, link: value }
            }),
            selectedNode: { ...node, link: value },
            selectedNodePath: path,
            focus: false,
            hasEdits: true
        }));
    }
    addNewNode = (rowInfo) => {
        let newId = uuidv4();
        const newNode = { _id: newId, link: { linkName: "", linkPath: "" } }
        const newTree = addNodeUnderParent({
            treeData: this.state.treeData,
            newNode,
            expandParent: true,
            parentKey: rowInfo ? rowInfo._id : undefined,
            getNodeKey: this.getNodeKey,
        }).treeData;
        walk({// set the new node to the actively selected one
            getNodeKey: this.getNodeKey,
            treeData: newTree,
            callback: (node) => {
                if (node.node._id === newId) {
                    this.setState({
                        focus: true,
                        hasEdits: true,
                        selectedNode: node.node,
                        selectedNodePath: node.path
                    })
                }
            },
        })

        return newTree
    }
    updateTreeData = (treeData) => {

        this.setState({
            treeData: treeData
        })
    }
    removeNode = (path) => {

        const newTree = removeNodeAtPath({
            treeData: this.state.treeData,
            path: path,
            getNodeKey: this.getNodeKey,
        });
        this.setState({
            selectedNode: undefined,
            selectedNodePath: undefined,
            hasEdits: true
        })
        return newTree
    }

    handleNodeClick = (props) => {
        // console.log(props)
        this.setState({
            selectedNode: props.node,
            selectedNodePath: props.path,
            focus: true
        })
    };
    getNodeKey = ({ node }) => {
        return node._id;
    }
    saveChangesHandler = () => {
        this.setState({ isSaving: true })
        return axios.put(process.env.API + `/api/sites/${this.props.match.params.site_id}/navigation`, { site_navigation: this.state.treeData })
            .then(result => {
                this.setState({
                    hasEdits: false,
                    isSaving: false
                })
                toast.success('Navigation successfully updated!', {
                    position: "top-center",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    isSaving: false
                });
                toast.error('There was an explosion while processing your request. Please try again!', {
                    position: "top-center",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
            })
    }

    render() {

        return (
            <DndProvider backend={dndBackend}>

                <React.Fragment>
                <div className="button-container">
                        <Button
                            color="success"
                            disabled={this.state.isLoading ? true : false}
                            onClick={() => {
                                const newTree = this.addNewNode();
                                return this.updateTreeData(newTree);
                            }

                            }
                        >
                            Add Link
                    </Button>
                        {
                            this.state.selectedNode ?
                                <div className="button-container__sublink-container" >
                                    {
                                        this.state.selectedNodePath.length >= this.state.maxDepth ? <Tooltip placement={this.state.tooltipDirection || "top"} toggle={this.toggleTooltip} isOpen={this.state.tooltipOpen} target="t-tip">
                                            <div style={{ "textAlign": "right" }} >X</div>
                                            <p>This link is already at the max depth of {this.state.maxDepth}</p>
                                        </Tooltip>
                                            : ""
                                    }
                                    <span id="t-tip" class="tooltipBtnWrapper">
                                    <Button
                                        
                                        color="success"
                                        onClick={() => {
                                            const newTree = this.addNewNode(this.state.selectedNode);
                                            return this.updateTreeData(newTree);

                                        }
                                        }
                                        disabled={this.state.selectedNodePath.length >= this.state.maxDepth}
                                    >Add SubLink
                                </Button>
                                    </span>

                                    <Button
                                        color="success"
                                        onClick={() => {
                                            const newTree = this.removeNode(this.state.selectedNodePath);
                                            console.log(newTree)
                                            return this.updateTreeData(newTree);

                                        }
                                        }
                                    >Remove Link
                                </Button>
                                </div>
                                : ""
                        }

                        <Button
                            color="primary"
                            style={{ alignSelf: "end" }}
                            disabled={this.state.hasEdits === false}
                            onClick={() => this.saveChangesHandler()}
                        >
                            {this.state.isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                    <hr></hr>

                    <Row>

                        <Col xl={{size: 5, offset: 2}} lg={{ size: 7, order: 1 }} md={{ size: 12, order: 2 }} sm={{ size: 12, order: 2 }} xs={{ size: 12, order: 2 }}>
                            <div style={{ textAlign: "center" }}>
                                <h3>Site Navigation</h3>
                            </div>
                            <div style={{ height: 500, border: "1px solid black", paddingTop: "25px", overflowX: "scroll" }}>
                                {!this.state.isLoading ?
                                    <SortableTree
                                        maxDepth={this.state.maxDepth || 3}
                                        treeData={this.state.treeData}
                                        getNodeKey={this.getNodeKey}
                                        onChange={treeData => this.setState({ treeData })}

                                        isVirtualized={true}
                                        rowHeight={40}
                                        scaffoldBlockPxWidth={40}
                                        generateNodeProps={(props) => {
                                            const { node, path, treeIndex } = props;
                                            return ({
                                                icon: [
                                                    <FontAwesomeIcon icon="grip-vertical" style={{ fontSize: 15 }} />
                                                ],
                                                className:
                                                    this.state.selectedNode ? node._id === this.state.selectedNode._id
                                                        ? "nodeIsSelected" : ""
                                                        : ""
                                                ,
                                                onClick: () => {

                                                    this.handleNodeClick(props);
                                                },

                                                title: (
                                                    <div className={this.state.selectedNode ? 'selectedNode' : ""}>
                                                        <i className='glyphicon glyphicon-link' style={{ color: '#1890FF', fontSize: 18, marginRight: 6 }}></i>
                                                        <span>{node.link.linkName}</span>
                                                        {/* <NavLink node={node} path={path} getNodeKey={getNodeKey} updateParent={this.updateParent} inputValue={node.link} /> */}
                                                    </div>
                                                ),
                                                buttons: [
                                                    <FontAwesomeIcon icon="grip-vertical" style={{ fontSize: 15 }} />,

                                                ],
                                            })
                                        }
                                        }
                                    />
                                    : <Loader size={75} />}
                            </div>
                        </Col>


                        <Col xl={{size:4}} lg={{ size: 5, order: 2, offset: 0 }} sm={{ size: 8, order: 1, offset: 2 }}  xs={{ size: 12, order: 1 }}>
                            <Row style={{ textAlign: "center" }}>
                                <Col lg={12}>
                                    <h3>Navigation Item Details</h3>
                                </Col>

                            </Row>
                            <Row style={{border: "1px solid black", height: "500px", paddingTop: "25px"}}>
                                <Col lg={12}>
                                    {this.state.selectedNode ?
                                        <NavLink focus={this.state.focus} node={this.state.selectedNode} path={this.state.selectedNodePath} getNodeKey={this.getNodeKey} updateParent={this.updateParent} inputValue={this.state.selectedNode.link} />
                                        : ""
                                    }
                                </Col>

                            </Row>
                        </Col>
                    </Row>
                </React.Fragment>

            </DndProvider>
        );
    }
}
