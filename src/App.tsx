import styled, { keyframes } from "styled-components";
import { useState } from "react";

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColor};
`;

const H1 = styled.h1`
  color: ${(props) => props.theme.textColor};
`;

interface DummyProps {
  text: string;
  active ?: boolean;
}

function Dummy({text = "default", active=false}:DummyProps){
  return <h1>{text}</h1>
}

function App() {
  return (
    <Container>
      <Dummy active text="hello"/>
    </Container>
  );
}


export default App;
