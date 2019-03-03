import React from "react"
import { Form, Row, Col, Input, Button, Icon, Card, Select, Tabs, Table, Divider, Modal, message } from "antd"
import "./index.scss"
import FormItem from "antd/lib/form/FormItem";
import {get_ajax,post_ajax} from "./../../axios/index.js";
import TextArea from "antd/lib/input/TextArea";
import { black, blue } from "ansi-colors";

const Option = Select.Option
const TabPane = Tabs.TabPane;

class Apidebug extends React.Component {
    constructor() {
        super();
        this.state = {
            apiinfo:{case_id:[]},
            pushapiinfo:{},
            befun: '',
            assfun: '',
            tabnum: '1',
            tem_name: '',
            tem_key: '',
            tem_value: '',
            column_record: {},
            visible: false,
            dataSource: {headers:[],bodys:[],casename: "",assfun: "",befun:"" },
            requrl: '',
            testcase: [
                { 'id': '1', 'name': 'asdfasdfdsafsadfdsfdsf' },
                { 'id': '2', 'name': 'case2' }
            ],
            columns: [
                {
                    title: '名称',
                    dataIndex: 'name',
                    width: 300,
                },
                {
                    title: '键',
                    dataIndex: 'key',
                    width: 300,
                },
                {
                    title: '值',
                    dataIndex: 'value',
                    width: 300,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record, index) => (
                        <span>
                            <a href="javascript:;" onClick={this.showModal.bind(null, record, index)}>编辑</a>
                            <Divider type="vertical" />
                            <a href="javascript:;" onClick={this.delparams.bind(null, index)}>删除</a>
                        </span>
                    ),
                }
            ],
        }
    }
    componentWillMount() {
        this.apiinfo_req();
        console.log(this.state.apiinfo)
    }

    // 删除headers和bodys表格中的行
    delparams = (index) => {
        let _dataSource = { ...this.state.dataSource }
        if (this.state.tabnum === '1') {
            _dataSource.headers.splice(index, 1)
        } else if (this.state.tabnum === '2') {
            _dataSource.bodys.splice(index, 1)
        }
        this.setState({
            dataSource: _dataSource
        })
    }

    // 添加headers和bodys表格中的行
    addparams = () => {
        let _dataSource = { ...this.state.dataSource }
        console.log(_dataSource,this.state.tabnum)
        if (this.state.tabnum === '1') {
            console.log('ok')
            _dataSource.headers.push({ name: 'lili', key: '请输入', value: '请输入' })
        } else if (this.state.tabnum === '2') {
            _dataSource.bodys.push({ name: 'lucy', key: '请输入', value: '请输入' })
        }
        this.setState({
            dataSource: _dataSource
        })
        console.log.bind(this.state.dataSource)
    }

    showModal = (record, index) => {
        console.log(record, index)
        this.setState({
            column_record: record,
            column_index: index,
            // column_record: 
            visible: true,
        });
    }

    // 提交前置脚本和断言脚本
    getscript = (value) => {
        console.log('123')
        let _dataSource = { ...this.state.dataSource }
        if (this.state.tabnum === '3') {
            _dataSource.befun = value
        } else if (this.state.tabnum === '4') {
            _dataSource.assfun = value
        }
        this.setState({
            dataSource: _dataSource,
            visible: false,
        })
    }

    // 提交headers和bodys的medal框
    handleOk = (index) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let obj = { name: values.name, key: values.key, value: values.value }
                let _dataSource = { ...this.state.dataSource }
                if (this.state.tabnum === '1') {
                    _dataSource.headers[index] = obj
                } else if (this.state.tabnum === '2') {
                    _dataSource.bodys[index] = obj
                }
                this.setState({
                    dataSource: _dataSource,
                    visible: false,
                })
            }
        })

    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    //渲染mock数据
    apiinfo_req = () => {
        post_ajax({
            url: '/GetApiInfo',
            data: {
                "api_id":this.props.match.params.number,
                "apicase_id":'',
            }
        }).then((res) => {
            console.log(res)
            if (res.status == '201') {
                this.setState({
                    apiinfo:res.data.data,
                })
            }
        })
    }

    httpaction_handleChange = (value) => {
        let _apiinfo = { ...this.state.apiinfo }
        _apiinfo.httpaction=value
        this.setState({
            apiinfo:_apiinfo
        })
    }

    requrl_handleChange = (e) => {
        let _apiinfo = { ...this.state.apiinfo }
        _apiinfo.requrl=e.target.value
        this.setState({
            apiinfo:_apiinfo
        })
    }

    caseid_handleChange = (value) => {
        console.log(value)
        post_ajax({
            url: '/GetApiInfo',
            data: {
                "api_id":"",
                "apicase_id":value,
            }
        }).then((res) => {
            console.log(res)
            if (res.status == '201') {
                this.setState({
                    
                })
            }
        })
    }

    save = () => {
        console.log(this.state.befun)
        if (!this.state.requrl) {
            message.error('请输入URL')
        }
    }
    render() {
        
        // getFieldDecorator是antd框架内获取表单数据的方法
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Card>
                    <Row>
                        <Col span="4">
                            <Select value={this.state.apiinfo ? this.state.apiinfo.httpaction : "GET"} style={{ width: 120 }} onChange={this.httpaction_handleChange}>
                                <Option value="GET">GET</Option>
                                <Option value="POST">POST</Option>
                            </Select>
                        </Col>
                        <Col span="13">
                            <Input value={this.state.apiinfo ? this.state.apiinfo.requrl : ""} onChange={this.requrl_handleChange} addonBefore="Http://" style={{ width: 500 }} />
                        </Col>
                        <Col>
                            <Button type="primary" onClick={this.save}>保存<Icon type="save" /></Button>
                            <Divider type="vertical" />
                            <Button type="primary">运行<Icon type="caret-right" /></Button>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        {/* tab组件中包含用例新建，选择功能及用例参数 */}
                        <Tabs
                            tabBarExtraContent={
                                <div>
                                    <Button type="primary" onClick={this.addparams}><Icon type="plus-square" /></Button>
                                    <Divider type="vertical" />
                                    <Select defaultValue="请添加用例" style={{ width: 120 }} onChange={this.caseid_handleChange}>
                                        {this.state.apiinfo.case_id.map((item) => {
                                            return <Option key={item.case_id}>{item.casename}</Option>
                                            })
                                        }
                                    </Select>
                                    <Divider type="vertical" />
                                    <Button>添加用例</Button>
                                </div>
                            }
                            onChange={(activeKey) => { this.setState({ tabnum: activeKey })}}
                        >
                            <TabPane tab="headers" key="1">
                                <Table
                                    columns={this.state.columns}
                                    dataSource={this.state.dataSource.headers}
                                    pagination={false}
                                    scroll={{ y: 160 }}
                                >
                                </Table>
                            </TabPane>
                            <TabPane tab="bodys" key="2">
                                <Table
                                    columns={this.state.columns}
                                    dataSource={this.state.dataSource.bodys}
                                    pagination={false}
                                    scroll={{ y: 160 }}
                                >
                                </Table>
                            </TabPane>
                            <TabPane tab="before" key="3">
                                <TextArea defaultValue={this.state.befun} 
                                rows={10} 
                                onChange={e => this.setState({ befun: e.target.value})} 
                                style={{background:'#000000',color:'#00CC00'}} />
                            </TabPane>
                            <TabPane tab="assert" key="4">
                                <TextArea defaultValue={this.state.assfun} rows={10} onChange={e => this.setState({ assfun: e.target.value})} />
                            </TabPane>
                        </Tabs>
                    </Row>
                    <Divider />
                    <Row>
                        <TextArea value='response' rows={10} style={{background:"#000000",color:'#FFFFFF'}} />
                    </Row>
                </Card>
                <Modal
                    title="参数输入"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(null, this.state.column_index)}
                    onCancel={this.handleCancel}
                >
                    <Form layout="vertical">
                        <Form.Item label="键">
                            {getFieldDecorator('key', {
                                initialValue: this.state.column_record.key,
                                rules: [{ required: true, message: '请输入参数的键' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="值">
                            {getFieldDecorator('value', {
                                initialValue: this.state.column_record.value,
                                rules: [{ required: true, message: '请输入参数的值!' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="名称">
                            {getFieldDecorator('name', {
                                initialValue: this.state.column_record.name,
                            })(<Input type="textarea" />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(Apidebug);