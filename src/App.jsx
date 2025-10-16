function App() {
  return (
    <ErrorBoundary>
      <SkipLinkComponent targetId="main-content" />
      <main id="main-content" tabIndex="-1">
        <RouteRenderer />
      </main>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            padding: "6px 10px",
            fontSize: "12px",
            textAlign: "center",
            borderRadius: "20px",
          },
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
