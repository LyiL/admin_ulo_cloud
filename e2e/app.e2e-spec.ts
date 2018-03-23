import { MyAnguPage } from './app.po';

describe('my-angu App', () => {
  let page: MyAnguPage;

  beforeEach(() => {
    page = new MyAnguPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
