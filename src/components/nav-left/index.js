import React from 'react'
import { Menu, Button, Modal, Form, Input, message, Radio, Select } from 'antd'
import './index.scss'
import { NavLink } from "react-router-dom"

const Option = Select.Option;
const SubMenu = Menu.SubMenu;
const MenuConfig = [
    {
        'id': 1, 'text': '一级测试', 'value': '', 'item':
            [
                { 'id': 3, 'text': '二级测试', 'value': '1' },
                { 'id': 26, 'text': 'bala', 'value': '23','item':[] }
            ]
    }, {
        'id': 5, 'text': '222', 'value': '', 'item':
            [
                {
                    'id': 6, 'text': '权威', 'value': '', 'item':
                        [
                            { 'id': 30, 'text': '4级测试', 'value': '123' },
                        ]
                }
            ]
    }, {
        'id': 10, 'text': '3级测试', 'value': '111',
    }
];



class Navleft extends React.Component {
    constructor() {
        super();
        this.state = {
            menuc: MenuConfig,
            visible: false,
            residences: [
                { 'id': 1, 'text': '一级测试' },
                { 'id': 3, 'text': '二级测试' },
                { 'id': 26, 'text': 'bala' },
                { 'id': 5, 'text': '222' }],
        }
    }
    componentWillMount() {
        let menuTreeNode = this.renderMenu(this.state.menuc);
        console.log(menuTreeNode)

        this.setState({
            menuTreeNode
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
                <NavLink to={item.value}>{item.text}</NavLink>
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
                console.log(catalogue.modifier)
                if (catalogue.modifier === 'parent') {
                    this.setState({
                        menuc: this.state.menuc.concat({
                            name: catalogue.name,
                            key: '',
                        }),
                        visible: false,
                    }, () => {
                        this.setState({
                            menuTreeNode: this.renderMenu(this.state.menuc)
                        })
                    });
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
                    {this.state.menuTreeNode}
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
                            {getFieldDecorator('residence', {
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
                                    {this.state.residences.map((item) => {
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