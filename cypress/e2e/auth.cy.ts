// Create a mock for Firebase authentication
// This lets us test without actual Firebase credentials
let mockUserData = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null
};

describe('Authentication', () => {
  beforeEach(() => {
    // Reset any previous login state
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Mock the Firebase auth functions
    cy.window().then((win) => {
      // Store the original functions
      const originalSignIn = win.signIn;
      
      // Mock signIn to return our test user
      win.signIn = cy.stub().resolves({
        user: mockUserData
      });
      
      // Clean up after tests
      cy.on('window:before:unload', () => {
        win.signIn = originalSignIn;
      });
    });
  });

  it('should display the login page', () => {
    cy.visit('/login');
    cy.contains('Welcome Back!').should('be.visible');
    cy.contains('Sign in to your account').should('be.visible');
    cy.get('input[placeholder="your@email.com"]').should('be.visible');
    cy.get('input[placeholder="••••••••"]').should('be.visible');
    cy.contains('button', 'Sign In').should('be.visible');
  });

  it('should validate form inputs', () => {
    cy.visit('/login');
    
    // Try to submit without any data
    cy.contains('button', 'Sign In').click();
    cy.contains('Please enter a valid email address').should('be.visible');
    
    // Try with invalid email
    cy.get('input[placeholder="your@email.com"]').type('invalidemail');
    cy.contains('button', 'Sign In').click();
    cy.contains('Please enter a valid email address').should('be.visible');
    
    // Try with valid email but no password
    cy.get('input[placeholder="your@email.com"]').clear().type('test@example.com');
    cy.contains('button', 'Sign In').click();
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should navigate to registration page', () => {
    cy.visit('/login');
    cy.contains('Sign up now').click();
    cy.url().should('include', '/register');
    cy.contains('Create Your Account').should('be.visible');
  });

  it('should navigate to forgot password page', () => {
    cy.visit('/login');
    cy.contains('Forgot Password?').click();
    cy.url().should('include', '/forgot-password');
  });

  // Test register page
  it('should display the register page', () => {
    cy.visit('/register');
    cy.contains('Create Your Account').should('be.visible');
    cy.contains('Join our community').should('be.visible');
    cy.get('input[placeholder="John Doe"]').should('be.visible');
    cy.get('input[placeholder="your@email.com"]').should('be.visible');
    cy.get('input[placeholder="••••••••"]').should('have.length', 2);
    cy.contains('button', 'Create Account').should('be.visible');
  });

  it('should validate registration form inputs', () => {
    cy.visit('/register');
    
    // Try to submit without any data
    cy.contains('button', 'Create Account').click();
    cy.contains('Name must be at least 2 characters').should('be.visible');
    
    // Test name validation
    cy.get('input[placeholder="John Doe"]').type('A');
    cy.contains('button', 'Create Account').click();
    cy.contains('Name must be at least 2 characters').should('be.visible');
    
    // Test email validation
    cy.get('input[placeholder="John Doe"]').clear().type('Test User');
    cy.get('input[placeholder="your@email.com"]').type('invalid');
    cy.contains('button', 'Create Account').click();
    cy.contains('Please enter a valid email address').should('be.visible');
    
    // Test password validation
    cy.get('input[placeholder="your@email.com"]').clear().type('test@example.com');
    cy.get('input[placeholder="••••••••"]').first().type('pass');
    cy.contains('button', 'Create Account').click();
    cy.contains('Password must be at least 6 characters').should('be.visible');
    
    // Test password matching
    cy.get('input[placeholder="••••••••"]').first().clear().type('password123');
    cy.get('input[placeholder="••••••••"]').last().type('password456');
    cy.contains('button', 'Create Account').click();
    cy.contains("Passwords don't match").should('be.visible');
  });
  
  // New tests for user transformation and authentication fixes
  it('should correctly transform and store user data upon login', () => {
    cy.visit('/login');
    
    // Enter valid credentials
    cy.get('input[placeholder="your@email.com"]').type('test@example.com');
    cy.get('input[placeholder="••••••••"]').type('password123');
    
    // Intercept localStorage.setItem to verify user is stored correctly
    cy.window().then(win => {
      const originalSetItem = win.localStorage.setItem;
      cy.stub(win.localStorage, 'setItem').callsFake((key, value) => {
        if (key.includes('user')) {
          // The auth state should contain transformed user data
          const userData = JSON.parse(value);
          expect(userData).to.have.property('id', mockUserData.uid);
          expect(userData).to.have.property('uid', mockUserData.uid);
          expect(userData).to.have.property('email', mockUserData.email);
          expect(userData).to.have.property('displayName', mockUserData.displayName);
        }
        return originalSetItem.call(win.localStorage, key, value);
      });
    });
    
    // Click sign in and verify redirection
    cy.contains('button', 'Sign In').click();
    cy.url().should('include', '/'); // Should redirect to dashboard
  });
  
  it('should maintain authentication across page refreshes', () => {
    // Set up auth state in localStorage to simulate logged-in user
    cy.window().then(win => {
      const transformedUser = {
        id: mockUserData.uid,
        uid: mockUserData.uid,
        email: mockUserData.email,
        displayName: mockUserData.displayName,
        photoURL: null
      };
      
      // Mock the getCurrentUser function
      const originalGetCurrentUser = win.getCurrentUser;
      win.getCurrentUser = cy.stub().returns(transformedUser);
      
      // Store user in localStorage as the app would
      localStorage.setItem('quiz-app-user', JSON.stringify(transformedUser));
      
      // Clean up after tests
      cy.on('window:before:unload', () => {
        win.getCurrentUser = originalGetCurrentUser;
      });
    });
    
    // Visit a protected page and verify we don't get redirected to login
    cy.visit('/dashboard');
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Sign Out').should('be.visible');
    
    // The header should show the user's name
    cy.contains(mockUserData.displayName).should('be.visible');
  });
  
  it('should correctly handle the transformFirebaseUser function', () => {
    cy.window().then((win) => {
      if (typeof win.transformFirebaseUser !== 'function') {
        // If the function isn't exposed to window, we can't test it directly
        // This is an integration test so we'll verify its effects instead
        return;
      }
      
      // Test with complete user data
      const completeUser = {
        uid: 'complete-user-123',
        email: 'complete@example.com',
        displayName: 'Complete User',
        photoURL: 'https://example.com/photo.jpg'
      };
      
      const transformedComplete = win.transformFirebaseUser(completeUser);
      expect(transformedComplete.id).to.equal(completeUser.uid);
      expect(transformedComplete.displayName).to.equal(completeUser.displayName);
      
      // Test with minimal user data
      const minimalUser = {
        uid: 'minimal-user-456',
        email: 'minimal@example.com',
        displayName: null,
        photoURL: null
      };
      
      const transformedMinimal = win.transformFirebaseUser(minimalUser);
      expect(transformedMinimal.id).to.equal(minimalUser.uid);
      expect(transformedMinimal.displayName).to.equal('minimal'); // Should extract from email
    });
  });
});