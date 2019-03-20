import React from "react"
import { Form, Row, Col, Input, Button, Icon, Card, Select, Tabs, Table, Divider, Modal, message } from "antd"
import "./index.scss"
import FormItem from "antd/lib/form/FormItem";
import { get_ajax, post_ajax } from "./../../axios/index.js";
import TextArea from "antd/lib/input/TextArea";
import { black, blue } from "ansi-colors";
import AceEditor from "react-ace";
import "brace/mode/python";
import "brace/theme/terminal";

const Option = Select.Option
const TabPane = Tabs.TabPane;

class Apidebug extends React.Component {
    constructor() {
        super();
        this.state = {
            importapi_ids:[],
            importapicase_ids:[],
            importfunapi:{name:'',api_id:'',apicase_id:'',showapi:'请选择接口',showcase:'请选择用例'},
            showcasename:'请选择用例',
            responce: '',
            add_casename: '',
            api_id: '',
            apiinfo: { case_id: [] },
            tabnum: '1',
            tem_name: '',
            tem_key: '',
            tem_value: '',
            column_record: {},
            bodyandheader_visible: false,
            addcase_visible: false,
            importfunction_visible:false,
            dataSource: { headers: [], bodys: [], casename: "", assfun: "", befun: "", params: "" },
            requrl: '',
            casedisabled : true,
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
                            <a href="javascript:;" onClick={this.showModal_HeadersAndBodys.bind(null, record, index)}>编辑</a>
                            <Divider type="vertical" />
                            <a href="javascript:;" onClick={this.delparams.bind(null, index)}>删除</a>
                        </span>
                    ),
                }
            ],
        }
    }
    componentWillMount() {
        this.apiinfo_req()
    }
    componentWillReceiveProps(nextprops) {
        //只有点击后api_id与当前不一样时执行
        if(this.state.api_id != nextprops.match.params.number){
            this.apiinfo_req(nextprops)
        }
    }
    // componentDidUpdate(){
    
    // }

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
        console.log(_dataSource, this.state.tabnum)
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

    showModal_HeadersAndBodys = (record, index) => {
        this.setState({
            column_record: record,
            column_index: index,
            bodyandheader_visible: true,
        });
    }
    
    showModal_ImportFunction = () => {
        get_ajax({
            url: '/GetAllApiids',
            data: {}
        }).then((res) => {
            console.log(res.data.data)
            this.setState({
                importapi_ids:res.data.data,
                importfunction_visible:true,
            })
        })      
    }

    showModal_addcase = () => {
        this.setState({
            addcase_visible: true,
        })
    }

    // 提交headers和bodys的medal框
    headersandbodys_handleOk = (index) => {
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
                    bodyandheader_visible: false,
                })
            }
        })
    }

    //添加测试用例的medal框
    addcase_handleOk = (value) => {
        post_ajax({
            url: '/CreateApiCase',
            data: {
                "api_id": this.state.api_id,
                "apicasename": value,
            }
        }).then((res) => {
            console.log(res)
            if (res.status == '201') {
                this.apiinfo_req()
                this.setState({
                    addcase_visible: false
                })
            }
        })
    }

    handleCancel = (e) => {
        this.setState({
            bodyandheader_visible: false,
            addcase_visible: false,
            importfunction_visible:false,
        });
    }
    //渲染mock数据
    apiinfo_req = (nextprops = this.props) => {
        post_ajax({
            url: '/GetApiInfo',
            data: {
                "api_id": nextprops.match.params.number,
                "apicase_id": '',
            }
        }).then((res) => {
            console.log(res)
            if (res.status == '201') {
                this.setState({
                    apiinfo: { ...res.data.data, },
                    api_id: nextprops.match.params.number,
                    showcasename:'请选择用例',
                    dataSource: { headers: [], bodys: [], casename: "", assfun: "", befun: "", params: "" },
                    responce:'',
                })
            }
        })
    }

    httpaction_handleChange = (value) => {
        let _apiinfo = { ...this.state.apiinfo }
        _apiinfo.httpaction = value
        this.setState({
            apiinfo: _apiinfo
        })
    }

    requrl_handleChange = (e) => {
        let _apiinfo = { ...this.state.apiinfo }
        _apiinfo.requrl = e.target.value
        this.setState({
            apiinfo: _apiinfo
        })
    }

    befun_change = (value) => {
        console.log(value)
        let _dataSource = { ...this.state.dataSource }
        _dataSource.befun = value
        this.setState({
            dataSource: _dataSource
        })
    }

    assfun_change = (value) => {
        let _dataSource = { ...this.state.dataSource }
        _dataSource.assfun = value
        this.setState({
            dataSource: _dataSource
        })
    }

    caseid_handleChange = (value,obj) => {
        console.log(value)
        post_ajax({
            url: '/GetApiInfo',
            data: {
                "api_id": "",
                "apicase_id": value,
            }
        }).then((res) => {
            console.log(res.data.data)
            if (res.status == '201') {
                this.setState({
                    dataSource: res.data.data,
                    case_id: value,
                    showcasename:obj.props.children,
                })
            }
        })
    }

    importapi_change = (value,obj) => {
        let _importfunapi = {...this.state.importfunapi}
        _importfunapi.showapi = obj.props.children
        _importfunapi.api_id = value
        post_ajax({
            url: '/GetApiInfo',
            data: {
                "api_id": value,
                "apicase_id": '',
            }
        }).then((res) => {
            console.log(res)
            
            if (res.status == '201') {
                this.setState({
                    importapicase_ids : res.data.data.case_id,
                    casedisabled : false,
                    importfunapi : _importfunapi,
                })
            }
        })
    }

    importcase_change = (value,obj) => {
        console.log(value)
        let _importfunapi = {...this.state.importfunapi}
        _importfunapi.showcase = obj.props.children 
        _importfunapi.apicase_id = value
        this.setState({
            importfunapi : _importfunapi,
        })
    }

    importapi_handleOK = () => {
        console.log(this.state.dataSource)
        if (this.state.importfunapi.name == '' || this.state.importfunapi.api_id == '' || this.state.importfunapi.apicase_id ==''){
            message.error('请将数据输入完整')
        }else{
            let script = "\n"+this.state.importfunapi.name + " = perform_api(" + this.state.importfunapi.api_id + ',' + this.state.importfunapi.apicase_id + ')'
            let _dataSource = {...this.state.dataSource}
            _dataSource.befun = _dataSource.befun.concat(script)
            this.setState({
                dataSource:_dataSource,
                importfunapi:{name:'',api_id:'',apicase_id:'',showapi:'请选择接口',showcase:'请选择用例'},
                casedisabled : true,
                importfunction_visible : false,
            })
            console.log(this.state.dataSource)
        }
    }

    

    save = (callback) => {
        if (!this.state.apiinfo.requrl) {
            message.error('请输入URL')
        }
        let _apiinfo = { ...this.state.apiinfo }
        _apiinfo.case_id = this.state.case_id
        let apiinfo_all = Object.assign(this.state.dataSource, _apiinfo, { "api_id": this.state.api_id })
        if (apiinfo_all.case_id == undefined) {
            message.error('未选择测试用例')
        } else {
            post_ajax({
                url: '/SaveApiAndCase',
                data: {
                    data: JSON.stringify({ ...apiinfo_all, apicasedetail: '' })
                }
            }).then((res) => {
                // 如果callback为空则不执行callback（）
                if (typeof callback == 'function') callback();
                if (res.status == '201') {
                    message.success('保存成功')
                }
            })
        }
    }
    //执行接口，先保存将参数上传，在执行
    run = () => {
        this.setState({
            responce: ''
        })
        this.save(() => {
            post_ajax({
                url: '/apisingle',
                data: {
                    api_id: this.state.api_id,
                    apicase_id: this.state.case_id,
                }
            }).then((res) => {
                console.log(res)
                if (res.status == '202' | res.status == '201') {
                    message.success('执行成功')
                    this.setState({
                        responce: JSON.stringify(res.data.data)
                    })
                } else {
                    message.error('执行失败')
                }
            })
        });
    }
    render() {
        // getFieldDecorator是antd框架内获取表单数据的方法
        console.log(this.state.apiinfo)
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
                            <Button type="primary" onClick={this.run}>运行<Icon type="caret-right" /></Button>
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
                                    <Select value={this.state.showcasename} style={{ width: 120 }} onChange={this.caseid_handleChange}>
                                        {this.state.apiinfo.case_id.map((item) => {
                                            return <Option key={item.case_id}>{item.casename}</Option>
                                        })
                                        }
                                    </Select>
                                    <Divider type="vertical" />
                                    <Button onClick={this.showModal_addcase} >添加用例</Button>
                                </div>
                            }
                            onChange={(activeKey) => { this.setState({ tabnum: activeKey }) }}
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
                                <AceEditor
                                    value={this.state.dataSource.befun}
                                    height='300px'
                                    width='100%'
                                    mode="python"
                                    theme="terminal"
                                    name="blah2"
                                    fontSize={16}
                                    showPrintMargin={true}
                                    showGutter={true}
                                    highlightActiveLine={true}
                                    onChange={this.befun_change}
                                    editorProps={{ $blockScrolling: true }}
                                />
                                <Button type="primary" onClick={this.showModal_ImportFunction} >前置接口导入</Button>
                            </TabPane>
                            <TabPane tab="assert" key="4">
                                <AceEditor
                                    value={this.state.dataSource.assfun}
                                    height='300px'
                                    width='100%'
                                    mode="python"
                                    theme="terminal"
                                    name="blah2"
                                    fontSize={16}
                                    showPrintMargin={false}
                                    showGutter={true}
                                    highlightActiveLine={true}
                                    onChange={this.assfun_change}
                                    editorProps={{ $blockScrolling: true }}
                                />
                            </TabPane>
                        </Tabs>
                    </Row>
                    <Divider />
                    <Row>
                        <AceEditor
                            value={this.state.responce}
                            height='300px'
                            width='100%'
                            mode="python"
                            theme="terminal"
                            name="blah2"
                            fontSize={16}
                            showPrintMargin={false}
                            showGutter={false}
                            highlightActiveLine={false}
                            editorProps={{ $blockScrolling: false }}
                        />
                        {/* <TextArea value={this.state.responce} rows={10} style={{background:"#000000",color:'#FFFFFF'}} /> */}
                    </Row>
                </Card>
                <Modal
                    title="参数输入"
                    visible={this.state.bodyandheader_visible}
                    onOk={this.headersandbodys_handleOk.bind(null, this.state.column_index)}
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
                <Modal
                    title="添加测试用例"
                    visible={this.state.addcase_visible}
                    onOk={this.addcase_handleOk.bind(null, this.state.add_casename)}
                    onCancel={this.handleCancel}
                >
                    <Input value={this.state.add_casename} onChange={(e) => { this.setState({ add_casename: e.target.value }) }} />
                </Modal>
                <Modal
                    title="选择导入的测试用例"
                    visible={this.state.importfunction_visible}
                    onOk={this.importapi_handleOK}
                    onCancel={this.handleCancel}
                >
                <Row>
                    <Col span="9">
                        <Input value={this.state.importfunapi.name} style={{ width: 150 }} placeholder='输入变量名' onChange={(e) => { let _importfunapi = {...this.state.importfunapi}; _importfunapi.name = e.target.value ;this.setState({importfunapi:_importfunapi})}} />
                    </Col>
                    <Col span="8">
                        <Select value={this.state.importfunapi.showapi} style={{ width: 130 }} onChange={this.importapi_change}>
                            {this.state.importapi_ids.map((item) => {
                                return <Option key={item.api_id}>{item.api_name}</Option>
                            })}
                        </Select>
                    </Col>
                    <Col span="6">
                        <Select value={this.state.importfunapi.showcase} style={{ width: 130 }} onChange={this.importcase_change} disabled={this.state.casedisabled}>
                        {this.state.importapicase_ids.map((item) => {
                                return <Option key={item.case_id}>{item.casename}</Option>
                            })}
                        </Select>
                    </Col>
                </Row>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(Apidebug);