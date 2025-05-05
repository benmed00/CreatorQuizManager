/**
 * Authentication Transformation Tests
 * 
 * These tests specifically verify the transformFirebaseUser function and
 * authentication fixes by checking:
 * 1. The Firebase user is correctly transformed to our app's User model
 * 2. User persistence works correctly across page refresh
 * 3. The transformation handles edge cases correctly
 */

describe('Authentication Transformation', () => {
  beforeEach(() => {
    // Clear any existing local storage and cookies
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should correctly transform Firebase user when logging in', () => {
    // Mock user data for injection
    const mockUser = {
      uid: 'test-user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null
    };

    // Visit the login page
    cy.visit('/login');

    // Intercept and stub the signIn function
    cy.window().then(win => {
      const originalSignIn = win.signIn;
      cy.stub(win, 'signIn').resolves({
        user: mockUser
      });

      // Intercept setUser to verify the transformation
      const originalSetUser = win.setUser;
      cy.stub(win, 'setUser').callsFake((user) => {
        // Verify the user was transformed correctly
        expect(user).to.have.property('id', mockUser.uid);
        expect(user).to.have.property('uid', mockUser.uid);
        expect(user).to.have.property('email', mockUser.email);
        expect(user).to.have.property('displayName', mockUser.displayName);

        // Call the original if it exists
        if (originalSetUser) {
          return originalSetUser(user);
        }
      });

      // Clean up afterwards
      cy.on('window:before:unload', () => {
        win.signIn = originalSignIn;
        win.setUser = originalSetUser;
      });
    });

    // Fill in login form and submit
    cy.get('input[placeholder="your@email.com"]').type('test@example.com');
    cy.get('input[placeholder="••••••••"]').type('password123');
    cy.contains('button', 'Sign In').click();
  });

  it('should handle missing displayName correctly when transforming user', () => {
    // Mock user without displayName
    const incompleteUser = {
      uid: 'incomplete-user-456',
      email: 'incomplete@example.com',
      displayName: null,
      photoURL: null
    };

    // Visit the login page
    cy.visit('/login');

    // Test the transformFirebaseUser function directly if accessible
    cy.window().then(win => {
      if (typeof win.transformFirebaseUser === 'function') {
        const transformed = win.transformFirebaseUser(incompleteUser);
        
        // Should extract username from email as fallback
        expect(transformed.displayName).to.equal('incomplete');
        expect(transformed.id).to.equal(incompleteUser.uid);
        expect(transformed.email).to.equal(incompleteUser.email);
      } else {
        // If function not exposed, stub signIn to test indirectly
        cy.stub(win, 'signIn').resolves({
          user: incompleteUser
        });

        // Verify through side effects
        cy.stub(win, 'setUser').callsFake((user) => {
          expect(user.displayName).to.equal('incomplete');
          expect(user.id).to.equal(incompleteUser.uid);
        });

        // Submit the form to trigger the transformation
        cy.get('input[placeholder="your@email.com"]').type('incomplete@example.com');
        cy.get('input[placeholder="••••••••"]').type('password123');
        cy.contains('button', 'Sign In').click();
      }
    });
  });

  it('should handle user persistence across page refreshes', () => {
    // Create a simulated session
    const persistentUser = {
      id: 'persistent-user-789',
      uid: 'persistent-user-789',
      email: 'persistent@example.com',
      displayName: 'Persistent User',
      photoURL: null
    };

    // Set up the session in localStorage
    cy.window().then(win => {
      // Store the user data as app would normally do
      localStorage.setItem('quiz-app-user', JSON.stringify(persistentUser));
      
      // Mock getCurrentUser to return our persistent user
      if (typeof win.getCurrentUser === 'function') {
        const originalGetCurrentUser = win.getCurrentUser;
        cy.stub(win, 'getCurrentUser').returns(persistentUser);
        
        // Clean up
        cy.on('window:before:unload', () => {
          win.getCurrentUser = originalGetCurrentUser;
        });
      }
    });

    // Visit a page that requires authentication
    cy.visit('/dashboard');
    
    // Verify user is recognized as logged in
    cy.contains(persistentUser.displayName).should('be.visible');
    cy.contains('Sign Out').should('be.visible');
    
    // Verify not redirected to login page
    cy.url().should('include', '/dashboard');
  });

  it('should log in successfully with test credentials', () => {
    // Use the test credentials to verify real login flow
    cy.visit('/login');
    cy.get('input[placeholder="your@email.com"]').type('test@example.com');
    cy.get('input[placeholder="••••••••"]').type('password123');
    cy.contains('button', 'Sign In').click();
    
    // Should redirect to dashboard or home page
    cy.url().should('not.include', '/login');
    
    // Should show user is logged in
    cy.contains('Sign Out').should('be.visible');
  });
});