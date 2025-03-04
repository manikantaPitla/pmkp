import React from "react";
import { HeaderWrapper } from "./styled-component";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

function Header() {
  return (
    <HeaderWrapper>
      <Link to="/login">
        <Button>Login</Button>
      </Link>
    </HeaderWrapper>
  );
}

export default Header;
