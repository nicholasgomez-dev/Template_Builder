import React from 'react'
import './Array.scss'
import Text from '../Text/Text'
import RichInput from '../RichText/RichText'
import RawHTML from '../RawHTML/RawHTML'
import ColorSelector from '../ColorSelector/ColorSelector';
import ImageInsert from '../ImageInsert/ImageInsert';
import Checkbox from '../Checkbox/Checkbox';
import { v4 as uuidv4 } from 'uuid';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from '../Select/select'
import Date from '../Date/Date'

class Array extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            componentIndex: '',
            formIndex: 0,
            baseComponents: {
                text: Text,
                richinput: RichInput,
                rawhtml: RawHTML,
                color: ColorSelector,
                image: ImageInsert,
                array: Array,
                checkbox: Checkbox,
                select: Select,
                date: Date
            }
        }
        this.updateParent = this.updateParent.bind(this)
        this.showForm = this.showForm.bind(this)
    }


    addItem() {
        let newArray = JSON.parse(JSON.stringify(this.props.array)) // copy of props array
        let newArrayComp = JSON.parse(JSON.stringify(this.props.arrayComp)) // copy of props array
        const newComponent = this.buildNewArrayElement(newArrayComp)

        newArray.push(newComponent)

        this.props.updateParent(this.props.name, newArray, this.props.id, this.props.parent) // updates parent component with array data
    }
    /**
     * 
     * @param {Object} arrayComp - contains an identifier and componentSet array if type array
     */
    buildNewArrayElement = (arrayComp) => {
        const newValuesObj = arrayComp.componentSet.reduce((obj, comp) => {
            if (comp.type === "array") { 
                obj[comp.identifier] = [this.buildNewArrayElement(comp)] //recursive function for nested arrays
            } else {
                obj[comp.identifier] = "";
            }
            return obj
        }, {})
        let newComponent = {} // builds component for new array
        newComponent.value = newValuesObj
        newComponent.identifier = uuidv4()
        return newComponent
    }
    removeItem(name) {

        let newArray = JSON.parse(JSON.stringify(this.props.array)) // copy of state array
        newArray.splice(this.state.componentIndex, 1)


        this.props.updateParent(this.props.name, newArray, this.props.id, this.props.parent)

        this.closeModal(name)
        this.showForm(0) // defaults to first in array after deletion of item
    }

    duplicateItem(item) {
        let newArray = JSON.parse(JSON.stringify(this.props.array)) // copy of state array
        let arrayComp = JSON.parse(JSON.stringify(this.props.arrayComp)) // copy of props array
        let saveVals = {};
        item.map((d,i) => { 
            if(d.props?.array !== undefined){
                saveVals[d.props.id] = d.props.array
            }else{
                let comp = arrayComp.componentSet[i]
                let compDict = comp['identifier']
                
                if (comp.type === "array") {
                    saveVals[compDict] = [this.duplicateItem(comp)] //recursive function for nested arrays
                } else {
                    saveVals[compDict] = d.props.inputValue;
                }
            }
        });
        
        let newComponent = {}; // builds component for new array
        newComponent.value = saveVals;
        newComponent.identifier = uuidv4();
        newArray.push(newComponent);

        this.props.updateParent(this.props.name, newArray, this.props.id, this.props.parent) // updates parent component with array data
    }

    openModal(name, index) {
        this.setState({
            [name]: true,
            componentIndex: index
        })
    }

    closeModal(name) {
        this.setState({
            [name]: false,
            componentIndex: ''
        })
    }

    updateParent(name, value, id, parent) {
        let copyArr = JSON.parse(JSON.stringify(this.props.array));
        let componentObject = copyArr.find(comp => comp.identifier === parent);

        console.log(parent)
        console.log(value)
        console.log(id)
        console.log(this.props.name)
        console.log(componentObject)
        console.log(name)
        console.log(copyArr)
        componentObject.value[id] = value;

        this.props.updateParent(this.props.name, copyArr, this.props.id, this.props.parent)
    }

    handleDragEvent(result) {
        if (!result.destination) return

        let oldIndex = result.source.index
        let newIndex = result.destination.index
        let newArray = JSON.parse(JSON.stringify(this.props.array))

        let [item] = newArray.splice(oldIndex, 1)
        newArray.splice(newIndex, 0, item)

        this.setState({
            formIndex: newIndex
        })

        this.props.updateParent(this.props.name, newArray, this.props.id, this.props.parent)
    }

    showForm(index) {
        this.setState({
            formIndex: index
        })
    }

    render() {
        let components = this.props.array.map((input, i) => {
            let data = this.props.arrayComp.componentSet.map((comp) => {

                const InputComponent = this.state.baseComponents[comp.type.toLowerCase()];
                if (comp.type.toLowerCase() === "array") {
                    return (
                        <InputComponent
                            key={comp.identifier}
                            array={input.value[comp.identifier]}
                            arrayComp={comp}
                            name={comp.identifier}
                            title={comp.title}
                            updateParent={this.updateParent}
                            options={comp.content}
                            id={comp.identifier}
                            showDescription={comp.showDescription}
                            description={comp.description}
                            parent={input.identifier}
                            values={this.props.values}
                        />
                    )
                }
                
                else if (comp.type.toLowerCase() === "select") {
                    console.log(comp)
                    console.log(input)
                    console.log(this.props)

                    return (
                        <Select key={comp.identifier} 
                        type="array"
                        name={this.props.hasOwnProperty("values") ? this.props.values[comp.content[1].identifier] : "noName"} 
                        title={comp.title}
                        updateParent={this.updateParent}
                        showDescription={this.props.showDescription}
                        description={comp.description} 
                        options={comp.content} 
                        selectedOption={input.value[comp.identifier]} 
                        optionValues={this.props.hasOwnProperty("values") ? this.props.values : []} 
                        id={comp.identifier} 
                        parent={input.identifier}
                        ></Select>
                    )
                } 
                return (
                    <InputComponent
                        name={comp.identifier}
                        title={comp.title}
                        updateParent={this.updateParent}
                        key={comp.identifier}
                        id={comp.identifier}
                        inputValue={input.value[comp.identifier]}
                        showDescription={comp.showDescription}
                        description={comp.description}
                        parent={input.identifier}
                    />
                )
            })

            return (
                <div key={input.identifier} className='array-compCont' style={i === this.state.formIndex ? { display: 'block' } : { display: 'none' }}>
                    <Button className='array-button' color="danger" onClick={() => this.openModal('modal', i)}>Remove</Button>
                    <Button className='array-button duplicate-button' color="primary" onClick={() => this.duplicateItem(data)}>+ Duplicate</Button>
                    <div>
                    {data}
                    </div>
                    
                </div>
            )
        })

        let tabs = this.props.array.map((input, i) => {
            return (
                <Draggable key={input.identifier} draggableId={input.identifier} index={i}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='array-tabParent'>
                            <div onClick={() => this.showForm(i)} className={i === this.state.formIndex ? "array-tabCont selected" : "array-tabCont"}>
                                <div className='array-tabText'>{i + 1}</div>
                            </div>
                        </div>
                    )}
                </Draggable>
            )
        })

        return (
            <div className='array-cont'>
                <div className='array-title'>{this.props.title}</div>
                <div className='array-description'>{this.props.description}</div>
                <div className='array-components'>
                    <div className="tabsContainer">
                        <DragDropContext onDragEnd={(result) => this.handleDragEvent(result)}>
                            <Droppable droppableId="components" direction="horizontal">
                                {(provided) => (
                                    <ul className="array-render" {...provided.droppableProps} ref={provided.innerRef}>
                                        {tabs}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <div className='array-tabParentButton'>
                            <div onClick={() => this.addItem()} className={"array-addButton"} style={{ cursor: 'pointer' }}>
                                <div className='array-tabText'>+</div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        {components}
                    </div>
                </div>
                <Modal isOpen={this.state.modal}>
                    <ModalHeader toggle={() => this.closeModal('modal')}>Confirm Template</ModalHeader>
                    <ModalBody className="bg-white">
                        <div className="youSure">You are about to delete a component.</div>
                        <br></br>
                        <div className="youSure">This action can't be undone. Are you sure you would like to continue?</div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="gray" onClick={() => this.closeModal('modal')}>Close</Button>
                        <Button onClick={() => this.removeItem('modal')} color="primary">Confirm</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Array