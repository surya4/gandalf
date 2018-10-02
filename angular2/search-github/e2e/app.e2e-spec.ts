import { SearchGithubPage } from './app.po';

describe('search-github App', () => {
  let page: SearchGithubPage;

  beforeEach(() => {
    page = new SearchGithubPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
