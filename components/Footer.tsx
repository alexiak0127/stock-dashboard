"use client";

import styled from "styled-components";

const FooterWrapper = styled.footer`
  position: sticky;
  bottom: 0;
  z-index: 50;
  background-color: #020824;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Inner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  color: #c4c4c5ff;
  text-align: center;
`;

export function Footer() {
  return (
    <FooterWrapper>
      <Inner>&copy; {new Date().getFullYear()} Market Dashboard</Inner>
    </FooterWrapper>
  );
}
