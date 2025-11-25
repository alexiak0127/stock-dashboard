"use client";

import Link from "next/link";
import styled from "styled-components";

const Header = styled.header`
  position: sticky;        
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #020824;
`;

const Inner = styled.div`
  max-width: 1650px;
  margin: 0 auto;
  padding: 1.1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoImage = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 12px;
  object-fit: cover;
`;

const Title = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 1.1rem;
  margin-left: auto;
`;

const NavLink = styled(Link)`
  color: #e5e7eb;
  text-decoration: none;

  &:hover {
    color: #ffffff;
    transform: scale(1.05);
  }
`;

export function Navbar() {
  return (
    <Header>
      <Inner>
        <Logo>
          <LogoImage src="/logo.png" alt="Market Dashboard logo" />
          <Title>Market Dashboard</Title>
        </Logo>
        <NavLinks>
          <NavLink href="/search">Search</NavLink>
          <NavLink href="/watchlist">Watchlist</NavLink>
          <NavLink href="/about">About</NavLink>
        </NavLinks>
      </Inner>
    </Header>
  );
}
