import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "oklch(1 0 0)" },
        { name: "dark",  value: "oklch(0.145 0 0)" },
      ],
    },
    viewport: {
      viewports: {
        mobile:  { name: "Mobile",  styles: { width: "390px",  height: "844px" } },
        tablet:  { name: "Tablet",  styles: { width: "768px",  height: "1024px" } },
        desktop: { name: "Desktop", styles: { width: "1280px", height: "800px" } },
      },
    },
  },
};

export default preview;
