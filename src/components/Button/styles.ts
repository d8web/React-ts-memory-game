import styled from "styled-components"

export const Container = styled.div`
    width: 200px;
    height: 50px;
    display: flex;
    background-color: #1550ff;
    border-radius: 10px;
    cursor: pointer;
    opacity: 1;
    transition: all ease .3s;

    &:hover {
        opacity: .85;
    }
`

export const IconArea = styled.div`
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid rgba(255,255,255,.2);
    padding: 0 15px;
`

export const Icon = styled.img`
    height: 20px;
`

export const Label = styled.div`
    height: inherit;
    color: #fff;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
`