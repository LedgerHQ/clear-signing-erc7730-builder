export default function DeprecatedPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "#0a0a0a",
        color: "#f0f0f0",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
        This service has been deprecated
      </h1>
      <p
        style={{
          fontSize: "1.125rem",
          color: "#a0a0a0",
          marginBottom: "2rem",
          maxWidth: "480px",
        }}
      >
        Please visit the Ledger Developer Portal for up-to-date documentation
        and resources.
      </p>
      <a
        href="https://developers.ledger.com"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.75rem",
          backgroundColor: "#ffffff",
          color: "#0a0a0a",
          borderRadius: "6px",
          fontWeight: 600,
          textDecoration: "none",
          fontSize: "1rem",
        }}
      >
        Go to developers.ledger.com
      </a>
    </div>
  );
}
