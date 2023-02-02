import Router from './router';

class App {
  private router: Router;

  constructor() {
    this.router = new Router();
  }

  start() {
    this.router.startRouter();
  }
}

export default App;
