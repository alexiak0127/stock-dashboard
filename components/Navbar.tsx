"use client";
// Navigation bar component by Alexia Kim
// Conditional rendering by Charles Yao

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import styled from "styled-components";

// Sticky header
const Header = styled.header`
  position: sticky;        
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #020824;
`;

// Container for navbar content
const Inner = styled.div`
  max-width: 1650px;
  margin: 0 auto;
  padding: 1.1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

// Logo container
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// Styled logo image - wrapping next/image for proper SSR
const LogoImage = styled(Image)`
  height: 40px;
  width: 40px;
  border-radius: 12px;
  object-fit: cover;
`;

// Dashboard title text styling
const Title = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #e5e7eb;
`;

// Navigation links container
const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 1.1rem;
  margin-left: auto;
  flex-wrap: wrap;
`;

// Individual navigation link
const NavLink = styled(Link)`
  color: #e5e7eb;
  text-decoration: none;

  &:hover {
    color: #ffffff;
    transform: scale(1.05);
  }
`;

// User profile avatar
const UserAvatar = styled(Image)`
  border-radius: 50%;
  border: 2px solid #d0e3cc;
  cursor: pointer;
`;

export function Navbar() {
  // Get current user session from NextAuth
  const { data: session } = useSession();
  return (
    <Header>
      <Inner>
        <Link href="/">
          <Logo>
            <LogoImage src="/logo.png" alt="Market Dashboard logo" width={50} height={50} />
            <Title>Market Dashboard</Title>
          </Logo>
        </Link>
        <NavLinks>
          {/* Search link visible to all users */}
          <NavLink href="/search">Search</NavLink>

          {/* Only show Favorites link when user is logged in - Charles */}
          {session?.user && (
            <NavLink href={`/user/${session.user.id}/favorites`}>Favorites</NavLink>
          )}

          {/* Show user avatar if logged in, otherwise show Sign In button */}
          {session?.user ? (
            // Logged in: Show user avatar that links to their profile page
            <Link href={`/user/${session.user.id}`}>
              <UserAvatar
                src={session.user.image || "/default-avatar.png"}
                alt={session.user.name || "User"}
                width={40}
                height={40}
              />
            </Link>
          ) : (
            // Not logged in: Show Sign In button that redirects to login page
            <Link
              href="/login"
              className="bg-white text-black py-2 px-5 rounded-lg font-semibold no-underline hover:brightness-105 transition-all"
            >Sign In</Link>
          )}
        </NavLinks>
      </Inner>
    </Header>
  );
}
