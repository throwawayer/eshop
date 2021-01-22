import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import React from "react";

import { API_VAL_1, API_VAL_2, API_VAL_3 } from "common/apiEndpoints";
import { ExampleEnum } from "common/constants";
import { withParams } from "common/functions";
import initialState, {
  exampleResponse1,
  exampleResponse2,
  exampleResponse3,
  exampleResponse4,
  exampleResponse5,
  exampleResponse6,
  exampleResponse7,
  exampleResponse8,
  exampleResponse9,
} from "src/__tests__/mockdata/exampleResponses";
import { render, screen, waitFor, within } from "src/test-utilities";

import ExampleComponent from "components/ExampleComponent";

const lang = "EN";
const id = 3;
const someId = 9;
const routePath = "/:country/:locale/example/:contract";
const route = `/ee/en/example/${someId}#example-hash`;

const server = setupServer(
  rest.get(withParams(API_VAL_2, { userId: id }), (req, res, ctx) =>
    res(ctx.json(exampleResponse1))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("<ExampleComponent />", () => {
  it("loads and displays ExampleComponent", async () => {
    const { container } = render(<ExampleComponent />, {
      routePath,
      route,
      initialState,
    });

    expect(container.querySelector(".loading-content")).toBeInTheDocument();
    await waitFor(() => {
      const headers = screen.getAllByRole("heading");

      expect(headers).toHaveLength(2);
      const exampleHeader = headers[headers.length - 1];

      expect(exampleHeader).toHaveTextContent("Example User");
    });

    const table = screen.getByRole("table");

    expect(table).toBeInTheDocument();

    const cells = within(table).getAllByRole("cell");

    ["SomeVal1", "SomeVal2"].forEach((cell, i) => {
      expect(cells[i]).toHaveTextContent(cell);
    });

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(5);

    ["", "SomeHeader1", "SomeHeader2", "SomeHeader3", "SomeHeader4"].forEach(
      (text, i) => {
        expect(buttons[i]).toHaveTextContent(text);
      }
    );
  });

  it("handles Something for successful case", async () => {
    render(<ExampleComponent />, {
      routePath,
      route,
      initialState,
    });

    await waitFor(() => expect(screen.getAllByRole("button")).toHaveLength(5));

    const [, someButton, , , anotherButton] = screen.getAllByRole("button");

    userEvent.click(someButton);
    expect(someButton).toHaveClass("some-class on");
    userEvent.click(anotherButton);

    const exampleMethod = ExampleEnum.SOME_ENUM;

    server.use(
      rest.post(
        withParams(API_VAL_1, { id, someId, exampleMethod, lang }),
        (req, res, ctx) => res.once(ctx.status(200), ctx.json(exampleResponse7))
      ),
      rest.put(
        withParams(API_VAL_3, { id, someId, exampleMethod, lang }),
        (req, res, ctx) => res(ctx.status(200), ctx.json(exampleResponse9))
      )
    );

    await waitFor(() => expect(screen.getByText("foo")).toBeInTheDocument());
    await waitFor(() =>
      expect(
        screen.getByText("Something is successfully performed")
      ).toBeInTheDocument()
    );
  });

  it("handles Something for failed case", async () => {
    render(<ExampleComponent />, {
      routePath,
      route,
      initialState,
    });

    await waitFor(() => expect(screen.getAllByRole("button")).toHaveLength(5));

    const [, someButton, , , anotherButton] = screen.getAllByRole("button");

    userEvent.click(someButton);
    expect(someButton).toHaveClass("some-class on");
    userEvent.click(anotherButton);

    const exampleMethod = ExampleEnum.SOME_ENUM;

    server.use(
      rest.post(
        withParams(API_VAL_1, {
          id,
          someId,
          exampleMethod,
          lang,
        }),
        (req, res, ctx) => res.once(ctx.status(200), ctx.json(exampleResponse7))
      ),
      rest.put(
        withParams(API_VAL_3, {
          id,
          someId,
          exampleMethod,
          lang,
        }),
        (req, res, ctx) => res(ctx.status(200), ctx.json(exampleResponse4))
      )
    );

    await waitFor(() =>
      expect(
        screen.getByText("Some service unavailable.")
      ).toBeInTheDocument()
    );
  });
});
