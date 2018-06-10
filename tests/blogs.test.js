const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("Test that the blog creation form route is working", async () => {
  // 1. launch 2. login 3. go to /blogs and click '+' 4. use selector to exect value
  await page.login();
  await page.goto('localhost:3000/blogs');
  await page.click('a.red');
  const text = await page.getContentsOf('div.title label');
  expect(text).toEqual('Blog Title');
});
