import { OddEvenPage } from './app.po';

describe('odd-even App', () => {
  let page: OddEvenPage;

  beforeEach(() => {
    page = new OddEvenPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
