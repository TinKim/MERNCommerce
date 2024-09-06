import styled from "styled-components";

export const WrapperContainer = styled.div`
    padding: 15px;
    max-width: 1100px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 15px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

export const WrapperStatus = styled.div`
    padding: 8px;
    margin-bottom: 5px;
    border-left: 6px solid #007bff;
    background-color: #f0f4f8;
    border-radius: 4px;
    color: #333;
    font-size: 13px;
    font-weight: 500;
`;

export const WrapperHeaderItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
    border-radius: 6px;
    color: #495057;
    font-size: 18px;
`;

export const WrapperFooterItem = styled.div`
    width: 1051px;
    padding: 12px;
    background: #f8f9fa;
    border-top: 2px solid #dee2e6;
    border-radius: 6px;
    color: #495057;
    font-size: 14px;
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

export const WrapperListOrder = styled.div`
    margin-top: 15px;
`;

export const WrapperItemOrder = styled.div`
    width: 1075px;
    display: flex;
    flex-direction: column;
    padding: 12px;
    margin-bottom: 10px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
    transition: background 0.3s ease, transform 0.3s ease;
    
    &:hover {
        background: #f9f9f9;
        transform: scale(1.01);
    }
`;
