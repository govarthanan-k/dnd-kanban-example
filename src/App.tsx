import { ThemeProvider, ThemeToggle } from "@/theme";

import { KanbanBoard } from "@/components/KanbanBoard/KanbanBoard";

import "./App.css";

export const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex min-h-screen flex-col">
          <header className="flex w-full flex-row justify-end p-4">
            <ThemeToggle />
          </header>
          <main className="mx-4 flex flex-col gap-6">
            <KanbanBoard />
          </main>
        </div>
      </ThemeProvider>
    </>
  );
};
