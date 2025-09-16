import { render, screen } from "@testing-library/react";
import React from "react";
import { test, expect } from "@playwright/test";

test("renders headline", () => {
  render(<h1>Elevate for Humanity</h1>);
  expect(screen.getByText(/Elevate for Humanity/i)).toBeInTheDocument();
});

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Elevate for Humanity/i);
});