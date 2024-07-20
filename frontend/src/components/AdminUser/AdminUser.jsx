import React, { useEffect, useRef, useState } from 'react'
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { WrapperHeader } from './style'
import { Button, Form, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64 } from '../../utils'
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import Highlighter from 'react-highlight-words'

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state.user)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
    })
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
    })

    const [form] = Form.useForm();

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            const res = UserService.updateUser(id, token, { ...rests })
            return res
        },
    );

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id, token } = data
            const res = UserService.deleteUser(id, token)
            return res
        },
    );

    const getAllUsers = async () => {
        const res = await UserService.getAllUser()
        return res
    }

    const fetchGetDetailsUser = async () => {
        const res = await UserService.getDetailsUser(rowSelected)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (rowSelected) {
            setIsLoadingUpdate(true)
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected])

    const handleDetailsUser = () => {
        setIsOpenDrawer(true)
    }

    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted

    const queryUser = useQuery({
        queryKey: ['user'],
        queryFn: getAllUsers
    });
    const { isLoading: isLoadingUsers, data: users } = queryUser
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsUser} />
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex)
    }
    
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                {
                  text: 'True',
                  value: 'TRUE',
                },
                {
                  text: 'False',
                  value: 'FALSE',
                },
            ],
            onFilter: (value, record) => {
                if (value === 'TRUE') {
                    return record.isAdmin === 'TRUE'
                }
                return record.isAdmin === 'FALSE'
            },
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return {...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE'}
    })

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Cập nhật người dùng thành công')
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error('Cập nhật người dùng không thành công')
        }
    }, [isSuccessUpdated, isErrorUpdated])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Xóa tài khoản thành công')
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error('Xóa tài khoản không thành công')
        }
    }, [isSuccessDeleted, isErrorDeleted])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = async () => {
        setIsLoading(true);
        try {
            await mutationDeleted.mutateAsync({ id: rowSelected, token: user?.access_token }, {
                onSettled: () => {
                    queryUser.refetch();
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
    };

    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUser({
            ...stateUser,
            image: file.preview
        })
    }

    const handleOnchangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            image: file.preview
        })
    }

    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    };
                }}/>
            </div>
            <DrawerComponent title='Thông tin tài khoản' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input name!' }]}
                        >
                            <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name"/>
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input email!' }]}
                        >
                            <InputComponent value={stateUserDetails.email} onChange={handleOnChangeDetails} name="email"/>
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input phone number!' }]}
                        >
                            <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone"/>
                        </Form.Item>

                        {/* <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please upload product image!' }]}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </WrapperUploadFile>
                                {stateUserDetails?.image && (
                                    <img src={stateUserDetails?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }} alt="avatar"/>
                                )}
                            </div>
                        </Form.Item> */}

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent forceRender title="Xóa tài khoản" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                <Loading isLoading={isLoading}>
                    <div>Bạn có chắc muốn xóa tài khoản này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminUser