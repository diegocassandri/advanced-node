const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("Test that the blog creation form route is working", async () => {
    // 1. launch 2. login 3. go to /blogs and click '+' 4. use selector to exect value
    await page.login();
    await page.click("a.red");
    const text = await page.getContentsOf("div.title label");
    expect(text).toEqual("Blog Title");
  });

  describe("using valid inputs", async () => {
    beforeEach(async () => {
      await page.type('[name="title"]', "Meu primeiro post");
      await page.type('[name="content"]', "Meu primeiro ipsum lorem");
      await page.click("form button");
      await page.waitFor("button.green");
    });

    test("subitting takes user to review page", async () => {
      const titleText = await page.getContentsOf("h5");
      expect(titleText).toEqual("Please confirm your entries");
    });
    test("saving takes user to main blog page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");
      const url = await page.url();
      expect(url).toEqual("http://localhost:3000/blogs");

      const title = await page.getContentsOf(".card-title");
      expect(title).toEqual("Meu primeiro post");
    });
  });

  describe("using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("the form show an error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");

      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

describe("User not logged in", async () => {
  test("cannot create blog post", async () => {
    const result = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "My Title",
          content: "My Content"
        })
      }).then(res => res.json());
    });
    expect(result).toEqual({ error: "You must log in!" });
  });

  test("cannot fetch list of blog posts", async () => {
    const result = await page.evaluate(() => {
      return fetch("api/blogs", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json());
    });
    expect(result).toEqual({ error: "You must log in!" });
  });
});
