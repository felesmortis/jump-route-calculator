import { JumpRouteCalculatorPage } from './app.po';

describe('jump-route-calculator App', () => {
  let page: JumpRouteCalculatorPage;

  beforeEach(() => {
    page = new JumpRouteCalculatorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
