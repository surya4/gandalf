import { SimpleCalculatorPage } from './app.po';

describe('simple-calculator App', () => {
  let page: SimpleCalculatorPage;

  beforeEach(() => {
    page = new SimpleCalculatorPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
