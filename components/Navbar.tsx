"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
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

const UserAvatar = styled(Image)`
  border-radius: 50%;
  border: 2px solid #d0e3cc;
  cursor: pointer;
`;

export function Navbar() {
  const { data: session } = useSession();

  return (
    <Header>
      <Inner>
        <Link href="/">
          <Logo>
            <LogoImage src="/logo.png" alt="Market Dashboard logo" />
            <Title>Market Dashboard</Title>
          </Logo>
        </Link>
        <NavLinks>
          {session?.user ? (
            <Link href={`/user/${session.user.id || session.user.email}`}>
              <UserAvatar
                src={session.user.image || "/default-avatar.png"}
                alt={session.user.name || "User"}
                width={40}
                height={40}
              />
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="bg-white text-black py-2 px-5 rounded-lg font-semibold no-underline hover:brightness-105 transition-all"
            >Sign In</Link>
          )}
          <NavLink href="/search">Search</NavLink>
          
          {/* Only show Favorites link when user is logged in */}
          {session?.user && (
            <NavLink href={`/user/${session.user.id || session.user.email}/favorites`}>Favorites</NavLink>
          )}
        </NavLinks>
      </Inner>
    </Header>
  );
}
