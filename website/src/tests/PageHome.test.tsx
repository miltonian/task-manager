import React from "react";
import { PageHome } from "../pages/PageHome";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import moment from "moment";
import { formatDueDate } from "../components/TaskListItem";
import { prepAll, replaceFetch } from "../helpers/test-helpers";
import pretty from "pretty";

export const DEFAULT_TASK: TaskAPI.UpdateTaskRequest = {
  id: 1,
  name: "Default Task",
  description: "Some description",
  status: "New",
  dueDate: moment().add(7).format("YYYY-MM-DD"),
};

describe("PageHome tests", () => {
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

  describe("List Item display data", () => {
    test("Renders All List Items", async () => {
      replaceFetch([DEFAULT_TASK, DEFAULT_TASK, DEFAULT_TASK]);
      await act(async () => {
        render(<PageHome />, container);
      });

      expect(pretty(container?.innerHTML || "")).toMatchInlineSnapshot();
    });

    test("Displays correct content - Name", async () => {
      replaceFetch([DEFAULT_TASK, DEFAULT_TASK, DEFAULT_TASK]);

      await act(async () => {
        render(<PageHome />, container);
      });

      const listItem = container?.querySelector(".ant-list-item");

      expect(listItem?.textContent).toContain(DEFAULT_TASK.name);

      (global.fetch as any).mockClear();
    });

    test("Displays correct content - Due Date", async () => {
      replaceFetch([DEFAULT_TASK, DEFAULT_TASK, DEFAULT_TASK]);

      await act(async () => {
        render(<PageHome />, container);
      });

      const listItem = container?.querySelector(".ant-list-item");

      expect(listItem?.textContent).toContain(
        formatDueDate(DEFAULT_TASK.dueDate)
      );

      (global.fetch as any).mockClear();
    });
    test("Displays correct content - Description", async () => {
      replaceFetch([DEFAULT_TASK, DEFAULT_TASK, DEFAULT_TASK]);

      await act(async () => {
        render(<PageHome />, container);
      });

      const listItem = container?.querySelector(".ant-list-item");

      expect(listItem?.textContent).toContain(DEFAULT_TASK.description);

      (global.fetch as any).mockClear();
    });
  });
});
