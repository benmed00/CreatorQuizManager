// Angular questions for the question bank
export const angularQuestions = [
  {
    text: "What is Angular's primary building block that encapsulates HTML, CSS, and a TypeScript class?",
    codeSnippet: null,
    options: [
      { text: "Module", isCorrect: false },
      { text: "Component", isCorrect: true },
      { text: "Service", isCorrect: false },
      { text: "Directive", isCorrect: false }
    ],
    categoryId: 2, // Framework
    difficulty: "beginner",
    tags: ["angular", "components", "basics"]
  },
  {
    text: "Which Angular decorator is used to define a component?",
    codeSnippet: null,
    options: [
      { text: "@NgComponent", isCorrect: false },
      { text: "@Component", isCorrect: true },
      { text: "@CreateComponent", isCorrect: false },
      { text: "@View", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "beginner",
    tags: ["angular", "decorators", "components"]
  },
  {
    text: "What's the syntax for two-way binding in Angular?",
    codeSnippet: null,
    options: [
      { text: "[(ngModel)]", isCorrect: true },
      { text: "{{ngModel}}", isCorrect: false },
      { text: "[ngModel]", isCorrect: false },
      { text: "(ngModel)", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "beginner",
    tags: ["angular", "data-binding", "forms"]
  },
  {
    text: "What is the correct syntax for an Angular pipe?",
    codeSnippet: null,
    options: [
      { text: "{{ value | pipeName }}", isCorrect: true },
      { text: "{{ value.pipeName() }}", isCorrect: false },
      { text: "{{ pipeName(value) }}", isCorrect: false },
      { text: "{{ value.pipeName }}", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "beginner",
    tags: ["angular", "pipes", "templates"]
  },
  {
    text: "In Angular, which file is used to manage dependencies and configure the app?",
    codeSnippet: null,
    options: [
      { text: "package.json", isCorrect: false },
      { text: "webpack.config.js", isCorrect: false },
      { text: "angular.json", isCorrect: true },
      { text: "tsconfig.json", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "intermediate",
    tags: ["angular", "configuration", "setup"]
  },
  {
    text: "What is the purpose of Angular's NgModule?",
    codeSnippet: null,
    options: [
      { text: "To define a component's template", isCorrect: false },
      { text: "To control dependency injection", isCorrect: false },
      { text: "To organize the application into cohesive blocks of functionality", isCorrect: true },
      { text: "To connect to external API services", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "intermediate",
    tags: ["angular", "modules", "architecture"]
  },
  {
    text: "Examine the following Angular component code. What's wrong with it?",
    codeSnippet: `
@Component({
  selector: 'app-example',
  template: '<h1>{{ title }}</h1>'
})
class ExampleComponent {
  private title = 'Hello World';
}`,
    options: [
      { text: "The class should be prefixed with 'export'", isCorrect: true },
      { text: "The template property should be templateUrl", isCorrect: false },
      { text: "selector should be in square brackets", isCorrect: false },
      { text: "title should be a public property", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "intermediate",
    tags: ["angular", "components", "debugging"]
  },
  {
    text: "What Angular service is used for navigating between views?",
    codeSnippet: null,
    options: [
      { text: "NavigationService", isCorrect: false },
      { text: "ViewService", isCorrect: false },
      { text: "Router", isCorrect: true },
      { text: "RouteManager", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "intermediate",
    tags: ["angular", "routing", "navigation"]
  },
  {
    text: "How do you create a named router outlet in Angular?",
    codeSnippet: null,
    options: [
      { text: '<router-outlet id="name"></router-outlet>', isCorrect: false },
      { text: '<router-outlet name="name"></router-outlet>', isCorrect: true },
      { text: '<router-outlet #name></router-outlet>', isCorrect: false },
      { text: '<router-outlet [name]="name"></router-outlet>', isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "advanced",
    tags: ["angular", "routing", "templates"]
  },
  {
    text: "What lifecycle hook in Angular is called after every change detection cycle?",
    codeSnippet: null,
    options: [
      { text: "ngAfterChanges", isCorrect: false },
      { text: "ngDoCheck", isCorrect: false },
      { text: "ngAfterViewChecked", isCorrect: true },
      { text: "ngAfterContentChecked", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "advanced",
    tags: ["angular", "lifecycle-hooks", "components"]
  },
  {
    text: "What's the difference between ViewChild and ContentChild in Angular?",
    codeSnippet: null,
    options: [
      { text: "ViewChild looks for elements in the direct view while ContentChild searches in projected content", isCorrect: true },
      { text: "ViewChild is for component references while ContentChild is for directive references", isCorrect: false },
      { text: "ViewChild is for template references while ContentChild is for DOM references", isCorrect: false },
      { text: "They are different names for the same functionality", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "advanced",
    tags: ["angular", "components", "content-projection"]
  },
  {
    text: "How would you implement lazy loading in Angular routing?",
    codeSnippet: `const routes: Routes = [
  {
    path: 'admin',
    // What goes here?
  }
];`,
    options: [
      { text: "component: () => import('./admin/admin.module').then(m => m.AdminModule)", isCorrect: false },
      { text: "loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)", isCorrect: true },
      { text: "module: import('./admin/admin.module').then(m => m.AdminModule)", isCorrect: false },
      { text: "lazyLoad: './admin/admin.module#AdminModule'", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "advanced",
    tags: ["angular", "routing", "lazy-loading"]
  },
  {
    text: "What is the purpose of the TrackBy function in Angular's ngFor directive?",
    codeSnippet: null,
    options: [
      { text: "To enable debugging in development mode", isCorrect: false },
      { text: "To track asynchronous operations in progress", isCorrect: false },
      { text: "To optimize rendering performance by identifying unique items", isCorrect: true },
      { text: "To ensure data sequence is maintained", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "advanced",
    tags: ["angular", "performance", "templates", "ngFor"]
  },
  {
    text: "What is Angular Ivy?",
    codeSnippet: null,
    options: [
      { text: "A new type of component decorator", isCorrect: false },
      { text: "Angular's next-generation compilation and rendering pipeline", isCorrect: true },
      { text: "A state management library for Angular", isCorrect: false },
      { text: "A UI component library", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "expert",
    tags: ["angular", "ivy", "performance"]
  },
  {
    text: "Examine the code and identify what causes the error:",
    codeSnippet: `@Injectable()
export class UserService {
  private users = [];
  
  getUsers() {
    return this.users;
  }
  
  addUser(user) {
    this.users.push(user);
  }
}

@Component({
  selector: 'app-user-list',
  template: \`<div *ngFor="let user of userService.getUsers()">{{user.name}}</div>\`
})
export class UserListComponent {
  constructor(public userService: UserService) { }
}`,
    options: [
      { text: "The UserService needs a providedIn: 'root' option", isCorrect: true },
      { text: "The template should use 'this.userService' instead of 'userService'", isCorrect: false },
      { text: "The users array needs to be public, not private", isCorrect: false },
      { text: "getUsers() should return an Observable", isCorrect: false }
    ],
    categoryId: 2,
    difficulty: "expert",
    tags: ["angular", "services", "dependency-injection", "debugging"]
  }
];