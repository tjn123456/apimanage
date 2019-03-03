import React from 'react'
import { Menu, Button, Modal, Form, Input, message, Radio, Select } from 'antd'
import './index.scss'
import { NavLink,Link } from "react-router-dom"
import { get_ajax, post_ajax } from "@/axios";


const Option = Select.Option;
const SubMenu = Menu.SubMenu;


class Navleft extends React.Component {
    constructor() {
        super();
        this.state = {
            menuc: [],
            visible: false,
            parent: [],
        }
    }
    componentWillMount() {
        this.request();
    }

    componentDidMount() {
        
    }

    //获取页面目录数据,modal父级目录数据
    request = () => {
        console.log("进入接口")
        get_ajax({
            url: '/ApiPath',
        }).then((res) => {
            console.log(res)
            if (res.status == '201') {
                console.log("接口内部")
                this.setState({
                    menuc: res.data.data.menu,
                    parent: res.data.data.parent,
                })
                console.log(this.state.menuc)
            }
        })
    }

    //菜单渲染
    renderMenu = (data) => {
        return data.map((item) => {
            if ('item' in item) {
                return (
                    <SubMenu title={item.text} key={item.id}>
                        {this.renderMenu(item.item)}
                    </SubMenu>
                )
            }
            return <Menu.Item title={item.text} key={item.id}>
                <NavLink to={`/apidebug/${item.value}`}>{item.text}</NavLink>
            </Menu.Item>
        })
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    //追加目录
    handleOk = (e) => {
        let catalogue = this.props.form.getFieldsValue();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                if (catalogue.modifier === 'parent') {
                    post_ajax({
                        url: '/ApiPath',
                        data: {
                            "api_name":values.name,
                            "add_type":"1",
                            "apifa_id":values.parent_id,
                        }
                    }).then((res) => {
                        if (res.status == '201') {
                            this.setState({
                                visible:false
                            })
                            this.request();
                        }
                    })
                }else if(catalogue.modifier === 'child'){
                    post_ajax({
                        url: '/ApiPath',
                        data: {
                            "api_name":values.name,
                            "add_type":"2",
                            "apifa_id":values.parent_id,
                        }
                    }).then((res) => {
                        if (res.status == '201') {
                            this.setState({
                                visible:false
                            })
                            this.request();
                        }else{
                            message.error(res.data.data.data)
                        }
                    })
                }
            } else {
                message.error(`目录内容输入有误`)
            }
        })

        console.log(this.state.menuc)
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }


    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div >
                <div className='logo'>
                    <img src="/assets/api.svg" alt="" />
                    <h1>API</h1>
                </div>
                <Button type="primary" ghost="true" icon="plus" size="small" block onClick={this.showModal}>
                    创建节点
                </Button>
                <Menu
                    theme='dark'
                >
                    {this.renderMenu(this.state.menuc)}
                
                </Menu>
                <Modal
                    title="创建节点"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    centered={true}
                >
                    <Form>
                        <Form.Item label="目录或接口">
                            {
                                getFieldDecorator('name', {
                                    initialValue: '',
                                    rules: [{
                                        required: true,
                                        message: '名称不能为空'
                                    }],
                                })(
                                    <Input placeholder='请输入目录名称' />
                                )
                            }
                        </Form.Item>
                        <Form.Item label="父级目录">
                            {getFieldDecorator('parent_id', {
                                initialValue: '',
                                rules: [],
                            })(
                                <Select
                                    showSearch
                                    style={{ width: 470 }}
                                    placeholder="选择父目录"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {this.state.parent.map((item) => {
                                        return <Option key={item.id}>{item.text}</Option>
                                    })}

                                </Select>

                            )}
                        </Form.Item>
                        <Form.Item >
                            {getFieldDecorator('modifier', {
                                initialValue: 'parent',
                            })(
                                <Radio.Group>
                                    <Radio value="parent">目录</Radio>
                                    <Radio value="child">接口</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(Navleft);