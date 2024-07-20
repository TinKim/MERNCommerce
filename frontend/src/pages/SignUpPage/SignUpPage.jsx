import React, { useEffect, useState } from "react";
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from '../../assets/images/logo-login.png';
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService';
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const mutation = useMutationHooks(
        data => UserService.signupUser(data)
    );

    const { data, isSuccess, isError } = mutation;
        
    useEffect(() => {
        if (isSuccess) {
            message.success('Đăng ký thành công')
            handleNavigateSignIn()
        } else if (isError) {
            message.error('Đăng ký không thành công')
        }
    }, [isSuccess, isError])

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }

    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }

    const handleSignUp = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            await mutation.mutateAsync({
                email,
                password,
                confirmPassword
            });
        } catch (error) {
            // Cập nhật errorMessage khi có lỗi
            setErrorMessage(error.message || 'Đã xảy ra lỗi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh'}}>
            <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1>Xin chào</h1>
                    <p>Đăng ký tài khoản</p>
                    <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <InputForm placeholder="password" style={{ marginBottom: '10px' }} type={isShowPassword ? "text" : "password"} 
                            value={password} onChange={handleOnchangePassword}/>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <InputForm placeholder="confirm password" type={isShowConfirmPassword ? "text" : "password"} 
                            value={confirmPassword} onChange={handleOnchangeConfirmPassword}/>
                    </div>
                    {errorMessage && <span style={{ color: 'red', fontSize: 'small', paddingTop: '5px' }}>{errorMessage}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                        disabled={!email.length || !password.length || !confirmPassword.length}
                            onClick={handleSignUp}
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin: '26px 0 10px'
                            }} 
                            textButton={'Đăng ký'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </Loading>
                    <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}>Đăng nhập</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px" />
                    <h2>Mua sắm tại Tiki</h2>
                </WrapperContainerRight>
            </div>
        </div>
    );
}

export default SignUpPage;