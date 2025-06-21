import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: linear-gradient(45deg, #646cff, #535bf2);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? 'white' : 'rgba(255, 255, 255, 0.8)')};
  text-decoration: none;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Main = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
`;

const Footer = styled.footer`
  background-color: #f3f4f6;
  color: #6b7280;
  text-align: center;
  padding: 2rem;
  margin-top: auto;
`;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'Sobre' },
    { path: '/contact', label: 'Contato' },
  ];

  return (
    <LayoutContainer>
      <Header>
        <Nav>
          <Logo to="/">🚀 Phobos</Logo>
          <NavLinks>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                $active={location.pathname === item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </NavLinks>
        </Nav>
      </Header>

      <Main>{children}</Main>

      <Footer>
        <p>&copy; 2024 Phobos App. Criado com React Router.</p>
      </Footer>
    </LayoutContainer>
  );
}; 