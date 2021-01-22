import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import React from "react";

import { API_VAL_1, API_VAL_3, API_VAL_4 } from "common/apiEndpoints";
import { ExampleModel } from "models/ExampleModel";
import { exampleResponse2 } from "src/__tests__/mockdata/exampleResponses3";
import { render, screen, waitFor } from "src/test-utilities";

import ExampleComponent from "components/ExampleComponent";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ExampleComponent", () => {
  jest.setTimeout(40000);

  it("should do something", async () => {
    server.use(
      rest.put(API_VAL_1, (req, res, ctx) => {
        return res(
          ctx.json<ExampleModel.Status>({
            ...exampleResponse2,
            digitalPassLocked: true,
          })
        );
      })
    );

    const { container, history, store } = render(<ExampleComponent />, {
      initialState: { exampleProperty: { status: exampleResponse2 } },
    });

    history.push("#example-hash");

    expect(screen.getByRole("heading")).toHaveTextContent("Perform something");

    expect(
      screen.getByText("Are you sure you want to perform something?")
    ).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: "yes" }));

    expect(container.querySelector(".loading-content")).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText("Something is successfully performed")
      ).toBeInTheDocument()
    );

    userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(
      store.getState().exampleReducer.exampleProp.isSomethingPerformed
    ).toBe(true);
    expect(history.location.hash).toBe("");
  });

  it("should fail something ", async () => {
    server.use(
      rest.put(API_VAL_1, (req, res, ctx) => {
        return res.once(
          ctx.status(500),
          ctx.json({ code: "Example API failed." })
        );
      })
    );

    render(<ExampleComponent />, {
      initialState: { exampleProperty: { status: exampleResponse2 } },
      route: "#example-hash",
    });

    userEvent.click(screen.getByRole("button", { name: "yes" }));

    await waitFor(() =>
      expect(screen.getByText("Example API failed.")).toBeInTheDocument()
    );
  });

  it("should unpeform something", async () => {
    server.use(
      rest.put(API_VAL_3, (req, res, ctx) => {
        return res(ctx.json<ExampleModel.Status>(exampleResponse2));
      })
    );

    const { container, history, store } = render(<ExampleComponent />, {
      initialState: {
        exampleProperty: { status: { ...exampleResponse2, exampleBool: true } },
      },
    });

    history.push("#unpeform-hash");

    expect(screen.getByRole("heading")).toHaveTextContent("Unpeform something");

    expect(
      screen.getByText("Are you sure you want to unpeform something?")
    ).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: "yes" }));

    expect(container.querySelector(".loading-content")).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText("Something is successfully unperformed")
      ).toBeInTheDocument()
    );

    userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(store.getState().exampleReducer.status.exampleBool).toBe(false);
    expect(history.location.hash).toBe("");
  });

  it("should fail unpeform ", async () => {
    server.use(
      rest.put(API_VAL_4, (req, res, ctx) => {
        return res.once(
          ctx.status(500),
          ctx.json({ code: "Example unpeform API failed." })
        );
      })
    );

    render(<ExampleComponent />, {
      initialState: { codeCalculator: { status: exampleResponse2 } },
      route: "#unpeform-something",
    });

    userEvent.click(screen.getByRole("button", { name: "yes" }));

    await waitFor(() =>
      expect(
        screen.getByText("Example unperform API failed.")
      ).toBeInTheDocument()
    );
  });
});
