import React from "react"
import { Form, Row, Col, Input, Button, Icon, Card, Select, Tabs, Table, Divider, Modal, message } from "antd"
import FormItem from "antd/lib/form/FormItem";
import { get_ajax, post_ajax } from "./../../axios/index.js";
import TextArea from "antd/lib/input/TextArea";
import { black, blue } from "ansi-colors";
import AceEditor from "react-ace";
import "brace/mode/python";
import "brace/theme/terminal";




export default class Login extends React.Component{
    constructor() {
        super();
        this.state = {
            projects: [{ id: 1, name: '花生' }, { id: 2, name: '苹果' }, { id: 3, name: '杨桃' }],
            value: ''
        }
    }
    
    handleChange = (e,f) => {
        console.log(e,f.props.children)
        this.setState({
            value: f.props.children
        })
    }
    render() {
        return (
            <div>
                <Select value={this.state.value} style={{ width: 120 }} onChange={this.handleChange}>
                {this.state.projects.map((item) => {
                    return <Select.Option key={item.id}>{item.name}</Select.Option>
                })
                }
                </Select>
            </div>
        );
    }
}



