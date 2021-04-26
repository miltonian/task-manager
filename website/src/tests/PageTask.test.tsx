import React from "react";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import moment from "moment";
import { formatDueDate } from "../components/TaskListItem";
import { prepAll, replaceFetch } from "../helpers/test-helpers";
import pretty from "pretty";
import { PageTask } from "../pages/PageTask";
import { DEFAULT_TASK } from "./PageHome.test";

describe("PageTask tests", () => {
  let container: HTMLDivElement | null = null;

  prepAll();

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    global.fetch = jest.fn().mockImplementation(() => {
      Promise.resolve();
    });
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
    }
    container = null;
  });

  describe("Displays all inputs", () => {
    test("Renders All List Items", async () => {
      await act(async () => {
        render(
          <PageTask
            match={{
              params: { taskId: "new" },
              isExact: false,
              path: "",
              url: "",
            }}
          />,
          container
        );
      });

      expect(pretty(container?.innerHTML || "")).toMatchInlineSnapshot();
    });
  });

  test("Displays correct content - Name", async () => {
    replaceFetch(DEFAULT_TASK);

    await act(async () => {
      render(
        <PageTask
          match={{
            params: { taskId: "1" },
            isExact: false,
            path: "",
            url: "",
          }}
        />,
        container
      );
    });

    const inputs = Object.values(container?.querySelectorAll('input') || []);
    const containsValue = inputs.some(i=>i.value===DEFAULT_TASK.name);
    expect(containsValue).toEqual(true);

    (global.fetch as any).mockClear();
  });

  test("Displays correct content - Due Date", async () => {
    replaceFetch(DEFAULT_TASK);

    await act(async () => {
      render(
        <PageTask
          match={{
            params: { taskId: "1" },
            isExact: false,
            path: "",
            url: "",
          }}
        />,
        container
      );
    });


    const inputs = Object.values(container?.querySelectorAll('input') || []);
    const containsValue = inputs.some(i=>i.value===DEFAULT_TASK.dueDate);
    expect(containsValue).toEqual(true);

    (global.fetch as any).mockClear();
  });

  test("Displays correct content - Description", async () => {
    replaceFetch(DEFAULT_TASK);

    await act(async () => {
      render(
        <PageTask
          match={{
            params: { taskId: "1" },
            isExact: false,
            path: "",
            url: "",
          }}
        />,
        container
      );
    });

    const inputs = Object.values(container?.querySelectorAll('textarea') || []);
    const containsValue = inputs.some(i=>i.value===DEFAULT_TASK.description);
    expect(containsValue).toEqual(true);

    (global.fetch as any).mockClear();
  });
});
