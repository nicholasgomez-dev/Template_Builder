import React, { useEffect, useState } from "react";
import API from '../../../actions/portalAPI';
import Loader from '../../../components/Loader/Loader';
import { FormGroup, Form, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'

const BuildTemplate = () => {

    return (
        <div>
            <h1 className="page-title">Build Template</h1>
        </div>
    )
}

export default BuildTemplate;