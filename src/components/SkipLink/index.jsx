import React from "react";
import styled from "styled-components";

const SkipLinkContainer = styled.div`
  position: relative;
`;

const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 6px;
  background: #007bff;
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  transition: top 0.3s;

  &:focus {
    top: 6px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border: 2px solid white;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const SkipLinkComponent = ({ targetId, children = "Skip to main content" }) => {
  return (
    <SkipLinkContainer>
      <SkipLink href={`#${targetId}`}>{children}</SkipLink>
    </SkipLinkContainer>
  );
};

export default SkipLinkComponent;
